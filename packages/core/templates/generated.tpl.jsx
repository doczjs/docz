import Head from "next/head";
import Generated from "<%- importPath %>";
import db from "~/.docz/db.json";

export default function Page(props) {
  return (
    <>
      <Head>
        <title>{`${props.entry.name} | ${props.db.config.title}`}</title>
      </Head>
      <Generated />
    </>
  );
}

export async function getStaticProps() {
  const entry = db.entries.find(({ value: entry }) => {
    return entry.id === "<%- id %>";
  });

  return {
    props: { db, entry: entry.value },
  };
}
