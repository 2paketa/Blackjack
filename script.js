//
//Black Jack
// by Manos Prekas
//

let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
let values = ['Ace', 'King', 'Queen', 'Jack', 
    'Ten', 'Nine', 'Eight', 'Seven', 'Six',
    'Five', 'Four', 'Three', 'Two'
    ];
let div
let textArea = document.getElementById('text-area');
let newGameButton = document.getElementById('new-game-button');
let hitButton = document.getElementById('hit-button');
let stayButton = document.getElementById('stay-button');
let sound = document.createElement("audio");

let player = { cards: [], score: 0, area: document.getElementById("player-cards-area"), cardTextArea: document.getElementById("player-text-area"), cardImage: [],
    get score(){
      let _score = getScore(this.cards);
      this.cardTextArea.innerText = "Player Score: " + _score;
      return _score;
    }
    },
    dealer = { cards: [], score: 0, area: document.getElementById("dealer-cards-area"), cardTextArea: document.getElementById("dealer-text-area"), cardImage: [],
    get score(){
      let _score = getScore(this.cards);
      this.cardTextArea.innerText = "Dealer Score: " + _score;
      return _score;
    }
    },
    gameOver = false,
    gameStarted = false,
    tie = false;
    playerWon = false;
    deck = [];

function createDeck(){
  let deck = [];
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++)
  {
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++)
    {
      let card = { 
        suit: suits[suitIdx],
        value: values[valueIdx]
      };
      deck.push(card);
    }
  }
  return deck;
}

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', function(){
  sound.pause();
  gameOver = false;
  gameStarted = true;
  tie = false;
  playerWon = false;
  
  startGame();
  resetElements();
  showCardsToImage(player);
  showCardsToImage(dealer);
  showStatus();
})

hitButton.addEventListener('click', function(){
  let card = getNextCard();
  player.cards.push(card);
  newCardToImage(card, player.area);
  playSound("ogg/Punch _Socos_Porrada (96kbit_Opus).ogg");
  checkWinConditions();
  showStatus();
});

stayButton.addEventListener('click', function(){
  gameOver = true;
  checkWinConditions();
  showStatus();
})

function checkWinConditions(){
  if (gameOver){
    while (dealer.score < player.score
          && player.score <= 21
          && dealer.score <= 21
          && dealer.cards.length < 5){
            card = getNextCard()
            dealer.cards.push(card);
            newCardToImage(card, dealer.area);
            // updateScores();
          }
  }
  if (player.score > 21 || dealer.cards >= 5){
    playerWon = false;
    gameOver = true;
  }
  else if (dealer.score > 21){
    playerWon = true;
    gameOver = true;
  }
  else if (gameOver){
    if (player.score === dealer.score){
      tie = true;
    }
    else if (player.score > dealer.score){
      playerWon = true;
    }
    else{
      playerWon = false;
    }
  }

}

function startGame(){
  //  updateScores();
  deck = createDeck();
  shuffleDeck(deck);
  player.cards = [ getNextCard(), getNextCard() ];
  dealer.cards = [ getNextCard(), getNextCard() ];

   if (dealer.score === 21){
     gameOver = true;
     playerWon = false;
   }
   if (player.score === 21){
    gameOver = true;
    playerWon = true;
  }
  if (gameOver){
    gameOverConditions();
    textArea.i
  }
  else{
    showStatus();
  }
  
}

function showStatus(){
    if (!gameStarted){
       textArea.innerText = "Welcome to BlackJack!";
       return;
    }
    textArea.innerText = "LET'SS RUMBLEEEEEEEEEEEEEEEEEEE"
    gameOverConditions();

}

