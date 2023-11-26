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
  },
  addMemo: (state, memo) => {
    state.memos.push(memo);
  }
};

const actions = {
  fetchMemos({ commit }, folderId) {
    axios.get(`folders/${folderId}/memos`)
      .then(res => {
        commit("setFolder", res.data.name);
        commit("setMemos", res.data.memos);
      })
      .catch(err => console.log(err.response));
  },
  createMemo({ commit }, { memo, memoType, folderId, applyTemplate }) {
    axios.post(`folders/${folderId}/memos?apply_template=${applyTemplate}`,
               {...memo, type: memoType})
      .then(res => {
        commit("addMemo", res.data);
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