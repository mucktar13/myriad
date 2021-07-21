import {useState} from 'react';

import {useAlertHook} from './use-alert.hook';

import Axios, {AxiosError} from 'axios';
import {SocialsEnum} from 'src/interfaces/index';

const MyriadAPI = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const useShareSocial = (publicKey?: string) => {
  const {showAlert} = useAlertHook();

  const [sharing, setSharing] = useState(false);
  const [isShared, setShared] = useState(false);

  const handleError = (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 404:
          showAlert({
            title: 'Error',
            message: 'Profile already used',
            severity: 'error',
          });
          break;

        default:
          showAlert({
            title: 'Error',
            message: 'Profile already used',
            severity: 'error',
          });
          break;
      }
    }
  };

  const verifyPublicKeyShared = async (platform: SocialsEnum, username: string) => {
    if (!publicKey) return;

    setSharing(true);

    try {
      await MyriadAPI.request({
        method: 'POST',
        url: '/verify',
        data: {
          username,
          publicKey,
          platform,
        },
      });

      setShared(true);
    } catch (error) {
      const err = error as AxiosError;

      handleError(err);
    } finally {
      setSharing(false);
    }
  };

  const shareOnFacebook = async (username: string) => {
    if (!publicKey) return;

    setSharing(true);

    try {
      await MyriadAPI.request({
        method: 'POST',
        url: '/verify',
        data: {
          username,
          publicKey,
          platform: SocialsEnum.FACEBOOK,
        },
      });
      setShared(true);
    } catch (error) {
      const err = error as AxiosError;

      handleError(err);
    } finally {
      setSharing(false);
    }
  };

  const shareOnReddit = async (username: string) => {
    if (!publicKey) return;

    setSharing(true);

    try {
      await MyriadAPI.request({
        method: 'POST',
        url: '/verify',
        data: {
          username,
          publicKey,
          platform: SocialsEnum.REDDIT,
        },
      });

      setShared(true);
    } catch (error) {
      const err = error as AxiosError;

      handleError(err);
    } finally {
      setSharing(false);
    }
  };

  const shareOnTwitter = async (username: string) => {
    if (!publicKey) return;

    setSharing(true);

    try {
      await MyriadAPI.request({
        method: 'POST',
        url: '/verify',
        data: {
          username,
          publicKey,
          platform: SocialsEnum.TWITTER,
        },
      });

      setShared(true);
    } catch (error) {
      const err = error as AxiosError;

      handleError(err);
    } finally {
      setSharing(false);
    }
  };

  return {
    sharing,
    isShared,
    verifyPublicKeyShared,
    shareOnFacebook,
    shareOnReddit,
    shareOnTwitter,
  };
};
