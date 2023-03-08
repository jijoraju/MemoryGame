const images = [
  { source: "assets/images/card_1.png", data: "card_1" },
  { source: "assets/images/card_2.png", data: "card_2" },
  { source: "assets/images/card_3.png", data: "card_3" },
  { source: "assets/images/card_4.png", data: "card_4" },
  { source: "assets/images/card_5.png", data: "card_5" },
  { source: "assets/images/card_6.png", data: "card_6" },
  { source: "assets/images/card_7.png", data: "card_7" },
  { source: "assets/images/card_8.png", data: "card_8" },
];

window.onload = function () {
  // Open the default tab
  // Open the "Play Game" tab by default
  document.getElementById("play").style.display = "block";
  document.getElementsByClassName("tablinks")[0].className += " active";

  // Function to switch tabs

  let save_settings = document.getElementById("save_settings");
  save_settings.addEventListener("click", () => {
    inputName = document.getElementById("player_name").value;
    inputCards = document.getElementById("num_cards").value;
    console.log(inputName, inputCards);
    sessionStorage.setItem("input_name", inputName);
    sessionStorage.setItem("input_cards", inputCards);
  });

  let playerName = document.getElementById("name");
  playerName.textContent = sessionStorage.getItem("input_name");
  // create a card element for each image and duplicate it
  let playing_cards = getPlayingCards();

  // add the cards to the board container
  const boardContainer = document.querySelector(".board-container");
  boardContainer.append(...playing_cards);

  // get all cards
  const cards = document.querySelectorAll(".card");

  checkCards(cards, (res) => {
    alert("Game over!");
    [...res].forEach((card) => card.classList.remove("card-rotate"));
  });
};

const getPlayingCards = () => {
  const input_cards = sessionStorage.getItem("input_cards");
  console.log({ input_cards });
  const no_of_images_display = parseInt(input_cards) / 2;
  console.log(no_of_images_display);
  let palyingImages = getImagesOfSize(images, no_of_images_display);
  // Create an array to hold all the cards
  console.log({ palyingImages });
  const playing_cards = palyingImages.flatMap((image) => {
    const card = document.createElement("div");
    card.className = "card";

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

  // Add a click event listener to each card in the array
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // If the card is already flipped or if two cards are already flipped, do nothing
      if (card.classList.contains("card-rotate") || flippedCards.length >= 2)
        return;

      // Flip the clicked card by adding the 'card-rotate' class and adding it to the flippedCards array
      card.classList.add("card-rotate");
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;

        // If two cards have been flipped, check if they match and store the result
        const match =
          card1.querySelector(".card-back img").alt ===
          card2.querySelector(".card-back img").alt;

        setTimeout(() => {
          // toggle the class if the card is not flipped
          card1.classList.toggle("card-rotate", match);
          card2.classList.toggle("card-rotate", match);
          flippedCards = [];

          // check if all cards are flipped
          const isGameOver = [...cards].every((card) =>
            card.classList.contains("card-rotate")
          );
          if (isGameOver) {
            onGameOver(cards);
          }
        }, 1000);
      }
    });
  });
};

const openTab = (evt, tabName) => {
  var i, tabcontent, tablinks;

  // Hide all tab content
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove the "active" class from all tab links
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
};
