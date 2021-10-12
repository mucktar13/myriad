import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {CommentList} from './CommentList';

import {ReportContainer} from 'src/components-v2/Report';
import {SendTipContainer} from 'src/components-v2/SendTip';
import {TipHistory} from 'src/components-v2/TipHistory';
import {Modal} from 'src/components-v2/atoms/Modal';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useCommentHook} from 'src/hooks/use-comment.hook';
import {Comment, CommentProps} from 'src/interfaces/comment';
import {SectionType, ReferenceType} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {RootState} from 'src/reducers';
import {upvote, downvote} from 'src/reducers/timeline/actions';
import {UserState} from 'src/reducers/user/reducer';

type CommentListContainerProps = {
  referenceId: string;
  placeholder?: string;
  section: SectionType;
  focus?: boolean;
  expand?: boolean;
};

export const CommentListContainer: React.FC<CommentListContainerProps> = props => {
  const {placeholder, referenceId, section, focus, expand} = props;

  const dispatch = useDispatch();
  const {comments, loadInitComment, reply, updateUpvote, updateDownvote, loadReplies} =
    useCommentHook(referenceId);
  const {
    isTipHistoryOpen,
    transactions,
    closeTipHistory,
    handleFilterTransaction,
    handleSortTransaction,
    openTipHistory,
  } = useTipHistory();

  const {user, currencies} = useSelector<RootState, UserState>(state => state.userState);
  const downvoting = useSelector<RootState, Post | Comment | null>(
    state => state.timelineState.interaction.downvoting,
  );
  const [reported, setReported] = useState<Comment | null>(null);
  const [tippedComment, setTippedComment] = useState<Comment | null>(null);
  const sendTipOpened = Boolean(tippedComment);

  useEffect(() => {
    loadInitComment(section);
  }, [referenceId]);

  const handleSubmitComment = (comment: Partial<CommentProps>) => {
    if (user) {
      reply(
        user,
        {
          ...comment,
          postId: referenceId,
          referenceId: comment.referenceId ?? referenceId,
          type: comment.type ?? ReferenceType.POST,
          userId: user.id,
          section: comment.section ?? section,
        } as CommentProps,
        () => {
          if (downvoting) {
            dispatch(downvote(downvoting, section));
          }
        },
      );
    }
  };

  const handleUpvote = (comment: Comment) => {
    dispatch(
      upvote(comment, section, () => {
        updateUpvote(comment.id, comment.metric.upvotes + 1);
      }),
    );
  };

  const handleDownvote = (comment: Comment) => {
    dispatch(
      downvote(comment, section, () => {
        updateDownvote(comment.id, comment.metric.downvotes + 1);
      }),
    );
  };

  const handleSendTip = () => {
    closeTipHistory();
  };

  const handleOnSendTip = (comment: Comment) => {
    console.log({comment});
    setTippedComment(comment);
  };

  const closeSendTip = () => {
    setTippedComment(null);
  };

  const handleReport = (comment: Comment) => {
    setReported(comment);
  };

  const closeReportPost = () => {
    setReported(null);
  };

  return (
    <>
      <CommentList
        user={user}
        comments={comments || []}
        placeholder={placeholder}
        onComment={handleSubmitComment}
        onDownvote={handleDownvote}
        onUpvote={handleUpvote}
        onLoadReplies={loadReplies}
        onOpenTipHistory={openTipHistory}
        focus={focus}
        expand={expand}
        onReport={handleReport}
        onSendTip={handleOnSendTip}
      />

      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Finding this post is insightful? Send a tip!">
        <SendTipContainer />
      </Modal>

      <TipHistory
        open={isTipHistoryOpen}
        currencies={currencies}
        tips={transactions}
        sendTip={handleSendTip}
        onClose={closeTipHistory}
        onSort={handleSortTransaction}
        onFilter={handleFilterTransaction}
      />

      <ReportContainer reference={reported} onClose={closeReportPost} />
    </>
  );
};
