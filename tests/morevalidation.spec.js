const {test,expect} = require('@playwright/test');

test('popup validation', async ({page}) => {
    await page.goto('http://rahulshettyacademy.com/AutomationPractice/');
    //await page.goto("https://www.google.com");
    //await page.goBack();
    //await page.goForward();
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#displayed-text").screenshot({path: 'displayed-text.png'});
    await page.screenshot({path: 'screenshot.png', fullPage: true});
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    page.on('dialog', dialog => dialog.accept());
    await page.locator("#confirmbtn").click();
    await page.locator("#mousehover").hover();

    const framespage = page.frameLocator("#courses-iframe");
    await framespage.locator("li a[href*='lifetime-access']:visible").click();
    const textcheck = await framespage.locator(".text h2").textContent();
    console.log(textcheck.split(" ")[1]);

}
);

test('visuals', async ({page}) => {
    await page.goto('http://google.com/');
    expect(await page.screenshot()).toMatchSnapshot('google-homepage.png');
}
);
