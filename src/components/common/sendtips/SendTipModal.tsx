import React, {useState, useEffect} from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import SendIcon from '@material-ui/icons/Send';

import DialogTitle from '../DialogTitle.component';
import {CurrencyTableComponent} from './currencyTable.component';
import {useStyles} from './send-tips.style';
import {TipAmountFieldComponent} from './tipAmountField.component';

import {useAlertHook} from 'src/hooks/use-alert.hook';
import {usePolkadotApi} from 'src/hooks/use-polkadot-api.hook';
import {
  InputState,
  InputErrorState,
  SendTipConfirmed,
  Props,
  SendTipWithPayloadProps,
  ContentType,
} from 'src/interfaces/send-tips/send-tips';

const SendTipModal: React.FC<Props> = ({
  balanceDetails,
  walletReceiverDetail,
  userAddress,
  postId,
  receiverId,
  success,
  availableTokens,
  isShown,
  hide,
}) => {
  const {sendTip, load, trxHash, sendTipSuccess, error} = usePolkadotApi();

  const styles = useStyles();

  const [senderAddress, setSenderAddress] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const [tippedContent, setTippedContent] = useState<ContentType>();
  const [sendTipClicked, setSendTipClicked] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('');
  //TODO: make alert only appear once
  const {showTipAlert, showAlert} = useAlertHook();

  const [tokenProperties, setTokenProperties] = useState({
    wsAddress: '',
    tokenDecimals: 0,
    tokenId: '',
  });

  const [sendTipConfirmed, setSendTipConfirmed] = useState<SendTipConfirmed>({
    isConfirmed: false,
    message: '',
  });

  const [inputError, setInputError] = useState<InputErrorState>({
    isErrorInput: false,
    isTextChanged: false,
    isInsufficientBalance: false,
    errorMessage: 'Please input a number larger than 0!',
  });
  const [values, setValues] = useState<InputState>({
    amount: '',
  });

  useEffect(() => {
    if (sendTipSuccess) {
      handleAlertTippingSuccess();
    }
  }, [sendTipSuccess]);

  useEffect(() => {
    if (error) {
      handleAlertTippingError();
    }
  }, [error]);

  useEffect(() => {
    if (sendTipConfirmed.isConfirmed) {
      success(postId);
    }
  }, [sendTipConfirmed]);

  useEffect(() => {
    if (walletReceiverDetail && sendTipClicked && tippedContent) {
      switch (tippedContent) {
        case ContentType.COMMENT:
          sendTipFromComment();
          break;
        default:
          sendTipFromPost();
          break;
      }
    }
  }, [sendTipClicked, walletReceiverDetail, tippedContent, tokenProperties, tipAmount]);

  useEffect(() => {
    if (trxHash.length > 0) {
      handleAfterTipSentSuccess();
      load(userAddress, availableTokens);
    }
  }, [trxHash]);

  useEffect(() => {
    if (balanceDetails?.length > 0) {
      handleChangeTokenBalance();
    }
  }, [tokenProperties.tokenId, balanceDetails]);

  const handleAlertTippingError = () => {
    showAlert({
      severity: 'error',
      title: 'Error!',
      message: `Something is wrong`,
    });
  };

  const handleAlertTippingSuccess = () => {
    showTipAlert({
      severity: 'success',
      title: 'Tip sent!',
      message: `${trxHash}`,
    });
  };

  const handleSentTipConfirmed = () => {
    setSendTipConfirmed({
      isConfirmed: true,
      message: 'Tip sent successfully!',
    });
  };

  const handleClearValue = () => {
    setValues({
      ...values,
      amount: '',
    });
  };

  const handleAfterTipSentSuccess = () => {
    handleSentTipConfirmed();
    handleClearValue();
  };

  const handleChangeTokenBalance = () => {
    const idx = balanceDetails.findIndex(item => item.tokenSymbol === tokenProperties.tokenId);
    if (typeof idx === 'number') {
      setTokenBalance(balanceDetails[idx]?.freeBalance.toString() ?? '');
    }
  };

  const handleInputEmpty = () => {
    setInputError({
      ...inputError,
      isErrorInput: false,
      isTextChanged: true,
    });
  };

  const handleInsufficientBalance = () => {
    setInputError({
      ...inputError,
      isErrorInput: true,
      isTextChanged: true,
      isInsufficientBalance: true,
      errorMessage: 'Insufficient balance',
    });
  };

  const handleResetInputError = () => {
    // amount valid, reset InputError state
    setInputError({
      isErrorInput: false,
      isTextChanged: true,
      isInsufficientBalance: false,
      errorMessage: '',
    });
  };

  const findDecimals = () => {
    const idx = balanceDetails.findIndex(item => item.tokenSymbol === tokenProperties.tokenId);
    const decimals = balanceDetails[idx].tokenDecimals ?? 0;

    return decimals;
  };

  const defineTipAmount = (decimals: number) => {
    const amountStr = values.amount as string;
    const amountSent = Number(amountStr) * 10 ** decimals;
    setTipAmount(amountSent);
  };

  const checkPostId = () => {
    if (postId === undefined) {
      setTippedContent(ContentType.COMMENT);
    } else {
      setTippedContent(ContentType.POST);
    }
  };

  const handleInputError = () => {
    setInputError({
      ...inputError,
      isErrorInput: true,
      isTextChanged: true,
      isInsufficientBalance: false,
    });
  };

  const checkAmountThenSend = () => {
    const regexValidDigits = /^\d*(\.\d+)?$/;

    if (values.amount === '') {
      handleInputEmpty();
    }
    if (regexValidDigits.test(values.amount)) {
      handleInputEmpty();

      if (tokenBalance !== undefined && Number(values.amount) >= Number(tokenBalance)) {
        handleInsufficientBalance();
      } else {
        handleResetInputError();

        const decimals = findDecimals();

        defineTipAmount(decimals);

        // sendTip will open a pop-up from polkadot.js extension,
        // tx signing is done by supplying a password
        setSenderAddress(userAddress);

        checkPostId();
        setSendTipClicked(true);
      }
    } else {
      handleInputError();
    }
  };

  const sendTipWithPayload = ({
    senderAddress,
    toAddress,
    amountSent,
    decimals,
    currencyId,
    postId,
    wsAddress,
  }: SendTipWithPayloadProps) => {
    const sendTipPayload = {
      fromAddress: senderAddress,
      toAddress,
      amountSent,
      decimals,
      currencyId,
      postId,
      wsAddress,
    };

    sendTip(sendTipPayload);
  };

  const sendTipFromComment = () => {
    sendTipWithPayload({
      senderAddress,
      toAddress: receiverId as string,
      amountSent: tipAmount,
      decimals: tokenProperties.tokenDecimals,
      currencyId: tokenProperties.tokenId,
      postId: '',
      wsAddress: tokenProperties.wsAddress,
    });
  };

  if (!walletReceiverDetail) return null;

  const sendTipFromPost = () => {
    sendTipWithPayload({
      senderAddress,
      toAddress: walletReceiverDetail.walletAddress,
      amountSent: tipAmount,
      decimals: tokenProperties.tokenDecimals,
      currencyId: tokenProperties.tokenId,
      postId: walletReceiverDetail.postId,
      wsAddress: tokenProperties.wsAddress,
    });
  };

  const handleChange = (prop: keyof InputState, event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({...values, [prop]: event.target.value});
  };

  const handleSendTip = () => {
    checkAmountThenSend();
  };

  const handleChangeTokenProperties = (
    wsAddress: string,
    tokenDecimals: number,
    tokenId: string,
  ) => {
    setTokenProperties({
      wsAddress,
      tokenDecimals,
      tokenId,
    });
  };

  return (
    <>
      <Dialog open={isShown} aria-labelledby="send-tips-window" maxWidth="md">
        <DialogTitle id="name" onClose={hide}>
          {' '}
          Send Tip
        </DialogTitle>
        <DialogContent dividers>
          <CurrencyTableComponent
            balanceDetails={balanceDetails}
            availableTokens={availableTokens}
            onChange={(wsAddress, tokenDecimals, tokenId) =>
              handleChangeTokenProperties(wsAddress, tokenDecimals, tokenId)
            }
          />
        </DialogContent>
        <DialogContent dividers>
          <TipAmountFieldComponent
            value={values.amount}
            onChange={e => handleChange('amount', e)}
            isError={inputError.isErrorInput ? true : false}
            fieldLabel={`How many ${tokenProperties.tokenId}`}
            helperTextField={
              inputError.isErrorInput
                ? inputError.isInsufficientBalance
                  ? inputError.errorMessage
                  : 'Invalid input'
                : 'Digits only'
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            className={styles.whiteLightButton}
            fullWidth={true}
            size="large"
            variant="contained"
            onClick={hide}>
            Cancel
          </Button>
          <Button
            className={styles.lightButton}
            fullWidth={true}
            size="large"
            variant="contained"
            startIcon={<SendIcon />}
            disabled={balanceDetails === undefined}
            onClick={handleSendTip}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SendTipModal;
