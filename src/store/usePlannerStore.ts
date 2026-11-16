import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course, CourseStatus, ViewTab } from '../types/curriculum';
import curriculumData from '../data/curriculum.json';

const courses: Course[] = curriculumData as Course[];

export interface AcademicProfile {
  studentName: string;
  studentCode: string;
  campus: string;
  modality: string;
  curriculumPlan: string;
  academicStanding: string;
  termName: string;
  career: string;
}

interface PlannerState {
  // Course State Collections
  approvedCourses: string[];
  enrolledCourses: string[];
  plannedCourses: string[];
  courseGrades: Record<string, number>;
  selectedElectives: Record<string, string>;

  // UI state
  activeTab: ViewTab;
  selectedCourseId: string | null;
  hoveredCourseId: string | null;
  cycleFilter: number | null; // null = all cycles
  searchQuery: string;
  typeFilter: 'TODOS' | 'HABILITADOS' | 'OBLIGATORIOS' | 'ELECTIVOS' | 'PRESENCIAL' | 'VIRTUAL';
  sortBy: 'CYCLE_ASC' | 'CYCLE_DESC' | 'CREDITS_DESC' | 'NAME_ASC';

  // Profile
  profile: AcademicProfile;

  // Actions
  setActiveTab: (tab: ViewTab) => void;
  setSelectedCourseId: (id: string | null) => void;
  setHoveredCourseId: (id: string | null) => void;
  setCycleFilter: (cycle: number | null) => void;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (filter: 'TODOS' | 'HABILITADOS' | 'OBLIGATORIOS' | 'ELECTIVOS' | 'PRESENCIAL' | 'VIRTUAL') => void;
  setSortBy: (sort: 'CYCLE_ASC' | 'CYCLE_DESC' | 'CREDITS_DESC' | 'NAME_ASC') => void;

  // Academic Actions
  toggleApprovedCourse: (courseId: string, customGrade?: number) => void;
  toggleEnrolledCourse: (courseId: string) => void;
  togglePlannedCourse: (courseId: string) => { success: boolean; message?: string };
  removePlannedCourse: (courseId: string) => void;
  clearPlannedCourses: () => void;
  selectElective: (courseId: string, optionCode: string) => void;
  setCourseGrade: (courseId: string, grade: number) => void;

  // Preset profiles
  loadDefaultMockProfile: () => void;
  resetAllProgress: () => void;
  approveAllPrerequisitesFor: (courseId: string) => void;

  // Queries & Computations
  getCourse: (courseId: string) => Course | undefined;
  getCourseStatus: (courseId: string) => CourseStatus;
  getAncestors: (courseId: string) => string[];
  getDescendants: (courseId: string) => string[];
  getApprovedCredits: () => number;
  getEnrolledCredits: () => number;
  getPlannedCredits: () => number;
  getPendingCredits: () => number;
  getWeightedAverage: () => number;
  getWorkloadBreakdown: () => { ht: number; hp: number; hl: number; pc: number; totalHours: number };
  getScheduleCollisions: () => { hasCollisions: boolean; conflictingSlots: string[] };
}

// Initial realistic baseline matching the UPN 4th-cycle student profile shown in reference mockups
const initialApprovedCourses = [
  // Ciclo 1 (18 CR)
  'RRHH1101', 'MATH1002', 'SIST1101A', 'HUMA1306', 'LENG1001',
  // Ciclo 2 (18 CR)
  'MATH1003', 'COMP1201A', 'INVE1101', 'IDIO1401', 'LENG1002',
  // Ciclo 3 (22 CR)
  'MATH1101A', 'SIST1102A', 'MATH1103', 'FISI1204A', 'IDIO1402', 'LENG1003',
  // Ciclo 4 (parcial = 10 CR aprobados en adelanto / convalidación)
  'INFO1120A', 'FISI1206A', 'OPER1305' // 2 + 4 + 4 = 10 CR -> Total = 68 CR
];

