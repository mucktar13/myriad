import React from 'react';
import {useSelector} from 'react-redux';

import {Session} from 'next-auth';
import {getSession} from 'next-auth/client';

import {SearchResultContainer} from 'src/components/Search/SearchResultContainer';
import {DefaultLayout} from 'src/components/template/Default/DefaultLayout';
import {setHeaders} from 'src/lib/api/base';
import {healthcheck} from 'src/lib/api/healthcheck';
import {RootState} from 'src/reducers';
import {getUserCurrencies} from 'src/reducers/balance/actions';
import {fetchAvailableToken} from 'src/reducers/config/actions';
import {fetchExchangeRates} from 'src/reducers/exchange-rate/actions';
import {fetchExperience} from 'src/reducers/experience/actions';
import {fetchFriend} from 'src/reducers/friend/actions';
import {countNewNotification} from 'src/reducers/notification/actions';
import {setAnonymous, fetchConnectedSocials, fetchUser} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';
import {wrapper} from 'src/store';
import {ThunkDispatchAction} from 'src/types/thunk';

type SearchProps = {
  session: Session;
};

const Search: React.FC<SearchProps> = () => {
  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);

  if (!user && !anonymous) return null;

  return (
    <DefaultLayout isOnProfilePage={false}>
      <SearchResultContainer />
    </DefaultLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async context => {
  const {req} = context;
  const {headers} = req;

  const dispatch = store.dispatch as ThunkDispatchAction;

  if (typeof window === 'undefined' && headers['user-agent']) {
    const UAParser = eval('require("ua-parser-js")');
    const parser = new UAParser();
    const device = parser.setUA(headers['user-agent']).getDevice();

    if (device.type === 'mobile') {
      return {
        redirect: {
          destination: '/mobile',
          permanent: false,
          headers,
        },
      };
    }
  }

  const available = await healthcheck();

  if (!available) {
    return {
      redirect: {
        destination: '/maintenance',
        permanent: false,
      },
    };
  }

  const session = await getSession(context);

  setHeaders({cookie: req.headers.cookie as string});

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
    await dispatch(fetchUser());

    await Promise.all([
      dispatch(fetchConnectedSocials()),
      dispatch(fetchAvailableToken()),
      dispatch(countNewNotification()),
      dispatch(fetchExperience()),
      dispatch(getUserCurrencies()),
      dispatch(fetchFriend()),
    ]);
  }

  await dispatch(fetchExchangeRates());

  return {
    props: {
      session,
    },
  };
});
export default Search;
