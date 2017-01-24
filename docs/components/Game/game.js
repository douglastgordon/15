import React from 'react';
import FlipMove from 'react-flip-move';
import Tile from '../Tile/tile';
import EmptyTile from '../Tile/empty_tile';

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

let emptyTileIndex;

export default class Game extends React.Component {

  constructor() {
    super();
    const GAME_SIZE = 15;

    this.moveTileUp = this.moveTileUp.bind(this);
    this.moveTileDown = this.moveTileDown.bind(this);
    this.moveTileRight = this.moveTileRight.bind(this);
    this.moveTileLeft = this.moveTileLeft.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.solve = this.solve.bind(this);
    this.state = {
      tiles: [],
      busy: false,
      movesFromSolved: [],
      won: false
    };
  }

  componentWillMount() {
    window.addEventListener("keydown", this.handleKeyPress);
    const tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    this.setState({ tiles });
  }

  makeTiles() {
    let tiles = this.state.tiles;
    tiles = tiles.map((value) => {
      if (value === 0) {
        return (<EmptyTile key={value} />);
      } else {
        return (<Tile number={value} key={value} />);
      }
    });
    return tiles;
  }

  handleKeyPress(event) {
    if (this.state.busy) { return; }
    switch (event.key) {
      case 'ArrowDown':
        this.moveTileUp();
        break;
      case 'ArrowUp':
        this.moveTileDown();
        break;
      case 'ArrowLeft':
        this.moveTileRight();
        break;
      case 'ArrowRight':
        this.moveTileLeft();
        break;
      default:
        return;
    }
  }

  moveTileUp() {
    const emptyTileIdx = this.findEmptyTile();
    const tiles = this.state.tiles;
    const movesFromSolved = this.state.movesFromSolved;

    if (emptyTileIdx > 3) {
      tiles[emptyTileIdx] = tiles[emptyTileIdx - 4];
      tiles[emptyTileIdx - 4] = 0;
      movesFromSolved.push("up");
      this.setState({ tiles, movesFromSolved }, () => {
        this.checkWon();
      });
    }
  }

  moveTileDown() {
    const emptyTileIdx = this.findEmptyTile();
    const tiles = this.state.tiles;
    const movesFromSolved = this.state.movesFromSolved;

    if (emptyTileIdx <= 11) {
      tiles[emptyTileIdx] = tiles[emptyTileIdx + 4];
      tiles[emptyTileIdx + 4] = 0;
      movesFromSolved.push("down");
      this.setState({ tiles, movesFromSolved }, () => {
        this.checkWon();
      });
    }
  }

  moveTileLeft() {
    const emptyTileIdx = this.findEmptyTile();
    const tiles = this.state.tiles;
    const movesFromSolved = this.state.movesFromSolved;

    if (emptyTileIdx % 4 !== 0) {
      tiles[emptyTileIdx] = tiles[emptyTileIdx - 1];
      tiles[emptyTileIdx - 1] = 0;
      movesFromSolved.push("left");
      this.setState({ tiles, movesFromSolved }, () => {
        this.checkWon();
      });
    }
  }

  moveTileRight() {
    const emptyTileIdx = this.findEmptyTile();
    const tiles = this.state.tiles;
    const movesFromSolved = this.state.movesFromSolved;

    if (![3, 7, 11, 15].includes(emptyTileIdx)) {
      tiles[emptyTileIdx] = tiles[emptyTileIdx + 1];
      tiles[emptyTileIdx + 1] = 0;
      movesFromSolved.push("right");

      this.setState({ tiles, movesFromSolved }, () => {
        this.checkWon();
      });
    }
  }

  checkWon() {
    if (this.gameWon()) {
      this.setState({ won: true }, () => {
        console.log("hello");
        setTimeout(() => this.setState({ won: false}), 2000);
      });
    }
  }

  findEmptyTile() {
    const tiles = this.state.tiles;
    for (let i = 0; i < tiles.length; i += 1 ) {
      if (tiles[i] === 0) {
        return i;
      }
    }
  }

  gameWon() {
    const solved = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    for (let i = 0; i < solved.length; i += 1) {
      if (solved[i] !== this.state.tiles[i]) {
        return false;
      }
    }
    return true;
  }


  // Following methods control shuffling of board

