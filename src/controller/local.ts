export function local() {
    if (localStorage.currentUserName && localStorage.currentUserEmail) {
        (document.querySelector('#loginButton') as HTMLElement).innerHTML =
            '<i class="fa-solid fa-right-from-bracket"></i>';
        (document.querySelector('#loginButton') as HTMLElement).addEventListener('click', () => {
            localStorage.removeItem('currentUserName');
            localStorage.removeItem('currentUserEmail');
            localStorage.removeItem('currentUserToken');
            localStorage.removeItem('learned');
            if (document.querySelectorAll('.learnedWors')) {
                Array.from(document.querySelectorAll('.learnedWors')).forEach((item) => {
                    item.classList.remove('learnedWors');
                });
            }
            localStorage.removeItem('flag');
            (document.querySelector('#loginButton') as HTMLElement).innerHTML = 'Вход';
        });
    }
}

export function local2() {}
