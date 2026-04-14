import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("form surfaces invalid state through error and input validity", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("form-section");
  const invalidField = section.getByTestId("form-invalid-input");
  const validField = section.getByTestId("form-valid-input");
  const error = section.getByTestId("form-error");
  const helper = section.getByTestId("form-helper");

  await expect(error).toHaveText("Required field");
  await expect(section.getByText("Helpful instructions")).toHaveCount(0);
  await expect(helper).toHaveText("Send a work email we can reach.");

  const invalidFieldAttributes = await invalidField.evaluate((element) => {
    const input = element as HTMLInputElement;
    return {
      customError: input.validity.customError,
      ariaDescribedBy: input.getAttribute("aria-describedby"),
      ariaErrorMessage: input.getAttribute("aria-errormessage"),
      ariaInvalid: input.getAttribute("aria-invalid"),
      ariaLabelledBy: input.getAttribute("aria-labelledby"),
    };
  });

  const errorId = await error.getAttribute("id");
  const nameLabelId = await section
    .getByText("Name", { exact: true })
    .getAttribute("id");

  expect(invalidFieldAttributes.customError).toBe(true);
  expect(invalidFieldAttributes.ariaDescribedBy).toBe(errorId);
  expect(invalidFieldAttributes.ariaErrorMessage).toBe(errorId);
  expect(invalidFieldAttributes.ariaInvalid).toBe("true");
  expect(invalidFieldAttributes.ariaLabelledBy).toBe(nameLabelId);

  const validFieldAttributes = await validField.evaluate((element) => {
    const input = element as HTMLInputElement;
    return {
      ariaDescribedBy: input.getAttribute("aria-describedby"),
      ariaErrorMessage: input.getAttribute("aria-errormessage"),
      ariaInvalid: input.getAttribute("aria-invalid"),
      ariaLabelledBy: input.getAttribute("aria-labelledby"),
    };
  });

  const helperId = await helper.getAttribute("id");
  const emailLabelId = await section
    .getByText("Email", { exact: true })
    .getAttribute("id");

  expect(validFieldAttributes.ariaDescribedBy).toBe(helperId);
  expect(validFieldAttributes.ariaErrorMessage).toBeNull();
  expect(validFieldAttributes.ariaInvalid).toBeNull();
  expect(validFieldAttributes.ariaLabelledBy).toBe(emailLabelId);
});
