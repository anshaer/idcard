// 取得需要動態更新的 HTML 元素
const body = document.body;
const avatarImg = document.getElementById('avatar-img');
const logoImg = document.getElementById('logo-img');
const socialLinksContainer = document.getElementById('social-links-container');
const languagesContainer = document.getElementById('languages-container');

// 取得 JSON 資料
async function fetchData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('無法載入 JSON 檔案');
        }
        return await response.json();
    } catch (error) {
        console.error('讀取數據時發生錯誤:', error);
        return null;
    }
}

// 根據網址路徑來更新網頁內容
async function updatePageContent() {
    const data = await fetchData();
    if (!data) return;

    // 取得當前的網址路徑，如果路徑為空則設為 "/"
    const path = window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/$/, '');
    
    // 根據路徑從 JSON 數據中取得對應的名片資料
    const cardData = data[path];

    if (cardData) {
        // 更新背景顏色和圖片
        body.style.backgroundColor = cardData.background_color;
        body.style.backgroundImage = `url('${cardData.background_image}')`;
        
        // 更新頭像和名子(LOGO)圖片
        avatarImg.src = cardData.avatar;
        logoImg.src = cardData.logo;
        
        // 動態建立社群連結
        socialLinksContainer.innerHTML = ''; // 清空舊內容
        cardData.social_links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.className = 'social-link';
            a.target = '_blank';
            a.innerHTML = `<img src="${link.icon}" alt="社群圖示" class="icon">`;
            socialLinksContainer.appendChild(a);
        });
        
        // 動態建立語言圖示
        languagesContainer.innerHTML = ''; // 清空舊內容
        cardData.languages.forEach(lang => {
            const img = document.createElement('img');
            img.src = lang.icon;
            img.alt = '語言圖示';
            img.className = 'icon';
            languagesContainer.appendChild(img);
        });
    } else {
        // 如果找不到對應的名片資料，顯示錯誤訊息或預設內容
        // 這裡可以加入你自己的錯誤處理，例如跳轉回首頁或顯示 404
        document.body.innerHTML = '<h1>找不到該名片。</h1>';
    }
}

// 當網頁載入完成時執行
document.addEventListener('DOMContentLoaded', updatePageContent);

// 監聽瀏覽器歷史狀態改變，例如點擊上一頁/下一頁
window.addEventListener('popstate', updatePageContent);
