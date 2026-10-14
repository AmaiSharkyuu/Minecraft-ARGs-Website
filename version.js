/* Version du site : le dernier commit du dépôt GitHub, demandé à l'API publique.
   Le numéro suit les versions de Minecraft depuis 2026 : année.mois.jour du commit (26.10.14).
   La réponse est gardée le temps de l'onglet, pour ne pas dépasser la limite de 60 requêtes par heure.
   Si GitHub ne répond pas, callback reçoit null et la page n'affiche pas de version. */
function getSiteVersion(callback) {
    var KEY = "void-archives-version-2";
    try {
        var saved = sessionStorage.getItem(KEY);
        if (saved) { callback(JSON.parse(saved)); return; }
    } catch (e) {}

    fetch("https://api.github.com/repos/AmaiSharkyuu/Minecraft-ARGs-Website/commits/main")
        .then(function (r) { if (!r.ok) throw r.status; return r.json(); })
        .then(function (c) {
            var d = new Date(c.commit.committer.date);
            var v = {
                number: (d.getFullYear() % 100) + "." + (d.getMonth() + 1) + "." + d.getDate(),
                sha: c.sha.slice(0, 7),
                message: c.commit.message.split("\n")[0],
                date: c.commit.committer.date,
                url: c.html_url
            };
            try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
            callback(v);
        })
        .catch(function () { callback(null); });
}
