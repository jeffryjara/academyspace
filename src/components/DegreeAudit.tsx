import React from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  FileCheck,
  Shield,
  Layers,
  BookOpen,
  Briefcase,
  Globe,
  Sparkles,
} from 'lucide-react';
import { usePlannerStore } from '../store/usePlannerStore';
import type { AcademicArea, Course } from '../types/curriculum';
import curriculumData from '../data/curriculum.json';

const allCourses: Course[] = curriculumData as Course[];

export const DegreeAudit: React.FC = () => {
  const {
    getApprovedCredits,
    getEnrolledCredits,
    getPendingCredits,
    approvedCourses,
    enrolledCourses,
    getWeightedAverage,
    profile,
  } = usePlannerStore();

  const approvedCredits = getApprovedCredits();
  const enrolledCredits = getEnrolledCredits();
  const pendingCredits = getPendingCredits();
  const progressPercent = Math.min(100, Math.round((approvedCredits / 200) * 100));
  const weightedAverage = getWeightedAverage();

  // Areas computation
  const areas: AcademicArea[] = [
    'Ingeniería de Software',
    'Ciencias Básicas',
    'Datos & IA',
    'Redes & Infraestructura',
    'Hardware & Robótica',
    'Investigación',
    'Desarrollo Personal & Empleabilidad',
    'Estudios Generales',
  ];

  const areaStats = areas.map((area) => {
    const coursesInArea = allCourses.filter((c) => c.area === area);
    const totalCredits = coursesInArea.reduce((sum, c) => sum + c.credits, 0);
    const approved = coursesInArea
      .filter((c) => approvedCourses.includes(c.id))
      .reduce((sum, c) => sum + c.credits, 0);
    const percent = totalCredits > 0 ? Math.round((approved / totalCredits) * 100) : 0;

    return {
      area,
      totalCredits,
      approvedCredits: approved,
      percent,
      courseCount: coursesInArea.length,
    };
  });

  // Graduation Milestones verification
  const isPracticasApproved = approvedCourses.includes('INVE1446A');
  const isTesis1Approved = approvedCourses.includes('INVE1580A');
  const isTesis2Approved = approvedCourses.includes('INVE1644A');
  const isEnglish1Approved = approvedCourses.includes('IDIO1401');
  const isEnglish2Approved = approvedCourses.includes('IDIO1402');
  const isElective1Approved = approvedCourses.includes('ELECTIVO_1');
  const isElective2Approved = approvedCourses.includes('ELECTIVO_2');
  const isSocialProjectApproved = approvedCourses.includes('HUMA1406');

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-mono text-zinc-100">
              Auditoría Académica y Requisitos de Grado
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Seguimiento de cumplimiento de los 200 Créditos Académicos, competencias ABET y requisitos obligatorios para la obtención del Grado de Bachiller en Ingeniería de Sistemas Computacionales.
          </p>
        </div>

        {/* Global Progress Gauge Tile */}
        <div className="flex items-center gap-4 bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 self-stretch md:self-auto">
          <div className="text-right">
            <span className="text-[11px] font-mono text-zinc-500 block uppercase">
              Progreso de Titulación
            </span>
            <span className="text-2xl font-bold font-mono text-amber-400">
              {progressPercent}%
            </span>
            <span className="text-[11px] font-mono text-zinc-400 block">
              {approvedCredits} de 200 Créditos
            </span>
          </div>

          <div className="w-14 h-14 rounded-full border-4 border-zinc-800 border-t-amber-500 border-r-amber-500 flex items-center justify-center font-mono text-xs font-bold text-zinc-200">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Graduation Milestones Checklist */}
      <div className="glass-panel rounded-2xl p-6 border border-zinc-800/80">
        <h3 className="text-sm font-bold font-mono text-zinc-100 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>Hitos Obligatorios de Graduación (Ley Universitaria & UPN)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Milestone 1 */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isPracticasApproved
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
            }`}
          >
            {isPracticasApproved ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-xs text-zinc-200">
                Prácticas Preprofesionales (360 hrs)
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                INVE1446A (8 Créditos) • Inmersión laboral en TI con evaluación empresarial.
              </p>
              <span className="mt-2 inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                {isPracticasApproved ? 'Cumplido' : 'Pendiente (Ciclo VIII)'}
              </span>
            </div>
          </div>

          {/* Milestone 2 */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isTesis1Approved && isTesis2Approved
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
            }`}
          >
            {isTesis1Approved && isTesis2Approved ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-xs text-zinc-200">
                Tesis de Grado e Investigación
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                INVE1580A & INVE1644A (16 Créditos) • Proyecto final y sustentación pública.
              </p>
              <span className="mt-2 inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                {isTesis2Approved
                  ? 'Tesis Aprobada'
                  : isTesis1Approved
                  ? 'Taller 1 Aprobado'
                  : 'Pendiente (Ciclos IX - X)'}
              </span>
            </div>
          </div>

          {/* Milestone 3 */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isEnglish1Approved && isEnglish2Approved
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
            }`}
          >
            {isEnglish1Approved && isEnglish2Approved ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-xs text-zinc-200">
                Idioma Extranjero (Inglés A2)
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                IDIO1401 & IDIO1402 • Certificación Cambridge / Centro de Idiomas.
              </p>
              <span className="mt-2 inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                {isEnglish1Approved && isEnglish2Approved
                  ? 'Requisito de Idioma Acreditado'
                  : 'En curso'}
              </span>
            </div>
          </div>

          {/* Milestone 4 */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isElective1Approved && isElective2Approved
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
            }`}
          >
            {isElective1Approved && isElective2Approved ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-xs text-zinc-200">
                Cursos Electivos de Mención
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                ELECTIVO_1 & ELECTIVO_2 (4 Créditos) • Cloud, Videojuegos o Big Data.
              </p>
              <span className="mt-2 inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                {isElective1Approved && isElective2Approved
                  ? '2 Electivos Aprobados'
                  : 'Pendiente selección'}
              </span>
            </div>
          </div>

          {/* Milestone 5 */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isSocialProjectApproved
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
            }`}
          >
            {isSocialProjectApproved ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Clock className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold text-xs text-zinc-200">
                Responsabilidad y Proyecto Social
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                HUMA1406 & HUMA1111 • Intervención comunitaria de impacto tecnológico.
              </p>
              <span className="mt-2 inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                {isSocialProjectApproved ? 'Acreditado' : 'Pendiente (Ciclo VII)'}
              </span>
            </div>
          </div>

          {/* Milestone 6 */}
          <div className="p-4 rounded-xl border bg-zinc-950/60 border-zinc-800 text-zinc-400 flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs text-zinc-200">
                Acreditación Internacional ABET
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Cumplimiento del Student Outcome Portfolio y Capstone Project (INVE1535).
              </p>
              <span className="mt-2 inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                En evaluación continua
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Area Breakdown Progress Bars */}
      <div className="glass-panel rounded-2xl p-6 border border-zinc-800/80">
        <h3 className="text-sm font-bold font-mono text-zinc-100 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Avance por Áreas de Formación Profesional</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {areaStats.map((stat) => (
            <div
              key={stat.area}
              className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-zinc-200">{stat.area}</span>
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {stat.percent}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-2">
                  <span>{stat.courseCount} Asignaturas</span>
                  <span>
                    {stat.approvedCredits} / {stat.totalCredits} Créditos
                  </span>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                  style={{ width: `${stat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
