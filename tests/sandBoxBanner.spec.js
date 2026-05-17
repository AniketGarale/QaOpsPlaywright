const {test, expect} = require('@playwright/test');

const Base_URL = 'https://eventhub.rahulshettyacademy.com';
const User_Email = 'sunnysharma@gmail.com';
const User_Password = 'Sunny@123';

const FOUR_EVENTS_RESPONSE = {
    "data": [
        {
            id: 1,
            title: "Dilli Diwali Mela",
            category: "Festival",
            venue: "Pragati Maidan Exhibition Grounds",
            city: "Delhi",
            eventDate: "2026-10-20T17:00:00.000Z",
            price: "300",
            totalSeats: 10000,
            availableSeats: 10000,
            imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800",
            isStatic: false,
        },
        {
            id: 2,
            title: "Rock Concert",
            category: "Concert",
            venue: "Palace Grounds",
            city: "Banglore",
            eventDate: "2026-10-20T18:00:00.000Z",
            price: "500",
            totalSeats: 1000,
            availableSeats: 990,
            imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800",
            isStatic: false,
        },
        {
            id: 3,
            title: "Rock Concert",
            category: "Concert",
            venue: "Palace Grounds",
            city: "Banglore",
            eventDate: "2026-10-20T18:00:00.000Z",
            price: "500",
            totalSeats: 1000,
            availableSeats: 990,
            imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800",
            isStatic: false,
        },
        {
            id: 4,
            title: "Rock Concert",
            category: "Concert",
            venue: "Palace Grounds",
            city: "Banglore",
            eventDate: "2026-10-20T18:00:00.000Z",
            price: "500",
            totalSeats: 1000,
            availableSeats: 990,
            imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800",
            isStatic: false,
        }
    ],
    pagination: {
        "total": 4,
        "page": 1,
        "limit": 12,
        "totalPages": 1
    }
};

const SIX_EVENTS_RESPONSE = {
    "data": [
        {
            id: 1,
            title: "Dilli Diwali Mela",
            category: "Festival",
            venue: "Pragati Maidan Exhibition Grounds",
            city: "Delhi",
            eventDate: "2026-10-20T17:00:00.000Z",
            price: "300",
            totalSeats: 10000,
            availableSeats: 10000,
            imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800",
            isStatic: false,
        },
        {
            id: 2,
            title: "Rock Concert",
            category: "Concert",
            venue: "Palace Grounds",
            city: "Banglore",
            eventDate: "2026-10-20T18:00:00.000Z",
            price: "500",
            totalSeats: 1000,
            availableSeats: 990,
            imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800",
            isStatic: false,
        },
        {
            id: 3,
            title: "Rock Concert",
            category: "Concert",
            venue: "Palace Grounds",
            city: "Banglore",
            eventDate: "2026-10-20T18:00:00.000Z",
            price: "500",
            totalSeats: 1000,
            availableSeats: 990,
            imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800",
            isStatic: false,
        },
        {
            id: 4,
            title: "Rock Concert",
            category: "Concert",
            venue: "Palace Grounds",
            city: "Banglore",
            eventDate: "2026-10-20T18:00:00.000Z",
            price: "500",
            totalSeats: 1000,
            availableSeats: 990,
            imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800",
            isStatic: false,
        },
        {
            id: 5,
            title: "Rock Concert",
            category: "Concert",
            venue: "Palace Grounds",
            city: "Banglore",
            eventDate: "2026-10-20T18:00:00.000Z",
            price: "500",
            totalSeats: 1000,
            availableSeats: 990,
            imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800",
            isStatic: false,
        },
        {
            id: 6,
            title: "Rock Concert",
            category: "Concert",
            venue: "Palace Grounds",
            city: "Banglore",
            eventDate: "2026-10-20T18:00:00.000Z",
            price: "500",
            totalSeats: 1000,
            availableSeats: 990,
            imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800",
            isStatic: false,
        }
    ],
    pagination: {
        "total": 6,
        "page": 1,
        "limit": 12,
        "totalPages": 1
    }
};

async function loginAndGoToEvents(page){
    await page.goto(`${Base_URL}/login`);
    await page.getByPlaceholder('you@email.com').fill(User_Email);
    await page.getByLabel('Password').fill(User_Password);
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
    await page.goto(`${Base_URL}/events`);
}

//test#1

test('Sandbox Banner when 6 events are entered', async ({page}) => {
    await page.route('**/api/events**', 
        async route => route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(SIX_EVENTS_RESPONSE)
        })
    );

    await loginAndGoToEvents(page);
    const eventCards = page.getByTestId('event-card');
    await expect(eventCards.first()).toBeVisible();
    expect(await eventCards.count()).toBe(6);

    const Banner = page.getByText(/sandbox holds up to/i);
    await expect(Banner).toBeVisible();
    await expect(Banner).toContainText('9 bookings');
    
});

//test#2

test('Sandbox Banner when 4 events are entered', async ({page}) => {
    await page.route('**/api/events**', 
        async route => route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(FOUR_EVENTS_RESPONSE)
        })
    );

    await loginAndGoToEvents(page);
    const eventCards = page.getByTestId('event-card');
    await expect(eventCards.first()).toBeVisible();
    expect(await eventCards.count()).toBe(4);
    const Banner = page.getByText(/sandbox holds up to/i);
    await expect(Banner).not.toBeVisible();
    
});