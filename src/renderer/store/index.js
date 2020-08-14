import Vue from "vue";
import Vuex from "vuex";
import app from "./app";

import { createPersistedState, createSharedMutations } from "vuex-electron";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { app },
  plugins: [
    createPersistedState(),
    // https://github.com/SimulatedGREG/electron-vue/issues/733
    // createSharedMutations()
  ],
  strict: process.env.NODE_ENV !== "production",
});
