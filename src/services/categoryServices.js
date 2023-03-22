import {Axios} from './Axios';

function getAllCategory(payload) {
    return Axios.get(`/product-category/find-all`, payload);
}


function createCategory(payload) {
    return Axios.post(`/product-category/add`, payload);
}

function removeCategory(id) {
    return Axios.del(`/product-category/delete/${id}`);
}


function searchCate(payload) {
    return Axios.get(`/product-category/search`, payload);
}

function findCategoryById(id) {
    return Axios.get(`/product-category/find-by-id/${id}`);
}

function editCategory(payload) {
    return Axios.put(`/product-category/update`, payload);
}

export const categoryServices = {
    getAllCategory,
    createCategory,
    removeCategory,
    searchCate,
    findCategoryById,
    editCategory
};