var minesweeper = require("../");


exports["game is initially rendered as all unexplored"] = function(test) {
    var io = fakeIo();
    
    minesweeper.runGame(io, 3);
    
    test.equal(io.output(), "  A B C \n0 . . . \n1 . . . \n2 . . . \n");
    
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
