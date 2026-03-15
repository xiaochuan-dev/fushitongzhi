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
        await page.goto(url);
        await page.waitForSelector(".content");

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