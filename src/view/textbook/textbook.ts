import '../../style.scss';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { getWords, getWord } from '../../controller/fetch';
import { IWords } from '../../app/interfaces';

class Textbook {
    page = Number(localStorage.page) || 0;

    group = Number(localStorage.group) || 0;

    data!: IWords[];

    color = 'rgba(255, 234, 167, 0.7)';

    getData(): void {
        (async () => {
            this.data = await getWords(this.page, this.group);
            this.drawTextbook();
        })();
    }

    drawTextbook(): void {
        try {
            (document.querySelector(`#p_${this.page}`) as HTMLElement).classList.add('chosen-page');
        } catch (e) {
            console.log('Wait for a page load to complete!');
        }
        if (this.page === 0) {
            (document.querySelector('.pagination_back') as HTMLElement).classList.add('inactive');
            (document.querySelector('.pagination_front') as HTMLElement).classList.remove('inactive');
        } else if (this.page === 29) {
            (document.querySelector('.pagination_front') as HTMLElement).classList.add('inactive');
            (document.querySelector('.pagination_back') as HTMLElement).classList.remove('inactive');
        } else {
            (document.querySelector('.pagination_back') as HTMLElement).classList.remove('inactive');
            (document.querySelector('.pagination_front') as HTMLElement).classList.remove('inactive');
        }
        const container = document.querySelector('#words-container') as HTMLElement;
        container.innerHTML = '';
        const fragment1 = document.createDocumentFragment() as DocumentFragment;
        const wordTemp = document.querySelector('#textbookWords') as HTMLTemplateElement;
        this.data.forEach((item) => {
            const wordClone = wordTemp.content.cloneNode(true) as HTMLElement;
            (wordClone.querySelector('.textbook-words') as HTMLElement).setAttribute('id', item.id);
            (wordClone.querySelector('.textbook-words__word') as HTMLElement).style.backgroundColor = this.color;
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
            container.append(fragment1);
        });
        const audioStart = document.querySelectorAll('.textbook-words__word-btn');
        for (let i = 0; i < audioStart.length; i += 1) {
            audioStart[i].addEventListener('click', (e) => {
                let id!: string;
                (async () => {
                    const word = await getWord(
                        (e.target as HTMLElement).closest('button')?.getAttribute('id')?.split(' ')[1]
                    );
                    const audio = new Audio();
                    const tracks = [
                        `https://rs-lang2022.herokuapp.com/${word.audio}`,
                        `https://rs-lang2022.herokuapp.com/${word.audioMeaning}`,
                        `https://rs-lang2022.herokuapp.com/${word.audioExample}`,
                    ];
                    let current = 0;
                    [audio.src] = tracks;
                    audio.play();
                    audio.onended = function palyer() {
                        current += 1;
                        audio.src = tracks[current];
                        audio.play();
                    };
                })();
            });
        }
    }

