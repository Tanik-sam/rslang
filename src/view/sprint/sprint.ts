import '../../style.scss';
import SprintGame from './game';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { local } from '../../controller/local';

local();

class Sprint {
    private welcome: SprintGame;

    constructor() {
        this.welcome = new SprintGame();
    }

    drawWelcome() {
        this.welcome.drawDefault();
    }
}

window.onload = function SprintGameInit(): void {
    const sprintGame: Sprint = new Sprint();
    sprintGame.drawWelcome();
};

export default Sprint;
