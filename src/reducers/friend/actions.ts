import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Friend} from 'src/interfaces/friend';
import * as FriendAPI from 'src/lib/api/friends';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */

export interface LoadFriends extends PaginationAction {
  type: constants.FETCH_FRIEND;
  friends: Friend[];
}

export interface FilterFriend extends PaginationAction {
  type: constants.FILTER_FRIEND;
  friends: Friend[];
  filter: string;
}

/**
 * Union Action Types
 */

export type Actions = LoadFriends | FilterFriend | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */
export const fetchFriend: ThunkActionCreator<Actions, RootState> =
  (page = 1) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {meta, data: friends} = await FriendAPI.getFriends(user.id, page);

      dispatch({
        type: constants.FETCH_FRIEND,
        friends,
        meta,
      });
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const searchFriend: ThunkActionCreator<Actions, RootState> =
  (query: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {meta, data: friends} = await FriendAPI.searchFriend(user.id, query);

      dispatch({
        type: constants.FILTER_FRIEND,
        friends,
        meta,
        filter: query,
      });
    } catch (error) {
      dispatch(
        setError({
          message: error.message,
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
