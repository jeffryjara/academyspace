import React from 'react';
import { GraduationCap, Award } from 'lucide-react';
import { usePlannerStore } from '../store/usePlannerStore';
import type { ViewTab } from '../types/curriculum';

export const HeaderMetrics: React.FC = () => {
  const {
    profile,
    activeTab,
    setActiveTab,
    getApprovedCredits,
    getEnrolledCredits,
    getPendingCredits,
    getWeightedAverage,
  } = usePlannerStore();

  const approvedCredits = getApprovedCredits();
  const enrolledCredits = getEnrolledCredits();
  const pendingCredits = getPendingCredits();
  const weightedAverage = getWeightedAverage();
  const progressPercent = Math.min(100, Math.round((approvedCredits / 200) * 100));

  const navItems: { id: ViewTab; label: string }[] = [
    { id: 'malla', label: 'Malla Curricular' },
    { id: 'simulador', label: 'Simulador' },
    { id: 'arbol', label: 'Prerrequisitos' },
    { id: 'auditoria', label: 'Auditoría' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-black/95 backdrop-blur-xl">
      {/* Primary Brand & Minimalist Text Navigation Tier */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand without extra background container */}
          <div className="flex items-center gap-2.5 min-w-max select-none">
            <img
              src="/isotipo.png"
              alt="Academy Space"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
            <div className="flex items-center text-lg sm:text-xl font-black tracking-tight font-sans">
              <span className="text-sky-400">Academy</span>
              <span className="text-amber-400 ml-1.5">Space</span>
            </div>
          </div>

          {/* Navigation Tabs - Pure minimal text without container */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-xs sm:text-sm transition-colors py-1 relative ${
                    isActive
                      ? 'text-zinc-100 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 font-normal'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Student Profile: Name and Campus only */}
          <div className="text-right select-none min-w-max">
            <div className="text-xs sm:text-sm font-semibold text-zinc-200 leading-tight">
              {profile.studentName}
            </div>
            <div className="text-[11px] text-zinc-400 leading-tight mt-0.5">
              {profile.campus}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar - Pure text */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-6 border-t border-zinc-900 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-xs whitespace-nowrap transition-colors py-1 ${
                  isActive
                    ? 'text-amber-400 font-bold border-b-2 border-amber-400'
                    : 'text-zinc-400 hover:text-zinc-200 font-medium'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Metrics & Academic Standing Ribbon - Ultra Dark */}
      <div className="w-full bg-black border-t border-zinc-900 py-2.5 px-4 sm:px-6 lg:px-8 text-xs">
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
              <div className="w-24 sm:w-32 h-2 rounded-full bg-zinc-950 overflow-hidden p-0.5 border border-zinc-800">
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
                <span className="w-2 h-2 rounded-full bg-zinc-600 inline-block" />
                Pendientes: <strong className="text-zinc-300">{pendingCredits} CR</strong>
              </span>
            </div>
          </div>

          {/* Academic Standing & Term status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-300">
              <GraduationCap className="w-3.5 h-3.5 text-zinc-400" />
              <span>Estado Académico:</span>
              <span className="px-2 py-0.5 rounded bg-zinc-950 text-zinc-200 font-medium font-mono text-[11px] border border-zinc-800">
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
