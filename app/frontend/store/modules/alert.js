// アラートの表示に関するステータス

// アラートの表示の有無、種類、テキスト、表示時にページの遷移が行われるかのステータス
const state = {
  isVisibleStandardAlert: false,
  isVisibleDialogAlert: false,
  alertType: "",
  alertTextArray: [],
  isTransition: false
};

const getters = {
  isVisibleStandardAlert: state => state.isVisibleStandardAlert,
  isVisibleDialogAlert: state => state.isVisibleDialogAlert,
  alertType: state => state.alertType,
  alertTextArray: state => state.alertTextArray
};

const mutations = {
  setAlert: (state, { alertStatus, isDialog }) => {
    state.isVisibleStandardAlert = !isDialog;
    state.isVisibleDialogAlert = isDialog;
    state.alertType = alertStatus.alertType;
    state.alertTextArray = alertStatus.alertTextArray;
    state.isTransition = alertStatus.isTransition;
  },
  resetAlert: (state, forceReset) => {
    if (forceReset || !state.isTransition) {
      state.isTransition = false;
      state.isVisibleStandardAlert = false;
      state.isVisibleDialogAlert = false;
      state.alertType = "";
      state.alertTextArray = [];
    } else {
      state.isTransition = false;
    }
  },
  isTransitionTrue: (state) => {
    state.isTransition = true;
  },
  isTransitionFalse: (state) => {
    state.isTransition = false;
  }
};

const actions = {
  displayAlert({ commit }, { alertStatus, isDialog = false }) {
    commit("setAlert", { alertStatus: alertStatus, isDialog: isDialog });
  },
  closeAlert({ commit }) {
    commit("resetAlert", false);
  },
  closeAlertWithCross({ commit }) {
    commit("resetAlert", true);
  },
  applyTransition({ commit }) {
    commit("isTransitionTrue");
  },
  cancelTransition({ commit }) {
    commit("isTransitionFalse");
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};