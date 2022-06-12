import React from 'react';

import {getSession} from 'next-auth/react';
import getConfig from 'next/config';
import Head from 'next/head';

import {TrendingTab} from 'src/components/RightMenuBar/tabs/TrendingTab';
import {TopNavbarComponent} from 'src/components/atoms/TopNavbar';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import i18n from 'src/locale';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {
  setAnonymous,
  fetchConnectedSocials,
  fetchUser,
  fetchUserExperience,
  fetchUserWallets,
  fetchNetwork,
} from 'src/reducers/user/actions';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

const {publicRuntimeConfig} = getConfig();

const TopicPageComponent: React.FC = () => {
  return (
    <DefaultLayout isOnProfilePage={false}>
      <Head>
        <title>
          {publicRuntimeConfig.appName} - {i18n.t('Section.Trends')}
        </title>
      </Head>
      <TopNavbarComponent
        description={i18n.t('Section.Trends_Desc')}
        sectionTitle={i18n.t('Section.Trends')}
        type={'menu'}
      />
      <TrendingTab />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const dispatch = store.dispatch as ThunkDispatchAction;
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const anonymous = Boolean(session?.user.anonymous);
  const userId = session?.user.address as string;

  if (anonymous || !userId) {
    const username = session?.user.name as string;

    await dispatch(setAnonymous(username));
  } else {
    await dispatch(fetchUser(userId));

    await Promise.all([
      dispatch(fetchConnectedSocials()),
      dispatch(fetchAvailableToken()),
      dispatch(countNewNotification()),
      dispatch(fetchUserWallets()),
      dispatch(fetchNetwork()),
    ]);
  }

  await dispatch(fetchNetwork());
  await dispatch(fetchUserExperience());

  return {
    props: {
      session,
    },
  };
});

export default TopicPageComponent;
