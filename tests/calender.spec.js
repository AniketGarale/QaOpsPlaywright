const {test} = require("@playwright/test");
const {expect} = require("@playwright/test");

test('calender test', async ({page}) =>
{
    const monthNumber = "6";
    const year = "2027";
    const date = "15";
    const expectedDate = [monthNumber, date, year];

    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');
    await page.locator('.react-date-picker__calendar-button__icon').click();
    await page.locator('.react-calendar__navigation__label').click();
    await page.locator('.react-calendar__navigation__label').click();
    await page.getByText(year).click();
    await page.locator('.react-calendar__year-view__months__month').nth(Number(monthNumber)-1).click();
    await page.locator("//abbr[text()="+date+"]").click();
    const inputs = page.locator('.react-date-picker__inputGroup__input');

    for (let i = 0; i < expectedDate.length; i++)
    {
        const value = await inputs.nth(i).inputValue();
        expect(value).toEqual(expectedDate[i]);
    }
    //calender test
}
);