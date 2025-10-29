Feature: Product Validation Test
    Feature Description: Product feature validation

    Background:
        Given I navigate to the home page
        When I login with to the page a normal user
        Then I see the page shows the normal username on the navigation bar
        
    @regression @smoke
    Scenario: Validate product cart
        When I clear my shopping cart and back to home page
        And I click on the product name "Iphone 6 32gb" with price "790" on the home page
        Then I am redirected to the product detail page
        And I see the product details shows product name "Iphone 6 32gb" with price "790"
        When I add product to Cart
        And I go to the Cart page
        Then I am redirected to the cart page sucessfully
        And I see the cart list contains a product with name "Iphone 6 32gb" and price "790"

    @regression @smoke
    Scenario Outline: Validate product list details
        When I click on the product name "<productName>" with price "<productPrice>" on the home page
        Then I am redirected to the product detail page
        And I see the product details shows product name "<productName>" with price "<productPrice>"

        Examples: 
        |productName        |productPrice   |
        |Samsung galaxy s7  |800            |
        |HTC One M9         |700            |


