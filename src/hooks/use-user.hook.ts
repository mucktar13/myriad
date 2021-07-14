import { useState } from 'react';

import { useUser, UserActionType } from 'src/context/user.context';
import { SocialsEnum } from 'src/interfaces';
import { ExtendedUser } from 'src/interfaces/user';
import { User } from 'src/interfaces/user';
import * as UserAPI from 'src/lib/api/user';
import { firebaseCloudMessaging } from 'src/lib/firebase';

export const useUserHook = (userId?: string) => {
  const { state: userState, dispatch } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const detail: ExtendedUser = await UserAPI.getUserDetail(userId);

      if (!detail.userCredentials) {
        detail.userCredentials = [];
      }

      dispatch({
        type: UserActionType.USER_LOADED,
        payload: detail
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const setAsAnonymous = () => {
    dispatch({
      type: UserActionType.SET_ANONYMOUS
    });
  };

  const disconnectSocial = async (social: SocialsEnum): Promise<void> => {
    const credential = userState.user?.userCredentials.find(credential => credential.people.platform === social);

    if (credential) {
      await UserAPI.disconnectSocial(credential.id);

      load();
    }
  };

  const updateUser = async (values: Partial<User>) => {
    if (!userId) return;

    await UserAPI.updateUser(userId, values);

    if (userState.user) {
      dispatch({
        type: UserActionType.USER_LOADED,
        payload: {
          ...userState.user,
          ...values
        }
      });
    } else {
      load();
    }
  };

  const loadFcmToken = async () => {
    await firebaseCloudMessaging.init();

    const token = await firebaseCloudMessaging.tokenInlocalforage();

    if (token) {
      updateUser({
        fcmTokens: [token as string]
      });
    }
  };

  return {
    error,
    loading,
    setAsAnonymous,
    getUserDetail: load,
    disconnectSocial,
    updateUser,
    loadFcmToken
  };
};
