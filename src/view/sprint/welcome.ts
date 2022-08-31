import SprintGame from './game';

class Welcome {
    private game: SprintGame;

    constructor() {
        this.game = new SprintGame();
    }

    langLevels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    selectedLevel = 0;

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
        btnStart.className = 'button button_white btn-start';
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
            btn.className = 'button button_white level-btn';
            btn.textContent = langLevel;
            btn.addEventListener('click', () => {
                console.log(btn.value);
                this.selectedLevel = +btn.value;
                document.querySelectorAll('.level-btn').forEach((el) => el.classList.remove('level-btn--active'));
                btn.classList.toggle('level-btn--active');
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
