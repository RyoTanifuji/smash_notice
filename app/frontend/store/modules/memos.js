import axios from '../../plugins/axios';

const state = {
  folderName: "",
  memos: []
};

const getters = {
  folderName: state => state.folderName,
  memos: state => state.memos
};

const mutations = {
  setFolder: (state, folderName) => {
    state.folderName = folderName;
  },
  setMemos: (state, memos) => {
    state.memos = memos;
  }
};

const actions = {
  fetchMemos({ commit }, folderId) {
    axios.get('memos', { params: { folder_id: folderId } })
      .then(res => {
        commit("setFolder", res.data.name);
        commit("setMemos", res.data.memos);
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