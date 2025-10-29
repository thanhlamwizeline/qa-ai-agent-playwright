import { Locator, Page } from "@playwright/test"
import { expect } from "@playwright/test"

export class Navigation {
    private readonly page: Page
    readonly lnk_LoginNav: Locator
    readonly lnk_LogoutNav: Locator
    readonly lnk_HomeNav: Locator
    readonly lnk_CartNav: Locator
    readonly lbl_WelcomeInfo: Locator

    constructor(page: Page){
        this.page = page
        this.lnk_LoginNav = page.getByRole('link', { name: 'Log in' })
        this.lnk_LogoutNav = page.getByRole('link', { name: 'Log out' })
        this.lnk_CartNav = page.getByRole('link', { name: 'Cart', exact: true  })
        this.lnk_HomeNav = page.getByRole("link", {name: 'Home'})
        this.lbl_WelcomeInfo = page.locator('#nameofuser')
    }

    async clickLoginNavLink(){
        await this.lnk_LoginNav.click()
    }

    async clickLogoutNavLink(){
        await this.lnk_LogoutNav.click()
    }

    async clickHomeNavLink(){
        await this.lnk_HomeNav.click()
    }

    async clickCartNavLink(){
        await this.lnk_CartNav.click()
    }

    async verifyLogoutNavLinkVisible() {
        await expect(this.lnk_LogoutNav).toBeVisible()
    }

    async verifyUsernameOnNavigationBar(username: string) {
        await expect(this.lbl_WelcomeInfo).toContainText("Welcome")
        await expect(this.lbl_WelcomeInfo).toContainText(username)
    }
}