class App {
    /* private controller;
    private view;
    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    } */

    start(): void {
        (document.getElementById('login') as HTMLElement).addEventListener('click', (e: Event) =>
            console.log(`Ты нажал ${e.target}, а что ты сделал, чтобы она работала????`)
        );
    }
}

export default App;
