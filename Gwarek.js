document.addEventListener('DOMContentLoaded', () => {
    const mainPet = document.getElementById('pet');

    function spawnParticles(x, y) {
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('div');
            p.style.cssText = `position:fixed;width:5px;height:5px;border-radius:50%;background:white;z-index:1001;pointer-events:none;left:${x}px;top:${y}px;box-shadow:0 0 4px 2px rgba(255,255,255,0.7);`;
            document.body.appendChild(p);
            const angle = (Math.PI * 2 / 12) * i;
            const speed = 2 + Math.random() * 3;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            let life = 1;
            let px = x, py = y;
            const tick = () => {
                life -= 0.04; px += vx; py += vy;
                p.style.left = px + 'px'; p.style.top = py + 'px';
                p.style.opacity = life; p.style.transform = `scale(${life})`;
                if (life > 0) requestAnimationFrame(tick); else p.remove();
            };
            requestAnimationFrame(tick);
        }
    }

    function setupPet(petElement) {
        petElement.dataset.clicks = "0";
        petElement.style.cssText = `position:fixed;width:50px;z-index:1000;image-rendering:pixelated;`;

        const GROUND = window.innerHeight - 50;
        let currentX = Math.random() * (window.innerWidth - 60);
        let currentY = GROUND;
        let facingRight = true;
        let isDoingTrick = false;

        petElement.style.left = currentX + 'px';
        petElement.style.top = currentY + 'px';

        function applyTransform(extraRotation) {
            const scaleX = facingRight ? 1 : -1;
            petElement.style.transform = `scaleX(${scaleX}) rotate(${extraRotation || 0}deg)`;
        }

        function moveTo(targetX, onDone) {
            const startX = currentX;
            const distance = Math.abs(targetX - startX);
            if (distance < 2) { if (onDone) onDone(); return; }

            facingRight = targetX > startX;
            const duration = 400 + distance * 2;
            const jumpHeight = 22;
            const numJumps = Math.max(1, Math.round(distance / 55));
            const startTime = performance.now();

            function tick(now) {
                const t = Math.min((now - startTime) / duration, 1);
                currentX = startX + (targetX - startX) * t;

                const jumpT = (t * numJumps) % 1;
                const jumpOffset = Math.sin(jumpT * Math.PI) * jumpHeight;
                currentY = GROUND - jumpOffset;

                petElement.style.left = currentX + 'px';
                petElement.style.top = currentY + 'px';
                applyTransform(0);

                if (t < 1) requestAnimationFrame(tick);
                else {
                    currentY = GROUND;
                    petElement.style.top = currentY + 'px';
                    if (onDone) onDone();
                }
            }
            requestAnimationFrame(tick);
        }

        function doTrick(onDone) {
            if (isDoingTrick) { if (onDone) onDone(); return; }
            isDoingTrick = true;

            const isBackflip = Math.random() > 0.5;
            const spinDir = isBackflip ? 1 : -1;
            const airHeight = 90;
            const duration = 900;
            const startTime = performance.now();
            const startY = currentY;

            const rect = petElement.getBoundingClientRect();
            spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);

            let peakParticlesDone = false;

            function tick(now) {
                const t = Math.min((now - startTime) / duration, 1);
                const jumpOffset = Math.sin(t * Math.PI) * airHeight;
                currentY = GROUND - jumpOffset;
                petElement.style.top = currentY + 'px';

                const rotation = spinDir * 360 * t;
                applyTransform(rotation);

                if (t > 0.45 && t < 0.55 && !peakParticlesDone) {
                    peakParticlesDone = true;
                    const r = petElement.getBoundingClientRect();
                    spawnParticles(r.left + r.width / 2, r.top + r.height / 2);
                }

                if (t < 1) {
                    requestAnimationFrame(tick);
                } else {
                    currentY = GROUND;
                    petElement.style.top = currentY + 'px';
                    applyTransform(0);
                    isDoingTrick = false;
                    if (onDone) onDone();
                }
            }
            requestAnimationFrame(tick);
        }

        function scheduleNext() {
            const delay = 2000 + Math.random() * 1500;
            setTimeout(() => {
                const doFlip = Math.random() > 0.6;
                if (doFlip) {
                    doTrick(() => {
                        setTimeout(() => {
                            moveTo(Math.random() * (window.innerWidth - 60), scheduleNext);
                        }, 300);
                    });
                } else {
                    moveTo(Math.random() * (window.innerWidth - 60), scheduleNext);
                }
            }, delay);
        }

        scheduleNext();

        petElement.addEventListener('click', function () {
            const rect = this.getBoundingClientRect();
            spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
            let count = parseInt(this.dataset.clicks) + 1;
            if (count >= 5) {
                this.dataset.clicks = "0";
                const newPet = document.createElement('img');
                newPet.src = 'static/Gwarek.png';
                newPet.style.position = 'fixed';
                newPet.style.width = '50px';
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
