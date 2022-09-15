import { IWords, IUser, IID, ILogin, IUserWord, IUserGetWord, IUserStat } from '../app/interfaces';

const wordList = 'https://rs-lang2022.herokuapp.com/words';
const userList = 'https://rs-lang2022.herokuapp.com/users';
const userLogin = 'https://rs-lang2022.herokuapp.com/signin';

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
    }
    throw new Error(`${response.status}`);
}

export async function createUserWord(wordId: string, word: IUserWord): Promise<void> {
    const userId = `${JSON.parse(localStorage.currentUserToken).userId}`;
    const token = `${JSON.parse(localStorage.currentUserToken).token}`;
    const response = await fetch(`${userList}/${userId}/words/${wordId}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(word),
    });
    if (response.status !== 200) {
        throw new Error(`${response.status}`);
    }
}

export async function updateUserWord(wordId: string, word: IUserWord): Promise<void> {
    const userId = `${JSON.parse(localStorage.currentUserToken).userId}`;
    const token = `${JSON.parse(localStorage.currentUserToken).token}`;
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
    // eslint-disable-next-line no-empty
    if (response.status === 200) {
    } else {
        throw new Error(`${response.status}`);
    }
}

export async function deleteUserWord(wordId: string): Promise<void> {
    const userId = `${JSON.parse(localStorage.currentUserToken).userId}`;
    const response = await fetch(`${userList}/${userId}/words/${wordId}`, {
        method: 'DELETE',
    });
    if (response.status !== 200) {
        throw new Error(`${response.status}`);
    }
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
    if (response.status !== 200) {
        throw new Error(`${response.status}`);
    }
}

export async function getUserStatistics(): Promise<IUserStat> {
    const userId = `${JSON.parse(localStorage.currentUserToken).userId}`;
    const token = `${JSON.parse(localStorage.currentUserToken).token}`;
    const response = await fetch(`${userList}/${userId}/statistics`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });
    if (response.status === 404) {
        upsertUserStatistics({
            learnedWords: 0,
            optional: {
                date: new Date(),
                sprintSeria: 0,
                sprintSuc: 0,
                sprintAll: 0,
                audioSeria: 0,
                audioSuc: 0,
                audioAll: 0,
            },
        });
    }
    const stats = await response.json();
    if (response.status !== 200) {
        console.log(response.status);
    }
    return stats;
}

export async function getAggregatedHardWords(): Promise<IUserGetWord> {
    const userId = `${JSON.parse(localStorage.currentUserToken).userId}`;
    const token = `${JSON.parse(localStorage.currentUserToken).token}`;
    const response = await fetch(
        `${userList}/${userId}/aggregatedWords?filter={"$and":[{"userWord.difficulty":"${'hard'}"}]}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        }
    );
    const word = await response.json();
    if (response.status !== 200) {
        console.log(response.status);
    }
    return word;
}

export async function getAggregatedLearnedWords(page: number, group: number) {
    const userId = `${JSON.parse(localStorage.currentUserToken).userId}`;
    const token = `${JSON.parse(localStorage.currentUserToken).token}`;
    const response = await fetch(
        `${userList}/${userId}/aggregatedWords?wordsPerPage=600&filter={
        "$and":[{"page":${page}}, {"group":${group}}, {"userWord.optional.learned":true}]}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        }
    );
    const word = await response.json();
    if (response.status !== 200) {
        console.log(response.status);
    }
    return word;
}
