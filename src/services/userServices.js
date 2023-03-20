import {Axios} from './Axios';


function getAllUsers(payload) {
    return Axios.get('/user/find-all', payload);
}

function addUser(payload) {
    return Axios.post('/user/signup', payload);
}


function searchUser(payload) {
    return Axios.get('/user/search', payload);
}

function removeUser(id) {
    return Axios.del(`/user/delete/${id}`);
}

export const userServices = {
    getAllUsers,
    addUser,
    searchUser,
    removeUser
};