import '../../style.scss';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { getWords, getWord } from '../../controller/fetch';

class Registration {
    password = '';

    checkName(val: string): void {
        if (val === '' || val === ' ' || !val.match(/[\d\w/]/)) {
            (document.querySelector('.incorrect_name') as HTMLElement).innerHTML = 'Введите имя латинскими буквами!';
        }
    }

    checkEmail(val: string): void {
        if (!val.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            (document.querySelector('.incorrect_email') as HTMLElement).innerHTML = 'Ваш e-mail введен неверно!';
        }
    }

    checkPassword(val: string): void {
        if (!val.match(/(?=.*[0-9])(?=.*[a-z])[0-9a-z]{6,}/i)) {
            (document.querySelector('.incorrect_password') as HTMLElement).innerHTML =
                'Пароль должен быть не менее 6символов и содержать латинские буквы и цифры!';
        } else {
            this.password = val;
        }
    }

    checkConfirm(val: string): void {
        if (val !== this.password) {
            (document.querySelector('.incorrect_confirm') as HTMLElement).innerHTML = 'Пароли не совпадают!';
        }
    }
}
window.onload = function registrInit() {
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
};
