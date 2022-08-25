import '../../style.scss';
import Welcome from './welcome';
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
