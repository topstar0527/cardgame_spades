export class Card {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  toString() {
    var mapping = {
      "Spades": "\u2660",
      "Clubs": "\u2663",
      "Hearts": "\u2665",
      "Diamonds": "\u2666"
    }
    var rank = (this.rank).toString()
    switch(this.rank) {
      case 1:
        rank = 'A'
        break
      case 13:
        rank = 'K'
        break
      case 12:
        rank = 'Q'
        break
      case 11:
        rank = 'J'
        break
      default:
        return rank.concat(mapping[this.suit])
    }
    return rank.concat(mapping[this.suit]);
  }
}

export class Deck extends Array {
  constructor(numOfDecks=0, numOfJokers=0) {
    super()
    var suits = ["Spades", "Clubs", "Hearts", "Diamonds"]
    for (var i = 1; i <= numOfDecks; i++) {
      for(var s = 0; s < 4; s++) {
        for(var r = 1; r <= 13; r++) {
          this.push(new Card(r, suits[s]))
        }
      }
      for (var j = 0; j < numOfJokers; j++) {
        this.push(new Card(777, "JOKER"))
      }
    }
  }

  shuffle(){
    let m = this.length
    var i
    while(m > 0){
      i = Math.floor(Math.random() * m--)
      
      var t_card = this[m]
      this[m] = this[i]
      this[i] = t_card
    }
    return this
  }

  toString() {
    var deck = [];
    for (var card of this) {
      deck.push(card.toString())
    }

    return deck
  }
}