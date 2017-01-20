import React from 'react';
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
    this.shuffleBoard = this.shuffleBoard.bind(this);
    this.state = {
      won: false,
      tiles: [],
      busy: false,
    };
  }

  componentWillMount() {
    window.addEventListener("keydown", this.handleKeyPress);
    const tiles = this.makeGameArray();
    this.setState({ tiles });
  }

  makeGameArray() {
    let array = [];
    for (let i = 1; i <= 15; i += 1) {
      array.push(i);
    }
    array.push(0);
    array = shuffleArray(array);
    while (!this.isSolvable(array)) {
      array = shuffleArray(array);
    }
    return array;
  }

  // Where blank tile starts on odd row from bottom
  // A game is solvable if the number of inversions is even (& visa versa)
  // see: http://www.geeksforgeeks.org/check-instance-15-puzzle-solvable/
  isSolvable(array) {
    const emptyIdx = array.indexOf(0);
    let blankIsOddRowFromBottom = false;
    if ([4, 5, 6, 7, 12, 13, 14, 15].includes(emptyIdx) ) {
      blankIsOddRowFromBottom = true;
    }

    let inversions = 0;
    for (let i = 0; i < array.length - 1; i += 1) {
      for (let j = i; j < array.length; j += 1 ) {
        if (array[i] > array[j]) {
          inversions += 1;
        }
      }
    }
    if ((blankIsOddRowFromBottom && (inversions % 2 === 0)) ||
         !blankIsOddRowFromBottom && (inversions % 2 !== 0)) {
      return true;
    } else {
      return false;
    }
  }

  makeTiles() {
    const gameArray = this.state.tiles;
    const tiles = [];
    gameArray.forEach((num) => {
      if (num === 0) {
        tiles.push(<EmptyTile />);
      } else {
        tiles.push(<Tile number={num} key={num} />);
      }
    });
    return tiles;
  }

  handleKeyPress(event) {
    switch (event.key) {
      case 'ArrowUp':
        this.moveTileUp();
        break;
      case 'ArrowDown':
        this.moveTileDown();
        break;
      case 'ArrowRight':
        this.moveTileRight();
        break;
      case 'ArrowLeft':
        this.moveTileLeft();
        break;
      default:
        return;
    }
  }

  moveTileUp() {
    console.log("up");
    const emptyTileIndex = this.findEmptyTile();
    const tiles = this.state.tiles;
    if (emptyTileIndex > 3) {
      tiles[emptyTileIndex] = tiles[emptyTileIndex - 4];
      tiles[emptyTileIndex - 4] = 0;
      this.setState({ tiles });
    }
  }

  moveTileDown() {
    console.log("down");
    const emptyTileIndex = this.findEmptyTile();
    const tiles = this.state.tiles;
    if (emptyTileIndex <= 11) {
      tiles[emptyTileIndex] = tiles[emptyTileIndex + 4];
      tiles[emptyTileIndex + 4] = 0;
      this.setState({ tiles });
    }
  }

  moveTileLeft() {
    console.log("left");
    const emptyTileIndex = this.findEmptyTile();
    const tiles = this.state.tiles;
    if (emptyTileIndex % 4 !== 0) {
      tiles[emptyTileIndex] = tiles[emptyTileIndex - 1];
      tiles[emptyTileIndex - 1] = 0;
      this.setState({ tiles });
    }
  }

  moveTileRight() {
    console.log("right");
    const emptyTileIndex = this.findEmptyTile();
    const tiles = this.state.tiles;
    if (![3, 7, 11, 15].includes(emptyTileIndex)) {
      tiles[emptyTileIndex] = tiles[emptyTileIndex + 1];
      tiles[emptyTileIndex + 1] = 0;
      this.setState({ tiles });
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
    return (
      this.state.tiles === solved
    );
  }

  shuffleBoard() {

    if (this.state.busy) {
      return;
    } else {
      this.setState({ busy: true });
    }

    let delay = 500;
    delay = this.make20Moves(delay);
    // while (!this.isSolvable(this.state.tiles)) {
    //   delay = this.make20Moves(delay);
    // }

    this.setState({ busy: false });
  }

  make20Moves(delay) {
    const tiles = this.state.tiles;
    emptyTileIndex = tiles.indexOf(0);

    for (let i = 0; i < 40; i += 1) {
      this.makeMove(delay);
      delay += 200;
    }
    return delay;
  }

  makeMove(delay) {

    let rand = Math.floor((Math.random() * 4));
    rand = this.fixRand(rand);


    switch (rand) {
      case 0:
        setTimeout(() => { this.moveTileUp(emptyTileIndex); }, delay);
        emptyTileIndex -= 4;
        break;
      case 1:
      setTimeout(() => { this.moveTileDown(emptyTileIndex); }, delay);
        emptyTileIndex += 4;
        break;
      case 2:
        setTimeout(() => { this.moveTileLeft(emptyTileIndex); }, delay);
        emptyTileIndex -= 1;
        break;
      case 3:
        setTimeout(() => { this.moveTileRight(emptyTileIndex); }, delay);
        emptyTileIndex += 1;
        break;
      default:
        return;
    }
  }

  fixRand(rand) {
    if (rand === 0 && emptyTileIndex <= 3) {
      rand += 1;
    } else if (rand === 1 && emptyTileIndex > 11 ) {
      rand -= 1;
    }
    if (rand === 2 && emptyTileIndex % 4 === 0) {
      rand += 1;
    } else if (rand === 3 && [3, 7, 11, 15].includes(emptyTileIndex)) {
      rand -= 1;
    }
    return rand;
  }

  render() {
    const tiles = this.makeTiles();
    return (
      <div>
        <div className="board" onKeyDown={this.handleKeyPress}>
          {tiles}
        </div>
        <div onClick={this.shuffleBoard}>shuffleBoard</div>
      </div>
    );
  }

}
