const { test, expect } = require('@playwright/test');

test("security test request interceopt", async({ page })=>{
    await page.goto('https://rahulshettyacademy.com/client/');
    const userEmail = page.locator('#userEmail');
    const loginBtn = page.locator('#login');
    const Email = "sunnysharma@gmail.com";
    await userEmail.fill(Email);
    await page.locator('[type="password"]').fill('Sunny@123');
    await loginBtn.click();
    await page.waitForLoadState('networkidle');
    await page.locator('.card-body b').first().waitFor();
    await page.locator('button[routerlink*="myorders"]').click();

    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*',
        route => {
            route.continue({
                url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=639d9c8e1c941646b7a8b4fr5'
            });
        });

    await page.locator('button:has-text("View")').first().click();
    await expect(page.locator('p').last()).toHaveText('You are not authorize to view this order');

});