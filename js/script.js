/* ============================================================
   BLOG ENGINE - CINEMATIC EDITION
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化主题
    initTheme();

    // 2. 判断页面类型
    if (document.getElementById('posts-container')) {
        // 如果是首页，启动电影级开场
        initCinematicIntro();
        // 同时静默加载数据
        initHomePage();
    } else if (document.getElementById('article-content')) {
        // 如果是文章页，直接显示内容（不播放开场）
        document.body.classList.add('intro-finished');
        initArticlePage();
    }
    
    initCommonFeatures();
});

// --- 电影级开场动画引擎 (Apple Style) ---
function initCinematicIntro() {
    const canvas = document.getElementById('intro-canvas');
    if (!canvas) return; // 保护性检查

    const ctx = canvas.getContext('2d');
    const DURATION = 8500; // 动画时长 8.5s
    let startTime = null;
    let animationFrameId;
    let isIntroFinished = false;
    
    // 状态
    let state = { width: 0, height: 0, progress: 0, stars: [] };

    // 初始化尺寸
    function resize() {
        state.width = window.innerWidth;
        state.height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = state.width * dpr;
        canvas.height = state.height * dpr;
        ctx.scale(dpr, dpr);
        initStars();
    }

    // 初始化背景粒子
    function initStars() {
        state.stars = Array.from({length: 80}, () => ({
            x: (Math.random() - 0.5) * state.width * 2,
            y: (Math.random() - 0.5) * state.height * 2,
            z: Math.random() * 2 + 0.5,
            size: Math.random() * 1.5
        }));
    }

    // 动画结束处理
    function finishIntro() {
        if (isIntroFinished) return;
        isIntroFinished = true;
        cancelAnimationFrame(animationFrameId);
        
        // CSS 状态切换
        document.body.classList.remove('intro-active');
        document.body.classList.add('intro-finished');
        
        // 确保主界面可见（防抖）
        setTimeout(() => {
            const introLayer = document.getElementById('cinematic-intro');
            if(introLayer) introLayer.style.display = 'none';
        }, 1500);
    }

    // 核心绘制循环
    function loop(timestamp) {
        if (isIntroFinished) return;
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        state.progress = Math.min(elapsed / DURATION, 1);

        // 绘制
        drawScene(ctx, state);
        updateCaptions(state.progress);

        if (state.progress < 1) {
            animationFrameId = requestAnimationFrame(loop);
        } else {
            finishIntro();
        }
    }

    // 绘制场景
    function drawScene(ctx, state) {
        // 清空背景
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, state.width, state.height);
        
        const cx = state.width / 2;
        const cy = state.height / 2;
        const p = state.progress;

        // 1. 星空背景
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        state.stars.forEach(star => {
            const scale = 1 + p * 0.8; // 前进感
            const x = cx + star.x * scale / star.z;
            const y = cy + star.y * scale / star.z;
            ctx.beginPath();
            ctx.arc(x, y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // 2. 主体变形逻辑
        const baseSize = Math.min(state.width, state.height) * 0.35;
        ctx.save();
        ctx.translate(cx, cy);

        // 阶段 1: 能量 (0% - 35%)
        if (p < 0.35) {
            const localP = p / 0.35;
            drawGlowingOrb(ctx, baseSize, localP);
        } 
        // 阶段 2: 架构 (35% - 65%)
        else if (p < 0.65) {
            const localP = (p - 0.35) / 0.3;
            drawMorphingStack(ctx, baseSize, localP);
        } 
        // 阶段 3: 芯片 (65% - 100%)
        else {
            const localP = (p - 0.65) / 0.35;
            const easeP = 1 - Math.pow(1 - localP, 3); // EaseOut
            const scale = 1 + (1-easeP) * 0.3; 
            ctx.scale(scale, scale);
            drawFinalChip(ctx, baseSize, easeP);
        }
        ctx.restore();
    }

    // --- 绘图组件 ---
    
    function drawGlowingOrb(ctx, size, t) {
        ctx.rotate(t * Math.PI);
        const g = ctx.createLinearGradient(-size, -size, size, size);
        g.addColorStop(0, '#2997ff'); g.addColorStop(1, '#ff375f');
        
        ctx.shadowBlur = 40 + Math.sin(t*10)*15;
        ctx.shadowColor = '#bf5af2';
        ctx.fillStyle = g;
        
        ctx.beginPath();
        // 从圆变为圆角矩形
        const r = size/2; 
        ctx.roundRect(-size/2, -size/2, size, size, r);
        ctx.fill();
    }

    function drawMorphingStack(ctx, size, t) {
        // 缓动
        const easeT = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const radius = size/2 - (size/2 - 40) * easeT; // 半径变小
        const split = Math.sin(t * Math.PI) * 60; // 分裂距离
        
        ctx.rotate(t * Math.PI * 0.2); // 微微旋转

        [-1, 0, 1].forEach(i => {
            ctx.fillStyle = i === 0 ? '#111' : 'rgba(255,255,255,0.05)';
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 1;
            
            if(i===0) { ctx.shadowBlur=30; ctx.shadowColor='rgba(41,151,255,0.4)'; }
            else ctx.shadowBlur=0;
            
            ctx.beginPath();
            ctx.roundRect(-size/2, -size/2 + i*split, size, size, radius);
            ctx.fill(); ctx.stroke();
        });
    }

    function drawFinalChip(ctx, size, t) {
        // 金属质感
        const g = ctx.createLinearGradient(-size, -size, size, size);
        g.addColorStop(0, '#222'); g.addColorStop(0.5, '#444'); g.addColorStop(1, '#111');
        ctx.fillStyle = g;
        ctx.shadowBlur = 60 * t; ctx.shadowColor = 'rgba(255,255,255,0.15)';
        
        ctx.beginPath(); ctx.roundRect(-size/2, -size/2, size, size, 30); ctx.fill();
        ctx.strokeStyle = '#666'; ctx.lineWidth = 2; ctx.stroke();

        // 绘制 LOGO: DZ
        if (t > 0.5) {
            ctx.globalAlpha = (t - 0.5) * 2;
            ctx.fillStyle = '#fff';
            // 简单的像素化绘制文字模拟
            ctx.font = `bold ${size*0.3}px -apple-system, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowBlur = 10; ctx.shadowColor = '#fff';
            ctx.fillText('DZ', 0, 0); // 端木子宸
            ctx.globalAlpha = 1;
        }

        // 扫光 (Sheen)
        const sheenPos = (Date.now() % 2000) / 2000 * (size * 3) - size * 1.5;
        ctx.save();
        ctx.beginPath(); ctx.roundRect(-size/2, -size/2, size, size, 30); ctx.clip();
        ctx.beginPath();
        ctx.moveTo(sheenPos, -size/2); ctx.lineTo(sheenPos+50, -size/2);
        ctx.lineTo(sheenPos-20, size/2); ctx.lineTo(sheenPos-70, size/2);
        ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fill();
        ctx.restore();
    }

    // 字幕控制
    function updateCaptions(p) {
        const captions = document.querySelectorAll('.intro-caption');
        captions.forEach(el => {
            const start = parseFloat(el.dataset.start);
            const end = parseFloat(el.dataset.end);
            if (p >= start && p <= end) {
                el.classList.add('active'); el.classList.remove('exit');
            } else if (p > end && p < end + 0.1) {
                el.classList.remove('active'); el.classList.add('exit');
            } else {
                el.classList.remove('active'); el.classList.remove('exit');
            }
        });
    }

    // 启动
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(loop);
    
    // 绑定跳过按钮
    const skipBtn = document.getElementById('enter-site-btn');
    if(skipBtn) skipBtn.addEventListener('click', finishIntro);
}

// --- 以下是你原有的逻辑，保持不变 ---

function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    if(!themeBtn) return;
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.innerText = '☀️';
    }
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.innerText = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

async function initHomePage() {
    const container = document.getElementById('posts-container');
    const postCountEl = document.getElementById('post-count');
    if(!container) return;

    try {
        const response = await fetch('posts.json');
        const posts = await response.json();
        
        if(postCountEl) postCountEl.innerText = posts.length;
        renderPosts(posts);
        
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.dataset.category;
                const filteredPosts = category === 'all' ? posts : posts.filter(p => p.category === category);
                renderPosts(filteredPosts);
            });
        });
    } catch (error) {
        console.error('加载文章列表失败:', error);
        // 如果是演示模式，可以加载伪数据，这里保留原样
        container.innerHTML = '<p style="color:#888;">正在加载文章...</p>';
    }
}

function renderPosts(posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';
    if (posts.length === 0) {
        container.innerHTML = '<p>暂无文章。</p>';
        return;
    }
    posts.forEach(post => {
        const card = document.createElement('a');
        card.href = `article.html?id=${post.id}`;
        card.className = 'post-card';
        card.innerHTML = `
            <span class="post-category">${post.category}</span>
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="post-card-footer">
                <span>${new Date(post.date).toLocaleDateString()}</span>
                <span class="read-more-text">阅读全文</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// initArticlePage 和 initCommonFeatures 与你之前代码保持一致，这里不重复列出占用篇幅，但你需要保留它们。
function initCommonFeatures() {
    const backToTop = document.getElementById('back-to-top');
    if(!backToTop) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) backToTop.style.display = 'flex';
        else backToTop.style.display = 'none';
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
// 记得保留 initArticlePage 函数...