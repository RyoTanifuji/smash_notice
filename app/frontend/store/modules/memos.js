import axios from '../../plugins/axios';

const state = {
  folder: [],
  memos: [],
  memoRemovedKeys: [],
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
  setMemoDetail : (state, memo) => {
    state.memoDetail = memo;
  },
  addMemo: (state) => {
    state.memos.push(state.memoRemovedKeys);
  },
  addMemoBlock: (state, memoBlock) => {
    state.memoDetail.memoBlocks.push(memoBlock);
  },
  updateMemo: (state) => {
    const index = state.memos.findIndex(memo => {
      return memo.id == state.memoRemovedKeys.id;
    });
    state.memos.splice(index, 1, state.memoRemovedKeys);
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
  },
  removeKeysOfMemoDetail: (state, memoDetail) => {
    const keysToRemove = ["userId", "createdAt", "memoBlocks"];
    state.memoRemovedKeys = Object.keys(memoDetail).reduce((result, key) => {
      if (!keysToRemove.includes(key)) {
        result[key] = memoDetail[key];
      }
      return result;
    }, {});
  }
};

const actions = {
  fetchMemos({ commit }, folderId) {
    return axios.get(`folders/${folderId}/memos`)
      .then(res => {
        commit("setFolder", res.data);
        commit("setMemos", res.data.memos);
      });
  },
  fetchTemplate({ commit }, folderId) {
    return axios.get(`folders/${folderId}/template`)
      .then(res => {
        commit("setMemoDetail", res.data);
      });
  },
  fetchMemoDetail({ commit }, memoId) {
    return axios.get(`memos/${memoId}`)
      .then(res => {
        commit("setMemoDetail", res.data);
      });
  },
  createMemo({ commit }, { memo, memoType, folderId, applyTemplate }) {
    return axios.post(`folders/${folderId}/memos?apply_template=${applyTemplate}`,
               {...memo, type: memoType})
      .then(res => {
        commit("removeKeysOfMemoDetail", res.data);
        commit("addMemo");
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
        commit("removeKeysOfMemoDetail", res.data);
        commit("updateMemo");
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