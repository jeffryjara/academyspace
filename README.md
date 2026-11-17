# <img src="public/isotipo.png" width="36" height="36" align="center" alt="Academy Space Logo" /> Academy Space

> **Academic Progress Tracker & Semester Simulator**  
> **Carrera:** Ingeniería de Sistemas Computacionales  
> **Institución:** Universidad Privada del Norte (UPN) — Plan de Estudios 2023 (200 Créditos Totales)  
> **Acreditación:** Criterios Internacionales ABET  

---

## 🌟 Descripción General

**Academy Space** es una plataforma web interactiva de alto rendimiento diseñada para estudiantes y directores de carrera de Ingeniería de Sistemas Computacionales. Permite visualizar, simular y auditar el avance curricular a lo largo de los 10 ciclos académicos, validando en tiempo real las reglas de prerrequisitos, límites de carga crediticia (12 a 22 CR) y colisiones de horarios entre sesiones teóricas y laboratorios.

---

## 🚀 Características Principales

### 1. 📊 Malla Curricular Interactiva (10 Ciclos — 200 CR)
* **Tablero Kanban Horizontal:** Visualización por columnas (Ciclo 01 a Ciclo 10) con progreso porcentual y suma de créditos en vivo.
* **Motor Reactivo de Grafo (DAG):** Al pasar el cursor sobre cualquier asignatura, se iluminan automáticamente sus **prerrequisitos previos** (verde esmeralda) y los **cursos desbloqueados** (azul cielo).
* **Filtros Avanzados:** Búsqueda en tiempo real por código, nombre o prerrequisito, y filtrado por estado (`Todos`, `Habilitados`, `Obligatorios`, `Electivos`, `Presencial [P]`, `Virtual [*, **]`).
* **Acciones en Lote:** Botón de simulación para aprobar ciclos completos con un solo clic.

### 2. 🗓️ Simulador y Planificador de Matrícula
* **Validación de Límites UPN:** Control de carga académica en el rango oficial permitido (Mínimo 12 CR / Máximo 22 CR).
* **Detección de Cruces de Horario:** Detección de colisiones de día y franja horaria entre teoría y laboratorios.
* **Horario Semanal Simulado:** Matriz horaria semanal (Lunes a Sábado, 4 turnos: `07:30-10:00`, `10:15-12:45`, `13:45-16:15`, `16:30-19:00`) con asignación visual de aulas y laboratorios.
* **Pre-Matrícula Oficial:** Emisión de comprobante de matrícula validado con efectos de celebración (*canvas-confetti*).

### 3. ⚡ Drawer Lateral & Simulador de Efecto Dominó
* **Ficha Técnica Detallada:** Horas semanales desglosadas (HT: Teoría, HP: Práctica, HL: Laboratorio, PC: Campo), competencias ABET y docente asignado.
* **Líneas Electivas:** Selección interactiva de especialidad para Electivo 1 (Videojuegos, Telecomunicaciones, Cloud) y Electivo 2 (Evolución de Software, E-Business, BPM).
* **Simulador de Efecto Dominó:** Slider de nota proyectada (11 a 20) que simula la aprobación inmediata y desbloquea en cascada todas las asignaturas dependientes.

### 4. 🌳 Árbol de Prerrequisitos y Dependencias
* Visualización en árbol y filtrado por tracks formativos:
  * *Ingeniería de Software*
  * *Datos e Inteligencia Artificial*
  * *Redes y Ciberseguridad*
  * *Ciencias Básicas y Matemáticas*
  * *Investigación y Tesis*

### 5. 🎓 Auditoría de Grado & Competencias ABET
* Monitoreo de los 200 Créditos Totales hacia la obtención del Grado de Bachiller.
* Checklist de requisitos obligatorios según la Ley Universitaria:
  * Prácticas Preprofesionales (8 CR / 360 horas acreditadas)
  * Tesis de Grado (Taller de Tesis 1 y 2 - 16 CR)
  * Suficiencia de Idioma Extranjero (Inglés A2)
  * Proyecto Social y Responsabilidad Social Universitaria
  * Cursos Electivos de Mención completados

---

## 🛠️ Tecnologías Utilizadas

