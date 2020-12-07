// a card is an object that knows what its suit and number are
// as well as what its value is (or can be, in the case of an ace)
class Card{
	constructor(face, suit){
		this.face = face;
		this.suit = suit;
		this._value = 0;
		this.value = face;
		this.name = face + " of " + suit;
		let imgRank = face;
		if(typeof face === 'string'){
			imgRank = imgRank = face[0] 
		}
		this.imgName = `card${suit}${imgRank}.png`
	}
	get value() {
		return this._value;
	}
	set value(face) {
		if (typeof face === 'number'){
			if((face < 11) && (face > 1)){
				this._value = face;
			}else{
				console.log("Error: valid arguments include a number from 2-10, Ace, Jack, Queen, or King") //TODO: make this actually throw an error
			}
		// face cards are worth 10
		}else if (typeof face === 'string'){
			if (['Jack', 'Queen', 'King'].includes(face)){
				this._value = 10;
			}else if(face === 'Ace'){ // an ace can value at 1 or 11, according to which state is most optimal (11 if point total <=21, else 1)
				this._value = 11;
				// TODO: Make the Ace card automatically update its value to either 11 or 1, depending on which will get the owning player's total value closest to 21 without busting
			}else if(face === "Ace*"){
				this._value = 1;
			}else{
				console.log("Error: valid arguments include a number from 2-10, Ace, Jack, Queen, or King")//TODO: Make this actually throw an error
			}
		}
	}
}

// the deck contains 52 distinct cards. there are 4 suits (spades, clubs, hearts, diamonds)
// each suit contains 13 cards: ace. 2-10. jack, queen, king.
// when a card is drawn, remove a random card from the deck so that it cannot be drawn again until the next game
let deck = {
	deal() {
		// choose a card at random from the remaining cards
		randomNumber = Math.floor(Math.random() * (this.remainingCards.length))
		randomCard = this.remainingCards[randomNumber];
		// remove it from the deck
		this._remove(randomNumber)
		// return the card
		return randomCard;
	},
	_remove(cardIndex) {
		// remove a card from the deck
		// should be called by deal, not directly
		this.remainingCards.splice(cardIndex, 1)
	},
	remainingCards: [],
		// contains either a dictionary or an array that keeps track of what cards remain
		// array implementation: there is an array with numbers in it, from 1 to 52
		// draw chooses a number at random, and checks to see if that number is in the remainingCards array
	reshuffle() { 
		// resets remainingCards back to its initial value, with all cards remaining
		tempDeck = [];

		const suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds']
		const faces = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'Ace']

		suits.forEach( suit => {
			faces.forEach( face => {
				let card = new Card(face, suit);
				tempDeck.push(card)
			})
		});
		this.remainingCards = tempDeck;

	}
};

class Hand{
	constructor(player){
		// belongs to a player (either the user or the dealer)
		this.player = player;
		// contains a model of what cards are currently in the assigned player's hand
		this.cards = [];
		// contains a model of the assigned players' current total points
		this.pointTotal = 0; //TODO: make this private and give it a getter that returns it, and a setter that calls updatePointTotal and console.logs that it should not be set directly
	}

	addCard(card){
		if(card != undefined){
			this.cards.push(card);
		}else{
			console.log("card error: " + card)
		}
		this.updatePointTotal();
	}

	updatePointTotal(){
		// TODO: when the hand's current total points updates, it causes any aces in the hand to adjust their values to either 1 or 11 according to what would give the player the best outcome
		let currentPointTotal = this.cards.reduce( (pointsSoFar, currentCard) => {
			return pointsSoFar += currentCard.value;
		}, 0);
		
		if (currentPointTotal > 21){
			// if your points would be over 21 but there are one or more aces in your hand whose values are 11, change the first ace's value to 1 and recalculate
			let indexOfBigAce = this.getIndexOfBigAce();
			if(indexOfBigAce !== -1){
				// find first big ace and make it small
				this.cards[indexOfBigAce].value = "Ace*";
				currentPointTotal -= 10;
				this.updatePointTotal(); //becomes recursive
			}
		}

		this.pointTotal = currentPointTotal;
		if (this.pointTotal > 21){
			this.player.bust();
		}
	}

	getIndexOfBigAce(){
		let ace = this.cards.findIndex( card=> {
			return ((card.face === "Ace") && (card._value === 11))
		})
		return ace;
	}
};

class Player{
	constructor(idName){
		this.hand = new Hand(this);
		this.id = idName;
	}
	
	hit() {
		// a button in the document that the user can click will activate this method for the user
		// the gameManager will call this method for the dealer automatically when the time is right
		let newCard = deck.deal();
		this.hand.addCard(newCard);
		viewManager.updatePlayerViews(this, newCard);
	}

	stand() {
		// lets the gameManager know that they're going to end their turn. once the user stands, the dealer takes their turn, and then the winner is decided
		gameManager.standHandler(this);	
	}

	bust() {
		viewManager.revealBust(this.id)
		gameManager.endGame(this.id)
	}
}

