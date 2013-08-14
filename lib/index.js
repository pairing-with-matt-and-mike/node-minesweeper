var size = 10;

function mkRender(renderSquare) {
    return function(board) {
        process.stdout.write("  ");
        for (var j = 0; j < size; j++) {
            var charCode = "A".charCodeAt(0) + j;
            process.stdout.write(String.fromCharCode(charCode));
            process.stdout.write(" ");
        }
        process.stdout.write("\n");

        for (var i = 0; i < size; i++) {
            process.stdout.write(i + " ");
            for (var j = 0; j < size; j++) {
                process.stdout.write(
                    renderSquare(board, i, j) + " ");
            }
            process.stdout.write("\n");
        }

    };
}

var render = mkRender(function (board, i, j) {
    return board[i][j] === states.explored ?
        nearMines(board, i, j) : ".";
});

var renderAll = mkRender(function (board, i, j) {
    return board[i][j] === states.explored ?
        nearMines(board, i, j) : board[i][j];
});

var states = {
    empty: ".",
    mine: "*"
};

function generateBoard () {
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

function main() {
    var readline = require("readline");
    var board = generateBoard();
    render(board);

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on("line", function(line) {
        var result = /([A-Z])([0-9])/.exec(line);
        if (result !== null) {
            var column = result[1].charCodeAt(0) -
                    "A".charCodeAt(0);
            var row = result[2];
            if (board[row][column] === states.mine) {
                console.log("Arrrggghhhh");
                renderAll(board);
                process.exit(0);
            } else {
                explore(board, row ,column);
            }
            render(board);
        }
    }).on("close", function() {
        process.exit(0);
    });
}

function explore(board, row, column) {
    if (row < 0 || row >= size ||
        column < 0 || column >= size) {
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

main();
