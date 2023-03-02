function toDigit(row) {
  let result = '';

  if ((/^[a-i]$/gi).test(row)) {
    let rowStr = row.toUpperCase();

    result = rowStr.charCodeAt(0) - 65;
  }

  return result;
}

function puzzleArray(puzzleString) {
  let result = [];

  let array = [];
  for (let i = 0; i < puzzleString.length; i++) {
    array.push(puzzleString[i]);

    if (array.length == 9) {
      result.push(array);
      array = [];
    }
  }

  return result;
}

function nextEmptyBox(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] == '.') {
        return [i, j];
      }
    }
  }

  return [-1, -1];
}

class SudokuSolver {

  validateLength(puzzleString) {
    return puzzleString.length == 81;
  }

  validateChar(puzzleString) {
    return (/^[1-9\.]+$/g).test(puzzleString);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rowNum = toDigit(row);
    let columnNum = column - 1;
    let board = puzzleArray(puzzleString);

    if (board[rowNum][columnNum] == value) {
      return true;
    }

    for (let i = 0; i < board.length; i++) {
      if (board[rowNum][i] == value) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let rowNum = toDigit(row);
    let columnNum = column - 1;
    let board = puzzleArray(puzzleString);

    if (board[rowNum][columnNum] == value) {
      return true;
    }

    for (let i = 0; i < board.length; i++) {
      if (board[i][columnNum] == value) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rowNum = toDigit(row);
    let columnNum = column - 1;
    let board = puzzleArray(puzzleString);

    let startAtR = Math.floor(rowNum / 3) * 3;
    let startAtC = Math.floor((columnNum) / 3) * 3;

    if (board[rowNum][columnNum] == value) {
      return true;
    }

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[startAtR + r][startAtC + c] == value) {
          return false;
        }
      }
    }

    return true;
  }

  backtracking(board) {
    let emptyBox = nextEmptyBox(board);
    let row = emptyBox[0];
    let column = emptyBox[1];

    let puzzleString = board.flat().join('');
    let checkRow = String.fromCharCode(row + 65);
    let checkCol = column + 1;

    if (row == -1 && column == -1) {
      return true;
    }

    for (let value = 1; value < 10; value++) {
      if (this.checkRowPlacement(puzzleString, checkRow, checkCol, value) && this.checkColPlacement(puzzleString, checkRow, checkCol, value) && this.checkRegionPlacement(puzzleString, checkRow, checkCol, value)) {
        board[row][column] = value;

        if (this.backtracking(board)) { return true };
      }
    }

    board[row][column] = '.';

    return false;
  }

  solve(puzzleString) {
    let board = [];
    let result = '';

    if (!this.validateLength(puzzleString)) {
      return false;
    }

    if (!this.validateChar(puzzleString)) {
      return false;
    }

    board = puzzleArray(puzzleString);
    this.backtracking(board);

    result = board.flat().join('');

    if (result === puzzleString) {
      return false;
    }

    return result;
  }

}

module.exports = SudokuSolver;