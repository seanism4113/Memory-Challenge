const divContainer = document.getElementById("game");
const scoreSpan = document.querySelector('#matchCounter');
const highScore = document.querySelector('#highScore')
const startButton = document.querySelector('#startButton');
const restartButton = document.querySelector('#restartButton');
const buttonSection = document.querySelector('#controls');
let playing = false;

// check to see if a highscore has been set.  
// if it has not been set, add text to highscore p element
if (localStorage.getItem("highScore") === null){
  highScore.textContent = "High Score not set"
}
// if a highscore has been set, retrieve from localStorage and set to p element
else {
  highScore.textContent = "High Score: " + localStorage.getItem("highScore");
}

// set cards as objects to array
const matchCards = [
  {"collie": "https://i.pinimg.com/736x/51/2c/2d/512c2df42555717bad4833fb49cfd4bd.jpg"},
  {"little": "https://img.freepik.com/premium-photo/cute-dog-face-white-background_174541-1437.jpg"},
  {"chihuahua" : "https://st.depositphotos.com/1110525/1271/i/450/depositphotos_12714975-stock-photo-little-fun-dog-face.jpg"},
  {"dalmation" : "https://www.shutterstock.com/image-photo/head-shot-happy-smiling-dalmatian-600nw-2326699483.jpg"},
  {"golden" : "https://img.freepik.com/premium-photo/golden-retriever-dog-with-white-background_787273-2028.jpg"},
  {"frenchie" : "https://img.freepik.com/premium-photo/ravishing-french-bulldog-with-curious-face-portrait-white-isolated-background_31965-128006.jpg"},
  {"rotweiler" : "https://img.freepik.com/premium-photo/ravishing-adorable-rottweiler-dog-portrait-white-isolated-background_31965-145718.jpg"},
  {"greatDane" : "https://img.freepik.com/premium-photo/ravishing-adorable-great-dane-dog-portrait_31965-137545.jpg"},
  {"collie": "https://i.pinimg.com/736x/51/2c/2d/512c2df42555717bad4833fb49cfd4bd.jpg"},
  {"little": "https://img.freepik.com/premium-photo/cute-dog-face-white-background_174541-1437.jpg"},
  {"chihuahua" : "https://st.depositphotos.com/1110525/1271/i/450/depositphotos_12714975-stock-photo-little-fun-dog-face.jpg"},
  {"dalmation" : "https://www.shutterstock.com/image-photo/head-shot-happy-smiling-dalmatian-600nw-2326699483.jpg"},
  {"golden" : "https://img.freepik.com/premium-photo/golden-retriever-dog-with-white-background_787273-2028.jpg"},
  {"frenchie" : "https://img.freepik.com/premium-photo/ravishing-french-bulldog-with-curious-face-portrait-white-isolated-background_31965-128006.jpg"},
  {"rotweiler" : "https://img.freepik.com/premium-photo/ravishing-adorable-rottweiler-dog-portrait-white-isolated-background_31965-145718.jpg"},
  {"greatDane" : "https://img.freepik.com/premium-photo/ravishing-adorable-great-dane-dog-portrait_31965-137545.jpg"}
];

// add eventListener to start button
// when button is clicked, the button disappears
// change border to green
// set the value of playing to true to allow users to start playing the game
startButton.addEventListener('click', function (e){
  startButton.style.display = 'none';
  buttonSection.style.border = '20px solid green';
  playing = true;
});

// set event listener for restart button to reload page
restartButton.addEventListener('click', function (e){
  location.reload();
});


// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledCards = shuffle(matchCards);

// this function loops over the array of cards
// it creates a new div and sets the class to the array key values
// it also adds an event listener for a click for each card
function createDivsForCards(cardArray) {
  for (let cardObject of cardArray) {

    // create var.  Objects.keys is used to retrieve the key from
    // the first key in the array
    const key = Object.keys(cardObject)[0];
    // value holds the value of the associated key
    const value = cardObject[key]
    // create a new div
    const newDiv = document.createElement("div");

    // give div a class attribute of the key in object array
    newDiv.classList.add(key);

    // set backgroundImage of div to url image pulled from value
    // adject size of image to fit the div
    newDiv.style.backgroundImage = `url('${value}')`;
    newDiv.style.backgroundSize = '120px';

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    divContainer.append(newDiv);
  }
}
// sends the shuffled cards into the create divs function
createDivsForCards(shuffledCards);

