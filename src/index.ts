import './style.scss';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import App from './app/start';

const go = new App();
go.start();

const demoBtn: HTMLElement | null = document.getElementById('demo-button');

demoBtn?.addEventListener('click', () => {
    const videoWrap: HTMLElement | null = document.getElementById('video-wrapper');
    if (videoWrap) {
        if (videoWrap.style.display === 'none') {
            videoWrap.style.display = 'block';
        } else {
            videoWrap.style.display = 'none';
        }
    }
});
