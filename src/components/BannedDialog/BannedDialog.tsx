import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useSession} from 'next-auth/react';
import getConfig from 'next/config';
import {useRouter} from 'next/router';

import {Button, Typography} from '@material-ui/core';

import {PromptComponent} from 'src/components/atoms/Prompt/prompt.component';
import {useAuthHook} from 'src/hooks/auth.hook';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {clearUser} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';

export type BannedDialogProps = {
  open: boolean;
  onClose: () => void;
};

const {publicRuntimeConfig} = getConfig();

export const BannedDialog: React.FC<BannedDialogProps> = props => {
  const {open, onClose} = props;

  const {currentWallet} = useSelector<RootState, UserState>(state => state.userState);

  const dispatch = useDispatch();
  const {data: session} = useSession();
  const router = useRouter();

  const {logout} = useAuthHook();

  const handleSignOut = async () => {
    if (session && currentWallet) {
      logout(currentWallet);
    } else {
      dispatch(clearUser());
      await router.push(`/`);
    }
  };

  const openContactUs = () => {
    window.open(
      `mailto:${publicRuntimeConfig.myriadSupportMail}?subject=Complain user banned!`,
      '_blank',
    );
  };

  return (
    <PromptComponent
      title={i18n.t('Home.Prompt_Banned.Title')}
      subtitle={
        <Typography component="span">
          <Typography component="span">{i18n.t('Home.Prompt_Banned.Subtitle_1')}</Typography>
          <Typography
            component="span"
            style={{cursor: 'pointer'}}
            color="primary"
            onClick={openContactUs}>
            {i18n.t('Home.Prompt_Banned.Subtitle_2')}
          </Typography>
          <Typography component="span">{i18n.t('Home.Prompt_Banned.Subtitle_3')}</Typography>
        </Typography>
      }
      open={open}
      icon="warning"
      onCancel={() => {
        onClose();
        handleSignOut();
        openContactUs();
      }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => {
            onClose();
            handleSignOut();
            openContactUs();
          }}>
          {i18n.t('General.OK')}
        </Button>
      </div>
    </PromptComponent>
  );
};

export default BannedDialog;
