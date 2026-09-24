# Site - Jardinerie Marcipont

Site vitrine de la Jardinerie Marcipont (Jemeppe-sur-Sambre, Belgique).
Site statique, sans build : il suffit de servir les fichiers tels quels.

## Contenu
- `index.html` - le site (hero, univers, montages, histoire, galerie, Facebook, contact + carte).
- `formulaire-client.html` - formulaire dynamique de collecte d'infos (réponses renvoyées par WhatsApp).
- `images/montages/` - photos réelles des montages floraux.

## Mise en ligne (permanent, gratuit)

### Cloudflare Pages (recommandé)
1. Pousser ce dossier sur un dépôt GitHub.
2. Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → choisir le dépôt.
3. Réglages de build : **Framework preset : None**, **Build command : (vide)**, **Output directory : `/`**.
4. **Save and Deploy** → URL permanente `https://<projet>.pages.dev`.
5. Chaque `git push` redéploie automatiquement.

Le formulaire est alors accessible sur `https://<projet>.pages.dev/formulaire-client.html`.

### Alternatives
- **Render** → New → Static Site → Publish directory : `.`
- **Netlify** → glisser-déposer le dossier sur https://app.netlify.com/drop

## Domaine personnalisé
Ajouter `jardineriemarcipont.be` dans les réglages « Custom domains » de l'hébergeur choisi.

## Application (PWA)

Le site est une vraie app installable :
- `manifest.webmanifest` (id, display standalone, icones any + maskable, raccourcis)
- `sw.js` : service worker. Pages / CSS / JS / manifeste = reseau d'abord ; images = cache d'abord ; page hors ligne `offline.html`. Les ressources tierces (Unsplash, Google Maps, Facebook) ne sont pas mises en cache.
- `app.js` : enregistre le service worker et gere le bouton "Installer l'app" du menu mobile, affiche uniquement sur Android quand le navigateur propose l'installation (regle Scribeo du 24/09/2026 : rien sur ordinateur ni sur iPhone).
- `llms.txt` : resume du site pour les IA.

IMPORTANT : a chaque livraison, incrementer `VERSION` dans `sw.js` (ex. marcipont-v2) pour forcer la mise a jour du cache chez les visiteurs.

## Journal des modifications

La plus recente en haut.

### 2026-09-24 (service worker marcipont-v3)
- Interrupteur de maintenance du parc Scribeo pose. Le Worker `jardinerie-marcipont` n'avait pas de script (fichiers seuls) : il recoit `interrupteur.js`, qui lit la cle `marcipont` de l'espace KV commun (liaison `MAINT`) puis sert les fichiers (`env.ASSETS`). `off` : page de coupure Scribeo en 503 (liaison de service `OPS` vers `scribeo-ops`, puis requete reseau, puis repli integre) ; `tech` : page `offline.html` du site en 503 ; toute autre valeur ou absence : site normal. `/sw.js` et `/robots.txt` passent toujours.
- Quota : seules les pages passent par le script (`run_worker_first` qui exclut `/images/`, les png, jpg, svg, css, js, `robots.txt` et le manifeste).
- `interrupteur.js` ajoute a `.assetsignore` ; `workers_dev: true` rendu explicite (adresse workers.dev active, on la garde).
- Teste en local (`wrangler dev`, KV local) : accueil 503 avec la cle a `off`, 200 sans cle ; `sw.js` et `robots.txt` en 200 pendant la coupure. Le push sur `main` deploie (Workers Builds).

### 2026-09-24 (service worker marcipont-v2)
- Bouton "Installer l'app" limite a Android ; la notice iOS et le bouton sur ordinateur sont retires.
