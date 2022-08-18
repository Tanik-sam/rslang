import { getWords } from '../../controller/fetch';
import { IWords } from '../../app/interfaces';

class Textbook {
    page = localStorage.page || 0;

    group = localStorage.group || 0;

    data: IWords[];

    drawTextbook(): void {
        if (document.querySelector('.container') as HTMLElement) {
            (document.querySelector('.container') as HTMLElement).innerHTML = '';
        }
        const fragment = document.createDocumentFragment() as DocumentFragment;
        const textBookTemp = document.querySelector('#textbook-template') as HTMLTemplateElement;
        const textBookClone = textBookTemp.content.cloneNode(true) as HTMLElement;
        fragment.append(textBookClone);
        document.querySelector('.container').append(fragment);
        const fragment1 = document.createDocumentFragment() as DocumentFragment;
        const wordTemp = document.querySelector('#textbookWords') as HTMLTemplateElement;
        (async () => {
            this.data = await getWords(this.page, this.group);
            this.data.forEach((item) => {
                const wordClone = wordTemp.content.cloneNode(true) as HTMLElement;
                (wordClone.querySelector('.textbook-words__word-name_red') as HTMLElement).innerHTML = item.word;
                (wordClone.querySelector('.textbook-words__word-trans') as HTMLElement).innerHTML = item.textMeaning;
                (wordClone.querySelector('.textbook-words__image') as HTMLElement).innerHTML = item.image;
                fragment1.append(wordClone);
                document.querySelector('.textbook-article').append(fragment1);
            });
        })();
    }
}

export default Textbook;
