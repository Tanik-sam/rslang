import { local } from '../controller/local';
import Textbook from '../view/textbook/textbook';

class App {
    private textbook;

    constructor() {
        this.textbook = new Textbook();
    }

    start(): void {
        local();
        if (localStorage.flag) {
            localStorage.removeItem('flag');
        }
    }
}

export default App;
