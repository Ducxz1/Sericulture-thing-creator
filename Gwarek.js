document.addEventListener('DOMContentLoaded', () => {
    const mainPet = document.getElementById('pet');

    function setupPet(petElement) {
        petElement.dataset.clicks = "0";
        petElement.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease';
        petElement.style.position = 'fixed';
        petElement.style.bottom = '0px';
        petElement.style.left = (Math.random() * (window.innerWidth - 60)) + 'px';
        petElement.style.width = '50px';
        petElement.style.zIndex = '1000';

        setInterval(() => {
            const isBackflip = Math.random() > 0.8;
            petElement.style.transform = 'scale(1.2, 0.8)';
            petElement.style.left = (Math.random() * (window.innerWidth - 60)) + 'px';
            
            if (isBackflip) {
                petElement.style.transition = 'all 0.8s ease';
                petElement.style.transform = 'scale(1, 1) rotate(360deg)';
            }

            setTimeout(() => {
                petElement.style.transform = 'scale(1, 1) rotate(0deg)';
                petElement.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease';
            }, 500);
        }, 2500 + Math.random() * 1000);

        petElement.addEventListener('click', function() {
            this.style.transform = 'scale(1.4, 0.6)';
            setTimeout(() => { this.style.transform = 'scale(1, 1)'; }, 300);

            let count = parseInt(this.dataset.clicks) + 1;
            if (count >= 5) {
                this.dataset.clicks = "0";
                const newPet = document.createElement('img');
                newPet.src = 'static/Gwarek.png';
                newPet.style.position = 'fixed';
                newPet.style.width = '50px';
                newPet.style.bottom = '0px';
                newPet.style.left = this.style.left;
                document.body.appendChild(newPet);
                setupPet(newPet);
            } else {
                this.dataset.clicks = count.toString();
            }
        });
    }

    if (mainPet) setupPet(mainPet);
});
