import React from 'react';

import Typography from '@material-ui/core/Typography';

import {NetworkOption} from './NetworkOption/NetworkOption';
import {ProfileCardProps} from './ProfileCard.interfaces';
import {useStyles} from './ProfileCard.style';
import {ProfileContent} from './index';

import {convertToPolkadotAddress} from 'src/helpers/extension';

export const ProfileCard: React.FC<ProfileCardProps> = props => {
  const {
    user,
    wallets,
    alias,
    notificationCount,
    handleSignOut,
    onViewProfile,
    onSwitchAccount,
    onShowNotificationList,
    currentWallet,
    networks,
  } = props;
  const classes = useStyles();

  const formatAddress = (address?: string) => {
    if (address && address.length > 14) {
      const validAddress = convertToPolkadotAddress(address);
      return (
        validAddress.substring(0, 4) +
        '...' +
        validAddress.substring(validAddress.length - 4, validAddress.length)
      );
    }
    return address;
  };

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <ProfileContent
          user={user}
          currentWallet={currentWallet}
          alias={alias}
          networks={networks}
          notificationCount={notificationCount}
          onShowNotificationList={onShowNotificationList}
          onViewProfile={onViewProfile}
          handleSignOut={handleSignOut}
          onSwitchAccount={onSwitchAccount}
        />
        <div className={classes.wallet}>
          <NetworkOption currentWallet={currentWallet} wallets={wallets} networks={networks} />

          <Typography component="div" className={classes.address}>
            {formatAddress(currentWallet?.id)}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
