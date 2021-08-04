import React, {useState, useRef} from 'react';
import {FacebookProvider, EmbeddedPost} from 'react-facebook';
import ReactMarkdown from 'react-markdown';
import {useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {useRouter} from 'next/router';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';

import {PostActionComponent} from './post-action.component';
import PostAvatarComponent from './post-avatar.component';
import PostImageComponent from './post-image.component';
import {PostSubHeader} from './post-sub-header.component';
import PostVideoComponent from './post-video.component';
import {useStyles} from './post.style';

import remarkGFM from 'remark-gfm';
import remarkHTML from 'remark-html';
import CardTitle from 'src/components/common/CardTitle.component';
import ShowIf from 'src/components/common/show-if.component';
import {useTipSummaryHook} from 'src/components/tip-summary/tip-summar.hook';
import {usePostHook} from 'src/hooks/use-post.hook';
import {Post, Comment} from 'src/interfaces/post';
import {ContentType} from 'src/interfaces/wallet';
import {RootState} from 'src/reducers';
import {TimelineState} from 'src/reducers/timeline/reducer';
import {fetchRecipientDetail} from 'src/reducers/user/actions';
import {setRecipientDetail} from 'src/reducers/user/actions';
import {UserState} from 'src/reducers/user/reducer';
import {v4 as uuid} from 'uuid';

const CommentComponent = dynamic(() => import('./comment/comment.component'), {
  ssr: false,
});
const Linkify = dynamic(() => import('src/components/common/Linkify.component'), {
  ssr: false,
});

const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string;

type PostComponentProps = {
  defaultExpanded?: boolean;
  disable?: boolean;
  post: Post;
  postOwner?: boolean;
  tippingClicked: () => void;
  selectedPost: (post: Post) => void;
};

const PostComponent: React.FC<PostComponentProps> = ({
  post,
  defaultExpanded = false,
  disable = false,
  tippingClicked,
  selectedPost,
}) => {
  const style = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);

  const {likePost, dislikePost} = usePostHook();
  const {openTipSummary} = useTipSummaryHook();
  const [expanded, setExpanded] = useState(defaultExpanded);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headerRef = useRef<any>();

  if (!user && !anonymous) return null;

  if (post.text === '[removed]' && post.platform === 'reddit') return null;

  const handleExpandClick = (): void => {
    setExpanded(!expanded);
  };

  const tipPostUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disable) {
      return;
    }

    e.stopPropagation();

    dispatch(fetchRecipientDetail(post.id));
    tippingClicked();
    selectedPost(post);
  };

  const defineRecipientDetail = (comment: Comment) => {
    const recipientDetail = {
      postId: comment.id,
      walletAddress: comment.userId,
      contentType: ContentType.COMMENT,
    };

    return recipientDetail;
  };

  const tipCommentUser = (comment: Comment) => {
    const recipientDetail = defineRecipientDetail(comment);
    dispatch(setRecipientDetail(recipientDetail));

    tippingClicked();
  };

  const openContentSource = (): void => {
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

  const likePostHandle = () => {
    likePost(post.id);
  };

  const dislikePostHandle = () => {
    dislikePost(post.id);
  };

  const onHashtagClicked = async (hashtag: string) => {
    await router.push(`/home?tag=${hashtag.replace('#', '')}&type=trending`, undefined, {
      shallow: true,
    });
  };

  return (
    <>
      <Card className={style.root}>
        <CardHeader
          className={style.header}
          disableTypography
          ref={headerRef}
          avatar={
            <PostAvatarComponent
              origin={post.platform}
              avatar={post.platformUser.profile_image_url}
              onClick={openContentSource}
            />
          }
          title={<CardTitle text={post.platformUser.name} url={getPlatformUrl()} />}
          subheader={
            <PostSubHeader
              date={post.createdAt}
              importer={post.importer}
              platform={post.platform}
            />
          }
        />
        <CardContent className={style.content}>
          <ShowIf condition={['twitter'].includes(post.platform)}>
            <Linkify
              text={post.text}
              handleClick={onHashtagClicked}
              variant="body1"
              color="textPrimary"
            />
          </ShowIf>

          <ShowIf condition={['reddit'].includes(post.platform)}>
            <Typography variant="h4" component="h1">
              {post.title}
            </Typography>
            <ReactMarkdown skipHtml remarkPlugins={[remarkGFM, remarkHTML]}>
              {post.text}
            </ReactMarkdown>
          </ShowIf>

          <ShowIf condition={post.platform === 'myriad'}>
            <div>
              {post.tags.map(tag => (
                <div style={{marginRight: 4, display: 'inline-block'}} key={uuid()}>
                  <Link href={`?tag=${tag}&type=trending`} shallow={true}>
                    <a href={`?tag=${tag}&type=trending`}>#{tag}</a>
                  </Link>
                </div>
              ))}
            </div>
            <Typography variant="body1" color="textPrimary" component="p">
              {post.text}
            </Typography>
          </ShowIf>

          <ShowIf condition={post.platform === 'facebook'}>
            <FacebookProvider appId={FACEBOOK_APP_ID}>
              <EmbeddedPost href={post.link} width="700" />
            </FacebookProvider>
          </ShowIf>

          {post.asset?.images && post.asset?.images.length > 0 && (
            <PostImageComponent platform={post.platform} images={post.asset.images} />
          )}

          {post.asset?.videos && post.asset.videos.length > 0 && (
            <PostVideoComponent url={post.asset.videos[0]} />
          )}
        </CardContent>

        <CardActions disableSpacing className={style.action}>
          <PostActionComponent
            post={post}
            expandComment={handleExpandClick}
            commentExpanded={expanded}
            likePost={likePostHandle}
            dislikePost={dislikePostHandle}
            tipOwner={e => tipPostUser(e)}
          />
        </CardActions>

        <ShowIf condition={expanded}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent className={style.reply}>
              <CommentComponent
                post={post}
                disableReply={disable}
                hide={handleExpandClick}
                toggleSendTip={comment => tipCommentUser(comment)}
              />
            </CardContent>
          </Collapse>
        </ShowIf>
      </Card>
    </>
  );
};

export default PostComponent;