* **Framework Base:** [Astro 5+](https://astro.build/) (Arquitectura de Islas para máxima velocidad y carga estática/SSR).
* **Componentes Interactivos:** [React 19+](https://react.dev/) (Componentes funcionales y hooks reactivos).
* **Gestor de Estado Global:** [Zustand](https://zustand.docs.pmnd.rs/) con persistencia en `localStorage`.
* **Estilos & Diseño:** [Tailwind CSS v3](https://tailwindcss.com/) con tema dark personalizado, micro-bordes y efectos glassmorphism.
* **Iconografía:** [Lucide React](https://lucide.dev/).
* **Microinteracciones:** [canvas-confetti](https://www.npmjs.com/package/canvas-confetti).
* **Gestor de Paquetes:** [pnpm](https://pnpm.io/).

---

## 📁 Estructura del Proyecto

```text
academyspace/
├── public/
│   ├── favicon.png             # Icono de pestaña (Isotipo Academy Space)
│   ├── favicon.svg             # Icono vectorial fallback
│   └── isotipo.png             # Isotipo oficial de la plataforma
├── src/
│   ├── components/
│   │   ├── App.tsx             # Componente raíz de la isla React
│   │   ├── HeaderMetrics.tsx   # Header principal con métricas en tiempo real
│   │   ├── CurriculumGrid.tsx  # Tablero Kanban de 10 columnas
│   │   ├── CourseCard.tsx      # Tarjeta interactiva con iluminación de dependencias
│   │   ├── CyclePlanner.tsx    # Simulador con horario semanal y detección de cruces
│   │   ├── CourseDetailModal.tsx # Drawer lateral con ficha y efecto dominó
│   │   ├── PrerequisiteTree.tsx # Árbol visual por líneas de especialidad
│   │   └── DegreeAudit.tsx     # Auditoría de grado y competencias ABET
│   ├── data/
│   │   └── curriculum.json     # Dataset completo: 50 asignaturas, 200 CR y horarios
│   ├── layouts/
│   │   └── MainLayout.astro    # Layout base con tipografías Inter y JetBrains Mono
│   ├── pages/
│   │   └── index.astro         # Punto de entrada principal
│   ├── store/
│   │   └── usePlannerStore.ts  # Motor de grafos y validación reactiva Zustand
│   ├── styles/
│   │   └── global.css          # Estilos globales y utilidades de scrollbar y glass
│   └── types/
│       └── curriculum.ts       # Definiciones e interfaces TypeScript
├── astro.config.mjs
├── tailwind.config.cjs
├── postcss.config.cjs
├── package.json
└── tsconfig.json
```

---

## 💻 Instalación y Ejecución

### Prerrequisitos
* **Node.js** >= 18.0.0
* **pnpm** >= 9.0.0

### Pasos

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/jeffryjara/academyspace.git
   cd academyspace
   ```

2. Instalar dependencias:
   ```bash
   pnpm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   pnpm dev
   ```
   Abre [http://localhost:4321](http://localhost:4321) en tu navegador.

4. Compilar para producción:
   ```bash
   pnpm build
   ```

5. Previsualizar la versión de producción localmente:
   ```bash
   pnpm preview
   ```

---

## 🎨 Paleta de Colores y Guía de Estilos

| Elemento | Token Tailwind | Color Hex | Descripción |
| :--- | :--- | :--- | :--- |
| **Fondo Principal** | `bg-zinc-950` | `#09090b` | Dark slate ultra-minimalista |
| **Tarjetas Glass** | `bg-zinc-900/70` | `rgba(24, 24, 27, 0.7)` | Fondo translúcido con desenfoque de 12px |
| **Aprobado** | `text-emerald-400` | `#34d399` | Indicador de curso completado |
| **Matriculado** | `text-sky-400` | `#38bdf8` | Curso en progreso actual |
| **Habilitado** | `text-amber-400` | `#fbbf24` | Curso apto para matrícula |
| **Bloqueado** | `text-zinc-600` | `#52525b` | Falta cumplir prerrequisitos |
| **Academy Brand** | `text-sky-400` | `#38bdf8` | Azul institucional |
| **Space Brand** | `text-amber-400` | `#fbbf24` | Amarillo institucional |

---

## 📄 Licencia

Este proyecto ha sido desarrollado con fines académicos y de simulación para el programa de **Ingeniería de Sistemas Computacionales** de la **Universidad Privada del Norte**. Todos los derechos reservados © 2024 - 2026.
