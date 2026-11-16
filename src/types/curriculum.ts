export type DeliveryMode = 'P' | 'V_ASYNC' | 'V_SYNC'; // Presencial (P), Virtual Asíncrono (*), Virtual Síncrono (**)

export type CourseStatus = 'APROBADO' | 'MATRICULADO' | 'HABILITADO' | 'BLOQUEADO';

export type AcademicArea =
  | 'Ciencias Básicas'
  | 'Ingeniería de Software'
  | 'Datos & IA'
  | 'Redes & Infraestructura'
  | 'Hardware & Robótica'
  | 'Investigación'
  | 'Desarrollo Personal & Empleabilidad'
  | 'Estudios Generales';

export interface ElectiveOption {
  code: string;
  name: string;
}

export interface ScheduleBlock {
  day: 'LUN' | 'MAR' | 'MIÉ' | 'JUE' | 'VIE' | 'SÁB';
  timeSlot: '07:30 - 10:00' | '10:15 - 12:45' | '13:45 - 16:15' | '16:30 - 19:00';
  room: string;
  type: 'Teoría' | 'Práctica' | 'Laboratorio';
}

export interface Course {
  id: string;
  name: string;
  cycle: number;
  credits: number;
  ht: number; // Horas Teoría
  hp: number; // Horas Práctica
  hl: number; // Horas Laboratorio
  pc: number; // Práctica de Campo
  mode: DeliveryMode;
  prerequisites: string[]; // Course IDs required
  isElective?: boolean;
  electiveGroup?: 1 | 2;
  electiveOptions?: ElectiveOption[];
  area?: AcademicArea;
  description?: string;
  competencies?: string[];
  professor?: {
    name: string;
    email: string;
    campus: string;
  };
  schedule?: ScheduleBlock[];
  capacity?: {
    available: number;
    total: number;
  };
}

export interface UserAcademicState {
  approvedCourses: string[];
  enrolledCourses: string[];
  plannedCourses: string[];
  courseGrades: Record<string, number>;
  selectedElectives: Record<string, string>;
}

export type ViewTab = 'malla' | 'simulador' | 'arbol' | 'auditoria';
