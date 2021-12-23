import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useRouter} from 'next/router';

import {ExperiencePreview} from './ExperiencePreview';
import {useStyles} from './experience.style';

import {TopNavbarComponent, SectionTitle} from 'src/components/atoms/TopNavbar';
import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

export const ExperiencePreviewContainer: React.FC = () => {
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {
    experience,
    experiences: userExperience,
    getDetail,
    subscribeExperience,
    unsubscribeExperience,
  } = useExperienceHook();
  const {openToasterSnack} = useToasterSnackHook();
  const style = useStyles();
  const router = useRouter();
  const {experienceId} = router.query;

  useEffect(() => {
    if (experienceId) getDetail(experienceId);
  }, [experienceId]);

  const handleSubscribeExperience = (experienceId: string) => {
    if (userExperience.length === 10) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      subscribeExperience(experienceId);
    }
  };

  const handleUnsubscribeExperience = (userExperienceId: string) => {
    unsubscribeExperience(userExperienceId);
  };

  const handleCloneExperience = (experienceId: string) => {
    if (userExperience.length === 10) {
      openToasterSnack({
        message: 'You can only add up to 10 experiences max',
        variant: 'warning',
      });
    } else {
      router.push(`/experience/${experienceId}/clone`);
    }
  };

  const handleEditExperience = (experienceId: string) => {
    router.push(`/experience/${experienceId}/edit`);
  };

  return (
    <>
      {experience && user && (
        <>
          <div className={style.mb}>
            <TopNavbarComponent
              description={experience.name || 'Experience'}
              sectionTitle={SectionTitle.EXPERIENCE}
            />
          </div>
          <ExperiencePreview
            experience={experience}
            userExperiences={userExperience}
            userId={user.id}
            onSubscribe={handleSubscribeExperience}
            onUnsubscribe={handleUnsubscribeExperience}
            onFollow={handleCloneExperience}
            onUpdate={handleEditExperience}
          />
        </>
      )}
    </>
  );
};
