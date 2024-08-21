import asyncHandler from "express-async-handler";
import { chromium } from "playwright";

// @route   POST /api/pw/exe
// @access  Public

const execution = asyncHandler(async (req, res) => {
  const { playwright_test_steps } = req.body;
  if (playwright_test_steps) {
    try {
      (async () => {
        const browser = await chromium.launch({
          headless: false,
        });
        const context = await browser.newContext();
        const page = await context.newPage();

        for (let i = 0; i < playwright_test_steps.length; i++) {
          try {
            await eval(
              playwright_test_steps[i]
                .replace("page", "page")
                .replace("await ", "")
            );
            console.log(`Test step ${i} passed`);
          } catch (error) {
            console.log(`Test step ${i} failed: ${error.message}`);
            await page.screenshot({ path: `error-${i}.png` });
            throw new Error(`Error executing test step ${i}: ${error.message}`);
          }
        }

        await context.close();
        await browser.close();
      })();

      res.json({
        message: "Test steps executed successfully",
        playwright_test_steps,
      });
    } catch (error) {
      await browser.close();
      res.status(500).json({
        message: "Error executing test steps",
        error: error.message,
      });
    }
  } else {
    res.status(401);
    throw new Error("Invalid Script");
  }
});

export { execution };
