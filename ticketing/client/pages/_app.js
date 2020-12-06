import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';


// Wrapper around component (our pages) which are displayed on the screen
// Eg: index.js
// this app file is guaranteed to include any global css
// or file when rendered onto the screen
// src: https://nextjs.org/docs/basic-features/built-in-css-support
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />;
    </div>
  );
};

// AppContext is different from page context in nextjs since
// _app.js wraps each of our pages. Likewise getInitialProps
// will act differently between these two scenarios.
AppComponent.getInitialProps = async (appContext) => {
  // get information for appComponent
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};

  // get information for specific page
  // can pass this information to header
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  console.log(pageProps);

  // returns and passes data to pageProps in AppComponent
  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default AppComponent;
