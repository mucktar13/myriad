import {BN} from '@polkadot/util/bn';

import {BalanceDetail} from '../interfaces/balance';
import {CurrencyId} from '../interfaces/currency';

import remove from 'lodash/remove';

// TODO: check if needs to be removed
export const formatNumber = (number: number, decimals: number): number => {
  if (number.toString() === '0') return 0;
  const result = Number((Number(number.toString()) / 10 ** decimals).toFixed(5));
  return result;
};

// TODO: check if needs to be removed
export const formatUsd = (value: number, conversion: number): string => {
  if (value * conversion === 0) return '';
  return (value * conversion).toFixed(2);
};

export const removeMyriad = (balanceDetails: BalanceDetail[]): BalanceDetail[] => {
  const newCoins = [...balanceDetails];

  const myriadlessCoins = remove(newCoins, function (n) {
    return n.id !== CurrencyId.MYRIA;
  });

  return myriadlessCoins;
};

export const formatBalance = (value: BN, decimal: number, length = 10): number => {
  const MAX_DECIMAL = 16;

  if (value.lten(0)) return 0;

  let balance = (+value.toString() / 10 ** decimal)
    .toFixed(Math.max(MAX_DECIMAL, length))
    .replace(/\.?0+$/, '');

  if (length > MAX_DECIMAL) {
    balance += '0'.repeat(length - MAX_DECIMAL);
  }

  const isDecimalValue = balance.match(/^(\d+)\.(\d+)$/);

  if (isDecimalValue) {
    const div = balance.replace(/\.\d*$/, '');
    const mod = balance.replace(/^\d+\./, '').substr(0, length - div.length);

    if (parseInt(div) === 0) {
      return parseFloat(`0.${mod}`);
    } else {
      return parseFloat(`${div}.${mod}`);
    }
  }

  return +balance.slice(0, length);
};
