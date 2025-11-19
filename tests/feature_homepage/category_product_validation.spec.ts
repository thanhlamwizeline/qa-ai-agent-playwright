import { test, expect } from '@playwright/test';
import { POManager } from '../../page-objects/POManager';

test.describe('Category Product Validation', () => {
  test('@QAAGENT-46 Verify that Product is displayed correctly according to selected Category', async ({ page }) => {
    const poManager = new POManager(page);
    
    // Navigate to Homepage
    await poManager.getHomepage().navigateToHomepage();
    
    // Select Categories "Phones" and verify product
    await poManager.getHomepage().clickCategory('Phones');
    await poManager.getHomepage().verifyProductIsDisplayed('Samsung galaxy s6');
    
    // Select Categories "Laptops" and verify product
    await poManager.getHomepage().clickCategory('Laptops');
    await poManager.getHomepage().verifyProductIsDisplayed('Sony vaio i5');
    
    // Select Categories "Monitors" and verify product
    await poManager.getHomepage().clickCategory('Monitors');
    await poManager.getHomepage().verifyProductIsDisplayed('Apple monitor 24');
  });
});