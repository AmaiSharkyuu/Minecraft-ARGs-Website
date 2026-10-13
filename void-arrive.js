/* Arrivée depuis AmaiCraft : la carte "ARG Archives" corrompt la page de départ, puis ouvre
   ce site avec #void dans l'adresse. Ici on rejoue la corruption à l'envers : le texte se brouille,
   les blocs se défont des bords vers le centre et la page "dé-bugue".
   Le script est chargé dans <head> (sans defer) pour cacher la page avant son premier affichage. */
(function () {
    if (location.hash !== '#void') return;
    // on retire le marqueur de l'adresse sans recharger la page
    history.replaceState(null, '', location.pathname + location.search);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    const style = document.createElement('style');
    style.textContent = `
html.void-cover::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    background: #070000;
}

.void-layer {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    display: grid;
    overflow: hidden;
    pointer-events: none;
}

.void-cell {
    background: var(--c);
    animation: void-cell-out 0.16s steps(2) var(--d) forwards;
}

@keyframes void-cell-out {
    0%   { opacity: 1; }
    50%  { opacity: 1; background: #ff2020; }
    100% { opacity: 0; }
}

.void-scan, .void-grain {
    position: absolute;
    inset: 0;
    animation: void-fade 0.4s ease-out 0.6s forwards;
}

.void-scan {
    background: repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.35) 0 1px, transparent 1px 3px);
}

.void-grain {
    inset: -40px;
    opacity: 0.12;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    animation: void-grain 0.4s steps(4) infinite, void-fade 0.4s ease-out 0.6s forwards;
}

@keyframes void-fade { to { opacity: 0; } }

@keyframes void-grain {
    0%   { transform: translate(0, 0); }
    25%  { transform: translate(-30px, 20px); }
    50%  { transform: translate(20px, -35px); }
    75%  { transform: translate(-10px, 30px); }
    100% { transform: translate(0, 0); }
}

.void-text {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-family: 'Minecraftia', monospace;
    font-size: clamp(18px, 5vw, 46px);
    color: #ff3b3b;
    text-shadow: 3px 3px 0 #3f0000;
    white-space: nowrap;
    letter-spacing: 2px;
    animation: void-text-out 0.45s steps(5) forwards;
}

.void-text small {
    display: block;
    margin-top: 10px;
    font-size: 0.32em;
    color: #8a8a8a;
    text-shadow: none;
    text-align: center;
    letter-spacing: 4px;
}

.void-text::before, .void-text::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    text-shadow: none;
    mix-blend-mode: screen;
}

.void-text::before { color: #00ffff; animation: void-split 0.3s steps(2) infinite; }
.void-text::after  { color: #ff00ff; animation: void-split 0.25s steps(2) infinite reverse; }

@keyframes void-text-out {
    0%   { opacity: 1; }
    20%  { opacity: 0.4; }
    40%  { opacity: 1; }
    60%  { opacity: 0; }
    80%  { opacity: 1; }
    100% { opacity: 0; }
}

@keyframes void-split {
    0%   { transform: translate(-4px, 0);    clip-path: inset(0 0 60% 0); }
    50%  { transform: translate(4px, 2px);   clip-path: inset(45% 0 10% 0); }
    100% { transform: translate(-2px, -2px); clip-path: inset(20% 0 40% 0); }
}

/* la page part de l'état "corrompu" de la fin de l'animation et revient à la normale */
body.void-unglitch > :not(.void-layer):not(script):not(style) {
    animation: void-unglitch 0.6s steps(1) 0.75s backwards;
}

@keyframes void-unglitch {
    0%   { transform: none; filter: brightness(0.25) sepia(1) hue-rotate(-40deg) saturate(6); }
    14%  { transform: none; clip-path: none; filter: brightness(0.4) sepia(1) hue-rotate(-40deg) saturate(6); }
    28%  { transform: translate(3px, 0); clip-path: inset(55% 0 5% 0); filter: brightness(0.6) sepia(1) hue-rotate(-40deg) saturate(5); }
    40%  { transform: translate(-5px, -3px); clip-path: none; filter: hue-rotate(-90deg) contrast(2); }
    52%  { transform: translate(10px, 4px) skewX(-8deg); filter: saturate(0) brightness(1.6); }
    64%  { transform: translate(-3px, 0); clip-path: inset(15% 0 45% 0); filter: none; }
    76%  { transform: translate(6px, -2px); clip-path: none; filter: invert(1) contrast(1.5); }
    88%  { transform: translate(-8px, 3px) skewX(6deg); filter: hue-rotate(140deg) saturate(3); }
    100% { transform: none; filter: none; }
}
`;
    document.head.appendChild(style);
    root.classList.add('void-cover');
    // filet de sécurité : la page ne reste jamais cachée
    setTimeout(() => root.classList.remove('void-cover'), 4000);

    function arrive() {
        const layer = document.createElement('div');
        layer.className = 'void-layer';
        layer.setAttribute('aria-hidden', 'true');
        const size = Math.max(36, Math.round(window.innerWidth / 28));
        const cols = Math.ceil(window.innerWidth / size);
        const rows = Math.ceil(window.innerHeight / size);
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const maxDist = Math.hypot(cx, cy);
        const colors = ['#000', '#000', '#070000', '#140000', '#250000', '#3f0000', '#5a0000'];
        layer.style.gridTemplateColumns = `repeat(${cols}, ${size}px)`;
        layer.style.gridAutoRows = size + 'px';

        // à l'aller les blocs partaient de la carte vers les bords ; ici ils se défont des bords vers le centre
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.className = 'void-cell';
                const dist = Math.hypot(x * size + size / 2 - cx, y * size + size / 2 - cy);
                const delay = 0.3 + (1 - dist / maxDist) * 0.6 + Math.random() * 0.22;
                cell.style.setProperty('--d', delay.toFixed(3) + 's');
                cell.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);
                layer.appendChild(cell);
            }
        }

        const scan = document.createElement('div');
        scan.className = 'void-scan';
        const grain = document.createElement('div');
        grain.className = 'void-grain';
        const text = document.createElement('div');
        text.className = 'void-text';
        text.dataset.text = 'ENTERING THE VOID';
        text.innerHTML = 'ENTERING THE VOID<small>[ERR] signal lost</small>';
        layer.append(scan, grain, text);

        document.body.appendChild(layer);
        document.body.classList.add('void-unglitch');
        root.classList.remove('void-cover');

        setTimeout(() => {
            layer.remove();
            document.body.classList.remove('void-unglitch');
        }, 1500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', arrive);
    } else {
        arrive();
    }
})();
