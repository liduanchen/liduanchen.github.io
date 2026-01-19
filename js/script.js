/* ============================================================
   BLOG ENGINE - DYNAMIC LOADING & RENDERING
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // 根据页面类型执行初始化
    if (document.getElementById('posts-container')) {
        initIntroScreen();
        initHomePage();
    } else if (document.getElementById('article-content')) {
        initArticlePage();
    }
    
    initCommonFeatures();
});

// --- 主题切换 ---
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
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

// --- 首页启动引导 ---
function initIntroScreen() {
    const intro = document.getElementById('intro-screen');
    const enterBtn = document.getElementById('enter-site');
    const main = document.getElementById('main-content');
    if (!intro || !main) return;

    let entered = false;
    document.body.classList.add('intro-open');

    const enterSite = () => {
        if (entered) return;
        entered = true;
        intro.classList.add('intro-hidden');
        document.body.classList.remove('intro-open');
        document.body.classList.add('intro-ready');
        setTimeout(() => {
            intro.style.display = 'none';
        }, 600);
    };

    enterBtn?.addEventListener('click', enterSite);
    intro.addEventListener('wheel', enterSite, { once: true });
    intro.addEventListener('touchmove', enterSite, { once: true });
    intro.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') enterSite();
    });
    intro.addEventListener('click', enterSite);
}

// --- 首页逻辑 ---
async function initHomePage() {
    const container = document.getElementById('posts-container');
    const postCountEl = document.getElementById('post-count');
    
    try {
        const response = await fetch('posts.json');
        const posts = await response.json();
        
        postCountEl.innerText = posts.length;
        
        // 渲染文章卡片
        renderPosts(posts);
        
        // 初始化分类过滤
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.dataset.category;
                const filteredPosts = category === 'all' 
                    ? posts 
                    : posts.filter(p => p.category === category);
                
                renderPosts(filteredPosts);
            });
        });
        
    } catch (error) {
        console.error('加载文章列表失败:', error);
        container.innerHTML = '<p>暂时无法加载文章，请稍后再试。</p>';
    }
}

function renderPosts(posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';
    
    if (posts.length === 0) {
        container.innerHTML = '<p>该分类下暂无文章。</p>';
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
                <span>${formatDate(post.date)}</span>
                <span class="read-more-text">阅读全文</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- 文章页逻辑 ---
async function initArticlePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId) {
        window.location.href = 'index.html';
        return;
    }
    
    try {
        // 加载文章元数据
        const postsRes = await fetch('posts.json');
        const posts = await postsRes.json();
        const postMeta = posts.find(p => p.id === postId);
        
        if (!postMeta) {
            throw new Error('找不到该文章');
        }
        
        // 更新 UI 元数据
        document.title = `${postMeta.title} | MySpace`;
        document.getElementById('article-title').innerText = postMeta.title;
        document.getElementById('article-title').classList.remove('article-title-loading');
        document.getElementById('article-date').innerText = formatDate(postMeta.date);
        document.getElementById('article-category').innerText = postMeta.category;
        document.getElementById('breadcrumb-category').innerText = postMeta.category;
        
        // 加载 Markdown 内容
        const mdRes = await fetch(`posts/${postMeta.filename}`);
        const markdown = await mdRes.text();
        
        // 渲染 Markdown
        const contentEl = document.getElementById('article-content');
        contentEl.innerHTML = marked.parse(markdown);
        
        // 计算阅读时间
        const wordCount = markdown.length;
        const readingTime = Math.ceil(wordCount / 400);
        document.getElementById('article-reading-time').innerText = `阅读约 ${readingTime} 分钟`;
        
        // 代码高亮
        if (typeof hljs !== 'undefined') {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
        
    } catch (error) {
        console.error('渲染文章失败:', error);
        document.getElementById('article-content').innerHTML = `
            <div style="text-align: center; padding: 4rem 0;">
                <h2>抱歉，找不到该文章</h2>
                <p>${error.message}</p>
                <a href="index.html" class="back-link" style="margin-top: 2rem; display: inline-block;">返回首页</a>
            </div>
        `;
    }
}

// --- 通用功能 ---
function initCommonFeatures() {
    // 返回顶部
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('zh-CN', options);
}
