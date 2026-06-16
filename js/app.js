
const EscapeRoom = {
  state: {
    ubicacion: null,       // { lat, lng } — lo llena nivel1.js, este usalo en nivel2.js
    fotoCapturada: null,   // dataURL — este llenenlo con el nivel3.js
  },

  completedLevels: new Set(),

  init() {
    this.renderSeals();
    this.startClock();
  },

  /*  Sellos (elemento de progreso del header)  */

  renderSeals() {
    const container = document.getElementById('seals');
    if (!container) return;

    const lockPath = 'M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7z';

    container.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const seal = document.createElement('div');
      seal.className = 'seal';
      seal.dataset.seal = String(i);
      seal.dataset.state = i === 1 ? 'active' : 'pending';
      seal.title = `Sello ${i} de 5`;
      seal.innerHTML = `<svg viewBox="0 0 24 24"><path d="${lockPath}"/></svg>`;
      container.appendChild(seal);
    }
  },

  setSealState(n, stateName) {
    const seal = document.querySelector(`.seal[data-seal="${n}"]`);
    if (seal) seal.dataset.state = stateName;
  },

  /*  Desbloqueo progresivo de niveles  */

  unlockLevel(n) {
    const card = document.getElementById(`level-${n}`);
    if (card) card.classList.remove('locked');
    this.setSealState(n, 'active');
  },

  completeLevel(n) {
    this.completedLevels.add(n);

    const card = document.getElementById(`level-${n}`);
    if (card) card.classList.add('completed');
    this.setSealState(n, 'completed');

    const next = n + 1;
    if (next <= 5) {
      this.unlockLevel(next);
      const nextCard = document.getElementById(`level-${next}`);
      if (nextCard) {
        setTimeout(() => nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
      }
    } else {
      const banner = document.getElementById('final-banner');
      if (banner) {
        banner.classList.remove('d-none');
        setTimeout(() => banner.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
      }
    }
  },

  /*  Mensajes de estado por cada nivel  */

  setStatus(elementId, message, type) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('is-success', 'is-error', 'is-pending');
    if (type) el.classList.add(`is-${type}`);
  },

  /*  Reloj de sistema 
     Corre con requestAnimationFrame en el hilo principal.
     Si la interfaz se congelara, este reloj se detendría:
     es la prueba visible de que los Workers no bloquean la UI. */

  startClock() {
    const clockValue = document.getElementById('clock-value');
    if (!clockValue) return;

    const tick = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      const tenths = Math.floor(d.getMilliseconds() / 100);
      clockValue.textContent = `${hh}:${mm}:${ss}.${tenths}`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },
};

document.addEventListener('DOMContentLoaded', () => EscapeRoom.init());
