import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';

import {CommentHistoryListContainer} from 'src/components/CommentHistoryList';
import {FriendListContainer} from 'src/components/FriendsMenu/FriendList.container';
import {ProfileExperienceTab} from 'src/components/Profile/tabs/ExperienceTab';
import {ProfilePostsTab} from 'src/components/Profile/tabs/PostTabs';
import {UserSettingsContainer} from 'src/components/UserSettings';
import {UserSocialContainer} from 'src/components/UserSocials';
import {TabItems} from 'src/components/atoms/Tabs';
import {Post} from 'src/interfaces/post';
import {TimelineFilterFields} from 'src/interfaces/timeline';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {ExperienceState} from 'src/reducers/experience/reducer';
import {FriendState} from 'src/reducers/friend/reducer';
import {ProfileState} from 'src/reducers/profile/reducer';
import {UserState} from 'src/reducers/user/reducer';

export type UserMenuTabs = 'post' | 'comments' | 'experience' | 'social' | 'friend' | 'setting';

export const useUserTabs = (excludes: UserMenuTabs[]): TabItems<UserMenuTabs>[] => {
  const {detail: profileUser} = useSelector<RootState, ProfileState>(state => state.profileState);
  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {experiences} = useSelector<RootState, ExperienceState>(state => state.experienceState);
  const {friends} = useSelector<RootState, FriendState>(state => state.friendState);
  const posts = useSelector<RootState, Post[]>(state => state.timelineState.posts);

  const isOwnProfile = profileUser?.id === user?.id;

  const filtersFields: TimelineFilterFields = {
    owner: profileUser?.id,
  };

  const tabs: TabItems<UserMenuTabs>[] = useMemo(() => {
    const items: TabItems<UserMenuTabs>[] = [
      {
        id: 'post',
        title: i18n.t('Profile.Tab.Post'),
        component: (
          <ProfilePostsTab filterType="origin" sortType="created" filters={filtersFields} />
        ),
      },
      {
        id: 'comments',
        title: i18n.t('Profile.Tab.Comments'),
        component: <CommentHistoryListContainer profile={profileUser} />,
      },
      {
        id: 'experience',
        title: i18n.t('Profile.Tab.Experience'),
        component: <ProfileExperienceTab user={profileUser} type="personal" />,
      },
      {
        id: 'friend',
        title: i18n.t('Profile.Tab.Friends'),
        component: (
          <FriendListContainer
            type="contained"
            user={profileUser}
            disableFilter={isOwnProfile}
            isProfile
          />
        ),
      },
      {
        id: 'social',
        title: i18n.t('Profile.Tab.Social_Media'),
        component: <UserSocialContainer user={profileUser} />,
        background: 'white',
      },
    ];

    if (user) {
      items.push({
        id: 'setting',
        title: i18n.t('Profile.Tab.Wallet_Address'),
        component: <UserSettingsContainer user={profileUser} />,
        background: 'white',
      });
    }

    return items.filter(item => !excludes.includes(item.id));
  }, [profileUser, user, experiences, friends, posts]);

  return tabs;
};
