const {test, expect} = require('@playwright/test');

test('MyFirstAssignment', async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client');
    await page.locator("[class='login-wrapper-footer-text']").click();
    await page.locator("#firstName").fill("Navya");
    await page.locator("#lastName").fill("Modiyam");
    await page.locator("#userEmail").fill("navya@example.com");
    await page.locator("#userMobile").fill("1234567890");
    await page.locator("input[value='Female']").click();
    await page.locator("#userPassword").fill("Navya@123");
    await page.locator("#confirmPassword").fill("Navya@123");
    await page.locator("input[type='checkbox']").click();
    await page.locator("input[type='submit']").click();
    await page.locator("[class ='login-wrapper-footer-text']").click();
    await page.locator("#userEmail").fill("navya@example.com");
    await page.locator("#userPassword").fill("Navya@123");
    await page.locator("#login").click();
    console.log(await page.locator("[style*='uppercase'] b").nth(0).textContent());
}
)