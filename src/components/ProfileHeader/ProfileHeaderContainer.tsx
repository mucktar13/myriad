import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {ProfileHeaderComponent} from '.';

import {debounce} from 'lodash';
import {useTimelineFilter} from 'src/components/Timeline/hooks/use-timeline-filter.hook';
import {TipHistoryContainer} from 'src/components/TipHistory';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useFriendRequest} from 'src/hooks/use-friend-request.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {useReport} from 'src/hooks/use-report.hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Friend, FriendStatus} from 'src/interfaces/friend';
import {ReferenceType} from 'src/interfaces/interaction';
import {ReportProps} from 'src/interfaces/report';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {blockFromFriend} from 'src/reducers/friend/actions';
import {fetchProfileDetail, fetchProfileExperience} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';
import {UserState} from 'src/reducers/user/reducer';

type Props = {
  edit?: () => void;
};

export const ProfileHeaderContainer: React.FC<Props> = ({edit}) => {
  const {detail: profile, friendStatus} = useSelector<RootState, ProfileState>(
    state => state.profileState,
  );
  const {user} = useSelector<RootState, UserState>(state => state.userState);

  const dispatch = useDispatch();

  const {requestFriend, removeFriendRequest, toggleRequest, reloadFriendStatus} =
    useFriendRequest();
  const {sendReportWithAttributes} = useReport();
  const {openTipHistory} = useTipHistory();
  const {openToasterSnack} = useToasterSnackHook();
  const {query} = useQueryParams();
  const {filterTimeline} = useTimelineFilter({
    owner: profile?.id,
  });

  const urlLink = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  useEffect(() => {
    if (profile) {
      dispatch(fetchProfileExperience());
      filterTimeline(query);
    }
  }, [profile]);

  const sendFriendReqest = debounce(() => {
    if (!profile) return;

    requestFriend(profile);
  }, 300);

  const declineFriendRequest = debounce(() => {
    if (!friendStatus) return;

    removeFriendRequest(friendStatus);
  }, 300);

  const handleSubmitReport = (payload: ReportProps) => {
    sendReportWithAttributes(payload);
  };

  const handleBlockUser = async () => {
    if (!profile) return;

    await dispatch(blockFromFriend(profile.id));
    await dispatch(fetchProfileDetail(profile.id));
    await reloadFriendStatus();

    openToasterSnack({
      message: i18n.t('Profile.Header.Alert.Success_Block'),
      variant: 'success',
    });
  };

  const handleUnblockUser = (friend: Friend) => {
    toggleRequest(friend, FriendStatus.PENDING);
  };

  const handleAcceptFriend = debounce(() => {
    if (friendStatus) {
      toggleRequest(friendStatus, FriendStatus.APPROVED);

      openToasterSnack({
        message: i18n.t('Profile.Header.Alert.Success_Req'),
        variant: 'success',
      });
    }
  }, 300);

  const handleRemoveFriend = () => {
    if (friendStatus) {
      removeFriendRequest(friendStatus);

      openToasterSnack({
        message: i18n.t('Profile.Header.Alert.Unfriend', {name: profile?.name}),
        variant: 'success',
      });
    }
  };

  if (!profile) return null;

  return (
    <>
      <ProfileHeaderComponent
        person={profile}
        user={user}
        status={friendStatus}
        onSendRequest={sendFriendReqest}
        onDeclineRequest={declineFriendRequest}
        onBlock={handleBlockUser}
        onUnblockFriend={handleUnblockUser}
        onEdit={edit}
        linkUrl={`${urlLink()}/profile/${profile.id}`}
        onSubmitReport={handleSubmitReport}
        onRemoveFriend={handleRemoveFriend}
        onAcceptFriend={handleAcceptFriend}
        onOpenTipHistory={openTipHistory}
      />

      <TipHistoryContainer referenceType={ReferenceType.PEOPLE} />
    </>
  );
};
