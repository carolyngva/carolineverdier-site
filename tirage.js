const drawButton = document.querySelector('#drawBtn');
const newDrawButton = document.querySelector('#newDrawBtn');
const soundButton = document.querySelector('#soundToggle');
const cardArea = document.querySelector('#cardArea');
const phaseText = document.querySelector('#phaseText');
const bottomCta = document.querySelector('#bottomCta');
const slots = [...document.querySelectorAll('.oracle-card')];
const intro = new Audio('/assets/oracle/intro.mp3');
const outro = new Audio('/assets/oracle/outro.mp3');
intro.preload = outro.preload = 'none';
intro.volume = 0.7;
outro.volume = 0.5;
let cards = [];
let drawing = false;
let soundEnabled = false;
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

soundButton.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  intro.muted = outro.muted = !soundEnabled;
  soundButton.setAttribute('aria-pressed', String(soundEnabled));
  soundButton.textContent = soundEnabled ? 'Couper le son' : 'Activer le son';
});

async function loadCards() {
  drawButton.disabled = true;
  try {
    const response = await fetch('/assets/oracle/cards.json');
    if (!response.ok) throw new Error('Cartes indisponibles');
    const data = await response.json();
    if (!Array.isArray(data.cards) || data.cards.length < 3) throw new Error('Jeu incomplet');
    cards = data.cards;
    drawButton.textContent = 'Tirer les cartes';
    phaseText.textContent = '';
  } catch {
    drawButton.textContent = 'Réessayer le chargement';
    phaseText.textContent = 'Les cartes n’ont pas pu être chargées. Réessaie dans un instant.';
  } finally {
    drawButton.disabled = false;
  }
}

async function draw() {
  if (drawing) return;
  if (!cards.length) return loadCards();
  drawing = true;
  drawButton.hidden = true;
  newDrawButton.disabled = true;
  bottomCta.hidden = true;
  cardArea.setAttribute('aria-busy', 'true');
  phaseText.textContent = 'Concentre-toi sur ta question…';
  intro.pause();
  outro.pause();
  intro.currentTime = outro.currentTime = 0;
  for (const slot of slots) {
    slot.querySelector('.oracle-card-inner').classList.remove('flipped');
    const reading = slot.querySelector('.oracle-reading');
    reading.hidden = true;
    reading.replaceChildren();
  }
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Sampling without replacement keeps all three cards distinct.
  const deck = [...cards];
  const selected = Array.from({ length: 3 }, () => deck.splice(Math.floor(Math.random() * deck.length), 1)[0]);
  if (soundEnabled) {
    intro.muted = false;
    intro.play().catch(() => {});
  }
  await wait(reducedMotion ? 0 : 800);
  slots.forEach(slot => slot.querySelector('.oracle-card-front').replaceChildren());
  cardArea.classList.add('is-shuffling');
  phaseText.textContent = 'Concentre-toi sur ta question… Les cartes se mélangent.';
  await wait(reducedMotion ? 0 : 5500);
  cardArea.classList.remove('is-shuffling');
  intro.pause();
  if (soundEnabled) {
    outro.muted = false;
    outro.play().catch(() => {});
  }
  phaseText.textContent = 'Les cartes se dévoilent…';
  const sections = [
    { title: 'Ce qui est', key: 'essence' },
    { title: 'Ce qui bloque', key: 'ombre' },
    { title: 'Le conseil cash', key: 'zero_bullshit' },
  ];
  selected.forEach((card, index) => {
    const slot = slots[index];
    const front = slot.querySelector('.oracle-card-front');
    const image = new Image();
    image.alt = `${card.numero} · ${card.nom}`;
    image.addEventListener('error', () => { front.textContent = `${card.numero} · ${card.nom}`; });
    image.src = card.image.replace('/images/cards/', '/assets/oracle/cards/');
    front.append(image);
    const reading = slot.querySelector('.oracle-reading');
    const heading = document.createElement('h3');
    heading.textContent = `${card.numero} · ${card.nom}`;
    const keywords = document.createElement('p');
    keywords.className = 'oracle-keywords';
    keywords.textContent = card.mots_cles;
    const title = document.createElement('h4');
    title.textContent = sections[index].title;
    const text = document.createElement('p');
    text.textContent = card[sections[index].key];
    reading.append(heading, keywords, title, text);
    if (index === 2 && card.questions?.length) {
      const label = document.createElement('h4');
      label.textContent = 'Questions pour toi';
      const list = document.createElement('ul');
      for (const question of card.questions) {
        const item = document.createElement('li');
        item.textContent = question;
        list.append(item);
      }
      reading.append(label, list);
    }
  });
  for (const slot of slots) {
    slot.querySelector('.oracle-card-inner').classList.add('flipped');
    await wait(reducedMotion ? 0 : 600);
  }
  await wait(reducedMotion ? 0 : 300);
  for (const slot of slots) slot.querySelector('.oracle-reading').hidden = false;
  phaseText.textContent = 'Ton tirage est prêt : situation, blocage et conseil.';
  cardArea.setAttribute('aria-busy', 'false');
  bottomCta.hidden = false;
  newDrawButton.disabled = false;
  drawing = false;
}

drawButton.addEventListener('click', draw);
newDrawButton.addEventListener('click', draw);
loadCards();
