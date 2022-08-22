import '../../style.scss';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { loginUser } from '../../controller/fetch';
import { IToken, IUser } from '../../app/interfaces';

class Login {
    password = '';

    name = localStorage.currentUser || '';

    email = localStorage.getItem(localStorage.currentUser) || '';

    checkEmail(val: string): void {
        if (!val.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            (document.querySelector('.incorrect_email') as HTMLElement).innerHTML = 'Ваш e-mail введен неверно!';
        } else {
            this.email = val;
        }
    }

    checkPassword(val: string): void {
        if (!val.match(/(?=.*[0-9])(?=.*[a-z])[0-9a-z]{8,}/i)) {
            (document.querySelector('.incorrect_password') as HTMLElement).innerHTML =
                'Пароль должен быть не короче 8 символов и содержать латинские буквы и цифры!';
        } else {
            this.password = val;
        }
    }

    login() {
        if (this.email && this.password) {
            const user = {
                email: this.email,
                password: this.password,
            };
            (async () => {
                const token: IToken = await loginUser(user);
                console.log(token);
                localStorage.setItem(this.email, JSON.stringify(token));
                this.modal(token);
            })();
        } else {
            this.checkEmail(this.email);
            this.checkPassword(this.password);
        }
    }

    modal(user: IToken) {
        const fragment = document.createDocumentFragment() as DocumentFragment;
        const modal = document.querySelector('#modal') as HTMLTemplateElement;
        const userClone = modal.content.cloneNode(true) as HTMLElement;
        (userClone.querySelector('.modal-window_name') as HTMLElement).textContent = `${this.name},`;
        fragment.append(userClone);
        (document.querySelector('.registration') as HTMLElement).append(fragment);
        (document.querySelector('#exit') as HTMLElement).addEventListener('click', (e) => {
            (document.querySelector('.registration') as HTMLElement).removeChild(
                document.querySelector('.overlay') as HTMLElement
            );
        });
    }
}
window.onload = function loginInit() {
    const login = new Login();
    const loginName = document.querySelector('.registration__name') as HTMLElement;
    if (localStorage.currentUser) {
        loginName.setAttribute('value', localStorage.currentUser);
    }
    const registrationEmail = document.querySelector('.registration__email') as HTMLElement;
    if (localStorage.currentUser) {
        registrationEmail.setAttribute('value', localStorage.getItem(localStorage.currentUser) || '');
    }
    registrationEmail.addEventListener('blur', (e) => {
        (document.querySelector('.incorrect_email') as HTMLElement).innerHTML = '';
        login.checkEmail((e.target as HTMLInputElement).value);
    });
    const loginPassword = document.querySelector('.registration__password') as HTMLElement;
    loginPassword.addEventListener('blur', (e) => {
        (document.querySelector('.incorrect_password') as HTMLElement).innerHTML = '';
        login.checkPassword((e.target as HTMLInputElement).value);
    });

    const loginButton = document.querySelector('#login2') as HTMLElement;
    loginButton.addEventListener('click', () => {
        login.login();
    });
};
