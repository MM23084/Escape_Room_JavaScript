(function () {
  const btn = document.getElementById('btn-draw-map');
  const canvas = document.getElementById('map-canvas');

  if (!btn || !canvas) return;

  const ctx = canvas.getContext('2d');

  // Proyección: use la parte decimal de la
  // latitud/longitud para ubicar un punto dentro del lienzo,
  // ya que no se permite usar librerías externas de mapas. //Ricardo M. - 2024-06-14
  function proyectar(lat, lng, width, height) {
    const fracLat = Math.abs(lat % 1);
    const fracLng = Math.abs(lng % 1);
    const x = 40 + fracLng * (width - 80);
    const y = 40 + fracLat * (height - 80);
    return { x, y };
  }

  function dibujarGrid(width, height) {
    ctx.strokeStyle = 'rgba(147, 162, 174, 0.18)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  function dibujarMapa() {
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0E141B';
    ctx.fillRect(0, 0, width, height);
    dibujarGrid(width, height);

    // Avenida principal del sector (línea).
    ctx.strokeStyle = '#5B6B78';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.55);
    ctx.lineTo(width, height * 0.4);
    ctx.stroke();

    // Edificio del núcleo (rectángulo).
    ctx.fillStyle = 'rgba(232, 163, 61, 0.18)';
    ctx.strokeStyle = '#E8A33D';
    ctx.lineWidth = 2;
    ctx.fillRect(width * 0.58, height * 0.12, width * 0.28, height * 0.22);
    ctx.strokeRect(width * 0.58, height * 0.12, width * 0.28, height * 0.22);

    // Perímetro de seguridad (círculo).
    ctx.strokeStyle = 'rgba(43, 196, 176, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width * 0.22, height * 0.72, 70, 0, Math.PI * 2);
    ctx.stroke();

    // Marcador de la posición recuperada en el nivel 1.
    const ubicacion = EscapeRoom.state.ubicacion;
    if (!ubicacion) return false;

    const { x, y } = proyectar(ubicacion.lat, ubicacion.lng, width, height);

    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#D6493B';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(214, 73, 59, 0.55)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#E7ECEF';
    ctx.font = '12px monospace';
    ctx.fillText(`(${ubicacion.lat.toFixed(3)}, ${ubicacion.lng.toFixed(3)})`, x + 18, y + 4);

    return true;
  }

  btn.addEventListener('click', () => {
    const tieneMarcador = dibujarMapa();

    if (tieneMarcador) {
      EscapeRoom.setStatus('nivel2-status', 'Mapa generado y posición marcada. Sello 2 liberado.', 'success');
      EscapeRoom.completeLevel(2);
    } else {
      EscapeRoom.setStatus(
        'nivel2-status',
        'El mapa se dibujó, pero todavía no hay coordenadas del nivel 1.',
        'error'
      );
    }
  });
})();
