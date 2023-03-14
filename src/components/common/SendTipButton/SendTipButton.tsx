import { CurrencyDollarIcon } from '@heroicons/react/outline';

import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { shallowEqual, useSelector } from 'react-redux';

import { useRouter } from 'next/router';

import {
  Button,
  CircularProgress,
  SvgIcon,
  ButtonProps,
  CircularProgressProps,
  Typography,
} from '@material-ui/core';

import useTipping from '../Tipping/use-tipping.hook';
import ShowIf from '../show-if.component';
import { useStyles } from './SendTipButton.style';

import { COOKIE_INSTANCE_URL } from 'components/SelectServer';
import { PromptComponent } from 'src/components/atoms/Prompt/prompt.component';
import { useUserHook } from 'src/hooks/use-user.hook';
import { Comment } from 'src/interfaces/comment';
import { ReferenceType } from 'src/interfaces/interaction';
import { People } from 'src/interfaces/people';
import { Post } from 'src/interfaces/post';
import { User } from 'src/interfaces/user';
import { WalletDetail } from 'src/interfaces/wallet';
import * as CommentAPI from 'src/lib/api/comment';
import * as PostAPI from 'src/lib/api/post';
import * as UserAPI from 'src/lib/api/user';
import i18n from 'src/locale';
import { RootState } from 'src/reducers';

type SendTipButtonProps = ButtonProps & {
  label?: string;
  reference: Post | Comment | User;
  referenceType: ReferenceType;
  owned?: boolean;
  showIcon?: boolean;
  mobile?: boolean;
};

type WithWalletDetail<T> = T & {
  walletDetail?: WalletDetail;
};

export const SendTipButton: React.FC<SendTipButtonProps> = props => {
  const {
    label = i18n.t('Post_Detail.Post_Action.Send_tip'),
    reference,
    referenceType,
    showIcon = false,
    mobile = false,
    variant,
    owned = false,
    ...restProps
  } = props;

  const styles = useStyles({ mobile, color: props.color });
  const router = useRouter();
  const tipping = useTipping();
  const { user } = useUserHook();
  const [promptFailedTip, setPromptFailedTip] = useState(false);
  const [tipInfoOpened, setTipInfoOpened] = useState(false);
  const [prompWeb2Users, setPrompWeb2Users] = useState(false);

  const { wallets } = user || { wallets: [] };

  const anonymous = useSelector<RootState, boolean>(
    state => state.userState.anonymous,
    shallowEqual,
  );

  const isWeb2Users = !wallets.length && !anonymous;

  const icon = (
    <SvgIcon
      color="inherit"
      component={CurrencyDollarIcon}
      viewBox="0 0 24 24"
    />
  );

  const handleCloseTipInfo = () => {
    setTipInfoOpened(false);
  };

  const handleCloseConnectWalletWarningPrompt = () => {
    setPrompWeb2Users(false);
  };

  const handleConnectWeb3Wallet = () => {
    router.push(`/wallet?type=manage`);
  };

  const [cookies] = useCookies([COOKIE_INSTANCE_URL]);

  const handleSignIn = () => {
    router.push(`/login?instance=${cookies[COOKIE_INSTANCE_URL]}`);
  };

  const handleSendTip = async () => {
    let receiver:
      | WithWalletDetail<User | People>
      | WithWalletDetail<People>
      | null = null;

    if (anonymous) {
      setTipInfoOpened(true);
      return;
    }

    if (isWeb2Users) {
      setPrompWeb2Users(true);
      return;
    }

    try {
      // if tipping to User
      if ('username' in reference) {
        receiver = reference;
        const walletDetail = await UserAPI.getWalletAddress(reference.id);

        receiver = { ...reference, walletDetail };
      }

      // if tipping to Comment
      if ('section' in reference) {
        receiver = reference.user;
        const walletDetail = await CommentAPI.getWalletAddress(reference.id);

        receiver = { ...reference.user, walletDetail };
      }

      // if tipping to Post
      if ('platform' in reference) {
        receiver = reference.people ?? reference.user;
        const walletDetail = await PostAPI.getWalletAddress(reference.id);

        if (reference.people) {
          receiver = { ...reference.people, walletDetail };
        } else {
          receiver = { ...reference.user, walletDetail };
        }
      }

      if (!receiver) throw new Error('Not Found');

      tipping.send({
        receiver,
        reference,
        referenceType,
      });
    } catch (error) {
      setPromptFailedTip(true);
    }
  };

  return (
    <>
      <Button
        disabled={tipping.enabled ? owned : false}
        classes={{ root: styles.button }}
        onClick={handleSendTip}
        startIcon={showIcon ? icon : null}
        variant={mobile ? 'text' : variant}
        {...restProps}>
        {label}
        <ShowIf condition={tipping.loading && !mobile}>
          <div className={styles.loading}>
            <CircularProgress
              size={14}
              color={props.color as CircularProgressProps['color']}
            />
          </div>
        </ShowIf>
      </Button>

      <PromptComponent
        icon="tip"
        title={i18n.t('Confirm.Anonymous.SendTip.Title')}
        subtitle={i18n.t('Confirm.Anonymous.SendTip.Desc')}
        open={tipInfoOpened}
        onCancel={handleCloseTipInfo}>
        <div className={styles.wrapperButtonFlex}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCloseTipInfo}>
            {i18n.t('LiteVersion.MaybeLater')}
          </Button>
          <Button variant="contained" color="primary" onClick={handleSignIn}>
            {i18n.t('General.SignIn')}
          </Button>
        </div>
      </PromptComponent>

      <PromptComponent
        icon="warning"
        title={i18n.t('Tipping.Prompt_Web2.Title')}
        subtitle={i18n.t('Tipping.Prompt_Web2.Subtitle')}
        open={prompWeb2Users}
        onCancel={handleCloseConnectWalletWarningPrompt}>
        <div className={styles.wrapperButtonFlex}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCloseConnectWalletWarningPrompt}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConnectWeb3Wallet}>
            Connect Wallet
          </Button>
        </div>
      </PromptComponent>

      <PromptComponent
        icon="danger"
        open={promptFailedTip}
        onCancel={() => setPromptFailedTip(false)}
        title="Send tip couldn't be processed"
        subtitle={
          <Typography component="div">
            {i18n.t('Tipping.Send_Tip_Error.Not_Connected', {
              wallet: tipping.currentWallet?.toUpperCase(),
            })}
          </Typography>
        }>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              setPromptFailedTip(false);
            }}>
            OK
          </Button>
        </div>
      </PromptComponent>
    </>
  );
};
