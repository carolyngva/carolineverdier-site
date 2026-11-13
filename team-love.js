const video = document.querySelector('.ht-hero-video');
const controls = document.querySelector('.ht-hero-controls');
const playButton = document.querySelector('[data-video-play]');
const soundButton = document.querySelector('[data-video-sound]');

if (video && controls && playButton) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  video.controls = false;
  controls.hidden = false;

  const updateControls = () => {
    playButton.textContent = video.ended ? 'Revoir la vidéo' : video.paused ? 'Lire la vidéo' : 'Mettre en pause';
  };

  if (soundButton) {
    soundButton.addEventListener('click', () => {
      video.muted = !video.muted;
      if (!video.muted && video.paused) {
        if (video.ended) video.currentTime = 0;
        video.play().catch(updateControls);
      }
    });

    video.addEventListener('volumechange', () => {
      soundButton.textContent = video.muted ? 'Activer le son' : 'Couper le son';
      soundButton.setAttribute('aria-pressed', String(!video.muted));
    });
  }

  playButton.addEventListener('click', () => {
    if (video.paused) {
      if (video.ended) video.currentTime = 0;
      video.play().catch(updateControls);
    } else {
      video.pause();
    }
  });

  for (const event of ['play', 'pause', 'ended']) {
    video.addEventListener(event, updateControls);
  }

  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) video.pause();
  });

  if (!reducedMotion.matches) video.play().catch(updateControls);
}
