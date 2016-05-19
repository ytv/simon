App.service('AppService', function() {
    const SEQUENCE_LENGTH = 20;
    var sequence = [];
    var userInput = [];
    var j = 0;

    this.getSequenceLength = function() {
        return SEQUENCE_LENGTH;
    };

    this.generateSequence = function(n) {
        for(var i = 0; i < n; i++)
            sequence.push(Math.floor(Math.random()*4) + 1);
    };

    this.getColorSequence = function() {
        var colorObjs = [];
        for(var i = 0; i < SEQUENCE_LENGTH; i++) {
            colorObjs.push(this.getColor(i));
        }
        return colorObjs;
    };

    this.resetSequence = function() {
        sequence = [];
    };

    this.getColor = function(i) {
        var colorCode = sequence[i];
        return {code: colorCode,
                lightColorObj: this.getLightColorObj(colorCode),
                darkColorObj: this.getDarkColorObj(colorCode)
            }
    };

    this.getLightColorObj = function(colorCode) {
        switch(colorCode) {
            case 1:
                return {"background-color":"#3DF43D"}
            case 2:
                return {"background-color":"#F61616"}
            case 3:
                return {"background-color":"#FCFC17"}
            case 4:
                return {"background-color":"#006EFF"}
        };
    };

    this.getDarkColorObj = function(colorCode) {
        switch(colorCode) {
            case 1:
                return {"background-color":"green"}
            case 2:
                return {"background-color":"#C71C1C"}
            case 3:
                return {"background-color":"#C5C507"}
            case 4:
                return {"background-color":"#0808C1"}
        };
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
            return 0;
        // if correct input and sequence is completed
        } else if (userInput[j] === sequence[j] && j === SEQUENCE_LENGTH - 1) {
            return 3;
        // if correct input and round is completed
        } else if (userInput[j] === sequence[j] && j === round - 1) {
            return 2;
        // if correct input and round not yet completed
        } else {
            return 1;
        }
    };

    this.resetUserInput = function() {
        j = 0;
        userInput = [];
    };

});
