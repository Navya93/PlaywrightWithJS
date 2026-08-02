const {test, expect} = require('@playwright/test');
const { text } = require('node:stream/consumers');

test('End2EndTestCase', async({browser}) =>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto("https://rahulshettyacademy.com/client/");
    const loginuser = "navya@example.com";
    await page.locator("#userEmail").fill(loginuser);
    await page.locator("#userPassword").fill("Navya@123");
    await page.locator("#login").click();
    
    //Storing all the products into array of products
    await page.locator(".card-body").nth(0).textContent();
    const products = await page.locator(".card-body");
    const productCount = await products.count();

    //Iterating through the array and looking for product ZARA COAT 3 and adding to the cart"
    const ProductName = "ZARA COAT 3";
    for (let i=0; i < productCount; ++i){
        const currentproductName = await products.nth(i).locator("b").textContent();
        if(currentproductName === ProductName){
            await products.nth(i).getByText("Add To Cart").click();
            break;
        } 
    }

    //Navigating to the cart page and proceed to Checkout
    await page.locator("[routerlink='/dashboard/cart']").click();
    await page.locator("div ul li").last().waitFor();
    const productsInCart = await page.locator('h3:has-text(ProductName)');
    await expect(productsInCart).toBeTruthy();
    await page.locator("li button[type='button']").click();

    /* Provide the credit card details, apply coupon rahulshettyacademy, select country and place order and capture the orderID
    Selecting Month as 12 and Day as 25 and CVV as 454 */

    const monthDropDown = await page.locator(".ddl").nth(0);
    await monthDropDown.selectOption("12");

    const dayDropDown = await page.locator(".ddl").nth(1);
    await dayDropDown.selectOption("25");

    await page.locator(".small input").nth(0).fill("454");
    await page.locator(".field .txt").nth(2).fill("Navya");
    await page.locator(".field .txt").nth(3).fill("rahulshettyacademy");
    await page.locator('button:has-text("Apply Coupon")').click();
    await expect(page.locator('p:has-text("* Coupon Applied")')).toBeVisible();
    await expect(page.locator("[style*='lightgray']")).toHaveText(loginuser);
    await page.locator("[placeholder*='Country']").pressSequentially("Ind", {delay:150});
    await page.locator(".ta-results").waitFor();
    const Dropdown = await page.locator(".ta-results");
    const options = await Dropdown.locator(".ta-item");
    const optionsCount = await options.count();
    const optionsText = await options.allTextContents();
    await console.log(optionsText);
    for(let i=0; i<optionsCount; ++i){
        const SelectedOptionText = await options.nth(i).textContent();
        if(SelectedOptionText.trim() === "India"){
            options.nth(i).click();
            break;
        } 
    }
    await page.locator(".action__submit").click();
    console.log(await page.locator(".hero-primary").textContent());
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderID = await page.locator("label.ng-star-inserted").textContent();
    await console.log(orderID);
    const SplitOrderID = orderID.split(" ");
    const exactOrderID = SplitOrderID[2];
    console.log(exactOrderID);

    //Navigating to orderScreen and validating if the orderID places is available there and view corresponding order
    await page.locator('button[routerLink="/dashboard/myorders"]').click();
    await page.locator('tr').last().waitFor({state: "visible"});
    const table = await page.locator("tbody");
    const tableRows = await table.locator("tr");
    //await console.log(table);
    //await console.log(tableRows);
    const TotalOrders = await tableRows.count();
    await console.log(TotalOrders);
    for(let i=0; i<TotalOrders; ++i){
        const TableOrderLocator = await tableRows.nth(i).locator("th");
        const TableOrderId = await TableOrderLocator.textContent();
        await console.log(TableOrderId);
        if(TableOrderId === exactOrderID){
            await tableRows.nth(i).locator("button").first().click();
            break;
        }
    }
    await expect(page.locator("div.-main")).toHaveText(exactOrderID);
    await page.pause();
});

test("E2ETestUsingDifferentLocators", async({browser}) => 
{
    const context = await browser.newContext();
    const page = await context.newPage();
    const userEmail = "navya@example.com";
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.getByPlaceholder("email@example.com").fill(userEmail);
    await page.getByPlaceholder("enter your passsword").fill("Navya@123");
    await page.getByRole("button", {name: 'login'}).click();
    await page.locator("div.card-body").filter({hasText: 'iphone 13 pro'}).getByRole("button", {name: ' Add To Cart'}).click();
    await page.locator("[routerlink='/dashboard/cart']").click();
    await page.locator("div[class='cartSection']").waitFor();
    expect(await page.locator("div[class='cartSection'] h3")).toHaveText("iphone 13 pro");
    await page.getByRole("button", {name: "Checkout"}).click();
    await page.locator("select[class='input ddl']").first().selectOption('12');
    await page.locator("select[class='input ddl']").last().selectOption('25');
    expect(await page.locator("[style*='gray']")).toHaveText(userEmail);
    await page.locator(".small input").nth(0).fill("454");
    await page.locator(".field .txt").nth(2).fill("Navya");
    await page.locator(".field .txt").nth(3).fill("rahulshettyacademy");
    await page.getByRole("button", {name: 'Apply Coupon'}).click();
    await expect(page.locator('p:has-text("* Coupon Applied")')).toBeVisible();
    await page.getByPlaceholder("Select Country").pressSequentially("Ind", {delay:150});
    await page.locator("span[class='ng-star-inserted']").filter({hasText: /^ India$/}).click();
    await page.locator(".action__submit").click();
    const OrderId = await page.locator("label[class='ng-star-inserted']").textContent();
    const SplitOrderID = OrderId.split(" ");
    const exactOrderID = SplitOrderID[2].trim();
    expect(await page.locator("h1")).toHaveText(" Thankyou for the order. ");
    await page.getByRole("button", {name: 'ORDERS'}).click();
    expect (await page.locator('tbody tr:has(th:has-text("'+exactOrderID+'"))')).toBeVisible();
    await page.locator('tbody tr:has(th:has-text("'+exactOrderID+'"))').getByRole("button",{name: 'View'}).click();
});

test("HandlingCalendars", async({browser}) =>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    for(let i=0; i<3; i++){
        console.log(await page.locator(".react-date-picker__inputGroup__input").nth(i).inputValue());
    }
    const dateArray = [12, 12, 2025];
    await page.locator("input.react-date-picker__inputGroup__input").first().click();
    await page.locator("span.react-calendar__navigation__label__labelText").click();
    await page.locator("span.react-calendar__navigation__label__labelText").click();
    await page.getByRole("button", {name: '2025'}).click();
    await page.locator("button.react-calendar__year-view__months__month").nth(11).click();
    await page.locator("button.react-calendar__month-view__days__day").filter({hasText:'12'}).click();
    for(let i=0; i<3; i++){
        const CalendarText = await page.locator("input.react-date-picker__inputGroup__input").nth(i).textContent();
        
    }
});