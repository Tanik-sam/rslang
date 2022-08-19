import '../../style.scss';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { getWords, getWord } from '../../controller/fetch';
import { IWords } from '../../app/interfaces';

class Textbook {
    page = localStorage.page || 0;

    group = localStorage.group || 0;

    data!: IWords[];

    getData(): void {
        (async () => {
            this.data = await getWords(this.page, this.group);
            this.drawTextbook();
        })();
    }

    drawTextbook(): void {
        const fragment1 = document.createDocumentFragment() as DocumentFragment;
        const wordTemp = document.querySelector('#textbookWords') as HTMLTemplateElement;
        this.data.forEach((item) => {
            const wordClone = wordTemp.content.cloneNode(true) as HTMLElement;
            (wordClone.querySelector('.textbook-words') as HTMLElement).setAttribute('id', item.id);
            (wordClone.querySelector('.textbook-words__word-name_red') as HTMLElement).innerHTML = item.word;
            (wordClone.querySelector(
                '.textbook-words__word-trans'
            ) as HTMLElement).innerHTML = ` ${item.transcription} ${item.wordTranslate}`;
            (wordClone.querySelector('.textbook-word__setence') as HTMLElement).innerHTML = item.textMeaning;
            (wordClone.querySelector('.textbook-word__setence_tr') as HTMLElement).innerHTML =
                item.textMeaningTranslate;
            (wordClone.querySelector('.textbook-word__setence_ex') as HTMLElement).innerHTML = item.textExample;
            (wordClone.querySelector('.textbook-word__setence_tr_ex') as HTMLElement).innerHTML =
                item.textExampleTranslate;
            (wordClone.querySelector('.textbook-words__word-btn') as HTMLElement).setAttribute('id', `vol ${item.id}`);
            (wordClone.querySelector(
                '.textbook-words__image'
            ) as HTMLElement).style.backgroundImage = `url("https://rs-lang2022.herokuapp.com/${item.image}")`;
            fragment1.append(wordClone);
            (document.querySelector('.textbook-article') as HTMLElement).append(fragment1);
        });
        const audioStart = document.querySelectorAll('.textbook-words__word-btn');
        console.log(audioStart);
        for (let i = 0; i < audioStart.length; i += 1) {
            audioStart[i].addEventListener('click', (e) => {
                let id!: string;
                (async () => {
                    console.log('мы тут');
                    const word = await getWord(
                        (e.target as HTMLElement).closest('button')?.getAttribute('id')?.split(' ')[1]
                    );
                    const audio = new Audio();
                    audio.src = `https://rs-lang2022.herokuapp.com/${word.audioExample}`;
                    audio.play();
                })();
            });
        }
    }
}
window.onload = function textbookInit() {
    const textbook = new Textbook();
    textbook.getData();
};
export default Textbook;
