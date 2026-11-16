import React, { useState } from 'react';
import {
  GitBranch,
  ArrowRight,
  CheckCircle2,
  Lock,
  Unlock,
  Layers,
  Sparkles,
  Info,
  Filter,
} from 'lucide-react';
import { usePlannerStore } from '../store/usePlannerStore';
import type { AcademicArea, Course } from '../types/curriculum';
import curriculumData from '../data/curriculum.json';

const allCourses: Course[] = curriculumData as Course[];

const criticalTracks: { id: string; name: string; area: AcademicArea; color: string }[] = [
  { id: 'ALL', name: 'Todos los Tracks', area: 'Ingeniería de Software', color: 'from-amber-500 to-amber-700' },
  { id: 'SW', name: 'Línea de Ingeniería de Software', area: 'Ingeniería de Software', color: 'from-sky-500 to-blue-600' },
  { id: 'DATA', name: 'Línea de Datos e Inteligencia Artificial', area: 'Datos & IA', color: 'from-emerald-500 to-teal-600' },
  { id: 'NET', name: 'Línea de Redes y Ciberseguridad', area: 'Redes & Infraestructura', color: 'from-purple-500 to-indigo-600' },
  { id: 'MATH', name: 'Línea de Ciencias Básicas y Matemáticas', area: 'Ciencias Básicas', color: 'from-amber-400 to-orange-500' },
  { id: 'THESIS', name: 'Línea de Investigación y Tesis', area: 'Investigación', color: 'from-rose-500 to-pink-600' },
];

export const PrerequisiteTree: React.FC = () => {
  const {
    getCourseStatus,
    hoveredCourseId,
    setHoveredCourseId,
    getAncestors,
    getDescendants,
    setSelectedCourseId,
    approvedCourses,
  } = usePlannerStore();

  const [selectedTrack, setSelectedTrack] = useState<string>('ALL');

  // Filter courses by track if selected
  const visibleCourses = allCourses.filter((course) => {
    if (selectedTrack === 'ALL') return true;
    if (selectedTrack === 'SW') return course.area === 'Ingeniería de Software';
    if (selectedTrack === 'DATA') return course.area === 'Datos & IA';
    if (selectedTrack === 'NET') return course.area === 'Redes & Infraestructura' || course.area === 'Hardware & Robótica';
    if (selectedTrack === 'MATH') return course.area === 'Ciencias Básicas';
    if (selectedTrack === 'THESIS') return course.area === 'Investigación';
    return true;
  });

  const cycles = Array.from(new Set(visibleCourses.map((c) => c.cycle))).sort((a, b) => a - b);

  return (
    <div className="w-full flex flex-col gap-5 animate-fade-in">
      {/* Header & Filter Controls */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 font-mono">
              Árbol Interactivo de Prerrequisitos y Dependencias
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Pasa el cursor sobre cualquier curso para iluminar su cadena completa de prerrequisitos anteriores (verde) y cursos desbloqueados hacia adelante (azul).
          </p>
        </div>

        {/* Track selector chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {criticalTracks.map((t) => {
            const isSelected = selectedTrack === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTrack(t.id)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-zinc-800 text-amber-400 border border-amber-500/40 shadow-sm'
                    : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dependency Map Grid (Horizontal Timeline by Cycles) */}
      <div className="glass-panel rounded-2xl p-6 border border-zinc-800/80 overflow-x-auto">
        <div className="flex gap-8 min-w-max pb-4">
          {cycles.map((cycleNum) => {
            const coursesInCycle = visibleCourses.filter((c) => c.cycle === cycleNum);

            return (
              <div key={cycleNum} className="flex flex-col gap-4 w-60">
                {/* Cycle Timeline Pin */}
                <div className="pb-2 border-b border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-mono font-bold text-xs text-zinc-200">
                      CICLO {cycleNum < 10 ? `0${cycleNum}` : cycleNum}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {coursesInCycle.length} Cursos
                  </span>
                </div>

                {/* Nodes in this cycle */}
                <div className="flex flex-col gap-3">
                  {coursesInCycle.map((course) => {
                    const status = getCourseStatus(course.id);
                    const isSelfHovered = hoveredCourseId === course.id;
                    const isAncestor = hoveredCourseId
                      ? getAncestors(hoveredCourseId).includes(course.id)
                      : false;
                    const isDescendant = hoveredCourseId
                      ? getDescendants(hoveredCourseId).includes(course.id)
                      : false;
                    const isDimmed =
                      Boolean(hoveredCourseId) &&
                      !isSelfHovered &&
                      !isAncestor &&
                      !isDescendant;

                    let nodeStyle = 'border-zinc-800 bg-zinc-950/70 text-zinc-300';
                    if (isSelfHovered) {
                      nodeStyle = 'border-amber-400 bg-zinc-900 text-amber-300 ring-2 ring-amber-400 shadow-glow scale-[1.02]';
                    } else if (isAncestor) {
                      nodeStyle = 'border-emerald-500 bg-emerald-950/30 text-emerald-300 ring-2 ring-emerald-500 shadow-glow-emerald';
                    } else if (isDescendant) {
                      nodeStyle = 'border-sky-500 bg-sky-950/30 text-sky-300 ring-2 ring-sky-500 shadow-glow-sky';
                    } else if (isDimmed) {
                      nodeStyle = 'opacity-30 border-zinc-900 bg-zinc-950 text-zinc-600';
                    }

                    return (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourseId(course.id)}
                        onMouseEnter={() => setHoveredCourseId(course.id)}
                        onMouseLeave={() => setHoveredCourseId(null)}
                        className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${nodeStyle}`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-mono text-[11px] font-bold">
                            {course.id}
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800">
                            {course.credits} CR
                          </span>
                        </div>

                        <h4 className="text-xs font-medium leading-snug line-clamp-2">
                          {course.name}
                        </h4>

                        {/* Prerequisite Tags */}
                        {course.prerequisites.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-zinc-800/60 flex flex-wrap gap-1">
                            {course.prerequisites.map((p) => {
                              const pApproved = approvedCourses.includes(p);
                              return (
                                <span
                                  key={p}
                                  className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                                    pApproved
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : 'bg-zinc-800 text-zinc-500'
                                  }`}
                                >
                                  ← {p}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
