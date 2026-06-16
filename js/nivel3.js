(function () {
  const btnStart = document.getElementById('btn-start-camera'); 
  const btnCapture = document.getElementById('btn-capture');                    //usen estas variables para manejar el botón de iniciar cámara, el botón de capturar foto, el video y el canvas para mostrar la foto capturada. //Ricardo M. - 2024-06-14
  const video = document.getElementById('camera-feed');
  const captureCanvas = document.getElementById('capture-canvas');
  const photoPlaceholder = document.getElementById('photo-placeholder');
  const capturedPhoto = document.getElementById('captured-photo');

  if (!btnStart || !btnCapture || !video) return; 

})