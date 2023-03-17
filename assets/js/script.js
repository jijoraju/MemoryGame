const images = Array.from({ length: 24 }, (n, i) => {
  return {
    source: `assets/images/card_${i + 1}.png`,
    data: `card_${i + 1}`,
  };
});

window.onload = () => {
  // Open the default tab
  document.getElementById('play').style.display = 'block';
  document.querySelector('.tablinks').classList.add('active');

  document.getElementById('game-countdown').style.visibility = 'hidden';
  console.log(images);

  // Function to switch tabs
  document
    .getElementById('save_settings')
    .addEventListener('click', saveSettings);

  // Set player name and number of cards from session storage
  const playerName = sessionStorage.getItem('input_name');
  const numCards = sessionStorage.getItem('input_cards');
  document.getElementById('name').textContent = playerName;
  document.getElementById('player_name').value = playerName;
  document.getElementById('num_cards').value = numCards;

  // Set highest score from local storage
  document.getElementById('highest_score').textContent =
    localStorage.getItem('highscore') || 0;

  // Create and add playing cards to the board container
  const boardContainer = document.querySelector('.board-container');
  boardContainer.append(...getPlayingCards());

  // Display cards on game start and check for matches
  const cards = document.querySelectorAll('.card');
  displayCardOnGameStart(cards);
  checkCards(cards, onGameOver);
};

const getPlayingCards = () => {
  const input_cards = sessionStorage.getItem('input_cards')
    ? parseInt(sessionStorage.getItem('input_cards'))
    : 16;
  console.log(input_cards);

  const no_of_images_display = parseInt(input_cards) / 2;
  console.log(no_of_images_display);
  let palyingImages = getImagesOfSize(images, no_of_images_display);
  // Create an array to hold all the cards
  console.log({ palyingImages });
  const playing_cards = palyingImages.flatMap((image) => {
    const card = document.createElement('div');
    card.className = 'card';

    // Set the HTML of the new card element
    card.innerHTML = `
      <div class="card-front">
        <img src="assets/images/back.png" alt="${image.data}">
      </div>
      <div class="card-back">
        <img src="${image.source}" alt="${image.data}">
      </div>
    `;

    // Return an array containing the new card element and a clone of the new card element
    return [card, card.cloneNode(true)];
  });
  console.log({ playing_cards });
  // Shuffle the playing_cards array using the Fisher-Yates algorithm
  return playing_cards.sort(() => Math.random() - 0.5);
};

const getImagesOfSize = (images, size) => images.slice(0, size);

const checkCards = (cards, onGameOver) => {
  // Initialize an array to store the flipped cards
  let flippedCards = [];

  let totalScore = 100;
  let invalidAttemptScore = totalScore / cards.length;

  document.getElementById('score').textContent = totalScore;

  // Add a click event listener to each card in the array
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      // If the card is already flipped or if two cards are already flipped, do nothing
      if (card.classList.contains('card-rotate') || flippedCards.length >= 2)
        return;

      // Flip the clicked card by adding the 'card-rotate' class and adding it to the flippedCards array
      card.classList.add('card-rotate');
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;

        // If two cards have been flipped, check if they match and store the result
        const match =
          card1.querySelector('.card-back img').alt ===
          card2.querySelector('.card-back img').alt;

        if (!match) {
          const remaining = totalScore - invalidAttemptScore;
          totalScore = remaining > 0 ? remaining : 0;
        }

        document.getElementById('score').textContent = totalScore;

        setTimeout(() => {
          // toggle the class if the card is not flipped
          card1.classList.toggle('card-rotate', match);
          card2.classList.toggle('card-rotate', match);
          flippedCards = [];

          // check if all cards are flipped
          const isGameOver = [...cards].every((card) =>
            card.classList.contains('card-rotate')
          );
          if (isGameOver) {
            onGameOver(totalScore);
          }
        }, 1000);
      }
    });
  });
};

const openTab = (evt, tabName) => {
  const tabcontent = document.querySelectorAll('.tabcontent');
  // Hide all tab content
  tabcontent.forEach((tab) => (tab.style.display = 'none'));

  const tablinks = document.querySelectorAll('.tablinks');
  // Remove the "active" class from all tab links
  tablinks.forEach((link) => link.classList.remove('active'));

  document.getElementById(tabName).style.display = 'block';
  // Show the current tab and add an "active" class to the button that opened the tab
  evt.currentTarget.classList.add('active');
};

const saveSettings = () => {
  const inputName = document.getElementById('player_name').value;
  const inputCards = document.getElementById('num_cards').value;

  // Store the player name and number of cards in the session storage
  sessionStorage.setItem('input_name', inputName);
  sessionStorage.setItem('input_cards', inputCards);
};

const countdown = (count, message, callback) => {
  const countdownEl = document.getElementById('game-countdown');
  const interval = setInterval(() => {
    countdownEl.style.visibility = 'visible';
    countdownEl.textContent = message.replace('{count}', count--);
    if (count === -1) {
      countdownEl.style.visibility = 'hidden';
      clearInterval(interval);
      callback();
    }
  }, 1000);
};

const displayCards = (cards) => {
  [...cards].forEach((card) => card.classList.add('card-rotate'));
};

const hideCards = (cards) => {
  [...cards].forEach((card) => card.classList.remove('card-rotate'));
};

const onGameOver = (totalScore) => {
  const highestScore = localStorage.getItem('highscore') || 0;
  localStorage.setItem('highscore', Math.max(totalScore, highestScore));
  document.getElementById('highest_score').textContent =
    localStorage.getItem('highscore') || 0;

  countdown(5, 'Game over! New game in {count} seconds', () => {
    location.reload();
  });
};

const displayCardOnGameStart = (cards) => {
  countdown(10, 'Your game starts in {count} seconds', () => {
    hideCards(cards);
  });

  displayCards(cards);
};
