const {test} = require("@playwright/test");
const {expect} = require("@playwright/test");

test('Browser playwrigt test', async ({browser}) => 
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client/auth/login');
    const loginBtn = page.locator('#login');
    const cardTitles = page.locator('.card-body b');
    const products = page.locator('.card-body');
    const productName = 'ZARA COAT 3';
    await page.getByPlaceholder('email@example.com').fill('sunnysharma@gmail.com');
    await page.getByPlaceholder('enter your passsword').fill('Sunny@123');
    await page.getByRole('button', {name: 'Login'}).click();
    //console.log(await cardTitles.first().textContent());
    //console.log(await cardTitles.nth(1).textContent());
    await page.waitForLoadState('networkidle');
    await cardTitles.first().waitFor();
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
    await page.locator('.card-body').filter({hasText: productName}).getByRole('button', {name: 'Add To Cart'}).click();
    await page.getByRole('listitem').getByRole('button', {name: 'cart'}).click();
    await page.locator('div li').first().waitFor();
    await expect(page.getByText(productName)).toBeVisible();
    await page.getByRole('button', {name: 'Checkout'}).click();
    await page.locator('.field input.input.txt').nth(1).fill("233");
    await page.locator('.field input.input.txt').nth(2).fill("SUNNY SHARMA");
    await page.locator('.field input.input.txt').nth(3).fill("rahulshettyacademy");
    await page.getByRole('button', {name: 'Apply Coupon'}).click();
    await page.locator('.field p').waitFor();
    await expect(page.locator('.field p')).toHaveText('* Coupon Applied');
    await page.getByPlaceholder('Select Country').pressSequentially('ind',{delay:100});
    await page.getByRole('button', {name: 'India'}).nth(1).click();
    await expect(page.getByText('sunnysharma@gmail.com')).toBeVisible();
    //await expect(page.getByLabel('sunnysharma@gmail.com')).toHaveText('sunnysharma@gmail.com');
    //expect(page.locator('.user__name [type="text"]').first()).toHaveText('sunnysharma@gmail.com');
    await page.getByText('Place Order').click();
    await expect(page.getByText('Thankyou for the order. ')).toBeVisible();

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

