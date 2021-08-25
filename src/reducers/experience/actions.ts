import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import * as constants from './constants';

import {Experience, Tag} from 'src/interfaces/experience';
import {People} from 'src/interfaces/people';
import * as ExperienceAPI from 'src/lib/api/experience';
import * as PeopleAPI from 'src/lib/api/people';
import * as TagAPI from 'src/lib/api/tag';
import {ThunkActionCreator} from 'src/types/thunk';

/**
 * Action Types
 */
export interface LoadExperience extends PaginationAction {
  type: constants.FETCH_EXPERIENCE;
  experiences: Experience[];
}
export interface SearchExperience extends PaginationAction {
  type: constants.SEARCH_EXPERIENCE;
  experiences: Experience[];
}
export interface SearchPeople extends PaginationAction {
  type: constants.SEARCH_PEOPLE;
  people: People[];
}
export interface SearchTags extends PaginationAction {
  type: constants.SEARCH_TAGS;
  tags: Tag[];
}
/**
 * Union Action Types
 */

export type Actions = LoadExperience | SearchExperience | SearchPeople | SearchTags | BaseAction;

/**
 *
 * Actions
 */

/**
 * Action Creator
 */

export const fetchExperience: ThunkActionCreator<Actions, RootState> =
  () => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {meta, data: experiences} = await ExperienceAPI.getUserExperience(user.id);
      dispatch({
        type: constants.FETCH_EXPERIENCE,
        experiences,
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

export const cloneExperience: ThunkActionCreator<Actions, RootState> =
  (experienceId: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await ExperienceAPI.cloneExperience(user.id, experienceId);
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

export const searchExperience: ThunkActionCreator<Actions, RootState> =
  (query: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));

    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const {meta, data: experiences} = await ExperienceAPI.searchExperience(query);

      dispatch({
        type: constants.SEARCH_EXPERIENCE,
        experiences,
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

export const searchPeople: ThunkActionCreator<Actions, RootState> =
  (query: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const {meta, data: people} = await PeopleAPI.searchPeople(query);
      dispatch({
        type: constants.SEARCH_PEOPLE,
        people,
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

export const searchTags: ThunkActionCreator<Actions, RootState> =
  (query: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      const {meta, data: tags} = await TagAPI.searchTag(query);
      dispatch({
        type: constants.SEARCH_TAGS,
        tags,
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
