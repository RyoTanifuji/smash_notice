import axios from '../../plugins/axios';

const state = {
  sharedMemos: [],
  totalPages: 1
};

const getters = {
  sharedMemos: state => state.sharedMemos,
  totalPages: state => state.totalPages
};

const mutations = {
  setSharedMemos: (state, sharedMemos) => {
    state.sharedMemos = sharedMemos;
  },
  setTotalPages: (state, totalPages) => {
    state.totalPages = totalPages;
  }
};

const actions = {
  fetchSharedMemos({ commit }, { memoType, page }) {
    return axios.get('shared', { params: { type: memoType, page: page }})
      .then(res => {
        commit("setSharedMemos", res.data.memos);
        commit("setTotalPages", res.data.totalPages);
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