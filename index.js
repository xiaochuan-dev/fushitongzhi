const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
const path = require("path");

puppeteer.use(StealthPlugin());

;(async () => {
    const browser = await puppeteer.launch({
        channel: "chrome",
        headless: false
    });
    const page = await browser.newPage();


    const url = 'https://cs.scu.edu.cn/index/xytz.htm';
    await page.goto(url);
    await page.waitForSelector(".content");

    await browser.close();
})();