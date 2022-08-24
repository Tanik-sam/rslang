import { local } from '../controller/local';
import Textbook from '../view/textbook/textbook';

class App {
    private textbook;

    constructor() {
        this.textbook = new Textbook();
    }

    start(): void {
        local();
        /* (document.getElementById('login') as HTMLElement).addEventListener('click', (e: Event) =>
            console.log(`Ты нажал ${e.target}, а что ты сделал, чтобы она работала????`)
        );
        (document.getElementById('textbook') as HTMLElement).addEventListener('click', () =>
            this.textbook.drawTextbook()
        ); */
    }
}

export default App;
