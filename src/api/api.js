import { get, post } from './axios';

export const requestLogin = params => { return post(`/user/login`, params); };

export const requestRegister = params => { return post(`/user/register`, params); };

export const getVerificationCode = params => { return post(`/user/verificationCode`, params); };

export const modifyPassword = params => { return post(`/user/modifyPassword`, params); };

export const getUserList = params => { return post(`/user/findList`, params); };

export const modifyUser = params => { return post(`/user/modifyUser`, params); };

export const resetPassword = params => { return post(`/user/resetPassword`, params); };

export const forgetPassword = params => { return post(`/user/forgetPassword`, params); };

export const getConfigListPage = params => { return post(`/appConfig/findList`, params); };

export const doConfig = params => { return post(`/appConfig/config`, params); };

export const delConfig = params => { return post(`/appConfig/delete`, params); };

export const transferConfig = params => { return post(`/appConfig/transfer`, params); };

export const getConfig = params => { return get(`/appConfig/get`, params); };