const initialEnrolledCourses = [
  'SIST1201A', // Estructura de Datos (4 CR)
  'MATH1202A', // Cálculo 2 (5 CR)
  'STAT1203A', // Probabilidad y Estadística (5 CR)
  'SIST1202A', // Técnicas POO (5 CR)
  'HUMA1111'   // Responsabilidad Social (2 CR)
  // Total = 21 CR
];

const initialPlannedCourses = [
  'ISOF1201',  // Base de Datos (4 CR)
  'ISOF1301',  // Modelamiento de Software (5 CR)
  'ITEC1303',  // Sistemas Operativos (4 CR)
  'COMP1302',  // Interacción Humano Computador (4 CR)
  'HUMA1406'   // Proyecto Social (1 CR)
  // Total = 18 CR
];

const initialGrades: Record<string, number> = {
  RRHH1101: 18,
  MATH1002: 15,
  SIST1101A: 17,
  HUMA1306: 16,
  LENG1001: 15,
  MATH1003: 16,
  COMP1201A: 16,
  INVE1101: 17,
  IDIO1401: 19,
  LENG1002: 16,
  MATH1101A: 14,
  SIST1102A: 18,
  MATH1103: 15,
  FISI1204A: 16,
  IDIO1402: 18,
  LENG1003: 17,
  INFO1120A: 18,
  FISI1206A: 15,
  OPER1305: 16,
};

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      approvedCourses: initialApprovedCourses,
      enrolledCourses: initialEnrolledCourses,
      plannedCourses: initialPlannedCourses,
      courseGrades: initialGrades,
      selectedElectives: {
        ELECTIVO_1: 'COMP1502',
        ELECTIVO_2: 'ISOF1521A',
      },

      activeTab: 'malla',
      selectedCourseId: null,
      hoveredCourseId: null,
      cycleFilter: null,
      searchQuery: '',
      typeFilter: 'TODOS',
      sortBy: 'CYCLE_ASC',

      profile: {
        studentName: 'Carlos Mendoza Salazar',
        studentCode: 'N00248190',
        campus: 'Lima Centro',
        modality: 'Presencial / Híbrida',
        curriculumPlan: 'Plan 2023 (200 CR)',
        academicStanding: 'Ciclo Regular IV',
        termName: '2025-I',
        career: 'Ingeniería de Sistemas Computacionales',
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedCourseId: (id) => set({ selectedCourseId: id }),
      setHoveredCourseId: (id) => set({ hoveredCourseId: id }),
      setCycleFilter: (cycle) => set({ cycleFilter: cycle }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setTypeFilter: (filter) => set({ typeFilter: filter }),
      setSortBy: (sort) => set({ sortBy: sort }),

      getCourse: (courseId: string) => courses.find((c) => c.id === courseId),

      getCourseStatus: (courseId: string): CourseStatus => {
        const { approvedCourses, enrolledCourses } = get();
        if (approvedCourses.includes(courseId)) return 'APROBADO';
        if (enrolledCourses.includes(courseId)) return 'MATRICULADO';

        const course = courses.find((c) => c.id === courseId);
        if (!course) return 'BLOQUEADO';

        if (!course.prerequisites || course.prerequisites.length === 0) {
          return 'HABILITADO';
        }

        const allPrereqsMet = course.prerequisites.every((reqId) =>
          approvedCourses.includes(reqId)
        );

        return allPrereqsMet ? 'HABILITADO' : 'BLOQUEADO';
      },

      getAncestors: (courseId: string): string[] => {
        const ancestors = new Set<string>();
        const queue: string[] = [courseId];
        const visited = new Set<string>();

        while (queue.length > 0) {
          const currentId = queue.shift()!;
          if (visited.has(currentId)) continue;
          visited.add(currentId);

          const course = courses.find((c) => c.id === currentId);
          if (course && course.prerequisites) {
            for (const prereq of course.prerequisites) {
              ancestors.add(prereq);
              queue.push(prereq);
            }
          }
        }

        return Array.from(ancestors);
      },

      getDescendants: (courseId: string): string[] => {
        const descendants = new Set<string>();
        const queue: string[] = [courseId];
        const visited = new Set<string>();

        while (queue.length > 0) {
          const currentId = queue.shift()!;
          if (visited.has(currentId)) continue;
          visited.add(currentId);

          const dependents = courses.filter((c) => c.prerequisites.includes(currentId));
          for (const dep of dependents) {
            descendants.add(dep.id);
            queue.push(dep.id);
          }
        }

        return Array.from(descendants);
      },

      toggleApprovedCourse: (courseId: string, customGrade?: number) => {
        const { approvedCourses, enrolledCourses, plannedCourses, courseGrades } = get();
        const isApproved = approvedCourses.includes(courseId);

        if (isApproved) {
          // If un-approving, we also un-approve downstream courses that depend on this
          const descendants = get().getDescendants(courseId);
          const newApproved = approvedCourses.filter(
            (id) => id !== courseId && !descendants.includes(id)
          );
          const newGrades = { ...courseGrades };
          delete newGrades[courseId];
          descendants.forEach((d) => delete newGrades[d]);

          set({
            approvedCourses: newApproved,
            courseGrades: newGrades,
          });
        } else {
          // Approving course
          const newApproved = [...approvedCourses, courseId];
          const newEnrolled = enrolledCourses.filter((id) => id !== courseId);
          const newPlanned = plannedCourses.filter((id) => id !== courseId);
          const newGrades = {
            ...courseGrades,
            [courseId]: customGrade || courseGrades[courseId] || 16,
          };

          set({
            approvedCourses: newApproved,
            enrolledCourses: newEnrolled,
            plannedCourses: newPlanned,
            courseGrades: newGrades,
          });
        }
      },

      toggleEnrolledCourse: (courseId: string) => {
        const { enrolledCourses, approvedCourses, plannedCourses } = get();
        if (approvedCourses.includes(courseId)) return;

        const isEnrolled = enrolledCourses.includes(courseId);
        if (isEnrolled) {
          set({
            enrolledCourses: enrolledCourses.filter((id) => id !== courseId),
          });
        } else {
          set({
            enrolledCourses: [...enrolledCourses, courseId],
            plannedCourses: plannedCourses.filter((id) => id !== courseId),
          });
        }
      },

      togglePlannedCourse: (courseId: string) => {
        const { plannedCourses, getCourseStatus, getCourse, getPlannedCredits } = get();
        const isPlanned = plannedCourses.includes(courseId);

        if (isPlanned) {
          set({
            plannedCourses: plannedCourses.filter((id) => id !== courseId),
          });
          return { success: true };
        }

        const status = getCourseStatus(courseId);
        if (status !== 'HABILITADO') {
          return {
            success: false,
            message: 'Solo se pueden planificar cursos con prerrequisitos 100% aprobados.',
          };
        }

        const course = getCourse(courseId);
        if (!course) return { success: false, message: 'Curso no encontrado.' };

        const currentCredits = getPlannedCredits();
        if (currentCredits + course.credits > 22) {
          return {
            success: false,
            message: `Supera el límite de matrícula UPN (22 Créditos máximos). Actual: ${currentCredits} CR + ${course.credits} CR = ${currentCredits + course.credits} CR.`,
          };
        }

        set({
          plannedCourses: [...plannedCourses, courseId],
        });
        return { success: true };
      },

      removePlannedCourse: (courseId: string) => {
        const { plannedCourses } = get();
        set({
          plannedCourses: plannedCourses.filter((id) => id !== courseId),
        });
      },

      clearPlannedCourses: () => {
        set({ plannedCourses: [] });
      },

      selectElective: (courseId: string, optionCode: string) => {
        const { selectedElectives } = get();
        set({
          selectedElectives: {
            ...selectedElectives,
            [courseId]: optionCode,
          },
        });
      },

      setCourseGrade: (courseId: string, grade: number) => {
        const { courseGrades } = get();
        set({
          courseGrades: {
            ...courseGrades,
            [courseId]: Math.max(0, Math.min(20, grade)),
          },
        });
      },

      loadDefaultMockProfile: () => {
        set({
          approvedCourses: initialApprovedCourses,
          enrolledCourses: initialEnrolledCourses,
          plannedCourses: initialPlannedCourses,
          courseGrades: initialGrades,
        });
      },

      resetAllProgress: () => {
        set({
          approvedCourses: [],
          enrolledCourses: [],
          plannedCourses: [],
          courseGrades: {},
        });
      },

      approveAllPrerequisitesFor: (courseId: string) => {
        const ancestors = get().getAncestors(courseId);
        const { approvedCourses, courseGrades } = get();
        const merged = Array.from(new Set([...approvedCourses, ...ancestors]));
        const updatedGrades = { ...courseGrades };
        ancestors.forEach((id) => {
          if (!updatedGrades[id]) updatedGrades[id] = 16;
        });

        set({
          approvedCourses: merged,
          courseGrades: updatedGrades,
        });
      },

      getApprovedCredits: (): number => {
        const { approvedCourses } = get();
        return approvedCourses.reduce((sum, id) => {
          const c = courses.find((course) => course.id === id);
          return sum + (c?.credits || 0);
        }, 0);
      },

      getEnrolledCredits: (): number => {
        const { enrolledCourses } = get();
        return enrolledCourses.reduce((sum, id) => {
          const c = courses.find((course) => course.id === id);
          return sum + (c?.credits || 0);
        }, 0);
      },

      getPlannedCredits: (): number => {
        const { plannedCourses } = get();
        return plannedCourses.reduce((sum, id) => {
          const c = courses.find((course) => course.id === id);
          return sum + (c?.credits || 0);
        }, 0);
      },

      getPendingCredits: (): number => {
        const approved = get().getApprovedCredits();
        const enrolled = get().getEnrolledCredits();
        return Math.max(0, 200 - approved - enrolled);
      },

      getWeightedAverage: (): number => {
        const { approvedCourses, courseGrades } = get();
        if (approvedCourses.length === 0) return 0;

        let totalWeightedPoints = 0;
        let totalCreditsWithGrades = 0;

        for (const id of approvedCourses) {
          const course = courses.find((c) => c.id === id);
          const grade = courseGrades[id];
          if (course && typeof grade === 'number') {
            totalWeightedPoints += grade * course.credits;
            totalCreditsWithGrades += course.credits;
          }
        }

        if (totalCreditsWithGrades === 0) return 0;
        return Number((totalWeightedPoints / totalCreditsWithGrades).toFixed(2));
      },

      getWorkloadBreakdown: () => {
        const { plannedCourses } = get();
        let ht = 0;
        let hp = 0;
        let hl = 0;
        let pc = 0;

        for (const id of plannedCourses) {
          const c = courses.find((course) => course.id === id);
          if (c) {
            ht += c.ht || 0;
            hp += c.hp || 0;
            hl += c.hl || 0;
            pc += c.pc || 0;
          }
        }

        return {
          ht,
          hp,
          hl,
          pc,
          totalHours: ht + hp + hl + pc,
        };
      },

      getScheduleCollisions: () => {
        const { plannedCourses } = get();
        const slotMap: Record<string, string[]> = {};
        const conflictingSlots: string[] = [];

        for (const id of plannedCourses) {
          const c = courses.find((course) => course.id === id);
          if (c?.schedule) {
            for (const s of c.schedule) {
              const key = `${s.day} ${s.timeSlot}`;
              if (!slotMap[key]) {
                slotMap[key] = [];
              }
              slotMap[key].push(c.name);
            }
          }
        }

        for (const [slot, courseNames] of Object.entries(slotMap)) {
          if (courseNames.length > 1) {
            conflictingSlots.push(`${slot} (${courseNames.join(' con ')})`);
          }
        }

        return {
          hasCollisions: conflictingSlots.length > 0,
          conflictingSlots,
        };
      },
    }),
    {
      name: 'upn-planner-state-v1',
      partialize: (state) => ({
        approvedCourses: state.approvedCourses,
        enrolledCourses: state.enrolledCourses,
        plannedCourses: state.plannedCourses,
        courseGrades: state.courseGrades,
        selectedElectives: state.selectedElectives,
        activeTab: state.activeTab,
      }),
    }
  )
);
