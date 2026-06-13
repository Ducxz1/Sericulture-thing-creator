const pet = document.getElementById('pet');
let x = 0;
let y = 0;
let clickCount = 0;

function movePet() {
    x = Math.random() * (window.innerWidth - 60);
    y = Math.random() * (window.innerHeight - 60);
    pet.style.left = x + 'px';
    pet.style.top = y + 'px';
}

setInterval(movePet, 2000);

function squishAnimation(element) {
    element.style.transform = 'scale(0.8, 1.2)';
    setTimeout(() => {
        element.style.transform = 'scale(1, 1)';
    }, 200);
}

function handlePetClick(event) {
    const clickedElement = event.target;
    squishAnimation(clickedElement);
    
    clickCount++;
    
    if (clickCount >= 5) {
        clickCount = 0;
        const newPet = document.createElement('img');
        newPet.src = 'static/Gwarek.png';
        newPet.style.position = 'fixed';
        newPet.style.width = '50px';
        newPet.style.transition = 'all 0.5s ease, transform 0.2s ease';
        newPet.style.left = clickedElement.style.left;
        newPet.style.top = clickedElement.style.top;
        newPet.style.zIndex = '1000';
        
        newPet.addEventListener('click', handlePetClick);
        
        setInterval(() => {
            newPet.style.left = Math.random() * (window.innerWidth - 60) + 'px';
            newPet.style.top = Math.random() * (window.innerHeight - 60) + 'px';
        }, 2000 + Math.random() * 1000);
        
        document.body.appendChild(newPet);
    }
}

pet.style.transition = 'all 0.5s ease, transform 0.2s ease';
pet.addEventListener('click', handlePetClick);
