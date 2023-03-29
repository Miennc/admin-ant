import { Axios } from "./Axios";

function listAllNews(payload) {
  return Axios.get("/news/find-all", payload);
}

function createNews(payload) {
  return Axios.post("/news/add", payload);
}

function searchNews(payload) {
  return Axios.get("/news/search", payload);
}

function removeNews(id) {
  return Axios.del(`/news/delete/${id}`);
}

function findByIdNews(id) {
  return Axios.get(`/news/find-by-id/${id}`);
}

function editNews(payload) {
  return Axios.put(`/news/update`, payload);
}

export const newsServices = {
  listAllNews,
  createNews,
  searchNews,
  removeNews,
  findByIdNews,
  editNews,
};
