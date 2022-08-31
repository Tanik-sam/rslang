import '../../style.scss';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
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
