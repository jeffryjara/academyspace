import React from 'react';
import {
  CheckCircle2,
  Lock,
  Unlock,
  Radio,
  Plus,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { Course, DeliveryMode } from '../types/curriculum';
import { usePlannerStore } from '../store/usePlannerStore';

interface CourseCardProps {
  course: Course;
  compact?: boolean;
  showPlannerAction?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  compact = false,
  showPlannerAction = false,
}) => {
  const {
    getCourseStatus,
    courseGrades,
    selectedElectives,
    selectElective,
    setSelectedCourseId,
    hoveredCourseId,
    setHoveredCourseId,
    getAncestors,
    getDescendants,
    plannedCourses,
    togglePlannedCourse,
  } = usePlannerStore();

  const status = getCourseStatus(course.id);
  const grade = courseGrades[course.id];
  const isPlanned = plannedCourses.includes(course.id);

  // Check relationship to currently hovered card for reactive dependency highlighting
  const isSelfHovered = hoveredCourseId === course.id;
  const isAncestor = hoveredCourseId ? getAncestors(hoveredCourseId).includes(course.id) : false;
  const isDescendant = hoveredCourseId
    ? getDescendants(hoveredCourseId).includes(course.id)
    : false;
  const isDimmed =
    Boolean(hoveredCourseId) && !isSelfHovered && !isAncestor && !isDescendant;

  // Selected elective display
  const selectedElectiveCode = selectedElectives[course.id];
  const activeElective = course.electiveOptions?.find(
    (opt) => opt.code === selectedElectiveCode
  );

  const getModalityBadge = (mode: DeliveryMode) => {
    switch (mode) {
      case 'P':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60" title="Modalidad Presencial">
            P
          </span>
        );
      case 'V_ASYNC':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/30" title="Modalidad Virtual Asíncrono (*)">
            V*
          </span>
        );
      case 'V_SYNC':
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-sky-500/10 text-sky-300 border border-sky-500/30" title="Modalidad Virtual Síncrono (**)">
            V**
          </span>
        );
    }
  };

  // Status visual configurations
  const getStatusVisuals = () => {
    switch (status) {
      case 'APROBADO':
        return {
          cardBg: 'bg-zinc-900/80 border-emerald-500/40 hover:border-emerald-500/70',
          indicator: (
            <div className="flex items-center gap-1 text-emerald-400" title="Aprobado">
              <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500/20" />
            </div>
          ),
          accentBorder: 'border-l-2 border-l-emerald-500',
        };
      case 'MATRICULADO':
        return {
          cardBg: 'bg-zinc-900/85 border-sky-500/50 shadow-glow-sky',
          indicator: (
            <div className="flex items-center gap-1 text-sky-400" title="Actualmente Matriculado">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            </div>
          ),
          accentBorder: 'border-l-2 border-l-sky-500',
        };
      case 'HABILITADO':
        return {
          cardBg: 'bg-zinc-900/70 border-zinc-700/80 hover:border-amber-500/60 shadow-glow',
          indicator: (
            <div className="flex items-center gap-1 text-amber-400" title="Habilitado para Matrícula">
              <Unlock className="w-3.5 h-3.5" />
            </div>
          ),
          accentBorder: 'border-l-2 border-l-amber-500/80',
        };
      case 'BLOQUEADO':
      default:
        return {
          cardBg: 'bg-zinc-950/60 border-zinc-800/40 opacity-55 hover:opacity-90',
          indicator: (
            <div className="flex items-center gap-1 text-zinc-600" title="Bloqueado por Prerrequisito">
              <Lock className="w-3.5 h-3.5" />
            </div>
          ),
          accentBorder: 'border-l-2 border-l-zinc-800',
        };
    }
  };

  const visuals = getStatusVisuals();

  // Highlight classes based on dependency chain hover
  let chainHighlightClass = '';
  if (isSelfHovered) {
    chainHighlightClass = 'ring-2 ring-amber-400 scale-[1.01] z-20 shadow-xl';
  } else if (isAncestor) {
    chainHighlightClass = 'ring-2 ring-emerald-500 bg-emerald-950/30 scale-[1.01] z-10 shadow-glow-emerald';
  } else if (isDescendant) {
    chainHighlightClass = 'ring-2 ring-sky-500 bg-sky-950/30 scale-[1.01] z-10 shadow-glow-sky';
  } else if (isDimmed) {
    chainHighlightClass = 'opacity-25 grayscale-[30%]';
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent triggering if clicked on inner buttons/selects
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('select')) {
      return;
    }
    setSelectedCourseId(course.id);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setHoveredCourseId(course.id)}
      onMouseLeave={() => setHoveredCourseId(null)}
      className={`group relative flex flex-col justify-between rounded-xl border p-3 cursor-pointer transition-all duration-200 backdrop-blur-md ${visuals.cardBg} ${visuals.accentBorder} ${chainHighlightClass}`}
    >
      {/* Dependency Relationship Tag Tooltip */}
      {isAncestor && (
        <div className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500 text-zinc-950 shadow-md">
          Prerrequisito Inmediato
        </div>
      )}
      {isDescendant && (
        <div className="absolute -top-2.5 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-sky-500 text-zinc-950 shadow-md">
          Curso Desbloqueable
        </div>
      )}

      {/* Top Header: Code, Modality, Status Icon */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold text-zinc-300 group-hover:text-amber-400 transition-colors">
              {course.id}
            </span>
            {getModalityBadge(course.mode)}
          </div>
          <div className="flex items-center gap-1">{visuals.indicator}</div>
        </div>

        {/* Title */}
        <h4 className="text-xs font-medium text-zinc-100 group-hover:text-white line-clamp-2 leading-snug">
          {course.isElective && activeElective ? activeElective.name : course.name}
        </h4>

        {/* Elective Selector Dropdown if applicable */}
        {course.isElective && course.electiveOptions && (
          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
            <select
              value={selectedElectiveCode || course.electiveOptions[0].code}
              onChange={(e) => selectElective(course.id, e.target.value)}
              className="w-full text-[10px] bg-zinc-950 border border-zinc-700/80 rounded px-1.5 py-1 text-amber-300 font-mono focus:outline-none focus:border-amber-500"
            >
              {course.electiveOptions.map((opt) => (
                <option key={opt.code} value={opt.code} className="bg-zinc-900 text-zinc-200">
                  {opt.code} - {opt.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Bottom Footer: Hours, Credits, Grade / Planner Button */}
      <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-1 text-[11px]">
        {/* Hours chip */}
        <div className="font-mono text-[10px] text-zinc-400">
          <span>HT:{course.ht}</span>
          <span className="mx-1 text-zinc-600">•</span>
          <span>HP:{course.hp}</span>
          {course.hl > 0 && (
            <>
              <span className="mx-1 text-zinc-600">•</span>
              <span>HL:{course.hl}</span>
            </>
          )}
        </div>

        {/* Credits & Grade */}
        <div className="flex items-center gap-1 font-mono">
          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold text-[10px] border border-zinc-700/40">
            {course.credits} CR
          </span>
          {status === 'APROBADO' && typeof grade === 'number' && (
            <span className="text-[10px] font-bold text-emerald-400 ml-0.5">
              • Nota: {grade}
            </span>
          )}
        </div>
      </div>

      {/* Simulator Action Quick Toggle Button */}
      {showPlannerAction && status === 'HABILITADO' && (
        <div className="mt-2 pt-1 border-t border-zinc-800/40">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlannedCourse(course.id);
            }}
            className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors ${
              isPlanned
                ? 'bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400'
                : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60'
            }`}
          >
            {isPlanned ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>En Borrador</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir al Horario</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
