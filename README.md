#15

##[Live](http://www.douglasgordon.me/15/)

An implementation of the classic 15 puzzle with shuffler and solver. Built with React.

##Screenshot:
![screenshot]
[screenshot]: ./docs/assets/15.png

##Technical Details:

This implementation of the 15 puzzle consists of a Game component which stores all the logic shuffling, solving, and handling user keyboard presses, and child components of individual Tiles and EmptyTiles.

The Board is shuffled with semi-random moves. Only semi-random because I wanted to avoid the board shuffling back and forth between two states.

###Solving
To solve the 15 puzzle, I initially used an A* search on a priority queue which uses the Manhattan distance between the board states and the solved board state, storing the moves to get to that board state. However, for well shuffled board states this implementation causes a stack overflow. So, in production I simply store the moves made to get from the solved board state to the shuffled board state and reverse these moves in order to get back to the solved board state. The original implementation can be seen in docs/Solver/solver.js.
