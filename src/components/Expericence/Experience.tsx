import {DotsVerticalIcon} from '@heroicons/react/outline';

import React from 'react';

import Link from 'next/link';

import {Grid} from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import useConfirm from '../common/Confirm/use-confirm.hook';
import {useStyles} from './Experience.style';

import ShowIf from 'src/components/common/show-if.component';
import {WrappedExperience} from 'src/interfaces/experience';
import {User} from 'src/interfaces/user';

type ExperienceProps = {
  user?: User;
  anonymous?: boolean;
  userExperience: WrappedExperience;
  selected: boolean;
  selectable: boolean;
  onSelect?: (experienceId: string) => void;
  onClone?: (experienceId: string) => void;
  onSubscribe?: (experienceId: string) => void;
  onUnsubscribe?: (experienceId: string) => void;
  onDelete?: (experienceId: string) => void;
};

const DEFAULT_IMAGE =
  'https://pbs.twimg.com/profile_images/1407599051579617281/-jHXi6y5_400x400.jpg';

export const Experience: React.FC<ExperienceProps> = props => {
  const {
    userExperience,
    user,
    anonymous = false,
    selectable,
    onSelect,
    onClone,
    onDelete,
    onSubscribe,
    onUnsubscribe,
  } = props;

  const styles = useStyles(props);
  const confirm = useConfirm();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isOwnExperience = userExperience.experience.user.id === user?.id;
  const experienceId = userExperience.experience.id;
  const userExperienceId = userExperience.id;

  const handleClickExperience = () => {
    handleCloseSettings();

    if (selectable && onSelect) {
      onSelect(experienceId);
    }
  };

  const handleCloneExperience = () => {
    handleCloseSettings();

    if (onClone) {
      onClone(experienceId);
    }
  };

  const handleSubscribeExperience = () => {
    handleCloseSettings();

    if (onSubscribe) {
      onSubscribe(experienceId);
    }
  };

  const handleClickSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleCloseSettings = () => {
    setAnchorEl(null);
  };

  const confirmDeleteExperience = () => {
    handleCloseSettings();

    confirm({
      title: 'Delete Experience?',
      description:
        "Are you sure you want to delete this experience? You can't undo this in the future.",
      icon: 'danger',
      confirmationText: 'Yes, proceed to delete',
      cancellationText: 'Cancel',
      onConfirm: () => {
        if (onDelete && userExperienceId) {
          onDelete(userExperienceId);
        }
      },
    });
  };

  const confirmUnsubscribe = () => {
    handleCloseSettings();

    confirm({
      title: 'Unsubscribe?',
      description: "Do you want to unsubscribe?\n You won't see more post from this experience",
      icon: 'warning',
      confirmationText: 'Unsubscribe',
      onConfirm: () => {
        if (onUnsubscribe && userExperienceId) {
          onUnsubscribe(userExperienceId);
        }
      },
    });
  };

  const isHidden = () => {
    if (userExperience.private && !userExperience.friend) return true;
    if (userExperience.private && userExperience.friend) return false;
    return false;
  };

  return (
    <>
      <Card className={styles.root}>
        <CardActionArea onClick={handleClickExperience} disableRipple component="div">
          <Grid container alignItems="center" justifyContent="space-between" wrap="nowrap">
            <CardMedia
              component="img"
              className={styles.image}
              image={userExperience.experience.experienceImageURL ?? DEFAULT_IMAGE}
            />

            <CardContent classes={{root: styles.cardContent}}>
              <Typography className={styles.title} variant="body1">
                {userExperience.experience.name}
              </Typography>
              <Typography variant="caption" color="primary" className={styles.subtitle}>
                {userExperience.experience.user.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {isOwnExperience ? ' (you)' : ''}
              </Typography>
            </CardContent>

            <IconButton aria-label="settings" onClick={handleClickSettings}>
              <SvgIcon component={DotsVerticalIcon} viewBox="0 0 24 24" className={styles.icon} />
            </IconButton>
          </Grid>
        </CardActionArea>
      </Card>

      <Menu
        classes={{
          paper: styles.menu,
        }}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        transformOrigin={{vertical: 'bottom', horizontal: 'center'}}
        open={Boolean(anchorEl)}
        onClose={handleCloseSettings}>
        <Link
          href={`/experience/[experienceId]/preview`}
          as={`/experience/${experienceId}/preview`}
          passHref>
          <MenuItem onClick={handleCloseSettings}>View details</MenuItem>
        </Link>

        <ShowIf condition={isOwnExperience}>
          <Link
            href={`/experience/[experienceId]/edit`}
            as={`/experience/${experienceId}/edit`}
            passHref>
            <MenuItem onClick={handleCloseSettings}>Edit experience</MenuItem>
          </Link>
        </ShowIf>

        <ShowIf condition={!isOwnExperience && !isHidden()}>
          <MenuItem onClick={handleCloneExperience} disabled={anonymous}>
            Clone
          </MenuItem>
        </ShowIf>

        <ShowIf condition={!userExperience.subscribed && !isOwnExperience && !isHidden()}>
          <MenuItem onClick={handleSubscribeExperience} disabled={anonymous}>
            Subscribe
          </MenuItem>
        </ShowIf>

        <ShowIf condition={Boolean(userExperience.subscribed) && !isOwnExperience}>
          <MenuItem onClick={confirmUnsubscribe} className={styles.delete}>
            Unsubscribe
          </MenuItem>
        </ShowIf>
        <ShowIf condition={isOwnExperience}>
          <MenuItem onClick={confirmDeleteExperience} className={styles.delete}>
            Delete
          </MenuItem>
        </ShowIf>
        <MenuItem disabled>Share</MenuItem>
      </Menu>
    </>
  );
};
