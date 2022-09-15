import '../../style.scss';
import AudioChallengeGame from './game';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { local } from '../../controller/local';

class AudioChallenge {
    private game: AudioChallengeGame;

    constructor() {
        this.game = new AudioChallengeGame();
    }

    drawWelcome() {
        this.game.drawDefault();
    }

    draw(value: number) {
        this.game.draw(value);
    }

    drawWords() {
        this.game.drawWords();
    }
}

window.onload = function audioChallengeInit(): void {
    const audioChallenge: AudioChallenge = new AudioChallenge();
    local();
    if (localStorage.flag === 'game') {
        audioChallenge.draw(Number(localStorage.getItem('group')) + 1);
        audioChallenge.drawWords();
    } else {
        audioChallenge.drawWelcome();
    }
};

window.onunload = function audioChallengeClose(): void {
    localStorage.removeItem('flag');
};

export default AudioChallenge;
