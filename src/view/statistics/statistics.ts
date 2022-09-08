import '../../style.scss';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { local } from '../../controller/local';
import { IUserStat } from '../../app/interfaces';
import { getUserStatistics } from '../../controller/fetch';

class Statistics {
    userStatistics!: IUserStat;

    getStatistics() {
        (async () => {
            if (localStorage.currentUserName && localStorage.currentUserEmail) {
                this.userStatistics = await getUserStatistics();
                try {
                    (document.querySelector(
                        '#statAudioLearned'
                    ) as HTMLElement).innerHTML = `${this.userStatistics.learnedWords}`;
                    (document.querySelector('#statAudioSuc') as HTMLElement).innerHTML = `${
                        this.userStatistics.optional.audioSuc || 0 / (this.userStatistics.optional.audioAll || 1)
                    }%`;
                    (document.querySelector(
                        '#statAudioSer'
                    ) as HTMLElement).innerHTML = `${this.userStatistics.optional.audioSeria}`;
                    (document.querySelector(
                        '#statSprintLearned'
                    ) as HTMLElement).innerHTML = `${this.userStatistics.learnedWords}`;
                    (document.querySelector('#statSprintSuc') as HTMLElement).innerHTML = `${
                        this.userStatistics.optional.sprintSuc || 0 / (this.userStatistics.optional.sprintAll || 1)
                    }%`;
                    (document.querySelector(
                        '#statSprintSer'
                    ) as HTMLElement).innerHTML = `${this.userStatistics.optional.sprintSeria}`;
                    (document.querySelector(
                        '#statAllLearned'
                    ) as HTMLElement).innerHTML = `${this.userStatistics.learnedWords}`;
                    (document.querySelector('#statAllSuc') as HTMLElement).innerHTML = `${Math.round(
                        (this.userStatistics.optional.sprintSuc || 0) +
                            (this.userStatistics.optional.audioSuc || 0) /
                                ((this.userStatistics.optional.sprintAll || 0) +
                                    this.userStatistics.optional.audioAll || 1)
                    )}%`;
                    (document.querySelector('#statAllSer') as HTMLElement).innerHTML = `${
                        (this.userStatistics.optional.sprintSeria || 0) + (this.userStatistics.optional.audioSeria || 0)
                    }`;
                } catch (e) {
                    throw new Error(`Error`);
                }
            } else {
                this.modal();
            }
        })();
    }

    modal() {
        const fragment = document.createDocumentFragment() as DocumentFragment;
        const modal = document.querySelector('#modal') as HTMLTemplateElement;
        const userClone = modal.content.cloneNode(true) as HTMLElement;
        fragment.append(userClone);
        (document.querySelector('.statistic__container--main') as HTMLElement).append(fragment);
        (document.querySelector('#exit') as HTMLElement).addEventListener('click', () => {
            (document.querySelector('.statistic__container--main') as HTMLElement).removeChild(
                document.querySelector('.overlay') as HTMLElement
            );
        });
        (document.querySelector('#exit2') as HTMLElement).addEventListener('click', () => {
            (document.querySelector('.statistic__container--main') as HTMLElement).removeChild(
                document.querySelector('.overlay') as HTMLElement
            );
        });
    }
}

window.onload = function textbookInit() {
    const statistics = new Statistics();
    statistics.getStatistics();
    local();
};
