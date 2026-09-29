/* ==========================================================================
   i18n.js — Traducción español / inglés (botón en la cabecera)
   El HTML se escribe en español; el diccionario contiene las claves en
   inglés. Al pulsar el botón se intercambian los textos y placeholders
   marcados con data-i18n y data-i18n-ph.
   ========================================================================== */

const FYA_I18N = {
  "nav.home": "Home",
  "nav.about": "About us",
  "nav.offer": "Education offer",
  "nav.news": "News",
  "nav.gallery": "Gallery",
  "nav.staff": "Staff",
  "nav.contact": "Contact",

  "hero.eyebrow": "Network of Popular Education Movements",
  "hero.title": "Padre Otto Acosta<br/>Basic Education School",
  "hero.subtitle": "We educate children with quality, tenderness and social justice, together with Fe y Alegría Ecuador.",
  "hero.ctaNews": "See news",
  "hero.ctaContact": "Contact us",

  "intro.tag": "Welcome",
  "intro.title": "A community that welcomes, educates and transforms",
  "intro.p1": "We are a faith-based public educational institution of Fe y Alegría Ecuador, located in El Carmen – Manabí. We offer Basic General Education — Preparatory, Elementary and Middle School — committed to popular and inclusive education.",
  "intro.p2": "We accompany every student in building their skills, critical thinking, faith and commitment to the community under the motto: “All children in school, all of them in the dream of a fairer society.”",
  "intro.more": "Learn more",

  "stats.students": "Students",
  "stats.teachers": "Teachers & staff",
  "stats.grades": "Middle school years",
  "stats.levels": "Education levels",

  "history.tag": "Our history",
  "history.title": "Roots of faith, light and hope",
  "history.lead": "A journey through the milestones that gave life to our school.",
  "history.t1title": "Our school is born",
  "history.t1text": "The school was founded in La Fortuna, El Carmen canton, Manabí province, with 36 students under the name \"San Juan Bosco\" School, led by teacher Manuel Alfonso Ganchozo Valencia. Classes began at the home of Mr. Ansuino Muñoz and, the following year, a cane and straw hut was built on his land with the support of the family representatives.",
  "history.t2title": "Joining Fe y Alegría",
  "history.t2text": "Through the relationship between teacher Manuel Ganchozo and Mr. Jorge Rivera, the school became part of the popular education movement Fe y Alegría Ecuador.",
  "history.t3title": "A larger campus",
  "history.t3text": "Mrs. Teresa Ganchozo took over as principal and arranged the purchase of a one-hectare plot from Mr. Pedro Muñoz, thanks to the support of Father Jorge Gáleas and Father José Rivas, National Director of Fe y Alegría.",
  "history.t4title": "Inauguration of the new classrooms",
  "history.t4text": "On September 11 the new classrooms were inaugurated. Father José Rivas supported the construction of the well, cistern, water pump, main gate and furniture; together with Father Gáleas, the idea arose to rename the school \"Padre Otto Acosta Polith\".",
  "history.t5title": "New teachers",
  "history.t5text": "Teachers Líder Álava, Rocío Alarcón and Barón Alcívar joined the school, strengthening its teaching staff.",
  "history.t6title": "Leadership changes",
  "history.t6text": "In 2004 the direction passed to Yolanda Peñarrieta and in 2005 it returned to Mrs. Teresa Ganchozo, with the arrival of teacher Irene Zambrano.",
  "history.t7title": "Multi-purpose court",
  "history.t7text": "An agreement was signed with the El Carmen Municipality to build the multi-purpose court: construction began in 2005 and finished in 2008 thanks to the school community, led by the parent representatives.",
  "history.t8title": "Rocío Alarcón takes over",
  "history.t8text": "After an accident suffered by Mrs. Teresa Ganchozo, teacher Rocío Alarcón took over the direction.",
  "history.t9title": "Lolaida Cedeño's leadership and the computing lab",
  "history.t9text": "Since May, teacher Lolaida Cedeño has led the school, a role she holds to this day. The \"Plan Amanecer\" programme donated six computers, furniture and internet to start computing classes, led by teacher Melciades Muñoz.",
  "history.t10title": "A growing community",
  "history.t10text": "Teacher Tito Moreira and later Ms. Luz Álava joined the team. Our educational community has steadily faced every challenge and change in its history — one of its greatest strengths.",
  "history.t11title": "A new stage",
  "history.t11text": "After teacher Tito Moreira left the school, it became a single-teacher institution, with principal-teacher Narcisa Cedeño in charge.",

  "mvv.purposeTitle": "Institutional identity (purpose)",
  "mvv.purposeText": "The \"Padre Otto Acosta\" School of Fe y Alegría is an institution of Integral Popular Education, Social Promotion and Public Action. Starting from the diverse contexts and realities of the excluded and impoverished people of our community, we contribute to social transformation through a quality, innovative and participatory educational proposal. Our work is inspired by a transforming spirituality based on the gospel and on human and nature rights.",
  "mvv.philosophyTitle": "Philosophy",
  "mvv.philosophyText": "Fe y Alegría Ecuador is a Movement of Popular Education, Social Promotion, Public Action and Transforming Spirituality that, for more than sixty years, has contributed to the education of children, young people and adults, offering them critical tools to think about and transform society and to live according to gospel criteria guided by humanist values. It materialises in educational practices its desire to transform people and societies through shared meanings and, hand in hand with Popular Education, proposes a construction of knowledge so that, working from the interests of popular groups, people become critical subjects of their reality and commit to its transformation. To do so, it uses critical methodologies and pedagogies such as cultural negotiation and dialogues of knowledge, emphasising that what is learned does not stay only in the sphere of knowledge but, by recognising popular knowledge, makes it visible as a way of building more humane, equitable, fair relationships that respect cultural, social, ethnic, religious and political diversity; steering its work towards caring for others and for our common home, in order to overcome the relationships of inequity and exclusion.",
  "mvv.missionTitle": "Mission",
  "mvv.missionText": "Fe y Alegría - Ecuador is a Movement of Integral Popular Education, Social Promotion and Public Action that, based on the diverse contexts of excluded and impoverished communities and people in our country, contributes to social transformation through a quality, innovative and participatory educational proposal, grounded in the experience of a transforming spirituality inspired by the gospel and by human and nature rights.",
  "mvv.visionTitle": "Vision",
  "mvv.visionText": "We dream of an Ecuador where everyone has the same opportunities for a dignified life, with a more prophetic Fe y Alegría, committed to the care and defence of people and our common home, present at the new frontiers of exclusion and capable of responding to the contexts and educational needs of our country.",

  "offer.tag": "Teaching approach",
  "offer.title": "Education offer",
  "offer.lead": "We support every stage of our students' integral development.",
  "offer.preLevel": "First grade · Age 5",
  "offer.preTitle": "Preparatory",
  "offer.preText": "Development of communication, motor and social-emotional skills through play and exploration.",
  "offer.eleLevel": "Grades 2nd – 4th",
  "offer.eleTitle": "Elementary Education",
  "offer.eleText": "Strengthening communication and maths skills, with close support and a caring classroom atmosphere.",
  "offer.medLevel": "Grades 5th – 7th",
  "offer.medTitle": "Middle School",
  "offer.medText": "Research, critical thinking, arts and sports, building their life project and social commitment.",

  "news.tag": "Latest news",
  "news.title": "School news",
  "news.all": "All",
  "news.catAcademic": "Academic",
  "news.catSports": "Sports",
  "news.catCultural": "Cultural",
  "news.catCommunity": "Community",
  "news.read": "Read more",
  "news.empty": "No posts yet. Come back soon.",
  "news.destacado": "Featured",

  "gallery.tag": "Photo gallery",
  "gallery.title": "Photos & slideshows",
  "gallery.lead": "The moments that build our school community.",
  "gallery.all": "All",
  "gallery.catAcademic": "Academic",
  "gallery.catSports": "Sports",
  "gallery.catCultural": "Cultural",
  "gallery.catCommunity": "Community",
  "gallery.empty": "The gallery has no photos yet.",

  "staff.tag": "Our team",
  "staff.title": "Staff & teachers",
  "staff.lead": "The people who make the dream of quality and tender education possible.",

  "contact.tag": "Write to us",
  "contact.title": "Contact",
  "contact.addrTitle": "Address",
  "contact.addrText": "Fe y Alegría, El Carmen – Manabí, Ecuador",
  "contact.phoneTitle": "Phone",
  "contact.mailTitle": "Email",
  "contact.hoursTitle": "Office hours",
  "contact.hoursText": "Monday to Friday · 07:30 – 13:30",

  "form.name": "Name",
  "form.namePh": "Type your name",
  "form.mail": "Email address",
  "form.mailPh": "youremail@example.com",
  "form.msg": "Message",
  "form.msgPh": "Tell us how we can help…",
  "form.send": "Send message",

  "footer.about": "Popular, inclusive and quality education for children and teenagers in El Carmen.",
  "footer.links": "Links",
  "footer.lAbout": "History",
  "footer.lOffer": "Education offer",
  "footer.lNews": "News",
  "footer.lGallery": "Gallery",
  "footer.lContact": "Contact",
  "footer.links2": "Institutional",
  "footer.fya": "Fe y Alegría Ecuador",
  "footer.fyaInt": "Fe y Alegría International",
  "footer.minEduc": "Ministry of Education",
  "footer.contact": "Contact",
  "footer.addr": "El Carmen, Manabí – Ecuador",
  "footer.admin": "Administration",
  "footer.made": "Made with love by and for our school community.",

  "demoBanner": "Demo mode: configure Firebase (js/firebase-config.js) to enable online publishing.",
  "cat.academico": "Academic",
  "cat.deportes": "Sports",
  "cat.cultural": "Cultural",
  "cat.comunidad": "Community"
};

