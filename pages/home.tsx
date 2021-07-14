import React, { useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import Grid from '@material-ui/core/Grid';
import NoSsr from '@material-ui/core/NoSsr';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import Layout from 'src/components/Layout/Layout.container';
import Timeline from 'src/components/timeline/timeline.component';
import TopicComponent from 'src/components/topic/topic.component';
import UserDetail from 'src/components/user/user.component';
import { Wallet } from 'src/components/wallet/wallet.component';
import { FriendsProvider } from 'src/context/friends.context';
import { useMyriadUser } from 'src/hooks/use-myriad-users.hooks';
import { useToken } from 'src/hooks/use-token.hook';
import { healthcheck } from 'src/lib/api/healthcheck';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    user: {
      width: 327,
      flex: '0 0 327px',
      marginRight: 0,
      'scrollbar-color': '#A942E9 #171717',
      'scrollbar-width': 'thin !important'
    },
    wallet: {
      width: 327
    },
    fullwidth: {
      width: 327
    },
    fullheight: {
      height: '100vh'
    },
    profile: {
      flexGrow: 1
    },
    content: {
      flex: 1,
      marginLeft: 'auto',
      marginRight: 'auto',
      padding: '0 24px 0 24px',
      height: '100vh',
      maxWidth: 726,
      [theme.breakpoints.up('xl')]: {
        maxWidth: 926
      }
    }
  })
);

export default function Home() {
  const style = useStyles();

  const [session, loading] = useSession();
  const router = useRouter();

  const isAnonymous = !!session?.user.anonymous;

  const { load } = useMyriadUser();

  const userId = session?.user.userId as string;
  const { loadAllUserTokens, userTokens } = useToken(userId);

  useEffect(() => {
    load();
    loadAllUserTokens();
  }, []);

  useEffect(() => {
    if (!session && !loading) {
      router.push('/');
    }
  }, [loading, session]);

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null;

  if (!session) return null;

  return (
    <Layout session={session}>
      <Grid item className={style.user}>
        <Grid container direction="row" justify="flex-start" alignContent="flex-start">
          <Grid item className={style.fullwidth}>
            <UserDetail user={session.user} isAnonymous={isAnonymous} />
          </Grid>
          <Grid item className={style.fullwidth}>
            <FriendsProvider>
              <NoSsr>
                <Wallet />
              </NoSsr>
            </FriendsProvider>

            <TopicComponent />
          </Grid>
        </Grid>
      </Grid>
      <Grid item className={style.content}>
        <Timeline isAnonymous={isAnonymous} availableTokens={userTokens} />
      </Grid>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { res } = context;

  const available = await healthcheck();

  if (!available) {
    res.writeHead(302, { location: `${process.env.NEXTAUTH_URL}/maintenance` });
    res.end();
  }

  return {
    props: {
      session: await getSession(context)
    }
  };
};
