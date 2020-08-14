<template>
  <div class="welcome">
    <h3 class="welcome__name" style="margin-bottom: 0.5em;">PASSWORDER</h3>
    <ol class="welcome__tips" style="padding-left: 20px;">
      <li>本工具不存储、采集您的信息；</li>
      <li>
        本工具通过 <a href="javascript:;" @click="openCrypto">AES</a> 加密您的账号信息, 只有<b>唯一的秘钥</b>可以解密；
      </li>
      <li>本工具为开源软件, 源代码托管在 <a href="javascript:;" @click="openGithubRepo">Github</a>；</li>
    </ol>
    <br />

    <div class="form-group">
      <label>您的秘钥：</label>
      <input v-model="key" class="input-block" type="password" placeholder="最长20个字符" maxlength="20" />
    </div>
    <div class="form-group">
      <label>再次确认秘钥：</label>
      <input v-model="confirmKey" class="input-block" type="password" placeholder="最长20个字符" maxlength="20" />
    </div>
    <button class="btn-block" @click="submit">开始使用!</button>
    <br />
  </div>
</template>

<script>
import { initConfig, isInitialize, openInBrowser } from "../helpers/util";

export default {
  name: "welcome",
  data() {
    return {
      key: "",
      confirmKey: "",
    };
  },
  created() {
    const initialize = isInitialize();
    if (initialize) {
      this.$router.push("/lock");
    }
  },
  methods: {
    async submit() {
      if (this.key === "") {
        alert("请输入秘钥");
        return;
      }
      if (this.confirmKey === "") {
        alert("请再次确认秘钥");
        return;
      }
      if (this.key !== this.confirmKey) {
        alert("两次输入的秘钥不一致!");
        return;
      }
      const success = await initConfig(this.key);
      if (!success) {
        alert("初始化项目失败, 请联系开发者 rmlzy@outlook.com");
        return;
      }
      this.$router.push("/lock");
    },

    openCrypto() {
      openInBrowser("https://github.com/brix/crypto-js");
    },

    openGithubRepo() {
      openInBrowser("https://github.com/rmlzy/passworder");
    },
  },
};
</script>

<style lang="scss" scoped>
.welcome {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 100px;
  overflow-x: hidden;
  overflow-y: auto;

  &__name {
    text-align: center;
  }

  &__tips {
    padding-left: 50px;
  }
}
</style>
