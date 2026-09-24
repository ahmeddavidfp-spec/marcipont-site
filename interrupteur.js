/* Script du Worker jardinerie-marcipont : interrupteur de maintenance du parc Scribeo.
   Le site reste un site statique : ce script ne fait que lire l'interrupteur,
   puis passe la main aux fichiers (env.ASSETS). Il n'est appele que pour les
   pages (voir run_worker_first dans wrangler.jsonc) : images, CSS, JS et icones
   sont servis directement, sans compter dans le quota de requetes du compte. */


/* ---------------------------------------------------------------- Maintenance
   Interrupteur du parc Scribeo. La cle « marcipont » de l'espace KV commun decide :
   "off" coupure decidee par Scribeo, "tech" maintenance technique du site.
   Tout le reste laisse le site repondre normalement.
   Ecrit depuis le tableau de bord ou la conversation privee, lu ici seulement. */
const MAINT_PROJET = "marcipont";
const MAINT_OPS = "https://scribeo-ops.mertens-david-1972.workers.dev/maintenance";

// Ce qui continue de passer pendant une coupure : le service worker, sinon les
// visiteurs qui ont installe l'app gardent une version cassee en cache et la
// coupure leur survit ; robots.txt, pour ne pas faire croire aux moteurs que le
// site a disparu. Le site n'a pas de chemin de travail (ni API ni webhook).
const MAINT_PASSE = ["/sw.js", "/robots.txt"];

// Repli si le poste de commande ne repond pas : une coupure doit s'afficher
// meme quand ce qui la sert est injoignable.
const MAINT_REPLI = '<!doctype html><meta charset="utf-8"><title>Site temporairement hors ligne</title>'
  + '<div style="font:16px/1.6 system-ui;max-width:32rem;margin:18vh auto;padding:0 20px;text-align:center">'
  + '<h1 style="font-size:1.6rem">Ce site est momentanement suspendu.</h1>'
  + '<p>Prenez contact avec David Mertens au <a href="https://wa.me/32493507475">0493 50 74 75</a>, WhatsApp ou Telegram.</p></div>';

async function maintenance(request, env) {
  if (!env || !env.MAINT) return null;
  let etat = null;
  try { etat = await env.MAINT.get(MAINT_PROJET); } catch (e) { return null; }
  if (etat !== "off" && etat !== "tech") return null;

  const chemin = new URL(request.url).pathname;
  for (const p of MAINT_PASSE) {
    if (p.endsWith("/") ? chemin.startsWith(p) : chemin === p) return null;
  }

  let html = null;
  if (etat === "tech" && env.ASSETS) {
    try {
      // "/offline" et non "/offline.html" : la gestion HTML par defaut des
      // fichiers statiques redirige les adresses en .html vers leur forme courte.
      const page = await env.ASSETS.fetch(new URL("/offline", request.url));
      if (page.ok) html = await page.text();
    } catch (e) {}
  }
  if (html === null) {
    // Un Worker ne peut pas joindre un autre Worker du meme sous-domaine
    // workers.dev par une simple requete HTTP : la requete n'est pas routee.
    // La liaison de service OPS est le mecanisme prevu pour cela. On essaie
    // la liaison, puis le reseau, puis le repli inline.
    try {
      const r = env.OPS
        ? await env.OPS.fetch("https://ops.interne/maintenance")
        : await fetch(MAINT_OPS, { cf: { cacheTtl: 300 } });
      html = r.ok ? await r.text() : MAINT_REPLI;
    } catch (e) { html = MAINT_REPLI; }
  }

  // 503 et jamais 200 : un 200 ferait indexer la page de coupure a la place du site.
  return new Response(html, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "retry-after": "3600",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });
}

export default {
  async fetch(request, env) {
    // Avant tout le reste : le site est-il coupe ?
    const coupe = await maintenance(request, env);
    if (coupe) return coupe;
    return env.ASSETS.fetch(request);
  },
};
