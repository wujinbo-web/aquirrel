/*
 *
 * profile actions
 *
 */

import {
  USER_PROFILE_REQUEST,
  USER_PROFILE_FAILURE,
  USER_PROFILE_SUCCESS,
} from './constants';
import { getUserProfile } from '../../api';

const userProfileRequest = () => {
  return {
    type: USER_PROFILE_REQUEST,
    isLoading: true,
  };
};

const userProfileSuccess = (payload) => {
  return {
    type: USER_PROFILE_FAILURE,
    isLoading: false,
    payload,
  };
};

const userProfileFailure = (payload) => {
  return {
    type: USER_PROFILE_SUCCESS,
    isLoading: false,
    payload,
  };
};

export const userProfile = (params) => {
  return async (dispatch) => {
    dispatch(userProfileRequest());
    try {
      //获取用户信息
      //const response = await getUserProfile(params);
      const data={
        name: sessionStorage.name,
        department: sessionStorage.departmentName,
        avatar: 'https://img.alicdn.com/tfs/TB1L6tBXQyWBuNjy0FpXXassXXa-80-80.png',
        userid: 10001,
      };
      dispatch(userProfileSuccess(data));
    } catch (error) {
      dispatch(userProfileFailure(error));
    }
  };
};
