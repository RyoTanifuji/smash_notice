import axios from '../../plugins/axios';

const state = {
  sharedMemos: []
};

const getters = {
  sharedMemos: state => state.sharedMemos
};

const mutations = {
  setSharedMemos: (state, sharedMemos) => {
    state.sharedMemos = sharedMemos;
  }
};

const actions = {
  fetchSharedMemos({ commit }) {
    return axios.get('shared')
      .then(res => {
        commit("setSharedMemos", res.data)
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