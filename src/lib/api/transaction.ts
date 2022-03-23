import MyriadAPI from './base';
import {PAGINATION_LIMIT} from './constants/pagination';
import {BaseList} from './interfaces/base-list.interface';
import {LoopbackWhere} from './interfaces/loopback-query.interface';
import {PaginationParams} from './interfaces/pagination-params.interface';

import {Transaction, TransactionProps} from 'src/interfaces/transaction';

type TransactionList = BaseList<Transaction>;

export const storeTransaction = async (values: TransactionProps): Promise<Transaction> => {
  const {data} = await MyriadAPI.request<Transaction>({
    url: '/transactions',
    method: 'POST',
    data: values,
  });

  return data;
};

export const getTransactions = async (
  options: Partial<TransactionProps>,
  page?: number,
): Promise<TransactionList> => {
  const where: LoopbackWhere<TransactionProps> = {};
  const include: Array<any> = [
    {
      relation: 'fromWallet',
      scope: {
        include: [{relation: 'user'}],
      },
    },
    {
      relation: 'toWallet',
      scope: {
        include: [{relation: 'user'}],
      },
    },
  ];

  if (options.referenceId) {
    where.referenceId = {eq: options.referenceId};
  }

  if (options.to && options.to !== options.from) {
    where.to = {eq: options.to};
  }

  if (options.from && options.from !== options.to) {
    where.from = {eq: options.from};
  }

  if (options.to === options.from) {
    where.or = [{to: options.to}, {from: options.from}];
  }

  if (options.currencyId) {
    where.currencyId = {eq: options.currencyId};
  }

  const {data} = await MyriadAPI.request<TransactionList>({
    url: '/transactions',
    method: 'GET',
    params: {
      pageNumber: page,
      pageLimit: PAGINATION_LIMIT,
      filter: {
        order: `createdAt DESC`,
        where,
        include,
      },
    },
  });

  return data;
};

export const getTransactionsIncludingCurrency = async (
  options: Partial<TransactionProps>,
  pagination: PaginationParams,
): Promise<TransactionList> => {
  const {page = 1, limit = PAGINATION_LIMIT, orderField = 'createdAt', sort = 'DESC'} = pagination;

  const where: LoopbackWhere<TransactionProps> = {};
  const include: Array<any> = [
    'currency',
    {
      relation: 'fromWallet',
      scope: {
        include: [{relation: 'user'}],
      },
    },
    {
      relation: 'toWallet',
      scope: {
        include: [{relation: 'user'}],
      },
    },
  ];

  if (options.referenceId) {
    where.referenceId = {eq: options.referenceId};
  }

  if (options.to && options.to !== options.from) {
    where.to = {eq: options.to};
  }

  if (options.from && options.from !== options.to) {
    where.from = {eq: options.from};
  }

  if (options.to === options.from) {
    where.or = [{to: options.to}, {from: options.from}];
  }

  const {data} = await MyriadAPI.request<TransactionList>({
    url: '/transactions',
    method: 'GET',
    params: {
      pageNumber: page,
      pageLimit: limit,
      filter: {
        order: [`${orderField} ${sort}`],
        where,
        include,
      },
    },
  });

  return data;
};

export const removeTransaction = async (transactionId: string): Promise<void> => {
  await MyriadAPI.request({
    url: `/transactions/${transactionId}`,
    method: 'DELETE',
  });
};
