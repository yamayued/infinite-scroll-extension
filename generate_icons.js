const fs = require('fs');
const { createCanvas } = require('canvas');

// Node.jsのcanvasパッケージが必要ない場合の代替方法
// ブラウザで実行してBase64形式で生成

const iconHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Auto Icon Generator</title>
</head>
<body>
    <h1>アイコンを自動生成中...</h1>
    <div id="output"></div>
    
    <script>
        function generateIcon(size) {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // 背景
            ctx.fillStyle = '#007bff';
            ctx.fillRect(0, 0, size, size);
            
            // 矢印を描画
            ctx.strokeStyle = 'white';
            ctx.lineWidth = size * 0.15;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            // 下向き矢印
            ctx.beginPath();
            ctx.moveTo(size * 0.5, size * 0.2);
            ctx.lineTo(size * 0.5, size * 0.7);
            ctx.moveTo(size * 0.3, size * 0.5);
            ctx.lineTo(size * 0.5, size * 0.7);
            ctx.lineTo(size * 0.7, size * 0.5);
            ctx.stroke();
            
            // 点線
            ctx.setLineDash([size * 0.1, size * 0.05]);
            ctx.beginPath();
            ctx.moveTo(size * 0.5, size * 0.75);
            ctx.lineTo(size * 0.5, size * 0.95);
            ctx.stroke();
            
            return canvas.toDataURL('image/png');
        }
        
        // 各サイズのアイコンを生成
        const sizes = [16, 48, 128];
        const icons = {};
        
        sizes.forEach(size => {
            icons['icon' + size] = generateIcon(size);
        });
        
        // 結果を表示
        const output = document.getElementById('output');
        output.innerHTML = '<h2>生成完了！</h2><p>以下のコードをコピーして、対応するファイルを作成してください：</p>';
        
        for (const [name, dataUrl] of Object.entries(icons)) {
            const pre = document.createElement('pre');
            pre.style.cssText = 'background: #f0f0f0; padding: 10px; margin: 10px 0; overflow-x: auto;';
            pre.textContent = name + '.png のデータ:\\n' + dataUrl;
            output.appendChild(pre);
            
            // プレビュー画像も表示
            const img = document.createElement('img');
            img.src = dataUrl;
            img.style.cssText = 'margin: 5px; border: 1px solid #ccc;';
            output.appendChild(img);
        }
        
        // 自動ダウンロード用のリンクを作成
        sizes.forEach(size => {
            const a = document.createElement('a');
            a.href = icons['icon' + size];
            a.download = 'icon' + size + '.png';
            a.textContent = 'icon' + size + '.png をダウンロード';
            a.style.cssText = 'display: block; margin: 5px; padding: 10px; background: #007bff; color: white; text-decoration: none; width: 200px; text-align: center;';
            output.appendChild(a);
        });
    </script>
</body>
</html>
`;

// HTMLファイルを生成
fs.writeFileSync('generate_icons_auto.html', iconHTML);
console.log('generate_icons_auto.html を作成しました。ブラウザで開いてアイコンをダウンロードしてください。');