// ============================================================
// nivel3.js — Cámara, captura y LocalStorage
// ============================================================
 
(function () {
  const btnStart        = document.getElementById('btn-start-camera');
  const btnCapture      = document.getElementById('btn-capture');
  const video           = document.getElementById('camera-feed');
  const captureCanvas   = document.getElementById('capture-canvas');
  const photoPlaceholder = document.getElementById('photo-placeholder');
  const capturedPhoto   = document.getElementById('captured-photo');
 
  if (!btnStart || !btnCapture || !video) return;
 
  let streamActivo = null;
 
  // ---- ACTIVAR CÁMARA ----
  btnStart.addEventListener('click', async () => {
    btnStart.disabled = true;
    EscapeRoom.setStatus('nivel3-status', 'Solicitando acceso a la cámara…', 'pending');
 
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamActivo = stream;
      video.srcObject = stream;
      await video.play();
 
      btnCapture.disabled = false;
      btnStart.textContent = 'Cámara activa';
      EscapeRoom.setStatus('nivel3-status', 'Transmisión en vivo iniciada. Captura la evidencia.', 'pending');
 
    } catch (err) {
      btnStart.disabled = false;
 
      // Manejo de errores según requisito 5
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        EscapeRoom.setStatus('nivel3-status', 'Cámara no encontrada. Conecta un dispositivo de video.', 'error');
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        EscapeRoom.setStatus('nivel3-status', 'Permiso denegado. El núcleo necesita acceso a la cámara.', 'error');
      } else {
        EscapeRoom.setStatus('nivel3-status', `Error inesperado: ${err.message}`, 'error');
      }
    }
  });
 
  // ---- CAPTURAR FOTOGRAFÍA ----
  btnCapture.addEventListener('click', () => {
    if (!streamActivo) return;
 
    // Ajustar canvas al tamaño real del video
    captureCanvas.width  = video.videoWidth  || 640;
    captureCanvas.height = video.videoHeight || 480;
 
    const ctx = captureCanvas.getContext('2d');
 
    // Dibujar el frame actual del video
    ctx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
 
    // Overlay de timestamp igual al estilo HUD del proyecto
    const timestamp = new Date().toLocaleTimeString();
    ctx.fillStyle = 'rgba(10, 14, 19, 0.55)';
    ctx.fillRect(0, captureCanvas.height - 32, captureCanvas.width, 32);
    ctx.fillStyle = '#2BC4B0';
    ctx.font = '500 12px JetBrains Mono, monospace';
    ctx.fillText(`EVIDENCIA CAPTURADA · ${timestamp}`, 12, captureCanvas.height - 11);
 
    const dataURL = captureCanvas.toDataURL('image/png');
 
    // Guardar en LocalStorage (requisito 4)
    try {
      localStorage.setItem('escaperoom_foto', dataURL);
      localStorage.setItem('escaperoom_foto_fecha', new Date().toISOString());
    } catch (e) {
      // Cuota excedida: avisamos pero no bloqueamos el flujo
      EscapeRoom.setStatus('nivel3-status', 'Aviso: no se pudo guardar en LocalStorage (cuota llena).', 'error');
      return;
    }
 
    // Mostrar la foto capturada (requisito 6)
    photoPlaceholder.classList.add('d-none');
    capturedPhoto.src = dataURL;
    capturedPhoto.classList.remove('d-none');
 
    // Guardar en el estado global para que otros niveles lo puedan leer si es necesario
    EscapeRoom.state.fotoCapturada = dataURL;
 
    // Detener el stream de la cámara
    streamActivo.getTracks().forEach(t => t.stop());
    streamActivo = null;
    video.srcObject = null;
 
    btnCapture.disabled = true;
    btnStart.disabled   = false;
    btnStart.textContent = 'Reactivar cámara';
 
    EscapeRoom.setStatus('nivel3-status', 'Evidencia guardada en LocalStorage. Sello 3 liberado.', 'success');
 
    // Completar nivel (requisito 6: debe haber capturado al menos una foto)
    EscapeRoom.completeLevel(3);
  });
 
})();