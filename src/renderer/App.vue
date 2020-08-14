<template>
  <div id="app" :class="{ ['theme-' + theme]: theme }">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { isInitialize, readConfig } from "./helpers/util";

export default {
  name: "passworder",
  computed: {
    ...mapState({
      theme: (state) => state.app.theme,
    }),
  },
  async created() {
    let theme = "light";
    const initialize = isInitialize();
    if (initialize) {
      const config = await readConfig();
      theme = config.theme;
    }
    await this.$store.dispatch("app/setTheme", theme);
  },
};
</script>

<style>
#app {
  width: 100vw;
  min-height: 100vh;
}
</style>
