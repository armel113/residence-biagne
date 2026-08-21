// ─────────────────────────────────────────────────────────────
// Collez ici la configuration de VOTRE projet Firebase.
// Vous la trouverez dans : Console Firebase → ⚙️ Paramètres du projet
// → Vos applications → l'app Web que vous avez ajoutée → "SDK config".
//
// Ces valeurs ne sont PAS secrètes : Google les considère comme
// publiques par conception (la vraie sécurité vient des règles
// Firestore, voir firestore.rules). Vous pouvez donc les laisser
// dans ce fichier, même dans un dépôt GitHub public.
// ─────────────────────────────────────────────────────────────
export const firebaseConfig = {
  apiKey: "AIzaSyBRoaQ-BiC6D28N6GfBA3QgRxMTEY_OEL4",
  authDomain: "residence-biagne.firebaseapp.com",
  projectId: "residence-biagne",
  storageBucket: "residence-biagne.firebasestorage.app",
  messagingSenderId: "955881102852",
  appId: "1:955881102852:web:d695ccd6d219ffabe71f51"
};

// ─────────────────────────────────────────────────────────────
// PROTECTION APP CHECK (facultatif mais fortement conseillé)
//
// Empêche quelqu'un qui aurait votre lien d'enregistrement d'inonder
// la base de fausses demandes.
//
// Pour l'activer : collez ci-dessous la CLÉ DE SITE reCAPTCHA v3
// (celle qui commence par 6L...). Voir le fichier A-FAIRE.md.
//
// Tant que cette valeur reste vide, l'application fonctionne
// normalement, simplement sans cette protection.
// ─────────────────────────────────────────────────────────────
export const appCheckSiteKey = "";
