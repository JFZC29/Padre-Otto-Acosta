/* ==========================================================================
   data.js — Datos institucionales y contenido de demostración
   ---------------------------------------------------------------
   Estos textos son EDITABLES: cambia los nombres, cargos e historias según
   la información real de la institución. Los campos {es, en} permiten tener
   versión en español e inglés.
   ========================================================================== */

/* ---- Autoridades y docentes (EDITAR nombres, cargos y fotos) ---- */
const FYA_STAFF = [
  { nombre: "Nombre Apellido", rol: { es: "Directora", en: "Principal" }, extra: { es: "", en: "" }, img: null },
  { nombre: "Nombre Apellido", rol: { es: "Vicerrectora", en: "Vice-Principal" }, extra: { es: "", en: "" }, img: null },
  { nombre: "Nombre Apellido", rol: { es: "Coordinadora Pedagógica", en: "Curriculum Coordinator" }, extra: { es: "", en: "" }, img: null },
  { nombre: "Nombre Apellido", rol: { es: "Subnivel Preparatoria y Elemental", en: "Preparatory & Elementary level" }, extra: { es: "", en: "" }, img: null },
  { nombre: "Nombre Apellido", rol: { es: "Subnivel Media", en: "Middle School level" }, extra: { es: "", en: "" }, img: null },
  { nombre: "Nombre Apellido", rol: { es: "Docente de Educación Física", en: "Physical Education teacher" }, extra: { es: "", en: "" }, img: null },
  { nombre: "Nombre Apellido", rol: { es: "Docente de Cultura Estética", en: "Arts teacher" }, extra: { es: "", en: "" }, img: null },
  { nombre: "Nombre Apellido", rol: { es: "Docente de Inglés", en: "English teacher" }, extra: { es: "", en: "" }, img: null }
];

/* ---- Noticias de demostración (reemplazadas por Firestore cuando se configura) ---- */
const FYA_DEMO_NEWS = [
  {
    id: "demo-1",
    fecha: "2026-08-15",
    categoria: "academico",
    destacado: true,
    imagen: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=60",
    titulo: { es: "Jornada de lectura y escritura creativa", en: "Creative reading and writing event" },
    contenido: {
      es: "<p>Nuestros estudiantes de Educación Elemental participaron en una maravillosa jornada de animación lectora con cuentacuentos, talleres de creación de historias y una feria del libro organizada por la comunidad educativa.</p><p>Fomentar el hábito lector es una de nuestras prioridades pedagógicas. [EDITAR contenido]</p>",
      en: "<p>Our Elementary School students took part in a wonderful reading session with storytelling, story-creating workshops and a book fair organised by the school community.</p><p>Building the reading habit is one of our teaching priorities. [EDITABLE content]</p>"
    }
  },
  {
    id: "demo-2",
    fecha: "2026-07-02",
    categoria: "deportes",
    destacado: true,
    imagen: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=60",
    titulo: { es: "Intercursos de fútbol y atletismo", en: "Football and athletics school games" },
    contenido: {
      es: "<p>Durante dos semanas se realizaron los intercursos de fútbol y atletismo entre los subniveles Elemental y Media. El deporte fortalece el trabajo en equipo, la disciplina y la sana convivencia.</p><p>¡Gracias a los docentes y familias que acompañaron cada partido! [EDITAR contenido]</p>",
      en: "<p>For two weeks we held the football and athletics school games across the Elementary and Middle levels. Sports strengthen teamwork, discipline and healthy coexistence.</p><p>Thanks to the teachers and families who cheered every game! [EDITABLE content]</p>"
    }
  },
  {
    id: "demo-3",
    fecha: "2026-06-10",
    categoria: "cultural",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=60",
    titulo: { es: "Festival de expresión artística y danza", en: "Arts and dance festival" },
    contenido: {
      es: "<p>La comunidad educativa celebró el Festival de Expresión Artística con exposiciones de pintura, artesanías y presentaciones de danza y música tradicional ecuatoriana.</p><p>El arte es un pilar de nuestra formación integral. [EDITAR contenido]</p>",
      en: "<p>Our school community celebrated the Arts Festival with painting exhibitions, crafts and traditional Ecuadorian dance and music performances.</p><p>Art is a pillar of our integral education. [EDITABLE content]</p>"
    }
  },
  {
    id: "demo-4",
    fecha: "2026-05-20",
    categoria: "comunidad",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=60",
    titulo: { es: "Minga de limpieza y aula ambiental", en: "Community clean-up and eco classroom" },
    contenido: {
      es: "<p>Familias, docentes y estudiantes participaron en una minga para mantener limpios nuestros espacios y sembramos la primera huerta del aula ambiental.</p><p>Cuidar la casa común es parte del carisma de Fe y Alegría. [EDITAR contenido]</p>",
      en: "<p>Families, teachers and students joined a community clean-up to keep our spaces tidy and we planted the first vegetable garden of our eco classroom.</p><p>Caring for our common home is part of the Fe y Alegría charism. [EDITABLE content]</p>"
    }
  }
];

