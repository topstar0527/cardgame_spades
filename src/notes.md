# Spades Game Architecture

## Game (managed by client)

* G:
  * players: dealHands(),
  * card_played: [{},{},{},{}],
  * player_bid: [0,0,0,0],
  * player_pts: [0,0,0,0],

  * roundsPlayed: 0,
  * lastWinner: 0,  

## Context (managed by framework)

* ctx:
  * Turn vars
    * lastWinner: 0
    * playOrder: [0,1,2,3]
    * playOrderPos: 1

  * Player Names
    * p1_name
    * p2_name
    * p3_name
    * p4_name

  * Total pts
    * team1_points
    * team1_bags
    * team2_points
    * team2_bags

  * Round pts
    * p1_bid
    * p2_bid
    * p3_bid
    * p4_bid
    * p1_cur
    * p2_cur
    * p3_cur
    * p4_cur

  * To End
    * totalRemainingCards
