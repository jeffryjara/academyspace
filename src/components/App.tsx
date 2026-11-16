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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 animate-pulse flex items-center justify-center font-bold text-zinc-950 font-mono">
            UPN
          </div>
          <p className="text-xs font-mono text-zinc-500">Cargando Portal Curricular...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header & Metrics Bar */}
      <div>
        <HeaderMetrics />

        {/* Dynamic Workspace Container */}
        <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'malla' && <CurriculumGrid />}
          {activeTab === 'simulador' && <CyclePlanner />}
          {activeTab === 'arbol' && <PrerequisiteTree />}
          {activeTab === 'auditoria' && <DegreeAudit />}
        </main>
      </div>

      {/* Slide-over Course Detail Modal */}
      <CourseDetailModal />

      {/* Corporate Academic Footer matching official portal mockup */}
      <footer className="w-full border-t border-zinc-800/80 bg-zinc-950/80 py-6 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500 mt-12">
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
