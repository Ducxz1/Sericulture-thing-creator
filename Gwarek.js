const pet = document.getElementById('pet');
let x = 0, y = 0;

function movePet() {
    x = Math.random() * (window.innerWidth - 50);
    y = Math.random() * (window.innerHeight - 50);
    pet.style.left = x + 'px';
    pet.style.top = y + 'px';
}

setInterval(movePet, 2000);
