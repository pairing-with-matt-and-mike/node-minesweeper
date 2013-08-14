var minesweeper = require("../");


exports["game is initially rendered as all unexplored"] = function(test) {
    var io = fakeIo();

    minesweeper.runGame(io, 3);

    test.equal(io.output(), "  A B C \n0 . . . \n1 . . . \n2 . . . \n");

    test.done();
};

exports["external game state is initially all unexplored"] = function(test) {
    var empty = minesweeper.states.empty;
    var game = minesweeper.createGame([
        [empty, empty],
        [empty, empty]
    ]);
    test.equal(empty, game.externalState(0, 0));
    test.equal(empty, game.externalState(0, 1));
    test.equal(empty, game.externalState(1, 0));
    test.equal(empty, game.externalState(1, 1));
    test.done();
};

exports["external game state for explored square is zero if no mines nearby"] = function(test) {
    var empty = minesweeper.states.empty;
    var game = minesweeper.createGame([
        [empty, empty],
        [empty, empty]
    ]);
    game.explore(0, 0);
    test.equal(0, game.externalState(0, 0));
    test.done();
};

exports["external game state for explored square is number of nearby mines"] = function(test) {
    var empty = minesweeper.states.empty;
    var mine = minesweeper.states.mine;
    var game = minesweeper.createGame([
        [empty, mine],
        [mine, mine]
    ]);
    game.explore(0, 0);
    test.equal(3, game.externalState(0, 0));
    test.done();
};

exports["external game state for explored square mine if there is a mine at that square"] = function(test) {
    var empty = minesweeper.states.empty;
    var mine = minesweeper.states.mine;
    var game = minesweeper.createGame([
        [empty, mine],
        [mine, mine]
    ]);
    game.explore(0, 1);
    test.equal(mine, game.externalState(0, 1));
    test.done();
};

exports["fully explored board is finished"] = function(test) {
    var empty = minesweeper.states.empty;
    var mine = minesweeper.states.mine;
    var game = minesweeper.createGame([
        [empty, empty],
        [empty, mine]
    ]);
    game.explore(0, 0);
    game.explore(1, 0);
    game.explore(0, 1);
    test.ok(game.isFinished);
    test.done();
};


function fakeIo() {
    var output = [];
    return {
        write: function(value) {
            output.push(value);
        },
        onLine: function(name, callback) {

        },
        output: function() {
            return output.join("");
        }
    };
}
