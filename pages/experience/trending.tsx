import React from 'react';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import Head from 'next/head';

import {ExperienceTab} from 'src/components/RightMenuBar/tabs/ExperienceTab';
import {TopNavbarComponent} from 'src/components/atoms/TopNavbar';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import initialize from 'src/lib/api/base';
import i18n from 'src/locale';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExchangeRates} from 'src/reducers/exchange-rate/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {fetchServer} from 'src/reducers/server/actions';
import {
  fetchConnectedSocials,
  fetchUser,
  fetchUserExperience,
  fetchUserWallets,
  fetchNetwork,
} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const {publicRuntimeConfig} = getConfig();

type TrendingExperiencePageProps = {
  session: Session;
};

const ExperiencePageComponent: React.FC<TrendingExperiencePageProps> = props => {
  const {loadTrendingExperience} = useExperienceHook();

  React.useEffect(() => {
    loadTrendingExperience();
  }, []);

  return (
    <DefaultLayout isOnProfilePage={false} {...props}>
      <Head>
        <title>{publicRuntimeConfig.appName} - Experience</title>
      </Head>

      <TopNavbarComponent
        sectionTitle={i18n.t('Section.Trending_Experience')}
        description={i18n.t('Section.Trending_Experience_Desc')}
        type={'menu'}
      />

      <ExperienceTab experienceType="trending" />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;

  const dispatch = store.dispatch as ThunkDispatchAction;

  let session: Session | null = null;

  try {
    session = await getSession(context);
  } catch {
    // ignore
  }

  if (!session?.user || session?.user?.anonymous) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const sessionInstanceURL = session?.user?.instanceURL;

  initialize({cookie: req.headers.cookie});

  await dispatch(fetchUser());
  await Promise.all([
    dispatch(fetchServer(sessionInstanceURL)),
    dispatch(fetchNetwork()),
    dispatch(fetchAvailableToken()),
    dispatch(fetchExchangeRates()),
    dispatch(fetchUserExperience()),
    dispatch(fetchUserWallets()),
    dispatch(fetchConnectedSocials()),
    dispatch(countNewNotification()),
  ]);

  return {
    props: {
      session,
    },
  };
});

export default ExperiencePageComponent;
