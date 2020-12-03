// a card is an object that knows what its suit and number are
// as well as what its value is (or can be, in the case of an ace)
class Card{
	constructor(face, suit){
		this.face = face;
		this.suit = suit;
		this.value = face;
		this.name = face + " of " + suit;
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
			}else if(face === 'Ace'){ // an ace can value at 1 or 11, players' choice (or, according to which state is most optimal)
				this._value = 1;
				// TODO: Make the Ace card automatically update its value to either 11 or 1, depending on which will get the owning player's total value closest to 21 without busting
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
		randomNumber = Math.floor(Math.random() * (this.remainingCards.length + 1))
		randomCard = this.remainingCards[randomNumber];
		// remove it from the deck
		this._remove(randomNumber)
		// return the card
		return randomCard;
	},
	_remove(cardIndex) {
		// remove a card from the deck
		// should be called by , not directly
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
		
		this.pointTotal = currentPointTotal;

		if (this.pointTotal > 21){
			this.player.bust();
		}
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
		this.hand.addCard(deck.deal());
	}

	stand() {
		// lets the gameManager know that they're going to end their turn. once the user stands, the dealer takes their turn, and then the winner is decided
	}

	bust() {
		gameManager.endGame(this.id)
	}
}

let gameManager = {
	dealer: new Player("dealer"),
	user: new Player("user"),
	endGame(loser) {
		// if the dealer lost, display a message indicating that the user won
		if (loser === "dealer"){
			console.log("Congratulations! You win!")
		}else if (loser === "user"){
			console.log("Oooh, sorry...you lost this round. Refresh the page to play a new round.")
		}
		
		// display a reset button to start a new game
	},
	startNewGame() {
		// clear the visual cards off the screen TODO: implement visual cards and clear them
		// reshuffle the deck so that it contains all cards
		deck.reshuffle();
		// reset the model representation of cards in the players' hands
		dealer.hand = new Hand(dealer);
		user.hand = new Hand(user);
		
		// Dealer gets one card face-up, one card face-down (or one card face-up and nothing else)
		dealer.hit()

		// User gets two cards
		user.hit()
		user.hit()

		// Dealer pauses, and user can either hit or stand
		// If the user hits, they may bust, which will end the game
		// If they stand, the dealer takes their turn
		// If the dealer has <17 points, they hit. If they hit and bust, the game ends and the user wins.
		// If they have 17-21 points, they stand. When the dealer stands, compare their score to the user's score:
		// if the user's score is higher, they win. if the dealer's score is higher, the user loses.
	}
}


function run(){
	gameManager.startNewGame();
}

run();