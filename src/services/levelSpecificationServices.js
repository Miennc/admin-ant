import {Axios} from './Axios';

function listAllLevelSpecification(payload) {
    return Axios.get('/level-specifications/find-all', payload);
}

function createLevelSpecification(payload) {
    return Axios.post('/level-specifications/add', payload);

}

function searchLevelSpecification(payload) {
    return Axios.get('/level-specifications/search', payload);
}

function removeLevelSpecification(id) {
    return Axios.del(`/level-specifications/delete/${id}`);
}

function findByIdLevelSpecification(id) {
    return Axios.get(`/level-specifications/find-by-id/${id}`);
}

function editLevelSpecification(payload) {
    return Axios.put(`/level-specifications/update`, payload);
}


function getUnitMoney() {
    return Axios.get('/product/find-all-unit-money');
}


export const levelSpecificationServices = {
    listAllLevelSpecification,
    getUnitMoney,
    createLevelSpecification,
    searchLevelSpecification,
    removeLevelSpecification,
    findByIdLevelSpecification,
    editLevelSpecification
};