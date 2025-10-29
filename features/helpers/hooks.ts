import { Before, After, Status} from '@cucumber/cucumber'
import { CustomWorld, setupWorld, teardownWorld } from './world'
import { POManager } from '../../pages/POManager'

Before(async function (this: CustomWorld) {
    // Perform setup actions that should run before each scenario
    await setupWorld.call(this)
    this.poManager = new POManager(this.page)
  });

  After(async function (this: CustomWorld, testCase) {
    // Perform teardown actions that should run after each scenario   
    if (testCase.result && testCase.result.status === Status.FAILED) {
      const screenshot = await this.page.screenshot();
      this.attach(screenshot, 'image/png'); // attach image when test case failed to the cucumber report
    }

    await teardownWorld.call(this)
  });
