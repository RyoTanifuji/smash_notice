import axios from '../../plugins/axios';
import humps from 'humps';

const state = {
  folders: []
};

const getters = {
  folders: state => state.folders
};

const mutations = {
  addFolder: (state, folder) => {
    state.folders.push(folder);
  }
};

const actions = {
  createFolder({ commit }, folder) {
    return axios.post('folders', humps.decamelizeKeys(folder))
      .then(res => {
        commit('addFolder', humps.camelizeKeys(res.data));
      })
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};