(function () {

  const btn = document.getElementById('btn-run-n4');
  const progressWrap = document.getElementById('n4-progress-wrap');
  const progressBar = document.getElementById('n4-progress-bar');
  const progressLabel = document.getElementById('n4-progress-label');
  const statsCard = document.getElementById('n4-stats-card');

  btn.addEventListener('click', () => {

    btn.disabled = true;

    progressWrap.classList.remove('d-none');
    statsCard.classList.add('d-none');

    progressBar.style.width = '0%';
    progressLabel.textContent = 'Procesando en el Worker... 0%';

    EscapeRoom.setStatus(
      'nivel4-status',
      'Generando datos de sensores...',
      'pending'
    );

    const datos = [];

    for (let i = 0; i < 20000; i++) {

      datos.push({
        temperatura: Math.random() * 50,
        humedad: Math.random() * 100
      });

    }

    const inicio = performance.now();

    const worker = new Worker(
      'js/workers/sensores.workers.js'
    );

    worker.postMessage(datos);

    worker.onmessage = (e) => {

      if (e.data.type === 'progress') {

        progressBar.style.width =
          `${e.data.value}%`;

        progressLabel.textContent =
          `Procesando en el Worker... ${e.data.value}%`;

        return;
      }

      if (e.data.type === 'done') {

        progressBar.style.width = '100%';

        progressLabel.textContent =
          'Procesamiento completado 100%';

        mostrarResultados(
          e.data.resultado,
          performance.now() - inicio
        );

        btn.disabled = false;

        EscapeRoom.setStatus(
          'nivel4-status',
          'Procesamiento completado correctamente.',
          'success'
        );

        EscapeRoom.completeLevel(4);
      }
    };

  });

  function mostrarResultados(data, tiempo) {

    document.getElementById('n4-temp-avg').textContent =
      data.tempPromedio.toFixed(2);

    document.getElementById('n4-temp-range').textContent =
      `${data.tempMax.toFixed(2)} / ${data.tempMin.toFixed(2)}`;

    document.getElementById('n4-hum-avg').textContent =
      data.humPromedio.toFixed(2);

    document.getElementById('n4-hum-range').textContent =
      `${data.humMax.toFixed(2)} / ${data.humMin.toFixed(2)}`;

    document.getElementById('n4-meta').textContent =
      `20,000 registros procesados en ${(tiempo / 1000).toFixed(2)} segundos`;

    statsCard.classList.remove('d-none');
  }

})();