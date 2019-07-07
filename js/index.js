/**
 * Tic Tac Toe
 *
 * A Tic Tac Toe game in HTML/JavaScript/CSS.
 *
 * @author gitCodingMan
 */

const N_SIZE = 3,
    EMPTY = '',
    maxDepth = 7, // max depth on the search tree(how many moves we want to look ahead)
    boxes = [],
    humanPlayer = 'O',
    aiPlayer = 'X';

let board = ['', '', '', '', '', '', '', '', ''], // Board represented as 2D Array
    functionCalls = 0, // Counter for minimax function calls
    functionCallsAB = 0; // Counter for minimaxAB function calls

init();

testAB();

/*
 * Just to test alpha-beta pruning against normal minimax
 */
function testAB() {

    const testBoard = ['', '', '', '', '', '', '', '', 'O'];

    // Execute and record the time
    const time1 = Date.now();
    const mini = minimax(aiPlayer, testBoard, 8);
    const time2 = Date.now();
    const miniAB = minimaxAB(aiPlayer, testBoard, -Infinity, Infinity, 8);
    const time3 = Date.now();

    // Loging the results
    
    // For minimax
    console.log("Minimax");
    console.log("index: " + mini.index);
    console.log("score: " + mini.score);
    console.log("function calls: " + functionCalls);
    console.log("time in ms: " + (time2 - time1) / 1000);
    
    // For minimaxAB
    console.log("Minimax with alpha-beta pruning");
    console.log("index: " + miniAB.index);
    console.log("score: " + miniAB.score);
    console.log("function calls: " + functionCallsAB);
    console.log("time in ms: " + (time3 - time2) / 1000);

}

/**
 * Initializes the Tic Tac Toe board and starts the game.
 */
function init() {
    var board = document.createElement('table');
    board.setAttribute('border', 1);
    board.setAttribute('cellspacing', 0);

    var index = 0;
    for (var i = 0; i < N_SIZE; i++) {
        var row = document.createElement('tr');
        board.appendChild(row);
        for (var j = 0; j < N_SIZE; j++) {
            var cell = document.createElement('td');
            cell.setAttribute('height', 120);
            cell.setAttribute('width', 120);
            cell.setAttribute('align', 'center');
            cell.setAttribute('valign', 'center');
            cell.classList.add('col' + j, 'row' + i);
            if (i == j) {
                cell.classList.add('diagonal0');
            }
            if (j == N_SIZE - i - 1) {
                cell.classList.add('diagonal1');
            }
            cell.index = index;
            cell.addEventListener('click', click);
            row.appendChild(cell);
            boxes.push(cell);
            index++;
        }
    }

    document.getElementById('tictactoe').appendChild(board);
    startNewGame();
}

/**
 * New game
 */
function startNewGame() {

    fillIn(board);

}

/**
 * Update the board with the users move and the response move calculated by the AI
 */
function click() {

    // Return if field s aleady set
    if (this.innerHTML !== EMPTY) return

    // Turn of the humanPlayer
    board[this.index] = humanPlayer;

    // Turn of the aiPlayer
    const bestMove = minimax(aiPlayer, board, 1);
    board[bestMove.index] = aiPlayer;

    // Print 2D Array as board to ui
    fillIn(board);

    // Check for winners
    if (winning(board, aiPlayer))
        alert('The AI has won the match!!!');

    // Check for winners
    if (winning(board, humanPlayer))
        alert('You have won the match!!!');

    // Loging the results
    console.log("---");
    console.log("index: " + bestMove.index);
    console.log("function calls: " + functionCalls);

}

/**
 * Minimax algorithm
 *
 * @param actualPlayer
 * @param board (at current time)
 * @param depth (current depth of the tree)
 */
