import '../../style.scss';
import Welcome from './welcome';
// import { getWords } from '../../controller/fetch';

class AudioChallenge {
    private welcome: Welcome;

    constructor() {
        this.welcome = new Welcome();
    }

    drawWelcome() {
        this.welcome.drawDefault();
    }
}

window.onload = function audioChallengeInit(): void {
    const audioChallenge: AudioChallenge = new AudioChallenge();
    audioChallenge.drawWelcome();
};

export default AudioChallenge;