/* Textos en español de claves que se usan desde JavaScript (contenido
   dinámico), porque el resto del español vive directamente en el HTML. */
const FYA_ES_OVERRIDES = {
  "news.read": "Leer más",
  "news.destacado": "Destacada",
  "demoBanner": "Modo de demostración: configura Firebase para activar publicaciones en línea.",
  "cat.academico": "Académico",
  "cat.deportes": "Deportes",
  "cat.cultural": "Cultural",
  "cat.comunidad": "Comunidad"
};

let FYA_LANG = 'es';
let FYA_LANG_LISTENERS = [];
let FYA_ES_CAPTURED = false;

function getLang() { return FYA_LANG; }

function setLang(lang, save = true) {
  FYA_LANG = (lang === 'en') ? 'en' : 'es';
  if (save) {
    try { localStorage.setItem('fya_lang', FYA_LANG); } catch (e) {}
  }
  renderI18n();
  if (document.documentElement) {
    document.documentElement.lang = FYA_LANG;
    document.documentElement.setAttribute('data-lang', FYA_LANG);
  }
  if (document.title) {
    document.title = FYA_LANG === 'en'
      ? "Padre Otto Acosta Basic Education School · Fe y Alegría"
      : "Escuela de Educación Básica Padre Otto Acosta · Fe y Alegría";
  }
  FYA_LANG_LISTENERS.forEach(fn => { try { fn(FYA_LANG); } catch (e) {} });
}

