
/**
 * 分类页面逻辑 - Settings/Categories Page Module
 */
const SettingsPage = {
    // 初始化
    init() {
        this.renderCategories();
        this.bindEvents();
    },

    // 绑定事件
    bindEvents() {
        // 在这里为分类卡片绑定点击事件（如果需要）
        // 例如：点击分类后跳转到该分类下的剧集列表
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryId = card.dataset.categoryId;
                console.log(`Category ${categoryId} clicked`);
                // Router.navigateTo('discover', { category: categoryId });
            });
        });
    },

    // 渲染分类网格
    renderCategories() {
        const container = document.getElementById('settings-page');
        if (!container) return;

        const categories = MockData.categories;
        const html = `
            <div class="settings-container">
                <h1 class="settings-title">Browse by Category</h1>
                <div class="category-grid-container" id="settings-categories">
                    ${categories.map(category => {
            const dramasInCategory = MockData.getDramasByCategory(category.id);
            let imageUrl = 'assets/CodeBubbyAssets/3052_654/2.png'; // Fallback image
            if (dramasInCategory && dramasInCategory.length > 0) {
                const randomDrama = dramasInCategory[Math.floor(Math.random() * dramasInCategory.length)];
                imageUrl = randomDrama.image;
            }
            return this.createCategoryCard(category, imageUrl);
        }).join('')}
                </div>
            </div>
        `;
        container.innerHTML = html;

        // 重新绑定事件，因为内容是动态生成的
        this.bindEvents();
    },

    // 创建单个分类卡片
    createCategoryCard(category, imageUrl) {
        return `
            <div class="category-card" data-category-id="${category.id}" data-focusable="true">
                <img src="${imageUrl}" alt="${category.name}" class="category-card-thumbnail">
                <div class="category-card-overlay"></div>
                <h3 class="category-card-name">${category.name}</h3>
            </div>
        `;
    }
};
