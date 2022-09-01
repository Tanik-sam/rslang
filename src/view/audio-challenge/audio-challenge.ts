import '../../style.scss';
import AudioChallengeGame from './game';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

class AudioChallenge {
    private game: AudioChallengeGame;

    constructor() {
        this.game = new AudioChallengeGame();
    }

    drawWelcome() {
        this.game.drawDefault();
    }
}

window.onload = function audioChallengeInit(): void {
    const audioChallenge: AudioChallenge = new AudioChallenge();
    audioChallenge.drawWelcome();
};

export default AudioChallenge;
