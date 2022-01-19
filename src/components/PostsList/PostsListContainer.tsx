import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {PostImporterContainer} from '../PostImporterList';
import {ReportContainer} from '../Report';
import {SendTipContainer} from '../SendTip';
import {useTimelineHook} from '../Timeline/hooks/use-timeline.hook';
import {TipHistoryContainer} from '../TipHistory';
import {Modal} from '../atoms/Modal';
import {PromptComponent} from '../atoms/Prompt/prompt.component';
import {PostsList} from './PostsList';

import {PostVisibilityContainer} from 'src/components/PostVisibility';
import {useTipHistory} from 'src/hooks/tip-history.hook';
import {useToasterSnackHook} from 'src/hooks/use-toaster-snack.hook';
import {Comment} from 'src/interfaces/comment';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {removeImporter} from 'src/reducers/importers/actions';
import {upvote, setDownvoting, removeVote} from 'src/reducers/timeline/actions';
import {setIsTipSent} from 'src/reducers/wallet/actions';
import {WalletState} from 'src/reducers/wallet/reducer';

type PostsListContainerProps = {
  anonymous?: boolean;
  query: string;
};

export const PostsListContainer: React.FC<PostsListContainerProps> = props => {
  const {query} = props;

  const dispatch = useDispatch();

  const {page, posts, hasMore, searchPosts, getTippedUserId} = useTimelineHook();
  const {openTipHistory} = useTipHistory();
  const {openToasterSnack} = useToasterSnackHook();

  const {isTipSent} = useSelector<RootState, WalletState>(state => state.walletState);

  useEffect(() => {
    if (isTipSent) {
      closeSendTip();
    }
  }, [isTipSent]);

  const user = useSelector<RootState, User | undefined>(state => state.userState.user);
  const anonymous = useSelector<RootState, boolean>(state => state.userState.anonymous);
  const [tippedPost, setTippedPost] = useState<Post | null>(null);
  const [tippedContentForHistory, setTippedContentForHistory] = useState<Post | null>(null);

  const [visibility, setVisibility] = useState<Post | null>(null);
  const [reported, setReported] = useState<Post | null>(null);
  const [importedPost, setImportedPost] = useState<Post | null>(null);
  const [openSuccessPrompt, setOpenSuccessPrompt] = useState(false);
  const sendTipOpened = Boolean(tippedPost);

  const handleLoadNextPage = () => {
    searchPosts(query, page + 1);
  };

  const handleUpvote = (reference: Post | Comment) => {
    dispatch(upvote(reference));
  };

  const handleSendTip = (reference?: Post | Comment) => {
    // type guard to check if reference is a Post object
    if (reference && 'platform' in reference) {
      setTippedPost(reference);
      getTippedUserId(reference.id);
    }
  };

  const closeSendTip = () => {
    if (isTipSent && tippedPost) {
      setOpenSuccessPrompt(true);
      setTippedContentForHistory(tippedPost);
    } else {
      console.log('no post tipped');
    }
    dispatch(setIsTipSent(false));

    setTippedPost(null);
  };

  const handleCloseSuccessPrompt = (): void => {
    setOpenSuccessPrompt(false);
  };

  const handleOpenTipHistory = (): void => {
    if (tippedContentForHistory) {
      openTipHistory(tippedContentForHistory);
      setOpenSuccessPrompt(false);
    }
  };

  const handleReportPost = (post: Post) => {
    setReported(post);
  };

  const handleImportedPost = (post: Post) => {
    setImportedPost(post);
  };

  const closeImporters = () => {
    setImportedPost(null);
    dispatch(removeImporter());
  };

  const closeReportPost = () => {
    setReported(null);
  };

  const handlePostVisibility = (post: Post) => {
    setVisibility(post);
  };

  const closePostVisibility = () => {
    setVisibility(null);
  };

  const handleSharePost = (post: Post, type: 'link' | 'post') => {
    if (type === 'post') {
      openToasterSnack({
        message: 'This post successfully share to your timeline',
        variant: 'success',
      });
    }
  };

  const handleToggleDownvoting = (reference: Post | Comment | null) => {
    dispatch(setDownvoting(reference));
  };

  const handleRemoveVote = (reference: Post | Comment) => {
    dispatch(removeVote(reference));
  };

  return (
    <>
      <PostsList
        user={user}
        anonymous={anonymous}
        loadNextPage={handleLoadNextPage}
        hasMore={hasMore}
        upvote={handleUpvote}
        onSendTip={handleSendTip}
        onOpenTipHistory={openTipHistory}
        onReport={handleReportPost}
        onPostVisibility={handlePostVisibility}
        toggleDownvoting={handleToggleDownvoting}
        onShared={handleSharePost}
        searchedPosts={posts}
        onRemoveVote={handleRemoveVote}
        onImporters={handleImportedPost}
      />

      <Modal
        gutter="none"
        open={sendTipOpened}
        onClose={closeSendTip}
        title="Send Tip"
        subtitle="Find this user insightful? Send a tip!">
        <SendTipContainer />
      </Modal>

      <PromptComponent
        icon={'success'}
        open={openSuccessPrompt}
        onCancel={handleCloseSuccessPrompt}
        title={'Success'}
        subtitle={
          <Typography component="div">
            Tip to{' '}
            <Box fontWeight={400} display="inline">
              {tippedContentForHistory?.platform === 'myriad'
                ? tippedContentForHistory?.user.name
                : tippedContentForHistory?.people?.name ?? 'Unknown Myrian'}
            </Box>{' '}
            sent successfully
          </Typography>
        }>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            style={{marginRight: '12px'}}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={handleOpenTipHistory}>
            See tip history
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleCloseSuccessPrompt}>
            Return
          </Button>
        </div>
      </PromptComponent>

      <TipHistoryContainer onSendTip={handleSendTip} />
      <ReportContainer reference={reported} onClose={closeReportPost} />
      <PostImporterContainer post={importedPost} onClose={closeImporters} />
      <PostVisibilityContainer reference={visibility} onClose={closePostVisibility} />
    </>
  );
};
