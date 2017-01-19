import React from 'react';

export default class Game extends React.Component {

  constructor() {
    super();
    this.state = {
      won: false,
    };
  }

  render() {
    return (
      <div>This is the game component</div>
    );
  }

}
