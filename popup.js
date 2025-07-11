let isScrolling = false;
let startTime = null;
let elapsedInterval = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 初期状態を取得
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    try {
        const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_STATUS' });
        if (response && response.isScrolling) {
            setScrollingUI(true);
            startTime = response.startTime;
            updateElapsedTime();
            updateStats(response);
        }
    } catch (error) {
        console.log('Content script not loaded yet');
    }
    
    // イベントリスナー
    document.getElementById('startBtn').addEventListener('click', startScroll);
    document.getElementById('stopBtn').addEventListener('click', stopScroll);
    
    // スピードスライダー
    const speedSlider = document.getElementById('scrollSpeed');
    const speedValue = document.getElementById('speedValue');
    speedSlider.addEventListener('input', (e) => {
        speedValue.textContent = e.target.value;
    });
    
    // 定期的に統計情報を更新
    setInterval(updateCurrentStats, 1000);
});

async function startScroll() {
    const speed = parseInt(document.getElementById('scrollSpeed').value);
    const interval = parseFloat(document.getElementById('scrollInterval').value) * 1000;
    
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // コンテンツスクリプトに開始メッセージを送信
        await chrome.tabs.sendMessage(tab.id, {
            type: 'START_SCROLL',
            speed: speed,
            interval: interval
        });
        
        setScrollingUI(true);
        startTime = Date.now();
        updateElapsedTime();
        
    } catch (error) {
        console.error('Error starting scroll:', error);
        alert('エラーが発生しました。ページをリロードしてください。');
    }
}

async function stopScroll() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        await chrome.tabs.sendMessage(tab.id, { type: 'STOP_SCROLL' });
        
        setScrollingUI(false);
        
    } catch (error) {
        console.error('Error stopping scroll:', error);
    }
}

function setScrollingUI(scrolling) {
    isScrolling = scrolling;
    
    document.getElementById('startBtn').disabled = scrolling;
    document.getElementById('stopBtn').disabled = !scrolling;
    document.getElementById('scrollSpeed').disabled = scrolling;
    document.getElementById('scrollInterval').disabled = scrolling;
    
    const statusText = document.getElementById('statusText');
    const statusIndicator = document.getElementById('statusIndicator');
    
    if (scrolling) {
        statusText.textContent = 'スクロール中';
        statusText.style.color = '#28a745';
        statusIndicator.classList.add('active');
        
        if (!elapsedInterval) {
            elapsedInterval = setInterval(updateElapsedTime, 1000);
        }
    } else {
        statusText.textContent = '停止中';
        statusText.style.color = '#666';
        statusIndicator.classList.remove('active');
        
        if (elapsedInterval) {
            clearInterval(elapsedInterval);
            elapsedInterval = null;
        }
    }
}

async function updateCurrentStats() {
    if (!isScrolling) return;
    
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_STATS' });
        
        if (response) {
            updateStats(response);
        }
    } catch (error) {
        // エラーは無視
    }
}

function updateStats(stats) {
    if (stats.scrollCount !== undefined) {
        document.getElementById('scrollCount').textContent = stats.scrollCount;
    }
}

function updateElapsedTime() {
    if (!startTime) return;
    
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    document.getElementById('elapsedTime').textContent = 
        `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}