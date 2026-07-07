/* ============================================================
   BLOG ENGINE
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化主题（三页共用）
    initTheme();

    // 2. 判断页面类型
    if (document.getElementById('posts-container')) {
        // 首页：极简淡入开场 + 加载数据
        initIntro();
        initHomePage();
    }
    // 文章页的渲染逻辑走 article.html 自己的内联脚本，这里不处理

    initCommonFeatures();
});

// --- 极简淡入开场（仅首页） ---
function initIntro() {
    const intro = document.getElementById('cinematic-intro');
    if (!intro) return;

    let finished = false;
    function finishIntro() {
        if (finished) return;
        finished = true;
        document.body.classList.remove('intro-active');
        document.body.classList.add('intro-finished');
    }

    // 系统开启"减少动态效果"时直接进入内容（CSS 已隐藏遮罩，这里同步状态）
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        finishIntro();
        return;
    }

    // 时序：名字 1.2s 淡入 → 停 0.4s → 遮罩 0.8s 淡出（CSS transition），总时长 < 2.5s
    setTimeout(finishIntro, 1600);

    const skipBtn = document.getElementById('enter-site-btn');
    if (skipBtn) skipBtn.addEventListener('click', finishIntro);
}

// --- 主题切换（localStorage 记忆） ---
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeBtn) themeBtn.innerText = '☀️';
    }
    if (!themeBtn) return;
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
        container.innerHTML = '<p style="color:var(--text-muted);">加载失败，请检查 posts.json 是否存在。</p>';
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
                <span>${post.date}</span>
                <span class="read-more-text">阅读全文</span>
            </div>
        `;
        container.appendChild(card);
    });
}

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
