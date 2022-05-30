import {ChevronDownIcon, UserAddIcon, UserIcon} from '@heroicons/react/outline';
import {DotsVerticalIcon} from '@heroicons/react/solid';

import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {Grid} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import {Metric} from '../Metric';
import useConfirm from '../common/Confirm/use-confirm.hook';
import {SendTipButton} from '../common/SendTipButton/SendTipButton';
import {useFriendOptions} from './hooks/use-friend-options.hook';
import {useStyles} from './profile-header.style';
import {Website} from './render/Website';

import {OfficialBadgeIcon} from 'src/components/atoms/Icons';
import {ReportComponent} from 'src/components/atoms/Report/Report.component';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Friend} from 'src/interfaces/friend';
import {ReferenceType} from 'src/interfaces/interaction';
import {ReportProps} from 'src/interfaces/report';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';

export type Props = {
  person: User;
  user?: User;
  status?: Friend;
  onSendRequest: () => void;
  onAcceptFriend: () => void;
  onUnblockFriend: (friend: Friend) => void;
  onDeclineRequest: () => void;
  onRemoveFriend: () => void;
  onEdit?: () => void;
  linkUrl: string;
  onSubmitReport: (payload: ReportProps) => void;
  onBlock: () => void;
  onOpenTipHistory: (person: User) => void;
};

const background = 'https://res.cloudinary.com/dsget80gs/background/profile-default-bg.png';

