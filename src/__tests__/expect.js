/** Custom expect functions. */
expect.extend({
  toBeSameDayAs(received, expected) {
    if (!(expected instanceof Date)) {
      throw new Error(`${expected} must be a valid date`);
    }
    if (!(received instanceof Date)) {
      return {
        pass: false,
        message: () => `Expected ${received} to be a valid date`,
      };
    }

    const same =
      received.getUTCFullYear() === expected.getUTCFullYear() &&
      received.getUTCMonth() === expected.getUTCMonth() &&
      received.getUTCDate() === expected.getUTCDate();

    return same
      ? {
          pass: true,
          message: () =>
            `Expected ${received} to not be the same day as ${expected}`,
        }
      : {
          pass: false,
          message: () =>
            `Expected ${received} to be the same day as ${expected}`,
        };
  },
});
