import { Given, When, Then } from "@cucumber/cucumber"
import { CustomWorld } from '../helpers/world'

Then ('I see the product details shows product name {string} with price {string}', async function (this: CustomWorld, productName, productPrice) {
    await this.poManager.getProductDetailPage().verifyProductDetail(productName, productPrice)
  });

  Then('I am redirected to the product detail page', async function(this: CustomWorld){
    await this.poManager.getProductDetailPage().verifyProductDetailPageLoadsSuccessfully()
  });

  When('I add product to Cart', async function (this: CustomWorld) {
    await this.poManager.getProductDetailPage().addToCart()
  });