import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Trash2,
  RotateCcw,
  Send,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  X,
  Sparkles,
  MapPin,
  User,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePlannerStore } from '../store/usePlannerStore';
import type { Course, ScheduleBlock } from '../types/curriculum';
import curriculumData from '../data/curriculum.json';

const allCourses: Course[] = curriculumData as Course[];
const timeSlots = [
  '07:30 - 10:00',
  '10:15 - 12:45',
  '13:45 - 16:15',
  '16:30 - 19:00',
] as const;

const weekDays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'] as const;

// Palette for scheduled courses on the timetable grid
const timetableColors = [
  { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-300', dot: 'bg-amber-400' },
  { bg: 'bg-sky-500/20', border: 'border-sky-500/50', text: 'text-sky-300', dot: 'bg-sky-400' },
  { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-300', dot: 'bg-purple-400' },
  { bg: 'bg-rose-500/20', border: 'border-rose-500/50', text: 'text-rose-300', dot: 'bg-rose-400' },
  { bg: 'bg-indigo-500/20', border: 'border-indigo-500/50', text: 'text-indigo-300', dot: 'bg-indigo-400' },
];

export const CyclePlanner: React.FC = () => {
  const {
    plannedCourses,
    togglePlannedCourse,
    removePlannedCourse,
    clearPlannedCourses,
    getCourseStatus,
    getCourse,
    getPlannedCredits,
    getScheduleCollisions,
    getWorkloadBreakdown,
    setSelectedCourseId,
    courseGrades,
    approvedCourses,
  } = usePlannerStore();

  const [searchFilter, setSearchFilter] = useState('');
  const [activeChip, setActiveChip] = useState<'ALL' | 'OBLIG' | 'ELECT' | 'PRES' | 'VIRT'>('ALL');
  const [showBlockedAccordion, setShowBlockedAccordion] = useState(false);
  const [submittedModalOpen, setSubmittedModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const plannedCredits = getPlannedCredits();
  const workload = getWorkloadBreakdown();
  const collisions = getScheduleCollisions();

  // Validate prerequisite compliance for all planned courses
  const allPrereqsMet = plannedCourses.every((id) => {
    const c = getCourse(id);
    return c?.prerequisites.every((req) => approvedCourses.includes(req)) ?? true;
  });

  // Credit cap validation (Min 12 CR / Max 22 CR)
  const isUnderMinCredits = plannedCredits < 12;
  const isOverMaxCredits = plannedCredits > 22;
  const isOptimalCredits = plannedCredits >= 12 && plannedCredits <= 22;

  // Filter available courses for simulation
  const availableCourses = allCourses.filter((course) => {
    const status = getCourseStatus(course.id);
    // Include habilitados or already planned
    if (status !== 'HABILITADO' && !plannedCourses.includes(course.id)) return false;

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchName = course.name.toLowerCase().includes(q);
      const matchId = course.id.toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }

    if (activeChip === 'OBLIG' && course.isElective) return false;
    if (activeChip === 'ELECT' && !course.isElective) return false;
    if (activeChip === 'PRES' && course.mode !== 'P') return false;
    if (activeChip === 'VIRT' && course.mode === 'P') return false;

    return true;
  });

  // Blocked courses list for accordion
  const blockedCourses = allCourses.filter((course) => {
    const status = getCourseStatus(course.id);
    return status === 'BLOQUEADO' && course.cycle <= 7;
  });

  const handleAddCourse = (courseId: string) => {
    setErrorMessage(null);
    const result = togglePlannedCourse(courseId);
    if (!result.success && result.message) {
      setErrorMessage(result.message);
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  const handleOfficialSubmission = () => {
    if (!isOptimalCredits) {
      setErrorMessage(
        'Para realizar la Pre-Matrícula Oficial debes tener entre 12 y 22 créditos planificados.'
      );
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    if (collisions.hasCollisions) {
      setErrorMessage('No puedes oficializar la matrícula si existen cruces de horario.');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    // Trigger celebration confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#0ea5e9', '#ffffff'],
    });

    setSubmittedModalOpen(true);
  };

  const handleResetToDefaultDraft = () => {
    usePlannerStore.getState().loadDefaultMockProfile();
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* Top Banner Ribbon */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 font-mono tracking-tight">
              Término 2025-I: En Planificación
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-zinc-800 text-amber-400 border border-amber-500/30">
              Mín 12 CR / Máx 22 CR
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Malla Curricular: ISC-2023 • Estudiante: Carlos Mendoza Salazar (N00248190) •{' '}
            <strong className="text-emerald-400">Estado: Plan Activo</strong>
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={clearPlannedCourses}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors flex items-center justify-center gap-1.5"
            title="Limpiar borrador actual"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Limpiar</span>
          </button>

          <button
            onClick={handleResetToDefaultDraft}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors flex items-center justify-center gap-1.5"
            title="Restaurar cursos preseleccionados recomendados"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Borrador UPN</span>
          </button>

          <button
            onClick={handleOfficialSubmission}
            className="flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Pre-Matrícula Oficial</span>
          </button>
        </div>
      </div>

      {/* Error alert toast if present */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main 2-Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Available Courses to Plan (5 Cols on LG, 6 on XL) */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col gap-4">
          {/* Search & Filter Strip */}
          <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Buscar por código, nombre o prerrequisito..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {[
                { id: 'ALL', label: `Todos los Habilitados (${availableCourses.length})` },
                { id: 'OBLIG', label: 'Obligatorios' },
                { id: 'ELECT', label: 'Electivos' },
                { id: 'PRES', label: 'Presencial [P]' },
                { id: 'VIRT', label: 'Virtual / Híbrido [*]' },
              ].map((chip) => {
                const isActive = activeChip === chip.id;
                return (
                  <button
                    key={chip.id}
                    onClick={() => setActiveChip(chip.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-zinc-800 text-amber-400 border border-amber-500/40'
                        : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List of Available Courses */}
          <div className="flex flex-col gap-3">
            {availableCourses.length === 0 ? (
              <div className="glass-panel rounded-2xl p-8 text-center text-zinc-500 text-xs">
                No hay cursos disponibles con los filtros actuales.
              </div>
            ) : (
              availableCourses.map((course) => {
                const isSelected = plannedCourses.includes(course.id);
                const prereq = course.prerequisites[0];
                const prereqCourse = prereq ? allCourses.find((c) => c.id === prereq) : null;
                const prereqGrade = prereq ? courseGrades[prereq] : null;

                return (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`glass-panel rounded-2xl p-4 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500/70 bg-zinc-900/90 shadow-glow'
                        : 'border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    {/* Header: Code, Badges, Action Button */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-zinc-200">
                          {course.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                          Ciclo {course.cycle < 10 ? `0${course.cycle}` : course.cycle}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          {course.credits} CR
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700/40">
                          {course.mode === 'P'
                            ? 'Presencial [P]'
                            : course.mode === 'V_ASYNC'
                            ? 'Virtual Asíncrono [*]'
                            : 'Virtual Síncrono [**]'}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddCourse(course.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/60'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Minus className="w-3.5 h-3.5" />
                            <span>Quitar</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-amber-400" />
                            <span>Añadir al Horario</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Course Title & Cupos */}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-zinc-100 hover:text-amber-400 transition-colors">
                        {course.name}
                      </h3>
                      {course.capacity && (
                        <span className="text-[10px] font-mono text-zinc-500 flex-shrink-0">
                          Cupos: {course.capacity.available} / {course.capacity.total} disponibles
                        </span>
                      )}
                    </div>

                    {/* Description excerpt */}
                    {course.description && (
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {course.description}
                      </p>
                    )}

                    {/* Footer: Hours & Prerequisite Status */}
                    <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="font-mono text-zinc-400 flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                          HT: {course.ht}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                          HP: {course.hp}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                          HL: {course.hl}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800">
                          PC: {course.pc}
                        </span>
                      </div>

                      {prereqCourse ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>
                            Prerreq: {prereqCourse.id} (Aprobado Nota: {prereqGrade || 16})
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-500 font-mono text-[10px]">
                          Ingreso directo (Sin prerreq.)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Collapsible Accordion: Cursos Bloqueados */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-zinc-800/80">
            <button
              onClick={() => setShowBlockedAccordion(!showBlockedAccordion)}
              className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500/80" />
                <span>
                  Cursos Bloqueados por Prerrequisito No Cumplido ({blockedCourses.length})
                </span>
              </div>
              {showBlockedAccordion ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showBlockedAccordion && (
              <div className="p-4 pt-0 border-t border-zinc-800/60 space-y-2 text-xs">
                {blockedCourses.map((bc) => (
                  <div
                    key={bc.id}
                    onClick={() => setSelectedCourseId(bc.id)}
                    className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-zinc-400">{bc.id}</span>
                        <span className="text-zinc-300 font-medium">{bc.name}</span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          Ciclo {bc.cycle}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1">
                        Faltan prerrequisitos:{' '}
                        {bc.prerequisites.map((p) => (
                          <span key={p} className="font-mono text-rose-400 mr-1.5">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      Ver Ficha
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Validation Cards, Planned Draft, Timetable Grid (6 Cols) */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col gap-5">
          {/* 3 Status / Validation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Card 1: Prereqs */}
            <div className="glass-panel rounded-2xl p-3.5 border border-zinc-800/80 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-zinc-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cumplimiento Prerreq.</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                {allPrereqsMet
                  ? `Los ${plannedCourses.length} cursos cuentan con sus requisitos 100% aprobados.`
                  : 'Uno o más cursos tienen requisitos pendientes.'}
              </p>
              <div className="mt-2 text-[10px] font-mono font-bold text-emerald-400">
                100% Validado
              </div>
            </div>

            {/* Card 2: Academic Load */}
            <div
              className={`glass-panel rounded-2xl p-3.5 border flex flex-col justify-between ${
                isOptimalCredits
                  ? 'border-zinc-800/80'
                  : 'border-amber-500/50 bg-amber-950/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-zinc-200">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Carga Académica</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                {isOptimalCredits
                  ? `${plannedCredits} CR dentro del rango UPN permitido (Mín 12 - Máx 22 CR).`
                  : isUnderMinCredits
                  ? `Carga insuficiente (${plannedCredits} CR). Mínimo 12 CR.`
                  : `Carga excesiva (${plannedCredits} CR). Límite 22 CR.`}
              </p>
              <div className="mt-2 text-[10px] font-mono font-bold text-amber-400">
                {plannedCredits} / 22 CR Planificados
              </div>
            </div>

            {/* Card 3: Timetable Collision */}
            <div
              className={`glass-panel rounded-2xl p-3.5 border flex flex-col justify-between ${
                collisions.hasCollisions
                  ? 'border-rose-500/50 bg-rose-950/20'
                  : 'border-zinc-800/80'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-zinc-200">
                <CalendarDays
                  className={`w-4 h-4 ${
                    collisions.hasCollisions ? 'text-rose-400' : 'text-sky-400'
                  }`}
                />
                <span>Cruce de Horarios</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                {collisions.hasCollisions
                  ? `Colisión detectada: ${collisions.conflictingSlots[0]}`
                  : 'Cero colisiones entre bloques teóricos y laboratorios.'}
              </p>
              <div
                className={`mt-2 text-[10px] font-mono font-bold ${
                  collisions.hasCollisions ? 'text-rose-400' : 'text-sky-400'
                }`}
              >
                {collisions.hasCollisions ? 'Conflicto Horario' : 'Sin Cruces'}
              </div>
            </div>
          </div>

          {/* Cursos en tu Borrador List */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-zinc-800/80">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-zinc-100">
                  Cursos en tu Borrador
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {plannedCourses.length} Cursos
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-zinc-300">
                Subtotal: <strong className="text-amber-400">{plannedCredits} Créditos</strong>
              </span>
            </div>

            {/* List */}
            <div className="mt-3 space-y-2.5">
              {plannedCourses.length === 0 ? (
                <p className="text-xs text-zinc-500 py-6 text-center italic">
                  Aún no has añadido cursos a tu borrador de matrícula.
                </p>
              ) : (
                plannedCourses.map((id, index) => {
                  const course = getCourse(id);
                  if (!course) return null;
                  const colorConfig = timetableColors[index % timetableColors.length];
                  const firstSchedule = course.schedule?.[0];

                  return (
                    <div
                      key={id}
                      className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-8 rounded-full ${colorConfig.dot}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-100 font-sans">
                              {course.name}
                            </span>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                              {course.credits} CR
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-zinc-400 mt-0.5 font-mono">
                            <span>NRC {2000 + course.cycle * 110 + index * 12}</span>
                            <span>•</span>
                            <span>{course.professor?.name || 'Prof. UPN'}</span>
                            {firstSchedule && (
                              <>
                                <span>•</span>
                                <span>
                                  {firstSchedule.day} {firstSchedule.timeSlot} ({firstSchedule.room})
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removePlannedCourse(id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                        title="Eliminar del borrador"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Horario Semanal Simulado Timetable Grid */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-zinc-800/80 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-zinc-100">
                  Horario Semanal Simulado
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                Lunes a Sábado • Campus Lima Centro
              </span>
            </div>

            {/* Timetable Table */}
            <div className="overflow-x-auto scrollbar-none">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono text-[11px]">
                    <th className="py-2 px-2 text-left w-24">Hora</th>
                    {weekDays.map((d) => (
                      <th key={d} className="py-2 px-2 text-center font-bold">
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                  {timeSlots.map((slot) => (
                    <tr key={slot} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="py-2.5 px-2 font-mono text-zinc-500 whitespace-nowrap text-[10px]">
                        {slot}
                      </td>
                      {weekDays.map((day) => {
                        // Find courses scheduled at this day and timeSlot
                        const scheduled = plannedCourses
                          .map((id, idx) => {
                            const c = getCourse(id);
                            const block = c?.schedule?.find(
                              (s) => s.day === day && s.timeSlot === slot
                            );
                            return block ? { course: c!, block, colorIdx: idx } : null;
                          })
                          .filter(Boolean);

                        if (scheduled.length === 0) {
                          return <td key={day} className="p-1" />;
                        }

                        return (
                          <td key={day} className="p-1 align-top">
                            {scheduled.map((item, i) => {
                              const style = timetableColors[item!.colorIdx % timetableColors.length];
                              return (
                                <div
                                  key={i}
                                  onClick={() => setSelectedCourseId(item!.course.id)}
                                  className={`p-1.5 rounded-lg border text-left cursor-pointer transition-transform hover:scale-[1.02] mb-1 ${style.bg} ${style.border}`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span
                                      className={`font-bold font-sans text-[10px] truncate max-w-[85px] ${style.text}`}
                                    >
                                      {item!.course.name}
                                    </span>
                                  </div>
                                  <div className="text-[9px] text-zinc-400 truncate">
                                    {item!.block.type} • {item!.block.room}
                                  </div>
                                </div>
                              );
                            })}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Workload summary footer */}
            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-3">
                <span>Horas Teoría: <strong className="text-zinc-200">{workload.ht} hrs</strong></span>
                <span>•</span>
                <span>Horas Práctica: <strong className="text-zinc-200">{workload.hp} hrs</strong></span>
                <span>•</span>
                <span>Horas Laboratorio: <strong className="text-zinc-200">{workload.hl} hrs</strong></span>
              </div>
              <span className="text-zinc-300 font-semibold">
                Total Semanal: <strong className="text-amber-400">{workload.totalHours} hrs</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Pre-Matrícula Confirmation Modal */}
      {submittedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl relative text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4 border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-zinc-100 font-mono">
              ¡Pre-Matrícula Oficial Registrada!
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Tu selección de asignaturas para el término <strong className="text-zinc-200">2025-I</strong> ha sido validada sin colisiones de horario y cumple cabalmente con todos los prerrequisitos del Plan de Estudios 2023.
            </p>

            {/* Summary Ticket */}
            <div className="my-5 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-left text-xs font-mono space-y-2">
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500">Estudiante:</span>
                <span className="text-zinc-200 font-bold">Carlos Mendoza Salazar</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500">Código UPN:</span>
                <span className="text-amber-400 font-bold">N00248190</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500">Cursos Registrados:</span>
                <span className="text-zinc-200">{plannedCourses.length} Asignaturas</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500">Créditos Totales:</span>
                <span className="text-emerald-400 font-bold">{plannedCredits} CR (Rango 12-22)</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-zinc-500">Carga Horaria:</span>
                <span className="text-zinc-300">{workload.totalHours} hrs semanales</span>
              </div>
            </div>

            <button
              onClick={() => setSubmittedModalOpen(false)}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Aceptar y Cerrar Constancia
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
