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

export default class Game extends React.Component {

  constructor() {
    super();
    const GAME_SIZE = 15;
    this.state = {
      won: false,
      tiles: [],
    };
  }

  componentWillMount() {
    const tiles = this.makeGameArray();
    this.setState({ tiles });
  }

  makeGameArray() {
    let array = [];
    for (let i = 1; i <= 15; i += 1) {
      array.push(i);
    }
    array = shuffleArray(array);
    array.push(0);
    return array;
  }

  makeTiles() {
    const gameArray = this.state.tiles;
    const tiles = [];
    gameArray.forEach((num) => {
      if (num === 0) {
        tiles.push(<EmptyTile />);
      } else {
        tiles.push(<Tile number={num} />);
      }
    });
    return tiles;
  }

  render() {
    const tiles = this.makeTiles();
    return (
      <div className="board">
        {tiles}
      </div>
    );
  }

}
