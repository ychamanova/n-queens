// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //get all rows
      //var allRows = this.rows();
      //extract the row we are working on by index
      var thisRow = this.get(rowIndex);
      //console.log(thisRow);
      //define items found on rows
      var items = 0;
      //iterate over the row to see how many items exist (1 equals item, 0 equals no item)
      for (var i = 0; i < thisRow.length; i++) {
        if (thisRow[i] === 1) {
          items++;
        }
      }
      return items > 1;

    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // get all rows
      var rows = this.rows();
      var result = false;
      //for each row run a "has row conflicts?" function
      for (var i = 0; i < rows.length; i++) {
        if (this.hasRowConflictAt(i)) {
          result = true;
        }
      }
      return result;
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var allRows = this.rows();
      var nubmersOfColumns = this.get('n');
      var items = 0;
      for ( var i = 0; i < nubmersOfColumns; i++) {
        if (allRows[i][colIndex] === 1) {
          items ++;
        }
      }

      return items > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var allRows = this.rows();
      var nubmersOfColumns = this.get('n');
      var result = false;
      for (var i = 0; i < nubmersOfColumns; i++) {
        if (this.hasColConflictAt(i)) {
          result = true;
        }
      }
      return result;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow, rowIndex = 0) {
      var allRows = this.rows();
      var numberOfColumns = this.get('n');
      var items = 0;
      var offset = this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, majorDiagonalColumnIndexAtFirstRow);
      //check if this col index at 0 row is a 1??

      // for (var i = majorDiagonalColumnIndexAtFirstRow; i < numberOfColumns; i++) {
      //   if (allRows[0 + i][i + i] === 1) {
      //     items++;
      //   }
      // }
      for (var i = 0; i < numberOfColumns; i++) {
        for (var j = majorDiagonalColumnIndexAtFirstRow; j < numberOfColumns; j++ ) {
          if (allRows[i][j] === 1 && this._getFirstRowColumnIndexForMajorDiagonalOn(i, j) === offset) {
            items ++;
          }
        }
      }

      return items > 1;
      //then push that one to item
      //else
      //loop this col index+1, row+1, this col index+2, this row index + 2 , + 3, etc


    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var allRows = this.rows();

      var numberOfColumns = this.get('n');

      for (var i = 0; i < numberOfColumns; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      for (var i = 0; i < allRows.length; i++) {
        if (this.hasMajorDiagonalConflictAt(0, i)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow, rowIndex = 0) {
      var allRows = this.rows();
      var numberOfColumns = this.get('n');
      var items = 0;
      var offset = this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, minorDiagonalColumnIndexAtFirstRow);
      //check if this col index at 0 row is a 1??

      // for (var i = majorDiagonalColumnIndexAtFirstRow; i < numberOfColumns; i++) {
      //   if (allRows[0 + i][i + i] === 1) {
      //     items++;
      //   }
      // }
      for (var i = 0; i < numberOfColumns; i++) {
        for (var j = numberOfColumns - 1; j >= 0; j-- ) {
          if (allRows[i][j] === 1 && this._getFirstRowColumnIndexForMinorDiagonalOn(i, j) === offset) {
            items ++;
          }
        }
      }

      return items > 1;
      //then push that one to item
      //else
      //loop this col index+1, row+1, this col index+2, this row index + 2 , + 3, etc

    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var allRows = this.rows();

      var numberOfColumns = this.get('n');

      for (var i = 0; i < numberOfColumns; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      for (var i = 0; i < allRows.length; i++) {
        if (this.hasMinorDiagonalConflictAt(numberOfColumns, i)) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());

