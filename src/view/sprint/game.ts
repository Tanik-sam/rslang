import { IUserAnswers, IWords } from '../../app/interfaces';
import { getWord, getWords } from '../../controller/fetch';
import { local } from '../../controller/local';

local();

class SprintGame {
    langLevels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    selectedLevel = 0;

    data: IWords[] = [];

    wordData!: IWords;

    allWords: object[] = [];

    taken: string[] = [];

    page = this.getRandom(19);

    group = 0;

    id = '';

    userAnswers: IUserAnswers[] = [];

    correctAnswers: IWords[] = [];

    rightWord = '';

    gameVariant = 0;

    score = 0;

    multi = 1;

    rightCount = 0;

    time = 3;

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

    drawDefault(): void {
        const wrap: HTMLElement | null = document.getElementById('sprint__wrapper');
        const h2: HTMLElement = document.createElement('h2');
        h2.innerText = 'Спринт';
        const h6: HTMLElement = document.createElement('h6');
        h6.innerText = 'Тренируй скорость восприятия!';
        const h5: HTMLElement = document.createElement('h5');
        h5.innerText = 'Выбери уровень сложности:';
        const btnSection: HTMLElement = document.createElement('section');
        btnSection.id = 'lang-levels-buttons';
        btnSection.className = 'lang-levels-buttons__container';
        const btnStart: HTMLButtonElement = document.createElement('button');
        btnStart.id = 'start-btn';
        btnStart.disabled = true;
        btnStart.className = 'button button_white btn-start disabled';
        btnStart.textContent = 'Начать игру';
        btnStart.addEventListener('click', async () => {
            this.drawTimer();
            this.countTime(this.time);
            this.draw(this.selectedLevel);
        });
        wrap?.appendChild(h2);
        wrap?.appendChild(h6);
        wrap?.appendChild(h5);
        wrap?.appendChild(btnSection);
        wrap?.appendChild(btnStart);
        const fragment: DocumentFragment = document.createDocumentFragment();

        this.langLevels.forEach((langLevel, index) => {
            const btn: HTMLButtonElement = document.createElement('button');
            btn.id = `level-btn-${index}`;
            btn.value = `${index}`;
            btn.className = 'button button_white level-btn';
            btn.textContent = langLevel;
            btn.addEventListener('click', () => {
                this.selectedLevel = +btn.value;
                document.querySelectorAll('.level-btn').forEach((el) => el.classList.remove('level-btn--active'));
                btn.classList.toggle('level-btn--active');
                btnStart.disabled = false;
                btnStart.classList.remove('disabled');
            });
            fragment.appendChild(btn);
        });
        btnSection.appendChild(fragment);
    }

    async drawTimer() {
        const wrap: HTMLElement | null = document.getElementById('sprint-container');

        const timeSection: HTMLElement = document.createElement('section');
        timeSection.id = 'time-section';
        const timer: HTMLElement = document.createElement('div');
        timer.innerHTML = `
        <div class="timer__image"></div> 
        <p id="countdown" class="countdown">${this.time}</p>`;
        timer.id = `timer`;
        timer.className = 'timer';
        timeSection.appendChild(timer);
        if (wrap) {
            wrap.appendChild(timeSection);
        }
    }

    async draw(value: number): Promise<void> {
        this.group = value;
        const wrap: HTMLElement | null = document.getElementById('sprint__wrapper');

        if (wrap) {
            while (wrap.firstChild) {
                wrap.removeChild(wrap.firstChild);
            }
        }

        // Score section
        // const scoreSection: HTMLElement = document.createElement('section');
        // scoreSection.id = 'score-section';
        // scoreSection.className = 'score';
        // wrap?.appendChild(scoreSection);
        // scoreSection.innerHTML = `<p class="score__box button"> Множитель: <span id="multiplier">${this.multi}</span></p>
        // <p class="score__box button"> Очки:<span id="score">${this.score}</span></p>
        // <div class="status__container">
        // </div> `;

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
        this.drawWords(this.group, this.page);
    }

