Array.prototype.arrayEqual = function(arr) {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] !== this[i]) { return false; }
  }
  return true;
};

class Board {

  constructor (arr, numMoves, moves) {
    this.board = arr;
    this.numMoves = numMoves;
    this.moves = moves;
    this.manhattan = this.manhattan();

  }

  manhattan() {
    const lineLength = Math.sqrt(this.board.length);

    let totalManhattanDistance = 0;
    let i = 0;
    this.board.forEach((value) => {

      let intendedIdx;
      if (value === 0) {
        intendedIdx = this.board.length - 1;
      } else {
        intendedIdx = (value - 1);
      }

      const actualIdx = i;
      const linearDistance = Math.abs(intendedIdx - actualIdx);
      const verticalDistance =  Math.floor((linearDistance / lineLength));
      const horizontalDistance = linearDistance % lineLength;
      const localManhattanDistance = verticalDistance + horizontalDistance;
      totalManhattanDistance += localManhattanDistance;
      i += 1;
    });
    return totalManhattanDistance;
  }

  isSolved() {
    for (let i = 0; i < this.board.length; i += 1) {
      if ( ((this.board[i] === 0) && (i !== this.board.length - 1)) ||
          ((this.board[i] !== 0) && this.board[i] !== i + 1) ) {
        return false;
      }
    }
    return true;
  }

  neighbors() {
    const lineLength = Math.sqrt(this.board.length);

    let neighboringBoards = [];
    const emptyIdx = this.board.indexOf(0);

    if (emptyIdx % lineLength !== 0) {
      let moves1 = this.moves.slice();
      let newBoard1 = this.board.slice();
      newBoard1[emptyIdx] = newBoard1[emptyIdx - 1];
      newBoard1[emptyIdx - 1] = 0;
      neighboringBoards.push(new Board(newBoard1, this.numMoves + 1, moves1.concat('left')));
    }

    if (!this.rightTiles().includes(emptyIdx)) {
      let moves2 = this.moves.slice();
      let newBoard2 = this.board.slice();
      newBoard2[emptyIdx] = newBoard2[emptyIdx + 1];
      newBoard2[emptyIdx + 1] = 0;
      neighboringBoards.push(new Board(newBoard2, this.numMoves + 1, moves2.concat('right')));
    }

    if (emptyIdx < this.board.length - lineLength) {
      let moves3 = this.moves.slice();
      let newBoard3 = this.board.slice();
      newBoard3[emptyIdx] = newBoard3[emptyIdx + lineLength];
      newBoard3[emptyIdx + lineLength] = 0;
      neighboringBoards.push(new Board(newBoard3, this.numMoves + 1, moves3.concat('down')));
    }

    if (emptyIdx >= lineLength) {
      let newBoard4 = this.board.slice();
      let moves4 = this.moves.slice();
      newBoard4[emptyIdx] = newBoard4[emptyIdx - lineLength];
      newBoard4[emptyIdx - lineLength] = 0;
      neighboringBoards.push(new Board(newBoard4, this.numMoves + 1, moves4.concat('up')));
    }
    return neighboringBoards;

  }

  rightTiles() {
    const tiles = [];
    let i = 0;
    while (i < this.board.length) {
      if ((i + 1) % Math.sqrt(this.board.length) === 0) {
        tiles.push(i);
      }
      i += 1;
    }
    return tiles;
  }
}

class Solver {

  constructor(board) {
    this.priority_queue = [board];
  }

  sortQueue() {
    this.priority_queue = this.priority_queue.sort(this.compare);
  }

  compare(a, b) {
    if (a.manhattan < b.manhattan) {
      return -1;
    } else if (a.manhattan > b.manhattan) {
      return 1;
    } else {
      return 0;
    }
  }

  solve() {
    let currentBest = this.priority_queue[0];
    while(!currentBest.isSolved()) {
      this.addAllNeighboringStatesToPriorityQueue();
      this.sortQueue();
      console.log(this.priority_queue);

      this.removeLowPriorityStates();
      currentBest = this.priority_queue[0];
      console.log(this.priority_queue);
      console.log(currentBest);

    }
    currentBest.moves = this.invertMoves(currentBest.moves);
    return currentBest;
  }

  addAllNeighboringStatesToPriorityQueue() {

    let newStates = [];
    this.priority_queue.forEach((board) => {
      let neighbors = board.neighbors();
      neighbors.forEach((neighbor) => {
        if (!this.alreadyInQueue(neighbor)) {
          newStates.push(neighbor);
        }
      });
    });
    this.priority_queue = this.priority_queue.concat(newStates);
  }

  alreadyInQueue(neighbor) {
    for (let i = 0; i < this.priority_queue.length; i += 1) {
      if (this.priority_queue[i].board.arrayEqual(neighbor)) {
        return false;
      }
    }
    return true;
  }

  removeLowPriorityStates() {
    if (this.priority_queue.length < 10) { return; }
    const finalIdx = this.priority_queue.length - 1;
    const lowestManhattan = this.priority_queue[finalIdx].manhattan;
    for (let i = finalIdx; i >= 0; i -= 1) {
      if (lowestManhattan > this.priority_queue[i].manhattan) {
        this.priority_queue = this.priority_queue.slice(0);
        break;
      }
    }
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

  }

//example starting states

let zeroAway = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
let oneAway = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 13, 14, 15, 12];
let twoAway = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 11, 13, 14, 15, 12];
let threeAway = [1, 2, 3, 4, 5, 6, 0, 8, 9, 10, 7, 11, 13, 14, 15, 12];
let fourAway = [1, 2, 3, 4, 5, 0, 6, 8, 9, 10, 7, 11, 13, 14, 15, 12];
let fiveAway = [1, 2, 3, 4, 5, 10, 6, 8, 9, 0, 7, 11, 13, 14, 15, 12];
let sixAway = [1, 2, 3, 4, 5, 10, 6, 8, 0, 9, 7, 11, 13, 14, 15, 12];


let twoAwayEight = [1, 2, 3, 4, 0, 5, 7, 8, 6];
let eightAwayEight = [4, 1, 3, 7, 2, 6, 5, 8, 0];

// Too far from solved - cause stack overflow
let manyAway = [1, 6, 4, 8, 9, 3, 7, 2, 5, 10, 11, 12, 14, 0, 13, 15];
let backwardsEight = [8, 7, 6, 5, 4, 3, 2, 1, 0];

const board = new Board(sixAway, 0, []);
const solver = new Solver(board);
console.log(solver.solve());
