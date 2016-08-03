/*  Rules of the Game:

    Click the red "start" button to begin.  The game will play a sequence of colors and sounds
    with which the user needs to repeat in the exact same order (by clicking on the right colors).
    Round one starts with only 1 color in the sequence.  Each time the user     successfully repeats
    the sequence, the game will move on to the next round where the last sequence will start all
    over with an additional color/sound added at the end.

    If the user is in strict mode (by clicking on the yellow button), clicking on the wrong color
    when attempting to repeat a sequence will reset the game back to round 1.  If not in strict mode,
    an incorrect attempt will only reset the game to the beginning of the current round.  Clicking the start
    button will not only reset the game to round 1 but also generate a whole new sequence of colors.

    The user wins after successfully repeating the sequence at round 20. */

App.controller('AppCtrl', ['$scope', '$timeout', 'SequenceService', 'AudioService', function($scope, $timeout, SequenceService, AudioService) {

    // *** initialize variables ***

    const COLOR_CODE = {1:"green", 2: "red", 3: "yellow", 4: "blue"};
    const SPEED = 500; // in milliseconds
    let lock = true,
        colorSequence = [],
        count = 0,
        round = 1,
        turnOffTimer,
        recursiveTimer,
        timer,
        display = {wrong: '!!', go: 'Go!'}
        sound = {buzzer: 'buzzer', win: 'win'};

    // *** initialize scope display variables ***

    $scope.on = true;
    $scope.strict = false;
    $scope.green = false;
    $scope.red = false;
    $scope.yellow = false;
    $scope.blue = false;

    // *** initialize scope functions ***

    $scope.init = function() {
        AudioService.setUpSoundEffects();
        reset(true);
    };

    $scope.toggleOnOff = function() {
        if($scope.on === true) {
            cancelAllTimers();
            turnOffAllLights();
            $scope.textDisplay = "";
        }
        $scope.on = !$scope.on;
    };

    // *** initialize non-scope functions ***

    // resets everything and generates a new sequence
    reset = function(restart) {
        SequenceService.resetSequence();
        colorSequence = SequenceService.generateSequence(SequenceService.getSequenceLength());
        resetToRoundOne(restart);
    };

    // resets back to round 1
    resetToRoundOne = function(restart) {
        cancelAllTimers();
        turnOffAllLights();
        $scope.textDisplay = display.go;
        round = 1;
        resetRound(restart);
    };

    // resets the current round
    resetRound = function(restart) {
        count = 0;
        lock = false;
        SequenceService.resetUserInput();
        if(restart) {
            timer = $timeout(function() {
                $scope.textDisplay = round;
                playSequence(round);
            }, SPEED*3);
        }
    };

    /*  Uses the "count" variable to recursively iterate through the sequence for
        each round.  Iteration ends when "count" increments to "round".
        Timers are used to time "turning on and off" the lights of each color */
    playSequence = function(round) {
        let colorCode = colorSequence[count];
        AudioService.playSound(colorCode);
        $scope.lightUp(colorCode);
        turnOffTimer = $timeout(function() {
            turnOffAllLights();
            recursiveTimer = $timeout(function(){
                count++;
                if(count < round)
                    playSequence(round);
            }, SPEED/2);
        }, SPEED);
    };

    $scope.passUserInput = function(n) {
        if($scope.on === true && lock === false) {
            cancelAllTimers();
            turnOffAllLights();
            let result = SequenceService.addUserInput(n, round);
            switch(result) {
                // correct input and round not yet completed
                case SequenceService.STATE.NEXT_INPUT:
                    break;
                // correct input and round is completed
                case SequenceService.STATE.NEXT_ROUND:
                    round++;
                    resetRound(true);
                    break;
                // correct input and sequence is completed
                case SequenceService.STATE.WIN:
                    AudioService.playSound(sound.win);
                    toggleLights(0, 5);
                    lock = true;
                    $scope.textDisplay = "";
                    break;
                // user input is incorrect
                default:
                    wrongInput();
                    break;
             }
         }
    };

    // Lights up the color that the user clicks
    $scope.lightUp = function(n) {
        if($scope.on === true && lock === false) {
            AudioService.playSound(n);
            switch (n) {
                case 1:
                    $scope.green = true;
                    break;
                case 2:
                    $scope.red = true;
                    break;
                case 3:
                    $scope.yellow = true;
                    break;
                case 4:
                    $scope.blue = true;
                    break;
                default:
                    break;
            }
        }
    };

    turnOnAllLights = function() {
        $scope.green = true;
        $scope.red = true;
        $scope.yellow = true;
        $scope.blue = true;
    };

    turnOffAllLights = function() {
        $scope.green = false;
        $scope.red = false;
        $scope.yellow = false;
        $scope.blue = false;
    };

    wrongInput = function() {
        AudioService.playSound(sound.buzzer);
        $scope.textDisplay = display.wrong;
        toggleLights(0, 3);
        ($scope.strict === false) ? resetRound(true) : resetToRoundOne(true);
    };

    // Causes all the lights to repeated flash on and off in unison n times
    toggleLights = function(i, n) {
        if(i < n) {
            lock = true;
            turnOnAllLights();
            let timer = $timeout(function() {
                turnOffAllLights();
                let timer = $timeout(function() {
                    toggleLights(i+1, n);
                }, 200);
            }, 200);
            lock = false;
        }
    };

    cancelAllTimers = function() {
        $timeout.cancel(turnOffTimer);
        $timeout.cancel(recursiveTimer);
        $timeout.cancel(timer);
    };
}]);
