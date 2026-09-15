# Escuela de Educación Básica Padre Otto Acosta · Fe y Alegría

Página web institucional responsive, dinámica y bilingüe (español / inglés).

## Características

- **Diseño 100% responsive**: se adapta a celulares, tablets, laptops y escritorio.
- **Colores institucionales Fe y Alegría**: rojo fuego + amarillo.
- **Modo claro / oscuro**: botón en la cabecera, recuerda tu preferencia.
- **Traducción ES ⇄ EN**: botón `ES / EN` en la cabecera (traducción local integrada).
- **Animaciones al hacer scroll**: suaves, solo `transform/opacity`, y se desactivan
  con la preferencia del sistema `prefers-reduced-motion`.
- **Noticias**: apartado con filtros por categoría, modal de lectura y publicaciones.
- **Galería de fotografías**: cuadrícula con visor (lightbox) y carrusel de fotos destacadas.
- **Secciones institucionales**: historia (línea de tiempo), misión / visión / valores,
  oferta educativa (Preparatoria, Elemental, Media), autoridades y docentes, contacto.
- **Panel de administración** (`admin.html`): rol de administrador para publicar
  noticias y subir fotografías a la galería, todo guardado en **Firebase**.

## Estructura de archivos

```
├── index.html            → sitio público
├── admin.html            → panel de administración (login + dashboard)
├── css/
│   ├── styles.css        → estilos del sitio (1 archivo, responsive + temas)
│   └── admin.css         → estilos del panel
├── js/
│   ├── firebase-config.js → ★ TUS CREDENCIALES DE FIREBASE van aquí
│   ├── i18n.js           → diccionario de traducción español/inglés
│   ├── theme.js          → modo claro/oscuro
│   ├── data.js           → contenido editable (autoridades, textos de ejemplo)
│   ├── main.js           → lógica del sitio público
│   └── admin.js          → lógica del panel de administración
└── README.md
```

---

## 1) Probar la página ahora mismo (modo demostración)

El sitio **funciona sin cambios**: abre `index.html` en tu navegador. Verás
contenido de ejemplo (autoridades, noticias y fotos).
Las noticias y la galería provienen del archivo `js/data.js` hasta que
configures Firebase.

