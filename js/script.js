// ================================
// 页面加载完成后执行
// ================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('欢迎来到我的博客！博客已加载完成。');
    
    // 初始化所有功能
    initSmoothScroll();
    initPostCardAnimation();
    initBackToTop();
    displayWelcomeMessage();
});

// ================================
// 平滑滚动效果
// ================================
function initSmoothScroll() {
    // 为所有锚点链接添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ================================
// 文章卡片动画效果
// ================================
function initPostCardAnimation() {
    const postCards = document.querySelectorAll('.post-card');
    
    postCards.forEach(card => {
        // 鼠标点击效果
        card.addEventListener('click', function(e) {
            // 如果点击的不是链接，则添加动画效果
            if (e.target.tagName !== 'A') {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateX(5px)';
                }, 100);
            }
        });
        
        // 鼠标进入效果
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}

// ================================
// 返回顶部功能
// ================================
function initBackToTop() {
    // 创建返回顶部按钮
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '↑';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: #667eea;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: all 0.3s;
    `;
    
    document.body.appendChild(backToTopButton);
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
    
    // 点击返回顶部
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 鼠标悬停效果
    backToTopButton.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#764ba2';
        this.style.transform = 'scale(1.1)';
    });
    
    backToTopButton.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#667eea';
        this.style.transform = 'scale(1)';
    });
}

// ================================
// 显示欢迎消息
// ================================
function displayWelcomeMessage() {
    // 仅在首页显示
    if (document.querySelector('.hero')) {
        // 获取当前时间
        const hour = new Date().getHours();
        let greeting;
        
        if (hour < 6) {
            greeting = '夜深了，注意休息哦！';
        } else if (hour < 12) {
            greeting = '早上好！';
        } else if (hour < 18) {
            greeting = '下午好！';
        } else {
            greeting = '晚上好！';
        }
        
        console.log(greeting + ' 欢迎来到我的博客！');
    }
}

// ================================
// 统计访问时长
// ================================
let startTime = Date.now();

window.addEventListener('beforeunload', function() {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    console.log(`感谢访问！您在本页停留了 ${duration} 秒`);
});

// ================================
// 阅读进度条（可选功能）
// ================================
function createReadingProgressBar() {
    // 创建进度条元素
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        width: 0%;
        z-index: 9999;
        transition: width 0.3s;
    `;
    document.body.appendChild(progressBar);
    
    // 更新进度
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        
        const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
        progressBar.style.width = scrollPercentage + '%';
    });
}

// 如果是文章页面，启用阅读进度条
if (document.querySelector('.article-content')) {
    createReadingProgressBar();
}

// ================================
// 暗色模式切换（高级功能）
// ================================
function initDarkMode() {
    // 检查用户之前的选择
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
    }
    
    // 创建切换按钮
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = darkModeEnabled ? '☀️' : '🌙';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: #2c3e50;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: all 0.3s;
    `;
    
    document.body.appendChild(darkModeToggle);
    
    // 点击切换
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        this.innerHTML = isDark ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDark);
    });
}

// 暂时注释掉暗色模式，新手可以先不用这个功能
// initDarkMode();

// ================================
// 工具函数
// ================================

// 格式化日期
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
}

// 防抖函数（优化性能）
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数（优化性能）
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

console.log('脚本加载完成！所有功能已就绪。');
