/**
 * 主应用入口 - Main App Entry
 */

const App = {
    // 初始化
    init() {
        console.log('GoMax Short App initializing...');

        // 初始化加载动画
        this.initLoading();

        // 初始化遥控器
        Remote.init();

        // 初始化路由
        Router.init();

        // 初始化页面
        this.initPages();

        // 监听页面变化
        this.bindPageChange();

        console.log('GoMax Short App initialized');
    },

    // 初始化加载动画
    initLoading() {
        const loadingPage = document.getElementById('loading-page');

        // 模拟加载
        setTimeout(() => {
            if (loadingPage) {
                loadingPage.classList.add('hidden');
                loadingPage.style.display = 'none';
                console.log('Loading page hidden');
            }
        }, 1000);
    },

    // 初始化页面
    initPages() {
        HomePage.init();
        DiscoverPage.init();
        DetailPage.init();
        PlayerPage.init();
    },

    // 绑定页面变化事件
    bindPageChange() {
        document.addEventListener('page-change', (e) => {
            const { page, params } = e.detail;
            this.onPageChange(page, params);
        });
    },

    // 页面变化处理
    onPageChange(page, params) {
        console.log('Page changed:', page, params);

        switch (page) {
            case 'home':
                // 首页逻辑
                break;

            case 'discover':
                // 发现页逻辑
                if (params?.category) {
                    DiscoverPage.setCategory(params.category);
                }
                break;

            case 'detail':
                // 详情页逻辑
                if (params?.dramaId) {
                    DetailPage.loadDrama(params.dramaId);
                }
                break;

            case 'player':
                // 播放页逻辑
                if (params?.dramaId && params?.episodeId) {
                    PlayerPage.loadEpisode(params.dramaId, params.episodeId);
                }
                break;

            case 'history':
                // 历史记录页
                this.renderHistory();
                break;

            case 'settings':
                // 设置页
                break;
        }
    },

    // 渲染历史记录
    renderHistory() {
        const grid = document.getElementById('history-dramas');
        if (!grid) return;

        const history = MockData.getHistoryWithDetails();

        if (history.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px;">
                    <p style="color: var(--text-muted); font-size: 18px;">No watch history yet</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = history.map(h => {
            if (!h.drama) return '';
            return `
                <div class="home-drama-card" data-drama-id="${h.drama.id}" data-focusable="true">
                    <img class="card-image" src="${h.drama.image}" alt="${h.drama.title}">
                    <div class="card-content">
                        <h3 class="card-title">${h.drama.title}</h3>
                        <div class="card-meta">
                            <span>Ep ${h.episode?.number || '-'}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // 绑定点击事件
        grid.querySelectorAll('.home-drama-card').forEach(card => {
            card.addEventListener('click', () => {
                Router.navigateTo('detail', { dramaId: card.dataset.dramaId });
            });
        });
    }
};

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
