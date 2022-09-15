import { MDXProvider } from "@mdx-js/react";

export default function MyApp({ Component, pageProps }) {
  return (
    <MDXProvider>
      <Component {...pageProps} />
    </MDXProvider>
  );
}
