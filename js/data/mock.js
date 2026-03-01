/**
 * 模拟数据 - Mock Data
 * 短剧应用模拟数据
 */

// 辅助函数：生成剧集列表
function generateEpisodes(count, dramaId) {
    const episodes = [];
    for (let i = 1; i <= count; i++) {
        episodes.push({
            id: `${dramaId}-${i}`,
            dramaId: dramaId,
            number: i,
            title: `Episode ${i}`,
            desc: `Watch episode ${i} of this exciting series.`,
            // 使用示例视频源
            videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
            thumbnail: `assets/CodeBubbyAssets/3052_654/${((dramaId % 8) + 2)}.png`,
            duration: `${Math.floor(Math.random() * 20) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        });
    }
    return episodes;
}

const MockData = {
    // 分类数据
    categories: [
        { id: 'romance', name: 'Romance', icon: '💕' },
        { id: 'drama', name: 'Drama', icon: '🎭' },
        { id: 'comedy', name: 'Comedy', icon: '😂' },
        { id: 'action', name: 'Action', icon: '⚡' },
        { id: 'thriller', name: 'Thriller', icon: '🔪' },
        { id: 'sci-fi', name: 'Sci-Fi', icon: '🚀' }
    ],

    // 轮播数据 - 使用多张背景图
    heroItems: [
        {
            id: 1,
            title: 'Free Short Drama Series, Anytime, Anywhere!',
            desc: 'Watch quick, addictive, and easy-to-watch short drama episodes completely free',
            year: '2024',
            episodes: 24,
            rating: 9.2,
            category: 'romance',
            images: [
                'assets/CodeBubbyAssets/3052_414/2.png',
                'assets/CodeBubbyAssets/3052_414/3.png',
                'assets/CodeBubbyAssets/3052_414/4.png',
                'assets/CodeBubbyAssets/3052_414/5.png',
                'assets/CodeBubbyAssets/3052_414/6.png'
            ],
            backdrop: 'assets/CodeBubbyAssets/3052_414/2.png'
        },
        {
            id: 2,
            title: 'The CEO\'s Secret',
            desc: 'A powerful CEO falls for his innocent assistant. What secrets lie behind their romance?',
            year: '2024',
            episodes: 20,
            rating: 9.5,
            category: 'romance',
            image: 'assets/CodeBubbyAssets/3052_414/7.png',
            backdrop: 'assets/CodeBubbyAssets/3052_414/7.png'
        },
        {
            id: 3,
            title: 'Ultimate Warrior',
            desc: 'A martial arts genius rises from nothing to become the ultimate warrior.',
            year: '2024',
            episodes: 30,
            rating: 9.0,
            category: 'action',
            image: 'assets/CodeBubbyAssets/3052_414/8.png',
            backdrop: 'assets/CodeBubbyAssets/3052_414/8.png'
        }
    ],

    // 剧集数据
    dramas: [
        {
            id: 1,
            title: 'IF ONLY YOU WERE MINE',
            year: '2024',
            episodes: 24,
            rating: 9.2,
            category: 'romance',
            seasons: 2,
            image: 'assets/CodeBubbyAssets/3052_654/2.png',
            backdrop: 'assets/CodeBubbyAssets/3052_654/2.png',
            badge: 'TRENDING',
            desc: 'A romantic story of two strangers who meet in the big city and find true love. Despite all the challenges, they fight for their love and eventually find happiness together.',
            episodesList: generateEpisodes(24, 1)
        },
        {
            id: 2,
            title: 'BLOOD CONTRACT',
            year: '2024',
            episodes: 20,
            rating: 9.5,
            category: 'fantasy',
            seasons: 1,
            image: 'assets/CodeBubbyAssets/3052_654/3.png',
            backdrop: 'assets/CodeBubbyAssets/3052_654/3.png',
            badge: 'NEW',
            desc: 'A powerful CEO falls for his innocent assistant. What secrets lie behind their romance? This drama explores themes of love, betrayal, and redemption.',
            episodesList: generateEpisodes(20, 2)
        },
        {
            id: 3,
            title: 'TIED BY FATE',
            year: '2024',
            episodes: 30,
            rating: 9.3,
            category: 'romance',
            seasons: 1,
            image: 'assets/CodeBubbyAssets/3052_654/4.png',
            backdrop: 'assets/CodeBubbyAssets/3052_654/4.png',
            badge: 'POPULAR',
            desc: 'A martial arts genius rises from nothing to become the ultimate warrior. Watch his journey through hardship and triumph.',
            episodesList: generateEpisodes(30, 3)
        },
        {
            id: 4,
            title: 'FORBIDDEN LOVE',
            year: '2024',
            episodes: 18,
            rating: 8.8,
            category: 'thriller',
            seasons: 1,
            image: 'assets/CodeBubbyAssets/3052_654/5.png',
            backdrop: 'assets/CodeBubbyAssets/3052_654/5.png',
            badge: 'HOT',
            desc: 'A group of strangers wake up in a mysterious manor with no escape. Dark secrets lurk in every corner.',
            episodesList: generateEpisodes(18, 4)
        },
        {
            id: 5,
            title: 'Comedy Night',
            year: '2024',
            episodes: 12,
            rating: 8.5,
            category: 'comedy',
            seasons: 1,
            image: 'assets/CodeBubbyAssets/3052_654/6.png',
            backdrop: 'assets/CodeBubbyAssets/3052_654/6.png',
            badge: '',
            desc: 'A hilarious comedy series about a family running a small restaurant. Laugh along with their daily adventures.',
            episodesList: generateEpisodes(12, 5)
        },
        {
            id: 6,
            title: 'Star Crossed Lovers',
            year: '2023',
            episodes: 22,
            rating: 9.3,
            category: 'romance',
            seasons: 1,
            image: 'assets/CodeBubbyAssets/3052_654/7.png',
            backdrop: 'assets/CodeBubbyAssets/3052_654/7.png',
            badge: '',
            desc: 'Two lovers from rival families fight against fate to be together. A classic tale of love and sacrifice.',
            episodesList: generateEpisodes(22, 6)
        },
        {
            id: 7,
            title: 'Sci-Fi Odyssey',
            year: '2024',
            episodes: 18,
            rating: 9.1,
            category: 'sci-fi',
            seasons: 1,
            image: 'assets/CodeBubbyAssets/3052_654/8.png',
            backdrop: 'assets/CodeBubbyAssets/3052_654/8.png',
            badge: '',
            desc: 'In the year 3024, humanity ventures into space. A team of explorers discovers a new world with unexpected dangers.',
            episodesList: generateEpisodes(18, 7)
        },
        {
            id: 8,
            title: 'The Detective',
            year: '2024',
            episodes: 25,
            rating: 9.4,
            category: 'drama',
            seasons: 1,
            image: 'assets/CodeBubbyAssets/3052_654/9.png',
            backdrop: 'assets/CodeBubbyAssets/3052_654/9.png',
            badge: '',
            desc: 'A brilliant detective solves the most challenging cases in the city. Each episode brings a new mystery.',
            episodesList: generateEpisodes(25, 8)
        }
    ],

    // 获取热门剧集
    getPopularDramas() {
        return [...this.dramas].sort((a, b) => b.rating - a.rating).slice(0, 6);
    },

    // 获取最新剧集
    getLatestDramas() {
        return [...this.dramas].sort((a, b) => b.year - a.year).slice(0, 6);
    },

    // 获取分类剧集
    getDramasByCategory(category) {
        if (category === 'all') return this.dramas;
        return this.dramas.filter(d => d.category === category);
    },

    // 获取剧集详情
    getDramaById(id) {
        return this.dramas.find(d => d.id === parseInt(id));
    },

    // 搜索剧集
    searchDramas(query) {
        const q = query.toLowerCase();
        return this.dramas.filter(d =>
            d.title.toLowerCase().includes(q) ||
            d.category.toLowerCase().includes(q)
        );
    },

    // 历史记录
    watchHistory: [],

    // 添加到历史记录
    addToHistory(dramaId, episodeId) {
        const existing = this.watchHistory.find(h => h.dramaId === dramaId && h.episodeId === episodeId);
        if (existing) {
            existing.timestamp = Date.now();
        } else {
            this.watchHistory.unshift({
                dramaId,
                episodeId,
                timestamp: Date.now()
            });
        }
        // 保持最多20条记录
        if (this.watchHistory.length > 20) {
            this.watchHistory.pop();
        }
    },

    // 获取历史记录详情
    getHistoryWithDetails() {
        return this.watchHistory.map(h => {
            const drama = this.getDramaById(h.dramaId);
            const episode = drama?.episodesList?.find(e => e.id === h.episodeId);
            return {
                ...h,
                drama,
                episode
            };
        });
    },

    // 收藏
    favorites: [],

    // 切换收藏
    toggleFavorite(dramaId) {
        const index = this.favorites.indexOf(dramaId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(dramaId);
        }
        return this.favorites.includes(dramaId);
    },

    // 检查是否收藏
    isFavorite(dramaId) {
        return this.favorites.includes(dramaId);
    }
};

// 导出数据
window.MockData = MockData;
