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
  }
};

const actions = {
  fetchFolders({ commit }, folderType) {
    axios.get(`folders/${folderType}`)
      .then(res => {
        commit('setFolders', humps.camelizeKeys(res.data));
      })
      .catch(err => console.log(err.response));
  },
  createFolder({ commit }, folder) {
    return axios.post('folders', humps.decamelizeKeys(folder))
      .then(res => {
        commit('addFolder', humps.camelizeKeys(res.data));
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