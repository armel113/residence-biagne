# Résidence Biagné – Gestion des clients (v3)

Application web (PWA, installable sur téléphone) pour enregistrer les clients d'une résidence :

- **Connexion par compte** (email + mot de passe) — deux rôles, **Admin** et **Gérant**, appliqués **côté serveur** (règles Firestore), pas seulement cachés dans l'interface.
- **Auto-enregistrement client** : un client peut remplir ses informations lui-même via un **lien ou un QR code**, avant même l'arrivée. Sa demande atterrit en attente, à valider par le personnel.
- **Base de données partagée en temps réel** : tout ce qui est enregistré (par le gérant ou par un client) apparaît instantanément partout, y compris à distance.
- **Suivi des dépenses** : électricité (CIE) calculée automatiquement selon la durée du séjour, draps/pressing, imprévus, charges récurrentes (Canal+, Internet…).
- **Traçabilité complète** : qui a enregistré/modifié/validé quoi, et quand.
- Lecture automatique de CNI/passeport par IA, statistiques et bénéfice net (admin), export CSV.

## Répartition des droits

| Fonction | Gérant | Admin |
|---|---|---|
| Enregistrer un client, scanner une CNI | ✅ | ✅ |
| Valider une demande d'auto-enregistrement (attribuer une chambre) | ✅ | ✅ |
| Marquer un départ / réactiver un client | ✅ | ✅ |
| Ajouter une dépense (séjour ou générale : Canal+, Internet…) | ✅ | ✅ |
| Onglet **Dépenses** | ✅ | ✅ |
| Onglet **Résumé** (revenus, dépenses, bénéfice net) | ❌ | ✅ |
| **Modifier** les infos d'un client déjà enregistré | ❌ | ✅ |
| **Supprimer** un client ou une dépense | ❌ | ✅ |
| Export CSV / Effacer toutes les données | ❌ | ✅ |
| Onglet **Config** (clé API, lien/QR d'enregistrement, comptes) | ❌ | ✅ |

## Comment fonctionne l'auto-enregistrement

1. Dans **Config**, l'admin trouve un lien + un QR code uniques vers `checkin.html` (générés automatiquement une fois l'app en ligne).
2. Affichez ce QR code à la réception, ou envoyez le lien par SMS/WhatsApp avant l'arrivée du client.
3. Le client ouvre le lien **sans se connecter**, remplit ses informations (identité, arrivée prévue…) et envoie.
4. Sa demande apparaît dans l'onglet **Clients** avec le badge **"En attente"**, tout en haut, dans un bandeau "Nouvelle(s) demande(s)".
5. Le gérant ou l'admin ouvre la fiche, **attribue une chambre, un tarif et un mode de paiement**, puis clique **"Valider et activer le séjour"**. La dépense CIE est calculée et ajoutée automatiquement à ce moment-là.

Le client ne peut ni choisir sa chambre, ni fixer son tarif, ni se déclarer "payé" lui-même — ces règles sont imposées côté serveur (`firestore.rules`), pas seulement cachées dans le formulaire.

## Comment fonctionnent les dépenses

- **CIE (électricité)** : ajoutée **automatiquement**, `1 000 FCFA × nombre de jours` du séjour, calculée à partir des dates d'arrivée/départ au moment de l'enregistrement (ou de la validation d'une demande en ligne).
- **Draps/Pressing, Imprévu, Autre** : ajoutés manuellement depuis la fiche d'un client (section "Dépenses liées au séjour"), par l'admin ou le gérant.
- **Canal+ (5 000 FCFA) / Internet (15 000 FCFA)** : boutons à un clic dans l'onglet **Dépenses**, à utiliser une fois par mois (il n'y a pas de facturation automatique récurrente — l'app est un site statique, sans tâche planifiée en arrière-plan).
- Le **Résumé** (admin) additionne toutes les dépenses et calcule un **bénéfice net estimé** = revenus enregistrés − dépenses totales.
- Seul l'admin peut supprimer une dépense (utile en cas d'erreur de saisie).

## Fichiers du module

- `index.html` — l'application (personnel, connexion requise)
- `checkin.html` — page publique d'auto-enregistrement (accessible via le lien/QR code, pas de connexion)
- `firebase-config.js` — **à compléter** avec les identifiants de votre projet Firebase (étape 2)
- `firestore.rules` — règles de sécurité à coller dans la Console Firebase (étape 4)
- `manifest.json`, `icon-192.png`, `icon-512.png` — pour l'installation en PWA
- `README.md` — ce fichier

---

## Installation (environ 15 minutes, gratuit, aucune carte bancaire nécessaire)

