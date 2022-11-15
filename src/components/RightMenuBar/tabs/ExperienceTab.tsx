import {PlusIcon} from '@heroicons/react/outline';

import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './Tab.style';

import useConfirm from 'components/common/Confirm/use-confirm.hook';
import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {ExperienceListContainer, EmptyExperience} from 'src/components/ExperienceList';
import ShowIf from 'src/components/common/show-if.component';
import {ExperienceOwner, useExperienceHook} from 'src/hooks/use-experience-hook';
import {User} from 'src/interfaces/user';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';

type ExperienceTabProps = {
  experienceType?: 'user' | 'trending';
};

export const ExperienceTab: React.FC<ExperienceTabProps> = props => {
  const {experienceType = 'user'} = props;
  const confirm = useConfirm();

  const router = useRouter();
  const styles = useStyles();
  const {userExperiences, userExperiencesMeta, loadNextUserExperience} = useExperienceHook();

  const user = useSelector<RootState, User | undefined>(
    state => state.userState.user,
    shallowEqual,
  );

  const enqueueSnackbar = useEnqueueSnackbar();

  const handleCreateExperience = () => {
    const totalOwnedExperience = userExperiencesMeta.additionalData?.totalOwnedExperience ?? 0;

    if (user.fullAccess && user.fullAccess !== undefined) {
      if (totalOwnedExperience >= 10) {
        enqueueSnackbar({
          message: i18n.t('Experience.Alert.Max_Exp'),
          variant: 'warning',
        });
      } else {
        router.push('/experience/create');
      }
    } else {
      if (totalOwnedExperience >= 5) {
        confirm({
          title: i18n.t('LiteVersion.LimitTitleExperiance'),
          description: i18n.t('LiteVersion.LimitDescExperiance'),
          icon: 'warning',
          confirmationText: i18n.t('LiteVersion.ConnectWallet'),
          cancellationText: i18n.t('LiteVersion.MaybeLater'),
          onConfirm: () => {
            router.push({pathname: '/wallet', query: {type: 'manage'}});
          },
          onCancel: () => {
            undefined;
          },
        });
      }
    }
  };

  const handleLoadNextPage = () => {
    loadNextUserExperience();
  };

  return (
    <div className={styles.box}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
        <Typography variant={'h4'} className={styles.title}>
          Experience
        </Typography>

        <ShowIf condition={Boolean(user) && experienceType === 'user'}>
          <Typography
            variant={'caption'}
            color={'primary'}
            component="div"
            className={styles.action}
            onClick={handleCreateExperience}>
            <SvgIcon component={PlusIcon} viewBox="0 0 24 24" style={{fontSize: 14}} />
            {i18n.t('Experience.Create.Title')}
          </Typography>
        </ShowIf>
      </div>

      <ExperienceListContainer
        noButton={true}
        selectable
        owner={experienceType === 'user' ? ExperienceOwner.CURRENT_USER : ExperienceOwner.TRENDING}
        filterTimeline
        enableClone={experienceType === 'trending'}
        enableSubscribe={experienceType === 'trending'}
        hasMore={
          Boolean(user)
            ? userExperiencesMeta.currentPage < userExperiencesMeta.totalPageCount
            : false
        }
        loadNextPage={handleLoadNextPage}
      />

      <ShowIf condition={userExperiences.length === 0 && experienceType === 'user'}>
        <EmptyExperience />
      </ShowIf>
    </div>
  );
};

export default ExperienceTab;
