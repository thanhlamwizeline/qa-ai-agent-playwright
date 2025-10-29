import { When, Then } from "@cucumber/cucumber"
import { CustomWorld } from '../helpers/world'
import { expect } from "@playwright/test"

/**
 * Common step definitions for AI-generated automation tests
 * These steps provide reusable actions for interacting with web elements using XPath locators
 */

// Step: I see "text" in element with xpath "xpath_locator"
Then('I see {string} text in element with xpath {string}', async function (this: CustomWorld, expectedText: string, xpathLocator: string) {
  const element = this.page.locator(`xpath=${xpathLocator}`)
  await expect(element).toBeVisible({ timeout: 10000 })
  const actualText = await element.textContent()
  expect(actualText).toContain(expectedText)
})

// Step: I click on element with xpath "xpath_locator"
When('I click on element with xpath {string}', async function (this: CustomWorld, xpathLocator: string) {
  const element = this.page.locator(`xpath=${xpathLocator}`)
  await expect(element).toBeVisible({ timeout: 10000 })
  await element.click()
})

// Step: I see element with xpath "xpath_locator"
Then('I see element with xpath {string}', async function (this: CustomWorld, xpathLocator: string) {
  const element = this.page.locator(`xpath=${xpathLocator}`)
  await expect(element).toBeVisible({ timeout: 10000 })
})

// Step: I see element with xpath "xpath_locator" contains "[expected_value]"
Then('I see element with xpath {string} contains {string}', async function (this: CustomWorld, xpathLocator: string, expectedValue: string) {
  const element = this.page.locator(`xpath=${xpathLocator}`)
  await expect(element).toBeVisible({ timeout: 10000 })

  // Check if the element contains the expected value in its text content or value attribute
  const textContent = await element.textContent()
  const inputValue = await element.inputValue().catch(() => null)

  const containsValue = (textContent && textContent.includes(expectedValue)) ||
                        (inputValue && inputValue.includes(expectedValue))

  expect(containsValue).toBeTruthy()
})

// Additional helper steps for common actions

// Step: I wait for {int} seconds
When('I wait for {int} seconds', async function (this: CustomWorld, seconds: number) {
  await this.page.waitForTimeout(seconds * 1000)
})

// Step: I type "text" into element with xpath "xpath_locator"
When('I type {string} into element with xpath {string}', async function (this: CustomWorld, text: string, xpathLocator: string) {
  const element = this.page.locator(`xpath=${xpathLocator}`)
  await expect(element).toBeVisible({ timeout: 10000 })
  await element.fill(text)
})

// Step: I clear element with xpath "xpath_locator"
When('I clear element with xpath {string}', async function (this: CustomWorld, xpathLocator: string) {
  const element = this.page.locator(`xpath=${xpathLocator}`)
  await expect(element).toBeVisible({ timeout: 10000 })
  await element.clear()
})

// Step: I see element with xpath "xpath_locator" is not visible
Then('I see element with xpath {string} is not visible', async function (this: CustomWorld, xpathLocator: string) {
  const element = this.page.locator(`xpath=${xpathLocator}`)
  await expect(element).not.toBeVisible()
})

// Step: I see element with xpath "xpath_locator" is enabled
Then('I see element with xpath {string} is enabled', async function (this: CustomWorld, xpathLocator: string) {
  const element = this.page.locator(`xpath=${xpathLocator}`)
  await expect(element).toBeEnabled({ timeout: 10000 })
})

// Step: I see element with xpath "xpath_locator" is disabled
Then('I see element with xpath {string} is disabled', async function (this: CustomWorld, xpathLocator: string) {
  const element = this.page.locator(`xpath=${xpathLocator}`)
  await expect(element).toBeDisabled({ timeout: 10000 })
})
