import axios from '../../plugins/axios';

const state = {
  folders: []
};

const getters = {
  folders: state => state.folders
};

const mutations = {
  setFolders: (state, folders) => {
    state.folders = folders;
  },
  addFolder: (state, folder) => {
    state.folders.push(folder);
  },
  updateFolder: (state, updateFolder) => {
    const index = state.folders.findIndex(folder => {
      return folder.id == updateFolder.id;
    });
    state.folders.splice(index, 1, updateFolder);
  },
  deleteFolder: (state, deleteFolder) => {
    state.folders = state.folders.filter(folder => {
      return folder.id != deleteFolder.id;
    });
  },
  resetFolders: (state) => {
    state.folders = [];
  }
};

const actions = {
  fetchFolders({ commit }, folderType) {
    return axios.get('folders', { params: { type: folderType } })
      .then(res => {
        commit("setFolders", res.data);
      })
      .catch(err => console.log(err.response));
  },
  createFolder({ commit }, { folder, folderType }) {
    return axios.post('folders', {...folder, type: folderType})
      .then(res => {
        commit("addFolder", res.data);
      });
  },
  updateFolder({ commit }, folder) {
    return axios.patch(`folders/${folder.id}`, folder)
      .then(res => {
        commit("updateFolder", res.data);
      });
  },
  deleteFolder({ commit }, folder) {
    return axios.delete(`folders/${folder.id}`)
      .then(res => {
        commit("deleteFolder", res.data);
      });
  },
  resetFolders({ commit }) {
    commit("resetFolders");
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};