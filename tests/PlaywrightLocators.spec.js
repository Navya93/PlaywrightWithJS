const { test, expect } = require('@playwright/test');

test('TC01', async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/?utm_source=chatgpt.com');
    const RegisterLink = page.getByRole('link', { name: 'Register' });
    await expect(RegisterLink).toBeVisible();
    const LoginLink = page.getByRole('link', { name: 'Log in' });
    await expect(LoginLink).toBeVisible();
    const ShoppingCartLink = page.getByRole('link', { name: 'Shopping cart' }).first();
    await expect(ShoppingCartLink).toBeVisible();
    const WishlistLink = page.getByRole('link', { name: 'Wishlist' }).first();
    await expect(WishlistLink).toBeVisible();
    await expect(page.getByText('Welcome to our store')).toBeVisible();
    await expect(page.getByRole('link', {name: 'BOOKS'}).first()).toBeVisible();
    await expect(page.getByRole('link', {name: 'Computers'}).first()).toBeVisible();
    await expect(page.getByRole('link', {name: 'Electronics'}).first()).toBeVisible();
    await expect(page.getByRole('link', {name: 'Apparel & Shoes'}).first()).toBeVisible();
    await expect(page.getByRole('link', {name: 'Digital downloads'}).first()).toBeVisible();
    await expect(page.getByRole('link', {name: 'Jewelry'}).first()).toBeVisible();
    await expect(page.getByRole('link', {name: 'Gift Cards'}).first()).toBeVisible();
});

test('TC02', async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/?utm_source=chatgpt.com');
    await page.locator('#small-searchterms').fill('laptop');
    await page.press('#small-searchterms', 'Enter');
    await expect(page.getByRole('link', { name: '14.1-inch Laptop' }).last()).toBeVisible();
    await expect(page.locator('.search-text')).toHaveAttribute('value', 'laptop');
});

test('TC03', async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/?utm_source=chatgpt.com');
    await page.locator('#small-searchterms').fill('14.1-inch Laptop');
    await page.press('#small-searchterms', 'Enter');
    await page.getByAltText('Picture of 14.1-inch Laptop').click();
    await expect(page.getByRole('heading', { name: '14.1-inch Laptop' })).toBeVisible();
    await expect(page.locator('.price-value-31')).toHaveText('1590.00');
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await expect(page.locator('.cart-qty')).toHaveText('(1)');
    await page.getByRole('link', { name: 'Shopping cart' }).first().click();
    await expect(page.locator('.product-name')).toHaveText('14.1-inch Laptop');
});

test('TC04', async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/?utm_source=chatgpt.com');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('radio', { name: 'Female' }).check();
    await page.getByLabel('First name:').fill('Navya');
    await page.getByLabel('Last name:').fill('M');
    await page.getByLabel('Email:').fill('navya');
    await page.getByLabel('Password:').first().fill('Password123');
    await page.getByLabel('Confirm password:').fill('Password1234');
    await page.locator('#register-button').click();
    await expect.soft(page.locator('.field-validation-error').first()).toHaveText('Wrong email');
    await expect.soft(page.locator('.field-validation-error').last()).toHaveText('The password and confirmation password do not match.'); 
});
