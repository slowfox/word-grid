function writeWordList(words) {
console.log("Starting writeWordList()...");

    let gridContainer;
    try {
        gridContainer = document.getElementsByClassName("grid-container")[0];
    }
    catch {
        console.log("Unable to find grid container!");
        return;
    }

    const validWords = getWords();
    let compiledWords = "<ul type=\"disc\">";

    for (w=0; w<validWords.length; w++){
        compiledWords += "<li>" + validWords[w] + "</li>";
    }

    compiledWords += "<\\ul>";
    gridContainer.innerHTML = compiledWords;
}