import { Given, When, Then } from "@cucumber/cucumber"
import { CustomWorld } from "../helpers/world"

When('I go to the Cart page', async function (this: CustomWorld) {
    await this.poManager.getHomepage().goToCart()
})
Then('I am redirected to the cart page sucessfully', async function(this: CustomWorld) {
    await this.poManager.getCartPage().verifyCartPageLoadsSuccessfully()
})

Then('I see the cart list contains a product with name {string} and price {string}', {timeout: 2 * 5000}, async function name(this:CustomWorld, productName: string, productPrice: string) {
    await this.poManager.getCartPage().verifyProductInCart(productName,productPrice)
})