/* Devuelve el texto de una clave según el idioma activo */
function t(key) {
  if (FYA_LANG === 'en' && FYA_I18N[key]) return FYA_I18N[key];
  if (FYA_ES_OVERRIDES[key]) return FYA_ES_OVERRIDES[key];
  return key;
}

/* Devuelve un texto de un objeto bilingüe { es, en } */
function tl(obj) {
  if (!obj) return '';
  if (FYA_LANG === 'en' && obj.en) return obj.en;
  return obj.es || obj.en || String(obj);
}

/* Guarda el texto en español original de los elementos estáticos.
   Debe ejecutarse antes de la primera traducción. */
function captureI18n() {
  if (FYA_ES_CAPTURED) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (!el.dataset.i18nOrig) el.dataset.i18nOrig = el.innerHTML;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    if (!el.dataset.i18nOrigPh) el.dataset.i18nOrigPh = el.placeholder;
  });
  FYA_ES_CAPTURED = true;
}

function renderI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (FYA_LANG === 'en') {
      const txt = FYA_I18N[el.dataset.i18n];
      if (txt) el.innerHTML = txt;
    } else if (el.dataset.i18nOrig) {
      el.innerHTML = el.dataset.i18nOrig;
    }
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    if (FYA_LANG === 'en') {
      const txt = FYA_I18N[el.dataset.i18nPh];
      if (txt) el.placeholder = txt;
    } else if (el.dataset.i18nOrigPh) {
      el.placeholder = el.dataset.i18nOrigPh;
    }
  });
  const demoBanner = document.getElementById('demoBannerText');
  if (demoBanner) demoBanner.textContent = t('demoBanner');
}

function onLanguageChange(fn) {
  FYA_LANG_LISTENERS.push(fn);
}

function initI18n() {
  captureI18n();
  let saved = 'es';
  try { saved = localStorage.getItem('fya_lang') || 'es'; } catch (e) {}
  setLang(saved, false);
  const btn = document.getElementById('langToggle');
  if (btn) {
    btn.addEventListener('click', () => setLang(getLang() === 'es' ? 'en' : 'es'));
  }
}

/* Etiqueta legible de una categoría según el idioma */
function categoryLabel(cat) {
  const label = t('cat.' + (cat || 'academico'));
  return label && label !== 'cat.' + (cat || 'academico') ? label : cat;
}