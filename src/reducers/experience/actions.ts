import {Actions as BaseAction, PaginationAction, setLoading, setError} from '../base/actions';
import {RootState} from '../index';
import {ShowToasterSnack, showToasterSnack} from '../toaster-snack/actions';
import {fetchUserExperience} from '../user/actions';
import * as constants from './constants';

import {Action} from 'redux';
import {Experience, ExperienceProps, Tag} from 'src/interfaces/experience';
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

export interface FetchTrendingExperience extends PaginationAction {
  type: constants.FETCH_TRENDING_EXPERIENCE;
  experiences: Experience[];
}

export interface LoadDetailExperience extends Action {
  type: constants.FETCH_DETAIL_EXPERIENCE;
  experience: Experience;
}

export interface SearchExperience extends PaginationAction {
  type: constants.SEARCH_EXPERIENCE;
  experiences: Experience[];
}

export interface SearchPeople extends Action {
  type: constants.SEARCH_PEOPLE;
  people: People[];
}
export interface SearchTags extends Action {
  type: constants.SEARCH_TAGS;
  tags: Tag[];
}

export interface ExperienceLoading extends Action {
  type: constants.EXPERIENCE_LOADING;
  loading: boolean;
}

export interface ClearExperiences extends Action {
  type: constants.CLEAR_EXPERIENCES;
}

/**
 * Union Action Types
 */

export type Actions =
  | LoadExperience
  | FetchTrendingExperience
  | LoadDetailExperience
  | SearchExperience
  | SearchPeople
  | SearchTags
  | ShowToasterSnack
  | ExperienceLoading
  | ClearExperiences
  | BaseAction;

/**
 *
 * Actions
 */

export const setExperienceLoading = (loading: boolean): ExperienceLoading => ({
  type: constants.EXPERIENCE_LOADING,
  loading,
});

export const clearExperiences = (): ClearExperiences => ({
  type: constants.CLEAR_EXPERIENCES,
});

/**
 * Action Creator
 */
export const loadExperiences: ThunkActionCreator<Actions, RootState> =
  (page = 1) =>
  async dispatch => {
    dispatch(setExperienceLoading(true));

    try {
      const {data: experiences, meta} = await ExperienceAPI.getExperiences({page});

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
      dispatch(setExperienceLoading(false));
    }
  };

export const fetchTrendingExperience: ThunkActionCreator<Actions, RootState> =
  (page = 1) =>
  async dispatch => {
    dispatch(setExperienceLoading(true));

    try {
      const {data: experiences, meta} = await ExperienceAPI.getExperiences({page}, true);

      dispatch({
        type: constants.FETCH_TRENDING_EXPERIENCE,
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
      dispatch(setExperienceLoading(false));
    }
  };

export const searchExperiences: ThunkActionCreator<Actions, RootState> =
  (query: string, page = 1) =>
  async (dispatch, getState) => {
    dispatch(setExperienceLoading(true));

    try {
      const {data: experiences, meta} = await ExperienceAPI.searchExperiences(query, page);

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
      dispatch(setExperienceLoading(false));
    }
  };

export const fetchDetailExperience: ThunkActionCreator<Actions, RootState> =
  (experienceId: string) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const experience = await ExperienceAPI.getExperienceDetail(experienceId);
      dispatch({
        type: constants.FETCH_DETAIL_EXPERIENCE,
        experience,
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
  (experienceId: string, experience: ExperienceProps, callback?: (id: string) => void) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const cloneExperience = await ExperienceAPI.createExperience(
        user.id,
        experience,
        experienceId,
      );
      callback && callback(cloneExperience.id);
      await dispatch(
        showToasterSnack({
          variant: 'success',
          message: 'Experience successfully cloned!',
        }),
      );
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
// TODO: move this to people reducer
export const searchPeople: ThunkActionCreator<Actions, RootState> =
  (query: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      if (query) {
        const people = await PeopleAPI.searchPeople(query);
        dispatch({
          type: constants.SEARCH_PEOPLE,
          people,
        });
      } else {
        dispatch({
          type: constants.SEARCH_PEOPLE,
          people: [],
        });
      }
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
// TODO: move this to tag reducer
export const searchTags: ThunkActionCreator<Actions, RootState> =
  (query: string) => async dispatch => {
    dispatch(setLoading(true));

    try {
      if (query) {
        const {meta, data: tags} = await TagAPI.searchTag(query);
        dispatch({
          type: constants.SEARCH_TAGS,
          tags,
          meta,
        });
      } else {
        dispatch({
          type: constants.SEARCH_TAGS,
          tags: [],
        });
      }
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

export const createExperience: ThunkActionCreator<Actions, RootState> =
  (experience: ExperienceProps, callback?: (id: string) => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      const newExperience = await ExperienceAPI.createExperience(user.id, experience);

      callback && callback(newExperience.id);

      await dispatch(
        showToasterSnack({
          variant: 'success',
          message: 'Experience succesfully created!',
        }),
      );
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

export const subscribeExperience: ThunkActionCreator<Actions, RootState> =
  (experienceId: string, callback?: () => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await ExperienceAPI.subscribeExperience(user.id, experienceId);

      callback && callback();

      await dispatch(
        showToasterSnack({
          variant: 'success',
          message: 'subscribed successfully!',
        }),
      );
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

export const updateExperience: ThunkActionCreator<Actions, RootState> =
  (experienceId: string, experience: Experience, callback?: (id: string) => void) =>
  async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await ExperienceAPI.updateExperience(user.id, experienceId, experience);
      await fetchUserExperience();

      callback && callback(experienceId);

      await dispatch(
        showToasterSnack({
          variant: 'success',
          message: 'experience succesfully updated!',
        }),
      );
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

export const deleteExperience: ThunkActionCreator<Actions, RootState> =
  (experienceId: string, callback?: () => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await ExperienceAPI.deleteExperience(experienceId);

      callback && callback();
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

export const unsubscribeExperience: ThunkActionCreator<Actions, RootState> =
  (experienceId: string, callback?: () => void) => async (dispatch, getState) => {
    dispatch(setLoading(true));
    try {
      const {
        userState: {user},
      } = getState();

      if (!user) {
        throw new Error('User not found');
      }

      await ExperienceAPI.unsubscribeExperience(experienceId);

      callback && callback();

      await dispatch(
        showToasterSnack({
          variant: 'success',
          message: 'unsubscribed successfully!',
        }),
      );
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
