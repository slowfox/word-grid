const findResult = {
    VALID_WORD: 1,
    NOT_A_WORD: 2,
    STOP_SEARCH: 9
};
Object.freeze(findResult);


function buildGrid() {

    try {
        document.body.style.cursor = "progress";
        const gridDimension = getGridDimension();
        let letterTiles = getLetters(gridDimension);
        letterTiles = shuffle(letterTiles);
        const grid = generateGridState(gridDimension, letterTiles);

        paintGrid(grid);
        const startPoint = performance.now();
        const solutions = findWords(grid, wordTrie);
        const executionTimeMs = Math.round(performance.now() - startPoint);
        
        paintWords(solutions);
        paintExecutionTime(executionTimeMs, solutions);
        document.body.style.cursor = "auto";
    }
    catch {
        document.body.style.cursor = "auto";
        console.log("Unable to locate grid container on main page");
    }
}


function getGridDimension() {
    // fall back to a 4x4 grid if gridDimension can't be parsed
    let gridDimension = 4;
    try {
        const selectValue = document.getElementById("game-size").value || "4";
        if (selectValue === "CUSTOM") {
            let customSize = prompt("Please specify the grid dimension as a single number:");
            try {
                gridDimension = parseInt(customSize) || 4;
            }
            catch {
                gridDimension = 4;
            }
        }
        else {
            gridDimension = parseInt(selectValue);
        }
    }
    catch {
        console.log("Could not determine grid-size - defaulting to 4")
    }
    return gridDimension;
}


function getOfficialDiceSet() {
    let officialDice = [];
    officialDice.push(["a","j","b","o","b","o"]);
    officialDice.push(["c","s","h","a","p","o"]);
    officialDice.push(["m","h","i","u","qu","n"]);
    officialDice.push(["o","a","t","t","w","o"]);
    officialDice.push(["t","m","u","c","i","o"]);
    officialDice.push(["d","i","t","y","t","s"]);
    officialDice.push(["f","f","a","k","s","p"]);
    officialDice.push(["e","i","e","n","u","s"]);
    officialDice.push(["z","n","l","n","r","h"]);
    officialDice.push(["e","d","v","y","r","l"]);
    officialDice.push(["g","e","e","a","n","a"]);
    officialDice.push(["e","e","g","w","h","n"]);
    officialDice.push(["r","e","v","t","h","w"]);
    officialDice.push(["s","e","s","t","o","i"]);
    officialDice.push(["x","e","l","d","r","i"]);
    officialDice.push(["t","y","t","r","l","e"]);

    return officialDice;
}


function getLetters(gridDimension) {
    const officialDice = getOfficialDiceSet();
    const tileCount = gridDimension * gridDimension;

    let letterTiles = [];
    let diceIndex = 0;
    for (let x=0; x<tileCount; x++) {
        diceIndex = Math.floor(Math.random() * 6);
        letterTiles.push(officialDice[x%officialDice.length][diceIndex]);
    }
    return letterTiles;
}


