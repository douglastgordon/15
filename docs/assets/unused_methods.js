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
