import React, {useEffect, useRef, forwardRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import Link from 'next/link';
import {useRouter} from 'next/router';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

import {CommentEditor} from '../CommentEditor';
import {CommentList} from '../CommentList';
import {Avatar, AvatarSize} from '../atoms/Avatar';
import {VotingComponent} from '../atoms/Voting';
import useConfirm from '../common/Confirm/use-confirm.hook';
import {SendTipButton} from '../common/SendTipButton/SendTipButton';
import {TimeAgo} from '../common/TimeAgo.component';
import {CommentDetailProps} from './CommentDetail.interface';
import {useStyles} from './CommentDetail.styles';
import {CommentRender} from './CommentRender';

import ShowIf from 'src/components/common/show-if.component';
import {useRepliesHook} from 'src/hooks/use-replies.hook';
import {Comment} from 'src/interfaces/comment';
import {CommentProps} from 'src/interfaces/comment';
import {ReferenceType, Vote} from 'src/interfaces/interaction';
import {Post} from 'src/interfaces/post';
import {RootState} from 'src/reducers';
import {
  upvote,
  downvote,
  removeVote,
  setDownvoting,
  resetDownvoting,
} from 'src/reducers/timeline/actions';

export const CommentDetail = forwardRef<HTMLDivElement, CommentDetailProps>((props, ref) => {
  const {
    section,
    comment,
    deep,
    user,
    mentionables,
    blockedUserIds,
    onUpvote,
    onRemoveVote,
    onUpdateDownvote,
    onOpenTipHistory,
    onReport,
    onSearchPeople,
    onDelete,
    scrollToPost,
  } = props;

  const {
    replies,
    hasMoreReplies,
    reply,
    loadReplies,
    loadMoreReplies,
    updateReplyUpvote,
    updateReplyDownvote,
    removeReplyVote,
    removeReply,
  } = useRepliesHook(comment.id, deep);

  const dispatch = useDispatch();
  const style = useStyles({...props, deep});
  const router = useRouter();
  const confirm = useConfirm();

  const downvoting = useSelector<RootState, Post | Comment | null>(
    state => state.timelineState.interaction.downvoting,
  );

  const editorRef = useRef<HTMLDivElement>(null);

  const [isReplying, setIsReplying] = React.useState(false);
  const [isBlocked, setIsBlocked] = React.useState(blockedUserIds.includes(comment.userId));
  const [maxLength, setMaxLength] = React.useState<number | undefined>(180);

  const totalVote = comment.metric.upvotes - comment.metric.downvotes;
  const isOwnComment = comment.userId === user?.id;

  useEffect(() => {
    if (comment.metric.comments > 0 || comment.metric.deletedComments > 0) {
      loadReplies();
    }
  }, [comment.metric.comments]);

  const handleOpenReply = () => {
    if (!user) return;

    setIsReplying(!isReplying);
  };

  const handleSubmitComment = (attributes: Partial<CommentProps>) => {
    if (user) {
      setIsReplying(false);

      const value = {
        ...attributes,
        section,
        userId: user.id,
        postId: comment.postId,
      } as CommentProps;

      reply(user, value, () => {
        if (downvoting && downvoting.id === comment.id) {
          dispatch(
            downvote(comment, section, (vote: Vote) => {
              // update parent downvote if downvoting on reply
              if ('section' in downvoting) {
                onUpdateDownvote(downvoting.id, downvoting.metric.downvotes + 1, vote);
              }
            }),
          );
        }
      });
    }
  };

  const handleUpvote = () => {
    if (!user) return;

    onUpvote(comment);
  };

  const handleDownVote = () => {
    if (!user) return;

    if (comment.id === downvoting?.id) {
      dispatch(resetDownvoting());

      handleOpenReply();
    } else {
      if (!comment.isDownVoted) {
        dispatch(setDownvoting(comment));

        handleOpenReply();
      } else {
        onRemoveVote(comment);
      }
    }
  };

  const handleRepliesUpvote = (comment: Comment) => {
    if (comment.isUpvoted) {
      handleRepliesRemoveVote(comment);
    } else {
      dispatch(
        upvote(comment, section, (vote: Vote) => {
          updateReplyUpvote(comment.id, comment.metric.upvotes + 1, vote);
        }),
      );
    }
  };

  const handleRepliesRemoveVote = (comment: Comment) => {
    dispatch(
      removeVote(comment, () => {
        removeReplyVote(comment.id);
      }),
    );
  };

  const handleOpenTipHistory = () => {
    onOpenTipHistory(comment);
  };

  const handleReport = () => {
    onReport(comment);
  };

  const handleViewProfile = () => {
    router.push(`/profile/${comment.userId}`);
  };

  const handleOpenComment = () => {
    setIsBlocked(false);
  };

  const showConfirmDeleteDialog = (reply: Comment) => {
    confirm({
      title: 'Delete Comment',
      description: 'Are you sure to remove this comment?',
      icon: 'danger',
      confirmationText: 'Yes, proceed to delete',
      cancellationText: 'No, let me rethink',
      onConfirm: () => {
        if (reply.id === comment.id) {
          onDelete(comment);
        } else {
          removeReply(reply);
        }
      },
    });
  };

  return (
    <>
      <div className={style.flex} ref={ref} id={`comment-${comment.id}-deep-${deep}`}>
        <div className={style.tree}>
          <Avatar
            name={comment.user?.name}
            src={comment.user?.profilePictureURL}
            size={AvatarSize.MEDIUM}
            onClick={handleViewProfile}
          />
          {(deep === 0 || deep > 2 || replies.length > 0) && <div className={style.verticalTree} />}
          {deep > 0 && deep <= 2 && <div className={style.horizontalTree} />}
        </div>
        <div className={style.fullWidth}>
          <Card className={style.comment}>
            <ShowIf condition={isBlocked}>
              <CardHeader
                title={
                  <div className={style.flexSpaceBetween}>
                    <div>
                      <Link
                        href={'/profile/[id]'}
                        as={`/profile/${comment.user.id}`}
                        shallow
                        passHref>
                        <Typography variant="body1" className={style.link} component="a">
                          Blocked user
                        </Typography>
                      </Link>

                      <Typography variant="caption" color="textSecondary">
                        <span className={style.dot}>•</span>
                        <TimeAgo date={comment.createdAt} />
                      </Typography>
                    </div>

                    <Typography
                      variant="body1"
                      className={style.cursor}
                      color="primary"
                      onClick={handleOpenComment}>
                      show comment
                    </Typography>
                  </div>
                }
              />
            </ShowIf>
            <ShowIf condition={!isBlocked}>
              <CardHeader
                title={
                  <>
                    <Link
                      href={'/profile/[id]'}
                      as={`/profile/${comment.user.id}`}
                      shallow
                      passHref>
                      <Typography variant="body1" className={style.link} component="a">
                        {comment?.user?.deletedAt ? '[user banned]' : comment.user.name}
                      </Typography>
                    </Link>

                    <Typography variant="caption" color="textSecondary">
                      <span className={style.dot}>•</span>
                      <TimeAgo date={comment.createdAt} />
                    </Typography>
                  </>
                }
              />
              <CardContent className={style.content}>
                <CommentRender
                  comment={comment}
                  max={maxLength}
                  onShowAll={() => setMaxLength(undefined)}
                />
              </CardContent>
              <CardActions disableSpacing>
                <VotingComponent
                  isUpVoted={Boolean(comment.isUpvoted)}
                  isDownVoted={Boolean(comment.isDownVoted)}
                  variant="row"
                  vote={totalVote}
                  size="small"
                  onDownVote={handleDownVote}
                  onUpvote={handleUpvote}
                />

                <Button
                  className={style.hidden}
                  classes={{root: style.button}}
                  disabled={!user}
                  onClick={handleOpenReply}
                  size="small"
                  variant="text">
                  Reply
                </Button>

                <ShowIf condition={!isOwnComment}>
                  <SendTipButton
                    reference={comment}
                    referenceType={ReferenceType.COMMENT}
                    size="small"
                    variant="text"
                    classes={{root: style.button}}
                    className={style.hidden}
                  />
                </ShowIf>

                <Button
                  classes={{root: style.button}}
                  size="small"
                  variant="text"
                  onClick={handleOpenTipHistory}>
                  Tip history
                </Button>
                <ShowIf condition={!isOwnComment}>
                  <Button
                    className={style.hidden}
                    classes={{root: style.button}}
                    disabled={!user}
                    size="small"
                    variant="text"
                    onClick={handleReport}>
                    Report
                  </Button>
                </ShowIf>
                <ShowIf condition={isOwnComment}>
                  <Button
                    classes={{root: style.button}}
                    size="small"
                    variant="text"
                    onClick={() => onDelete(comment)}>
                    Delete
                  </Button>
                </ShowIf>
              </CardActions>
            </ShowIf>
          </Card>
        </div>
      </div>

      <div id={`replies-${deep}`} style={{marginLeft: deep < 2 ? 64 : 0}}>
        {user && isReplying && (
          <CommentEditor
            ref={editorRef}
            referenceId={comment.id}
            type={ReferenceType.COMMENT}
            user={user}
            mentionables={mentionables.map(item => ({
              value: item.id,
              name: item.name,
              username: item.username ?? item.name.replace(' ', ''),
              avatar: item.profilePictureURL,
            }))}
            onSearchMention={onSearchPeople}
            onSubmit={handleSubmitComment}
          />
        )}

        <CommentList
          section={section}
          user={user}
          mentionables={mentionables}
          blockedUserIds={blockedUserIds}
          deep={deep + 1}
          comments={replies || []}
          hasMoreComment={hasMoreReplies}
          onLoadMoreComments={loadMoreReplies}
          onUpvote={handleRepliesUpvote}
          onRemoveVote={handleRepliesRemoveVote}
          onUpdateDownvote={updateReplyDownvote}
          onReportReplies={handleReport}
          onOpenTipHistory={onOpenTipHistory}
          onReport={onReport}
          onSearchPeople={onSearchPeople}
          onDelete={showConfirmDeleteDialog}
          scrollToPost={scrollToPost}
        />
      </div>
    </>
  );
});
