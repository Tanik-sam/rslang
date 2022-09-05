export function local() {
    if (localStorage.currentUserName && localStorage.currentUserEmail) {
        (document.querySelector('#loginButton') as HTMLElement).innerHTML =
            '<i class="fa-solid fa-right-from-bracket"></i>';
        (document.querySelector('#loginButton') as HTMLElement).addEventListener('click', () => {
            localStorage.removeItem('currentUserName');
            localStorage.removeItem('currentUserEmail');
            localStorage.removeItem('learned');
            (document.querySelector('#loginButton') as HTMLElement).innerHTML = 'Вход';
        });
    }
}

export function local2() {}
