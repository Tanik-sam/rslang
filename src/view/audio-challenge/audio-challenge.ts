const test = document.getElementById('test');
const divFromTs: HTMLElement | null = document.createElement('div');
test?.append(divFromTs);
divFromTs.innerHTML = 'text from ts file';
