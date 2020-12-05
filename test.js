// to run a test: add this at the bottom. comment out run, run function, and the contents of gameManager.startnewgame()

function test(){

	deck.reshuffle();
	// reset the model representation of cards in the players' hands
	let dealer = new Player("dealer");
	let user = new Player("user");

	dealer.hand = new Hand(dealer);
	user.hand = new Hand(user);

	dealer.hand.addCard(deck.remainingCards[39]) //2 of diamonds
	dealer.hand.addCard(deck.remainingCards[26]) // 2 of clubs
	dealer.hand.addCard(deck.remainingCards[25]) // ace of spades
	dealer.hand.addCard(deck.remainingCards[45]) // 8 of diamonds

}

test()