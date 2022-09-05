import '../../style.scss';
import SprintGame from './game';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { local } from '../../controller/local';

class Sprint {
    private welcome: SprintGame;

    constructor() {
        this.welcome = new SprintGame();
    }

    drawWelcome(level = 0) {
        this.welcome.drawDefault(level);
    }

    draw(value: number) {
        this.welcome.draw(value);
    }

    drawTimer() {
        this.welcome.drawTimer();
    }

    countTime(time: number) {
        this.welcome.countTime(time);
    }
}

window.onload = function SprintGameInit(): void {
    const sprintGame: Sprint = new Sprint();
    local();
    const localGroup = Number(localStorage.getItem('group'));
    if (localStorage.flag === 'game') {
        sprintGame.drawTimer();
        sprintGame.draw(localGroup);
        sprintGame.countTime(30);
    } else {
        sprintGame.drawWelcome();
    }
};
export default Sprint;
