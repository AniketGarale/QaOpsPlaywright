const {test, expect, request} = require('@playwright/test');

const Base_URL = 'https://eventhub.rahulshettyacademy.com';
const API_URL = 'https://api.eventhub.rahulshettyacademy.com/api';

const Yahoo_User = {email: 'sunnysharma@yahoo.com', password: 'Sunny@123'};
const Gmail_User = {email: 'sunnysharma@gmail.com', password: 'Sunny@123'};


async function login(page,user){
    await page.goto(`${Base_URL}/login`);
    await page.getByPlaceholder('you@email.com').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

//test#1

test('Gmail user see access denied when login with yahoo user', async ({page}) => {
const loginResponse = await page.request.post(`${API_URL}/auth/login`, {
    data: {
        email: Yahoo_User.email,
        password: Yahoo_User.password
    }
});
expect(loginResponse.ok()).toBeTruthy();
const {token} = await loginResponse.json();

const eventsResponse = await page.request.get(`${API_URL}/events`, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
expect(eventsResponse.ok()).toBeTruthy();
const eventsData = await eventsResponse.json();
const eventId = eventsData.data[0].id;

//create a booking for the event

const bookingResponse = await page.request.post(`${API_URL}/bookings`, {
    headers: {
        'Authorization': `Bearer ${token}`
    },
    data: {
        eventId: eventId,
        quantity: 1,
        customerName: 'Yahoo User',
        customerEmail: Yahoo_User.email,
        customerPhone: '1234567890'
    }
});
expect(bookingResponse.ok()).toBeTruthy();
const yahooBookingDataId = (await bookingResponse.json()).data.id;

console.log(`Booking created for Yahoo user with ID: ${yahooBookingDataId}`);

// Now login with Gmail user and try to access the booking created by Yahoo user

await login(page,Gmail_User);

// Try to access the booking created by Yahoo user
    await page.goto(`${Base_URL}/bookings/${yahooBookingDataId}`, {waitUntil: 'networkidle'});

    await expect(page.getByText('Access Denied')).toBeVisible();
    await expect(page.getByText('You are not authorized to view this booking.')).toBeVisible();
});

