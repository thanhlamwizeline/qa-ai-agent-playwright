Feature: Login Validation Test Suite
    Feature Description: Login Validation Test

    Background:
        Given I navigate to the home page
        
    @login @smoke
    Scenario: login sucessfully
        When I login with to the page a normal user
        Then I see the page shows the normal username on the navigation bar

    @login @smoke
    Scenario Outline: Login failed
        When I login with username "<username>" and password "<password>"
        Then a login failed dialog should be displayed
        And I see the login dialog displays the message "<errorMessage>"

    Examples:
    |username           |password               |errorMessage           |
    |valid_username     |invalid_password       |Wrong password.        |
    |valid_username     |randompassword         |Wrong password.        |