function gameOverConditions(){
  if (gameOver){
    if(tie){
      textArea.innerText = "IT'S A TIE!"
      playSound("ogg/nobody-cares.mp3")
    }
    else if (playerWon){
      textArea.innerText = "YOU WIN!";
      playSound("ogg/Super Mario Bros Win Stage Sound Effect (152kbit_Opus).ogg")
    }
    else{
      textArea.innerText = "DEALER WINS!";
      playSound("ogg/FAIL SOUND EFFECT (128kbit_Opus).ogg")
    }
    newGameButton.style.display = 'inline'
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }
  else{
    newGameButton.style.display = 'none';
    hitButton.style.display = 'inline';
    stayButton.style.display = 'inline';
  }
}

function playSound(src){
  sound.src = src;
  document.body.appendChild(sound);
  sound.volume = 0.6;
  sound.play()
}

function showCardsToImage(currentPlayer){
  
  for (let i = 0; i < currentPlayer.cards.length; i++){
    currentPlayer.cardImage[i] = getCardImage(currentPlayer.cards[i].suit, currentPlayer.cards[i].value, currentPlayer.area);
    currentPlayer.area.appendChild(currentPlayer.cardImage[i]);
  }

}

function newCardToImage(card, area){
    let cardImage = getCardImage(card.suit, card.value, area);
    area.appendChild(cardImage);
}

function shuffleDeck(deck){
  for (let i = 0; i < deck.length; i++){
    let swapIdx = Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp;
  }
}

function getNextCard(){
  return deck.shift();
}

function getCardString(card){
  return card.value + ' of ' + card.suit;
}

function showCardstoString(cards){
  let cardsToString = [];
  for (let i = 0; i < cards.length; i++){
    cardsToString += getCardString(cards[i]) + '\n';
  }
  return cardsToString;
}

// function updateScores(){
//    dealer.score = getScore(dealer.cards);
//    player.score = getScore(player.cards);
// }

function getScore(cardArray){
  score = 0;
  hasAce = false;
  for (let i = 0; i < cardArray.length; i++){
    card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === 'Ace'){
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21){
    return score + 10;
  }
  return score;
}

function createElement(cardSuit, cardValue, folder){
  let embedObject = document.createElement('embed');
  embedObject.type = "image/svg+xml";
  let path = "images/" + folder + "/" + cardValue + cardSuit + ".svg";
  embedObject.src = path;
  embedObject.style.display = 'inline-block';
  return embedObject;
}

function resetElements(){
  document.getElementById("player-cards-area").innerHTML = "";
  document.getElementById("dealer-cards-area").innerHTML = "";
}

function getCardNumericValue(card) {
  switch(card.value) {
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five': 
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
}

// 'Hearts', 'Clubs', 'Diamonds', 'Spades'
function getCardImage(suit, value) {
  cardValue = 0;
  cardSuit = "";
  folder = "";

  // let svgObject = document.getElementById("player-card-" + cardNumber)
  switch(value) {
    case 'Ace':
      cardValue = 1;
      break;
    case 'Two':
      cardValue = 2;
      break;
    case 'Three':
      cardValue = 3;
      break;
    case 'Four':
      cardValue = 4;
      break;
    case 'Five': 
      cardValue = 5;
      break;
    case 'Six':
      cardValue = 6;
      break;
    case 'Seven':
      cardValue = 7;
      break;
    case 'Eight':
      cardValue = 8;
      break;
    case 'Nine':
      cardValue = 9;
      break;
    case "Jack":
      cardValue = 'j';
      break;
    case "Queen":
    cardValue = 'q';
    break;
    case "King":
        cardValue = 'k';
    break;
    default:
      cardValue = 10;
      break;
  }
  switch (suit){
    case 'Clubs':
        cardSuit = 'c';
        folder = 'clubs';
        break;
    case 'Hearts':
        cardSuit = 'h';
        folder = 'hearts';
        break;
    case 'Diamonds':
        cardSuit = 'd';
        folder = 'diamonds';
        break;
    case 'Spades':
        cardSuit = 's';
        folder = 'spades';
        break;
  }

  return createElement(cardSuit, cardValue, folder);
}

// let playerCards = [ getNextCard(), getNextCard() ];
// console.log ('Player cards: ')
// console.log (getCardString(player.cards[0]));
// console.log ('Dealer cards: ')
