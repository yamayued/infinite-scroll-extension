// Base64エンコードされたアイコンデータ
const icons = {
    icon16: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAABNklEQVR4nGNgoBAwUqKZhYWFhYGBgYGRgYGBCYbR+SgGsLCw8DCwsHBD2WwMDAzskL2gDOVLMjAwMODTLMLAwMDLwMDABWXzQvlCUDYXlM0LpREGQMXZoXxhKF8QBiygNKJhsAI+MIgNYIFKsEPZ3FA2N5TNQ6kBwlA2L5TNDWULQ9nCFBvAB2XzQtm8UL4wlC9MsQH8UDY/lM0PZQtD+cIUG8ALZfNC2bxQPi+Uz0uxATD/80HZ/FA2P5TNR7EBAhRaIEixAcJQNi+UzQdlC0L5gqjywtQy4X8oWxBqADcDAx0dwA3jQ9m8FBvAi00cyo4gLI5TAHkOvAQyMjIqk+hfNZhdaCD8/8DAQFMDYDYIEOlfQpJo5oBrENQFgUGnCbth+BtGnQOFoeJUchzRBgx4LQAAkfKdqZjTPsAAAAAASUVORK5CYII=`,
    
    icon48: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC4klEQVR4nO2Zy0tUURzHP2NqZj5S04dZ9kJFH6QVtShqU0G0CKJVQdSiRUUQ9A9EEbRpEy2iCCKIFhFFq4iiVS+iRUVRkJVaakU+MrWZ+YqzGJi5c++5586dGfCz+p3f+X3P73fOPfecCwsssIAMqAJWAmtSHCuBKmnTr1EB7AKOAheAs8AJ4CCwDVjk1XkxcBg4BwwAEQdjALgC7AFKvDhfCuwGrkt7p84jwBXglqzRALDfzXmRzN55h84jwG3gmBzRMtP5EmAvcE3aOHUeBW4KW0na+YBtMtN2nEeBO8BWU+fLSF9CR07HgC5gl8n0Uin3as47wEZT5+WkL6Nj5LjJzBfKqJ/S6DgGPAHWp5v5oFwJO9nOoILzyV8PKjgf5z2qY5VnvCJN515lh2O8W5HfJdB1PqzQcZJ3K/Jb5Lz3avQdA94rlPCOHNzIpLP3wEpd55VyIB06+TwQUpQQkiuUSxqt4o6C8yrdwYJyVjudvQcmgLCCjbCwmbJFrpJOvu8lRZPnxHm5SjrZfAJsygGbaeBsN7kLHRr5JmeJ86BcYxXepbHBgcjA2W7JA5sXhQcqNfKJMXA2lKFzJzaqNPKJEU5RQmajs4AYGvl0EUNA2S83nCzKBm6GJk1z5C20GnQHcHcBLPSb7jT8iJHfOFiRo7OeAGX9DjMzFvJkJfRa4D4gWGy3q1B+Y5lGPrbjA9YYBNdh8H6mnaH8xhJF3uJckAZ1LfEXRd5iCvBLnq6D21nk/sJsZvaMaeSdJZFrxabz9VjIDJzOoXMniWSSvFGNfJKsAWqzOP2abBK5aOQtngHlOkPpFXA9C84NRd5SCn0ue6Ay1afBQhzJ1wQoMwy+LsPgdRicryfxwx+gxUlnXJQBW4BDwAngInARaCJ+bFpAj0mCmjyRLaApP8i8MyudUfm5eRZ4CVyN+d5lFsXUcJM8kKhP+o7+hfgIy2eUJtNTyA1+AWvBfBZ7aQWDAAAAAElFTkSuQmCC`,
    
    icon128: `data:image/png;base64,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`
};

// Base64データをバイナリに変換してファイルを作成
const fs = require('fs');

Object.entries(icons).forEach(([filename, dataUrl]) => {
    // data:image/png;base64, の部分を削除
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    
    // Base64をバイナリに変換
    const buffer = Buffer.from(base64Data, 'base64');
    
    // ファイルに書き込み
    fs.writeFileSync(`${filename}.png`, buffer);
    console.log(`${filename}.png を作成しました`);
});

console.log('すべてのアイコンファイルを作成しました！');