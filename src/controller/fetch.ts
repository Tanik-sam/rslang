import { IWords, IUser, IID, ILogin } from '../app/interfaces';

const wordList = 'https://rs-lang2022.herokuapp.com/words';
const userList = 'https://rs-lang2022.herokuapp.com/users';
const userLogin = 'https://rs-lang2022.herokuapp.com/signin';
// const wordList = 'http://localhost:3000/words';
// const userList = 'http://localhost:3000/users';

export async function getWords(page = 0, group = 0): Promise<IWords[]> {
    const response = await fetch(`${wordList}?page=${page}&group=${group}`);
    localStorage.setItem('page', page.toString());
    localStorage.setItem('group', group.toString());
    if (response.status === 200) {
        const words = await response.json();
        return words;
    }
    throw new Error(`${response.status}`);
}
export async function getWord(id: string): Promise<IWords> {
    const response = await fetch(`${wordList}/${id}`);
    if (response.status === 200) {
        const word = await response.json();
        return word;
    }
    throw new Error(`${response.status}`);
}
export async function createUser(user: IUser): Promise<IID> {
    const response = await fetch(`${userList}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    if (response.status === 200) {
        const userId = await response.json();
        return userId;
    }
    if (response.status === 417) {
        (document.querySelector('.incorrect_email') as HTMLElement).innerHTML =
            'Пользователь с указанным e-mail уже существует.';
    }
    throw new Error(`${response.status}`);
}
export async function loginUser(login: ILogin) {
    const response = await fetch(`${userLogin}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(login),
    });
    if (response.status === 200) {
        const token = await response.json();
        return token;
    }
    if (response.status === 403) {
        (document.querySelector('.incorrect_email') as HTMLElement).innerHTML =
            'Неправильное имя пользователя или пароль!';
    }

    throw new Error(`${response.status}`);
}
