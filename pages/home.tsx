import React from 'react';

import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/client';

import Layout from '../src/components/Layout/Layout.container';
import Timeline from '../src/components/timeline/timeline.component';

import { healthcheck } from 'src/lib/api/healthcheck';

type Props = {
  session: Session | null;
};

export default function Home({ session }: Props) {
  return (
    <Layout session={session}>
      <Timeline />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { res } = context;
  const session = await getSession(context);

  if (!session) {
    res.writeHead(301, { location: `${process.env.NEXTAUTH_URL}` });
    res.end();
  }

  const available = await healthcheck();

  if (!available) {
    res.writeHead(302, { location: `${process.env.NEXTAUTH_URL}/maintenance` });
    res.end();
  }

  return {
    props: {
      session
    }
  };
};
