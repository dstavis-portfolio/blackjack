// Model

// Represent the data being presented in the document
// 
// the deck contains 52 distinct cards. there are 4 suits (spades, clubs, hearts, diamonds)
// each suit contains 13 cards: ace. 2-10. jack, queen, king.
// when a card is drawn, remove a random card from the deck so that it cannot be drawn again until the next game
 
class Card{
	constructor(face, suit){
		this.face = face;
		this.suit = suit;
		this.value = face;
		this.name = face + " of " + suit;
	},
	_value: 0,
	get value() {
		return this._value;
	},
	set value(face) {
		if (typeof face === 'number'){
			if((face < 11) && (face > 1)){
				this._value = face;
			}else{
				console.log("Error: valid arguments include a number from 2-10, Ace, Jack, Queen, or King") //TODO: make this actually throw an error
			}
		}else if (typeof face === 'string'){
			if (['Jack', 'Queen', 'King'].some(face)){
				this._value = 10;
			}else if(string === 'Ace'){
				this._value = 1;
				// TODO: Make the Ace card automatically update its value to either 11 or 1, depending on which will get the owning player's total value closest to 21 without busting
			}else{
				console.log("Error: valid arguments include a number from 2-10, Ace, Jack, Queen, or King")//TODO: Make this actually throw an error
			}
		}
	}
}

	// a card will probably be an object that knows what its suit and number are
	// as well as what its value is (or can be, in the case of an ace)
	// an ace can value at 1 or 11, players' choice (or, according to which state is most optimal)
	// face cards are worth 10


let deck = {
	draw(player) {
		// choose a card at random from the remaining cards
		// send it to the hand of the chosen player (user or dealer)
		// remove it from the deck
	},
	_remove(card) {
		// remove a card from the deck
		// should be called by draw, not directly
	},
	remainingCards: this.reshuffle(),
		// contains either a dictionary or an array that keeps track of what cards remain
		// array implementation: there is an array with numbers in it, from 1 to 52
		// draw chooses a number at random, and checks to see if that number is in the remainingCards array
		// if it is in the array, remove the number from the array, and run the number through a list that translates the number into its name (ex: 2 of hearts, queen of spades) and value
	reshuffle() { 
		// resets remainingCards back to its initial value
		deck = [];

		const suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds']
		const faces = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'Ace']

		suits.forEach( suit => {
			faces.forEach( face => {
				let card = new Card(face, suit);
			})
		});

	}
};

let hand = {
	// belongs to a player (either the user or the dealer)
	// contains a model of what cards are currently in the assigned player's hand
	// contains a model of the assigned players' current total points
	// when the hand's current total points updates, it causes any aces in the hand to adjust their values to either 1 or 11 according to what would give the player the best outcome
};

let userManager = {
	hand: {
		// the user has a hand that knows what cards they have
		// as well as their current point total
	},
	hit() {
		// a button in the document that the user can click will activate this method for the user
		// tells the gameManager the player wants to draw a card to their hand
	}
}


let dealerManager = {
	hand: {} //holds a hand object belonging to the dealer
}

let gameManager = {
	user: {}, //an object referring to the user
	dealer: {}, //an object reference to the dealer
	win(player) {
		// display a message indicating that the passed player won the game
		// display a reset button to start a new game
	},
	startNewGame() {
		// clear the visual cards off the screen
		// clear the model representation of cards in the players' hands
		// reshuffle the deck so that it contains all cards
		// 
	},
	hit(player) {
		// this method will activate automatically for the dealer under certain conditions
		//
	},
	stand(player) {
		// this method will activate automatically for the dealer under certain conditions
	}
}