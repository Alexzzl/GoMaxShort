/**
 * 播放页逻辑 - Player Page Module
 */

const PlayerPage = {
    // 当前剧集
    currentDrama: null,
    currentEpisode: null,

    // 初始化
    init() {
        this.bindEvents();
    },

    // 加载播放数据
    loadEpisode(dramaId, episodeId) {
        this.currentDrama = MockData.getDramaById(dramaId);
        if (!this.currentDrama) {
            console.error('Drama not found:', dramaId);
            return;
        }

        this.currentEpisode = this.currentDrama.episodesList?.find(e => e.id === episodeId);
        if (!this.currentEpisode) {
            console.error('Episode not found:', episodeId);
            return;
        }

        // 添加到历史记录
        MockData.addToHistory(dramaId, episodeId);

        this.renderPlayer();
        this.renderEpisodeList();
    },

    // 渲染播放器
    renderPlayer() {
        const video = document.getElementById('video-player');
        if (!video || !this.currentEpisode) return;

        // 设置视频源
        video.src = this.currentEpisode.videoUrl;
        video.poster = this.currentEpisode.thumbnail;

        // 标题
        const currentEpEl = document.getElementById('current-episode');
        const titleEl = document.getElementById('episode-title');
        if (currentEpEl) currentEpEl.textContent = `Ep ${this.currentEpisode.number}`;
        if (titleEl) titleEl.textContent = this.currentEpisode.title;

        // 自动播放
        video.play().catch(e => console.log('Auto play blocked:', e));
    },

    // 渲染剧集列表
    renderEpisodeList() {
        const list = document.getElementById('player-episodes');
        if (!list || !this.currentDrama) return;

        const episodes = this.currentDrama.episodesList || [];
        list.innerHTML = episodes.map(ep => `
            <li class="player-episode-item ${ep.id === this.currentEpisode?.id ? 'active' : ''}"
                data-episode-id="${ep.id}"
                data-drama-id="${this.currentDrama.id}"
                data-focusable="true">
                <div class="episode-thumb">
                    <img src="${ep.thumbnail}" alt="${ep.title}">
                </div>
                <div class="episode-info">
                    <div class="episode-number">Episode ${ep.number}</div>
                    <div class="episode-title">${ep.title}</div>
                </div>
            </li>
        `).join('');

        // 绑定点击事件
        list.querySelectorAll('.player-episode-item').forEach(item => {
            item.addEventListener('click', () => {
                const dramaId = item.dataset.dramaId;
                const episodeId = item.dataset.episodeId;
                this.loadEpisode(dramaId, episodeId);
            });
        });
    },

    // 绑定事件
    bindEvents() {
        // 播放/暂停
        const playPauseBtn = document.getElementById('play-pause');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }

        // 上一集
        const prevBtn = document.getElementById('prev-episode');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.playPrevEpisode();
            });
        }

        // 下一集
        const nextBtn = document.getElementById('next-episode');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.playNextEpisode();
            });
        }

        // 快退
        const rewindBtn = document.getElementById('rewind-btn');
        if (rewindBtn) {
            rewindBtn.addEventListener('click', () => {
                this.rewind(10);
            });
        }

        // 快进
        const forwardBtn = document.getElementById('forward-btn');
        if (forwardBtn) {
            forwardBtn.addEventListener('click', () => {
                this.forward(10);
            });
        }

        // 音量
        const volumeBtn = document.getElementById('volume-btn');
        if (volumeBtn) {
            volumeBtn.addEventListener('click', () => {
                this.toggleMute();
            });
        }

        // 视频事件
        const video = document.getElementById('video-player');
        if (video) {
            video.addEventListener('ended', () => {
                this.onEpisodeEnded();
            });

            video.addEventListener('play', () => {
                if (playPauseBtn) playPauseBtn.textContent = '⏸';
            });

            video.addEventListener('pause', () => {
                if (playPauseBtn) playPauseBtn.textContent = '▶';
            });
        }

        // 遥控器事件
        document.addEventListener('remote-key', (e) => {
            if (Router.getCurrentPage() !== 'player') return;

            switch (e.detail.keyCode) {
                case Remote.KEYS.PLAY:
                case Remote.KEYS.PAUSE:
                    this.togglePlayPause();
                    break;
                case Remote.KEYS.FAST_FORWARD:
                    this.forward(10);
                    break;
                case Remote.KEYS.REWIND:
                    this.rewind(10);
                    break;
            }
        });
    },

    // 播放/暂停
    togglePlayPause() {
        const video = document.getElementById('video-player');
        if (!video) return;

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    },

    // 播放上一集
    playPrevEpisode() {
        if (!this.currentEpisode || !this.currentDrama) return;

        const episodes = this.currentDrama.episodesList || [];
        const currentIndex = episodes.findIndex(e => e.id === this.currentEpisode.id);

        if (currentIndex > 0) {
            const prevEpisode = episodes[currentIndex - 1];
            this.loadEpisode(this.currentDrama.id, prevEpisode.id);
        }
    },

    // 播放下一集
    playNextEpisode() {
        if (!this.currentEpisode || !this.currentDrama) return;

        const episodes = this.currentDrama.episodesList || [];
        const currentIndex = episodes.findIndex(e => e.id === this.currentEpisode.id);

        if (currentIndex < episodes.length - 1) {
            const nextEpisode = episodes[currentIndex + 1];
            this.loadEpisode(this.currentDrama.id, nextEpisode.id);
        }
    },

    // 快退
    rewind(seconds) {
        const video = document.getElementById('video-player');
        if (video) {
            video.currentTime = Math.max(0, video.currentTime - seconds);
        }
    },

    // 快进
    forward(seconds) {
        const video = document.getElementById('video-player');
        if (video) {
            video.currentTime = Math.min(video.duration, video.currentTime + seconds);
        }
    },

    // 静音切换
    toggleMute() {
        const video = document.getElementById('video-player');
        const volumeBtn = document.getElementById('volume-btn');
        if (!video) return;

        video.muted = !video.muted;
        if (volumeBtn) {
            volumeBtn.textContent = video.muted ? '🔇' : '🔊';
        }
    },

    // 剧集结束
    onEpisodeEnded() {
        // 自动播放下一集
        this.playNextEpisode();
    }
};

// 导出模块
window.PlayerPage = PlayerPage;