/* ---- Galería de demostración (reemplazada por Firestore cuando se configura) ---- */
const FYA_DEMO_GALLERY = [
  { id: "demo-g1", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=60", descripcion: { es: "Inicio del año escolar", en: "Start of the school year" }, categoria: "comunidad", destacado: true },
  { id: "demo-g2", url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=60", descripcion: { es: "Clases de matemática", en: "Math class" }, categoria: "academico", destacado: true },
  { id: "demo-g3", url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=60", descripcion: { es: "Preparatoria jugando y aprendiendo", en: "Preparatory playing and learning" }, categoria: "academico", destacado: true },
  { id: "demo-g4", url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=60", descripcion: { es: "Fútbol intercursos", en: "Football school games" }, categoria: "deportes", destacado: false },
  { id: "demo-g5", url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=60", descripcion: { es: "Docente y proyecto de aula", en: "Teacher with a class project" }, categoria: "academico", destacado: false },
  { id: "demo-g6", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=60", descripcion: { es: "Pintura y arte", en: "Painting and arts" }, categoria: "cultural", destacado: false },
  { id: "demo-g7", url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=60", descripcion: { es: "Trabajo en equipo", en: "Teamwork" }, categoria: "academico", destacado: false },
  { id: "demo-g8", url: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=900&q=60", descripcion: { es: "Minga comunitaria", en: "Community clean-up" }, categoria: "comunidad", destacado: false },
  { id: "demo-g9", url: "https://images.unsplash.com/photo-1581068423898-3ff2bbb954e3?auto=format&fit=crop&w=900&q=60", descripcion: { es: "Taller de lectoescritura", en: "Reading and writing workshop" }, categoria: "academico", destacado: false },
  { id: "demo-g10", url: "https://images.unsplash.com/photo-1535687554732-4c1f37d7e1e0?auto=format&fit=crop&w=900&q=60", descripcion: { es: "Día de la familia", en: "Family day" }, categoria: "comunidad", destacado: false },
  { id: "demo-g11", url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=60", descripcion: { es: "Planificación docente", en: "Teacher planning meeting" }, categoria: "academico", destacado: false },
  { id: "demo-g12", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=60", descripcion: { es: "Laboratorio de ciencias", en: "Science lab" }, categoria: "academico", destacado: false }
];

/* Imagen por defecto si una foto no carga */
const FYA_PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='800' height='500' fill='#2a232a'/><circle cx='400' cy='210' r='70' fill='#f7b500'/><path d='M400 140c60 74 92 120 92 173a92 92 0 1 1-184 0c0-53 32-99 92-173z' fill='#d81b26'/><text x='400' y='420' font-family='Arial' font-size='26' fill='#cfc4be' text-anchor='middle'>Padre Otto Acosta</text></svg>"
);