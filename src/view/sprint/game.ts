import { IWords } from '../../app/interfaces';
import { getWord, getWords } from '../../controller/fetch';

class SprintGame {
    data: IWords[] = [];

    wordData!: IWords;

    allWords: object[] = [];

    taken: string[] = [];

    page = 0;

    group = 0;

    id = '';

    userAnswers: string[] = [];

    correctAnswers: string[] = [];

    gameVariant = 0;

    score = 0;

    multi = 1;

    rightCount = 0;

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
        this.group = value;
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
        scoreSection.innerHTML = `<p class="score__box button"> Множитель: <span id="multiplier">${this.multi}</span></p>
        <p class="score__box button"> Очки:<span id="score">${this.score}</span></p>
        <div class="status__container">
        </div> `;

        const statusContainer: HTMLElement = document.createElement('section');
        statusContainer.id = 'status-container';
        statusContainer.className = 'words__container';
        wrap?.appendChild(statusContainer);
        statusContainer.innerHTML = `
        <div class = "score__box score__box--big">
        <p class="score__arrow">✓</p>
        <p class="score__box score__box--multi">${this.rightCount}</p>
        </div>
        `;

        const wordsContainer: HTMLElement = document.createElement('section');
        wordsContainer.id = 'words-container';
        wordsContainer.className = 'words__container';
        wrap?.appendChild(wordsContainer);

        wordsContainer.innerHTML = `
        <p id="word-1"></p>
        <p class="words__container--small">это</p>
        <p id="word-2"></p>
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
        this.drawWords(this.group);
    }

    async drawWords(value: number): Promise<void> {
        this.page = 0;
        this.group = value;
        await this.getData();
        this.gameVariant = this.getRandom(2);

        const wordLeft: HTMLElement | null = document.getElementById('word-1');
        const wordRight: HTMLElement | null = document.getElementById('word-2');
        const btnRight: HTMLElement | null = document.getElementById('btn-right');
        const btnWrong: HTMLElement | null = document.getElementById('btn-false');
        const id: number = this.getRandom(19);
        let idWrong: number = this.getRandom(19);

        if (id === idWrong) {
            idWrong = this.getRandom(19);
        }
        if (this.gameVariant === 0) {
            (wordLeft as HTMLElement).textContent = this.data[id].word;
            (wordRight as HTMLElement).textContent = this.data[id].wordTranslate;
            btnRight?.addEventListener('click', async () => {
                this.correctAnswers.push(this.data[id].word);
                this.userAnswers.push('1');
                this.rightCount += 1;
                this.multi += 1;
                this.score += 1;
                this.score *= this.multi;
                this.draw(this.group);
            });
            btnWrong?.addEventListener('click', async () => {
                this.userAnswers.push('0');
                this.multi = 1;
                this.draw(this.group);
            });
        } else {
            (wordLeft as HTMLElement).textContent = this.data[id].word;
            (wordRight as HTMLElement).textContent = this.data[idWrong].wordTranslate;
            btnWrong?.addEventListener('click', async () => {
                this.userAnswers.push('1');
                this.rightCount += 1;
                this.multi += 1;
                this.score += 1;
                this.score *= this.multi;
                this.draw(this.group);
            });
            btnRight?.addEventListener('click', async () => {
                this.userAnswers.push('0');
                this.multi = 1;
                this.draw(this.group);
            });
        }
    }

    getRandom(max: number): number {
        return Math.floor(Math.random() * max);
    }
}

export default SprintGame;
