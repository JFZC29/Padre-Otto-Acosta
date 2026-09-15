/* ==========================================================================
   main.js — Lógica del sitio público
   Incluye: banner demo, menú, hero, contadores, animaciones scroll,
   noticias (Firestore o demo), carrusel, galería, lightbox y contacto.
   ========================================================================== */

(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  let NEWS = [];
  let GALLERY = [];
  let STAFF = [];
  let lightboxIndex = -1;

  /* ---------------- Firebase helpers ---------------- */
  async function fetchNews() {
    if (!fyaInitFirebase()) return FYA_DEMO_NEWS.slice();
    try {
      const snap = await firebase.firestore()
        .collection(FYA_COLLECTIONS.noticias)
        .orderBy('fecha', 'desc')
        .get();
      return snap.docs.map(d => {
        const x = d.data();
        return {
          id: d.id,
          fecha: x.fecha || '',
          categoria: x.categoria || 'academico',
          destacado: !!x.destacado,
          imagen: x.imagen || '',
          titulo: { es: x.tituloEs || '', en: x.tituloEn || '' },
          contenido: { es: x.contenidoEs || '', en: x.contenidoEn || '' }
        };
      });
    } catch (e) {
      console.error('Error cargando noticias:', e);
      return FYA_DEMO_NEWS.slice();
    }
  }

  async function fetchGallery() {
    if (!fyaInitFirebase()) return FYA_DEMO_GALLERY.slice();
    try {
      const snap = await firebase.firestore()
        .collection(FYA_COLLECTIONS.galeria)
        .orderBy('creadoEn', 'desc')
        .get();
      return snap.docs.map(d => {
        const x = d.data();
        return {
          id: d.id,
          url: x.url || '',
          categoria: x.categoria || 'academico',
          destacado: !!x.destacado,
          descripcion: { es: x.descripcionEs || '', en: x.descripcionEn || '' }
        };
      });
    } catch (e) {
      console.error('Error cargando galería:', e);
      return FYA_DEMO_GALLERY.slice();
    }
  }

  async function fetchStaff() {
    if (!fyaInitFirebase()) return FYA_STAFF.slice();
    try {
      const snap = await firebase.firestore()
        .collection(FYA_COLLECTIONS.autoridades)
        .orderBy('orden', 'asc')
        .get();
      return snap.docs.map(d => {
        const x = d.data();
        return {
          id: d.id,
          nombre: x.nombre || '',
          rol: { es: x.rolEs || '', en: x.rolEn || '' },
          extra: { es: x.extraEs || '', en: x.extraEn || '' },
          img: x.img || null
        };
      });
    } catch (e) {
      console.error('Error cargando autoridades:', e);
      return [];
    }
  }

  /* ---------------- Banner demo ---------------- */
  function initDemoBanner() {
    const banner = $('#demoBanner');
    if (!banner) return;
    if (fyaInitFirebase()) {
      banner.classList.add('hidden');
      return;
    }
    banner.classList.remove('hidden');
    $('#demoBannerText').textContent = t('demoBanner');
    $('#demoBannerClose').addEventListener('click', () => banner.classList.add('hidden'));
  }

  /* ---------------- Header / menú ---------------- */
  function initHeader() {
    const header = $('#siteHeader');
    const nav = $('#mainNav');
    const toggle = $('#navToggle');
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    $$('.main-nav a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* resaltar sección activa */
    const sections = $$('main section[id]');
    const linkByHash = {};
    $$('.main-nav a').forEach(a => {
      if (a.getAttribute('href').startsWith('#')) linkByHash[a.getAttribute('href')] = a;
    });
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting && linkByHash['#' + en.target.id]) {
          $$('.main-nav a').forEach(a => a.classList.remove('active'));
          linkByHash['#' + en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  function initScrollTop() {
    const btn = $('#scrollTop');
    const onScroll = () => btn.classList.toggle('is-visible', window.scrollY > 620);
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------- Hero slider ---------------- */
  const HERO_SLIDES = [
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1600&q=70",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=70",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=70"
  ];
  function initHero() {
    const slider = $('#heroSlider');
    if (!slider) return;
    slider.innerHTML = HERO_SLIDES.map((src, i) =>
      `<div class="slide${i === 0 ? ' is-active' : ''}" style="background-image:url('${src}')"></div>`
    ).join('');
    let idx = 0;
    setInterval(() => {
      const slides = $$('.slide', slider);
      if (!slides.length) return;
      slides[idx].classList.remove('is-active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('is-active');
    }, 5000);
  }

  /* ---------------- Contadores animados ---------------- */
  function applyCounters(vals) {
    const els = $$('.stat-card strong[data-count]');
    els.forEach((el, i) => {
      if (vals && vals[i] != null) el.dataset.count = parseInt(vals[i], 10) || 0;
    });
  }

  function loadCounters() {
    const els = $$('.stat-card strong[data-count]');
    if (!els.length) return;
    if (!fyaInitFirebase()) { initCounters(); return; }
    firebase.firestore().collection(FYA_COLLECTIONS.config).doc(FYA_DOCS.contadores).get()
      .then(doc => {
        if (doc.exists) {
          const x = doc.data();
          applyCounters([x.v1, x.v2, x.v3, x.v4]);
        }
        initCounters();
      })
      .catch(e => { console.error('Error cargando contadores:', e); initCounters(); });
  }

  function initCounters() {
    const els = $$('.stat-card strong[data-count]');
    if (!els.length) return;
    const opts = { threshold: 0.6 };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        animateCount(en.target, parseInt(en.target.dataset.count, 10));
      });
    }, opts);
    els.forEach(el => io.observe(el));
  }
  function animateCount(el, target) {
    const dur = 1400;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- Animaciones al hacer scroll (AOS) ---------------- */
  function initAOS() {
    const els = $$('.aos');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          io.unobserve(en.target);
          en.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el, i) => {
      if (el.dataset.aosDelay) el.style.transitionDelay = el.dataset.aosDelay * 0.14 + 's';
      io.observe(el);
    });
  }
  function observeNewlyAdded() {
    /* se vuelve a observar elementos dinámicos tras re-render */
    const els = $$('.aos:not(.is-visible)');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          io.unobserve(en.target);
          en.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => {
      if (el.dataset.aosDelay) el.style.transitionDelay = el.dataset.aosDelay * 0.14 + 's';
      io.observe(el);
    });
  }

  /* ---------------- Autoridades ---------------- */
  function renderStaff(list) {
    const grid = $('#staffGrid');
    if (!grid) return;
    const items = (list && list.length) ? list : [];
    if (!items.length) {
      grid.innerHTML = '<p class="staff-empty">La directiva se publicará aquí desde el panel de administración.</p>';
      return;
    }
    const initials = (n) => esc(n.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase());
    grid.innerHTML = items.map((s, i) => `
      <article class="staff-card aos" data-aos="fade-up" data-aos-delay="${i % 4}">
        <div class="staff-avatar">
          ${s.img ? `<img src="${esc(s.img)}" alt="${esc(s.nombre)}" onerror="this.parentNode.textContent='${initials(s.nombre)}'">` : initials(s.nombre)}
        </div>
        <h3>${esc(s.nombre)}</h3>
        <p class="staff-role">${esc(tl(s.rol))}</p>
        <p class="staff-extra">${esc(tl(s.extra))}</p>
      </article>
    `).join('');
    observeNewlyAdded();
  }

  /* ---------------- Noticias ---------------- */
  function initNews() {
    const filters = $$('#newsFilter .chip');
    filters.forEach(chip => chip.addEventListener('click', () => {
      filters.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const cat = chip.dataset.cat;
      $$('#newsGrid .news-card').forEach(card => {
        card.classList.toggle('is-hidden', cat !== 'todas' && card.dataset.cat !== cat);
      });
    }));
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      return new Date(iso + (iso.length === 10 ? 'T12:00:00' : '')).toLocaleDateString(
        getLang() === 'en' ? 'en-US' : 'es-EC',
        { day: 'numeric', month: 'long', year: 'numeric' }
      );
    } catch (e) { return iso; }
  }

  function renderNews(list) {
    NEWS = list;
    const grid = $('#newsGrid');
    const empty = $('#newsEmpty');
    if (!grid) return;
    if (!list.length) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');
    grid.innerHTML = list.map((n, i) => `
      <article class="news-card aos" data-aos="fade-up" data-aos-delay="${i % 3}" data-cat="${esc(n.categoria)}" data-id="${esc(n.id)}">
        <div class="news-media">
          <span class="badge ${n.destacado ? 'news-tag-destacado' : ''}">${n.destacado ? esc(t('news.destacado')) : esc(categoryLabel(n.categoria))}</span>
          <img src="${esc(n.imagen || FYA_PLACEHOLDER)}" alt="${esc(tl(n.titulo))}" loading="lazy" onerror="this.src='${FYA_PLACEHOLDER}'">
        </div>
        <div class="news-body">
          <span class="news-date">${formatDate(n.fecha)}</span>
          <h3>${esc(tl(n.titulo))}</h3>
          <p>${esc(stripHtml(tl(n.contenido)).slice(0, 130))}…</p>
          <button class="news-link" data-open="${esc(n.id)}">${esc(t('news.read'))}
            <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      </article>
    `).join('');
    $$('#newsGrid .news-link').forEach(b => b.addEventListener('click', () => openNews(b.dataset.open)));
    observeNewlyAdded();
  }

  function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html || '';
    return div.textContent || '';
  }

  function openNews(id) {
    const n = NEWS.find(x => x.id === id);
    if (!n) return;
    $('#modalImage').src = n.imagen || FYA_PLACEHOLDER;
    $('#modalImage').alt = esc(tl(n.titulo));
    $('#modalCategory').textContent = categoryLabel(n.categoria);
    $('#modalDate').textContent = formatDate(n.fecha);
    $('#modalTitle').textContent = tl(n.titulo);
    $('#modalContent').innerHTML = tl(n.contenido);
    openModal($('#newsModal'));
  }

  /* ---------------- Modal ---------------- */
  function openModal(m) {
    m.classList.add('is-open');
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(m) {
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function initModals() {
    const modal = $('#newsModal');
    modal.addEventListener('click', e => {
      if (e.target.hasAttribute('data-close') || e.target === modal) closeModal(modal);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeModal(modal);
        closeLightbox();
      }
    });
  }

  /* ---------------- Carrusel destacado ---------------- */
  let carTimer = null;
  function initCarousel() {
    const wrap = $('#featuredCarousel');
    if (!wrap) return;
    const featured = GALLERY.filter(g => g.destacado);
    const items = featured.length ? featured : GALLERY.slice();
    if (!items.length) return;
    wrap.innerHTML = items.map((g, i) => `
      <div class="carousel-slide${i === 0 ? ' is-active' : ''}" style="background-image:url('${esc(g.url)}')">
        <div class="carousel-caption">
          <h3>${esc(tl(g.descripcion) || '')}</h3>
          <p>${esc(categoryLabel(g.categoria))}</p>
        </div>
      </div>
    `).join('');
    const dots = $('#carDots');
    dots.innerHTML = items.map((_, i) => `<button aria-label="Diapositiva ${i + 1}"${i === 0 ? ' class="is-active"' : ''}></button>`).join('');

    let idx = 0;
    function go(i) {
      idx = (i + items.length) % items.length;
      $$('.carousel-slide', wrap).forEach((s, j) => s.classList.toggle('is-active', j === idx));
      $$('#carDots button').forEach((d, j) => d.classList.toggle('is-active', j === idx));
    }
    function auto() {
      carTimer = setInterval(() => go(idx + 1), 4500);
    }
    function reset(e) {
      clearInterval(carTimer);
      auto();
      const target = e.currentTarget;
      go(parseInt(target.classList.contains('prev') ? idx - 1 : idx + 1, 10));
    }
    $('#carNext').addEventListener('click', reset);
    $('#carPrev').addEventListener('click', reset);
    $('#carDots').addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      clearInterval(carTimer); auto();
      go($$('#carDots button').indexOf(btn));
    });
    /* pausa al pasar el ratón */
    wrap.addEventListener('mouseenter', () => clearInterval(carTimer));
    wrap.addEventListener('mouseleave', () => { clearInterval(carTimer); auto(); });
    auto();
  }

  /* ---------------- Galería + lightbox ---------------- */
  function initGallery() {
    const filters = $$('#galleryFilter .chip');
    filters.forEach(chip => chip.addEventListener('click', () => {
      filters.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const cat = chip.dataset.cat;
      $$('#galleryGrid .gallery-item').forEach(item => {
        item.classList.toggle('is-hidden', cat !== 'todas' && item.dataset.cat !== cat);
      });
    }));
  }

  function renderGallery(list) {
    GALLERY = list;
    const grid = $('#galleryGrid');
    const empty = $('#galleryEmpty');
    if (!grid) return;
    if (!list.length) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');
    grid.innerHTML = list.map((g, i) => `
      <figure class="gallery-item aos" data-aos="zoom-in" data-aos-delay="${i % 4}" data-cat="${esc(g.categoria)}" data-idx="${i}" tabindex="0" role="button" aria-label="${esc(tl(g.descripcion) || 'Fotografía')}">
        <span class="badge">${esc(categoryLabel(g.categoria))}</span>
        <img src="${esc(g.url)}" alt="${esc(tl(g.descripcion))}" loading="lazy" onerror="this.src='${FYA_PLACEHOLDER}'">
        <span class="gallery-overlay"><p>${esc(tl(g.descripcion))}</p></span>
      </figure>
    `).join('');
    $$('#galleryGrid .gallery-item').forEach(el => {
      el.addEventListener('click', () => openLightbox(parseInt(el.dataset.idx, 10)));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openLightbox(parseInt(el.dataset.idx, 10)); });
    });
    observeNewlyAdded();
  }

  function openLightbox(idx) {
    lightboxIndex = idx;
    updateLightbox();
    const lb = $('#lightbox');
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function updateLightbox() {
    if (lightboxIndex < 0 || !GALLERY.length) return;
    const g = GALLERY[lightboxIndex];
    $('#lightboxImg').src = g.url;
    $('#lightboxImg').alt = esc(tl(g.descripcion));
    $('#lightboxCaption').textContent = tl(g.descripcion) + (tl(g.descripcion) ? ' · ' : '') + categoryLabel(g.categoria);
  }
  function closeLightbox() {
    $('#lightbox').classList.remove('is-open');
    $('#lightbox').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function initLightbox() {
    $('.lightbox-close').addEventListener('click', closeLightbox);
    $('.lightbox-nav.prev').addEventListener('click', () => { lightboxIndex = (lightboxIndex - 1 + GALLERY.length) % GALLERY.length; updateLightbox(); });
    $('.lightbox-nav.next').addEventListener('click', () => { lightboxIndex = (lightboxIndex + 1) % GALLERY.length; updateLightbox(); });
    $('#lightbox').addEventListener('click', e => { if (e.target === $('#lightbox')) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!$('#lightbox').classList.contains('is-open')) return;
      if (e.key === 'ArrowLeft') { lightboxIndex = (lightboxIndex - 1 + GALLERY.length) % GALLERY.length; updateLightbox(); }
      if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % GALLERY.length; updateLightbox(); }
    });
  }

  /* ---------------- Contacto (mailto) ---------------- */
  function initContact() {
    const form = $('#contactForm');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const ok = form.checkValidity();
      if (!ok) { form.reportValidity(); return; }
      const name = $('#cName').value.trim();
      const mail = $('#cMail').value.trim();
      const msg = $('#cMsg').value.trim();
      const subject = encodeURIComponent('[Contacto web] ' + name);
      const body = encodeURIComponent('Nombre: ' + name + '\nCorreo: ' + mail + '\n\n' + msg);
      window.location.href = 'mailto:ottoacosta@feyalegria.org.ec?subject=' + subject + '&body=' + body;
      const status = $('#contactStatus');
      status.textContent = getLang() === 'en' ? 'Your email app has been opened. Thank you!' : 'Se abrió tu aplicación de correo. ¡Gracias!';
      status.className = 'form-status form-status-success';
      form.reset();
    });
    /* Valores de correo/acción EDITABLES en js/config de contacto */
  }

  /* ---------------- Init ---------------- */
  function init() {
    fyaTheme.init();
    initI18n();
    $('#year').textContent = new Date().getFullYear();

    initDemoBanner();
    initHeader();
    initScrollTop();
    initHero();
    loadCounters();
    initAOS();
    initNews();
    initModals();
    initGallery();
    initLightbox();
    initContact();

    /* Carga asíncrona de datos */
    Promise.all([fetchNews(), fetchGallery(), fetchStaff()]).then(([n, g, s]) => {
      STAFF = s;
      renderNews(n);
      renderGallery(g);
      renderStaff(s);
      initCarousel();
    });

    /* Re-traducir contenido dinámico al cambiar de idioma */
    onLanguageChange(() => {
      clearInterval(carTimer);
      renderNews(NEWS);
      renderGallery(GALLERY);
      renderStaff(STAFF);
      initCarousel();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();