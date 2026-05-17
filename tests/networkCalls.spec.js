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

const fakePayload = {data:[], message: "No Orders"};

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
    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*', 
        async route => {
            const response = await page.request.fetch(route.request());
            const body = JSON.stringify(fakePayload);
        route.fulfill({
            response,
            body,
    });
});

    await page.locator('button[routerlink="/dashboard/myorders"]').click();
    await page.waitForResponse('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*');
    console.log(await page.locator('.mt-4').textContent());
    
});