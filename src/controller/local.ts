export function local(){
    console.log('мы туть')
    if (localStorage.currentUserName && localStorage.currentUserEmail) {
        (document.querySelector('#loginButton') as HTMLElement).innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
        (document.querySelector('#loginButton') as HTMLElement).addEventListener('click', () => {
            console.log('А ну давай-ка выйдем!?');
            localStorage.removeItem('currentUserName');
            localStorage.removeItem('currentUserEmail');
            (document.querySelector('#loginButton') as HTMLElement).innerHTML = "Вход";
        })
        
    }
}