    eventListen() {
        try {
            (document.querySelector('.levels') as HTMLElement).addEventListener('click', (e) => {
                switch ((e.target as HTMLElement).className) {
                    case 'level level_elementary':
                        this.group = 0;
                        this.color = 'rgba(255, 234, 167, 0.7)';
                        break;
                    case 'level level_preIntermediate':
                        this.group = 1;
                        this.color = 'rgba(250, 177, 160, 0.7)';
                        break;
                    case 'level level_intermediate':
                        this.group = 2;
                        this.color = 'rgba(255, 118, 117, 0.7)';
                        break;
                    case 'level level_upperIntermediate':
                        this.group = 3;
                        this.color = 'rgba(253, 121, 168, 0.7)';
                        break;
                    case 'level level_advanced':
                        this.group = 4;
                        this.color = 'rgba(9, 132, 227, 0.7)';
                        break;
                    case 'level level_proficiency':
                        this.group = 5;
                        this.color = 'rgba(0, 184, 148, 0.7)';
                        break;
                    default:
                        this.group = 0;
                        this.color = 'rgba(255, 234, 167, 0.7)';
                }
                this.getData();
            });
        } catch (e) {
            console.log('Wait for a page load to complete!');
        }
        try {
            (document.querySelector('.pagination') as HTMLElement).addEventListener('click', (e) => {
                (document.querySelector(`#p_${this.page}`) as HTMLElement).classList.remove('chosen-page');
                switch ((e.target as HTMLElement).innerHTML) {
                    case '&lt;':
                        this.paginateBack();
                        break;
                    case '&gt;':
                        this.paginateFront();
                        break;
                    default:
                        this.page = Number((e.target as HTMLElement).innerHTML) - 1;
                }
                const pageList = Array.from(document.getElementsByClassName('pagination_page'));
                if (!pageList.some((item) => Number(item.id.split('_')[1]) === this.page)) {
                    if (this.page < 4) {
                        this.startPag();
                    }
                    if (this.page > 3 && this.page < 25) {
                        this.midPag();
                    }
                    if (this.page > 24 && this.page < 29) {
                        this.endPag();
                    }
                }
                this.getData();
            });
        } catch (e) {
            console.log('Wait for a page load to complete!');
        }
    }

    paginateBack() {
        if (Number(this.page <= 0)) {
            this.page = 0;
        } else this.page -= 1;
    }

    paginateFront() {
        if (this.page > 29) {
            this.page = 29;
        } else this.page += 1;
    }

    startPag() {
        const pag = document.querySelector('.pagination') as HTMLElement;
        pag.innerHTML = '';
        const pagBack = document.createElement('button');
        pagBack.innerHTML = '&lt;';
        pagBack.className = 'pagination__item pagination_back';
        const pageMid1 = document.createElement('button');
        pageMid1.innerHTML = '1';
        pageMid1.className = 'pagination__item pagination_page';
        pageMid1.setAttribute('id', `p_0`);
        const pageMid2 = document.createElement('button');
        pageMid2.innerHTML = '2';
        pageMid2.className = 'pagination__item pagination_page';
        pageMid2.setAttribute('id', `p_1`);
        const pageMid3 = document.createElement('button');
        pageMid3.innerHTML = '3';
        pageMid3.className = 'pagination__item pagination_page';
        pageMid3.setAttribute('id', `p_2`);
        const pageMid4 = document.createElement('button');
        pageMid4.innerHTML = '4';
        pageMid4.className = 'pagination__item pagination_page';
        pageMid4.setAttribute('id', `p_3`);
        const pageMid5 = document.createElement('button');
        pageMid5.innerHTML = '5';
        pageMid5.className = 'pagination__item pagination_page';
        pageMid5.setAttribute('id', `p_4`);
        const spanDots = document.createElement('span');
        spanDots.className = 'pagination__item_dots';
        spanDots.innerHTML = '&emsp;...&emsp;';
        const page30 = document.createElement('button');
        page30.innerHTML = '30';
        page30.className = 'pagination__item pagination_page';
        page30.setAttribute('id', 'p_29');
        const pagFront = document.createElement('button');
        pagFront.className = 'pagination__item pagination_front';
        pagFront.innerHTML = '&gt;';
        pag.append(pagBack, pageMid1, pageMid2, pageMid3, pageMid4, pageMid5, spanDots, page30, pagFront);
    }