function minimax(actualPlayer, board, depth) {

    functionCalls++;

    // Get empty cells
    const emptyCells = getEmptyCells(board);

    // Return if it's a win, lose, draw or the maxDepth is reached
    if (winning(board, humanPlayer)) {
        return {
            score: -10
        };
    } else if (winning(board, aiPlayer)) {
        return {
            score: 10
        };
    } else if (emptyCells.length === 0) {
        return {
            score: 0
        };
    } else if (depth === maxDepth) {
        return {
            score: 0
        };
    }

    let moves = [];

    // Iterate over all cells
    for (let i = 0; i < emptyCells.length; i++) {

        // Make move
        board[emptyCells[i]] = actualPlayer;

        // Get the next player(if it is aiPlayer then the next is humanPlayer and so on)
        const otherPlayer = actualPlayer === aiPlayer ? humanPlayer : aiPlayer;

        // Call miniax one depth deeper on the tree
        const result = minimax(otherPlayer, board, depth + 1);

        // Undo the move
        board[emptyCells[i]] = EMPTY;

        // Create move object with the index of the move and the score for it
        const move = {
            index: emptyCells[i],
            score: result.score
        };

        // Store moves index and score to create a history of moves to choose from later
        moves.push(move);

    }

    // If the recursion is finished evaluate the best move
    let bestMove;
    if (actualPlayer === aiPlayer) {

        // The AI player tries to reach the highest score
        let bestScore = -Infinity;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }

    } else {

        // The human player tries to reach the lowest score
        let bestScore = Infinity;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }

    }

    // Return the best move up to the upper step in the recurion tree
    return moves[bestMove];

}

/**
 * Minimax algorithm with alpha-beta pruning, that removes unnecessary parts of the tree to reduce runtime of the function
 *
 * @param actualPlayer
 * @param board (at current time)
 * @param alpha
 * @param beta
 * @param depth (current depth of the tree)
 */
function minimaxAB(player, board, alpha, beta, depth) {

    functionCallsAB++;

    // Get empty cells
    const emptyCells = getEmptyCells(board);

    // Return if it's a win, lose, draw or the maxDepth is reached
    if (winning(board, humanPlayer)) {
        return {
            score: -10
        };
    } else if (winning(board, aiPlayer)) {
        return {
            score: 10
        };
    } else if (emptyCells.length === 0) {
        return {
            score: 0
        };
    } else if (depth === maxDepth) {
        return {
            score: 0
        };
    }

    let bestMove;

    // Iterate over all cells
    for (let i = 0; i < emptyCells.length; i++) {

        // Make move
        board[emptyCells[i]] = player;

        // Get the next player(if it is aiPlayer then the next is humanPlayer and so on)
        const nextPlayer = player === aiPlayer ? humanPlayer : aiPlayer;

        // Call miniax one depth deeper on the tree
        const result = minimaxAB(nextPlayer, board, alpha, beta, depth + 1);

        // Undo the move
        board[emptyCells[i]] = EMPTY;

        if (player == aiPlayer) {

            if (alpha < result.score) {
                bestMove = emptyCells[i];
                alpha = result.score;
            }
            if (beta <= alpha) break;

        } else {

            if (beta > result.score) {
                bestMove = emptyCells[i];
                beta = result.score;
            }
            if (beta <= alpha) break;

        }
    }

    const bestScore = player == aiPlayer ? alpha : beta;
    return {
        index: bestMove,
        score: bestScore
    };

}

/**
 * Fill the 2D-Array that is representing the current game status into the ui
 *
 * @param flattenArray
 */
function fillIn(flattenArray) {

    let counterCol = 0,
        counterRow = -1;

    for (let i = 0; i < flattenArray.length; i++) {

        if (i % 3 == 0) {

            counterCol = 0;
            counterRow++;

        }

        // Get element of current index
        const element = document.getElementsByClassName('col' + counterCol + ' row' + counterRow)[0];

        // Fill array with index from flattenArray
        element.innerHTML = flattenArray[i];

        counterCol++;

    }

}

/**
 * Return all empty positions in given board array
 *
 * @param board
 *
 * @return array of empty cells
 */
function getEmptyCells(board) {

    let emptyCells = [];

    for (let i = 0; i < board.length; i++) {

        if (board[i] === EMPTY)
            emptyCells.push(i);

    }

    return emptyCells;

}

/**
 * Helper function check if given player has won the match
 *
 * @param board at current time
 * @param player to check for win
 *
 * @return true for win otherwise return false
 */
function winning(board, player) {
    if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
    ) {
        return true;
    } else {
        return false;
    }
}
