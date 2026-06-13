document.addEventListener('DOMContentLoaded', () => {
    const mainPet = document.getElementById('pet');

    function spawnParticles(x, y) {
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('div');
            p.style.position = 'fixed';
            p.style.width = '5px';
            p.style.height = '5px';
            p.style.borderRadius = '50%';
            p.style.background = 'white';
            p.style.zIndex = '1001';
            p.style.pointerEvents = 'none';
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.style.boxShadow = '0 0 4px 2px rgba(255,255,255,0.7)';
            document.body.appendChild(p);

            const angle = (Math.PI * 2 / 12) * i;
            const speed = 2 + Math.random() * 3;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            let life = 1;
            let px = x;
            let py = y;

            const tick = () => {
                life -= 0.04;
                px += vx;
                py += vy;
                p.style.left = px + 'px';
                p.style.top = py + 'px';
                p.style.opacity = life;
                p.style.transform = `scale(${life})`;
                if (life > 0) requestAnimationFrame(tick);
                else p.remove();
            };
            requestAnimationFrame(tick);
        }
    }

    function setupPet(petElement) {
        petElement.dataset.clicks = "0";
        petElement.style.position = 'fixed';
        petElement.style.width = '50px';
        petElement.style.zIndex = '1000';
        petElement.style.imageRendering = 'pixelated';

        let currentX = Math.random() * (window.innerWidth - 60);
        let currentY = 0;
        let velY = 0;
        let facingRight = true;
        let isDoingTrick = false;
        let trickRotation = 0;
        let trickProgress = 0;
        let trickDirection = 1;
        let jumpVelY = 0;
        let jumpY = 0;
        let isJumping = false;
        let jumpProgress = 0;
        let targetX = currentX;
        let walkProgress = 0;
        let isWalking = false;

        petElement.style.left = currentX + 'px';
        petElement.style.bottom = '0px';

        function applyTransform() {
            const scaleX = facingRight ? 1 : -1;
            if (isDoingTrick) {
                petElement.style.transform = `scaleX(${scaleX}) rotate(${trickRotation}deg) translateY(${-jumpY}px)`;
            } else {
                petElement.style.transform = `scaleX(${scaleX}) translateY(${-jumpY}px)`;
            }
        }

        function startWalkTo(newX) {
            targetX = newX;
            facingRight = newX > currentX;
            isWalking = true;
            walkProgress = 0;

            const distance = Math.abs(newX - currentX);
            const duration = 500 + distance * 1.5;
            const startX = currentX;
            const startTime = performance.now();

            const jumpHeight = 18;
            const jumpsCount = Math.max(1, Math.floor(distance / 60));
            isJumping = true;

            function walkTick(now) {
                const elapsed = now - startTime;
                const t = Math.min(elapsed / duration, 1);
                currentX = startX + (newX - startX) * t;
                petElement.style.left = currentX + 'px';

                const jumpT = (t * jumpsCount) % 1;
                jumpY = Math.sin(jumpT * Math.PI) * jumpHeight;
                applyTransform();

                if (t < 1) {
                    requestAnimationFrame(walkTick);
                } else {
                    currentX = newX;
                    jumpY = 0;
                    isJumping = false;
                    isWalking = false;
                    applyTransform();
                }
            }
            requestAnimationFrame(walkTick);
        }

        function doTrick() {
            if (isDoingTrick) return;
            isDoingTrick = true;
            const isBackflip = Math.random() > 0.5;
            trickDirection = isBackflip ? 1 : -1;
            trickRotation = 0;

            const airHeight = 80;
            const totalDuration = 900;
            const startTime = performance.now();

            const rect = petElement.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            spawnParticles(cx, cy);

            function trickTick(now) {
                const t = Math.min((now - startTime) / totalDuration, 1);
                jumpY = Math.sin(t * Math.PI) * airHeight;
                trickRotation = trickDirection * 360 * t;

                if (t > 0.4 && t < 0.6) {
                    const rect2 = petElement.getBoundingClientRect();
                    spawnParticles(rect2.left + rect2.width / 2, rect2.top + rect2.height / 2);
                }

                applyTransform();

                if (t < 1) {
                    requestAnimationFrame(trickTick);
                } else {
                    trickRotation = 0;
                    jumpY = 0;
                    isDoingTrick = false;
                    applyTransform();
                }
            }
            requestAnimationFrame(trickTick);
        }

        function scheduleNext() {
            const delay = 2500 + Math.random() * 1000;
            setTimeout(() => {
                const doFlip = Math.random() > 0.6;
                if (doFlip) {
                    doTrick();
                    setTimeout(() => {
                        if (!isDoingTrick) {
                            startWalkTo(Math.random() * (window.innerWidth - 60));
                        }
                    }, 1000);
                } else {
                    startWalkTo(Math.random() * (window.innerWidth - 60));
                }
                scheduleNext();
            }, delay);
        }

        scheduleNext();

        petElement.addEventListener('click', function () {
            const rect = this.getBoundingClientRect();
            spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
            this.style.transition = 'transform 0.3s ease';

            let count = parseInt(this.dataset.clicks) + 1;
            if (count >= 5) {
                this.dataset.clicks = "0";
                const newPet = document.createElement('img');
                newPet.src = 'static/Gwarek.png';
                newPet.style.position = 'fixed';
                newPet.style.bottom = '0px';
                newPet.style.width = '50px';
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
