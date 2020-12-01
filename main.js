// Model

// Represent the data being presented in the document
// 
// the deck contains 52 distinct cards. there are 4 suits (spades, clubs, hearts, diamonds)
// each suit contains 13 cards: ace. 2-10. jack, queen, king.
// when a card is drawn, remove a random card from the deck so that it cannot be drawn again until the next game
// 
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

};

let userManager = {

}

let hand = {
	// belongs to a player (either the user or the dealer)
	// contains a model of what cards are currently in the assigned player's hand
	// contains a model of the assigned players' current total points
};

let gameManager = {
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
		// a button in the document that the user can click will activate this method for the user
		// this method will activate automatically for the dealer under certain conditions
	},
	stand(player) {

	}
}

let dealerManager = {
	hand: {}, //holds a hand object belonging to the dealer

}

// an ace can value at 1 or 11, players' choice(or, according to which state is most optimal)
// face cards are worth 10