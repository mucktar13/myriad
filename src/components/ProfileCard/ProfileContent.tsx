import React from 'react';

import Link from 'next/link';

import {Badge, Grid} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {NotificationIcon} from '../atoms/Icons';
import {ProfileCardProps} from './ProfileCard.interfaces';
import {useStyles} from './profileContent.style';

import {capitalize} from 'lodash';
import {
  NearNetworkIcon24,
  MyriadCircleIcon,
  PolkadotNetworkIcon,
  KusamaNetworkIcon,
} from 'src/components/atoms/Icons';
import {Modal} from 'src/components/atoms/Modal';
import {formatCount} from 'src/helpers/number';
import {NetworkTypeEnum, WalletTypeEnum} from 'src/lib/api/ext-auth';
import i18n from 'src/locale';

export const ProfileContent: React.FC<ProfileCardProps> = props => {
  const {
    user,
    anonymous,
    alias,
    notificationCount,
    onViewProfile,
    onShowNotificationList,
    isMobile,
    handleSignOut,
    currentWallet,
  } = props;
  const classes = useStyles({...props});

  const icons = React.useMemo(
    () => ({
      'polkadot{.js}': <PolkadotNetworkIcon />,
      kusama: <KusamaNetworkIcon />,
      near: <NearNetworkIcon24 />,
      myriad: <MyriadCircleIcon />,
    }),
    [],
  );

  const formatWallet = (blockchainPlatform?: string, a?: object) => {
    switch (blockchainPlatform) {
      case 'substrate':
        return 'Polkadot{.js}';
      case 'near':
        return 'NEAR Wallet';
      default:
        return 'Unknown wallet';
    }
  };

  const formatNetwork = (blockchainPlatform?: string, networkId?: string) => {
    switch (blockchainPlatform) {
      case 'substrate':
        return capitalize(networkId);
      case 'near':
        return networkId?.toUpperCase();
      default:
        return '';
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleOpenProfile = () => {
    if (isMobile) return;

    !anonymous && setOpen(!open);
  };

  const getSelectedIcon = (isWallet?: boolean) => {
    const match = currentWallet?.networkId;
    if (isWallet) {
      switch (match) {
        case NetworkTypeEnum.NEAR:
          return icons[WalletTypeEnum.NEAR];

        default:
          return icons[WalletTypeEnum.POLKADOT];
      }
    }
    return match && icons[match as keyof typeof icons];
  };

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        className={classes.profileContent}>
        <div className={classes.flex}>
          <div className={`${classes.avatar} ${classes.hover}`}>
            <Avatar
              src={user?.profilePictureURL}
              size={isMobile ? AvatarSize.LARGE : AvatarSize.MEDIUM}
              name={user?.name || alias}
              onClick={handleOpenProfile}
            />
          </div>
          <div className={classes.identity}>
            <Link href={user ? `/profile/${user.id}` : ''} passHref>
              <Typography component="a" variant="h5" className={classes.name}>
                {user?.name || alias || ''}
              </Typography>
            </Link>

            <Typography variant="caption" color="textSecondary" className={classes.username}>
              @{user?.username || 'anonymous'}
            </Typography>
          </div>
        </div>
        <div className={classes.notification}>
          <IconButton aria-label="avatar" disabled={!!alias} onClick={onShowNotificationList}>
            <Badge
              invisible={notificationCount === 0}
              badgeContent={formatCount(notificationCount)}
              color="error">
              <NotificationIcon />
            </Badge>
          </IconButton>
        </div>
      </Grid>
      <Modal title={i18n.t('Profile_Card.Account')} onClose={handleOpenProfile} open={open}>
        <div className={classes.modal}>
          <div className={classes.purple}>
            <div className={classes.flex}>
              <div className={classes.avatar}>
                <Avatar
                  src={user?.profilePictureURL}
                  size={isMobile ? AvatarSize.LARGE : AvatarSize.MEDIUM}
                  name={user?.name || alias}
                />
              </div>
              <div className={classes.identity}>
                <Typography variant="h5" className={classes.name}>
                  {user?.name || alias || ''}
                </Typography>
                <Typography variant="caption" className={classes.username}>
                  @{user?.username || 'anonymous'}
                </Typography>
              </div>
            </div>
            <div className={classes.column}>
              <Typography component="span">{i18n.t('Profile_Card.Network')}</Typography>
              <Typography component="span" className={classes.flex}>
                {getSelectedIcon()}{' '}
                {formatNetwork(
                  currentWallet?.network?.blockchainPlatform,
                  currentWallet?.networkId,
                )}
              </Typography>
            </div>
            <div className={classes.column}>
              <Typography component="span">{i18n.t('Profile_Card.Wallet')}</Typography>
              <Typography component="span" className={classes.flex}>
                {getSelectedIcon(true)}
                {formatWallet(currentWallet?.network?.blockchainPlatform, currentWallet)}
              </Typography>
            </div>
          </div>
          <div className={`${classes.flex} ${classes.mt2}`}>
            <Button
              variant="text"
              color="primary"
              size="small"
              className={classes.button}
              onClick={onViewProfile}>
              {i18n.t('Profile_Card.Profile')}
            </Button>
            <div className={classes.line} />
            <Button
              variant="text"
              color="primary"
              size="small"
              className={classes.button}
              onClick={handleSignOut}>
              {i18n.t('Profile_Card.Logout')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileContent;
