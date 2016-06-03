App.service('SequenceService', [function() {
    const SEQUENCE_LENGTH = 20;
    let sequence = [];
    let userInput = [];
    let j = 0;

    this.STATE = {WIN: 'win', WRONG: 'wrong', NEXT_ROUND: 'next round', NEXT_INPUT: 'next input'};

    this.getSequenceLength = function() {
        return SEQUENCE_LENGTH;
    };

    this.getSequence = function() {
        console.log(sequence);
        return sequence;
    };

    this.generateSequence = function(n) {
        for(var i = 0; i < n; i++)
            sequence.push(Math.floor(Math.random()*4) + 1);
        return sequence;
    };

    this.resetSequence = function() {
        sequence = [];
    };

    this.addUserInput = function(n, round) {
        userInput.push(n);
        var result = this._compareSequence(round);
        j++;
        return result;
    };

    this._compareSequence = function(round) {
        // if user input is incorrect
        if(userInput[j] !== sequence[j]) {
            return this.STATE.WRONG;
        // if correct input and sequence is completed
        } else if (userInput[j] === sequence[j] && j === SEQUENCE_LENGTH - 1) {
            return this.STATE.WIN;
        // if correct input and round is completed
        } else if (userInput[j] === sequence[j] && j === round - 1) {
            return this.STATE.NEXT_ROUND;
        // if correct input and round not yet completed
        } else {
            return this.STATE.NEXT_INPUT;
        }
    };

    this.resetUserInput = function() {
        j = 0;
        userInput = [];
    };

}]);
