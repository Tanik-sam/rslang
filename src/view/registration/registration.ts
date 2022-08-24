import '../../style.scss';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { createUser } from '../../controller/fetch';
import { IID, IUser } from '../../app/interfaces';
import { local } from '../../controller/local';

class Registration {
    password = '';

    name = '';

    email = '';

    confirm = false;

    userId = '';

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

    checkConfirm(val: string): void {
        if (val !== this.password) {
            (document.querySelector('.incorrect_confirm') as HTMLElement).innerHTML = 'Пароли не совпадают!';
        } else {
            this.confirm = true;
        }
    }

    registr() {
        if (this.name && this.email && this.password && this.confirm) {
            const user = {
                name: this.name,
                email: this.email,
                password: this.password,
            };
            (async () => {
                const userId: IID = await createUser(user);
                this.modal(user);
            })();
        } else {
            this.checkEmail(this.email);
            this.checkName(this.name);
            this.checkPassword(this.password);
            this.checkConfirm((document.querySelector('.registration__confirm') as HTMLElement).innerHTML);
        }
    }

    modal(user: IUser) {
        const fragment = document.createDocumentFragment() as DocumentFragment;
        const modal = document.querySelector('#modal') as HTMLTemplateElement;
        const userClone = modal.content.cloneNode(true) as HTMLElement;
        (userClone.querySelector('.modal-window_name') as HTMLElement).textContent = `${user.name},`;
        fragment.append(userClone);
        (document.querySelector('.registration') as HTMLElement).append(fragment);
        (document.querySelector('#exit') as HTMLElement).addEventListener('click', () => {
            (document.querySelector('.registration') as HTMLElement).removeChild(
                document.querySelector('.overlay') as HTMLElement
            );
        });
    }
}
window.onload = function registrInit() {
    local();
    const registration = new Registration();
    const registrationName = document.querySelector('.registration__name') as HTMLElement;
    registrationName.addEventListener('blur', (e) => {
        (document.querySelector('.incorrect_name') as HTMLElement).innerHTML = '';
        registration.checkName((e.target as HTMLInputElement).value);
    });
    const registrationEmail = document.querySelector('.registration__email') as HTMLElement;
    registrationEmail.addEventListener('blur', (e) => {
        (document.querySelector('.incorrect_email') as HTMLElement).innerHTML = '';
        registration.checkEmail((e.target as HTMLInputElement).value);
    });
    const registrationPassword = document.querySelector('.registration__password') as HTMLElement;
    registrationPassword.addEventListener('blur', (e) => {
        (document.querySelector('.incorrect_password') as HTMLElement).innerHTML = '';
        registration.checkPassword((e.target as HTMLInputElement).value);
    });
    const registrationConfirm = document.querySelector('.registration__confirm') as HTMLElement;
    registrationConfirm.addEventListener('blur', (e) => {
        (document.querySelector('.incorrect_confirm') as HTMLElement).innerHTML = '';
        registration.checkConfirm((e.target as HTMLInputElement).value);
    });
    const registrationButton = document.querySelector('#registr2') as HTMLElement;
    registrationButton.addEventListener('click', () => {
        registration.registr();
    });
};
