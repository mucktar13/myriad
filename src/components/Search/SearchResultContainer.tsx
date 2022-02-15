import React, {useState, useEffect} from 'react';

import {useRouter} from 'next/router';

import Typography from '@material-ui/core/Typography';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

import {SearchExperienceListContainer} from '../ExperienceList';
import {PostsListContainer} from '../PostsList/PostsListContainer';
import {useTimelineHook} from '../Timeline/hooks/use-timeline.hook';
import {UsersListContainer} from '../UsersList/UsersListContainer';
import {SearchBoxContainer} from '../atoms/Search/SearchBoxContainer';
import {TabItems} from '../atoms/Tabs';
import {TabsComponent} from '../atoms/Tabs';

import {useExperienceHook} from 'src/hooks/use-experience-hook';
import {useSearchHook} from 'src/hooks/use-search.hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      position: 'relative',
      fontSize: '14px',
      color: theme.palette.text.secondary,
      alignSelf: 'start',
    },
  }),
);

export const SearchResultContainer: React.FC = () => {
  const style = useStyles();

  const router = useRouter();

  const {searchExperience, clearExperiences} = useExperienceHook();
  const {searchUsers, clearUsers} = useSearchHook();
  const {searchPosts, clearPosts} = useTimelineHook();

  const [selectedTab, setSelectedTab] = useState('');
  const searchKeyword = router.query.q as string;

  useEffect(() => {
    if (searchKeyword.length) {
      switch (selectedTab) {
        case 'posts-tab': {
          searchPosts(searchKeyword);
          break;
        }

        case 'users-tab': {
          searchUsers(searchKeyword);
          break;
        }

        case 'experience-tab': {
          searchExperience(searchKeyword);
          break;
        }

        default: {
          searchPosts(searchKeyword);
          break;
        }
      }
    }
  }, [searchKeyword, selectedTab]);

  const [searchResultTabTexts] = useState<TabItems<string>[]>([
    {
      id: 'posts-tab',
      title: 'Post',
      component: <PostsListContainer query={searchKeyword} />,
    },
    {
      id: 'users-tab',
      title: 'Users',
      component: <UsersListContainer query={searchKeyword} />,
    },
    {
      id: 'experience-tab',
      title: 'Experience',
      component: <SearchExperienceListContainer query={searchKeyword} />,
    },
  ]);

  const handleChangeTab = (currentTab: string) => {
    setSelectedTab(currentTab);
  };

  const onSubmitSearch = (query: string) => {
    clearPosts();
    clearUsers();
    clearExperiences();

    router.push(
      {
        pathname: 'search',
        query: {
          q: query,
        },
      },
      undefined,
      {shallow: true},
    );
  };

  return (
    <>
      <SearchBoxContainer onSubmitSearch={onSubmitSearch} />
      <Typography className={style.text}>
        Search results for &quot;
        <Typography variant="inherit" color="primary">
          {searchKeyword}
        </Typography>
        &quot; :
      </Typography>
      <TabsComponent
        id="scrollable-users-list"
        active={searchResultTabTexts[0].id}
        tabs={searchResultTabTexts}
        mark="underline"
        background={selectedTab === 'users-tab' ? 'white' : 'transparent'}
        position="left"
        size="medium"
        padding={selectedTab === 'experience-tab' || selectedTab === 'users-tab' ? 0 : 3.75}
        borderRadius={10}
        paddingLeft={selectedTab === 'users-tab' || selectedTab === 'experience-tab' ? 0 : 30}
        paddingRight={selectedTab === 'users-tab' || selectedTab === 'experience-tab' ? 0 : 30}
        onChangeTab={handleChangeTab}
      />
    </>
  );
};
