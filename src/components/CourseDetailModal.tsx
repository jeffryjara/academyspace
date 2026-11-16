import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Lock,
  Unlock,
  Radio,
  Clock,
  BookOpen,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { usePlannerStore } from '../store/usePlannerStore';
import type { Course } from '../types/curriculum';
import curriculumData from '../data/curriculum.json';

const allCourses: Course[] = curriculumData as Course[];

export const CourseDetailModal: React.FC = () => {
  const {
    selectedCourseId,
    setSelectedCourseId,
    getCourse,
    getCourseStatus,
    courseGrades,
    setCourseGrade,
    toggleApprovedCourse,
    toggleEnrolledCourse,
    togglePlannedCourse,
    plannedCourses,
    enrolledCourses,
    approvedCourses,
    selectedElectives,
    selectElective,
    approveAllPrerequisitesFor,
  } = usePlannerStore();

  const [simulatedGrade, setSimulatedGrade] = useState<number>(17);

  if (!selectedCourseId) return null;

  const course = getCourse(selectedCourseId);
  if (!course) return null;

  const status = getCourseStatus(course.id);
  const isApproved = status === 'APROBADO';
  const isEnrolled = status === 'MATRICULADO';
  const isPlanned = plannedCourses.includes(course.id);
  const currentGrade = courseGrades[course.id];

  // Immediate prerequisites
  const prerequisiteCourses = course.prerequisites.map((reqId) => {
    const prereq = allCourses.find((c) => c.id === reqId);
    return {
      id: reqId,
      name: prereq?.name || reqId,
      cycle: prereq?.cycle,
      isMet: approvedCourses.includes(reqId),
      grade: courseGrades[reqId],
    };
  });

  // Direct downstream courses that this course unlocks
  const unlockedCourses = allCourses.filter((c) =>
    c.prerequisites.includes(course.id)
  );

  const totalWeeklyHours = (course.ht || 0) + (course.hp || 0) + (course.hl || 0) + (course.pc || 0);

  const getStatusBadge = () => {
    switch (status) {
      case 'APROBADO':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            APROBADO
          </span>
        );
      case 'MATRICULADO':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            MATRICULADO 2024-II
          </span>
        );
      case 'HABILITADO':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
            <Unlock className="w-3.5 h-3.5" />
            HABILITADO PARA MATRÍCULA
          </span>
        );
      case 'BLOQUEADO':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            BLOQUEADO POR PRERREQUISITO
          </span>
        );
    }
  };

  const getModalityLabel = () => {
    switch (course.mode) {
      case 'P':
        return 'Presencial';
      case 'V_ASYNC':
        return 'Virtual Asíncrono (*)';
      case 'V_SYNC':
        return 'Virtual Síncrono (**)';
    }
  };

  const handleSimulateApprove = () => {
    toggleApprovedCourse(course.id, simulatedGrade);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={() => setSelectedCourseId(null)}
    >
      <div
        className="w-full max-w-xl h-full bg-zinc-950 border-l border-zinc-800/90 shadow-2xl overflow-y-auto flex flex-col justify-between p-6 sm:p-8 animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500 tracking-wider uppercase">
                Detalle del Curso
              </span>
              <span className="text-sm font-mono font-bold text-amber-400">
                {course.id}
              </span>
            </div>
            <button
              onClick={() => setSelectedCourseId(null)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status & Area Badge Row */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {getStatusBadge()}
            {course.area && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-900 text-zinc-300 border border-zinc-800">
                {course.area}
              </span>
            )}
            {course.isElective && (
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                ELECTIVO GRUPO {course.electiveGroup}
              </span>
            )}
          </div>

          {/* Title & Faculty */}
          <div className="mt-3">
            <h2 className="text-2xl font-bold text-zinc-100 leading-tight">
              {course.name}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Ciclo {course.cycle < 10 ? `0${course.cycle}` : course.cycle} • Facultad de Ingeniería de Sistemas Computacionales
            </p>
          </div>

          {/* Three Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 text-center">
              <span className="text-[11px] text-zinc-500 block uppercase font-mono">Créditos</span>
              <span className="text-xl font-bold font-mono text-zinc-100">{course.credits} CR</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 text-center">
              <span className="text-[11px] text-zinc-500 block uppercase font-mono">Horas Sem.</span>
              <span className="text-xl font-bold font-mono text-zinc-100">{totalWeeklyHours} hrs</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 text-center">
              <span className="text-[11px] text-zinc-500 block uppercase font-mono">Modalidad</span>
              <span className="text-sm font-semibold text-zinc-200 mt-1 block truncate">
                {getModalityLabel()}
              </span>
            </div>
          </div>

          {/* Weekly Hours Breakdown */}
          <div className="mt-5">
            <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Carga Horaria Semanal
            </h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800/60 text-center">
                <span className="text-[10px] text-zinc-500 block">Teoría</span>
                <span className="text-sm font-mono font-bold text-zinc-200">{course.ht} hrs</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800/60 text-center">
                <span className="text-[10px] text-zinc-500 block">Práctica</span>
                <span className="text-sm font-mono font-bold text-zinc-200">{course.hp} hrs</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800/60 text-center">
                <span className="text-[10px] text-zinc-500 block">Lab</span>
                <span className="text-sm font-mono font-bold text-zinc-200">{course.hl} hrs</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800/60 text-center">
                <span className="text-[10px] text-zinc-500 block">Campo</span>
                <span className="text-sm font-mono font-bold text-zinc-200">{course.pc} hrs</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {course.description && (
            <div className="mt-5">
              <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                Descripción de la Asignatura
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60">
                {course.description}
              </p>
            </div>
          )}

          {/* Elective Options Selection */}
          {course.isElective && course.electiveOptions && (
            <div className="mt-5 p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40">
              <h4 className="text-xs font-semibold text-purple-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Línea de Especialización Electiva</span>
              </h4>
              <div className="space-y-2">
                {course.electiveOptions.map((opt) => {
                  const isSelected = (selectedElectives[course.id] || course.electiveOptions![0].code) === opt.code;
                  return (
                    <button
                      key={opt.code}
                      onClick={() => selectElective(course.id, opt.code)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between border transition-all ${
                        isSelected
                          ? 'bg-purple-900/40 border-purple-500/60 text-purple-100 font-semibold shadow-sm'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span>{opt.name}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 text-purple-300 border border-purple-500/30">
                        {opt.code}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cadena Curricular (Prerequisites & Downstream Unlocks) */}
          <div className="mt-5 space-y-4">
            <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
              Cadena Curricular
            </h4>

            {/* Prerrequisitos Inmediatos */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-zinc-200">
                  Prerrequisitos Inmediatos:
                </span>
                {prerequisiteCourses.length > 0 && !prerequisiteCourses.every((p) => p.isMet) && (
                  <button
                    onClick={() => approveAllPrerequisitesFor(course.id)}
                    className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    title="Aprobar todos los prerrequisitos anteriores"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Desbloquear Todo</span>
                  </button>
                )}
              </div>

              {prerequisiteCourses.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">
                  Sin prerrequisitos académicos. Curso de ingreso directo.
                </p>
              ) : (
                <div className="space-y-2">
                  {prerequisiteCourses.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/60 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {req.isMet ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        )}
                        <div>
                          <span className="font-mono font-bold text-zinc-200 mr-2">
                            {req.id}
                          </span>
                          <span className="text-zinc-300">{req.name}</span>
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-right flex-shrink-0 ml-2">
                        {req.isMet ? (
                          <span className="text-emerald-400">
                            Aprobado • Nota {req.grade || 16}
                          </span>
                        ) : (
                          <button
                            onClick={() => toggleApprovedCourse(req.id, 16)}
                            className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-[10px] font-bold border border-zinc-700"
                          >
                            + Aprobar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cursos que desbloquea directamente */}
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <span className="text-xs font-semibold text-zinc-200 block mb-2">
                Cursos que Desbloquea Directamente:
              </span>
              {unlockedCourses.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">
                  Curso terminal en la cadena curricular (sin cursos subsiguientes).
                </p>
              ) : (
                <div className="space-y-1.5">
                  {unlockedCourses.map((unlocked) => {
                    const uStatus = getCourseStatus(unlocked.id);
                    return (
                      <div
                        key={unlocked.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/50 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                          <span className="font-mono font-bold text-zinc-200">
                            {unlocked.id}
                          </span>
                          <span className="text-zinc-300">{unlocked.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 flex-shrink-0 ml-2">
                          Ciclo {unlocked.cycle < 10 ? `0${unlocked.cycle}` : unlocked.cycle} ({uStatus})
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Docente Responsable */}
          {course.professor && (
            <div className="mt-5 p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 border border-zinc-700">
                <User className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-xs">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">
                  Docente Responsable
                </span>
                <span className="font-semibold text-zinc-200">{course.professor.name}</span>
                <div className="text-[11px] text-zinc-400 font-mono">
                  {course.professor.email} • Sede {course.professor.campus}
                </div>
              </div>
            </div>
          )}

          {/* Competencias UPN / ABET */}
          {course.competencies && course.competencies.length > 0 && (
            <div className="mt-5">
              <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Competencias del Curso (ABET / UPN)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {course.competencies.map((comp) => (
                  <span
                    key={comp}
                    className="px-2.5 py-1 rounded-lg text-xs bg-zinc-900 text-zinc-300 border border-zinc-800"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Interactive Action & Simulator Card */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 space-y-3">
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950 border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
              <Zap className="w-4 h-4" />
              <span>Simulador de Nota y Efecto Dominó</span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">
              Simula aprobar este curso con nota aprobatoria para proyectar la habilitación inmediata de los ciclos subsiguientes.
            </p>

            {/* Simulated Grade Picker */}
            <div className="flex items-center justify-between gap-3 mb-3 bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800">
              <span className="text-xs text-zinc-300 font-medium">Nota Proyectada:</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="11"
                  max="20"
                  value={simulatedGrade}
                  onChange={(e) => setSimulatedGrade(Number(e.target.value))}
                  className="w-28 accent-amber-500 cursor-pointer"
                />
                <span className="font-mono font-bold text-amber-400 text-sm w-7 text-right">
                  {simulatedGrade}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleSimulateApprove}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                isApproved
                  ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>
                {isApproved
                  ? `Desmarcar Aprobado (Revertir Efecto Dominó)`
                  : `Simular Aprobado (Nota ${simulatedGrade})`}
              </span>
            </button>
          </div>

          {/* Quick Matricula & Planning Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => toggleEnrolledCourse(course.id)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                isEnrolled
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
              }`}
            >
              <span>{isEnrolled ? 'Desmatricular' : 'Marcar Matriculado'}</span>
            </button>

            <button
              onClick={() => togglePlannedCourse(course.id)}
              disabled={status === 'BLOQUEADO'}
              className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                status === 'BLOQUEADO'
                  ? 'opacity-40 cursor-not-allowed bg-zinc-950 border-zinc-800 text-zinc-600'
                  : isPlanned
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
              }`}
            >
              <span>{isPlanned ? 'Quitar del Plan' : 'Añadir al Plan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
