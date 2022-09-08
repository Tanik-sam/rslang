import { IUserAnswers, IUserGetWord, IUserStat, IUserWord, IWords } from '../../app/interfaces';
import {
    createUserWord,
    getUserStatistics,
    getUserWords,
    getWord,
    getWords,
    updateUserWord,
    upsertUserStatistics,
} from '../../controller/fetch';

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

    currentWord = 0;

    currentTranslate = 0;

    gameVariant = 0;

    score = 0;

    multi = 1;

    rightCount = 0;

    wrongCount = 0;

    time = 31;

    userWords: IUserGetWord[] = [];

    arrowColor = '#fff';

    colorGreen = '#19961f';

    colorRed = '#ff405d';

    allAttempts = 0;

    userStats!: IUserStat;

    maxSeries = 0;

    successAttempts = 0;

    currentSeries = 0;

    newLearnedWords = 33;

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

    getUserWordsData() {
        return (async () => {
            this.userWords = await getUserWords();
        })();
    }

    getUserStatisticsData() {
        return (async () => {
            this.userStats = await getUserStatistics();
        })();
    }

    drawDefault(level: number): void {
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
            this.draw(level);
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
        const timeSection: HTMLElement = document.createElement('div');
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
        const wrap: HTMLElement | null = document.getElementById('sprint-container');

        if (wrap) {
            while (wrap.firstChild) {
                wrap.removeChild(wrap.firstChild);
            }
        }

        const statusContainer: HTMLElement = document.createElement('section');
        statusContainer.id = 'status-container';
        statusContainer.className = 'words__container';
        wrap?.appendChild(statusContainer);
        statusContainer.innerHTML = `
        <div class = "score__box score__box--big">
        <p class="score__arrow" style="color:${this.arrowColor}">✓</p>
        <p class="score__box score__box--multi">${this.rightCount}</p>
        </div>
        `;
        this.drawTimer();
        this.drawWords(this.group, this.page);
    }

    async drawWords(value: number, valuePage: number): Promise<void> {
        this.page = valuePage;
        this.group = value;
        await this.getData();
        this.gameVariant = this.getRandom(2);

        const wrap: HTMLElement | null = document.getElementById('sprint-container');

        const wordsContainer: HTMLElement = document.createElement('section');
        wordsContainer.id = 'words-container';
        wordsContainer.className = 'words__container';
        wrap?.appendChild(wordsContainer);
        const wordLeft: HTMLElement = document.createElement('p');
        wordLeft.id = 'word-1';
        wordsContainer.appendChild(wordLeft);
        const thisTranslate: HTMLElement = document.createElement('p');
        thisTranslate.classList.add('words__container--small');
        thisTranslate.innerText = 'это';
        wordsContainer.appendChild(thisTranslate);
        const wordRight: HTMLElement = document.createElement('p');
        wordRight.id = 'word-2';
        wordsContainer.appendChild(wordRight);

        if (wrap) {
            wrap.appendChild(wordsContainer);
        }

        const buttonContainer: HTMLElement = document.createElement('section');
        buttonContainer.id = 'button-container';
        wordsContainer.className = 'words__container';
        buttonContainer.className = 'button__container';
        wrap?.appendChild(buttonContainer);
        const btnRight: HTMLElement = document.createElement('button');
        btnRight.id = 'btn-right';
        btnRight.classList.add('button', 'button_colored', 'button--right');
        btnRight.textContent = 'Верно';
        buttonContainer.appendChild(btnRight);
        const btnWrong: HTMLElement = document.createElement('button');
        btnWrong.id = 'btn-false';
        btnWrong.classList.add('button', 'button_colored', 'button--right');
        btnWrong.textContent = 'Неверно';
        buttonContainer.appendChild(btnWrong);

        if (wrap) {
            wrap.appendChild(buttonContainer);
        }

        this.currentWord = this.getRandom(19);
        this.currentTranslate = this.getRandom(19);

        if (this.currentWord === this.currentTranslate) {
            this.currentTranslate = this.getRandom(19);
        }
        if (this.gameVariant === 0) {
            wordLeft.textContent = this.data[this.currentWord].word;
            wordRight.textContent = this.data[this.currentWord].wordTranslate;
            const word = this.data[this.currentWord];
            btnRight?.addEventListener('click', async () => {
                if (word) {
                    this.userAnswers.push({ word, guessedRight: true });
                    this.newLearnedWords += 1;
                }
                this.rightCount += 1;
                this.successAttempts += 1;
                this.arrowColor = this.colorGreen;
                this.draw(this.group);
            });
            btnWrong?.addEventListener('click', async () => {
                this.wrongCount += 1;
                this.currentSeries = 0;
                if (word) {
                    this.userAnswers.push({ word, guessedRight: false });
                }
                this.arrowColor = this.colorRed;
                this.draw(this.group);
            });
        } else {
            wordLeft.textContent = this.data[this.currentWord].word;
            wordRight.textContent = this.data[this.currentTranslate].wordTranslate;
            const word = this.data[this.currentWord];
            btnWrong?.addEventListener('click', async () => {
                this.rightCount += 1;
                if (word) {
                    this.userAnswers.push({ word, guessedRight: true });
                    this.newLearnedWords += 1;
                    this.successAttempts += 1;
                }
                this.arrowColor = this.colorGreen;
                this.draw(this.group);
            });
            btnRight?.addEventListener('click', async () => {
                this.wrongCount += 1;
                this.currentSeries = 0;
                if (word) {
                    this.userAnswers.push({ word, guessedRight: false });
                }
                this.arrowColor = this.colorRed;
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
        const btnWrap: HTMLElement = document.createElement('div');
        btnWrap.id = 'btns-wrap';
        btnWrap.classList.add('btn-wrap');
        wrap?.appendChild(resultsWrap);
        wrap?.appendChild(btnWrap);
        const endBtn: HTMLButtonElement = document.createElement('button');
        endBtn.id = 'exit-btn';
        endBtn.textContent = 'Закончить';
        endBtn.classList.add('button', 'button_white');
        endBtn.addEventListener('click', () => {
            this.allAttempts = this.userAnswers.length;
            if (localStorage.currentUserName) {
                this.checkAndAddUserWord(this.userAnswers);
                this.checkAndUpdateStatistics();
            }
            document.location.reload();
        });

        const moreBtn: HTMLButtonElement = document.createElement('button');
        moreBtn.id = 'play-again-btn';
        moreBtn.textContent = 'Ещё раз';
        moreBtn.classList.add('button', 'button_white');
        moreBtn.addEventListener('click', () => {
            this.allAttempts = this.userAnswers.length;
            if (localStorage.currentUserName) {
                this.checkAndAddUserWord(this.userAnswers);
                this.checkAndUpdateStatistics();
            }
            wrap?.removeChild(resultsWrap);
            wrap?.removeChild(btnWrap);
            this.rightCount += 0;
            this.time = 31;
            this.countTime(this.time);
            this.draw(this.group);
        });
        btnWrap?.appendChild(moreBtn);
        btnWrap?.appendChild(endBtn);

        const resultsList: HTMLElement = document.createElement('ul');
        resultsList.id = 'results-list';
        resultsWrap.appendChild(resultsList);

        const countWrapper: HTMLElement = document.createElement('div');
        const rightCount: HTMLElement = document.createElement('div');
        const wrongCount: HTMLElement = document.createElement('div');
        countWrapper.classList.add('count__wrapper');
        rightCount.classList.add('count__right');
        wrongCount.classList.add('count__wrong');
        rightCount.innerHTML = `<span style = "font-weight:300">Знаю:</span> ${this.rightCount.toString()}`;
        wrongCount.innerHTML = `<span style = "font-weight:300">Ошибок</span>: ${this.wrongCount.toString()}`;
        resultsList.appendChild(countWrapper);
        countWrapper.appendChild(rightCount);
        countWrapper.appendChild(wrongCount);

        for (let i = 0; i < this.userAnswers.length; i += 1) {
            let guessed: number;
            const resultsItem: HTMLElement = document.createElement('li');
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            this.userAnswers[i].guessedRight === true ? (guessed = 1) : (guessed = 0);
            resultsItem.classList.add('word-in-list');

            if (guessed === 1) {
                resultsItem.innerHTML = `<b style = "color:${this.colorGreen}">${this.userAnswers[i].word.word}</b> <span style = "font-weight:300"> - ${this.userAnswers[i].word.wordTranslate}</span>`;
            } else {
                resultsItem.innerHTML = `<b style = "color:${this.colorRed}">${this.userAnswers[i].word.word}</b> <span style = "font-weight:300"> - ${this.userAnswers[i].word.wordTranslate}</span>`;
            }

            resultsList.appendChild(resultsItem);
        }
    }

    async addUserWord(wordId: string, status: boolean) {
        const userWord: IUserWord = {
            difficulty: 'easy',
            optional: {
                attempts: 1,
                successAtempts: status ? 1 : 0,
                learned: status,
            },
        };
        await createUserWord(wordId, userWord);
    }

    async updateUserWord(wordId: string, status: boolean, attempts: number, successAtempts: number) {
        const userWord: IUserWord = {
            difficulty: 'easy',
            optional: {
                attempts,
                successAtempts,
                learned: status,
            },
        };
        await updateUserWord(wordId, userWord);
    }

    async checkAndAddUserWord(userAnswers: IUserAnswers[]) {
        await this.getUserWordsData();
        userAnswers.forEach((item) => {
            const word = this.userWords.find((userWordsItem) => userWordsItem.wordId === item.word.id);
            if (word) {
                /* eslint-disable-next-line */
              item.guessedRight === true
                    ? this.updateUserWord(
                          item.word.id,
                          true,
                          word.optional.attempts + 1,
                          word.optional.successAtempts + 1
                      )
                    : this.updateUserWord(
                          item.word.id,
                          false,
                          word.optional.attempts + 1,
                          word.optional.successAtempts
                      );
            } else {
                /* eslint-disable-next-line */
              item.guessedRight === true
                    ? this.addUserWord(item.word.id, true)
                    : this.addUserWord(item.word.id, false);
            }
        });
    }

    async checkAndUpdateStatistics() {
        await this.getUserStatisticsData();
        let maxSeries = 0;
        const rightCount = this.userStats.optional.sprintSuc + this.rightCount;
        const allAttempts = this.userStats.optional.sprintAll + this.allAttempts;
        const newLearnedWords = 33;
        if (this.userStats.optional.sprintSeria) {
            if (this.maxSeries > this.userStats.optional.sprintSeria) {
                maxSeries = this.maxSeries;
            } else {
                maxSeries = this.userStats.optional.sprintSeria;
            }
        }
        const { audioSuc } = this.userStats.optional;
        const { audioAll } = this.userStats.optional;
        const { audioSeria } = this.userStats.optional;
        this.addUserStatistic(newLearnedWords, maxSeries, rightCount, allAttempts, audioSeria, audioSuc, audioAll);
    }

    async addUserStatistic(
        newLearnedWords: number,
        maxSeries: number,
        rightCount: number,
        allAttempts: number,
        audioSeria: number,
        audioSuc: number,
        audioAll: number
    ) {
        const stats: IUserStat = {
            learnedWords: newLearnedWords,
            optional: {
                date: new Date(),
                sprintSeria: maxSeries,
                sprintSuc: rightCount,
                sprintAll: allAttempts,
                audioSeria,
                audioSuc,
                audioAll,
            },
        };
        await upsertUserStatistics(stats);
        await this.getUserStatisticsData();
    }
}

export default SprintGame;
