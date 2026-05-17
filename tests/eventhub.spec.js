const { test, expect } = require('@playwright/test');
const { link } = require('node:fs');

const futuredatevalue = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const futuredate = date.toISOString().split('T')[0] + 'T' + date.toTimeString().split(' ')[0];
    return futuredate;
}

test('EventHub',async({page})=> {
    await page.goto('https://eventhub.rahulshettyacademy.com');
    await page.title('eventhub');
    await page.getByPlaceholder('you@email.com').fill('sunnysharma@gmail.com');
    await page.getByLabel('Password').fill('Sunny@123');
    await page.locator('#login-btn').click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Browse Events →' }).waitFor();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
    const text = await page.getByRole('link', { name: 'Browse Events →' }).textContent();
    console.log(text);

    await page.getByRole('button', { name: 'Admin' }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Manage Events' }).click();

    await page.locator('#event-title-input').waitFor();
    const eventTitle = `Test Event ${Date.now()}`;
    await page.locator('#event-title-input').fill(eventTitle);
    await page.getByRole('textbox', { name: 'Describe the event…' }).fill('This is a test event created by Playwright.');
    await page.getByLabel('City').fill('Mumbai');
    await page.getByLabel('Venue').fill('HB Studio');
    const futureDate = futuredatevalue(7);
    console.log(futureDate);
    await page.getByLabel('Event Date & Time').fill(futureDate);
    await page.getByLabel('Price').fill('100');
    await page.getByLabel('Total Seats').fill('50');
    await page.locator('#add-event-btn').click();
    const text2 = await page.getByText(eventTitle).textContent();
    console.log(text2);
    await expect(page.getByText(eventTitle)).toBeVisible();

    await page.getByRole('link', { name: 'Events' }).nth(0).click();
    await page.waitForLoadState('networkidle');
    await page.locator('#event-card').nth(0).waitFor();
    const eventCardTitle = await page.locator('#event-card').nth(0).getByRole('heading').textContent();
    console.log(eventCardTitle);
    const eventnameverifier = await page.locator('#event-card').filter({ hasText: eventTitle }).getByRole('heading').textContent();
    console.log(eventnameverifier);
    expect(eventnameverifier).toBe(eventTitle);
    const seatcount = await page.locator('#event-card').filter({ hasText: eventTitle }).getByText('seats available').textContent();
    console.log(seatcount);
    const count = seatcount.split(' ')[0];
    console.log(count);
    expect(count).toBe('50');

    await page.locator('#event-card').filter({ hasText: eventTitle }).getByText('Book Now' ).click();
    await expect(page.locator('#ticket-count')).toHaveText('1');
    await page.getByLabel('Full Name').fill('Sunny Sharma');
    await page.getByLabel('Email').fill('sunnysharma@gmail.com');
    await page.getByLabel('Phone Number').fill('1234567890');
    await page.getByRole('button', { name: 'Confirm Booking' }).click();
    await expect(page.getByText('Booking Confirmed!')).toBeVisible();
    const bookingRef = await page.locator('.booking-ref').first().textContent();
    console.log(bookingRef);
    await expect(page.locator('.booking-ref').first()).toHaveText(bookingRef);
    await page.getByRole('link', { name: 'View My Bookings' }).click();
    await page.waitForLoadState('networkidle');
    await page.locator('#booking-card').first().waitFor();
    await expect(page.locator('#booking-card').first()).toBeVisible();
    const bookingCardRef = await page.locator('#booking-card').getByText(bookingRef).textContent();
    console.log(bookingCardRef);
    await expect(page.locator('#booking-card').getByText(bookingRef)).toHaveText(bookingRef);
    await expect(page.locator('#booking-card').filter({ hasText: bookingRef })).toContainText(eventTitle);

    await page.getByRole('link', { name: 'Events' }).nth(0).click();
    await page.waitForLoadState('networkidle');
    await page.locator('#event-card').nth(0).waitFor();
    const eventnameverifier2 = await page.locator('#event-card').filter({ hasText: eventTitle }).getByRole('heading').textContent();
    console.log(eventnameverifier2);
    expect(eventnameverifier2).toBe(eventTitle);
    const seatcount2 = await page.locator('#event-card').filter({ hasText: eventTitle }).getByText('seats available').textContent();
    console.log(seatcount2);
    const count2 = seatcount2.split(' ')[0];
    console.log(count2);
    expect(Number(count2)).toBe(Number(count)-1);

}
);