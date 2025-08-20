class SimpleTabBox {
    constructor() {
        this.init();
    }

    init() {
        this.injectStyles();
        this.renderHTML();
        this.bindEvents();
        this.setupResponsive();
        this.activateFirstTab();
    }

    injectStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            /* 公告栏样式 */
            .notice-banner {
                background: #3b74f7;
                color: white;
                padding: 10px;
                font-size: 14px;
                display: flex;
                align-items: center;
            }

            .notice-label {
                color: #ff0;
                font-weight: bold;
                margin-right: 10px;
            }

            .notice-text {
                position: relative;
                overflow: hidden;
                white-space: nowrap;
                flex: 1;
                mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
            }

            .scrolling-text {
                display: inline-block;
                padding-left: 100%;
                animation: scroll-left 25s linear infinite;
            }

            @keyframes scroll-left {
                0% { transform: translateX(0); }
                100% { transform: translateX(-100%); }
            }

            /* 标签页容器 */
            .tab-container {
                background: white;
                border: 1px solid #ddd;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
                margin-top: 8px;
            }

            /* 标签页列表 */
            .tab-list {
                display: flex;
                margin: 0;
                padding: 0;
                list-style: none;
                background: transparent;
            }

            .tab-list li {
                flex: 1;
                text-align: center;
                padding: 14px 0;
                cursor: pointer;
                color: #444;
                font-size: 15px;
                background: linear-gradient(145deg, #f0f0f3, #cacaca);
                border-right: 1px solid #bbb;
                transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                user-select: none;
                border-radius: 4px 4px 0 0;
            }

            .tab-list li:last-child {
                border-right: none;
            }

            .tab-list li:hover:not(.active) {
                background: linear-gradient(145deg, #e2e2e2, #c0c0c0);
                color: #000;
            }

            .tab-list li.active {
                background: linear-gradient(145deg, #22c55e, #16a34a);
                color: white;
                font-weight: 700;
                box-shadow: 0 4px 8px rgba(34,197,94,0.4);
                border-bottom: 3px solid #16a34a;
            }

            /* 内容区域 */
            .tab-content {
                opacity: 0;
                transition: opacity 0.4s ease;
                display: none;
                padding: 15px;
                background: white;
            }
/*
            .tab-content.active {
                display: block;
                opacity: 1;
            }

            .content-iframe {
                width: 100%;
                border: none;
                background: white;
            }
*/
            .tab-content.active {
                display: block;
                opacity: 1;
                background: linear-gradient(120deg, #f0fdfa, #ccfbf1);
                border-radius: 6px;
                padding: 2px;
                box-sizing: border-box;
            }
            
            .content-iframe {
                background: transparent;
                border-radius: 4px;
                width: 100%;
                border: none;
                display: block;
            }
            /* 响应式 */
            @media screen and (max-width: 750px) {
                .notice-banner {
                    font-size: 12px;
                    padding: 8px;
                }
            }

            @media screen and (max-width: 650px) and (min-width: 501px) {
                .content-iframe { height: 170px !important; }
            }
            
            @media screen and (max-width: 500px) and (min-width: 451px) {
                .content-iframe { height: 150px !important; }
            }
            
            @media screen and (max-width: 450px) and (min-width: 351px) {
                .content-iframe { height: 140px !important; }
            }
            
            @media screen and (max-width: 350px) {
                .content-iframe { height: 130px !important; }
            }
        `;
        document.head.appendChild(styleElement);
    }

    renderHTML() {
        const htmlContent = `
            <div class="notice-banner">
                <div class="notice-label">最新公告：</div>
                <div class="notice-text">
                    <span class="scrolling-text">易记网址6680369.com 欢迎广大彩民收藏，望相互告知！</span>
                </div>
            </div>
            
            <div class="tab-container">
                <ul class="tab-list">
                    <li data-config='{"color":"#3b74f7","url":"https://a.668558.top/kj/newxam.html","height":140}'>新澳门六合彩</li>
                    <li data-config='{"color":"#3b74f7","url":"https://a.668558.top/kj/newhk.html","height":140}'>香港六合彩</li>
                    <li data-config='{"color":"#3b74f7","url":"./kj/newam.html","height":140}'>老澳门六合彩</li>
                </ul>
                <div class="tab-content"></div>
                <div class="tab-content"></div>
                <div class="tab-content"></div>
            </div>
        `;
        
        document.write(htmlContent);
    }

    bindEvents() {
        const tabList = document.querySelector('.tab-list');
        if (!tabList) return;

        tabList.addEventListener('click', (event) => {
            const clickedTab = event.target;
            if (clickedTab.tagName !== 'LI' || clickedTab.classList.contains('active')) {
                return;
            }
            this.switchTab(clickedTab);
        });
    }

    switchTab(targetTab) {
        const tabIndex = Array.from(targetTab.parentNode.children).indexOf(targetTab);

        // 清除所有标签页激活状态
        document.querySelectorAll('.tab-list li').forEach(tab => tab.classList.remove('active'));

        // 清除所有内容区域激活状态，并计划清理
        document.querySelectorAll('.tab-content').forEach((content, index) => {
            if (content.classList.contains('active')) {
                this.scheduleContentCleanup(content);
            }
            content.classList.remove('active');
        });

        // 激活目标标签页
        targetTab.classList.add('active');

        // 激活对应内容区域并加载内容
        const targetContent = document.querySelectorAll('.tab-content')[tabIndex];
        if (targetContent) {
            targetContent.classList.add('active');
            this.loadTabContent(targetTab, targetContent);
        }
    }

    loadTabContent(tab, contentPanel) {
        const configData = tab.getAttribute('data-config');
        if (!configData) return;

        try {
            const config = JSON.parse(configData);

            // 清理定时器存在时，阻止重复加载
            const cleanupTimer = contentPanel.getAttribute('data-cleanup-timer');
            if (cleanupTimer) {
                clearTimeout(parseInt(cleanupTimer));
                contentPanel.removeAttribute('data-cleanup-timer');
                return;
            }

            // 载入iframe
            contentPanel.innerHTML = `
                <iframe class="content-iframe" 
                        src="${config.url}" 
                        width="100%" 
                        height="${config.height}" 
                        frameborder="0" 
                        scrolling="no">
                </iframe>
            `;
        } catch (error) {
            console.error('配置解析失败:', error);
        }
    }

    scheduleContentCleanup(contentElement) {
        const timerId = setTimeout(() => {
            if (!contentElement.getAttribute('data-cleanup-timer')) return;
            contentElement.removeAttribute('data-cleanup-timer');
            contentElement.innerHTML = '';
        }, 10000);

        contentElement.setAttribute('data-cleanup-timer', timerId);
    }

    activateFirstTab() {
        const firstTab = document.querySelector('.tab-list li:first-child');
        if (firstTab) {
            setTimeout(() => firstTab.click(), 100);
        }
    }

    setupResponsive() {
        const handleResize = () => {
            const existingStyle = document.getElementById('responsive-iframe-style');
            if (existingStyle) existingStyle.remove();

            const screenWidth = window.screen.availWidth;
            let heightRule = '';

            if (screenWidth <= 650 && screenWidth > 500) {
                heightRule = '.content-iframe { height: 170px !important; }';
            } else if (screenWidth <= 500 && screenWidth > 450) {
                heightRule = '.content-iframe { height: 150px !important; }';
            } else if (screenWidth <= 450 && screenWidth > 350) {
                heightRule = '.content-iframe { height: 140px !important; }';
            } else if (screenWidth <= 350) {
                heightRule = '.content-iframe { height: 130px !important; }';
            }

            if (heightRule) {
                const styleElement = document.createElement('style');
                styleElement.id = 'responsive-iframe-style';
                styleElement.textContent = heightRule;
                document.head.appendChild(styleElement);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', handleResize);
        } else {
            handleResize();
        }

        window.addEventListener('resize', handleResize);
    }
}

// 初始化组件
new SimpleTabBox();
