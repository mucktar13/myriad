import React, {createRef, useEffect} from 'react';

import Typography from '@material-ui/core/Typography';

import {CommentDeleted} from '../CommentDeleted';
import {CommentDetail, CommentDetailProps} from '../CommentDetail';
import {useStyles} from './CommentList.style';

import useTipHistoryHook from 'components/TipHistory/use-tip-history.hook';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {Comment} from 'src/interfaces/comment';
import {User} from 'src/interfaces/user';

type CommentListProps = Omit<CommentDetailProps, 'comment' | 'deep' | 'onOpenTipHistory'> & {
  comments: Comment[];
  user?: User;
  deep?: number;
  placeholder?: string;
  focus?: boolean;
  expand?: boolean;
  hasMoreComment: boolean;
  onLoadMoreComments: () => void;
  onReportReplies?: (replies: Comment) => void;
};

type RefComment = Record<string, React.RefObject<HTMLDivElement>>;

export const CommentList: React.FC<CommentListProps> = props => {
  const {
    user,
    comments,
    deep = 0,
    hasMoreComment = false,
    onLoadMoreComments,
    ...restProps
  } = props;

  const styles = useStyles();
  const {query} = useQueryParams();
  const tipHistory = useTipHistoryHook();

  const refs: RefComment = comments.reduce((acc: RefComment, value: Comment) => {
    acc[value.id] = createRef<HTMLDivElement>();
    return acc;
  }, {});

  useEffect(() => {
    if (Object.keys(refs).length > 0) {
      if (!Array.isArray(query.comment) && query.comment) {
        if (refs[query.comment]?.current) {
          refs[query.comment].current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    }
  }, [refs, query]);

  const handleOpenTipHistory = (reference: Comment) => {
    tipHistory.open(reference);
  };

  return (
    <div className={styles.root} id={`comment-list-${deep}`}>
      {deep > 0 && <div className={styles.horizontalTree} />}

      {comments.map(comment => {
        return comment.deleteByUser ? (
          <CommentDeleted
            ref={refs[comment.id]}
            key={comment.id}
            user={user}
            comment={comment}
            deep={deep}
            onOpenTipHistory={handleOpenTipHistory}
          />
        ) : (
          <CommentDetail
            ref={refs[comment.id]}
            key={comment.id}
            user={user}
            deep={deep}
            comment={comment}
            onOpenTipHistory={handleOpenTipHistory}
            {...restProps}
          />
        );
      })}

      {comments.length > 0 && hasMoreComment && (
        <Typography
          color="primary"
          component="button"
          className={styles.more}
          onClick={onLoadMoreComments}>
          View more replies
        </Typography>
      )}
    </div>
  );
};
