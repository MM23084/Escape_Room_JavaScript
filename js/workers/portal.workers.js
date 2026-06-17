self.onmessage = function (e) {

    const datos = e.data;

    let validos = 0;
    let descartados = 0;

    let sumaTemp = 0;
    let sumaHum = 0;
    let sumaPres = 0;

    const temperaturas = [];
    const presiones = [];

    const total = datos.length;

    for (let i = 0; i < total; i++) {

        const r = datos[i];

        if (
            r.temperatura < 0 ||
            r.humedad < 0 ||
            r.presion < 0
        ) {

            descartados++;

        } else {

            validos++;

            sumaTemp += r.temperatura;
            sumaHum += r.humedad;
            sumaPres += r.presion;

            temperaturas.push(r.temperatura);
            presiones.push(r.presion);
        }

        if (i % 5000 === 0) {

            self.postMessage({
                type: 'progress',
                value: Math.floor((i / total) * 100)
            });
        }
    }

    temperaturas.sort((a, b) => b - a);
    presiones.sort((a, b) => b - a);

    const promedioTemp = sumaTemp / validos;
    const promedioHum = sumaHum / validos;
    const promedioPres = sumaPres / validos;

    const promedioGeneral =
        (promedioTemp + promedioHum + promedioPres) / 3;

    self.postMessage({
        type: 'progress',
        value: 100
    });

    self.postMessage({

        type: 'done',

        resultado: {

            validos,
            descartados,

            promedioTemp,
            promedioHum,
            promedioPres,

            promedioGeneral,

            topTemperaturas:
                temperaturas.slice(0, 10),

            topPresiones:
                presiones.slice(0, 10)
        }
    });
};