/* ==========================================================================
   firebase-config.js
   ---------------------------------------------------------------
   Coloca aquí las credenciales de TU proyecto de Firebase.

   PASOS (detalles en README.md):
   1) Ve a https://console.firebase.google.com y crea un proyecto.
   2) En "Configuración del proyecto > General", copia los valores.
   3) Habilita Authentication (correo/contraseña), Firestore y Storage.
   4) Crea un usuario administrador en Authentication.
   5) Pega los valores abajo y reemplaza "Aquí coloca..." por los reales.

   Mientras los valores sean placeholder, el sitio funciona en "modo
   demostración" usando contenido de ejemplo de js/data.js.
   ========================================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyDdqe3-A-ZttH33SNi28slO6-h8XGOyn1s",
  authDomain: "escuela-padre-otto-acosta.firebaseapp.com",
  projectId: "escuela-padre-otto-acosta",
  storageBucket: "escuela-padre-otto-acosta.firebasestorage.app",
  messagingSenderId: "283099656250",
  appId: "1:283099656250:web:4b49e93282facdb9a98503"
};

/* Colecciones de Firestore usadas por el sitio */
const FYA_COLLECTIONS = {
  noticias: "noticias",
  galeria: "galeria",
  autoridades: "autoridades",
  config: "config"
};

/* Documentos especiales dentro de las colecciones */
const FYA_DOCS = {
  contadores: "contadores"
};

/* Detecta si Firebase ya fue configurado con credenciales reales */
function isFirebaseConfigured() {
  return !String(firebaseConfig.apiKey).startsWith("AQUI_");
}

/* Inicializa Firebase una sola vez (seguro llamarlo varias veces) */
function fyaInitFirebase() {
  try {
    if (!window.fya_firebase_done && window.firebase && isFirebaseConfigured()) {
      window.firebase.initializeApp(firebaseConfig);
      window.fya_firebase_done = true;
    }
    return window.fya_firebase_done === true;
  } catch (e) {
    console.error("Error inicializando Firebase:", e);
    return false;
  }
}