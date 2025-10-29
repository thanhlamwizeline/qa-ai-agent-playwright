import { Page } from "@playwright/test"

export class TestHelpers{

    static async waitForNumberOfSeconds(page: Page, numberOfSecond: number){
        await page.waitForTimeout(numberOfSecond * 1000)
    }
}