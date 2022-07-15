# A JavaScript Boggle Solver


## Solve _n_ x _n_ Boggle Grids using the English Scrabble Dictionary

This project is a pure, vanilla JavaScript implementation of a Boggle-grid solver, able to process letter grids of arbitrary size.    

Note that Boggle Grids are, by definition, square, so a grid will have equal width and height.    

The problem-space grows exponentially with grid dimension, so be cautious (or patient) when using large values for n!    

The list of admissible words are contained within _dictionary.js_, which returns an array of valid words to the page on page load.    

Solution calculation is timed to the millisecond, and the first, longest playable word is also listed, for interest.

