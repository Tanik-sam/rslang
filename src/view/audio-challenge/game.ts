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

const serverName = 'https://rs-lang2022.herokuapp.com/';
// const serverName = 'http://localhost:3000/';

class AudioChallengeGame {
    langLevels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    selectedLevel = 1;

    value = 0;

    data: IWords[] = [];

    wordData!: IWords;

    allWords: object[] = [];

    taken: string[] = [];

    hearts = 5;

    page = 0;

    group = 0;

    id = '';

    currentWord = 0;

    userAnswers: IUserAnswers[] = [];

    correctAnswers: IWords[] = [];

    rightWord = '';

    wrongAnswersCounter = 0;

    rightAnswersCounter = 0;

    userWords: IUserGetWord[] = [];

    newLearnedWords = 0;

    currentSeries = 0;

    maxSeries = 0;

    successAttempts = 0;

    allAttempts = 0;

    userStats!: IUserStat;

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

    getUserWordsData(): Promise<void> {
        return (async () => {
            this.userWords = await getUserWords();
        })();
    }

    getUserStatisticsData(): Promise<void> {
        return (async () => {
            this.userStats = await getUserStatistics();
            console.log(this.userStats);
        })();
    }

    drawDefault(): void {
        const wrap: HTMLElement | null = document.getElementById('audio-challenge__wrapper');
        const h2: HTMLElement = document.createElement('h2');
        h2.innerText = 'Аудио-вызов';
        const h6: HTMLElement = document.createElement('h6');
        h6.innerText = 'Улучши своё восприятие речи на слух!';
        const h5: HTMLElement = document.createElement('h5');
        h5.innerText = 'Выбери уровень сложности:';
        const btnSection: HTMLElement = document.createElement('section');
        btnSection.id = 'lang-levels-buttons';
        btnSection.className = 'lang-levels-buttons__container';
        const btnStart: HTMLButtonElement = document.createElement('button');
        btnStart.id = 'start-btn';
        btnStart.className = 'button button_white btn-start';
        btnStart.textContent = 'Начать игру';
        btnStart.addEventListener('click', async () => {
            this.draw(this.selectedLevel);
            this.drawWords();
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
                const btns = document.getElementsByClassName('level-btn');
                for (let i = 0; i < btns.length; i += 1) {
                    btns[i].classList.remove('level-btn--active');
                }
                btn.classList.toggle('level-btn--active');
                this.selectedLevel = +btn.value + 1;
            });
            fragment.appendChild(btn);
        });
        btnSection.appendChild(fragment);
    }

    async draw(value: number): Promise<void> {
        this.group = value - 1;
        if (localStorage.flag === 'game') {
            this.page = Number(localStorage.getItem('page'));
        }
        const wrap: HTMLElement | null = document.getElementById('audio-challenge__wrapper');
        if (wrap) {
            while (wrap.firstChild) {
                wrap.removeChild(wrap.firstChild);
            }
        }
        const heartSection: HTMLElement = document.createElement('section');
        heartSection.id = 'hearts';
        const wordsSection: HTMLElement = document.createElement('section');
        wordsSection.id = 'words-section';

        for (let i = 0; i < this.hearts; i += 1) {
            const heart: HTMLElement = document.createElement('span');
            heart.innerHTML = `<svg width="47" height="40" viewBox="0 0 47 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <rect width="47" height="40" fill="url(#pattern0)"/>
            <defs><pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_9475_676" transform="scale(0.0212766 0.025)"/></pattern>
            <image id="image0_9475_676" width="47" height="40" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAoCAYAAABuIqMUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFF2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wOC0xOVQxMzo1NzoxOSswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDgtMTlUMTQ6MDM6MTErMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDgtMTlUMTQ6MDM6MTErMDM6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTRmYjdmYTQtYTIxMy0yMTQxLWJiMTItODdhZGJlNzdlNWRhIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU0ZmI3ZmE0LWEyMTMtMjE0MS1iYjEyLTg3YWRiZTc3ZTVkYSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjU0ZmI3ZmE0LWEyMTMtMjE0MS1iYjEyLTg3YWRiZTc3ZTVkYSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NTRmYjdmYTQtYTIxMy0yMTQxLWJiMTItODdhZGJlNzdlNWRhIiBzdEV2dDp3aGVuPSIyMDIyLTA4LTE5VDEzOjU3OjE5KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuNCAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+TJJKNgAAAQZJREFUWIXtWVsShCAMK8webC+y9z8GfrmDDo+WpkIZ8+eIaRILMhjS90cNpNbNDIE5Dsr9URLfx3NMwLgjgFzyLJT7Ll5D3uOAc8faDWQRK+5S26CLIIVfuGN+4Q2WyRMZh2It3hIpktOWIfKd/Ct+Gl7xs+Be/MhefAUE98m7xSneW+sEok2SJ/KT/l/nNskTrZ/+RV8p+VUNsI4+igMno6hnq57PsUr6VR295GcbaNbntM0sA9263J5/2gCrnmTCPmWAXUe62lgbEPGPLJVBWkTAK4JmnUcZGA5D+5HSGlA9j/jCjgpQv7naPykpTiGcc0/YfEHvbXrCoBPdYmNWm4DwFeoA3nscA2tKgbsAAAAASUVORK5CYII="/>
            </defs></svg>`;
            heart.id = `heart-${i}`;
            heart.className = 'hearts';
            heartSection.appendChild(heart);
        }
        if (wrap) {
            wrap.appendChild(heartSection);
        }
        const audioSection: HTMLElement = document.createElement('section');
        audioSection.id = 'play';
        const audio: HTMLAudioElement = document.createElement('audio');
        const audioSrc: HTMLSourceElement = document.createElement('source');
        audioSrc.id = 'audio-src';
        audioSrc.src = '';
        wrap?.appendChild(audioSection);
        audioSection?.appendChild(audio);
        audio?.appendChild(audioSrc);
        const wordDetailsSection: HTMLElement = document.createElement('section');
        wordDetailsSection.id = 'word-details';
        wrap?.appendChild(wordDetailsSection);
        if (wrap) {
            wrap.appendChild(wordsSection);
        }
        const fragment: DocumentFragment = document.createDocumentFragment();
        const answerBtn: HTMLButtonElement = document.createElement('button');
        answerBtn.id = 'answer-btn';
        answerBtn.textContent = 'Не знаю :(';
        for (let i = 0; i < 5; i += 1) {
            const btn: HTMLButtonElement = document.createElement('button');
            btn.classList.add('button', 'button_white', 'word_button');
            btn.addEventListener('click', () => {
                const word: IWords | undefined = this.data.find((item) => item.id === this.rightWord);
                if (this.rightWord === btn.id) {
                    btn.style.backgroundColor = 'rgba(0, 184, 148, 1)';
                    if (word) {
                        this.userAnswers.push({ word, guessedRight: false });
                        this.successAttempts += 1;
                        this.currentSeries += 1;
                    }
                } else {
                    if (word) {
                        this.userAnswers.push({ word, guessedRight: true });
                        if (this.currentSeries > this.maxSeries) {
                            this.maxSeries = this.currentSeries;
                        }
                        this.currentSeries = 0;
                    }
                    if (this.hearts === 0) {
                        this.showResults();
                    } else {
                        this.hearts -= 1;
                        const heart: HTMLElement | null = document.getElementById(`heart-${this.hearts}`);
                        if (heart) {
                            heart.classList.add('hide');
                        }
                    }
                    btn.style.backgroundColor = '#ff405d';
                    const rigthBtn: HTMLElement | null = document.getElementById(this.rightWord);
                    if (rigthBtn) {
                        rigthBtn.style.backgroundColor = 'rgba(0, 184, 148, 1)';
                    }
                }
                this.drawWordDetails();
                answerBtn.textContent = 'Дальше';
                answerBtn.style.backgroundColor = '#ffffff';
                answerBtn.style.color = '#000000';
                const btns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.word_button');
                /* eslint-disable-next-line */
                for (const elem of btns) {
                    elem.disabled = true;
                }
            });
            fragment.appendChild(btn);
        }
        wordsSection.appendChild(fragment);
        answerBtn.addEventListener('click', () => {
            if (answerBtn.textContent === 'Не знаю :(') {
                if (this.currentSeries > this.maxSeries) {
                    this.maxSeries = this.currentSeries;
                }
                this.currentSeries = 0;
                if (this.hearts === 0) {
                    this.showResults();
                } else {
                    this.hearts -= 1;
                    const heart: HTMLElement | null = document.getElementById(`heart-${this.hearts}`);
                    if (heart) {
                        heart.classList.add('hide');
                    }
                }
                this.userAnswers.push({
                    word: this.correctAnswers[this.correctAnswers.length - 1],
                    guessedRight: true,
                });
                this.drawWordDetails();
                answerBtn.textContent = 'Дальше';
                answerBtn.style.backgroundColor = '#ffffff';
                answerBtn.style.color = '#000000';
                const rigthBtn: HTMLElement | null = document.getElementById(this.rightWord);
                if (rigthBtn) {
                    rigthBtn.style.backgroundColor = 'rgba(0, 184, 148, 1)';
                }
                const btns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.word_button');
                /* eslint-disable-next-line */
                for (const elem of btns) {
                    elem.disabled = true;
                }
            } else if (this.hearts === 0) {
                this.showResults();
            } else {
                answerBtn.textContent = 'Не знаю :(';
                answerBtn.style.backgroundColor = '#ff405d';
                this.drawWords();
                this.hideWordDetails();
                const btns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.word_button');
                /* eslint-disable-next-line */
                for (const elem of btns) {
                    elem.disabled = false;
                }
            }
        });
        answerBtn.classList.add('button', 'button_colored');
        wrap?.appendChild(answerBtn);
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
        const maxWords: number = this.currentWord + 5;
        for (let i = this.currentWord, j = 0; i < maxWords; i += 1, j += 1) {
            // console.log('this.currentWord', this.currentWord);
            // console.log('this.page', this.page);
            if (wordBtns[j]) {
                (wordBtns[j] as HTMLButtonElement).style.backgroundColor = '#ffffff';
                wordBtns[j].textContent = this.data[i].wordTranslate;
                wordBtns[j].id = this.data[i].id;
            }
            if (this.data[i] === undefined) {
                return;
            }
            this.taken.push(this.data[i].id);
            this.currentWord += 1;
            if (i === 4 || i === 9 || i === 14 || i === 19) {
                // console.log('this.currentWord2', this.currentWord);
                // console.log('this.page2', this.page);
                // console.log('i2', i);
                this.rightWord = this.taken[this.getRandomNumberFrom0to4()];
                const word: IWords | undefined = this.data.find((item) => item.id === this.rightWord);
                if (word) {
                    this.correctAnswers.push(word);
                }
                if (i === 19 && localStorage.flag === 'game') {
                    this.page -= 1;
                    this.currentWord = 0;
                    if (this.page < 0) {
                        this.hearts = 0;
                    }
                }
                this.playAudio();
            }
        }
    }

    getRandomNumberFrom0to4(): number {
        return Math.floor(Math.random() * 5);
    }

    playAudio(): void {
        const audio: HTMLAudioElement = new Audio();
        const index: number = this.correctAnswers.length - 1;
        audio.src = `${serverName}${this.correctAnswers[index].audio}`;
        audio.play();
    }

    async drawWordDetails(): Promise<void> {
        const index: number = this.correctAnswers.length - 1;
        const wordDetailsSection: HTMLElement | null = document.getElementById('word-details');
        wordDetailsSection?.classList.remove('hide');
        if (wordDetailsSection) {
            while (wordDetailsSection.firstChild) {
                wordDetailsSection.removeChild(wordDetailsSection.firstChild);
            }
        }
        const image: HTMLImageElement = document.createElement('img');
        image.id = 'word-image';
        image.src = `${serverName}${this.correctAnswers[index].image}`;
        image.addEventListener('click', () => {
            this.playAudio();
        });
        const details: HTMLElement = document.createElement('span');
        if (this.correctAnswers[index] === undefined) {
            return;
        }
        details.innerHTML = `<b>${this.correctAnswers[index].word}</b> ${this.correctAnswers[index].transcription}`;
        if (wordDetailsSection) {
            wordDetailsSection.appendChild(image);
            wordDetailsSection.appendChild(details);
        }
    }

    hideWordDetails(): void {
        const wordDetailsSection: HTMLElement | null = document.getElementById('word-details');
        wordDetailsSection?.classList.add('hide');
    }

    async showResults(): Promise<void> {
        const wrap: HTMLElement | null = document.getElementById('audio-challenge__wrapper');
        if (wrap) {
            while (wrap.firstChild) {
                wrap.removeChild(wrap.firstChild);
            }
        }
        const resultsWrap: HTMLElement = document.createElement('div');
        resultsWrap.id = 'results-wrap';
        wrap?.appendChild(resultsWrap);
        const btnsWrap: HTMLElement = document.createElement('div');
        btnsWrap.id = 'btns-wrap';
        wrap?.appendChild(btnsWrap);
        const playAgainBtn: HTMLButtonElement = document.createElement('button');
        playAgainBtn.id = 'play-again-btn';
        playAgainBtn.textContent = 'Ещё раз';
        playAgainBtn.classList.add('button', 'button_white');
        const exitBtn: HTMLButtonElement = document.createElement('button');
        exitBtn.id = 'exit-btn';
        exitBtn.textContent = 'Закончить';
        exitBtn.classList.add('button', 'button_white');
        playAgainBtn.addEventListener('click', () => {
            // console.log('play again');
            wrap?.removeChild(resultsWrap);
            wrap?.removeChild(btnsWrap);
            // console.log(this.userAnswers);
            this.allAttempts = this.userAnswers.length;
            if (localStorage.currentUserName) {
                this.checkAndAddUserWord(this.userAnswers);
                this.checkAndUpdateStatistics();
            }
            this.hearts = 5;
            this.userAnswers = [];
            this.rightAnswersCounter = 0;
            this.wrongAnswersCounter = 0;
            this.draw(Number(localStorage.getItem('group')) + 1);
            this.drawWords();
        });
        exitBtn.addEventListener('click', () => {
            // console.log('exit');
            wrap?.removeChild(resultsWrap);
            wrap?.removeChild(btnsWrap);
            this.drawDefault();
            // console.log(this.userAnswers);
            if (localStorage.currentUserName) {
                this.checkAndAddUserWord(this.userAnswers);
                this.checkAndUpdateStatistics();
            }
            this.hearts = 5;
            this.userAnswers = [];
            this.rightAnswersCounter = 0;
            this.wrongAnswersCounter = 0;
            localStorage.removeItem('flag');
            this.page = 0;
            this.group = 0;
        });
        btnsWrap.appendChild(playAgainBtn);
        btnsWrap.appendChild(exitBtn);
        this.userAnswers.forEach((item) => {
            if (item.guessedRight === false) {
                this.rightAnswersCounter += 1;
            } else {
                this.wrongAnswersCounter += 1;
            }
        });
        const resultsList: HTMLElement = document.createElement('ul');
        resultsList.id = 'results-list';
        resultsList.innerHTML = `<div class="counters-wrap"><span>Ошибки: <span class="counter-wrong">${this.wrongAnswersCounter}</span></span><span>Слов изучено: <span class="counter-right">${this.rightAnswersCounter}</span></span></div><hr>`;
        resultsWrap.appendChild(resultsList);
        for (let i = 0; i < this.userAnswers.length; i += 1) {
            const resultsItem: HTMLElement = document.createElement('li');
            resultsItem.classList.add('word-in-list');
            if (this.userAnswers[i].guessedRight === false) {
                resultsItem.innerHTML = `<b style = "color:#19961f">${this.userAnswers[i].word.word}</b> ${this.userAnswers[i].word.transcription} <span style = "font-weight:300"> - ${this.userAnswers[i].word.wordTranslate}</span>`;
            } else {
                resultsItem.innerHTML = `<b style = "color:#ff405d">${this.userAnswers[i].word.word}</b> ${this.userAnswers[i].word.transcription} <span style = "font-weight:300"> - ${this.userAnswers[i].word.wordTranslate}</span>`;
            }
            resultsList.appendChild(resultsItem);
        }
    }

    async addUserWord(wordId: string, status: boolean): Promise<void> {
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

    async updateUserWord(wordId: string, status: boolean, attempts: number, successAtempts: number): Promise<void> {
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

    async checkAndAddUserWord(userAnswers: IUserAnswers[]): Promise<void> {
        await this.getUserWordsData();
        userAnswers.forEach((item) => {
            const word: IUserGetWord | undefined = this.userWords.find(
                (userWordsItem) => userWordsItem.wordId === item.word.id
            );
            if (word) {
                /* eslint-disable-next-line */
                item.guessedRight === false
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
            } else if (item.guessedRight === false) {
                this.addUserWord(item.word.id, true);
                this.newLearnedWords += 1;
            } else {
                this.addUserWord(item.word.id, false);
            }
        });
    }

    async checkAndUpdateStatistics(): Promise<void> {
        let maxSeries = 0;
        await this.getUserStatisticsData();
        if (this.maxSeries > this.userStats.optional.audioSeria) {
            maxSeries = this.maxSeries;
        } else {
            maxSeries = this.userStats.optional.audioSeria;
        }
        const newLearnedWords = this.userStats.learnedWords + this.newLearnedWords;
        const successAttempts = this.userStats.optional.audioSuc + this.successAttempts;
        const allAttempts = this.userStats.optional.audioAll + this.allAttempts;
        const { sprintSuc } = this.userStats.optional;
        const { sprintAll } = this.userStats.optional;
        const { sprintSeria } = this.userStats.optional;
        await this.getUserWordsData();
        this.addUserStatistic(
            newLearnedWords,
            sprintSeria,
            sprintSuc,
            sprintAll,
            maxSeries,
            successAttempts,
            allAttempts
        );
    }

    async addUserStatistic(
        newLearnedWords: number,
        sprintSeria: number,
        sprintSuc: number,
        sprintAll: number,
        maxSeries: number,
        successAttempts: number,
        allAttempts: number
    ) {
        const stats: IUserStat = {
            learnedWords: newLearnedWords,
            optional: {
                date: new Date(),
                sprintSeria,
                sprintSuc,
                sprintAll,
                audioSeria: maxSeries,
                audioSuc: successAttempts,
                audioAll: allAttempts,
            },
        };
        await upsertUserStatistics(stats);
    }
}

export default AudioChallengeGame;
