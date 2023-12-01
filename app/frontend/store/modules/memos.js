import axios from '../../plugins/axios';

const state = {
  folderName: "",
  memos: [],
  memoDetail: []
};

const getters = {
  folderName: state => state.folderName,
  memos: state => state.memos,
  memoDetail: state => state.memoDetail
};

const mutations = {
  setFolder: (state, folderName) => {
    state.folderName = folderName;
  },
  setMemos: (state, memos) => {
    state.memos = memos;
  },
  setMemoDetail : (state, memo) => {
    state.memoDetail = memo;
  },
  addMemo: (state, memo) => {
    state.memos.push(memo);
  },
  addMemoBlock: (state, memoBlock) => {
    state.memoDetail.memoBlocks.push(memoBlock);
  },
  updateMemoBlock: (state, updateMemoBlock) => {
    const index = state.memoDetail.memoBlocks.findIndex(memoBlock => {
      return memoBlock.id == updateMemoBlock.id;
    });
    state.memoDetail.memoBlocks.splice(index, 1, updateMemoBlock);
  },
  deleteMemo: (state, deleteMemo) => {
    state.memos = state.memos.filter(memo => {
      return memo.id != deleteMemo.id;
    });
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
  fetchMemoDetail({ commit }, memoId) {
    axios.get(`memos/${memoId}`)
      .then(res => {
        commit("setMemoDetail", res.data);
      });
  },
  createMemo({ commit }, { memo, memoType, folderId, applyTemplate }) {
    return axios.post(`folders/${folderId}/memos?apply_template=${applyTemplate}`,
               {...memo, type: memoType})
      .then(res => {
        commit("addMemo", res.data);
      });
  },
  createMemoBlock({ commit }, { memoId, memoBlockParams }) {
    return axios.post(`memos/${memoId}/memo_blocks`, memoBlockParams)
      .then(res => {
        commit("addMemoBlock", res.data);
      });
  },
  updateMemoBlock({ commit }, { memoId, memoBlockId, memoBlockParams }) {
    return axios.patch(`memos/${memoId}/memo_blocks/${memoBlockId}`, memoBlockParams)
      .then(res => {
        commit("updateMemoBlock", res.data);
      });
  },
  deleteMemo({ commit }, memo) {
    return axios.delete(`/memos/${memo.id}`)
      .then(res => {
        commit("deleteMemo", res.data);
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