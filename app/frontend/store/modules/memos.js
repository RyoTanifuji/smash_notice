import axios from '../../plugins/axios';

const state = {
  memos: []
};

const getters = {
  memos: state => state.memos
};

const mutations = {
  setMemos: (state, memos) => {
    state.memos = memos;
  }
};

const actions = {
  fetchMemos({ commit }, folderId) {
    axios.get('memos', { params: { folder_id: folderId } })
      .then(res => {
        commit("setMemos", res.data);
      })
      .catch(err => console.log(err.response));
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};