function shuffle(arr) {
    let i = arr.length;
    let temp = "";
    while (i >0) {
        j = Math.floor(Math.random() * i);
        i-=1;
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}


function generateGridState(gridDimension, letterTiles) {

    let grid = [];
    let tileIndex = 0;
    let boggleTile;

    for (let y=0; y<gridDimension; y++) {
        let gridRow = [];

        for (let x=0; x<gridDimension; x++) {
            tileIndex = (y * gridDimension) + (x%gridDimension);
            boggleTile = new GridCell(letterTiles[tileIndex]);
            gridRow.push(boggleTile);
        }
        grid.push(gridRow);
    }

    return grid;

}



function paintGrid(grid) {
    try{
        const gridContainer = document.getElementsByClassName("grid-container")[0];

        let tableText = "<table class=\"game-grid\">\n";
        
        //note that the grid is ALWAYS square, so width=height=grid.length
        for (let y=0; y<grid.length; y++) {
            tableText += "   <tr class=\"game-row\">\n";

            for (let x=0; x<grid.length; x++) {
                tableText += "      <td class=\"game-cell\" id=\"x" + x + "y" + y + "\">";
                tableText += grid[y][x].letter;
                tableText += "</td>\n";
            }

            tableText += "   </tr>\n";
        }

        tableText += "</table>\n";

        gridContainer.innerHTML = tableText;

    }
    catch {
        console.log("Unable to find grid container on page!");
    }

}


function paintWords(solutions) {
    solutions.sort();
    
    try {
        document.getElementsByClassName("solution-header")[0].innerHTML = "Solutions";
    }
    catch {
        console.log("Could not find solution header");
    }
    try {
        const solutionContainer = document.getElementsByClassName("solution-container")[0];
        let solutionList = "";
        for (s=0; s<solutions.length; s++) {
            solutionList += "<div class=\"solution\">" + solutions[s] + "</div>";
        }
        solutionContainer.innerHTML = solutionList;
    }
    catch {
        console.log("Unable to write solution to page");
    }
}


function paintExecutionTime(t, solns) {
    try {
        let longestWord = "";
        for (let w=0; w<solns.length; w++) {
            if (solns[w].length > longestWord.length) longestWord = solns[w];
        }

        const execTimeContainer = document.getElementsByClassName("execution-time")[0];

        let execString = "<p>Found <b>" + 
            solns.length.toLocaleString("en-GB") + " word(s)</b> in <b>";

        if (t>=1000) execString += (t/1000) + "s</b>.</p>";
        else execString += t + "ms</b>.</p>";

        execString += "<p>There are no playable words longer than <b>" +
            longestWord + "</b>.</p>";

        execTimeContainer.innerHTML = execString;
    }
    catch {
        console.log("Unable to write execution time");
    }
}

function clearGrid() {
    try{
        document.getElementsByClassName("grid-container")[0].innerHTML = "";
        document.getElementsByClassName("solution-header")[0].innerHTML = "";
        document.getElementsByClassName("solution-container")[0].innerHTML = "";
        document.getElementsByClassName("execution-time")[0].innerHTML = "";
    }
    catch {
        console.log("Unable to clear grid elements.");
    }
}


class GridCell {

    constructor(letter) {
        this.letter = letter;
        this.searchDepth = 0;
    }
}


function clearSearchDepth(grid, depth) {

    for (let g=0; g<grid.length; g++) {
        for (let h=0; h<grid.length; h++) {
            if (grid[g][h].searchDepth >= depth) {
                grid[g][h].searchDepth = 0;
            }
        }
    }
}


class BoggleTrie {

    constructor(letterStream) {
        this.valid_word = false;
        this.children = [];
        this.letter = letterStream.slice(0,1);
        if (letterStream.length > 1) {
            this.children = new BoggleTrie(letterStream.slice(1));
        }
    }

    add(incomingString) {
        if (incomingString.length > 0) {
            const leadLetter = incomingString.slice(0,1);

                for (let k=0; k<this.children.length; k++) {
                    if (this.children[k].letter == leadLetter) {
                        if (incomingString.length > 1) {
                            this.children[k].add(incomingString.slice(1));
                        }
                        return;
                    }
                }
            
            const newNode = new BoggleTrie(incomingString.slice(0,1));
            newNode.add(incomingString.slice(1));
            if (incomingString.length == 1) {
                newNode.validWord = true;
            }
            this.children.push(newNode);

            return;
        }
    }


    find(word) {

        let currentNode = this;
        let tileFound = false;
        let searchLetter = "";
        for (let x=0; x<word.length; x++) {
            searchLetter = word.slice(x, x+1);
            tileFound = false;
            for (let y=0; y<currentNode.children.length; y++) {
                if (currentNode.children[y].letter == searchLetter) {
                    currentNode = currentNode.children[y];
                    tileFound = true;
                    break;
                }
            }
            if (!tileFound) { return findResult.STOP_SEARCH;
            }
        }
        if (currentNode.validWord) { return findResult.VALID_WORD;
        }
        else { return findResult.NOT_A_WORD;
        }
    }

}


function snake(grid, x, y, depth, prefix, words, solutions) {

    const wordStem = (prefix || "") + grid[y][x].letter;
    grid[y][x].searchDepth = depth;

    const findReturn = words.find(wordStem);

    if (findReturn == findResult.STOP_SEARCH) {
        clearSearchDepth(grid, depth);
        return;
    }
    else if (findReturn == findResult.VALID_WORD) {
        if (!solutions.includes(wordStem)) {
            solutions.push(wordStem);
        }
    }

    for (let yd=-1; yd<2; yd++) {
        if (y+yd<0) { continue; }
        else if (y+yd>=grid.length) { continue; }

        for (let xd=-1; xd<2; xd++) {
            if (x+xd<0) { continue; }
            else if (x+xd>=grid.length) { continue; }

            if (grid[y+yd][x+xd].searchDepth > 0) { continue; }

            snake(grid, x+xd, y+yd, depth+1, wordStem, words, solutions);
        }
    }
    clearSearchDepth(grid, depth);

}


function findWords(grid, words) {
    let solutions = [];

    for (let y=0; y<grid.length; y++) {
        for (let x=0; x<grid.length; x++) {
            snake(grid, x, y, 1, "", words, solutions);
        }
    }
    
    return solutions;
}


function buildTrie(words) {

    let rootNode = new BoggleTrie("");

    for (w=0; w<words.length; w++) {
        if (words[w].length >= 3) rootNode.add(words[w]);
    }
    return rootNode;
}
