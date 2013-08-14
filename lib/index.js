function render(io, game) {
    io.write("  ");
    for (var j = 0; j < game.width; j++) {
        var charCode = "A".charCodeAt(0) + j;
        io.write(String.fromCharCode(charCode));
        io.write(" ");
    }
    io.write("\n");

    for (var i = 0; i < game.height; i++) {
        io.write(i + " ");
        for (var j = 0; j < game.width; j++) {
            io.write(game.externalState(i, j) + " ");
        }
        io.write("\n");
    }
}

var states = {
    empty: ".",
    mine: "*"
};

function generateBoard (size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        var row = [];
        for (var j = 0; j < size; j++) {
            if (Math.random() < 0.1) {
                row.push(states.mine);
            } else {
                row.push(states.empty);
            }
        }
        board.push(row);
    }
    return board;
}

function nearMines (board, i, j) {
    var result = 0;
    for (var ii = i - 1; ii <= i + 1; ii++) {
        for (var jj = j - 1; jj <= j + 1; jj++) {
            var row = board[ii] || [];
            if (row[jj] === states.mine) {
                result++;
            }
        }
    }
    return result;
}

function createGame(board) {
    var self = {
        externalState: function(row, column) {
            if (self.isFinished) {
                return board[row][column] === states.explored ?
                    nearMines(board, row, column) : board[row][column];
            } else {
                return board[row][column] === states.explored ?
                    nearMines(board, row, column) : ".";
            }
        },
        explore: function(row, column) {
            if (board[row][column] === states.mine) {
                self.isFinished = true;
            } else {
                explore(board, row, column);
            }
        },
        height: board.length,
        width: board[0].length,
        isFinished: false
    };
    
    return self;
}

function runGame(io, size) {
    var board = generateBoard(size);
    var game = createGame(board);
    render(io, game);

    io.onLine(function(line) {
        var result = /([A-Z])([0-9])/.exec(line);
        if (result !== null) {
            var column = result[1].charCodeAt(0) -
                    "A".charCodeAt(0);
            var row = result[2];
            game.explore(row, column);
            if (game.isFinished) {
                io.write("Arrrggghhhh\n");
                render(io, game);
                io.exit();
            } else {
                render(io, game);
            }
        }
    });
}

function main() {
    var readline = require("readline");

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    var io = {
        write: function(value) {
            process.stdout.write(value);
        },
        onLine: function(callback) {
            rl.on("line", callback);
        },
        exit: function() {
            process.exit(0);
        }
    };
    
    runGame(io, 10);
    
    rl.on("close", function() {
        process.exit(0);
    });
}

function explore(board, row, column) {
    if (row < 0 || row >= board.length ||
        column < 0 || column >= board[0].length) {
        return;
    }
    if (board[row][column] === states.explored) {
        return;
    }
    board[row][column] = states.explored;
    if (nearMines(board, row, column) === 0) {
        for (var i = row - 1; i <= row +1; i++) {
            for (var j = column - 1; j <= column + 1; j++) {
                explore(board, i, j);
            }
        }
    }
}

if (require.main === module) {
    main();
}

exports.runGame = runGame;
exports.states = states;
exports.createGame = createGame;
