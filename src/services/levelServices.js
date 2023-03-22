import {Axios} from './Axios';

function getAllLevel(payload) {
    return Axios.get(`/level/find-all`, payload);
}

function removeLevel(id) {
    return Axios.del(`/level/delete/${id}`);
}


function createLevel(payload) {
    return Axios.post(`/level/add`, payload);
}

function  searchLevel(payload) {
    return Axios.get(`/level/search`, payload);
}

function  findLevelById(id) {
    return Axios.get(`/level/find-by-id/${id}`);
}

function editLevel(payload) {
    return Axios.put(`/level/update`, payload);
}


export const levelServices = {
    getAllLevel,
    removeLevel,
    createLevel,
    searchLevel,
    findLevelById,
    editLevel
};