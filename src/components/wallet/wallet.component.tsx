import React, { useRef } from 'react';

import Button from '@material-ui/core/Button';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import Divider from '../common/divider.component';
import Panel from '../common/panel.component';
import { GetMyriaTutorial } from './GetMyriaTutorial.component';
import { BalanceComponent } from './balance.component';
import { TransactionComponent } from './transaction.component';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%'
    },
    button: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.common.white,
      borderRadius: 15
    }
  })
);

export const Wallet = React.memo(function Wallet() {
  const style = useStyles();
  const childRef = useRef<any>();

  const handleClickTutorial = () => {
    childRef.current.triggerMyriaTutorial();
  };

  const WalletAction = (
    <Button onClick={handleClickTutorial} variant="contained" className={style.button}>
      Get Myria Token
      {
        // Call a dialog, put text in it
        // Click Edit Your Profile - Copy Mnemonic Seed - Open your Polkadot Extension - Click on + symbol - Import Account from Pre-existing seed - Paste the mnemonic seed - Choose Myriad on Network column - Next - Define your Account name (this is modifiable) - Define your password (don't forget this as you'd need this to sign a transaction!) - Done!
      }
    </Button>
  );

  return (
    <>
      <Panel title="Wallet" actions={WalletAction}>
        <BalanceComponent />
        <Divider />
        <TransactionComponent />
      </Panel>

      <GetMyriaTutorial ref={childRef} />
    </>
  );
});
