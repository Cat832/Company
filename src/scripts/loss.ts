import '../styles/loss.css';
let btn = document.querySelector('.loss-play-again') as HTMLButtonElement;
btn.onclick = () => {
    window.location.replace('/index.html');
}
