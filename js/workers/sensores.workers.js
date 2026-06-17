self.onmessage = function (e) {

  const datos = e.data;

  let sumaTemp = 0;
  let sumaHum = 0;

  let tempMax = -Infinity;
  let tempMin = Infinity;

  let humMax = -Infinity;
  let humMin = Infinity;

  const total = datos.length;

  for (let i = 0; i < total; i++) {

    const item = datos[i];

    sumaTemp += item.temperatura;
    sumaHum += item.humedad;

    if (item.temperatura > tempMax)
      tempMax = item.temperatura;

    if (item.temperatura < tempMin)
      tempMin = item.temperatura;

    if (item.humedad > humMax)
      humMax = item.humedad;

    if (item.humedad < humMin)
      humMin = item.humedad;

    if (i % 1000 === 0) {

      const porcentaje =
        Math.round((i / total) * 100);

      self.postMessage({
        type: 'progress',
        value: porcentaje
      });

    }
  }

  self.postMessage({
    type: 'done',
    resultado: {
      tempPromedio: sumaTemp / total,
      tempMax,
      tempMin,
      humPromedio: sumaHum / total,
      humMax,
      humMin
    }
  });

};