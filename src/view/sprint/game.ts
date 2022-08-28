import { IWords } from '../../app/interfaces';
import { getWord, getWords } from '../../controller/fetch';

class SprintGame {
    data: IWords[] = [];

    wordData!: IWords;

    allWords: object[] = [];

    taken: string[] = [];

    // hearts = 5;

    page = 0;

    group = 0;

    id = '';

    currentWord = 0;

    userAnswers: boolean[] = [];

    correctAnswers: IWords[] = [];

    rightWord = '';

    getData(): Promise<void> {
        return (async () => {
            this.data = await getWords(this.page, this.group);
        })();
    }

    getWordData(): Promise<void> {
        return (async () => {
            this.wordData = await getWord(this.id);
        })();
    }

    async draw(value: number): Promise<void> {
        this.group = value - 1;
        const wrap: HTMLElement | null = document.getElementById('sprint__wrapper');

        if (wrap) {
            while (wrap.firstChild) {
                wrap.removeChild(wrap.firstChild);
            }
        }

        const timeSection: HTMLElement = document.createElement('section');
        timeSection.id = 'time-section';
        const timer: HTMLElement = document.createElement('div');
        timer.innerHTML = `
        <div class="timer__image"></div> 
        <p class="countdown">30</p>`;
        timer.id = `timer`;
        timer.className = 'timer';
        timeSection.appendChild(timer);

        if (wrap) {
            wrap.appendChild(timeSection);
        }
        const scoreSection: HTMLElement = document.createElement('section');
        scoreSection.id = 'score-section';
        scoreSection.className = 'score';
        wrap?.appendChild(scoreSection);
        scoreSection.innerHTML = `<p class="score__box button"> Множитель: <span id="multiplier">0</span></p>
        <p class="score__box button"> Очки: <span id="score">0</span></p>
        <div class="status__container">
        </div> `;

        const statusContainer: HTMLElement = document.createElement('section');
        statusContainer.id = 'status-container';
        statusContainer.className = 'words__container';
        wrap?.appendChild(statusContainer);
        statusContainer.innerHTML = `
        <div class = "score__box score__box--big">
        <p class="score__arrow">✓</p>
        <p class="score__box score__box--multi">0</p>
        </div>
            
        `;

        const wordsContainer: HTMLElement = document.createElement('section');
        wordsContainer.id = 'words-container';
        wordsContainer.className = 'words__container';
        wrap?.appendChild(wordsContainer);

        wordsContainer.innerHTML = `
        <p id="word-1">divide</p>
        <p class="words__container--small">это</p>
        <p id="word-2">делить</p>
       `;

        if (wrap) {
            wrap.appendChild(wordsContainer);
        }

        const buttonContainer: HTMLElement = document.createElement('section');
        buttonContainer.id = 'button-container';
        buttonContainer.className = 'button__container';
        buttonContainer.innerHTML = `<button id="btn-right" class="button button_colored button--right">Верно</button>
        <button id="btn-false" class="button button_colored button--right">Неверно</button> `;

        if (wrap) {
            wrap.appendChild(buttonContainer);
        }
        // test
        console.log(await getWords(this.page, this.group));
    }

    async drawWords(): Promise<void> {
        await this.getData();
        this.taken = [];
        const wordBtns: HTMLCollectionOf<Element> = document.getElementsByClassName('button button_white word_button');
        if (this.currentWord > 19) {
            this.page += 1;
            await this.getData();
            this.currentWord = 0;
        }
        for (let i = this.currentWord, j = 0; i < this.currentWord + 5; i += 1, j += 1) {
            if (wordBtns[j]) {
                (wordBtns[j] as HTMLButtonElement).style.backgroundColor = '#ffffff';
                wordBtns[j].textContent = this.data[i].wordTranslate;
                // wordBtns[j].textContent = this.data[i].id;
                wordBtns[j].id = this.data[i].id;
            }
            if (this.data[i] === undefined) {
                return;
            }
            this.taken.push(this.data[i].id);
            this.currentWord += 1;
            if (j === 4) {
                this.rightWord = this.taken[this.getRandomNumberFrom0to4()];
                console.log('its right', this.rightWord);
            }
        }
    }

    getRandomNumberFrom0to4(): number {
        return Math.floor(Math.random() * 5);
    }

    async drawWordDetails() {
        const word: IWords = await getWord(this.rightWord);
        this.correctAnswers.push(word);
        const index = this.correctAnswers.length - 1;
        const wordDetailsSection: HTMLElement | null = document.getElementById('word-details');
        if (wordDetailsSection) {
            while (wordDetailsSection.firstChild) {
                wordDetailsSection.removeChild(wordDetailsSection.firstChild);
            }
        }
        const details: HTMLElement = document.createElement('span');
        if (this.correctAnswers[index] === undefined) {
            return;
        }
        details.innerHTML = `<b>${this.correctAnswers[index].word}</b> ${this.correctAnswers[index].transcription}`;
        if (wordDetailsSection) {
            wordDetailsSection.appendChild(details);
        }
    }
}

export default SprintGame;
