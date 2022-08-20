import { IWords } from '../../app/interfaces';
import '../../style.scss';
import '../../assets/sass/components/_audio-challenge.scss';
import Welcome from './welcome';
import { getWords } from '../../controller/fetch';

/*
const wordList = 'http://localhost:3000/words';

export async function getWords(page = 0, group = 0) {
    const response = await fetch(`${wordList}?page=${page}&group=${group}`);
    const words = await response.json();
    return words;
}
export async function getWord(id: string) {
    const response = await fetch(`${wordList}/${id}`);
    const word = await response.json();
    return word;
}
*/

class AudioChallenge {
    private welcome: Welcome;

    constructor() {
        this.welcome = new Welcome();
    }

    data!: IWords[];

    currentLevel = 0;

    page = 0;

    group: number = this.currentLevel || 0;

    getData(): void {
        (async () => {
            this.data = await getWords(this.page, this.group);
            // this.drawWelcome();
        })();
    }

    drawWelcome() {
        this.welcome.drawDefault();
        console.log(this.data);
    }
}

window.onload = function audioChallengeInit(): void {
    const audioChallenge: AudioChallenge = new AudioChallenge();
    audioChallenge.drawWelcome();
};

export default AudioChallenge;
