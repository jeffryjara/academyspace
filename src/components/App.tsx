import React, { useEffect, useState } from 'react';
import { HeaderMetrics } from './HeaderMetrics';
import { CurriculumGrid } from './CurriculumGrid';
import { CyclePlanner } from './CyclePlanner';
import { PrerequisiteTree } from './PrerequisiteTree';
import { DegreeAudit } from './DegreeAudit';
import { CourseDetailModal } from './CourseDetailModal';
import { usePlannerStore } from '../store/usePlannerStore';

export const App: React.FC = () => {
  const { activeTab } = usePlannerStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration discrepancy with local storage state
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/isotipo.png"
            alt="Academy Space"
            className="w-12 h-12 object-contain animate-pulse"
          />
          <div className="flex items-center text-sm font-black tracking-tight font-sans">
            <span className="text-sky-400">Academy</span>
            <span className="text-amber-400 ml-1">Space</span>
          </div>
          <p className="text-xs font-mono text-zinc-500">Cargando Plan Curricular...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header & Metrics Bar */}
      <div>
        <HeaderMetrics />

        {/* Academic Program Sub-Header (Outside the header) */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-900">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-zinc-100 tracking-tight font-sans">
                  Plan Curricular
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Plan 2023 • 200 CR
                </span>
                <span className="px-2.5 py-0.5 text-xs font-mono font-medium rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                  UPN
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Facultad de Ingeniería •{' '}
                <strong className="text-zinc-200 font-medium">
                  Ingeniería de Sistemas Computacionales
                </strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400">
                Sede: <strong className="text-zinc-200">Lima Centro</strong>
              </span>
              <span className="text-xs font-mono px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
                Acreditación ABET
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Workspace Container */}
        <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {activeTab === 'malla' && <CurriculumGrid />}
          {activeTab === 'simulador' && <CyclePlanner />}
          {activeTab === 'arbol' && <PrerequisiteTree />}
          {activeTab === 'auditoria' && <DegreeAudit />}
        </main>
      </div>

      {/* Slide-over Course Detail Modal */}
      <CourseDetailModal />

      {/* Corporate Academic Footer matching official portal mockup */}
      <footer className="w-full border-t border-zinc-900 bg-black py-6 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500 mt-12">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-center md:text-left">
            <span>© 2024 - 2026 Universidad Privada del Norte</span>
            <span>•</span>
            <span>Facultad de Ingeniería (Ingeniería de Sistemas Computacionales)</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">Acreditada ABET</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-zinc-400">
            <a
              href="#reglamento"
              onClick={(e) => {
                e.preventDefault();
                alert('Reglamento de Grados y Títulos UPN: Requiere 200 créditos aprobados, 360 horas de prácticas preprofesionales, tesis aprobada y suficiencia en idioma inglés.');
              }}
              className="hover:text-zinc-200 transition-colors"
            >
              Reglamento de Grados y Títulos
            </a>
            <a
              href="#guia"
              onClick={(e) => {
                e.preventDefault();
                alert('Guía de Matrícula UPN: Mínimo 12 créditos, máximo 22 créditos permitidos por semestre regular.');
              }}
              className="hover:text-zinc-200 transition-colors"
            >
              Guía de Matrícula
            </a>
            <a
              href="#ayuda"
              onClick={(e) => {
                e.preventDefault();
                alert('Mesa de Ayuda Académica UPN: contacto soporte directores de carrera facultad de ingeniería.');
              }}
              className="hover:text-zinc-200 transition-colors"
            >
              Mesa de Ayuda Académica
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
