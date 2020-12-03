import 'bootstrap/dist/css/bootstrap.css';

// Wrapper around component (our pages) which are displayed on the screen
// Eg: index.js
// this app file is guaranteed to include any global css
// or file when rendered onto the screen
// src: https://nextjs.org/docs/basic-features/built-in-css-support
export default ({ Component, pageProps }) => {
    return <Component {...pageProps} />
};