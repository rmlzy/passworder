import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "welcome",
      component: require("@/pages/welcome").default,
    },
    {
      path: "/lock",
      name: "lock",
      component: require("@/pages/lock").default,
    },
    {
      path: "/manager",
      name: "manager",
      component: require("@/pages/manager").default,
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});
