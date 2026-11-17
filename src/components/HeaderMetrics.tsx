import React from 'react';
import {
  GraduationCap,
  CalendarDays,
  GitBranch,
  FileCheck2,
  BookOpen,
  Award,
} from 'lucide-react';
import { usePlannerStore } from '../store/usePlannerStore';
import type { ViewTab } from '../types/curriculum';

export const HeaderMetrics: React.FC = () => {
  const {
    profile,
    activeTab,
    setActiveTab,
    getApprovedCredits,
    getEnrolledCredits,
    getPlannedCredits,
    getPendingCredits,
    getWeightedAverage,
  } = usePlannerStore();

  const approvedCredits = getApprovedCredits();
  const enrolledCredits = getEnrolledCredits();
  const plannedCredits = getPlannedCredits();
  const pendingCredits = getPendingCredits();
  const weightedAverage = getWeightedAverage();
  const progressPercent = Math.min(100, Math.round((approvedCredits / 200) * 100));

  const navItems: { id: ViewTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'malla',
      label: 'Malla Curricular Interactiva',
      icon: <BookOpen className="w-4 h-4" />,
      badge: '10 Ciclos',
    },
    {
      id: 'simulador',
      label: 'Simulador y Planificador',
      icon: <CalendarDays className="w-4 h-4" />,
      badge: `${plannedCredits} CR`,
    },
    {
      id: 'arbol',
      label: 'Árbol de Prerrequisitos',
      icon: <GitBranch className="w-4 h-4" />,
    },
    {
      id: 'auditoria',
      label: 'Auditoría de Grado',
      icon: <FileCheck2 className="w-4 h-4" />,
      badge: `${progressPercent}%`,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
      {/* Primary Brand & Navigation Tier */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Academy Space Logo & Brand */}
          <div className="flex items-center gap-3 min-w-max">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-zinc-900/80 border border-zinc-800/80 shadow-md">
              <img
                src="/isotipo.png"
                alt="Academy Space"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex items-center text-lg sm:text-xl font-black tracking-tight font-sans select-none">
              <span className="text-sky-400">Academy</span>
              <span className="text-amber-400 ml-1.5">Space</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800/70">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-0.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Student Profile Pill */}
          <div className="flex items-center gap-3 pl-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-inner">
              CM
            </div>
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-200 leading-none">
                  {profile.studentName}
                </span>
                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                  {profile.studentCode}
                </span>
              </div>
              <div className="text-[11px] text-zinc-500 leading-none mt-1">
                {profile.campus} • {profile.modality}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-zinc-800/60">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60'
                    : 'text-zinc-400 hover:bg-zinc-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Metrics & Academic Standing Ribbon */}
      <div className="w-full bg-zinc-900/60 border-t border-zinc-800/60 py-2.5 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6">
          {/* Progress Metrics Cluster */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {/* Linear Progress Indicator */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Créditos Acumulados:</span>
                <span className="font-mono font-bold text-zinc-100">
                  {approvedCredits} / 200 CR
                </span>
                <span className="text-zinc-400 font-mono">({progressPercent}%)</span>
              </div>
              <div className="w-24 sm:w-32 h-2 rounded-full bg-zinc-800 overflow-hidden p-0.5 border border-zinc-700/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Micro Credit Counts */}
            <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Aprobados: <strong className="text-emerald-400">{approvedCredits} CR</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                Matriculados: <strong className="text-sky-400">{enrolledCredits} CR</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-zinc-500 inline-block" />
                Pendientes: <strong className="text-zinc-300">{pendingCredits} CR</strong>
              </span>
            </div>
          </div>

          {/* Academic Standing & Term status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-300">
              <GraduationCap className="w-3.5 h-3.5 text-zinc-400" />
              <span>Estado Académico:</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 font-medium font-mono text-[11px] border border-zinc-700/40">
                {profile.academicStanding}
              </span>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-zinc-400">Promedio Ponderado:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[11px] border border-emerald-500/30">
                {weightedAverage > 0 ? weightedAverage.toFixed(2) : '--'}
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">Regular</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
