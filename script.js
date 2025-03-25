document.addEventListener('DOMContentLoaded', () => {
    // スキルバーのアニメーション
    animateSkillBars();
    
    // スクロールアニメーション
    initScrollAnimation();
    
    // コンタクトフォームは削除したので初期化関数も呼び出さない
    
    // ナビゲーションリンクのスムーススクロール
    initSmoothScroll();
    
    // パーティクルエフェクト
    initParticles();
    
    // タイピングエフェクト
    initTypingEffect();
});

// スキルバーのアニメーション
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        
        // スクロール時にアニメーションさせる
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        bar.style.width = `${level}%`;
                    }, 200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(bar);
    });
}

// スクロールアニメーション
function initScrollAnimation() {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => {
        section.classList.add('section-hidden');
        observer.observe(section);
    });
    
    // CSSに追加するスタイル
    const style = document.createElement('style');
    style.textContent = `
        .section-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .section-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// コンタクトフォーム機能は削除

// ナビゲーションリンクのスムーススクロール
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            
            // ハッシュからターゲット要素を取得
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // スムーズにスクロール
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // ヘッダーの高さ分調整
                    behavior: 'smooth'
                });
                
                // アクティブクラスをトグル
                navLinks.forEach(item => item.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // スクロール位置に基づいてアクティブなナビゲーションリンクを更新
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('.section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const currentId = '#' + section.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === currentId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // CSSに追加するスタイル
    const style = document.createElement('style');
    style.textContent = `
        .nav-links a.active {
            color: var(--neon-pink);
            text-shadow: 0 0 8px var(--neon-pink);
        }
        
        .nav-links a.active::before {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
}

// パーティクルエフェクト
function initParticles() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // キャンバスをページの背景として配置
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);
    
    // キャンバスサイズをウィンドウに合わせる
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // パーティクル設定
    const particles = [];
    const neonColors = [
        'rgba(255, 0, 255, 0.7)',  // ネオンピンク
        'rgba(0, 242, 255, 0.7)',   // ネオンブルー
        'rgba(57, 255, 20, 0.7)',   // ネオングリーン
        'rgba(188, 19, 254, 0.7)',  // ネオンパープル
        'rgba(255, 255, 0, 0.7)'    // ネオンイエロー
    ];
    
    // パーティクルクラス
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = neonColors[Math.floor(Math.random() * neonColors.length)];
            this.opacity = Math.random() * 0.5 + 0.2;
            this.blurSize = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // 画面外に出たらリセット
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = this.blurSize;
            ctx.shadowColor = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
    }
    
    // パーティクルを作成
    function createParticles() {
        const particleCount = Math.min(100, Math.floor(window.innerWidth / 15));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    createParticles();
    
    // アニメーションループ
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// タイピングエフェクト
function initTypingEffect() {
    const titles = document.querySelectorAll('.section-title');
    
    titles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let i = 0;
                    const interval = setInterval(() => {
                        if (i < text.length) {
                            title.textContent += text.charAt(i);
                            i++;
                        } else {
                            clearInterval(interval);
                        }
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(title);
    });
}