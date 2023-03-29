import { Axios } from "./Axios";

function login(payload) {
  return Axios.post(`/user/login-admin`, payload);
}

export const authenServices = {
  login,
};
