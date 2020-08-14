export default {
  namespaced: true,

  state: {
    key: "",
    theme: "",
  },

  mutations: {
    SET_KEY: (state, payload) => {
      state.key = payload;
    },
    SET_THEME: (state, payload) => {
      state.theme = payload;
    },
  },

  actions: {
    setKey({ commit }, key) {
      commit("SET_KEY", key);
    },
    setTheme({ commit }, theme) {
      commit("SET_THEME", theme);
    },
  },
};
