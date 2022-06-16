import React, {useState} from 'react';
import {useSelector} from 'react-redux';

import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import {RichTextComponent} from '.';
import {useStyles} from './richtext.style';

import {PromptComponent} from 'src/components/Mobile/PromptDrawer/Prompt';
import {useQueryParams} from 'src/hooks/use-query-params.hooks';
import {TimelineType} from 'src/interfaces/timeline';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const PostCreateContainer = dynamic(() => import('../PostCreate/PostCreate.container'), {
  ssr: false,
});

export const RichTextContainer: React.FC = () => {
  const router = useRouter();
  const style = useStyles();

  const {query} = useQueryParams();

  const {user, alias, anonymous} = useSelector<RootState, UserState>(state => state.userState);

  const [createPostOpened, setCreatePostOpened] = useState(false);
  const [openPromptDrawer, setOpenPromptDrawer] = useState(false);

  const handleOpenCreatePost = () => {
    if (anonymous) {
      setOpenPromptDrawer(true);
    } else {
      setCreatePostOpened(true);
    }
  };

  const handleCloseCreatePost = () => {
    setCreatePostOpened(false);

    // change to all tab, on create post
    if (query.type && query.type !== TimelineType.ALL) {
      router.push('/home', undefined, {shallow: true});
    }
  };

  const handleCancel = () => {
    setOpenPromptDrawer(false);
  };

  return (
    <div className={style.box}>
      <RichTextComponent
        userProfilePict={user?.profilePictureURL || ''}
        onOpenCreatePost={handleOpenCreatePost}
        alias={alias}
        name={user?.name}
        placeholder={i18n.t('Home.RichText.Placeholder')}
      />
      <PromptComponent
        title={'Create or Import Posts'}
        subtitle={
          'You can post directly from Myriad or imported post in myriad from other social media platforms'
        }
        open={openPromptDrawer}
        onCancel={handleCancel}
      />
      <PostCreateContainer open={createPostOpened} onClose={handleCloseCreatePost} />
    </div>
  );
};
