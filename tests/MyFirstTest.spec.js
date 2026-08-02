const {test, expect} = require('@playwright/test');

test('FirstTest', async ({browser})=>
    {
        const context = await browser.newContext();
        const page = await context.newPage();
        const userName = page.locator('#username');
        const submitButton = page.locator("input#signInBtn");
        await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
        console.log(await page.title());
        await userName.fill("rahulshetty");
        await page.locator("input[name='password']").fill("learning");
        await submitButton.click();
        console.log(await page.locator("[style*='block']").textContent());
        await expect(page.locator("[style*='block']")).toContainText("Incorrect");
        await userName.fill('rahulshettyacademy');
        await submitButton.click();
        console.log(await page.locator("[class='card-body'] h4 a").nth(0).textContent());
        console.log(await page.locator("[class='card-body'] h4 a").allTextContents());
});

test('SecondTest', async ({page})=>
    {
        await page.goto("https://www.google.com/");
        console.log(await page.title());
        await expect(page).toHaveTitle("Google");
});

test('HandlingSelectDropDowns', async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await page.locator("#username").fill("rahulshettyacademy");
    await page.locator("#password").fill("learning");
    const userRadioBtn = page.locator("label.customradio").last();
    await userRadioBtn.click();
    await page.locator("#okayBtn").click();
    const DropDown = page.locator("select.form-control");
    await DropDown.selectOption("teach");
    //Assertions for RadioButtons and Checkboxes
    await expect(userRadioBtn).toBeChecked();
    const checkBox = page.locator("#terms");
    await checkBox.click();
    console.log(await checkBox.isChecked());
    await expect(checkBox).toBeChecked();
    await checkBox.uncheck();
    expect(await checkBox.isChecked()).toBeFalsy();
    const blinkingBanner = page.locator("[target='_blank']");
    //Validating if an attribute value is correct
    await expect(blinkingBanner.first()).toHaveAttribute('class','blinkingText');
});

test('HandlingChildWindows', async({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    // Handling new window handles
    const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click("[href*='rahulshetty']"),
]);
    const extractedText = await newPage.locator(".red").textContent();
    const FirstHalf = extractedText.split('@');
    const domain = FirstHalf[1].split('.');
    console.log(domain[0]);
    await page.locator("#username").fill(domain[0]);
    // Difference between textContent(){This works for contents attached to DOM} and valueInput(){This is for contents not attached to DOM} 
    console.log(await page.locator("#username").textContent());
    console.log(await page.locator("#username").inputValue());
});