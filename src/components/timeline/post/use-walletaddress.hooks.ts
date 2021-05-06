import { useState } from 'react';

import { useWalletAddress as baseUseWalletAddress, WalletAddressActionType } from './send-tip.context';

import * as WalletAddressAPI from 'src/lib/api/wallet';

export const useWalletAddress = (postId: string) => {
  const { state, dispatch } = baseUseWalletAddress();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await WalletAddressAPI.getWalletAddress(postId);

      dispatch({
        type: WalletAddressActionType.INIT_WALLET_ADDRESS,
        payload: data
      });
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    walletAddress: state.walletAddress,
    getWalletAddress: load
  };
};
