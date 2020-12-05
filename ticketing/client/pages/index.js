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

// cannot use hooks outside of components
// must use axios within getInitialProps to see whether user is authed or not

// since this is being called from server therefore our client pod in k8s
// it never reaches the ingress nginx router, node slaps on a localhost domain,
// since this localhost is the pod it results in a connection error.

// will have to route to ingress-nginx to route to auth service and pass along a cookie.

// Window only exist in browser, does not exist in node.js
// with this we now know we are on the server and requests should be made to
// http://<service name>.<namespace name>.svc.cluster.local
landingPage.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on the server
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        // pass on headers (cookies) to auth service
        headers: req.headers,
      },
    );
    return data;
  } else {
    // we are on the browser and it will handle the base url for us
    const { data } = await axios.get('/api/users/currentuser');
    // { currentUser } object will be returned
    return data;
  }
};

export default landingPage;
