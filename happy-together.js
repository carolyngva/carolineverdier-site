const video = document.querySelector('.ht-hero-video');
const hero = document.querySelector('.ht-hero');
const controls = document.querySelector('.ht-hero-controls');
const soundButton = document.querySelector('[data-video-sound]');
const playButton = document.querySelector('[data-video-play]');

if (video && hero && controls && soundButton && playButton) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  video.controls = false;
  controls.hidden = false;

  const updateControls = () => {
    // The approved clip fills the frame with gold from 7.2 seconds onward.
    hero.classList.toggle('is-lit', video.currentTime >= 7.2);
    playButton.textContent = video.ended ? 'Revoir l’animation' : video.paused ? 'Lire l’animation' : 'Mettre en pause';
  };

  soundButton.addEventListener('click', () => {
    video.muted = !video.muted;
  });

  video.addEventListener('volumechange', () => {
    soundButton.textContent = video.muted ? 'Activer le son' : 'Couper le son';
    soundButton.setAttribute('aria-pressed', String(!video.muted));
  });

  playButton.addEventListener('click', () => {
    if (video.paused) {
      if (video.ended) {
        video.currentTime = 0;
        updateControls();
      }
      video.play().catch(updateControls);
    } else {
      video.pause();
    }
  });

  for (const event of ['timeupdate', 'seeked', 'play', 'pause', 'ended']) {
    video.addEventListener(event, updateControls);
  }

  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) video.pause();
  });

  if (!reducedMotion.matches) video.play().catch(updateControls);
}
