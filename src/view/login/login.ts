import '../../style.scss';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { loginUser } from '../../controller/fetch';
import { local } from '../../controller/local';
import { IToken } from '../../app/interfaces';

class Login {
    password = '';

    name = localStorage.currentUserName || '';

    email = localStorage.currentUserEmail || '';

    checkName(val: string): void {
        if (val === '' || val === ' ' || !val.match(/^[а-яё]{2,30}|[a-z]{2,30}$/iu)) {
            (document.querySelector('.incorrect_name') as HTMLElement).innerHTML = 'Введите имя (2 - 30 символов)!';
        } else {
            this.name = val;
        }
    }

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
            localStorage.setItem('currentUserName', this.name);
            localStorage.setItem('currentUserEmail', this.email);
            const user = {
                email: this.email,
                password: this.password,
            };
            (async () => {
                const token: IToken = await loginUser(user);
                localStorage.setItem('currentUserToken', JSON.stringify(token));
                this.modal();
            })();
        } else {
            this.checkEmail(this.email);
            this.checkPassword(this.password);
        }
    }

    modal() {
        const fragment = document.createDocumentFragment() as DocumentFragment;
        const modal = document.querySelector('#modal') as HTMLTemplateElement;
        const userClone = modal.content.cloneNode(true) as HTMLElement;
        (userClone.querySelector('.modal-window_name') as HTMLElement).textContent = `${this.name},`;
        fragment.append(userClone);
        (document.querySelector('.registration') as HTMLElement).append(fragment);
        try {
            (document.querySelector('#exit') as HTMLElement).addEventListener('click', () => {
                (document.querySelector('.registration') as HTMLElement).removeChild(
                    document.querySelector('.overlay') as HTMLElement
                );
            });
        } catch (e) {
            throw new Error(`Error`);
        }
    }
}
window.onload = function loginInit() {
    local();
    const login = new Login();
    const loginName = document.querySelector('.registration__name') as HTMLElement;
    loginName.addEventListener('blur', (e) => {
        (document.querySelector('.incorrect_name') as HTMLElement).innerHTML = '';
        login.checkName((e.target as HTMLInputElement).value);
    });
    const registrationEmail = document.querySelector('.registration__email') as HTMLElement;
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
