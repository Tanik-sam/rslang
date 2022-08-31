import '../../style.scss';
import Welcome from './welcome';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
// import { getWords } from '../../controller/fetch';

class SprintGame {
    private welcome: Welcome;

    constructor() {
        this.welcome = new Welcome();
    }

    drawWelcome() {
        this.welcome.drawDefault();
    }
}

window.onload = function SprintGameInit(): void {
    const sprintGame: SprintGame = new SprintGame();
    sprintGame.drawWelcome();
};

export default SprintGame;
