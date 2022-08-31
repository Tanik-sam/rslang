import '../../style.scss';
import AudioChallengeGame from './game';

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
