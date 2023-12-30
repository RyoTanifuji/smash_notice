import axios from '../../plugins/axios';

const state = {
  sharedMemos: [],
  totalPages: 1,
  memoDetail: {
    memoBlocks: []
  },
  bookmarkMemoIds: []
};

const getters = {
  sharedMemos: state => state.sharedMemos,
  totalPages: state => state.totalPages,
  memoDetail: state => state.memoDetail,
  bookmarkMemoIds: state => state.bookmarkMemoIds
};

const mutations = {
  setSharedMemos: (state, sharedMemos) => {
    state.sharedMemos = sharedMemos;
  },
  setTotalPages: (state, totalPages) => {
    state.totalPages = totalPages;
  },
  setMemoDetail: (state, { memo, memoBlocks }) => {
    state.memoDetail = memo;
    state.memoDetail.memoBlocks = memoBlocks;
  },
  setBookmarkMemoIds: (state, bookmarkMemoIds) => {
    state.bookmarkMemoIds = bookmarkMemoIds;
  },
  pushBookmarkMemoId: (state, bookmarkMemoId) => {
    state.bookmarkMemoIds.push(bookmarkMemoId);
  },
  popBookmarkMemoId: (state, bookmarkMemoId) => {
    state.bookmarkMemoIds = state.bookmarkMemoIds.filter(memoId => {
      return memoId != bookmarkMemoId;
    });
  }
};

const actions = {
  fetchSharedMemos({ commit }, { memoType, page, searchQuery }) {
    return axios.get('shared', { params: { type: memoType, page: page, q: searchQuery }})
      .then(res => {
        commit("setSharedMemos", res.data.memos);
        commit("setTotalPages", res.data.totalPages);
        commit("setBookmarkMemoIds", res.data.bookmarkMemoIds);
      });
  },
  fetchBookmarkMemos({ commit }, { page, searchQuery }) {
    return axios.get('shared/bookmarks', { params: { page: page, q: searchQuery }})
      .then(res => {
        commit("setSharedMemos", res.data.memos);
        commit("setTotalPages", res.data.totalPages);
        commit("setBookmarkMemoIds", res.data.bookmarkMemoIds);
      });
  },
  fetchMemoDetail({ commit }, memoId) {
    return axios.get(`shared/${memoId}`)
      .then(res => {
        commit("setMemoDetail", { memo: res.data.memo, memoBlocks: res.data.memoBlocks });
        commit("setBookmarkMemoIds", res.data.bookmarkMemoIds);
      });
  },
  createBookmark({ commit }, memoId) {
    axios.post('bookmarks', { memoId: memoId });
    commit("pushBookmarkMemoId", memoId);
  },
  deleteBookmark({ commit }, memoId) {
    axios.delete('bookmarks', { params: { memo_id: memoId } });
    commit("popBookmarkMemoId", memoId);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};