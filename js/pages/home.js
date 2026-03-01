/**
 * 首页逻辑 - Home Page Module
 */

const HomePage = {
    // 当前轮播索引
    currentSlide: 0,
    slideInterval: null,

    // 初始化
    init() {
        this.renderHeroSlider();
        this.renderPopularDramas();
        this.startAutoSlide();
    },

    // 渲染轮播
    renderHeroSlider() {
        const slider = document.getElementById('hero-slider');
        if (!slider) return;

        const items = MockData.heroItems;
        console.log('Hero items:', items);
        
        // 渲染第一个轮播项（多图背景）
        slider.innerHTML = items.map((item, index) => {
            if (index === 0 && item.images) {
                // 第一个轮播项使用多张图片拼贴
                return `
                    <div class="hero-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                        <div class="hero-mosaic">
                            ${item.images.map(img => {
                                console.log('Loading image:', img);
                                return `<img class="mosaic-img" src="${img}" alt="" onerror="console.error('Failed to load:', '${img}')">`;
                            }).join('')}
                        </div>
                        <div class="hero-overlay"></div>
                        <div class="hero-slide-content">
                            <h1 class="hero-title">${item.title}</h1>
                            <div class="hero-meta">
                                <span class="meta-tag">🔄 Daily Updated</span>
                                <span class="meta-tag">📺 Mini-Series</span>
                                <span class="meta-tag">🎬 Free Short Drama Series</span>
                            </div>
                            <p class="hero-desc">${item.desc}</p>
                            <div class="hero-actions">
                                <button class="hero-btn primary" data-drama-id="1" data-focusable="true">
                                    <span>▶</span> Episodes
                                </button>
                                <button class="hero-btn secondary" data-focusable="true">
                                    <span>🎬</span> Trailers
                                </button>
                                <button class="hero-btn secondary" data-focusable="true">
                                    <span>📋</span> More Like This
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="hero-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                        <img class="hero-slide-bg" src="${item.image}" alt="${item.title}" onerror="console.error('Failed to load:', '${item.image}')">
                        <div class="hero-slide-content">
                            <h1 class="hero-title">${item.title}</h1>
                            <div class="hero-meta">
                                <span>${item.year}</span>
                                <span>${item.episodes} Episodes</span>
                                <span>★ ${item.rating}</span>
                            </div>
                            <p class="hero-desc">${item.desc}</p>
                            <button class="hero-btn" data-drama-id="${item.id}">
                                <span>▶</span> Watch Now
                            </button>
                        </div>
                    </div>
                `;
            }
        }).join('');

        // 绑定轮播按钮事件
        slider.querySelectorAll('.hero-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const dramaId = btn.dataset.dramaId;
                if (dramaId) {
                    Router.navigateTo('detail', { dramaId });
                }
            });
            if (!btn.hasAttribute('data-focusable')) {
                btn.setAttribute('data-focusable', 'true');
            }
        });

        // 绑定导航点
        document.querySelectorAll('.hero-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                this.goToSlide(parseInt(dot.dataset.index));
            });
        });
    },

    // 渲染分类
    renderCategories() {
        const grid = document.getElementById('categories-grid');
        if (!grid) return;

        const categories = MockData.categories;
        grid.innerHTML = categories.map(cat => `
            <div class="category-card" data-category="${cat.id}" data-focusable="true">
                <div class="category-icon">${cat.icon}</div>
                <div class="category-name">${cat.name}</div>
            </div>
        `).join('');

        // 绑定点击事件
        grid.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                Router.navigateTo('discover', { category: card.dataset.category });
            });
        });
    },

    // 渲染热门剧集
    renderPopularDramas() {
        const grid = document.getElementById('popular-dramas');
        if (!grid) return;

        const dramas = MockData.getPopularDramas();
        grid.innerHTML = dramas.map(drama => this.createDramaCard(drama)).join('');

        // 绑定点击事件
        grid.querySelectorAll('.home-drama-card').forEach(card => {
            card.addEventListener('click', (e) => {
                Router.navigateTo('detail', { dramaId: card.dataset.dramaId });
            });
        });

        // 绑定按钮事件
        grid.querySelectorAll('.card-actions .action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dramaId = btn.dataset.dramaId;
                if (dramaId) {
                    Router.navigateTo('detail', { dramaId });
                }
            });
            if (!btn.hasAttribute('data-focusable')) {
                btn.setAttribute('data-focusable', 'true');
            }
        });
    },

    // 渲染最新剧集
    renderLatestDramas() {
        const grid = document.getElementById('latest-dramas');
        if (!grid) return;

        const dramas = MockData.getLatestDramas();
        grid.innerHTML = dramas.map(drama => this.createDramaCard(drama)).join('');

        // 绑定点击事件
        grid.querySelectorAll('.home-drama-card').forEach(card => {
            card.addEventListener('click', (e) => {
                Router.navigateTo('detail', { dramaId: card.dataset.dramaId });
            });
        });

        // 绑定按钮事件
        grid.querySelectorAll('.card-actions .action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dramaId = btn.dataset.dramaId;
                if (dramaId) {
                    Router.navigateTo('detail', { dramaId });
                }
            });
            if (!btn.hasAttribute('data-focusable')) {
                btn.setAttribute('data-focusable', 'true');
            }
        });
    },

    // 创建剧集卡片
    createDramaCard(drama) {
        const badge = drama.badge ? `<span class="card-badge ${drama.badge.toLowerCase()}">${drama.badge}</span>` : '';
        const metaInfo = drama.seasons ? `${drama.seasons} Seasons` : `${drama.episodes} Episodes`;
        const category = MockData.categories.find(c => c.id === drama.category);
        const categoryName = category ? category.name : drama.category;

        console.log('Creating card for:', drama.title, 'image:', drama.image);

        return `
            <div class="home-drama-card" data-drama-id="${drama.id}" data-focusable="true">
                <div class="card-poster">
                    <img class="card-image" src="${drama.image}" alt="${drama.title}" onerror="console.error('Card image failed:', '${drama.image}'); this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23333%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2250%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2220%22>No Image</text></svg>'">
                    ${badge}
                </div>
                <div class="card-content">
                    <h3 class="card-title">${drama.title}</h3>
                    <div class="card-meta">
                        <span>${metaInfo}</span>
                        <span>${categoryName}</span>
                    </div>
                    <div class="card-rating">★ ${drama.rating}</div>
                </div>
                <div class="card-actions">
                    <button class="action-btn primary" data-drama-id="${drama.id}">Watch Now</button>
                    <button class="action-btn secondary" data-drama-id="${drama.id}">+</button>
                </div>
            </div>
        `;
    },

    // 切换轮播
    goToSlide(index) {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dot');

        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        slides[index]?.classList.add('active');
        dots[index]?.classList.add('active');

        this.currentSlide = index;
    },

    // 自动轮播
    startAutoSlide() {
        this.slideInterval = setInterval(() => {
            const nextSlide = (this.currentSlide + 1) % MockData.heroItems.length;
            this.goToSlide(nextSlide);
        }, 6000);
    },

    // 停止自动轮播
    stopAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
};

// 导出模块
window.HomePage = HomePage;
