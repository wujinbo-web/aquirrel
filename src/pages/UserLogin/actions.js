/*
 * Login Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import { push } from 'react-router-redux';
import { Feedback } from '@icedesign/base';
import { login } from '../../api';
import axios from 'axios';
import { API_URL } from '../../config'
import { setAuthority } from '../../utils/authority';
import { reloadAuthorized } from '../../utils/Authorized';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */

 //派发状态  请求接口
const userLoginRequest = () => {
  return {
    type: USER_LOGIN_REQUEST,
    isLoading: true,
  };
};
//请求成功
const userLoginSuccess = (payload) => {
  return {
    type: USER_LOGIN_SUCCESS,
    payload,
    isLoading: false,
  };
};
//请求失败
const userLoginFailure = (payload) => {
  return {
    type: USER_LOGIN_FAILURE,
    payload,
    isLoading: false,
  };
};

export const userLogin = (params) => {
  return async (dispatch) => {
    //派发状态 请求接口
    dispatch(userLoginRequest());
    try {
      //请求接口
      // const response = await login(params);  虚拟接口
      const response = await axios.get(`${API_URL}/webLogin.do?account=${params.username}&password=${params.password}`)
      console.log(response,"看看登陆的状态");
      //派发状态 请求成功
      dispatch(userLoginSuccess(response.data));

      if (response.data.state === "success") {

        //在localStroage设置账号权限
        setAuthority(response.data.user.roleId);
        //更新RenderAuthorized中的权限
        reloadAuthorized();
        //登陆成功之后跳转的页面
        //保存个人信息
        sessionStorage.departmentName=response.data.departmentName;  //部门
        sessionStorage.name=response.data.user.name;

        dispatch(push('/'));
      } else {
        Feedback.toast.error(response.data.msg);
      }

      return response.data;
    } catch (error) {
      dispatch(userLoginFailure(error));
    }
  };
};
