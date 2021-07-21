import React, {useEffect, useImperativeHandle} from 'react';
import {useSelector} from 'react-redux';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SortIcon from '@material-ui/icons/Sort';

import {useStyles} from './transaction-style';
import TransactionListComponent from './transactionList.component';

import {useTransaction} from 'src/hooks/use-transaction.hooks';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type StyledComponentProps = {
  className?: string;
};

interface TransactionProps {
  forwardedRef: React.ForwardedRef<any>;
  detailed?: boolean;
}

const TransactionComponent: React.FC<TransactionProps> = ({forwardedRef, detailed}) => {
  const styles = useStyles();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {loading, error, transactions, loadInitTransaction} = useTransaction();

  useEffect(() => {
    loadInitTransaction();
  }, []);

  useImperativeHandle(forwardedRef, () => ({
    triggerRefresh: () => {
      loadInitTransaction();
    },
  }));

  if (!user) return null;

  const TippingJarHeader = () => {
    return (
      <div className={styles.rootPanel}>
        <Typography variant="h4" className={styles.panelHeader}>
          {'My Tipping Jar'}
        </Typography>
        <ActionButtonComponent className={styles.panelButtons} />
      </div>
    );
  };

  const LoadingComponent = () => {
    return (
      <Grid container justify="center">
        <CircularProgress className={styles.loading} />
      </Grid>
    );
  };

  const ErrorComponent = () => {
    return (
      <Grid container justify="center">
        <Typography>Error, please try again later!</Typography>
      </Grid>
    );
  };

  const ActionButtonComponent = ({className}: StyledComponentProps) => {
    return (
      <div className={className}>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          className={styles.iconButton}
          startIcon={<SortIcon />}>
          Sort by
        </Button>
        <Button variant="contained" color="default" size="medium" className={styles.iconButton}>
          Amount
        </Button>
        <Button variant="contained" color="default" size="medium" className={styles.iconButton}>
          Date
        </Button>
      </div>
    );
  };

  const EmptyTransactionComponent = () => {
    return (
      <Grid container justify="center">
        <Typography>Data not available</Typography>
      </Grid>
    );
  };

  return (
    <div ref={forwardedRef}>
      <TippingJarHeader />
      {loading ? (
        <LoadingComponent />
      ) : error ? (
        <ErrorComponent />
      ) : transactions.length === 0 ? (
        <EmptyTransactionComponent />
      ) : (
        <TransactionListComponent transactions={transactions} user={user} />
      )}
    </div>
  );
};

export default TransactionComponent;
