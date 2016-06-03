App.service('AudioService', [function() {
    const URL = {
        BUZZER: 'http://www.soundjay.com/misc/sounds/fail-buzzer-02.mp3',
        WIN: 'http://soundbible.com/grab.php?id=1003&type=mp3',
        1: 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
        2: 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
        3: 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
        4: 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'
    };

    let audio = {1: {}, 2:{}, 3: {}, 4: {}, buzzer: {}, win: {}};

    this.playSound = function(sound) {
        audio[sound].play();
    };

    this.setUpSoundEffects = function() {
        for(let i = 1; i < 5; i++) {
            audio[i] = Track(URL[i]);
        }
        audio.buzzer = Track(URL.BUZZER);
        audio.win = Track(URL.WIN);
    };

    function Track(url) {
        let audio = document.createElement('audio');
        audio.setAttribute('src', url);
        return audio;
    };
}]) ;
