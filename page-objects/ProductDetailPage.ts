import { Locator, Page, expect } from '@playwright/test'
import { TestHelpers } from '../helpers/TestHelpers'
import {testconfig} from '../data/config/testconfig.ts'

export class ProductDetailPage {
  private readonly page: Page
  private readonly btn_AddToCart: Locator
  private readonly card_DetailBox: Locator
  private readonly product_Image: Locator

  constructor(page: Page) {
    this.page = page
    this.btn_AddToCart = page.getByRole('link', { name: 'Add to cart' })
    this.card_DetailBox = page.locator('#tbodyid')
    this.product_Image = page.locator('.product-image img')
  }

  async verifyProductDetailPageLoadsSuccessfully() {
    const prodURL = `${process.env.BASE_URL_E2E}/${testconfig.FE_URL.URL_PRODUCPAGE}`
    await this.page.waitForURL(new RegExp(`^${prodURL}`))
  }

  async verifyProductDetail(productName: string, productPrice: string) {
    await this.card_DetailBox
    .filter({hasText: productName})
    .filter({hasText: productPrice})
    .waitFor({state:"visible"})
  }

  async verifyProductImageIsCorrect(imageSrc: string) {
    await expect(this.product_Image).toHaveAttribute('src',imageSrc)
  }

  async verifyAddToCartButtonIsVisible() {
    await expect(this.btn_AddToCart).toBeVisible()
  }

  async addToCart() {
    await this.btn_AddToCart.click()
    await TestHelpers.waitForNumberOfSeconds(this.page, 2)
    this.page.on('dialog', async dialog => {
      expect(dialog.message()).toContain("Product added")
      await dialog.accept()
    })
  }

}