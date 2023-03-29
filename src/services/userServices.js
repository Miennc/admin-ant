import { Axios } from "./Axios";

function getAllUsers(payload) {
  return Axios.get("/user/find-all", payload);
}

function addUser(payload) {
  return Axios.post("/admin/create-user-account", payload);
}

function searchUser(payload) {
  return Axios.get("/user/search", payload);
}

function removeUser(id) {
  return Axios.del(`/user/delete/${id}`);
}

function findByIdUser(id) {
  return Axios.get(`/user/find-by-id/${id}`);
}

function acceptUser(payload) {
  return Axios.post(`/user/change-status`, payload);
}

function editUser(payload) {
  return Axios.put(`/admin/update-user-account`, payload);
}

function getProfile() {
  return Axios.get(`/user/current-user-profile`);
}

function changePassword(payload) {
  return Axios.put(`/admin/change-password-user-account`, payload);
}

export const userServices = {
  getAllUsers,
  addUser,
  searchUser,
  removeUser,
  findByIdUser,
  acceptUser,
  editUser,
  getProfile,
  changePassword,
};