// create var to calculate when the user clicks twice and tries to match
let matchAttempts = 0
// create a var to calculate when the user matches two cards
let matches = 0;
// used to determine whether the game is on pause after a match attempt
let gamePause = false;
// used to store the value of the first of 2 click divs
let previouslyClicked = null;
// store the values of matched cards
let matchHistory = [];

// this function handles many different things when a card is clicked
function handleCardClick(event) {

  // if statement to determine if the start button has
  // been clicked and the game can be played
  // if playing is false then the function terminates immediately
  if (playing === false){
    return;
  }
  // if statement to see if see if the game should be paused
  // if it should be paused and it is set to true
  if (gamePause) {
    return;
  }

  // const that captures the clicked div and its properties
  const divClicked = event.target;

  // toggle the class of flipped to the clicked div
  // a CSS flipping effect is triggered when the div is clicked
  divClicked.classList.toggle('flipped');

  // const to store the clicked div's background Image URL
  const cardDiv = divClicked.style.backgroundImage;

  // removes the clicked div's default image
  divClicked.style.content = 'none'

  // Ensure that if previouslyClicked is clicked again
  // the below code is not run
  if (previouslyClicked !== divClicked){

    // run if the previouslyClicked is not clicked
    if (!previouslyClicked) {
      // set the previouslyClicked div to the current clicked div
      previouslyClicked = divClicked;
    } 
    else {
      // if statement to run if the current clicked div's background url 
      // is equal to the previously clicked div's background url
      if (cardDiv === previouslyClicked.style.backgroundImage) {
        // send both matched clicked divs to array
        matchHistory.push(divClicked, previouslyClicked);
        // add 1 to match counter
        matches++;
        // add 1 to matches attempted counter
        matchAttempts++;
        // modify the textContent of the span that holds the matches attempted
        scoreSpan.textContent = "Match Attempts: " + matchAttempts;

        // Prevent matched cards from having javascript run on them when clicked
        // prevent them from going towards any counts or changing
        divClicked.removeEventListener("click", handleCardClick);
        previouslyClicked.removeEventListener("click", handleCardClick);

        // set previously clicked to null so that it does not hold
        // a value for the next set of clicks
        previouslyClicked = null;
        
        // end of game if statement.  
        // if matches = the cards array divided by two then perform the following
        if (matches === (matchCards.length / 2)){ 
          // if match attempts is lower then the value in localStorage, update highscore
          if (matchAttempts < localStorage.highScore){
            // set item to localStorage
            localStorage.setItem("highScore", matchAttempts);
            // write over the content in the highSchore element
            highScore.textContent = "High Score: " + localStorage.getItem("highScore");
          }
          // if there is no highScore set, perform the following
          else if (localStorage.getItem("highScore") === null){
            // set new highscore to localStorage
            localStorage.setItem("highScore", matchAttempts);
            // write over the content in highscore element
            highScore.textContent = "High Score: " + localStorage.getItem("highScore");
          }
          // Set a timer and then alert that the game is over
          setTimeout(function () {
            alert("Congratulations! You've matched all cards.");
          }, 500);
        }
      } 
      // perform the following if 2 cards are not a match
      else {
        // gamePause is set to true and paused
        gamePause = true;
        // add 1 to the counter each time two cards do not match

        // timer function to set pause after two clicks and no match
        setTimeout(function () {
          // add 1 to match attempts 
          matchAttempts++;
          // update new match attempts in the html element
          scoreSpan.textContent = "Match Attempts: " + matchAttempts;
          //change both cards back to the defaults image because it was not a match
          divClicked.style.content = 'url("https://st.depositphotos.com/1093689/3001/v/450/depositphotos_30010151-stock-illustration-seamless-abstract-colorful-background-of.jpg")';
          previouslyClicked.style.content = 'url("https://st.depositphotos.com/1093689/3001/v/450/depositphotos_30010151-stock-illustration-seamless-abstract-colorful-background-of.jpg")';
          // resume game and undo pause
          gamePause = false;
          // set previously clicked to null so that it does not hold
          // a value for the next set of clicks
          previouslyClicked = null;
        }, 1500);
      }
    }
  }
}



