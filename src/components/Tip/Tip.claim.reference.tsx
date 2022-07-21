import React, {useState} from 'react';

import {Typography, Button} from '@material-ui/core';

import {TipTotal} from '../TotalTips/TipTotal';
import {useStyles} from './tip.style';

import {TipResult} from 'src/interfaces/network';
import i18n from 'src/locale';

type TipClaimReference = {
  networkId: string;
  token?: string;
  txFee?: string;
  totalTipsData: TipResult[];
  onHandleVerifyRef: (networkId: string, currentBalance: string | number) => void;
};

export const TipClaimReference: React.FC<TipClaimReference> = ({
  networkId,
  totalTipsData,
  onHandleVerifyRef,
  txFee = '0.00',
  token = '',
}) => {
  const style = useStyles();
  const [isShowModalTotalTips, setIsShowModalTotalTips] = useState<boolean>(false);

  const onVerifyReference = () => {
    const tip = totalTipsData.find(item => item.tipsBalanceInfo.ftIdentifier === 'native');
    const currentBalance = tip ? tip.amount : '0.000';

    onHandleVerifyRef(networkId, currentBalance);
  };

  return (
    <>
      <div className={style.contentReference}>
        <Typography variant="h4" className={style.title} component="p">
          {i18n.t('Wallet.Tip.Reference.Title')}
        </Typography>
        <Typography variant="body1" className={style.desc} color="textPrimary" component="p">
          {i18n.t('Wallet.Tip.Reference.Desc', {txFee, token})}
        </Typography>
        <Button onClick={onVerifyReference} size="small" color="primary" variant="contained">
          {i18n.t('Wallet.Tip.Reference.Button')}
        </Button>
        <div style={{marginTop: 8}}>
          <Button
            onClick={() => setIsShowModalTotalTips(true)}
            size="small"
            color="primary"
            variant="text">
            View total Tips
          </Button>
        </div>
      </div>
      <TipTotal
        handleVerifyReference={onVerifyReference}
        totalTipsData={totalTipsData}
        open={isShowModalTotalTips}
        onClose={() => setIsShowModalTotalTips(false)}
      />
    </>
  );
};
