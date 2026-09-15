/* ==========================================================================
   admin.js — Panel de administración
   Login con Firebase Auth + CRUD de noticias y galería en Firestore +
   subida de imágenes a Firebase Storage.
   En "modo demostración" (sin Firebase configurado) muestra avisos.
   ========================================================================== */

(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const today = () => new Date().toISOString().slice(0, 10);

  let currentUser = null;
  let newsDocs = [];
  let galleryDocs = [];
  let staffDocs = [];

  const configured = () => fyaInitFirebase();

  /* Evita que una operación de Firebase se quede cargando para siempre:
     si no responde en X segundos, lanza un error visible. */
  function withTimeout(promise, ms, label) {
    return Promise.race([
      Promise.resolve(promise),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(
          'Tiempo de espera excedido en "' + label + '". Revisa tu conexión y que los servicios de Firebase estén habilitados (Authentication, Firestore y Storage).'
        )), ms)
      )
    ]);
  }

  function friendlyError(err) {
    if (!err) return 'Error desconocido.';
    const code = err.code || '';
    if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-login-credentials') {
      return 'Correo o contraseña incorrectos. Verifica tus datos.';
    }
    if (code === 'auth/invalid-email') return 'Correo electrónico inválido.';
    if (code === 'auth/network-request-failed') return 'No hay conexión a internet. Reinténtalo.';
    if (code === 'permission-denied') return 'No tienes permisos. Inicia sesión con la cuenta administradora.';
    if (code === 'unavailable') return 'Firebase (Firestore/Storage) no está disponible. Verifica que esté habilitado en la consola.';
    return (err.message || String(err));
  }

  /* Avisos integrados en el diseño del panel (en vez de alert()) */
  let toastTimer = null;
  function showToast(message, type) {
    const t = $('#adminToast');
    t.textContent = message;
    t.className = 'admin-toast ' + (type || 'info');
    void t.offsetWidth;
    t.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-show'), 5200);
  }
  const toastOk = (m) => showToast(m, 'success');
  const toastErr = (m) => showToast(m, 'error');

  /* Confirmación integrada (en vez de confirm()) */
  function askConfirm(message) {
    return new Promise(resolve => {
      const modal = $('#adminConfirm');
      const ok = $('#confirmOk');
      const cancel = $('#confirmCancel');
      $('#confirmBody').textContent = message;
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      ok.focus();
      const done = (result) => {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        ok.removeEventListener('click', onOk);
        cancel.removeEventListener('click', doneFalse);
        document.removeEventListener('keydown', onKey);
        resolve(result);
      };
      const onOk = () => done(true);
      const doneFalse = () => done(false);
      const onKey = (e) => { if (e.key === 'Escape') done(false); };
      ok.addEventListener('click', onOk);
      cancel.addEventListener('click', doneFalse);
      document.addEventListener('keydown', onKey);
    });
  }

  /* ---------------- aviso demo ---------------- */
  function setupDemoBanner() {
    const banner = $('#adminDemoBanner');
    if (configured()) { banner.classList.add('hidden'); return; }
    banner.classList.remove('hidden');
    banner.innerHTML = '<strong>Modo demostración:</strong> configura Firebase (js/firebase-config.js) para poder iniciar sesión y publicar. Mira el README.md para la guía paso a paso.';
  }

  /* ---------------- Login / Logout ---------------- */
  function showLogin() { $('#loginView').classList.remove('hidden'); $('#dashboardView').classList.add('hidden'); }
  function showDashboard() {
    $('#loginView').classList.add('hidden');
    $('#dashboardView').classList.remove('hidden');
    $('#adminTopbar').style.display = 'flex';
    $('#logoutBtn').style.display = 'inline-flex';
    if (currentUser) $('#adminUser').textContent = currentUser.email;
  }

  function initAuth() {
    const configWarn = $('#loginConfigWarn');
    if (!configured()) {
      configWarn.classList.remove('hidden');
      $('#loginBtn').addEventListener('click', e => {
        e.preventDefault();
        configWarn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }
    configWarn.classList.add('hidden');

    const form = $('#loginForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('#loginBtn');
      const err = $('#loginError');
      err.textContent = '';
      btn.disabled = true;
      btn.textContent = 'Ingresando…';
      try {
        const cred = await withTimeout(
          firebase.auth().signInWithEmailAndPassword(
            $('#liMail').value.trim(),
            $('#liPass').value
          ),
          20000,
          'inicio de sesión'
        );
        currentUser = cred.user;
        showDashboard();
      } catch (ex) {
        console.error('Error de login:', ex);
        err.textContent = friendlyError(ex);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Entrar';
      }
    });

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        currentUser = user;
        showDashboard();
        loadNews();
        loadGallery();
        loadStaff();
        loadCounters();
      } else {
        currentUser = null;
        showLogin();
      }
    });

    $('#logoutBtn').addEventListener('click', () => firebase.auth().signOut());
  }

  /* ---------------- Tabs ---------------- */
  function initTabs() {
    $$('.dash-tab').forEach(tab => tab.addEventListener('click', () => {
      $$('.dash-tab').forEach(x => x.classList.remove('is-active'));
      tab.classList.add('is-active');
      $$('.tab-panel').forEach(p => p.classList.add('hidden'));
      $('#tab-' + tab.dataset.tab).classList.remove('hidden');
    }));
  }

  /* ---------------- Noticias CRUD ---------------- */
  function loadNews() {
    if (!configured()) return;
    withTimeout(
      firebase.firestore().collection(FYA_COLLECTIONS.noticias).orderBy('fecha', 'desc').get(),
      20000,
      'carga de noticias'
    )
      .then(snapshot => {
        newsDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        renderNewsList();
      })
      .catch(err => console.error('Error cargando noticias', err));
  }

  function renderNewsList() {
    const list = $('#newsList');
    if (!newsDocs.length) {
      list.innerHTML = '<p class="empty-admin">Aún no hay publicaciones. ¡Crea la primera!</p>';
      return;
    }
    list.innerHTML = newsDocs.map(n => `
      <div class="admin-item" data-id="${esc(n.id)}">
        <div class="thumb ${n.imagen ? '' : 'no-img'}">
          ${n.imagen ? `<img src="${esc(n.imagen)}" alt="" onerror="this.parentNode.classList.add('no-img');this.remove()">` : 'FYA'}
        </div>
        <div class="admin-item-body">
          <h3>${esc(n.tituloEs || '(sin título)')}</h3>
          <div class="admin-item-meta">
            <span>${esc(n.categoria)}</span>
            <span>${esc(n.fecha || '')}</span>
            ${n.destacado ? '<span>★ destacada</span>' : ''}
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="icon-btn edit" data-edit="${esc(n.id)}" title="Editar" aria-label="Editar">
            <svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button class="icon-btn del" data-del="${esc(n.id)}" title="Eliminar" aria-label="Eliminar">
            <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    $$('#newsList .edit').forEach(b => b.addEventListener('click', () => editNews(b.dataset.edit)));
    $$('#newsList .del').forEach(b => b.addEventListener('click', async () => {
      if (!await askConfirm('¿Eliminar esta publicación? Esta acción no se puede deshacer.')) return;
      await firebase.firestore().collection(FYA_COLLECTIONS.noticias).doc(b.dataset.del).delete();
      loadNews();
    }));
  }

  function fillForm(n) {
    $('#newsFormTitle').textContent = n ? 'Editar publicación' : 'Nueva publicación';
    $('#nbNewsId').value = n ? n.id : '';
    $('#nbTituloEs').value = n && n.tituloEs ? n.tituloEs : '';
    $('#nbTituloEn').value = n && n.tituloEn ? n.tituloEn : '';
    $('#nbContenidoEs').value = n && n.contenidoEs ? n.contenidoEs : '';
    $('#nbContenidoEn').value = n && n.contenidoEn ? n.contenidoEn : '';
    $('#nbCategoria').value = n && n.categoria ? n.categoria : 'academico';
    $('#nbFechaLoc').value = n && n.fecha ? n.fecha : today();
    $('#nbDestacado').checked = !!(n && n.destacado);
    window._editingNews = n || null;
    /* vista previa de imagen existente */
    const prev = $('#nbPreview');
    if (n && n.imagen) { prev.src = n.imagen; prev.alt = 'Imagen actual'; prev.classList.remove('hidden'); }
    else { prev.classList.add('hidden'); }
    $('#newsForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function editNews(id) {
    const n = newsDocs.find(x => x.id === id);
    if (n) fillForm(n);
  }

  /* Convierte y comprime una imagen en el navegador, devolviendo un
     data URL (imagen embebida). Así se guarda en Firestore directamente
     y NO se necesita Firebase Storage ni ningún plan de pago. */
  function compressImage(file, maxDim, quality) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        const outType = /png/i.test(file.type) && !/jpe?g/i.test(file.type) ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(outType, quality));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('No se pudo leer la imagen. Usa un archivo JPG, PNG o WebP.'));
      };
      img.src = url;
    });
  }

  async function uploadImage(file, folder) {
    let dataUrl = await compressImage(file, 1400, 0.72);
    /* Firestore permite documentos de hasta 1 MB: si aún pesa mucho, se re-comprime */
    if (dataUrl.length > 800 * 1024) {
      dataUrl = await compressImage(file, 900, 0.62);
    }
    if (dataUrl.length > 950 * 1024) {
      throw new Error('La imagen comprimida aún es muy grande para Firestore (máx. ~1 MB). Elige una foto más liviana.');
    }
    return dataUrl;
  }

  function initNewsForm() {
    $('#nbReset').addEventListener('click', () => { fillForm(null); $('#nbImagen').value = ''; });
    $('#nbImagen').addEventListener('change', e => {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        const prev = $('#nbPreview');
        prev.src = reader.result;
        prev.classList.remove('hidden');
      };
      reader.readAsDataURL(f);
    });

    $('#newsForm').addEventListener('submit', async (e) => {
      e.preventDefault();
if (!configured()) {
        toastErr('Debes configurar Firebase (js/firebase-config.js) antes de guardar. Revisa el README.md.');
        return;
      }
      const btn = $('#nbSubmit');
      const data = {
        tituloEs: $('#nbTituloEs').value.trim(),
        tituloEn: $('#nbTituloEn').value.trim(),
        contenidoEs: $('#nbContenidoEs').value.trim(),
        contenidoEn: $('#nbContenidoEn').value.trim(),
        categoria: $('#nbCategoria').value,
        fecha: $('#nbFechaLoc').value || today(),
        destacado: $('#nbDestacado').checked,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      if (!data.tituloEs || !data.contenidoEs) {
        toastErr('El título y el contenido en español son obligatorios.');
        return;
      }
      const file = $('#nbImagen').files[0];
      const editingId = $('#nbNewsId').value;
      btn.disabled = true;
      btn.textContent = 'Guardando…';
      try {
        if (file) {
          data.imagen = await withTimeout(uploadImage(file, 'noticias'), 40000, 'subida de imagen');
        } else if (window._editingNews && window._editingNews.imagen) {
          data.imagen = window._editingNews.imagen;
        }
        const col = firebase.firestore().collection(FYA_COLLECTIONS.noticias);
        if (editingId) {
          await withTimeout(col.doc(editingId).set(data, { merge: true }), 20000, 'guardado en Firestore');
        } else {
          data.creadoEn = firebase.firestore.FieldValue.serverTimestamp();
          await withTimeout(col.add(data), 20000, 'guardado en Firestore');
        }
        fillForm(null);
        $('#nbImagen').value = '';
        loadNews();
        toastOk('¡Publicación guardada!');
      } catch (err) {
        console.error('Error guardando noticia:', err);
        toastErr('Error al guardar: ' + friendlyError(err));
      } finally {
        btn.disabled = false;
        btn.textContent = 'Publicar';
      }
    });
  }

  /* ---------------- Galería CRUD ---------------- */
  function loadGallery() {
    if (!configured()) return;
    withTimeout(
      firebase.firestore().collection(FYA_COLLECTIONS.galeria).orderBy('creadoEn', 'desc').get(),
      20000,
      'carga de galería'
    )
      .then(snapshot => {
        galleryDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        renderGalleryList();
      })
      .catch(err => console.error('Error cargando galería', err));
  }

  function renderGalleryList() {
    const box = $('#galleryManager');
    if (!galleryDocs.length) {
      box.innerHTML = '<p class="empty-admin">La galería está vacía. Sube tus primeras fotos.</p>';
      return;
    }
    box.innerHTML = galleryDocs.map(g => `
      <div class="g-item">
        <img src="${esc(g.url)}" alt="" loading="lazy" onerror="this.remove()">
        <span class="g-cap">${esc((g.descripcionEs || '') + (g.descripcionEn ? ' / ' + g.descripcionEn : ''))}</span>
        <button class="g-del" data-del="${esc(g.id)}" aria-label="Eliminar fotografía">✕</button>
      </div>
    `).join('');
    $$('#galleryManager .g-del').forEach(b => b.addEventListener('click', async () => {
      if (!await askConfirm('¿Eliminar esta fotografía del sitio?')) return;
      await firebase.firestore().collection(FYA_COLLECTIONS.galeria).doc(b.dataset.del).delete();
      loadGallery();
    }));
  }

  function initGalleryForm() {
    const form = $('#galleryForm');
    $('#gbImagen').addEventListener('change', e => {
      const box = $('#galleryPreview');
      const list = Array.from(e.target.files);
      box.innerHTML = '';
      if (!list.length) return;
      list.forEach((f, i) => {
        const reader = new FileReader();
        reader.onload = ev => {
          const fig = document.createElement('figure');
          fig.className = 'gallery-preview-item';
          fig.innerHTML = '<img src="' + esc(ev.target.result) + '" alt="Vista previa ' + (i + 1) + '">';
          box.appendChild(fig);
        };
        reader.readAsDataURL(f);
      });
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!configured()) {
        toastErr('Debes configurar Firebase (js/firebase-config.js) antes de subir fotos. Revisa el README.md.');
        return;
      }
      const files = Array.from($('#gbImagen').files);
      if (!files.length) return;
      const descEs = $('#gbDescripcionEs').value.trim();
      const descEn = $('#gbDescripcionEn').value.trim();
      const cat = $('#gbCategoria').value;
      const btn = $('#gbSubmit');
      const bar = $('#galleryProgress');
      const barFill = $('#galleryProgressBar');
      btn.disabled = true;
      bar.classList.remove('hidden');
      barFill.style.width = '0%';
      let done = 0;
      try {
        for (const f of files) {
          const url = await withTimeout(uploadImage(f, 'galeria'), 40000, 'subida de imagen');
          await withTimeout(
            firebase.firestore().collection(FYA_COLLECTIONS.galeria).add({
              url,
              descripcionEs: descEs,
              descripcionEn: descEn,
              categoria: cat,
              destacado: false,
              creadoEn: firebase.firestore.FieldValue.serverTimestamp()
            }),
            20000,
            'guardado en Firestore'
          );
          done++;
          barFill.style.width = Math.round((done / files.length) * 100) + '%';
        }
        form.reset();
        $('#galleryPreview').innerHTML = '';
        loadGallery();
        toastOk('¡Se subieron ' + done + ' fotografía(s)!');
      } catch (err) {
        console.error('Error subiendo fotos:', err);
        toastErr('Error al subir fotos: ' + friendlyError(err));
      } finally {
        btn.disabled = false;
        bar.classList.add('hidden');
      }
    });
  }

  /* ---------------- Autoridades CRUD ---------------- */
  function loadStaff() {
    if (!configured()) return;
    withTimeout(
      firebase.firestore().collection(FYA_COLLECTIONS.autoridades).orderBy('orden', 'asc').get(),
      20000,
      'carga de autoridades'
    )
      .then(snapshot => {
        staffDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        renderStaffList();
      })
      .catch(err => console.error('Error cargando autoridades', err));
  }

  function staffName(id, fallback) {
    const s = staffDocs.find(x => x.id === id);
    return s && s.nombre ? s.nombre : fallback;
  }

  function renderStaffList() {
    const list = $('#staffList');
    if (!staffDocs.length) {
      list.innerHTML = '<p class="empty-admin">Aún no hay autoridades registradas.</p>';
      return;
    }
    list.innerHTML = staffDocs.map((s, i) => `
      <div class="admin-item" data-id="${esc(s.id)}">
        <div class="thumb ${s.img ? '' : 'no-img'}">
          ${s.img ? `<img src="${esc(s.img)}" alt="" onerror="this.parentNode.classList.add('no-img');this.remove()">` : 'FYA'}
        </div>
        <div class="admin-item-body">
          <h3>${esc(s.nombre || '(sin nombre)')}</h3>
          <div class="admin-item-meta">
            <span>${esc(s.rolEs || '')}${s.rolEn ? ' / ' + esc(s.rolEn) : ''}</span>
            ${s.extraEs ? '<span>' + esc(s.extraEs) + '</span>' : ''}
          </div>
        </div>
        <div class="admin-item-actions">
          <button class="icon-btn up" data-up="${esc(s.id)}" title="Subir" aria-label="Subir">
            <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </button>
          <button class="icon-btn down" data-down="${esc(s.id)}" title="Bajar" aria-label="Bajar">
            <svg viewBox="0 0 24 24"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          </button>
          <button class="icon-btn edit" data-edit="${esc(s.id)}" title="Editar" aria-label="Editar">
            <svg viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </button>
          <button class="icon-btn del" data-del="${esc(s.id)}" title="Eliminar" aria-label="Eliminar">
            <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    $$('#staffList .edit').forEach(b => b.addEventListener('click', () => editStaff(b.dataset.edit)));
    $$('#staffList .del').forEach(b => b.addEventListener('click', async () => {
      if (!await askConfirm('¿Eliminar a ' + staffName(b.dataset.del, 'esta persona') + '?')) return;
      await firebase.firestore().collection(FYA_COLLECTIONS.autoridades).doc(b.dataset.del).delete();
      loadStaff();
    }));
    $$('#staffList .up').forEach(b => b.addEventListener('click', () => moveStaff(b.dataset.up, -1)));
    $$('#staffList .down').forEach(b => b.addEventListener('click', () => moveStaff(b.dataset.down, 1)));
  }

  function moveStaff(id, dir) {
    const idx = staffDocs.findIndex(x => x.id === id);
    const j = idx + dir;
    if (idx === -1 || j < 0 || j >= staffDocs.length) return;
    const tmp = staffDocs[idx];
    staffDocs[idx] = staffDocs[j];
    staffDocs[j] = tmp;
    const col = firebase.firestore().collection(FYA_COLLECTIONS.autoridades);
    staffDocs.forEach((s, k) => {
      if (s.orden !== k) col.doc(s.id).set({ orden: k }, { merge: true });
    });
    renderStaffList();
  }

  function fillStaffForm(s) {
    $('#staffFormTitle').textContent = s ? 'Editar autoridad' : 'Agregar autoridad';
    $('#stId').value = s ? s.id : '';
    $('#stNombre').value = s && s.nombre ? s.nombre : '';
    $('#stRolEs').value = s && s.rolEs ? s.rolEs : '';
    $('#stRolEn').value = s && s.rolEn ? s.rolEn : '';
    $('#stExtraEs').value = s && s.extraEs ? s.extraEs : '';
    $('#stExtraEn').value = s && s.extraEn ? s.extraEn : '';
    window._editingStaff = s || null;
    const prev = $('#stPreview');
    if (s && s.img) { prev.src = s.img; prev.classList.remove('hidden'); }
    else { prev.classList.add('hidden'); }
    $('#staffForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function editStaff(id) {
    const s = staffDocs.find(x => x.id === id);
    if (s) fillStaffForm(s);
  }

  function initStaffForm() {
    $('#stReset').addEventListener('click', () => { fillStaffForm(null); $('#stImg').value = ''; });
    $('#stImg').addEventListener('change', e => {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        const prev = $('#stPreview');
        prev.src = reader.result;
        prev.classList.remove('hidden');
      };
      reader.readAsDataURL(f);
    });

    $('#staffForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!configured()) {
        toastErr('Debes configurar Firebase (js/firebase-config.js) antes de guardar. Revisa el README.md.');
        return;
      }
      const data = {
        nombre: $('#stNombre').value.trim(),
        rolEs: $('#stRolEs').value.trim(),
        rolEn: $('#stRolEn').value.trim(),
        extraEs: $('#stExtraEs').value.trim(),
        extraEn: $('#stExtraEn').value.trim(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      if (!data.nombre || !data.rolEs) {
        toastErr('El nombre y el cargo son obligatorios.');
        return;
      }
      const file = $('#stImg').files[0];
      const editingId = $('#stId').value;
      const btn = $('#stSubmit');
      btn.disabled = true;
      btn.textContent = 'Guardando…';
      try {
        if (file) {
          data.img = await withTimeout(uploadImage(file, 'autoridades'), 40000, 'subida de imagen');
        } else if (window._editingStaff && window._editingStaff.img) {
          data.img = window._editingStaff.img;
        }
        const col = firebase.firestore().collection(FYA_COLLECTIONS.autoridades);
        if (editingId) {
          await withTimeout(col.doc(editingId).set(data, { merge: true }), 20000, 'guardado en Firestore');
        } else {
          data.orden = staffDocs.length;
          data.creadoEn = firebase.firestore.FieldValue.serverTimestamp();
          await withTimeout(col.add(data), 20000, 'guardado en Firestore');
        }
        fillStaffForm(null);
        $('#stImg').value = '';
        loadStaff();
        toastOk('¡Autoridad guardada!');
      } catch (err) {
        console.error('Error guardando autoridad:', err);
        toastErr('Error al guardar: ' + friendlyError(err));
      } finally {
        btn.disabled = false;
        btn.textContent = 'Guardar';
      }
    });
  }

  /* ---------------- Contadores CRUD ---------------- */
  function loadCounters() {
    if (!configured()) return;
    const doc = firebase.firestore().collection(FYA_COLLECTIONS.config).doc(FYA_DOCS.contadores);
    withTimeout(doc.get(), 20000, 'carga de contadores')
      .then(snap => {
        const x = snap.exists ? snap.data() : {};
        $('#ct1').value = (x.v1 != null) ? x.v1 : '';
        $('#ct2').value = (x.v2 != null) ? x.v2 : '';
        $('#ct3').value = (x.v3 != null) ? x.v3 : '';
        $('#ct4').value = (x.v4 != null) ? x.v4 : '';
      })
      .catch(err => console.error('Error cargando contadores', err));
  }

  function initCounterForm() {
    const form = $('#countersForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!configured()) {
        toastErr('Debes configurar Firebase (js/firebase-config.js) antes de guardar. Revisa el README.md.');
        return;
      }
      const values = ['ct1', 'ct2', 'ct3', 'ct4'].map(id => parseInt($('#' + id).value, 10));
      if (values.some(v => isNaN(v) || v < 0)) {
        toastErr('Ingresa números válidos (0 o más) en los cuatro contadores.');
        return;
      }
      const btn = $('#ctSubmit');
      btn.disabled = true;
      btn.textContent = 'Guardando…';
      try {
        const doc = firebase.firestore().collection(FYA_COLLECTIONS.config).doc(FYA_DOCS.contadores);
        await withTimeout(doc.set({
          v1: values[0], v2: values[1], v3: values[2], v4: values[3],
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }), 20000, 'guardado en Firestore');
        loadCounters();
        toastOk('¡Contadores guardados! Ya se ven en la página de inicio.');
      } catch (err) {
        console.error('Error guardando contadores:', err);
        toastErr('Error al guardar: ' + friendlyError(err));
      } finally {
        btn.disabled = false;
        btn.textContent = 'Guardar contadores';
      }
    });
  }

  /* ---------------- Init ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    fyaTheme.init();
    initI18n();
    setupDemoBanner();
    initTabs();
    initAuth();
    initNewsForm();
    initGalleryForm();
    initStaffForm();
    initCounterForm();
    /* En modo demo se puede "ensayar": guarda en localStorage local */
    if (!configured()) {
      $('#loginBtn').disabled = false;
    }
  });
})();