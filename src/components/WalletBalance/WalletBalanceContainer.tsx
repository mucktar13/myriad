import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {Typography} from '@material-ui/core';

import {WalletBalances as WalletBalancesComponent} from '.';
import {usePolkadotApi} from '../../hooks/use-polkadot-api.hook';
import {RootState} from '../../reducers';
import {UserState} from '../../reducers/user/reducer';
import {BoxComponent} from '../atoms/Box';

import {BalanceDetail} from 'src/components/MyWallet';
import {BalanceState} from 'src/reducers/balance/reducer';

export const WalletBalancesContainer: React.FC = () => {
  const {user, currencies, anonymous} = useSelector<RootState, UserState>(state => state.userState);
  const {balanceDetails, currenciesId} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );

  const handleFilterCurrencies = () => {
    const data: BalanceDetail[] | [] = [];
    if (currenciesId.length) {
      balanceDetails.forEach(coin => {
        data[currenciesId.indexOf(coin.id)] = coin;
      });
    } else {
      return balanceDetails;
    }

    return data;
  };

  const [filteredBalances, setFilteredBalanced] = useState(handleFilterCurrencies());

  const {load} = usePolkadotApi();

  useEffect(() => {
    if (user) load(user.id, currencies);
  }, [currencies, user]);

  useEffect(() => {
    setFilteredBalanced(handleFilterCurrencies());
  }, [balanceDetails, currenciesId]);

  if (anonymous)
    return (
      <BoxComponent title="Wallet">
        <Typography>Please Login with polkadot account to access this feature</Typography>
      </BoxComponent>
    );

  return <WalletBalancesComponent balances={filteredBalances} />;
};

export default WalletBalancesContainer;
