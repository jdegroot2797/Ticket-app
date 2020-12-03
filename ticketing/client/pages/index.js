const landingPage = ({ test }) => {
  console.log('i am in the component', test);
  return <h1>Hello</h1>;
};

// next js will call this function while attempting to render
// from the server and will be provided to the component as a prop.
// function will be exected on the server side.
landingPage.getInitialProps = () => {
  console.log('server side!');

  return { test: 'hello world' };
};

export default landingPage;
