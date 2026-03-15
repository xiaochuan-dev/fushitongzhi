const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
const path = require("path");

puppeteer.use(StealthPlugin());

const outputDir = "room_prices";
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

; (async () => {
    const browser = await puppeteer.launch({
        channel: "chrome",
        // headless: false
    });
    const page = await browser.newPage();


    const url = 'https://cs.scu.edu.cn/index/xytz.htm';

    try {

        await page.setViewport({
            width: 1200,
            height: 800,
            deviceScaleFactor: 1,
            hasTouch: false,
            isLandscape: false,
            isMobile: false
        });

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

await page.setExtraHTTPHeaders({
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0'
        });

        // 添加额外的stealth技巧
        await page.evaluateOnNewDocument(() => {
            // 覆盖webdriver属性
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
            
            // 覆盖plugins
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5],
            });
            
            // 覆盖languages
            Object.defineProperty(navigator, 'languages', {
                get: () => ['zh-CN', 'zh', 'en'],
            });
        });


                // 监听控制台消息
        page.on('console', msg => console.log('浏览器控制台:', msg.text()));
        
        // 监听请求失败
        page.on('requestfailed', request => {
            console.log('请求失败:', request.url(), request.failure().errorText);
        });

        // 监听响应
        page.on('response', response => {
            if (response.status() >= 400) {
                console.log('错误响应:', response.url(), response.status());
            }
        });

        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 60000
        });

        await page.waitForSelector(".content", { timeout: 10000 });

        await browser.close();
    } catch {
        const timestamp = new Date().getTime();
        const screenshotPath = path.join(__dirname, `error-${timestamp}.png`);
        await page.screenshot({
            path: screenshotPath,
            fullPage: true // 截取整个页面
        });
        console.log(`错误页面截图已保存: ${screenshotPath}`);
        await browser.close();
    }
})();