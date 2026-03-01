/**
 * 剧集详情页逻辑 - Detail Page Module
 */

const DetailPage = {
    // 当前剧集
    currentDrama: null,

    // 初始化
    init() {
        this.bindEvents();
    },

    // 加载剧集数据
    loadDrama(dramaId) {
        this.currentDrama = MockData.getDramaById(dramaId);
        if (!this.currentDrama) {
            console.error('Drama not found:', dramaId);
            return;
        }

        this.renderDetail();
        this.renderEpisodes();
        this.renderRelated();
    },

    // 渲染详情
    renderDetail() {
        const drama = this.currentDrama;

        // 背景图
        const backdrop = document.getElementById('detail-backdrop');
        if (backdrop) {
            backdrop.style.backgroundImage = `url(${drama.backdrop})`;
        }

        // 海报
        const poster = document.getElementById('detail-poster');
        if (poster) {
            poster.innerHTML = `<img src="${drama.image}" alt="${drama.title}">`;
        }

        // 标题
        const title = document.getElementById('detail-title');
        if (title) {
            title.textContent = drama.title;
        }

        // 元数据
        const year = document.getElementById('detail-year');
        const episodes = document.getElementById('detail-episodes');
        const rating = document.getElementById('detail-rating');
        const category = document.getElementById('detail-category');

        if (year) year.textContent = drama.year;
        if (episodes) episodes.textContent = `${drama.episodes} Episodes`;
        if (rating) rating.textContent = `★ ${drama.rating}`;
        if (category) category.textContent = drama.category;

        // 描述
        const desc = document.getElementById('detail-desc');
        if (desc) {
            desc.textContent = drama.desc;
        }

        // 更新收藏按钮状态
        this.updateFavoriteBtn();
    },

    // 渲染剧集列表
    renderEpisodes() {
        const grid = document.getElementById('episodes-grid');
        if (!grid || !this.currentDrama) return;

        const episodes = this.currentDrama.episodesList || [];
        grid.innerHTML = episodes.slice(0, 12).map(ep => `
            <div class="episode-card" data-episode-id="${ep.id}" data-drama-id="${this.currentDrama.id}" data-focusable="true">
                <div class="episode-thumb">
                    <img src="${ep.thumbnail}" alt="${ep.title}">
                    <div class="episode-play-icon">▶</div>
                </div>
                <div class="episode-info">
                    <div class="episode-number">Episode ${ep.number}</div>
                    <div class="episode-title">${ep.title}</div>
                    <div class="episode-desc">${ep.desc}</div>
                </div>
            </div>
        `).join('');

        // 绑定点击事件
        grid.querySelectorAll('.episode-card').forEach(card => {
            card.addEventListener('click', () => {
                const dramaId = card.dataset.dramaId;
                const episodeId = card.dataset.episodeId;
                Router.navigateTo('player', { dramaId, episodeId });
            });
        });
    },

    // 渲染相关推荐
    renderRelated() {
        const grid = document.getElementById('related-dramas');
        if (!grid || !this.currentDrama) return;

        // 获取同分类的其他剧集
        const related = MockData.getDramasByCategory(this.currentDrama.category)
            .filter(d => d.id !== this.currentDrama.id)
            .slice(0, 4);

        grid.innerHTML = related.map(drama => `
            <div class="related-drama-card" data-drama-id="${drama.id}" data-focusable="true">
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
        grid.querySelectorAll('.related-drama-card').forEach(card => {
            card.addEventListener('click', () => {
                Router.navigateTo('detail', { dramaId: card.dataset.dramaId });
            });
        });
    },

    // 绑定事件
    bindEvents() {
        // 播放按钮
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (this.currentDrama && this.currentDrama.episodesList?.length > 0) {
                    const firstEpisode = this.currentDrama.episodesList[0];
                    Router.navigateTo('player', {
                        dramaId: this.currentDrama.id,
                        episodeId: firstEpisode.id
                    });
                }
            });
        }

        // 收藏按钮
        const favBtn = document.getElementById('favorite-btn');
        if (favBtn) {
            favBtn.addEventListener('click', () => {
                if (this.currentDrama) {
                    const isFav = MockData.toggleFavorite(this.currentDrama.id);
                    favBtn.classList.toggle('active', isFav);
                    favBtn.querySelector('.btn-text').textContent = isFav ? 'Favorited' : 'Favorite';
                }
            });
        }
    },

    // 更新收藏按钮状态
    updateFavoriteBtn() {
        const favBtn = document.getElementById('favorite-btn');
        if (favBtn && this.currentDrama) {
            const isFav = MockData.isFavorite(this.currentDrama.id);
            favBtn.classList.toggle('active', isFav);
            favBtn.querySelector('.btn-text').textContent = isFav ? 'Favorited' : 'Favorite';
        }
    }
};

// 导出模块
window.DetailPage = DetailPage;
