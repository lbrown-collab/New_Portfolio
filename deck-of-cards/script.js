const suits = ['♠', '♣', '♥', '♦'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const redSuits = ['♥', '♦'];

let deck = [];
let drawnCards = [];

const drawBtn = document.getElementById('draw-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const cardDisplay = document.getElementById('card-display');
const drawnCardsEl = document.getElementById('drawn-cards');
const cardsRemaining = document.getElementById('cards-remaining');

function buildDeck() {
  deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
}

function shuffle() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function createCardEl(card, large = false) {
  const el = document.createElement('div');
  const isRed = redSuits.includes(card.suit);
  el.className = `card ${isRed ? 'red' : 'black'}`;

  el.innerHTML = `
    <span>${card.value}</span>
    <span class="suit">${card.suit}</span>
  `;
  return el;
}

function updateRemaining() {
  cardsRemaining.textContent = `Cards remaining: ${deck.length}`;
  drawBtn.disabled = deck.length === 0;
}

function drawCard() {
  if (deck.length === 0) return;

  const card = deck.pop();
  drawnCards.push(card);

  cardDisplay.innerHTML = '';
  cardDisplay.appendChild(createCardEl(card, true));

  drawnCardsEl.innerHTML = '';
  drawnCards.forEach(c => drawnCardsEl.appendChild(createCardEl(c)));

  updateRemaining();
}

function resetDeck() {
  buildDeck();
  shuffle();
  drawnCards = [];
  drawnCardsEl.innerHTML = '';
  cardDisplay.innerHTML = '<p class="placeholder">Deck shuffled — draw a card!</p>';
  updateRemaining();
}

drawBtn.addEventListener('click', drawCard);
shuffleBtn.addEventListener('click', resetDeck);

buildDeck();
shuffle();
updateRemaining();
