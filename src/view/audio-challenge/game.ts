import { IWords } from '../../app/interfaces';
import { getWord, getWords } from '../../controller/fetch';
/*
const wordList = 'http://localhost:3000/words';

export async function getWords(page = 0, group = 0): Promise<IWords[]> {
    const response = await fetch(`${wordList}?page=${page}&group=${group}`);
    if (response.status === 200) {
        const words = await response.json();
        return words;
    }
    throw new Error(`${response.status}`);
}

export async function getWord(id: string): Promise<IWords> {
    const response = await fetch(`${wordList}/${id}`);
    if (response.status === 200) {
        const word = await response.json();
        return word;
    }
    throw new Error(`${response.status}`);
}
*/
class AudioChallengeGame {
    data: IWords[] = [];

    wordData!: IWords;

    allWords: object[] = [];

    taken: string[] = [];

    hearts = 5;

    page = 0;

    group = 0;

    id = '';

    currentWord = 0;

    userAnswers: string[] = [];

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
        const play: HTMLElement = document.createElement('span');
        play.innerText = 'play';
        wrap?.appendChild(play);
        const wordDetailsSection: HTMLElement = document.createElement('section');
        wordDetailsSection.id = 'word-details';
        wrap?.appendChild(wordDetailsSection);
        if (wrap) {
            wrap.appendChild(wordsSection);
        }
        const fragment: DocumentFragment = document.createDocumentFragment();
        for (let i = 0; i < 5; i += 1) {
            const btn: HTMLButtonElement = document.createElement('button');
            btn.id = `word-btn-${i}`;
            btn.classList.add('button', 'button_white', 'word_button');
            btn.addEventListener('click', () => {
                this.userAnswers.push(btn.id);
                if (this.rightWord === btn.id) {
                    btn.style.backgroundColor = 'rgba(0, 184, 148, 1)';
                } else {
                    btn.style.backgroundColor = '#ff405d';
                }
                this.drawWordDetails();
                this.drawWords();
            });
            fragment.appendChild(btn);
        }
        wordsSection.appendChild(fragment);
        const answerBtn: HTMLButtonElement = document.createElement('button');
        answerBtn.id = 'answer-btn';
        answerBtn.textContent = 'Не знаю :(';
        answerBtn.addEventListener('click', () => {
            this.drawWordDetails();
            this.drawWords();
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

export default AudioChallengeGame;
