import { Given, When, Then } from "@cucumber/cucumber"
import {BeforeAll} from "@cucumber/cucumber"
import { CommonActions } from "../../pages/utils/CommonActions"
import { CustomWorld } from '../helpers/world'
import { expect } from "@playwright/test"
 
import dotnet from "dotenv"
dotnet.config()

let normalUsername: string
let normalPassword: string

BeforeAll(async function() {
  normalUsername = `${process.env.username}`
  normalPassword = `${process.env.password}`
})

Given('I navigate to the home page', async function (this: CustomWorld) {
  await this.page.goto(`${process.env.BASE_URL_E2E}`)
});

When ('I login with to the page a normal user',{timeout: 2 * 5000}, async function(this: CustomWorld){
  await CommonActions.login(this.poManager, normalUsername, normalPassword)
})

Then ('I see the page shows the normal username on the navigation bar', async function(this: CustomWorld){
  await this.poManager.getHomepage().verifyWelcomUsernameOnNavigationBar(normalUsername)
})

When ('I login with username {string} and password {string}',{timeout: 2 * 5000}, async function(this: CustomWorld, username: string, password: string){
  await this.poManager.getHomepage().clickLogin()
  await this.poManager.getLoginPage().login(username, password)
})

When ('a login failed dialog should be displayed', async function(this: CustomWorld){
  await this.poManager.getLoginPage().verifyLoginFailedDialogIsDisplayed()
})

When ('I see the login dialog displays the message {string}', async function(this: CustomWorld, loginFailedMessage: string){
  await this.poManager.getLoginPage().verifyLoginFailedMessage(loginFailedMessage)
})


