import React, {useState, useEffect, useRef} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Link from 'next/link';

import {Button, Grid} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {FilterDropdownMenu} from '../atoms/FilterDropdownMenu';
import SearchComponent from '../atoms/Search/SearchBox';
import {friendFilterOptions, FriendType} from './default';
import {FriendListProps} from './default';
import {useStyles} from './friend.style';
import {useFriendList} from './hooks/use-friend-list.hook';

import {Empty} from 'src/components-v2/atoms/Empty';
import {Loading} from 'src/components-v2/atoms/Loading';
import ShowIf from 'src/components/common/show-if.component';
import {acronym} from 'src/helpers/string';

import getConfig from 'next/config';

export const FriendListComponent: React.FC<FriendListProps> = props => {
  const {
    friends,
    user,
    hasMore,
    background = false,
    disableFilter = false,
    onSearch,
    onFilter,
    onLoadNextPage,
  } = props;
  const style = useStyles();

  const [friendLink,setFriendLink] = useState<{[key:string] : string[]}>({})
  const chatFriendRef = useRef<any[]>([])

  const list = useFriendList(friends, user);

  const handleFilterSelected = (selected: string) => {
    onFilter(selected as FriendType);
  };

  const handleSearch = (query: string) => {
    onSearch(query);
  };

  const getGunPubKey = async (id:string) => {

    const {publicRuntimeConfig} = getConfig();
    const baseURL = publicRuntimeConfig.apiURL;

    return new Promise((resolve, reject) => {
      fetch(`${baseURL}/users/${id}`, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then(res => res.json())
      .then(
        (result) => {
          let alias = result.name || "";
          let pub = result.gunPub || "";
          let epub = result.gunEpub || "";
          resolve(`${pub}&${epub}&${alias}`);
        }
      )
      .catch(err=>{
        reject(err);
      })
    });  
  }

  useEffect(()=>{
    list.map((friend,index)=>{
      getGunPubKey(friend.id)
      .then((link)=>{
        chatFriendRef.current[index].href = `/chat/${link}`;
      })
    })
  },[list.length])

  if (friends.length === 0) {
    return (
      <Empty title="Friend list is empty" subtitle="Find or invite your friends to Myriad 😉" />
    );
  }

  return (
    <div>
      <ShowIf condition={!disableFilter}>
        <FilterDropdownMenu
          title="Filter by"
          options={friendFilterOptions}
          onChange={handleFilterSelected}
        />
      </ShowIf>

      <SearchComponent onSubmit={handleSearch} placeholder={'Search friend'} />

      <List className={style.list}>
        <InfiniteScroll
          scrollableTarget="scrollable-timeline"
          dataLength={list.length}
          hasMore={hasMore}
          next={onLoadNextPage}
          loader={<Loading />}>
          {list.map((friend,index) => (            
            <ListItem
              key={friend.id}
              classes={{root: background ? style.backgroundEven : ''}}
              className={style.item}
              alignItems="center">
              <Grid container style={{padding: '10px'}}>
                <Grid item xs container>
                  <Grid item>
                    <ListItemAvatar>
                      <Avatar className={style.avatar} alt={'name'} src={friend.avatar}>
                        {acronym(friend.name)}
                      </Avatar>
                    </ListItemAvatar>
                  </Grid>
                  <Grid item>
                    <ListItemText>
                      <Link href={`/profile/${friend.id}`}>
                        <a href={`/profile/${friend.id}`} className={style.link}>
                          <Typography className={style.name} component="span" color="textPrimary">
                            {friend.name}
                          </Typography>
                        </a>
                      </Link>
                      <Typography className={style.friend} component="p" color="textSecondary">
                        1 mutual friends
                      </Typography>
                    </ListItemText>
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <Button variant="contained" color="primary" href={`#proses`} ref={(el)=>{
                    chatFriendRef.current[index] = el;
                    return chatFriendRef.current[index]
                  }}>
                    Chat
                  </Button>                  
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </InfiniteScroll>
      </List>
    </div>
  );
};
