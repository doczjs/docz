import Head from 'next/head'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title><%- title %></title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