### 1. Créer le projet Firebase
Allez sur [console.firebase.google.com](https://console.firebase.google.com) → **Ajouter un projet** → nommez-le (ex. `residence-biagne`) → Google Analytics inutile, vous pouvez le désactiver.

### 2. Ajouter une application Web et récupérer la config
Icône **`</>`** (Web) sur la page d'accueil du projet → surnom → **Enregistrer l'application**. Copiez le bloc `firebaseConfig = {...}` affiché dans le fichier `firebase-config.js` fourni, à la place des `COLLEZ_VOTRE_...`.

### 3. Activer l'authentification par email/mot de passe
**Authentication → Get started → Sign-in method → Email/Password** → activer → **Save**.

### 4. Activer Firestore et poser les règles de sécurité
1. **Firestore Database → Create database** → mode **production** → région proche (ex. `eur3`) → **Enable**.
2. Onglet **Rules** → remplacez tout le contenu par celui du fichier `firestore.rules` fourni → **Publish**.

### 5. Créer votre compte Admin (une seule fois, manuellement)
1. **Authentication → Users → Add user** → votre email + mot de passe → copiez le **User UID** généré.
2. **Firestore Database → Data → Start collection** → nom `users` → **ID du document = le UID copié** → champs :
   - `email` (string) → votre email
   - `nom` (string) → votre nom
   - `role` (string) → `admin`
   → **Save**.

### 6. Héberger sur GitHub Pages
```bash
git init
git add index.html checkin.html firebase-config.js manifest.json icon-192.png icon-512.png README.md
git commit -m "Résidence Biagné - app clients v3"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/VOTRE-DEPOT.git
git push -u origin main
```
Puis **Settings → Pages → Source → Deploy from a branch → `main` / `/ (root)` → Save**. En ligne après 1-2 minutes sur `https://VOTRE-COMPTE.github.io/VOTRE-DEPOT/`.

*(`firestore.rules` ne sert qu'à la Console Firebase, inutile de vous en soucier une fois publié — mais gardez-le dans le dépôt pour référence/mises à jour futures.)*

### 7. Premiers pas
1. Connectez-vous avec le compte Admin (étape 5).
2. **Config** → collez votre clé API Anthropic (une fois, partagée avec l'équipe).
3. **Config → Comptes utilisateurs** → créez le compte de votre gérant (rôle **Gérant**).
4. **Config → Lien d'auto-enregistrement** → notez le lien / imprimez le QR code pour la réception.

---

## Limites honnêtes à connaître

- **La clé API Anthropic reste visible dans le navigateur** de quiconque utilise le scan CNI (y compris le gérant) — l'appel part directement du navigateur. Pour la cacher aussi au gérant, il faudrait un petit serveur intermédiaire ; dites-le-moi si vous voulez que je l'ajoute.
- **Auto-enregistrement et spam** : le formulaire public n'a pas de protection anti-robot (captcha). Un lien largement diffusé pourrait recevoir de fausses demandes ; elles restent "En attente" sans effet tant qu'elles ne sont pas validées, et l'admin peut les rejeter (🗑️) depuis la fiche. Si besoin, je peux ajouter une protection (Firebase App Check) plus tard.
- **"Modifier" côté gérant** : la restriction "modification réservée à l'admin" est appliquée dans l'interface, mais pas au niveau des règles serveur (contrairement à la suppression, qui est vraiment bloquée pour le gérant). Un gérant techniquement averti pourrait théoriquement modifier un champ via les outils développeur. Dites-le-moi si vous voulez que je verrouille aussi ce point côté serveur.
- **Photos compressées automatiquement** (portrait + recto/verso CNI) pour rester sous la limite de taille Firestore et dans le quota gratuit.
- **Charges récurrentes non automatiques** : Canal+ et Internet doivent être ajoutés manuellement chaque mois (un clic) — pas de facturation planifiée automatique sur un site statique.
- **Suppression de compte incomplète** : "Retirer l'accès" enlève les droits dans l'app, pas le compte de connexion lui-même (à supprimer aussi dans Firebase Console → Authentication si besoin).
- **Coût** : gratuit tant que vous restez dans les quotas du plan Spark (1 Gio Firestore, 50 000 lectures/jour, 20 000 écritures/jour, jusqu'à 50 000 comptes) — largement suffisant pour une résidence, sans carte bancaire.
- **Données sensibles** : le formulaire (y compris l'auto-enregistrement) collecte des informations personnelles. Assurez-vous que cet usage respecte la réglementation applicable en Côte d'Ivoire, et ne partagez les identifiants de connexion qu'avec le personnel autorisé.
