const {test} = require("@playwright/test");
const {expect, request} = require("@playwright/test");
const {APIUtils} = require('./Utils/APIUtils');

const loginPayload = {userEmail: "sunnysharma@gmail.com",userPassword: "Sunny@123"}

const orderPayload = {orders: [
        {
            country: "Cuba",
            productOrderedId: "6960eae1c941646b7a8b3ed3"
        }
    ]
}

let response

test.beforeAll (async ({browser}) => {
    //login API call to get token

    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayload);
});



test('Place the order', async ({page}) => 
{
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto('https://rahulshettyacademy.com/client/');
    console.log(await page.title());
    await page.locator('button[routerlink="/dashboard/myorders"]').click();
    await page.locator('tbody').waitFor();
    const rows = await page.locator('tbody tr');
    for(let i = 0; i < await rows.count(); ++i)
    {   
        const rowOrderID = await rows.nth(i).locator('th').textContent();
        if(response.orderId.includes(rowOrderID))
        {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }
    const orderIDDetails = await page.locator('.col-text').textContent();
    //await page.pause();
    console.log(orderIDDetails);
    expect(response.orderId.includes(orderIDDetails)).toBeTruthy();
});