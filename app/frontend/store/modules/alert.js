// アラートの表示に関するステータス

// アラートの表示の有無、種類、テキスト、表示時にページの遷移が行われるかのステータス
const state = {
  isVisibleAlert: false,
  alertType: "",
  alertTextArray: [],
  isTransition: false
};

const getters = {
  isVisibleAlert: state => state.isVisibleAlert,
  alertType: state => state.alertType,
  alertTextArray: state => state.alertTextArray
};

const mutations = {
  setAlert: (state, alertStatus) => {
    state.isVisibleAlert = true;
    state.alertType = alertStatus.alertType;
    state.alertTextArray = alertStatus.alertTextArray;
    state.isTransition = alertStatus.isTransition;
  },
  resetAlert: (state) => {
    if (state.isTransition) {
      state.isTransition = false;
    } else {
      state.isVisibleAlert = false;
      state.alertType = "";
      state.alertTextArray = [];
    }
  }
};

const actions = {
  displayAlert({ commit }, alertStatus) {
    commit("setAlert", alertStatus);
  },
  closeAlert({ commit }) {
    commit("resetAlert");
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};