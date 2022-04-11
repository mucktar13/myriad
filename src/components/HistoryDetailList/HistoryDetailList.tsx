import React, {useState, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import {historyAmountSortOptions, historyTransactionSortOptions} from '../Timeline/default';
import {Avatar, AvatarSize} from '../atoms/Avatar';
import {MenuOptions} from '../atoms/DropdownMenu';
import {DropdownMenu} from '../atoms/DropdownMenu';
import {useStyles} from './history-detail-list.styles';

import _ from 'lodash';
import {Loading} from 'src/components/atoms/Loading';
import {formatUsd} from 'src/helpers/balance';
import {timeAgo} from 'src/helpers/date';
import {parseScientificNotatedNumber} from 'src/helpers/number';
import {useExchangeRate} from 'src/hooks/use-exchange-rate.hook';
import {CurrencyId} from 'src/interfaces/currency';
import {Transaction} from 'src/interfaces/transaction';
import {NetworkTypeEnum} from 'src/lib/api/ext-auth';

type metaTrxProps = {
  currentPage: number;
  itemsPerPage: number;
  nextPage?: number;
  totalPageCount: number;
};

type HistoryDetailListProps = {
  allTxs: Transaction[];
  outboundTxs: Transaction[];
  inboundTxs: Transaction[];
  isLoading: boolean;
  userId: string;
  meta: metaTrxProps;
  nextPage: () => void;
};

export const HistoryDetailList: React.FC<HistoryDetailListProps> = props => {
  const {allTxs, meta, inboundTxs, outboundTxs, userId, nextPage} = props;

  const classes = useStyles();
  const {loading, exchangeRates} = useExchangeRate();

  const [sortOptions, setSortOptions] = useState<MenuOptions<string>[]>([]);
  const [defaultTxs, setDefaultTxs] = useState<Transaction[]>([]);
  const namePlaceholder = 'Unknown Myrian';

  useEffect(() => {
    const validTxs = allTxs.filter(tx => Boolean(tx.currency));

    const transactionCurrency = validTxs.map(tx => ({
      id: tx.currency.id,
      title: tx.currency.symbol,
    }));
    const filterOptions = getUniqueListBy(transactionCurrency, 'id');

    setSortOptions(filterOptions);
    setDefaultTxs(validTxs);
  }, [allTxs]);

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const getUniqueListBy = (arr: Array<any>, key: string) => {
    return [...new Map(arr.map(item => [item[key], item])).values()];
  };

  const getConversion = (currencyId: string) => {
    if (loading) {
      return 0;
    }

    const found = exchangeRates.find(exchangeRate => exchangeRate.id === currencyId);

    if (found) return found.price;
    return 0;
  };

  const handleSortChange = (sort: string) => {
    switch (sort) {
      case 'highest': {
        const sortedHighest = _.orderBy(defaultTxs, 'amount', 'desc');
        setDefaultTxs(sortedHighest);
        break;
      }

      case 'latest': {
        const sortedLatest = _.orderBy(defaultTxs, 'createdAt', 'desc');
        setDefaultTxs(sortedLatest);
        break;
      }

      case 'lowest': {
        const sortedLatest = _.orderBy(defaultTxs, 'amount', 'asc');
        setDefaultTxs(sortedLatest);
        break;
      }

      default: {
        break;
      }
    }
  };

  const handleTransactionChange = (filterByTransactionDirection: string) => {
    switch (filterByTransactionDirection) {
      case 'received': {
        setDefaultTxs(inboundTxs);
        break;
      }

      case 'sent': {
        setDefaultTxs(outboundTxs);
        break;
      }

      case 'failed': {
        setDefaultTxs(outboundTxs);
        break;
      }

      default: {
        setDefaultTxs(allTxs);
        break;
      }
    }
  };

  const handleCurrencyChange = (filterByCurrency: string) => {
    switch (filterByCurrency) {
      case CurrencyId.ACA: {
        const filteredByACA = _.filter(allTxs, tx => tx.currency.symbol === 'ACA');
        setDefaultTxs(filteredByACA);
        break;
      }

      case CurrencyId.DOT: {
        const filteredByDOT = _.filter(allTxs, tx => tx.currency.symbol === 'DOT');
        setDefaultTxs(filteredByDOT);
        break;
      }

      case CurrencyId.AUSD: {
        const filteredByAUSD = _.filter(allTxs, tx => tx.currency.symbol === 'AUSD');
        setDefaultTxs(filteredByAUSD);
        break;
      }

      case CurrencyId.MYRIA: {
        const filteredByMYRIA = _.filter(allTxs, tx => tx.currency.symbol === 'MYRIA');
        setDefaultTxs(filteredByMYRIA);
        break;
      }

      default: {
        setDefaultTxs(allTxs);
        break;
      }
    }
  };

  return (
    <>
      <div className={classes.headerActionWrapper}>
        <DropdownMenu
          title={'Sort'}
          options={historyAmountSortOptions}
          onChange={handleSortChange}
        />
        <div className={classes.sortCoin}>
          <DropdownMenu title={'Coin'} options={sortOptions} onChange={handleCurrencyChange} />
        </div>
        <DropdownMenu
          title={'Transaction'}
          options={historyTransactionSortOptions}
          onChange={handleTransactionChange}
        />
      </div>
      <TableContainer component={List}>
        <Table className={classes.root} aria-label="history details table">
          <TableBody>
            {defaultTxs.length === 0 ? (
              <TableRow className={classes.loading}>
                <CircularProgress />
              </TableRow>
            ) : (
              <InfiniteScroll
                dataLength={allTxs.length}
                hasMore={meta.currentPage < meta.totalPageCount}
                next={nextPage}
                loader={<Loading />}
                className={classes.infiniteScroll}>
                {defaultTxs.length > 0 &&
                  defaultTxs.map(tx => (
                    <a
                      key={tx.id}
                      style={{textDecoration: 'none'}}
                      //TODO: moved parsing for href to BE
                      href={
                        tx.currency.network.id === NetworkTypeEnum.NEAR
                          ? `${tx.currency.network.explorerURL}/transactions/${tx.hash}`
                          : `${tx.currency.network.explorerURL}/${tx.hash}`
                      }
                      target="_blank"
                      rel="noopener noreferrer">
                      <TableRow key={tx.id} className={classes.tableRow}>
                        <TableCell component="th" scope="row" className={classes.tableCell}>
                          <Avatar
                            size={AvatarSize.MEDIUM}
                            alt={
                              tx.toWallet?.userId === userId
                                ? tx.fromWallet?.userId
                                : tx.toWallet?.userId
                            }
                            src={
                              tx.toWallet?.userId === userId
                                ? tx.fromWallet?.user.profilePictureURL ?? namePlaceholder
                                : tx.toWallet?.user.profilePictureURL ?? namePlaceholder
                            }
                            name={
                              tx.toWallet?.userId === userId
                                ? tx.fromWallet?.user.name ?? namePlaceholder
                                : tx.toWallet?.user.name ?? namePlaceholder
                            }
                          />

                          <div>
                            <Typography variant="body1">
                              {tx.toWallet?.userId === userId
                                ? tx.fromWallet?.user.name ?? namePlaceholder
                                : tx.toWallet?.user.name ?? namePlaceholder}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {timeAgo(tx.createdAt)}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          {tx.toWallet?.userId === userId && (
                            <div className={classes.received}>
                              <Typography variant="caption">Received</Typography>
                            </div>
                          )}
                          {tx.fromWallet?.userId === userId && (
                            <div className={classes.sent}>
                              <Typography variant="caption">Sent</Typography>
                            </div>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <div className={classes.currencyDetailWrapper}>
                            <div>
                              {tx.toWallet?.userId === userId && (
                                <Typography variant="h5" className={classes.textAmountReceived}>
                                  {parseScientificNotatedNumber(+tx.amount)} {tx.currency.name}
                                </Typography>
                              )}
                              {tx.fromWallet?.userId === userId && (
                                <Typography variant="h5" className={classes.textAmountSent}>
                                  {parseScientificNotatedNumber(+tx.amount)} {tx.currency.name}
                                </Typography>
                              )}
                              <Typography variant="caption" color="textSecondary">
                                {`~${formatUsd(tx.amount, getConversion(tx.currencyId))} USD`}
                              </Typography>
                            </div>
                            <div>
                              <Avatar
                                name={tx.currency.name}
                                size={AvatarSize.TINY}
                                alt={tx.currency.name}
                                src={tx.currency.image}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </a>
                  ))}
              </InfiniteScroll>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