  shuffle() {
    if (this.state.busy) { return; }
    this.setState({ busy: true });

    let delay = 500;
    delay = this.make40Moves(delay);

    setTimeout(() => {
      this.setState({ busy: false });
    }, delay);
  }

  make40Moves(delay) {
    const tiles = this.state.tiles;
    emptyTileIndex = tiles.indexOf(0);

    let previousMove;
    for (let i = 0; i < 40; i += 1) {
      previousMove = this.makeRandomMove(delay, previousMove);
      delay += 100;
    }
    return delay;
  }

  makeRandomMove(delay, previousMove) {

    let nextMove = Math.floor((Math.random() * 4));
    nextMove = this.fixMove(nextMove, previousMove);

    switch (nextMove) {
      case 0:
        setTimeout(() => { this.moveTileUp(); }, delay);
        emptyTileIndex -= 4;
        return 0;
      case 1:
        setTimeout(() => { this.moveTileDown(); }, delay);
        emptyTileIndex += 4;
        return 1;
      case 2:
        setTimeout(() => { this.moveTileLeft(); }, delay);
        emptyTileIndex -= 1;
        return 2;
      case 3:
        setTimeout(() => { this.moveTileRight(); }, delay);
        emptyTileIndex += 1;
        return 3;
      default:
        return;
    }
  }

  // This method doesn't NEED to exist,
  // but makes for smoother shuffling animation

  fixMove(nextMove, previousMove) {

    // ensures that next move doesn't simply revert the previous
    if (nextMove === 0 && previousMove === 1) {
      nextMove = 2;
    } else if (nextMove === 1 && previousMove === 0) {
      nextMove = 3;
    } else if (nextMove === 2 && previousMove === 3) {
      nextMove = 0;
    } else if (nextMove === 3 && previousMove === 2) {
      nextMove = 1;
    }

    // ensures that the next move will be legal
    // (there are also safeguards against this in moveTile{Direction})
    if (nextMove === 0 && emptyTileIndex <= 3) {
      nextMove += 1;
    } else if (nextMove === 1 && emptyTileIndex > 11 ) {
      nextMove -= 1;
    }
    if (nextMove === 2 && emptyTileIndex % 4 === 0) {
      nextMove += 1;
    } else if (nextMove === 3 && [3, 7, 11, 15].includes(emptyTileIndex)) {
      nextMove -= 1;
    }

    return nextMove;
  }

  // following methods are for shuffling

  solve() {
    if (this.gameWon() || this.state.busy) { return; }
    this.setState({ busy: true });
    const reversedMovesFromSolved = this.state.movesFromSolved.reverse();
    const movesToMake = this.invertMoves(reversedMovesFromSolved);
    this.runAI(movesToMake);
  }

  invertMoves(moves) {
    const inversion = {
      'up' : 'down',
      'down' : 'up',
      'right' : 'left',
      'left' : 'right'
    };
    moves = moves.map((move) => {
      return inversion[move];
    });
    return moves;
  }

  runAI(moves) {
    let delay = 500;
    moves.forEach((move) => {
      this.singleAImove(move, delay);
      delay += 100;
    });
    setTimeout(() => {
      this.setState({ busy: false, movesFromSolved: [] });
    }, delay);
  }

  singleAImove(move, delay) {
    switch (move) {
      case 'up':
        setTimeout(() => { this.moveTileUp(); }, delay);
        break;
      case 'down':
        setTimeout(() => { this.moveTileDown(); }, delay);
        break;
      case 'left':
        setTimeout(() => { this.moveTileLeft(); }, delay);
        break;
      case 'right':
        setTimeout(() => { this.moveTileRight(); }, delay);
        break;
      default:
        return;
    }
  }

  render() {
    const tiles = this.makeTiles();
    let buttons;
    if (!this.state.busy) {
      buttons = (
        <div className="buttons">
          <div onClick={this.shuffle}>Shuffle</div>
          <div onClick={this.solve}>Solve</div>
        </div>
      );
    }

    let won = this.state.won ? (<p className="winner">Solved!</p>) : '';

    return (
      <div>
        <h1>15 Puzzle</h1>
        {won}
          <FlipMove
            className="board"
            onKeyDown={this.handleKeyPress}
            easing="cubic-bezier(0, 0, 1, 1)"
            duration="100">
            {tiles}
          </FlipMove>
        {buttons}
        <p>move arrow keys to play</p>
      </div>
    );
  }

}
