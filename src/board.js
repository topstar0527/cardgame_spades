import React from 'react';
import PropTypes from 'prop-types';
import './board.css';

export class Board extends React.Component {
  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    playerID: PropTypes.string,
    isActive: PropTypes.bool,
    isMultiplayer: PropTypes.bool,
  };

  onCardClick(id) {
    if (this.isActive(id)) {
      this.props.moves.PlayCard(id);
      this.props.events.endTurn();
    }
  }

  onBidSelect(id) {
    if (this.isActive(id)) {
      this.props.moves.SelectBid(id);
      this.props.events.endTurn();
    }
  }

  isActive(id) {
    if (!this.props.isActive) return false;
    return true;
  }

  render() {
    const handStyle = {
      border: '1px solid #555',
      width: '30px',
      height: '10px',
      lineHeight: '40px',
      textAlign: 'center',
    };    
    let winner = ''
    if (this.props.ctx.gameover) {
      winner =
        this.props.ctx.gameover.winner !== undefined ? (
          <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
        ) : (
          <div id="winner">Error</div>
        );
    }

    let hand = this.props.G.players[this.props.playerID]
    let tbody = []
    let hand_html = []
    if (this.props.G.players[this.props.playerID]) {
      var hand_size = hand.length
      for (let id = 0; id < hand_size; id++) {
        hand_html.push(
          <td style={handStyle} key={id} onClick={() => this.onCardClick(id)}>
            {hand[id].toString()}
          </td>
        );
      }
    }
    tbody.push(<tr key={this.props.playerID}>{hand_html}</tr>)

    let bid_buttons = []
    if (this.props.ctx.phase === 'Bid')
    {  
      for (let bid = 0; bid <= 13; bid++) {
        if (bid === 0)
          bid_buttons.push(<button type="button" key={bid} onClick={() => this.onBidSelect(bid)}>Nil</button>)
        else 
          bid_buttons.push(<button type="button" key={bid} onClick={() => this.onBidSelect(bid)}>{bid}</button>)
      }
    }


    var pot_cards = [];


    return (
      <div style={{backgroundColor: "#088022"}}>
        Phase: {this.props.ctx.phase}
        <br></br>
        Current Players: {this.props.ctx.currentPlayer}
        <div>
          <table id="board" style={{overflow: 'auto'}}>
            <tbody>{tbody}</tbody>
          </table>
          {this.props.G.playerNames[this.props.playerID]}
          <br></br>
          {bid_buttons}
          {winner}
        </div>
        <br></br>
        <div>
        </div>
      </div>
    );
  }
}
export default Board