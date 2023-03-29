import { Axios } from "./Axios";

function listAllProduct(payload) {
  return Axios.get("/product/find-all", payload);
}

function createProduct(payload) {
  return Axios.post("/product/add", payload);
}

function searchProduct(payload) {
  return Axios.get("/product/search", payload);
}

function removeProduct(id) {
  return Axios.del(`/product/delete/${id}`);
}

function findByIdProduct(id) {
  return Axios.get(`/product/find-by-id/${id}`);
}

function editProduct(payload) {
  return Axios.put(`/product/update`, payload);
}

function getUnitMoney() {
  return Axios.get("/product/find-all-unit-money");
}

export const productServices = {
  listAllProduct,
  createProduct,
  searchProduct,
  removeProduct,
  findByIdProduct,
  editProduct,
  getUnitMoney,
};
