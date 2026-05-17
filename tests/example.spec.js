const {test} = require("@playwright/test");
const {expect} = require("@playwright/test");

test('Browser playwrigt test', async ({browser}) => 
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client/auth/login');
    console.log(await page.title());
    const userEmail = page.locator('#userEmail');
    const loginBtn = page.locator('#login');
    const cardTitles = page.locator('.card-body b');
    const products = page.locator('.card-body');
    const productName = 'ZARA COAT 3';
    const Email = "sunnysharma@gmail.com";
    await userEmail.fill(Email);
    await page.locator('[type="password"]').fill('Sunny@123');
    await loginBtn.click();
    //console.log(await cardTitles.first().textContent());
    //console.log(await cardTitles.nth(1).textContent());
    await page.waitForLoadState('networkidle');
    await cardTitles.first().waitFor();
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
    const countall = await products.count();
    for(let i=0; i< countall; i++)
    {
        if(productName === (await products.nth(i).locator('b').textContent()))
        {
            //add to cart
            await products.nth(i).locator('text= Add To Cart').click();
            break;
        }
    }
    await page.locator('[routerlink="/dashboard/cart"]').click();
    await page.locator('div li').first().waitFor();
    const boolean = page.locator('h3:has-text("zara coat 3")').isVisible();
    expect(boolean).toBeTruthy();
    await page.locator('.totalRow button').click();
    await page.locator('.field input.input.txt').nth(1).fill("233");
    await page.locator('.field input.input.txt').nth(2).fill("SUNNY SHARMA");
    await page.locator('.field input.input.txt').nth(3).fill("rahulshettyacademy");
    await page.locator('[type="submit"]').click();
    //await page.locator('.field p').waitFor();
    await expect(page.locator('.field p')).toHaveText('* Coupon Applied');
    await page.locator('[placeholder="Select Country"]').pressSequentially('ind',{delay:100});
    const dropdown = page.locator('.ta-results');
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator('button').count();
    for(let i=0; i< optionsCount; i++)
    {   
        if(await dropdown.locator('button').nth(i).textContent() === " India")
        {
            await dropdown.locator('button').nth(i).click();
            break;
        }
    }
    expect(page.locator('.user__name [type="text"]').first()).toHaveText(Email);
    await page.locator('.action__submit').click();
    await expect(page.locator('.hero-primary')).toHaveText(' Thankyou for the order. ');
    const orderID = await page.locator('.em-spacer-1 .ng-star-inserted').textContent();
    console.log(orderID);
    await page.locator('button[routerlink="/dashboard/myorders"]').click();
    await page.locator('tbody').waitFor();
    const rows = await page.locator('tbody tr');
    for(let i = 0; i < await rows.count(); ++i)
    {   
        const rowOrderID = await rows.nth(i).locator('th').textContent();
        if(orderID.includes(rowOrderID))
        {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderIDDetails = await page.locator('.col-text').textContent();
    expect(orderID.includes(orderIDDetails)).toBeTruthy();
    console.log(orderIDDetails);
});