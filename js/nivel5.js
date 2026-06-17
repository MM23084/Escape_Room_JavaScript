(function () {
  const btn = document.getElementById('btn-run-n5');
  const progressWrap = document.getElementById('n5-progress-wrap');
  const progressBar = document.getElementById('n5-progress-bar');
  const progressLabel = document.getElementById('n5-progress-label');

  const statsCard = document.getElementById('n5-stats-card');
  const btnExport = document.getElementById('btn-export-json');

  let resultados = null;

  btn.addEventListener('click', () => {

    btn.disabled = true;

    progressWrap.classList.remove('d-none');
    statsCard.classList.add('d-none');
    btnExport.classList.add('d-none');

    EscapeRoom.setStatus(
      'nivel5-status',
      'Generando registros...',
      'pending'
    );

    const datos = [];

    for (let i = 0; i < 250000; i++) {

      let temperatura = Math.random() * 60;
      let humedad = Math.random() * 100;
      let presion = Math.random() * 1500;

      if (Math.random() < 0.05) temperatura *= -1;
      if (Math.random() < 0.05) humedad *= -1;
      if (Math.random() < 0.05) presion *= -1;

      datos.push({
        temperatura,
        humedad,
        presion
      });
    }

    const inicio = performance.now();

    const worker = new Worker('js/workers/portal.workers.js');

    worker.postMessage(datos);

    worker.onmessage = (e) => {

      if (e.data.type === 'progress') {

        progressBar.style.width = `${e.data.value}%`;

        progressLabel.textContent =
          `Procesando en el Worker... ${e.data.value}%`;

        return;
      }

      if (e.data.type === 'done') {

        progressBar.style.width = '100%';

        progressLabel.textContent =
          'Procesamiento completado 100%';
        resultados = e.data.resultado;

        mostrarResultados(
          resultados,
          performance.now() - inicio
        );

        btn.disabled = false;

        EscapeRoom.setStatus(
          'nivel5-status',
          'Portal cuántico estabilizado.',
          'success'
        );

        EscapeRoom.completeLevel(5);
      }
    };
  });

  function mostrarResultados(data, tiempo) {

    document.getElementById('n5-valid-count').textContent =
      data.validos;

    document.getElementById('n5-discarded-count').textContent =
      data.descartados;

    document.getElementById('n5-overall-avg').textContent =
      data.promedioGeneral.toFixed(2);

    document.getElementById('n5-compute-time').textContent =
      `${(tiempo / 1000).toFixed(2)} s`;

    const metaInfo = document.createElement('p');

    metaInfo.className = 'stats-meta';

    metaInfo.innerHTML = `
      Promedio Temperatura: ${data.promedioTemp.toFixed(2)} |
      Promedio Humedad: ${data.promedioHum.toFixed(2)} |
      Promedio Presión: ${data.promedioPres.toFixed(2)}
   `;

    const oldMeta = statsCard.querySelector('.extra-promedios');

    if (oldMeta) oldMeta.remove();

    metaInfo.classList.add('extra-promedios');

    statsCard.querySelector('.card-body').appendChild(metaInfo);

    const listaTemp =
      document.getElementById('n5-top-temp');

    const listaPres =
      document.getElementById('n5-top-pres');

    listaTemp.innerHTML = '';
    listaPres.innerHTML = '';

    data.topTemperaturas.forEach(valor => {

      const li = document.createElement('li');
      li.textContent = valor.toFixed(2);

      listaTemp.appendChild(li);
    });

    data.topPresiones.forEach(valor => {

      const li = document.createElement('li');
      li.textContent = valor.toFixed(2);

      listaPres.appendChild(li);
    });

    statsCard.classList.remove('d-none');
    btnExport.classList.remove('d-none');
  }

  btnExport.addEventListener('click', () => {

    const blob = new Blob(
      [JSON.stringify(resultados, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = 'portal-cuantico.json';

    a.click();

    URL.revokeObjectURL(url);
  });

})();