    midPag() {
        const pag = document.querySelector('.pagination') as HTMLElement;
        pag.innerHTML = '';
        const pagBack = document.createElement('button');
        pagBack.innerHTML = '&lt;';
        pagBack.className = 'pagination__item pagination_back';
        const page1 = document.createElement('button');
        page1.innerHTML = '1';
        page1.className = 'pagination__item pagination_page';
        page1.setAttribute('id', 'p_0');
        const spanDots = document.createElement('span');
        spanDots.className = 'pagination__item_dots';
        spanDots.innerHTML = '&emsp;...&emsp;';
        const spanDots1 = document.createElement('span');
        spanDots1.className = 'pagination__item_dots';
        spanDots1.innerHTML = '&emsp;...&emsp;';
        const pageMid1 = document.createElement('button');
        pageMid1.innerHTML = `${this.page + 1}`;
        pageMid1.className = 'pagination__item pagination_page';
        pageMid1.setAttribute('id', `p_${this.page}`);
        const pageMid2 = document.createElement('button');
        pageMid2.innerHTML = `${this.page + 2}`;
        pageMid2.className = 'pagination__item pagination_page';
        pageMid2.setAttribute('id', `p_${this.page + 1}`);
        const pageMid3 = document.createElement('button');
        pageMid3.innerHTML = `${this.page + 3}`;
        pageMid3.className = 'pagination__item pagination_page';
        pageMid3.setAttribute('id', `p_${this.page + 2}`);
        const page30 = document.createElement('button');
        page30.innerHTML = '30';
        page30.className = 'pagination__item pagination_page';
        page30.setAttribute('id', 'p_29');
        const pagFront = document.createElement('button');
        pagFront.className = 'pagination__item pagination_front';
        pagFront.innerHTML = '&gt;';
        pag.append(pagBack, page1, spanDots, pageMid1, pageMid2, pageMid3, spanDots1, page30, pagFront);
    }

    endPag() {
        const pag = document.querySelector('.pagination') as HTMLElement;
        pag.innerHTML = '';
        const pagBack = document.createElement('button');
        pagBack.innerHTML = '&lt;';
        pagBack.className = 'pagination__item pagination_back';
        const page1 = document.createElement('button');
        page1.innerHTML = '1';
        page1.className = 'pagination__item pagination_page';
        page1.setAttribute('id', 'p_0');
        const spanDots = document.createElement('span');
        spanDots.className = 'pagination__item_dots';
        spanDots.innerHTML = '&emsp;...&emsp;';
        const pageMid1 = document.createElement('button');
        pageMid1.innerHTML = '26';
        pageMid1.className = 'pagination__item pagination_page';
        pageMid1.setAttribute('id', `p_25`);
        const pageMid2 = document.createElement('button');
        pageMid2.innerHTML = '27';
        pageMid2.className = 'pagination__item pagination_page';
        pageMid2.setAttribute('id', `p_26`);
        const pageMid3 = document.createElement('button');
        pageMid3.innerHTML = '28';
        pageMid3.className = 'pagination__item pagination_page';
        pageMid3.setAttribute('id', `p_27`);
        const pageMid4 = document.createElement('button');
        pageMid4.innerHTML = '29';
        pageMid4.className = 'pagination__item pagination_page';
        pageMid4.setAttribute('id', `p_28`);
        const pageMid5 = document.createElement('button');
        pageMid5.innerHTML = '30';
        pageMid5.className = 'pagination__item pagination_page';
        pageMid5.setAttribute('id', `p_29`);
        const pagFront = document.createElement('button');
        pagFront.className = 'pagination__item pagination_front';
        pagFront.innerHTML = '&gt;';
        pag.append(pagBack, page1, spanDots, pageMid1, pageMid2, pageMid3, pageMid4, pageMid5, pagFront);
    }
}
window.onload = function textbookInit() {
    const textbook = new Textbook();
    textbook.getData();
    textbook.eventListen();
    const goTopBtn = document.querySelector('.back_to_top') as HTMLElement;
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const coords = document.documentElement.clientHeight;
        if (scrolled > coords) {
            goTopBtn.classList.add('back_to_top-show');
        }
        if (scrolled < coords) {
            goTopBtn.classList.remove('back_to_top-show');
        }
    });
    goTopBtn.addEventListener('click', function backToTop() {
        const coords = document.documentElement.clientHeight;
        if (window.pageYOffset > 0) {
            window.scrollBy(0, -coords);
            setTimeout(backToTop, 10);
        }
    });
};
export default Textbook;
