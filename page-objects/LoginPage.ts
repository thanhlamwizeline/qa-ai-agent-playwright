import { Locator, Page, expect, Dialog } from '@playwright/test'
import { Navigation } from './components/NavigationComponent'

export class LoginPage {
  private readonly page: Page
  private readonly navigationComponent: Navigation
  private readonly txt_Username: Locator
  private readonly txt_Password: Locator
  private readonly btn_Login: Locator
  private dialog_LoginMessage!: Dialog

  constructor(page: Page) {
    this.page = page
    this.navigationComponent = new Navigation(this.page)
    this.txt_Username = page.locator('#loginusername')
    this.txt_Password = page.locator('#loginpassword')
    this.btn_Login = page.getByRole('button', { name: 'Log in' })
  }

  async login(username: string, password: string) {
    if (username == "undefined" || username == "") {
      throw new Error("user credential is null or empty. Aborting test.")
    }
    await this.txt_Username.fill(username)
    await this.txt_Password.fill(password)
    await this.btn_Login.click()
  }

  async verifyLoginSuccessfully(displayUserName: string){
    await expect.poll(() => this.navigationComponent.lbl_WelcomeInfo.textContent(), { timeout: 10000 }).toContain(displayUserName)
  }

  async verifyLoginFailedDialogIsDisplayed(){
    this.dialog_LoginMessage = await this.page.waitForEvent("dialog")
  }

  async verifyLoginFailedMessage(loginFailedMessage: string){
    if (!this.dialog_LoginMessage) {
      throw new Error('Login dialog not initialized. Call openLoginDialog() first.');
    }
    await expect(this.dialog_LoginMessage.message()).toEqual(loginFailedMessage)
  }
}