import { Then, When } from "@cucumber/cucumber"
import { CommonActions } from "../../pages/utils/CommonActions"
import { CustomWorld } from '../helpers/world'

When('I click on the product name {string} with price {string} on the home page', async function (this: CustomWorld, productName, productPrice) {
    await this.poManager.getHomepage().clickOnProduct(productName, productPrice)
  });

  When('I clear my shopping cart and back to home page', async function (this: CustomWorld) {
    await CommonActions.clearCart(this.poManager)
  });