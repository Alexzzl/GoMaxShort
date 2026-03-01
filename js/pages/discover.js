/**
 * 发现页逻辑 - Discover Page Module
 */

const DiscoverPage = {
    // 当前分类
    currentCategory: 'all',
    // 当前排序
    currentSort: 'popular',

    // 初始化
    init() {
        this.bindEvents();
        this.renderDramas();
    },

    // 绑定事件
    bindEvents() {
        // 分类点击
        const categoryList = document.getElementById('category-list');
        if (categoryList) {
            categoryList.querySelectorAll('.category-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.setCategory(item.dataset.category);
                });
            });
        }

        // 排序点击
        const sortOptions = document.querySelector('.sort-options');
        if (sortOptions) {
            sortOptions.querySelectorAll('.sort-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.setSort(btn.dataset.sort);
                });
            });
        }

        // 搜索
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.search(searchInput.value);
                }
            });
        }
    },

    // 设置分类
    setCategory(category) {
        // 更新UI
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.category === category) {
                item.classList.add('active');
            }
        });

        // 更新标题
        const titleEl = document.getElementById('category-title');
        if (titleEl) {
            const cat = MockData.categories.find(c => c.id === category);
            titleEl.textContent = cat ? cat.name : 'All Dramas';
        }

        this.currentCategory = category;
        this.renderDramas();
    },

    // 设置排序
    setSort(sort) {
        // 更新UI
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.sort === sort) {
                btn.classList.add('active');
            }
        });

        this.currentSort = sort;
        this.renderDramas();
    },

    // 搜索
    search(query) {
        if (!query.trim()) {
            this.renderDramas();
            return;
        }

        const results = MockData.searchDramas(query);
        this.renderDramaList(results);
    },

    // 渲染剧集
    renderDramas() {
        let dramas = MockData.getDramasByCategory(this.currentCategory);

        // 排序
        switch (this.currentSort) {
            case 'popular':
                dramas.sort((a, b) => b.rating - a.rating);
                break;
            case 'latest':
                dramas.sort((a, b) => b.year.localeCompare(a.year));
                break;
            case 'rating':
                dramas.sort((a, b) => b.rating - a.rating);
                break;
        }

        this.renderDramaList(dramas);
    },

    // 渲染剧集列表
    renderDramaList(dramas) {
        const grid = document.getElementById('discover-dramas');
        if (!grid) return;

        grid.innerHTML = dramas.map(drama => `
            <div class="discover-drama-card" data-drama-id="${drama.id}" data-focusable="true">
                <img class="card-image" src="${drama.image}" alt="${drama.title}">
                <div class="card-content">
                    <h3 class="card-title">${drama.title}</h3>
                    <div class="card-meta">
                        <span>${drama.year}</span>
                        <span class="card-rating">★ ${drama.rating}</span>
                    </div>
                </div>
            </div>
        `).join('');

        // 绑定点击事件
        grid.querySelectorAll('.discover-drama-card').forEach(card => {
            card.addEventListener('click', () => {
                Router.navigateTo('detail', { dramaId: card.dataset.dramaId });
            });
        });
    }
};

// 导出模块
window.DiscoverPage = DiscoverPage;