export const ProfileHeaderComponent: React.FC<Props> = props => {
  const {
    person,
    user,
    status,
    onEdit,
    onAcceptFriend,
    onSendRequest,
    onUnblockFriend,
    onDeclineRequest,
    onRemoveFriend,
    linkUrl,
    onSubmitReport,
    onBlock,
    onOpenTipHistory,
  } = props;
  const style = useStyles();
  const confirm = useConfirm();
  const {self, canAddFriend, isBlocked, isFriend, isRequested, isRequesting} = useFriendOptions(
    person,
    user,
    status,
  );
  const {openToasterSnack} = useToasterSnackHook();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElFriend, setAnchorElFriend] = React.useState<null | HTMLElement>(null);
  const [modalReportOpened, setModalReportOpened] = React.useState(false);

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setAnchorElFriend(null);
  };

  const handleClickUserOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClickFriendOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isFriend || isRequested) {
      e.stopPropagation();
      setAnchorElFriend(e.currentTarget);
    }
  };

  const handleOpenEdit = () => {
    if (onEdit) onEdit();
  };

  const handleLinkCopied = () => {
    handleCloseMenu();
    openToasterSnack({
      message: i18n.t('Profile.Header.Alert.Copy'),
      variant: 'success',
    });
  };

  const handleOpenReportModal = () => {
    setModalReportOpened(true);
  };

  const handleCloseReportModal = () => {
    setModalReportOpened(false);
  };

  const confirmBlockPerson = () => {
    handleCloseMenu();

    confirm({
      title: i18n.t('Profile.Header.Prompt.Block.Title'),
      description: i18n.t('Profile.Header.Prompt.Block.Desc'),
      icon: 'danger',
      confirmationText: i18n.t('Profile.Header.Prompt.Block.Btn'),
      onConfirm: () => {
        onBlock();
      },
    });
  };

  const handleSendRequest = () => {
    if (status) {
      onUnblockFriend(status);
    } else {
      onSendRequest();
    }
  };

  const confirmRemoveFriend = () => {
    handleCloseMenu();

    confirm({
      title: i18n.t('Profile.Header.Prompt.Unfriend.Title', {name: person.name}),
      description: i18n.t('Profile.Header.Prompt.Unfriend.Desc'),
      icon: 'danger',
      confirmationText: i18n.t('Profile.Header.Prompt.Unfriend.Btn'),
      onConfirm: () => {
        onRemoveFriend();
      },
    });
  };

  const showProfileTipHistory = () => {
    handleCloseMenu();
    onOpenTipHistory(person);
  };

  return (
    <div>
      <div className={style.root}>
        <CardMedia
          className={style.media}
          image={person.bannerImageURL || background}
          title={person.name}
        />
        <div className={style.screen} />

        <Grid container alignItems="flex-start" justifyContent="space-between" wrap="nowrap">
          <Grid container alignItems="center">
            <Avatar
              alt={person.name}
              src={person.profilePictureURL}
              variant="circular"
              className={style.avatar}>
              {acronym(person.name)}
            </Avatar>
            <div>
              <Typography variant="body1" className={style.name} component="p">
                {person.name}
                <ShowIf condition={Boolean(person.verified)}>
                  <Tooltip
                    title={<Typography>{i18n.t('Profile.Header.Tooltip.Official')}</Typography>}
                    aria-label="official-account">
                    <IconButton
                      aria-label="official-badge"
                      style={{backgroundColor: 'transparent', paddingLeft: 4}}>
                      <OfficialBadgeIcon viewBox="0 0 24 24" color="primary" />
                    </IconButton>
                  </Tooltip>
                </ShowIf>
              </Typography>
              <Typography variant="body1" component="p" className={style.username}>
                @{person.username || 'username'}
              </Typography>
            </div>
          </Grid>
          <ShowIf condition={!!user}>
            <IconButton
              onClick={handleClickUserOption}
              classes={{root: style.action}}
              aria-label="profile-setting">
              <SvgIcon
                classes={{root: style.solid}}
                component={DotsVerticalIcon}
                viewBox="0 0 20 20"
              />
            </IconButton>
            <Menu
              classes={{
                paper: style.menu,
              }}
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
              transformOrigin={{vertical: 'top', horizontal: 'right'}}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}>
              <MenuItem onClick={showProfileTipHistory}>
                {i18n.t('Profile.Header.Menu.TipHistory')}
              </MenuItem>
              <CopyToClipboard text={linkUrl} onCopy={handleLinkCopied}>
                <MenuItem>{i18n.t('Profile.Header.Menu.Copy')}</MenuItem>
              </CopyToClipboard>
              <ShowIf condition={!self}>
                <ShowIf condition={person.username !== 'myriad_official'}>
                  <MenuItem onClick={handleOpenReportModal} className={style.delete}>
                    {i18n.t('Profile.Header.Menu.Report')}
                  </MenuItem>
                </ShowIf>
                <ShowIf condition={!isBlocked}>
                  <MenuItem
                    disabled={isBlocked}
                    onClick={confirmBlockPerson}
                    className={style.delete}>
                    {i18n.t('Profile.Header.Menu.Block')}
                  </MenuItem>
                </ShowIf>
              </ShowIf>
            </Menu>
          </ShowIf>
        </Grid>

        <Typography variant="body1" className={style.bio}>
          {person.bio}
        </Typography>

        <Website url={person.websiteURL} joinDate={person.createdAt} />

        <Grid container alignItems="flex-end" justifyContent="space-between" className={style.mt15}>
          <Metric data={person.metric} official={person.username === 'myriad_official'} profile />

          <div>
            <ShowIf condition={self && !!user}>
              <Button
                onClick={handleOpenEdit}
                classes={{root: style.button}}
                variant="contained"
                color="primary"
                size="small">
                {i18n.t('Profile.Header.Btn_Edit')}
              </Button>
            </ShowIf>

            <ShowIf condition={!self && !!user}>
              <ShowIf condition={canAddFriend && person.username !== 'myriad_official'}>
                <Button
                  onClick={handleSendRequest}
                  startIcon={
                    <SvgIcon
                      classes={{root: style.fill}}
                      component={UserAddIcon}
                      viewBox="0 0 22 22"
                    />
                  }
                  classes={{root: style.button}}
                  className={style.mr12}
                  variant="contained"
                  color="primary"
                  size="small">
                  {i18n.t('Profile.Header.Btn_Add')}
                </Button>
              </ShowIf>

              <ShowIf
                condition={
                  !isBlocked && !canAddFriend && person.username !== 'myriad_official' && !!user
                }>
                <Button
                  onClick={handleClickFriendOption}
                  startIcon={
                    <SvgIcon
                      classes={{root: style.fill}}
                      component={isFriend ? UserIcon : UserAddIcon}
                      viewBox="0 0 22 22"
                    />
                  }
                  endIcon={isFriend || isRequested ? <SvgIcon component={ChevronDownIcon} /> : null}
                  classes={{root: style.button}}
                  className={style.mr12}
                  variant="contained"
                  color={isFriend ? 'primary' : 'default'}
                  size="small">
                  <ShowIf condition={isFriend}>Friends</ShowIf>
                  <ShowIf condition={isRequested}>Respond</ShowIf>
                  <ShowIf condition={isRequesting}>Requested</ShowIf>
                </Button>
                <Menu
                  classes={{paper: style.menu}}
                  anchorEl={anchorElFriend}
                  getContentAnchorEl={null}
                  anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                  transformOrigin={{vertical: 'top', horizontal: 'right'}}
                  open={Boolean(anchorElFriend)}
                  onClose={handleCloseMenu}>
                  <ShowIf condition={isFriend}>
                    <MenuItem onClick={() => confirmRemoveFriend()}>
                      {i18n.t('Profile.Header.Menu.Unfriend')}
                    </MenuItem>
                  </ShowIf>
                  <ShowIf condition={isFriend}>
                    <MenuItem onClick={confirmBlockPerson} className={style.delete}>
                      {i18n.t('Profile.Header.Menu.Block')}
                    </MenuItem>
                  </ShowIf>
                  <ShowIf condition={isRequested}>
                    <MenuItem onClick={() => onAcceptFriend()}>
                      {i18n.t('Profile.Header.Menu.Acc')}
                    </MenuItem>
                  </ShowIf>
                  <ShowIf condition={isRequested}>
                    <MenuItem onClick={() => onDeclineRequest()}>
                      {i18n.t('Profile.Header.Menu.Reject')}
                    </MenuItem>
                  </ShowIf>
                </Menu>
              </ShowIf>

              <ShowIf condition={!isBlocked}>
                <SendTipButton
                  reference={person}
                  referenceType={ReferenceType.USER}
                  classes={{root: style.button}}
                  showIcon
                  variant="contained"
                  color="primary"
                  size="small"
                />
              </ShowIf>
            </ShowIf>
          </div>
        </Grid>
      </div>

      <ReportComponent
        onSubmit={onSubmitReport}
        user={person}
        open={modalReportOpened}
        onClose={handleCloseReportModal}
      />
    </div>
  );
};
