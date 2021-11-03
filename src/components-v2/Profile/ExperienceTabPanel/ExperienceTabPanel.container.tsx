import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {useRouter} from 'next/router';

import {Button} from '@material-ui/core';

import {useExperienceHook} from '../../../hooks/use-experience-hook';
import {ExperienceTabPanel} from './ExperienceTabPanel';

import {ExperienceType} from 'src/components-v2/Timeline/default';
import {Empty} from 'src/components-v2/atoms/Empty';
import {UserExperience} from 'src/interfaces/experience';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {fetchProfileExperience} from 'src/reducers/profile/actions';

type ExperienceTabPanelContainerProps = {
  type?: ExperienceType;
  user?: User;
};

export const ExperienceTabPanelContainer: React.FC<ExperienceTabPanelContainerProps> = props => {
  const {user} = props;
  const {subscribeExperience} = useExperienceHook();
  const router = useRouter();
  const userLogin = useSelector<RootState, User | undefined>(state => state.userState.user);

  const dispatch = useDispatch();

  const experiences = useSelector<RootState, UserExperience[]>(
    state => state.profileState.experience.data,
  );

  useEffect(() => {
    dispatch(fetchProfileExperience());
  }, [user]);

  const handleFilterType = (type: ExperienceType) => {
    dispatch(fetchProfileExperience(type));
  };

  const handleSubsibeExperience = (experienceId: string) => {
    subscribeExperience(experienceId);
  };

  const handleCloneExperience = (experienceId: string) => {
    router.push(`/experience/${experienceId}/clone`);
  };

  const handlePreviewExperience = (experienceId: string) => {
    router.push(`/experience/${experienceId}/preview`);
  };

  const handleCreateExperience = () => {
    router.push('/experience/create');
  };

  if (!experiences.length && userLogin?.id === user?.id) {
    return (
      <Empty title="Looks like you haven’t experience yet">
        <Button onClick={handleCreateExperience} variant="contained" size="small" color="primary">
          Create my experience
        </Button>
      </Empty>
    );
  }

  if (!experiences.length) {
    return <Empty title="No experience yet" subtitle="This user hasn't experience yet" />;
  }

  return (
    <ExperienceTabPanel
      experiences={experiences}
      onFilter={handleFilterType}
      onSubscribe={handleSubsibeExperience}
      onFollow={handleCloneExperience}
      onPreview={handlePreviewExperience}
    />
  );
};
