// JavaScript Document

/**
 *
 * Original implementation problems:
 * 1. Binding game logic to UI element is bad practice
 * 2. Hardcoded solution, can only handle 3x3
 *
 * Improved version:
 * 1. Game logic now binds to data structure (2D matrix/2D array) instead of CSS classes
 * 2. Can handle any grid size
 * 3. UI is free to change while not impacting the game logic
 *
 */


$(document).ready(function () {
    var x = "x"
    var o = "o"
    var count = 0;
    var o_win = 0;
    var x_win = 0;

    // assuming user enter number, skipping validation for simplicity.
    const gridSize = Number(prompt("Enter gridsize (default is 3):", "3"));

    let o_selections = [];
    let x_selections = [];

    // initialize grid of any size
    for (let i = 0; i < gridSize * gridSize; i++) {
        $('#game').append('<li class="cell btn span1" id=' + i + '>+</li>')
    }

    $('.grid').css('grid-template-columns', `repeat(${gridSize}, 80px)`);
    $('.grid').css('grid-template-rows', `repeat(${gridSize}, 80px)`);

    // all possible solution for horizontal lines
    const horizontalSolutionSets = (gridSize) => {
        const templateRow = (rowNum) => [...Array(gridSize).keys()].map((cell) => cell + rowNum + (gridSize - 1) * rowNum);
        const rows = [];

        for (let i = 0; i < gridSize; i++) {
            rows.push(templateRow(i));
        }

        return rows;
    }

    // all possible solution for vertical lines
    const verticalSolutionSets = (gridSize) => {
        const templateCol = (colNum) => [...Array(gridSize).keys()].map((cell) => cell * gridSize + colNum);
        const cols = []

        for (let i = 0; i < gridSize; i++) {
            cols.push(templateCol(i))
        }

        return cols;
    }

    // all possible solution for vertical lines
    const diagonalSolutionSets = (gridSize) => {
        const template = horizontalSolutionSets(gridSize);

        const backwardDiag = []  // "\"
        const forwardDiag = []  // "/"

        for (let i = 0; i < gridSize; i++) {
            backwardDiag.push(template[i][i]);
            forwardDiag.push(template[i][gridSize - 1 - i]);
        }

        const diagonals = [backwardDiag, forwardDiag]

        return diagonals;
    }

    // precomputed all possible solution sets for a given grid size
    // one time pre-computation requires O(2N+2) ~= O(N) complexity
    // where N = gridSize because number of possible solutions will always be gridsize * 2 + 2
    // possible solutions = horizontal rows + vertical rows + 2 * diagonals
    const solutionSets = [
        ...horizontalSolutionSets(gridSize),
        ...verticalSolutionSets(gridSize),
        ...diagonalSolutionSets(gridSize)
    ]

    //console.log(solutionSets)

    const isOTurn = () => count % 2 === 0;
    const isXTurn = () => !isOTurn();
    const isGameOver = () => (o_selections.length + x_selections.length) === gridSize * gridSize;
    const isSelected = (selection) => o_selections.includes(selection) || x_selections.includes(selection);

    // subsequent finding solution against a precomputed set
    const hasSolution = (selections) => {
        // if the player's selections include any combination of possible solution sets
        // return true that the player has complated a line
        for (const solution of solutionSets) {
            const found = solution.every((val) => selections.includes(val))

            if (found) {
                return true;
            }
        }

        return false;
    }


    const restart = () => {
        count = 0
        o_selections = []
        x_selections = []
        $("#game li").text("+");
        $("#game li").removeClass('disable')
        $("#game li").removeClass('o')
        $("#game li").removeClass('x')
        $("#game li").removeClass('btn-primary')
        $("#game li").removeClass('btn-info')
    }


    $('#game li').click(function (e) {

        const selection = Number(e.target.id);

        if (isSelected(selection)) {
            alert('Already selected')
            return;
        }

        if (isOTurn()) {
            o_selections.push(selection);
            $(this).text(o)
            $(this).addClass('disable o btn-primary')
            if (hasSolution(o_selections)) {
                o_win++;
                $('#o_win').text(o_win)
                alert('O wins')
                alert('O has won the game. Start a new game')
                restart();
            }
        }

        if (isXTurn()) {
            x_selections.push(selection);
            $(this).text(x)
            $(this).addClass('disable x btn-info')
            if (hasSolution(x_selections)) {
                console.log("XX")
                x_win++;
                $('#x_win').text(x_win)
                alert('X wins')
                alert('X has won the game. Start a new game')
                restart();
            }
        }

        console.log(`====ROUND ${count}====`)
        console.log("O:", o_selections);
        console.log("X:", x_selections);

        if (isGameOver()) {
            alert('Its a tie. It will restart.')
            restart()
            console.log("====RESTART====")
        }

        count++;
    });

    $("#reset").click(function () {
        x_win = 0;
        o_win = 0;
        $('#o_win').text(o_win)
        $('#x_win').text(x_win)
        restart()
    });
});
