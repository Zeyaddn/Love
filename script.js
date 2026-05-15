document.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const bigHeart = document.getElementById('big-heart');
    const secretModal = document.getElementById('secret-modal');
    const closeModal = document.querySelector('.close-modal');
    const daysCount = document.getElementById('days-count');
    const loginScreen = document.getElementById('login-screen');
    const loginBtn = document.getElementById('login-btn');
    const passwordInput = document.getElementById('password-input');
    const loginStatusMsg = document.getElementById('login-status-msg');
    const loginLoader = document.getElementById('login-loader');
    const loginToast = document.getElementById('login-toast');
    const mainContent = document.getElementById('main-content');

    // 0. Login Logic
    const CORRECT_PASSWORD = "love"; // الباسورد الجديد

    loginBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPassword(); });

    // Bear Interaction & Funny Messages
    const bearContainer = document.querySelector('.bear-container');
    const bearSpeech = document.getElementById('bear-speech');
    
    passwordInput.addEventListener('focus', () => {
        bearContainer.classList.add('hiding-eyes');
        bearSpeech.innerText = "مش بغش ياحبيبتي عيني مقفولة! 😂";
    });
    passwordInput.addEventListener('blur', () => {
        bearContainer.classList.remove('hiding-eyes');
    });

    passwordInput.addEventListener('input', () => {
        if (!isMusicPlaying) startMusic();
    });

    // initSite() is called after login

    // Music Autoplay Hack
    function attemptAutoplay() {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggle.classList.add('playing');
        }).catch(() => {
            // If blocked, wait for ANY interaction
            const playOnInteraction = () => {
                if (!isMusicPlaying) {
                    startMusic();
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('keydown', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                }
            };
            document.addEventListener('click', playOnInteraction);
            document.addEventListener('keydown', playOnInteraction);
            document.addEventListener('touchstart', playOnInteraction);
        });
    }
    
    attemptAutoplay();

    function startMusic() {
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggle.classList.add('playing');
            musicToggle.querySelector('i').className = 'bx bx-pause-circle';
        }).catch(e => console.log(e));
    }

    function checkPassword() {
        if (passwordInput.value === CORRECT_PASSWORD) {
            if (!isMusicPlaying) startMusic();
            
            loginStatusMsg.innerText = "شطورة يا حبيبتي! ❤️";
            loginStatusMsg.className = "status-success";
            loginToast.classList.remove('toast-hidden');
            loginLoader.style.display = "block";
            loginScreen.querySelector('.bear-svg').classList.remove('hiding-eyes');

            setTimeout(() => {
                loginScreen.style.transition = "1.5s";
                loginScreen.style.opacity = "0";
                setTimeout(() => {
                    loginScreen.style.display = "none";
                    loginToast.classList.add('toast-hidden');
                    mainContent.classList.add('authenticated');
                    initSite(); 
                }, 1500);
            }, 2000);
        } else {
            loginStatusMsg.innerText = "ركزي يا حبيبتي.. الباسورد غلط! ❌";
            loginStatusMsg.className = "status-error";
            loginToast.classList.remove('toast-hidden');
            passwordInput.style.border = "2px solid #ff4d6d";
            setTimeout(() => {
                loginToast.classList.add('toast-hidden');
                passwordInput.style.border = "1px solid rgba(255, 255, 255, 0.3)";
            }, 3000);
        }
    }

    function initSite() {
        animateCounter(547);
        animate();
        
        // Initialize WhatsApp Chat Observer
        if (chatTrigger) {
            observer.observe(chatTrigger);
        }
    }
    let isMusicPlaying = false;
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.querySelector('span').innerText = "تشغيل اللحن";
            musicToggle.querySelector('i').className = 'bx bx-play-circle';
            isMusicPlaying = false;
        } else {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                musicToggle.querySelector('span').innerText = "إيقاف اللحن";
                musicToggle.querySelector('i').className = 'bx bx-pause-circle';
                isMusicPlaying = true;
            }).catch(() => {
                // Handle autoplay block
                const playPromise = bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        musicToggle.classList.add('playing');
                    }).catch(error => {
                        console.log("Playback failed:", error);
                        alert("تفاعل مع الصفحة أولاً لتشغيل الموسيقى!");
                    });
                }
            });
        }
    });

    // 2. Modal Logic
    bigHeart.addEventListener('click', () => {
        secretModal.classList.add('show');
        // Hearts burst
        for(let i=0; i<30; i++) {
            setTimeout(() => hearts.push(new Heart(window.innerWidth/2, window.innerHeight/2, true)), i*30);
        }
    });

    closeModal.addEventListener('click', () => secretModal.classList.remove('show'));
    window.addEventListener('click', (e) => { if(e.target === secretModal) secretModal.classList.remove('show'); });

    // 3. Days Counter
    function animateCounter(target) {
        let startTime = performance.now();
        function update(currentTime) {
            let elapsed = currentTime - startTime;
            let progress = Math.min(elapsed / 2000, 1);
            let val = Math.floor((1 - (1 - progress) * (1 - progress)) * target);
            daysCount.innerText = val;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
    // initSite() is called after login

    // 4. Background Canvas
    const canvas = document.getElementById('heartCanvas');
    const ctx = canvas.getContext('2d');
    let hearts = [];

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize);
    resize();

    class Heart {
        constructor(x, y, isBurst = false) {
            this.x = x || Math.random() * canvas.width;
            this.y = y || canvas.height + 20;
            this.size = Math.random() * 10 + 5;
            this.isBurst = isBurst;
            if (isBurst) {
                const angle = Math.random() * Math.PI * 2;
                const force = Math.random() * 8 + 4;
                this.vX = Math.cos(angle) * force;
                this.vY = Math.sin(angle) * force;
            } else {
                this.vX = (Math.random() * 2 - 1) * 0.3;
                this.vY = -(Math.random() * 2 + 1);
            }
            this.opacity = 1;
        }
        draw() {
            ctx.save(); ctx.globalAlpha = this.opacity; ctx.fillStyle = '#5c1010'; ctx.beginPath();
            const d = this.size;
            ctx.moveTo(this.x, this.y + d / 4);
            ctx.bezierCurveTo(this.x, this.y, this.x - d / 2, this.y, this.x - d / 2, this.y + d / 4);
            ctx.bezierCurveTo(this.x - d / 2, this.y + d / 2, this.x, this.y + d * 3/4, this.x, this.y + d);
            ctx.bezierCurveTo(this.x, this.y + d * 3/4, this.x + d / 2, this.y + d / 2, this.x + d / 2, this.y + d / 4);
            ctx.bezierCurveTo(this.x + d / 2, this.y, this.x, this.y, this.x, this.y + d / 4);
            ctx.fill(); ctx.restore();
        }
        update() {
            this.x += this.vX; this.y += this.vY;
            if (this.isBurst) { this.vY += 0.1; this.opacity -= 0.01; }
            else if (this.y < -20) { this.y = canvas.height + 20; this.x = Math.random() * canvas.width; }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (hearts.length < 30) hearts.push(new Heart());
        hearts = hearts.filter(h => h.opacity > 0);
        hearts.forEach(h => { h.update(); h.draw(); });
        requestAnimationFrame(animate);
    }

    // 5. WhatsApp Chat Animation
    const chatBox = document.getElementById('chat-box');
    const chatTrigger = document.getElementById('chat-trigger');
    const messages = [
        { type: 'sent', text: 'بقولك إيه ياروحي..' },
        { type: 'received', text: 'نعم ياحبيبي؟' },
        { type: 'sent', text: 'أنا بحبك أوي بجد، ومقدرش أتخيل حياتي من غيرك.' },
        { type: 'received', text: 'وأنا كمان بحبك أوي يا محمد، ربنا يخليك ليا.' },
        { type: 'sent', text: 'إن شاء الله هنكمل سوا العمر كله، وتكوني من نصيبي للأبد.' },
        { type: 'received', text: 'يا رب يا حبيبي.. أنا معاك في كل خطوة.' }
    ];

    let chatStarted = false;
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !chatStarted) {
            chatStarted = true;
            startChat();
        }
    }, { threshold: 0.5 });

    async function startChat() {
        for (let msg of messages) {
            await sleep(1500);
            addMessage(msg.type, msg.text);
        }
    }

    function addMessage(type, text) {
        const div = document.createElement('div');
        div.className = `msg ${type}`;
        div.innerText = text;
        chatBox.appendChild(div);
        setTimeout(() => div.classList.add('show'), 50);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    // 7. Cursor Heart Trail
    window.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.9) {
            const heart = document.createElement('div');
            heart.className = 'cursor-heart';
            heart.innerHTML = "<i class='bx bxs-heart'></i>";
            heart.style.left = e.clientX + 'px';
            heart.style.top = e.clientY + 'px';
            heart.style.color = Math.random() > 0.5 ? '#ff4d6d' : '#d4af37';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 1500);
        }
    });

    // 9. Navbar Scroll Effect
    const nav = document.querySelector('.luxury-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
});
