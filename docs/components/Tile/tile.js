import React from 'react';

export default class Tile extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const reds = [1, 3, 6, 8, 9, 11, 14];
    let color = reds.includes(this.props.number) ? 'cream' : 'red';

    return (
      <div className={`tile ${color}`}>{this.props.number}</div>
    );
  }
}
