const pet = document.getElementById('pet');
let x = 0, y = 0;

function movePet() {
    x = Math.random() * (window.innerWidth - 50);
    y = Math.random() * (window.innerHeight - 50);
    pet.style.left = x + 'px';
    pet.style.top = y + 'px';
}

setInterval(movePet, 2000);

// Duplication logic
pet.addEventListener('click', function() {
    const newPet = document.createElement('img');
    newPet.src = 'static/Gwarek.png';
    newPet.style.position = 'fixed';
    newPet.style.width = '50px';
    newPet.style.left = pet.style.left;
    newPet.style.top = pet.style.top;
    newPet.style.zIndex = '1000';
    document.body.appendChild(newPet);
});
