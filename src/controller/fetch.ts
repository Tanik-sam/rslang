import { IWords, IUser, IID, ILogin, IUserWord, IUserGetWord, IUserStat } from '../app/interfaces';

const wordList = 'https://rs-lang2022.herokuapp.com/words';
const userList = 'https://rs-lang2022.herokuapp.com/users';
const userLogin = 'https://rs-lang2022.herokuapp.com/signin';
// const wordList = 'http://localhost:27017/words';
// const userList = 'http://localhost:27017/users';
// const userLogin = 'http://localhost:27017/signin';
// const wordList = 'http://localhost:3000/words';
// const userList = 'http://localhost:3000/users';
// const userLogin = 'http://localhost:3000/signin';

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
    if (response.status === 404) {
        (document.querySelector('.incorrect_email') as HTMLElement).innerHTML = 'Такого пользователя не существует!';
    }

    throw new Error(`${response.status} в логин`);
}
export async function refreshUserToken() {
    console.log('мы туть, в рефреше');
    const userId = `${JSON.parse(localStorage.currentUserToken).userId}`;
    const refreshToken = `${JSON.parse(localStorage.currentUserToken).refreshToken}`;
    const response = await fetch(`${userList}/${userId}/tokens`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${refreshToken}`,
            Accept: 'application/json',
        },
    });
    const content = await response.json();
    if (content) {
        localStorage.setItem('currentUserToken', JSON.stringify(content));
    }
    throw new Error(`${response.status}`);
}
export async function getUserWords(): Promise<IUserGetWord[]> {
    const userId = `${JSON.parse(localStorage.currentUserToken).userId}`;
    const token = `${JSON.parse(localStorage.currentUserToken).token}`;
    const response = await fetch(`${userList}/${userId}/words`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });
    if (response.status === 401 || response.status === 402) {
        console.log('Надо сделать refreshUserToken(), но он не работает! Перелогиньтесь!');
    }
    const content = await response.json();
    return content;
}
export async function getUserWord(wordId: string): Promise<IUserGetWord> {
    const userId = `${JSON.parse(localStorage.currentUserToken).userId}`;
    const token = `${JSON.parse(localStorage.currentUserToken).token}`;
    const response = await fetch(`${userList}/${userId}/words/${wordId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });
    const content = await response.json();
    if (response.status === 401 || response.status === 402) {
        refreshUserToken();
    }
    if (response.status === 200) {
        return content;
        // console.log('create ok');
    }
    throw new Error(`${response.status}`);
}
export async function createUserWord(wordId: string, word: IUserWord) {
    const userId = `${JSON.parse(localStorage.currentUserToken).userId}`;
    const token = `${JSON.parse(localStorage.currentUserToken).token}`;
    // console.log('wordId ', wordId, 'word ', word, 'userId ', userId, 'token ', token);
    const response = await fetch(`${userList}/${userId}/words/${wordId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(word),
    });
    // const content = await response.json();
    if (response.status === 200) {
        // console.log('create ok');
        // console.log(content);
    } else {
        throw new Error(`${response.status}`);
    }
}
export async function updateUserWord(wordId: string, word: IUserWord) {
    const userId = `${JSON.parse(localStorage.currentUserToken).userId}`;
    const token = `${JSON.parse(localStorage.currentUserToken).token}`;
    // console.log('wordId ', wordId, 'word ', word, 'userId ', userId, 'token ', token);
    const response = await fetch(`${userList}/${userId}/words/${wordId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(word),
    });
    // const content = await response.json();
    if (response.status === 200) {
        // console.log('update ok');
        // console.log(content);
    } else {
        throw new Error(`${response.status}`);
    }
}
export async function deleteUserWord(wordId: string) {
    const userId = `${JSON.parse(localStorage.currentUserToken).userId}`;
    const response = await fetch(`${userList}/${userId}/words/${wordId}`, {
        method: 'DELETE',
    });
    if (response.status === 200) {
        console.log('delete ok');
    }
    throw new Error(`${response.status}`);
}

export async function upsertUserStatistics(stat: IUserStat) {
    const userId = `${JSON.parse(localStorage.currentUserToken).userId}`;
    const token = `${JSON.parse(localStorage.currentUserToken).token}`;
    const response = await fetch(`${userList}/${userId}/statistics`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(stat),
    });
    // const content = await response.json();
    if (response.status === 200) {
        // console.log('update ok');
        // console.log(content);
    } else {
        throw new Error(`${response.status}`);
    }
}

export async function getUserStatistics(): Promise<IUserStat | undefined> {
    const userId = `${JSON.parse(localStorage.currentUserToken).userId}`;
    const token = `${JSON.parse(localStorage.currentUserToken).token}`;
    const response = await fetch(`${userList}/${userId}/statistics`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });
    const stats = await response.json();
    return stats;
}
