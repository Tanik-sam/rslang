import AudioChallengeGame from './game';

class Welcome {
    private game: AudioChallengeGame;

    constructor() {
        this.game = new AudioChallengeGame();
    }

    langLevels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    selectedLevel = 0;

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
        btnStart.textContent = 'Начать игру';
        btnStart.addEventListener('click', async () => {
            console.log('start');
            this.drawGame(this.selectedLevel);
            this.game.drawWords();
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
            btn.className = 'level-btn';
            btn.textContent = langLevel;
            btn.addEventListener('click', () => {
                console.log(btn.value);
                this.selectedLevel = +btn.value;
            });
            fragment.appendChild(btn);
        });
        btnSection.appendChild(fragment);
    }

    drawGame(value: number) {
        this.game.draw(value);
    }
}

export default Welcome;
