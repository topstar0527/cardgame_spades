import { PlayerView, TurnOrder, Stage } from 'boardgame.io/core';
import { Deck } from './deck.js';

// Setup Round
function dealHands(G) {
  var playerHands = {}
  G.deck.shuffle()
  for (var i = 0; i < 4; i++) {
    var hand = new Deck()
    for (var j = 0; j < 13; j++) {
      hand.push( G.deck.pop() )
    }
    playerHands[i.toString()] = hand
  } 
  
  return playerHands
}

// Moves
function PlayCard(G, ctx, id) {
  let card = G.players[ctx.currentPlayer].splice(id, 1)
  G.card_played[ctx.currentPlayer] = card
  G.deck.push(card)
}

function SelectBid(G, ctx, id) {
  G.player_bid[ctx.currentPlayer] = id
}

// Calculate phase winner
function calcWinner(G) {
  var first_player_card = G.card_played[G.firstPlayer][0]

  var mainSuit = first_player_card.suit,
      max = first_player_card.rank,
      winner = G.firstPlayer

  for(let i = 1; i <= 3; i++) {
    var next_playerID = (G.firstPlayer + i) % 4
    var next_playerCard = G.card_played[next_playerID][0]

    var suit = next_playerCard.suit,
        rank = next_playerCard.rank

    if (isBestHand(mainSuit, max, suit, rank)) {
      console.log(suit, rank, " Beats ", mainSuit, max)
      max = rank
      winner = next_playerID
    }
  }

  return winner
}

function isBestHand(mainSuit, max, c_suit, c_rank) {
  (c_rank === 1) && (c_rank = 14)
  if (mainSuit !== "Spades" && c_suit === "Spades") {
    mainSuit = "Spades"
    return true
  }
  if (mainSuit === c_suit && c_rank > max) return true
}

function everyonePlayed(G) {
  return (13-G.numOfCardsPlayed === G.players[0].length &&
            G.players[0].length === G.players[1].length &&
            G.players[1].length === G.players[2].length &&
            G.players[2].length === G.players[3].length)
}

// Calculate round winner
function countAllPoints(G, ctx) {
  
  var t1_pts = G.player_pts[0] + G.player_pts[2],
      t1_bid = G.player_bid[0] + G.player_bid[2],
      t2_pts = G.player_pts[1] + G.player_pts[3],
      t2_bid = G.player_bid[1] + G.player_bid[3]

  var tot_t1_pts, tot_t1_bags, tot_t2_pts, tot_t2_bags

  if (t1_pts >= t1_bid) {
    tot_t1_pts = t1_bid * 10
    tot_t1_bags = t1_pts - t1_bid
  } else {
    tot_t1_pts = -t1_bid * 10
    tot_t1_bags = 0
  }
  if (t2_pts >= t2_bid) {
    tot_t2_pts = t2_bid * 10
    tot_t2_bags = t2_pts - t2_bid
  } else {
    tot_t2_pts = -t2_bid * 10
    tot_t2_bags = 0
  }

  return [tot_t1_pts, tot_t2_pts, tot_t1_bags, tot_t2_bags]
}

export const Spades = {
  setup: (G, ctx) => ({
    // Static
    playerNames: ["Abhi", "Meag", "Ryan", "Matt"],
    
    // Changes every round
    players: {},

    //Fills back up every
    deck: new Deck(1),

    player_bid: Array(4).fill(0),
    player_pts: Array(4).fill(0),

    firstPlayer: 0, 
    card_played: Array(4).fill(null),
    spadesUp: false,

    // Updated Per Round
    team1_pts: 0,
    team2_pts: 0,
    team1_bags: 0,
    team2_bags: 0,

    roundsPlayed: 0,
  }),

  playerView: PlayerView.STRIP_SECRETS,

  moves: { PlayCard },

  turn: { 
    activePlayers: {currentPlayer: Stage.NULL},
    order: TurnOrder.ONCE,
    moveLimit: 1 
  },

  phases: {
    Deal: {
      start:true,
      next: "Bid",
      onBegin: (G, ctx) => {
        G.players = dealHands(G)
      },
      endIf: G => ( G.deck.length === 0 )
    },
    Bid: {
      next: "Play",
      moves: { SelectBid },
      onEnd: G => {
        G.player_pts = [0,0,0,0]
      },
      endIf: (G, ctx) => (ctx.turn === 5),
    },
    Play: {
      next: "Play",
      moves: { PlayCard },
      onEnd: (G, ctx) => {
        // Winning player gets one point and goes first next card
        G.firstPlayer = calcWinner(G)
        G.player_pts[G.firstPlayer]++

        // Clean up, getting ready for next card
        G.card_played.fill(null)
        G.numOfCardsPlayed++

        // End the Round, all cards are done
        if (G.deck.length === 52) {
          ctx.events.setPhase("Round")
        }
      },
      endIf: G => ( everyonePlayed(G) )
    },
    Round: {
      onEnd: G => {
        // Tally scores for round
        var [t1_pts, t2_pts, t1_bgs, t2_bgs] = countAllPoints(G)
        G.team1_points += t1_pts
        G.team2_points += t2_pts
        G.team1_bags += t1_bgs
        G.team2_bags += t2_bgs

        // Clear player points from past round
        G.player_bid.fill(0)
        G.player_pts.fill(0)

        // Re-deal and more dealer chip
        G.players = dealHands(G)
        G.roundsPlayed++
        G.firstPlayer = G.roundsPlayed % 4 
      },
      endIf: (G, ctx) => (G.deck.length === 52),
    },
  },

  endIf: (G) => {
    var winning_pts = Math.max(G.team1_pts, G.team2_pts)
    if (winning_pts >= 500) {
      if (G.team1_pts === winning_pts) {
        return {winner: G.playerNames[0] + " and " + G.playerNames[2] + " Win!!"}
      }
      return {winner: G.playerNames[1] + " and " + G.playerNames[3] + " Win!!"}
    } else
      return null
  },
};