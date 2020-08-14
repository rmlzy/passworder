import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home-index",
      component: require("@/pages/home/index").default,
    },
    {
      path: "*",
      redirect: "/",
    },
  ],
});
