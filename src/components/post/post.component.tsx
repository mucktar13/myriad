import React, { useState, useRef } from 'react';
//@ts-ignore
import { FacebookProvider, EmbeddedPost } from 'react-facebook';
import ReactMarkdown from 'react-markdown';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

import { PostActionComponent } from './post-action.component';
import PostAvatarComponent from './post-avatar.component';
import PostImageComponent from './post-image.component';
import { PostOptionsComponent } from './post-options.component';
import { PostSubHeader } from './post-sub-header.component';
import PostVideoComponent from './post-video.component';
import { useStyles } from './post.style';
import { TipSummaryComponent } from './tip-summary/tip-summary.component';

import remarkGFM from 'remark-gfm';
import remarkHTML from 'remark-html';
import CardTitle from 'src/components/common/CardTitle.component';
import SendTipModal from 'src/components/common/sendtips/SendTipModal';
import ShowIf from 'src/components/common/show-if.component';
import { useUser } from 'src/context/user.context';
import { useSocialDetail } from 'src/hooks/use-social.hook';
import { BalanceDetail } from 'src/interfaces/balance';
import { ImageData } from 'src/interfaces/post';
import { Post } from 'src/interfaces/post';
import { Token } from 'src/interfaces/token';
import { v4 as uuid } from 'uuid';

const CommentComponent = dynamic(() => import('./comment/comment.component'));

const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string;

type PostProps = {
  defaultExpanded?: boolean;
  disable?: boolean;
  post: Post;
  postOwner?: boolean;
  balanceDetails: BalanceDetail[];
  availableTokens: Token[];
};

export default function PostComponent({
  balanceDetails,
  post,
  defaultExpanded = false,
  disable = false,
  postOwner,
  availableTokens
}: PostProps) {
  const style = useStyles();

  const router = useRouter();
  const { loading, detail } = useSocialDetail(post);
  const {
    state: { user }
  } = useUser();

  const [expanded, setExpanded] = useState(defaultExpanded);
  const [openTipSummary, setOpenTipSummary] = useState(false);
  const [tippedPost, setTippedPost] = useState<Post>();
  const headerRef = useRef<any>();
  const sendTipRef = useRef<any>();

  if (!detail || !user) return null;

  if (post.text === '[removed]' && post.platform === 'reddit') return null;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const tipPostUser = () => {
    if (disable) {
      return;
    }

    sendTipRef.current.triggerSendTipModal();
  };

  const openContentSource = () => {
    if (!post.platformUser) {
      return;
    }

    const url = getPlatformUrl();

    switch (post.platform) {
      case 'myriad':
        router.push(post.platformUser.platform_account_id);
        break;
      default:
        window.open(url, '_blank');
        break;
    }
  };

  const getPlatformUrl = (): string => {
    let url = '';

    if (!post.platformUser) return url;

    switch (post.platform) {
      case 'twitter':
        url = `https://twitter.com/${post.platformUser.username}`;
        break;
      case 'reddit':
        url = `https://reddit.com/user/${post.platformUser.username}`;
        break;
      case 'myriad':
        url = post.platformUser.platform_account_id;
        break;
      default:
        url = post.link || '';
        break;
    }

    return url;
  };

  const urlToImageData = (url: string): ImageData => {
    return {
      src: url,
      height: 400,
      width: 400
    };
  };
  const likePost = () => {};

  const dislikePost = () => {};

  if (!detail || !post) return null;

  const handleTipSentSuccess = (postId: string) => {
    if (postId) {
      setTippedPost(post);
    }
  };

  const handleCloseTipSummary = () => {
    setOpenTipSummary(false);
  };

  const renderPostAvatar = () => {
    let avatarUrl: string = detail.user.avatar;

    if (post.platform === 'myriad' && post.platformUser?.platform_account_id === user?.id) {
      avatarUrl = user?.profilePictureURL as string;
    }

    return <PostAvatarComponent origin={post.platform} avatar={avatarUrl} onClick={openContentSource} />;
  };

  if (loading) return null;

  return (
    <>
      <Card className={style.root}>
        <CardHeader
          className={style.header}
          disableTypography
          ref={headerRef}
          avatar={renderPostAvatar()}
          action={<PostOptionsComponent postId={post.id} ownPost={postOwner || false} />}
          title={<CardTitle text={detail.user.name} url={getPlatformUrl()} />}
          subheader={<PostSubHeader date={detail.createdOn} importer={post.importer} platform={post.platform} />}
        />

        <ShowIf condition={['twitter', 'reddit'].includes(post.platform)}>
          <CardContent className={style.content}>
            <ShowIf condition={post.tags.length > 0}>
              <div>
                {post.tags.map(tag => (
                  <div style={{ marginRight: 4, display: 'inline-block' }} key={uuid()}>
                    #{tag}
                  </div>
                ))}
              </div>
            </ShowIf>
            <ReactMarkdown remarkPlugins={[remarkGFM, remarkHTML]}>{detail.text}</ReactMarkdown>
            {detail.images && detail.images.length > 0 && <PostImageComponent images={detail.images} />}
            {detail.videos && detail.videos.length > 0 && <PostVideoComponent url={detail.videos[0]} />}
          </CardContent>
        </ShowIf>

        <ShowIf condition={post.platform === 'myriad'}>
          <CardContent className={style.content}>
            <Typography variant="body1" color="textPrimary" component="p">
              {detail.text}
            </Typography>
            {post.assets && post.assets.length > 0 && <PostImageComponent images={post.assets.map(urlToImageData)} />}
          </CardContent>
        </ShowIf>

        <ShowIf condition={post.platform === 'facebook'}>
          <CardContent className={style.content}>
            <FacebookProvider appId={FACEBOOK_APP_ID}>
              <EmbeddedPost href={post.link} width="700" />
            </FacebookProvider>
          </CardContent>
        </ShowIf>

        <CardActions disableSpacing className={style.action}>
          <PostActionComponent
            post={post}
            detail={detail}
            expandComment={handleExpandClick}
            commentExpanded={expanded}
            likePost={likePost}
            dislikePost={dislikePost}
            tipOwner={tipPostUser}
          />
        </CardActions>

        <ShowIf condition={expanded}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent className={style.reply}>
              <CommentComponent
                post={post}
                disableReply={disable}
                hide={handleExpandClick}
                balanceDetails={balanceDetails}
                availableTokens={availableTokens}
              />
            </CardContent>
          </Collapse>
        </ShowIf>
      </Card>

      <SendTipModal
        availableTokens={availableTokens}
        success={postId => handleTipSentSuccess(postId)}
        userAddress={user.id}
        ref={sendTipRef}
        postId={post.id as string}
        balanceDetails={balanceDetails}
      />

      {tippedPost ? <TipSummaryComponent post={tippedPost} open={openTipSummary} close={handleCloseTipSummary} /> : <></>}
    </>
  );
}
