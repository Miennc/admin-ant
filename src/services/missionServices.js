import {Axios} from './Axios';


function createMission(payload) {
    return Axios.post('/mission/add', payload);
}

function searchMission(payload) {
    return Axios.get('/mission/search', payload);
}

function removeMission(id) {
    return Axios.del(`/mission/delete/${id}`);
}

function findByIdMission(id) {
    return Axios.get(`/mission/find-by-id/${id}`);
}

function editMission(payload) {
    return Axios.put(`/mission/update`, payload);
}

function listAllMission(payload) {
    return Axios.get('/mission/find-all', payload);
}

export const missionServices = {
    createMission,
    searchMission,
    removeMission,
    findByIdMission,
    editMission,
    listAllMission
};