(function () {
  const btn = document.getElementById('btn-locate');
  const latValue = document.getElementById('lat-value');
  const lngValue = document.getElementById('lng-value');

  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!('geolocation' in navigator)) {
      EscapeRoom.setStatus('nivel1-status', 'Este navegador no soporta geolocalización.', 'error');
      return;
    }

    btn.disabled = true;
    EscapeRoom.setStatus('nivel1-status', 'Solicitando permiso de ubicación…', 'pending');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        latValue.textContent = latitude.toFixed(6);
        lngValue.textContent = longitude.toFixed(6);

        EscapeRoom.state.ubicacion = { lat: latitude, lng: longitude };

        btn.disabled = false;
        btn.textContent = 'Volver a escanear';
        EscapeRoom.setStatus('nivel1-status', 'Ubicación confirmada. Sello 1 liberado.', 'success');
        EscapeRoom.completeLevel(1);
      },
      (error) => {
        btn.disabled = false;

        let mensaje = 'No se pudo obtener la ubicación.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            mensaje = 'Permiso denegado. El núcleo necesita tu ubicación para continuar.';
            break;
          case error.POSITION_UNAVAILABLE:
            mensaje = 'Ubicación no disponible en este momento. Intenta de nuevo.';
            break;
          case error.TIMEOUT:
            mensaje = 'La solicitud de ubicación tardó demasiado. Intenta de nuevo.';
            break;
        }
        EscapeRoom.setStatus('nivel1-status', mensaje, 'error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
})();
