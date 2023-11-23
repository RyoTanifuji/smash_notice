import axios from '../../plugins/axios';
import humps from 'humps';

const state = {
  folders: []
};

const getters = {
  folders: state => state.folders
};

const mutations = {
  setFolders: (state, folders) => {
    state.folders = folders;
  },
  addFolder: (state, folder) => {
    state.folders.push(folder);
  },
  updateFolder: (state, updateFolder) => {
    const index = state.folders.findIndex(folder => {
      return folder.id == updateFolder.id;
    });
    state.folders.splice(index, 1, updateFolder);
  },
  deleteFolder: (state, deleteFolder) => {
    state.folders = state.folders.filter(folder => {
      return folder.id != deleteFolder.id;
    });
  }
};

const actions = {
  fetchFolders({ commit }, folderType) {
    axios.get(`folders/${folderType}`)
      .then(res => {
        commit("setFolders", humps.camelizeKeys(res.data));
      })
      .catch(err => console.log(err.response));
  },
  createFolder({ commit }, folder) {
    return axios.post('folders', humps.decamelizeKeys(folder))
      .then(res => {
        commit("addFolder", humps.camelizeKeys(res.data));
      });
  },
  updateFolder({ commit }, folder) {
    return axios.patch(`folders/${folder.id}`, humps.decamelizeKeys(folder))
      .then(res => {
        commit("updateFolder", humps.camelizeKeys(res.data));
      });
  },
  deleteFolder({ commit }, folder) {
    return axios.delete(`folders/${folder.id}`)
      .then(res => {
        commit("deleteFolder", humps.camelizeKeys(res.data));
      });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};