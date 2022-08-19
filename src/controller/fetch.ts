import { IWords } from '../app/interfaces';

const wordList = 'https://rs-lang2022.herokuapp.com/words';

export async function getWords(page = 0, group = 0) {
    const response = await fetch(`${wordList}?page=${page}&group=${group}`);
    const words = await response.json();
    localStorage.setItem('page', page.toString());
    return words;
}
export async function getWord(id: string | undefined) {
    const response = await fetch(`${wordList}/${id}`);
    const word = await response.json();
    return word;
}
