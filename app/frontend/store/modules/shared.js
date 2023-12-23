import axios from '../../plugins/axios';

const state = {
  sharedMemos: [],
  totalPages: 1,
  memoDetail: {
    memoBlocks: []
  }
};

const getters = {
  sharedMemos: state => state.sharedMemos,
  totalPages: state => state.totalPages,
  memoDetail: state => state.memoDetail
};

const mutations = {
  setSharedMemos: (state, sharedMemos) => {
    state.sharedMemos = sharedMemos;
  },
  setTotalPages: (state, totalPages) => {
    state.totalPages = totalPages;
  },
  setMemoDetail: (state, memo) => {
    state.memoDetail = memo;
  }
};

const actions = {
  fetchSharedMemos({ commit }, { memoType, page }) {
    return axios.get('shared', { params: { type: memoType, page: page }})
      .then(res => {
        commit("setSharedMemos", res.data.memos);
        commit("setTotalPages", res.data.totalPages);
      });
  },
  fetchMemoDetail({ commit }, memoId) {
    return axios.get(`shared/${memoId}`)
      .then(res => {
        commit("setMemoDetail", res.data);
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