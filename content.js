let scrollInterval = null;
let isScrolling = false;
let scrollCount = 0;
let scrollSpeed = 5;
let scrollIntervalTime = 1000;
let startTime = null;

// メッセージリスナー
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'START_SCROLL') {
        startInfiniteScroll(request.speed, request.interval);
        sendResponse({ success: true });
    } else if (request.type === 'STOP_SCROLL') {
        stopInfiniteScroll();
        sendResponse({ success: true });
    } else if (request.type === 'GET_STATUS') {
        sendResponse({
            isScrolling: isScrolling,
            scrollCount: scrollCount,
            startTime: startTime
        });
    } else if (request.type === 'GET_STATS') {
        sendResponse({
            scrollCount: scrollCount
        });
    }
    return true;
});

function startInfiniteScroll(speed, interval) {
    // 既存のスクロールを停止
    if (scrollInterval) {
        clearInterval(scrollInterval);
    }
    
    isScrolling = true;
    scrollSpeed = speed || 5;
    scrollIntervalTime = interval || 1000;
    scrollCount = 0;
    startTime = Date.now();
    
    // スクロール開始
    scrollInterval = setInterval(() => {
        performScroll();
    }, scrollIntervalTime);
    
    // 初回スクロール
    performScroll();
}

function stopInfiniteScroll() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
    
    isScrolling = false;
    console.log(`スクロール停止 - 総スクロール回数: ${scrollCount}`);
}

function performScroll() {
    if (!isScrolling) return;
    
    const scrollAmount = 100 * scrollSpeed;
    const currentPosition = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    if (currentPosition >= maxScroll) {
        // ページの最下部に到達した場合
        console.log('ページの最下部に到達しました');
        
        // 動的コンテンツの読み込みを待つ
        setTimeout(() => {
            const newMaxScroll = document.documentElement.scrollHeight - window.innerHeight;
            
            if (newMaxScroll > maxScroll) {
                // 新しいコンテンツが読み込まれた
                console.log('新しいコンテンツが読み込まれました');
                window.scrollBy({
                    top: scrollAmount,
                    behavior: 'smooth'
                });
                scrollCount++;
            } else {
                // これ以上スクロールできない場合は上に戻る
                console.log('最上部に戻ります');
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                scrollCount++;
            }
        }, 500);
    } else {
        // 通常のスクロール
        window.scrollBy({
            top: scrollAmount,
            behavior: 'smooth'
        });
        scrollCount++;
    }
}

// ページ離脱時の処理
window.addEventListener('beforeunload', () => {
    stopInfiniteScroll();
});

// 視覚的フィードバック（オプション）
function showScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: rgba(0, 123, 255, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 9999;
        transition: opacity 0.3s;
    `;
    indicator.textContent = '自動スクロール中...';
    indicator.id = 'infinite-scroll-indicator';
    
    document.body.appendChild(indicator);
}

function hideScrollIndicator() {
    const indicator = document.getElementById('infinite-scroll-indicator');
    if (indicator) {
        indicator.style.opacity = '0';
        setTimeout(() => indicator.remove(), 300);
    }
}

// スクロール開始/停止時にインジケーターを表示/非表示
const originalStart = startInfiniteScroll;
const originalStop = stopInfiniteScroll;

startInfiniteScroll = function(speed, interval) {
    originalStart(speed, interval);
    showScrollIndicator();
};

stopInfiniteScroll = function() {
    originalStop();
    hideScrollIndicator();
};