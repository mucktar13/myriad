import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {ExperienceList} from './ExperienceList';
import {useExperienceList} from './hooks/use-experience-list.hook';

import {useEnqueueSnackbar} from 'components/common/Snackbar/useEnqueueSnackbar.hook';
import {Skeleton} from 'src/components/Expericence';
import {ExperienceOwner, useExperienceHook} from 'src/hooks/use-experience-hook';
import {WrappedExperience} from 'src/interfaces/experience';
import {TimelineType} from 'src/interfaces/timeline';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type ExperienceListContainerProps = {
  owner?: ExperienceOwner;
  selectable: boolean;
  enableClone?: boolean;
  enableSubscribe?: boolean;
  hasMore?: boolean;
  filterTimeline?: boolean;
  loadNextPage?: () => void;
  refreshExperience?: () => void;
};

export const ExperienceListContainer: React.FC<ExperienceListContainerProps> = props => {
  const {
    owner = ExperienceOwner.ALL,
    enableClone,
    enableSubscribe,
    hasMore = false,
    filterTimeline = false,
    loadNextPage,
    refreshExperience,
  } = props;

  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);

  const router = useRouter();

  const {loadExperience, removeExperience, unsubscribeExperience, subscribeExperience} =
    useExperienceHook();
  const {list: experiences, limitExceeded} = useExperienceList(owner);
  const enqueueSnackbar = useEnqueueSnackbar();

  const handleViewPostList = (type: TimelineType, userExperience: WrappedExperience) => {
    if (filterTimeline) {
      router.push(`/home?type=experience&id=${userExperience.experience.id}`, undefined, {
        shallow: true,
      });
    } else {
      router.push(`/topic/experience?id=${userExperience.experience.id}`);
    }
  };

  const handleRemoveExperience = (experienceId: string) => {
    removeExperience(experienceId, () => {
      loadExperience();
    });
  };

  const handleCloneExperience = (experienceId: string) => {
    if (!enableClone) return;

    if (limitExceeded) {
      enqueueSnackbar({
        message: i18n.t('Experience.List.Alert'),
        variant: 'warning',
      });
    } else {
      router.push(`/experience/${experienceId}/clone`);
    }
  };

  const handleSubscribeExperience = (experienceId: string) => {
    if (!enableSubscribe) return;

    if (limitExceeded) {
      enqueueSnackbar({
        message: i18n.t('Experience.List.Alert'),
        variant: 'warning',
      });
    } else {
      subscribeExperience(experienceId, () => {
        refreshExperience && refreshExperience();
      });
    }
  };

  const handleUnsubscribeExperience = (userExperienceId: string) => {
    unsubscribeExperience(userExperienceId, () => {
      refreshExperience && refreshExperience();
    });
  };

  const handleLoadNextPage = () => {
    loadNextPage && loadNextPage();
  };

  return (
    <InfiniteScroll
      scrollableTarget="scrollable-searched-experiences"
      dataLength={experiences.length}
      hasMore={hasMore}
      next={handleLoadNextPage}
      loader={<Skeleton />}>
      <ExperienceList
        onDelete={handleRemoveExperience}
        onUnsubscribe={handleUnsubscribeExperience}
        onSubscribe={handleSubscribeExperience}
        onClone={handleCloneExperience}
        viewPostList={handleViewPostList}
        experiences={experiences}
        user={user}
        anonymous={anonymous}
        {...props}
      />
    </InfiniteScroll>
  );
};
