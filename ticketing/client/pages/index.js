import axios from 'axios';

// this is a component (browser)
const landingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Hello</h1>;
};

//this is not a components (server)

// next js will call this function while attempting to render
// from the server and will be provided to the component as a prop.
// function will be exected on the server side.
landingPage.getInitialProps = async () => {
  //cannot use hooks outside of components
  //must use axios within getInitialProps to see whether user is authed or not

  //since this is being called from server therefore our client pod in k8s
  //it never reaches the ingress nginx router, node slaps on a localhost domain,
  //since this localhost is the pod it results in a connection error.
  const response = await axios.get('/api/users/currentuser');

  return response.data;
};

export default landingPage;