> 💡 Para **probar en internet** sin configurar Firebase puedes arrastrar la
> carpeta a [Netlify Drop](https://app.netlify.com/drop) o subirla a GitHub Pages.

---

## 2) Configurar Firebase (publicaciones + rol admin)

Necesitas una cuenta gratuita. Sigue estos pasos:

### Paso A — Crear el proyecto
1. Entra a https://console.firebase.google.com e inicia sesión con tu correo.
2. **Crear proyecto** → dale un nombre, p. ej. `escuela-padre-otto-acosta`.
3. (Se puede desactivar Google Analytics).

### Paso B — Habilita los 2 servicios que el sitio necesita
En el menú lateral izquierdo:

| Servicio | Dónde | Qué haces |
|---|---|---|
| **Build → Authentication** | pestaña "Sign-in method" | Activa **Email/Password** |
| **Build → Firestore Database** | "Create database" | Elige región cercana y modo **modo de prueba** (después lo ajustamos) |

> 💡 **No necesitas Storage.** Las fotografías se comprimen en el navegador y se
> guardan dentro de Firestore (límite gratuito del plan Spark, sin tarjeta de crédito).
> Firebase Storage solo haría falta si publicaras videos; para eso sí se requiere
> el plan Blaze (tarjeta).

### Paso C — Copia tus credenciales
1. **Configuración del proyecto** (ícono de engranaje) → **General**.
2. En la sección *"Tus apps"* click en **Web** (</>) → registra una app con cualquier nombre.
3. Copia los valores y pégalos en `js/firebase-config.js` reemplazando los que empiezan con `AQUI_`:

```js
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### Paso D — Crea la cuenta de administrador
1. **Authentication → Users → Add user**.
2. Crea un usuario con el correo y la contraseña que usarás para entrar al panel.
   *(Solo este usuario podrá publicar si aplicas las reglas de más abajo).*

### Paso E — Reglas de seguridad (importante)

**Firestore** → pestaña *Rules*. Pega y publica:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /noticias/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /galeria/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /autoridades/{id} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /config/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

> 🔐 Para mayor control puedes restringir la escritura SOLO al correo del
> administrador, usando en Firestore:
> `allow write: if request.auth != null && request.auth.token.email == "admin@tu-escuela.edu.ec";`
> (sustituye por el correo real de la cuenta admin).

### (Opcional) Usar Firebase Storage
El sitio **no lo requiere**: las fotos se guardan comprimidas en Firestore.
Si algún día quieres alojar imágenes/videos más pesados, habilita **Build → Storage**
(esto pide el plan Blaze con tarjeta, aunque su franja gratuita es amplia) y publica
las reglas de Storage:

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Si habilitas Storage y quieres que las fotos se suban ahí (en vez de Firestore),
dímelo y cambio el panel para usarlo.

### Paso F — Verificar
- Abre `admin.html` → inicia sesión con el usuario creado.
- El aviso "Modo demostración" desaparece → ya puedes **publicar noticias** y
  **subir fotos** desde el panel.
- Los cambios se ven al instante en `index.html` (misma carpeta/hosting).

---

## 3) Publicar en internet

### Opción A — Firebase Hosting (gratis, recomendado)
1. Instala Node.js (https://nodejs.org).
2. Instala las herramientas de Firebase:
   ```
   npm install -g firebase-tools
   ```
3. En la carpeta del proyecto:
   ```
   firebase login
   firebase init hosting
   ```
   - Elige el proyecto de Firebase.
   - Public directory: `public` (o sube los archivos a una carpeta `public`).
   - Single-page app: No.
   - `npm run build` → No.
4. Publica:
   ```
   firebase deploy
   ```
   El sitio queda en `https://tu-proyecto.web.app`

### Opción B — Netlify (gratis)
1. Crea una cuenta en https://netlify.com.
2. Arrastra la carpeta del proyecto a **Netlify Drop** → listo.

### Opción C — GitHub Pages
1. Crea un repositorio en GitHub y sube estos archivos.
2. *Settings → Pages* → Build and deployment → *Deploy from a branch* → `main` / root.

### Opción D — Cualquier hosting (hostinger, cPanel…)
Solo sube todos los archivos por FTP. La página es estática + Firebase
funcionará en cualquier dominio.

---

## 4) Editar el contenido institucional

Todo el contenido editable está en estos lugares:

- **`js/data.js`** → Autoridades y docentes (nombres, cargos).
- **`index.html`** → Textos de historia, misión, visión, valores, oferta y
  contacto. Edítalos directamente en los atributos `data-i18n` y su texto.
- **Botón de traducción** → agrega o corrige frases en `js/i18n.js`
  (clave `"..." : "traducción en inglés"`).
- **Formulario de contacto** → se envía por `mailto:` al correo
  `ottoacosta@feyalegria.org.ec`. Para recibir mensajes en tu bandeja
  sin depender del app de correo, puedes conectarlo a
  [FormSpree](https://formspree.io): crea un formulario y reemplaza el
  `mailto:` de `js/main.js`.
- **Mapa** → en `index.html` cambia la URL del `iframe`
  (`https://www.google.com/maps?q=...&output=embed`) por la dirección real.
  Para fijarlo en un punto exacto usa las coordenadas:
  `https://www.google.com/maps?q=-0.5225555,-79.5796414&z=16&hl=es&output=embed`.

## 5) Colores Fe y Alegría

Definidos como variables CSS al inicio de `css/styles.css`:

- `--fya-red: #d81b26` (rojo institucional)
- `--fya-red-2: #c1121f`
- `--fya-yellow: #f7b500` (amarillo/oro)
- `--fya-orange: #f47920`

---

## Notas técnicas

- Sin dependencias de build: los SDKs de Firebase se cargan por CDN (compat v10).
- La traducción ES/EN es integrada (sin APIs externas), con respaldo en
  `localStorage`.
- El modo oscuro respeta la preferencia del sistema la primera vez.
- Las animaciones usan `IntersectionObserver`; con `prefers-reduced-motion`
  se desactivan automáticamente para no afectar accesibilidad ni rendimiento.