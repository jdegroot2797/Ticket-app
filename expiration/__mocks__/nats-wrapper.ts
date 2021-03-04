// export just like the real natsWrapper
// this will be a fake implementation for testing with Jest test suite
export const natsWrapper = {
  // client has a publish function
  // publish(string, string, callback => void)
  client: {
    // mock of abstract class: base-publisher behaviour
    // https://jestjs.io/docs/en/mock-function-api
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        },
      ),
  },
};
