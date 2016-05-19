App.controller('App.Ctrl', function($scope, $timeout, AppService) {
    const colorCode = {1:"green", 2: "red", 3: "yellow", 4: "blue"};
    const speed = 500; // in milliseconds
    var on = false;
    var lock = false;
    var strict = false;
    var colorSequence = [];
    var count = 0;
    var round = 1;
    var turnOffTimer;
    var recursiveTimer;
    var timer;
    var sound = {1:{}, 2:{}, 3: {}, 4: {}};
    var buzzer;
    var win;

    $scope.init = function() {
        if(on === true) {
            setUpSoundEffects();
            reset(true);
        }
    };

    $scope.toggleOnOff = function() {
        if(on === true) {
            on = false;
            $scope.btn__off = {"background-color": "#8A96B6"};
            $scope.btn__on = {"background-color": "#333"};
            cancelAllTimers();
            turnOffAllLights();
            $scope.screen = "";
        }
        else {
            on = true;
            $scope.btn__off = {"background-color": "#333"};
            $scope.btn__on = {"background-color": "#8A96B6"};
        }
    };

    $scope.toggleStrict = function() {
        if(strict === false) {
            strict = true;
            $scope.btn__strict = {"box-shadow":"inset 0 0 8px #666"};
        }
        else {
            strict = false;
            $scope.btn__strict = {"box-shadow":"inset 0 0 1px #666"}
        }

    };

    startRound = function(round) {
        $scope.screen = round;
        var color = colorSequence[count];
        playSound(color.code);
        // Light up the color by changing its CSS background-color value
        $scope[colorCode[color.code]] = color.lightColorObj;
        turnOffTimer = $timeout(function() {
            // darken the color by changing back its CSS background-color value
            $scope[colorCode[color.code]] = color.darkColorObj;
            recursiveTimer = $timeout(function(){
                count++;
                if(count < round)
                    startRound(round);
            }, speed/2);
        }, speed);
    };

     $scope.passUserInput = function(n) {
         if(on === true && lock === false) {
             cancelAllTimers();
             turnOffAllLights();
             var result = AppService.addUserInput(n, round);
             switch(result) {
                 // user input is incorrect
                 case 0:
                    wrongInput();
                    break;
                // correct input and round not yet completed
                 case 1:
                    break;
                 // correct input and round is completed
                 case 2:
                    round++;
                    resetRound(true);
                    break;
                  // correct input and sequence is completed
                  case 3:
                    win.play();
                    toggleLights(0, 5);
                    break;
             }
         }
    };

    $scope.lightUp = function(n) {
        if(on === true && lock === false) {
            $scope[colorCode[n]] = AppService.getLightColorObj(n);
            playSound(n);
        }
    };

    turnOnAllLights = function() {
        $scope[colorCode[1]] = AppService.getLightColorObj(1);
        $scope[colorCode[2]] = AppService.getLightColorObj(2);
        $scope[colorCode[3]] = AppService.getLightColorObj(3);
        $scope[colorCode[4]] = AppService.getLightColorObj(4);
    };

    turnOffAllLights = function() {
        $scope[colorCode[1]] = AppService.getDarkColorObj(1);
        $scope[colorCode[2]] = AppService.getDarkColorObj(2);
        $scope[colorCode[3]] = AppService.getDarkColorObj(3);
        $scope[colorCode[4]] = AppService.getDarkColorObj(4);
    };

    // resets everything and generates a new sequence
    reset = function(restart) {
        AppService.resetSequence();
        AppService.generateSequence(AppService.getSequenceLength());
        // initialize sequence of color objects
        colorSequence = AppService.getColorSequence();
        resetToRound1(restart);
    };

    // resets back to round 1
    resetToRound1 = function(restart) {
        cancelAllTimers();
        turnOffAllLights();
        $scope.screen = "Go!";
        round = 1;
        resetRound(restart);
    };

    //resets the current round
    resetRound = function(restart) {
        count = 0;
        AppService.resetUserInput();
        if(restart) {
            var timer = $timeout(function() {
                startRound(round);
            }, speed*3);
        }
    };

    wrongInput = function() {
        buzzer.play();
        $scope.screen = '!!';
        lock = true;
        toggleLights(0, 3);
        lock = false;
        var timer = $timeout(function() {
            if(strict === false)
                resetRound(true);
            else resetToRound1(true);
        }, 1500);
    };

    toggleLights = function(i, n) {
        if(i < n) {
            turnOnAllLights();
            var timer1 = $timeout(function() {
                turnOffAllLights();
                var timer2 = $timeout(function() {
                    toggleLights(i+1, n);
                }, 200);
            }, 200);
        }
    };

    cancelAllTimers = function() {
        $timeout.cancel(turnOffTimer);
        $timeout.cancel(recursiveTimer);
        $timeout.cancel(timer);
    };

    playSound = function(n) {
        sound[n].play();
    };

    setUpSoundEffects = function() {
        sound[1] = document.createElement('audio');
        sound[2] = document.createElement('audio');
        sound[3] = document.createElement('audio');
        sound[4] = document.createElement('audio');
        sound[4] = document.createElement('audio');

        sound[1].setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
        sound[2].setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
        sound[3].setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
        sound[4].setAttribute('src', 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');

        buzzer = document.createElement('audio');
        win = document.createElement('audio');

        buzzer.setAttribute('src', 'http://www.soundjay.com/misc/sounds/fail-buzzer-02.mp3');
        win.setAttribute('src', 'http://soundbible.com/grab.php?id=1003&type=mp3');

    };

});