    async drawWords(value: number, valuePage: number): Promise<void> {
        this.page = valuePage;
        this.group = value;
        await this.getData();
        this.gameVariant = this.getRandom(2);

        const wordLeft: HTMLElement | null = document.getElementById('word-1');
        const wordRight: HTMLElement | null = document.getElementById('word-2');
        const btnRight: HTMLElement | null = document.getElementById('btn-right');
        const btnWrong: HTMLElement | null = document.getElementById('btn-false');
        const scoreArrow: HTMLElement | null = document.querySelector('.score__arrow');
        const id: number = this.getRandom(19);
        let idWrong: number = this.getRandom(19);

        if (id === idWrong) {
            idWrong = this.getRandom(19);
        }
        if (this.gameVariant === 0) {
            (wordLeft as HTMLElement).textContent = this.data[id].word;
            (wordRight as HTMLElement).textContent = this.data[id].wordTranslate;
            btnRight?.addEventListener('click', async () => {
                //
                // this.userAnswers.push({ this.data[id].word, guessedRight: "true" });
                this.rightCount += 1;
                // this.multi += 1;
                // this.score += 1;
                // this.score *= this.multi;
                this.draw(this.group);
                if (scoreArrow) scoreArrow.style.color = '#19961f';
            });
            btnWrong?.addEventListener('click', async () => {
                // this.userAnswers.push('0');
                // this.multi = 1;
                this.draw(this.group);
            });
        } else {
            (wordLeft as HTMLElement).textContent = this.data[id].word;
            (wordRight as HTMLElement).textContent = this.data[idWrong].wordTranslate;
            btnWrong?.addEventListener('click', async () => {
                // this.userAnswers.push('1');
                this.rightCount += 1;
                // this.multi += 1;
                // this.score += 1;
                // this.score *= this.multi;
                this.draw(this.group);
                if (scoreArrow) scoreArrow.style.color = '#19961f';
            });
            btnRight?.addEventListener('click', async () => {
                // this.userAnswers.push('0');
                // this.multi = 1;
                this.draw(this.group);
            });
        }
    }

    getRandom(max: number): number {
        return Math.floor(Math.random() * max);
    }

    countTime(time: number): void {
        this.time = time;
        const countdown: HTMLElement | null = document.getElementById('countdown');
        const timeCount: NodeJS.Timeout = setTimeout(() => {
            this.countTime(this.time);
        }, 1000);

        if (countdown) countdown.textContent = time.toString();
        this.time -= 1;
        if (time === 0) {
            clearTimeout(timeCount);
            this.drawResults();
        }
    }

    drawResults(): void {
        const wrap: HTMLElement | null = document.getElementById('sprint-container');

        if (wrap) {
            while (wrap.firstChild) {
                wrap.removeChild(wrap.firstChild);
            }
        }
        const resultsWrap: HTMLElement = document.createElement('div');
        resultsWrap.id = 'results-wrap';
        wrap?.appendChild(resultsWrap);
        const playAgainBtn: HTMLButtonElement = document.createElement('button');
        playAgainBtn.id = 'play-again-btn';
        playAgainBtn.textContent = 'Ещё раз';
        playAgainBtn.classList.add('button', 'button_white', 'word_button');
        playAgainBtn.addEventListener('click', () => {
            console.log('play again');
            wrap?.removeChild(resultsWrap);
            wrap?.removeChild(playAgainBtn);
            this.drawDefault();
            this.userAnswers = [];
        });
        wrap?.appendChild(playAgainBtn);
        const resultsList: HTMLElement = document.createElement('ul');
        resultsList.id = 'results-list';
        resultsWrap.appendChild(resultsList);
        for (let i = 0; i < this.userAnswers.length; i += 1) {
            const resultsItem: HTMLElement = document.createElement('li');
            resultsItem.classList.add('word-in-list');
            // resultsItem.innerHTML = `<b>${this.userAnswers[i].word.word}</b> - ${this.userAnswers[i].word.wordTranslate}`;

            resultsList.appendChild(resultsItem);
        }
    }
}

export default SprintGame;
