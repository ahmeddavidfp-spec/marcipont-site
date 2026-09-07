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
