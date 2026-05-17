const {test, expect} = require('@playwright/test');

const BaseURL = 'https://eventhub.rahulshettyacademy.com';
const GmailUser = {email: 'sunnysharma@gmail.com', password: 'Sunny@123'};

async function loginAndGotoBookings(page) {
    await page.goto(`${BaseURL}/login`);
    await page.getByLabel('Email').fill(GmailUser.email);
    await page.getByLabel('Password').fill(GmailUser.password);
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}


test('Single Ticket Booking', async ({ page }) => {
    await loginAndGotoBookings(page);
    await page.goto(`${BaseURL}/events`);
    await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();

    await page.getByLabel('Full Name').fill('Test user');
    await page.getByLabel('Email').fill(GmailUser.email);
    await page.getByLabel('Phone Number').fill('1234567890');
    await page.locator('.confirm-booking-btn').click();

    //navigate to booking details
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(`${BaseURL}/bookings`);
    await page.getByRole('link', {name: 'View Details'}).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    //validate booking ref first letter matches event name first letter
    const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
    const eventName = await page.locator('h1').innerText();
    expect(bookingRef.charAt(0)).toBe(eventName.charAt(0));
    await page.locator('#check-refund-btn').click();

    //spinner must apper immadiately
    await expect(page.locator('#refund-spinner')).toBeVisible();

    //wait for spinner to disappear
    await expect(page.locator('#refund-spinner')).not.toBeVisible({timeout: 6000});

    //validate eligibility message
    const result = page.locator('#refund-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Eligible for refund. Single-ticket bookings qualify for a full refund.');

}
);


test('refund not eligible for group booking', async ({ page }) => {
    await loginAndGotoBookings(page);
    await page.goto(`${BaseURL}/events`);
    await page.getByTestId('event-card').first().getByTestId('book-now-btn').click();

    //increase quantity to 3
    await page.locator('button:has-text("+")').click();
    await page.locator('button:has-text("+")').click();

    await page.getByLabel('Full Name').fill('Test user');
    await page.getByLabel('Email').fill(GmailUser.email);
    await page.getByLabel('Phone Number').fill('1234567890');
    await page.locator('.confirm-booking-btn').click();

    //navigate to booking details
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await expect(page).toHaveURL(`${BaseURL}/bookings`);
    await page.getByRole('link', {name: 'View Details'}).first().click();
    await expect(page.getByText('Booking Information')).toBeVisible();

    //validate booking ref first letter matches event name first letter
    const bookingRef = await page.locator('span.font-mono.font-bold').innerText();
    const eventName = await page.locator('h1').innerText();
    expect(bookingRef.charAt(0)).toBe(eventName.charAt(0));
    await page.locator('#check-refund-btn').click();

    //spinner must apper immadiately
    await expect(page.locator('#refund-spinner')).toBeVisible();

    //wait for spinner to disappear
    await expect(page.locator('#refund-spinner')).not.toBeVisible({timeout: 6000});

    //validate eligibility message
    const result = page.locator('#refund-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Not eligible for refund. Group bookings (3 tickets) are non-refundable.');

}
);


