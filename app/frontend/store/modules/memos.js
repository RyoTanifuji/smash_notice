import axios from '../../plugins/axios';

const state = {
  folder: [],
  memos: [],
  memoDetail: {
    memoBlocks: []
  }
};

const getters = {
  folder: state => state.folder,
  memos: state => state.memos,
  memoDetail: state => state.memoDetail
};

const mutations = {
  setFolder: (state, folder) => {
    state.folder = folder;
  },
  setMemos: (state, memos) => {
    state.memos = memos;
  },
  setMemoDetail: (state, { memo: memo, memoBlocks: memoBlocks }) => {
    state.memoDetail = memo;
    state.memoDetail.memoBlocks = memoBlocks;
  },
  addMemo: (state, memo) => {
    state.memos.push(memo);
  },
  addMemoBlock: (state, memoBlock) => {
    state.memoDetail.memoBlocks.push(memoBlock);
  },
  updateMemo: (state, updateMemo) => {
    const index = state.memos.findIndex(memo => {
      return memo.id == updateMemo.id;
    });
    state.memos.splice(index, 1, updateMemo);
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
  },
  deleteMemoBlock: (state, deleteMemoBlock) => {
    state.memoDetail.memoBlocks = state.memoDetail.memoBlocks.filter(memoBlock => {
      return memoBlock.id != deleteMemoBlock.id;
    });
  }
};

const actions = {
  fetchMemos({ commit }, folderId) {
    return axios.get(`folders/${folderId}/memos`)
      .then(res => {
        commit("setFolder", res.data);
        commit("setMemos", res.data.memosExcludedTemplate);
      });
  },
  fetchTemplate({ commit }, folderId) {
    return axios.get(`folders/${folderId}/template`)
      .then(res => {
        commit("setMemoDetail", { memo: res.data.memo, memoBlocks: res.data.memoBlocks });
      });
  },
  fetchMemoDetail({ commit }, memoId) {
    return axios.get(`memos/${memoId}`)
      .then(res => {
        commit("setMemoDetail", { memo: res.data.memo, memoBlocks: res.data.memoBlocks });
      });
  },
  createMemo({ commit }, { memo, memoType, folderId, applyTemplate }) {
    return axios.post(`folders/${folderId}/memos?apply_template=${applyTemplate}`,
               {...memo, type: memoType})
      .then(res => {
        commit("addMemo", res.data.memo);
      });
  },
  createMemoBlock({ commit }, { memoId, memoBlockParams }) {
    return axios.post(`memos/${memoId}/memo_blocks`, memoBlockParams, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        commit("addMemoBlock", res.data);
      });
  },
  updateMemo({ commit }, memo) {
    return axios.patch(`memos/${memo.id}`, memo)
      .then(res => {
        commit("updateMemo", res.data.memo);
      });
  },
  updateMemoBlock({ commit }, { memoId, memoBlockId, memoBlockParams }) {
    return axios.patch(`memos/${memoId}/memo_blocks/${memoBlockId}`, memoBlockParams, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        commit("updateMemoBlock", res.data);
      });
  },
  updateMemoState({ commit }, { memoId, memoState }) {
    return axios.patch(`memos/${memoId}`, { memo: { state: memoState}})
      .then(res => {
        commit("updateMemo", res.data.memo);
      });
  },
  deleteMemo({ commit }, memo) {
    return axios.delete(`memos/${memo.id}`)
      .then(res => {
        commit("deleteMemo", res.data);
      });
  },
  deleteMemoBlock({ commit }, { memoId, memoBlock }) {
    return axios.delete(`memos/${memoId}/memo_blocks/${memoBlock.id}`)
      .then(res => {
        commit("deleteMemoBlock", res.data);
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