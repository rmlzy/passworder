<template>
  <div class="lock">
    <h4 class="lock__name">欢迎回来</h4>
    <p class="text-center">您的账号已被妥善存储</p>
    <br />

    <div class="form-group">
      <input v-model="key" class="input-block" type="password" placeholder="您的秘钥" maxlength="20" />
    </div>
    <br />

    <button class="btn-block" @click="submit">开始使用!</button>
  </div>
</template>

<script>
import { isInitialize, validKey } from "../helpers/util";

export default {
  name: "lock",
  data() {
    return {
      key: "",
    };
  },
  created() {
    const initialize = isInitialize();
    if (!initialize) {
      this.$router.push("/welcome");
    }
  },
  methods: {
    async submit() {
      if (this.key === "") {
        alert("请输入秘钥!");
        return;
      }
      const valid = await validKey(this.key);
      await this.$store.dispatch("app/setKey", this.key);
      if (valid) {
        this.$router.push("/manager");
      } else {
        alert("秘钥错误!");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.lock {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 200px;
  overflow-x: hidden;
  overflow-y: auto;

  &__name {
    text-align: center;
  }
}
</style>