let gameManager = {
	dealer: new Player("dealer"),
	user: new Player("user"),
	endGame(loser) {

		// TODO: Disable user buttons until restart (and ideally make them look disabled)
		$('.hit.button').off('click');
		$('.stand.button').off('click');
		viewManager.toggleButtons();

		let messageText = "";
		// if the dealer lost, display a message indicating that the user won
		if(loser === "tie"){
			messageText = "Wow! A tie.";
		}else if (loser === "dealer"){
			messageText = "Congratulations! You win!";
		}else if (loser === "user"){
			messageText = "Oooh, sorry...you lost this round.";
		}
		
		viewManager.displayMessage(messageText);
		// display a reset button to start a new game
		viewManager.toggleRestartButton()
		$(`.restart.button`).on('click', () => { 
			viewManager.toggleButtons();
			viewManager.toggleRestartButton();
			viewManager.eraseMessage();
			gameManager.startNewGame();
		})
	},
	determineLoser(){
		if(this.dealer.hand.pointTotal === this.user.hand.pointTotal){
			this.endGame("tie")
		} else if (this.dealer.hand.pointTotal > this.user.hand.pointTotal){
			this.endGame(this.user.id);
		} else {
			this.endGame(this.dealer.id);
		}
	},
	standHandler(player){
		if (player.id === "user"){
			this.aiPlayerTurn();
		}else if(player.id === "dealer"){
			this.determineLoser()
		}else{
			console.log("Argument error: expected existing player id as a string")
		}
	},
	aiPlayerTurn(){
		let aiPlayer = this.dealer;
		// If the dealer has <17 points, they hit. If they hit and bust, the game ends and the user wins.
		// If they have 17-21 points, they stand. When the dealer stands, compare their score to the user's score:
		// if the user's score is higher, they win. if the dealer's score is higher, the user loses.
		if(aiPlayer.hand.pointTotal < 17){
			aiPlayer.hit();
			this.aiPlayerTurn();
		}else if ((aiPlayer.hand.pointTotal >= 17) && (aiPlayer.hand.pointTotal <= 21)){
			aiPlayer.stand();
		}

	},
	startNewGame() {
		// clear the visual cards off the screen TODO: implement visual cards and clear them
		viewManager.hideBusts()
		viewManager.clearCards()
		// reshuffle the deck so that it contains all cards
		deck.reshuffle();
		// reset the model representation of cards in the players' hands
		this.dealer.hand = new Hand(this.dealer);
		this.user.hand = new Hand(this.user);
		
		// Dealer gets one card face-up, one card face-down (or one card face-up and nothing else)
		this.dealer.hit()

		// User gets two cards
		this.user.hit()
		this.user.hit()

		// Update the starting view
		
		viewManager.updatePlayerViews(this.dealer)
		viewManager.updatePlayerViews(this.user)

		// Dealer pauses, and user can either hit or stand
		// If the user hits, they may bust, which will end the game
		// If they stand, the dealer takes their turn
		// Wait for user input
		$('.hit.button').on('click', function(){
			gameManager.user.hit()
		})
		$('.stand.button').on('click', function(){
			gameManager.user.stand()
		})
	}
}

let viewManager = {
	updateHandView(player){
		let playerName = player.id;
		let cards = player.hand.cards
		let cardDisplays = $(`.${playerName}Hand .card`)
		if( cardDisplays.length < cards.length ){
			for(i = cardDisplays.length; i < cards.length; i++){
				this.addCardToHandView(player, cards[i])
			}
		}
	},
	updatePointView(player){
		let playerName = player.id;
		let points = player.hand.pointTotal;
		$(`.${playerName}Score span`).text(`${points}`)
	},
	updatePlayerViews(player, card){
		this.updateHandView(player, card);
		this.updatePointView(player);
	},
	addCardToHandView(player, card){
		// let cardHTML = `<div class="card"><span class="cardName">${card.name}</span></div>` //text-only version
		let cardHTML = `<div class="card"><img class="cardImage" src="./img/cards/${card.imgName}" alt="${card.name}"></div>`
		$(`.${player.id}Hand`).append(cardHTML)

		// animation:
		// deck image exists on page.
		// add a card to the dom, its img starts out invisible/hidden but its div is not
		// use jquery to find out the .offset() of the card's div
		// create a copy of that card's image on top of the deck
		// move the copy of the card to the offet of the real card
		// reveal the real card's img
		// delete the copy card and its img

	},
	clearCards(){
		$(".card").remove();
	},
	displayMessage(text){
		$(`.message h2`).text(`${text}`);
	},
	eraseMessage(){
		$(`.message h2`).text("");
	},
	toggleButtons(){
		if ($('.buttons').hasClass('disabled')){
			$('.buttons').removeClass('disabled')	
		}else{
			$('.buttons').addClass('disabled')
		}
	},
	toggleRestartButton(){
		if ($(".restart.button").length === 0){
			$(`.message`).append(`<div class="restart button">NEW ROUND</div>`);
		}else{
			$(`.restart.button`).remove()
		}
	},
	revealBust(playerName){
		$(`.${playerName}BustContainer .bustText`).show()
	},
	hideBusts(){
		$(`.bustText`).hide()	
	}
}


function run(){
	gameManager.startNewGame();
}

run();