import '../../style.scss';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { local } from '../../controller/local';
import { IUserStat } from '../../app/interfaces';
import { getUserStatistics } from '../../controller/fetch';

class Statistics {
    userStatistics!: IUserStat | undefined;

    getStatistics() {
        (async () => {
            if (localStorage.currentUserName && localStorage.currentUserEmail) {
                this.userStatistics = await getUserStatistics();
                console.log(this.userStatistics);
            }
            (document.querySelector('.pagination') as HTMLElement).classList.remove('hidden');
            console.log('rere');
        })();
    }
}

window.onload = function textbookInit() {
    const statistics = new Statistics();
    statistics.getStatistics();
    local();
};
