document.addEventListener('DOMContentLoaded', () => {
    const mainPet = document.getElementById('pet');

    function setupPet(petElement) {
        petElement.dataset.clicks = "0";
        petElement.style.transition = 'all 0.5s ease, transform 0.2s ease';
        petElement.style.position = 'fixed';
        petElement.style.width = '50px';
        petElement.style.zIndex = '1000';

        setInterval(() => {
            petElement.style.left = Math.random() * (window.innerWidth - 60) + 'px';
            petElement.style.top = Math.random() * (window.innerHeight - 60) + 'px';
        }, 2000 + Math.random() * 1000);

        petElement.addEventListener('click', function() {
            this.style.transform = 'scale(0.8, 1.2)';
            setTimeout(() => { this.style.transform = 'scale(1, 1)'; }, 200);

            let count = parseInt(this.dataset.clicks) + 1;
            if (count >= 5) {
                this.dataset.clicks = "0";
                const newPet = document.createElement('img');
                newPet.src = 'static/Gwarek.png';
                newPet.style.left = this.style.left;
                newPet.style.top = this.style.top;
                document.body.appendChild(newPet);
                setupPet(newPet);
            } else {
                this.dataset.clicks = count.toString();
            }
        });
    }

    if (mainPet) setupPet(mainPet);
});
