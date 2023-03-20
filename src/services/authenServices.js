import {Axios} from './Axios';

function login (payload){
    return Axios.post(`/user/login`,payload);
}

export const authenServices = {
    login
};