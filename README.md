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
- `app.js` : enregistre le service worker et gere le bouton "Installer l'app" (menu mobile) + la notice iOS (Partager > Sur l'ecran d'accueil).
- `llms.txt` : resume du site pour les IA.

IMPORTANT : a chaque livraison, incrementer `VERSION` dans `sw.js` (ex. marcipont-v2) pour forcer la mise a jour du cache chez les visiteurs.
