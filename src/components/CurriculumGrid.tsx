import React, { useRef } from 'react';
import {
  Search,
  Filter,
  CheckCheck,
  CheckCircle2,
  Unlock,
  Lock,
  Layers,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
} from 'lucide-react';
import { CourseCard } from './CourseCard';
import { usePlannerStore } from '../store/usePlannerStore';
import type { Course } from '../types/curriculum';
import curriculumData from '../data/curriculum.json';

const allCourses: Course[] = curriculumData as Course[];
const cycles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const CurriculumGrid: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    getCourseStatus,
    approvedCourses,
    enrolledCourses,
    toggleApprovedCourse,
  } = usePlannerStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter courses based on search & active type filter
  const filterCourse = (course: Course) => {
    // Search query matching ID or Name
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = course.name.toLowerCase().includes(q);
      const matchId = course.id.toLowerCase().includes(q);
      const matchPrereq = course.prerequisites.some((p) => p.toLowerCase().includes(q));
      if (!matchName && !matchId && !matchPrereq) return false;
    }

    const status = getCourseStatus(course.id);

    switch (typeFilter) {
      case 'HABILITADOS':
        return status === 'HABILITADO';
      case 'OBLIGATORIOS':
        return !course.isElective;
      case 'ELECTIVOS':
        return Boolean(course.isElective);
      case 'PRESENCIAL':
        return course.mode === 'P';
      case 'VIRTUAL':
        return course.mode === 'V_ASYNC' || course.mode === 'V_SYNC';
      case 'TODOS':
      default:
        return true;
    }
  };

  const scrollToCycle = (cycleNum: number) => {
    const el = document.getElementById(`cycle-col-${cycleNum}`);
    if (el && scrollContainerRef.current) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  };

  const scrollHorizontally = (offset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Batch approve cycle
  const handleApproveEntireCycle = (cycleNum: number) => {
    const cycleCourses = allCourses.filter((c) => c.cycle === cycleNum);
    const allApprovedAlready = cycleCourses.every((c) =>
      approvedCourses.includes(c.id)
    );

    cycleCourses.forEach((c) => {
      if (allApprovedAlready) {
        toggleApprovedCourse(c.id);
      } else {
        if (!approvedCourses.includes(c.id)) {
          toggleApprovedCourse(c.id, 16);
        }
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Search & Global Filter Strip */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por código, nombre o prerrequisito..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          {[
            { id: 'TODOS', label: 'Todos' },
            { id: 'HABILITADOS', label: 'Habilitados' },
            { id: 'OBLIGATORIOS', label: 'Obligatorios' },
            { id: 'ELECTIVOS', label: 'Electivos' },
            { id: 'PRESENCIAL', label: 'Presencial [P]' },
            { id: 'VIRTUAL', label: 'Virtual [*, **]' },
          ].map((tab) => {
            const isActive = typeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-amber-400 border border-amber-500/40 shadow-sm'
                    : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800/80 hover:bg-zinc-800/60 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Horizontal Navigation Quick Arrows */}
        {/* Horizontal Navigation Quick Arrows */}
        <div className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => scrollHorizontally(-430)}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Desplazar a la izquierda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollHorizontally(430)}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Desplazar a la derecha"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cycle Fast-Jump Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider pl-1">
          Ir a Ciclo:
        </span>
        {cycles.map((c) => (
          <button
            key={c}
            onClick={() => scrollToCycle(c)}
            className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
          >
            C{c < 10 ? `0${c}` : c}
          </button>
        ))}
      </div>

      {/* 10-Column Kanban Board - Maximum 4 spaces visible across screen */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto pb-6 pt-1 scroll-smooth snap-x select-none"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {cycles.map((cycleNum) => {
          const cycleCourses = allCourses.filter((c) => c.cycle === cycleNum);
          const visibleCourses = cycleCourses.filter(filterCourse);
          const totalCycleCredits = cycleCourses.reduce((sum, c) => sum + c.credits, 0);

          const cycleApprovedCount = cycleCourses.filter((c) =>
            approvedCourses.includes(c.id)
          ).length;
          const cycleProgressPercent = Math.round(
            (cycleApprovedCount / cycleCourses.length) * 100
          );
          const isEntireCycleApproved = cycleProgressPercent === 100;

          return (
            <div
              key={cycleNum}
              id={`cycle-col-${cycleNum}`}
              className="flex-shrink-0 w-[350px] sm:w-[380px] md:w-[410px] lg:w-[430px] xl:w-[450px] flex flex-col rounded-2xl glass-panel p-4 border border-zinc-800/80 snap-start"
            >
              {/* Column Header */}
              <div className="pb-3 mb-3 border-b border-zinc-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isEntireCycleApproved
                          ? 'bg-emerald-500 shadow-glow-emerald'
                          : cycleProgressPercent > 0
                          ? 'bg-sky-500'
                          : 'bg-zinc-700'
                      }`}
                    />
                    <h3 className="font-display font-semibold text-sm tracking-tight text-zinc-100">
                      CICLO {cycleNum < 10 ? `0${cycleNum}` : cycleNum}
                    </h3>
                  </div>

                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                    {totalCycleCredits} CR
                  </span>
                </div>

                {/* Progress bar & Batch Action */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="font-mono">
                    Progreso: {cycleApprovedCount}/{cycleCourses.length} ({cycleProgressPercent}%)
                  </span>

                  <button
                    onClick={() => handleApproveEntireCycle(cycleNum)}
                    className="text-[10px] text-zinc-500 hover:text-amber-400 transition-colors flex items-center gap-1"
                    title={
                      isEntireCycleApproved
                        ? 'Desmarcar ciclo completo'
                        : 'Simular aprobación de ciclo completo'
                    }
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isEntireCycleApproved ? 'Revertir' : 'Aprobar'}</span>
                  </button>
                </div>

                <div className="w-full h-1.5 rounded-full bg-zinc-950 mt-1.5 overflow-hidden border border-zinc-800/80">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isEntireCycleApproved
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-sky-500 to-indigo-500'
                    }`}
                    style={{ width: `${cycleProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Cards in Cycle */}
              <div className="flex flex-col gap-3 min-h-[420px]">
                {visibleCourses.length > 0 ? (
                  visibleCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-zinc-800/80 text-center my-auto">
                    <Filter className="w-6 h-6 text-zinc-600 mb-2" />
                    <p className="text-xs text-zinc-500">Ningún curso coincide con los filtros</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
