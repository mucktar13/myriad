import {BN} from '@polkadot/util';

import {BalanceDetail} from './balance';
import {BaseModel} from './base.interface';

import {Currency, CurrencyId} from 'src/interfaces/currency';
import {Post} from 'src/interfaces/post';
import {UserOnTransaction, UserWallet} from 'src/interfaces/user';
import {WalletDetail} from 'src/interfaces/wallet';

export type TransactionProps = {
  hash: string;
  amount: number;
  type?: string;
  referenceId?: string;
  from: string;
  to: string;
  currencyId: string;
};

export type SimpleSendTipProps = {
  from: string;
  to: string;
  type?: string;
  referenceId?: string;
  amount: BN;
  currency: BalanceDetail;
  walletDetail: WalletDetail;
};

// TODO: to be refactored, changed into TransactionHistoryDetail
export interface Transaction extends TransactionProps, BaseModel {
  fromWallet?: UserWallet;
  toWallet?: UserWallet;
  post?: Post;
  currency: Currency;
}
export interface TransactionDetail {
  currencyId: CurrencyId;
  amount: number;
}

export type TransactionHistoryDetail = {
  id: string;
  hash: string;
  amount: number;
  createdAt: string;
  updatedAt?: string;
  from: UserOnTransaction;
  to: UserOnTransaction;
  currency: Currency;
};

export type TransactionSort = 'highest' | 'latest';

export enum TransactionOrderType {
  HIGHEST = 'highest',
  LOWEST = 'lowest',
  LATEST = 'latest',
}

export type TransactionInfo = {
  userId: string;
  walletId: string;
  currencyIds: string[];
};
