<template>
  <div class="manager">
    <div class="manager__hd">
      <input v-model="keyword" class="input-block" type="password" placeholder="搜索" maxlength="20" />
    </div>

    <div class="card" v-for="(item, index) in accounts" :key="index">
      <div class="card-body">
        <div class="card-title">
          <span>{{ item.name }}</span>
          <span class="badge danger" @click="remove(item.uuid)">删除</span>
        </div>
        <p class="card-text"><b>⛳ 账号:</b> {{ item.account }}</p>
        <p class="card-text"><b>🔒 密码:</b> {{ item.password }}</p>
        <p class="card-text mb0"><b>📃 备注:</b> {{ item.desc }}</p>
      </div>
    </div>

    <p class="empty" v-if="accounts.length === 0">您还没有数据, 点击左下角的 "+" 按钮创建~</p>

    <button class="btn-small lock-btn" @click="lock">X</button>
    <button class="btn-small skin-btn" @click="showSkinDialog">肤</button>

    <button class="btn-small create-btn" @click="showCreateDialog">+</button>

    <div :class="{ modal: true, 'modal-visible': createVisible }">
      <label class="modal-bg"></label>
      <div class="modal-body">
        <label class="btn-close" @click="closeCreateDialog">X</label>
        <h4 class="modal-title">添加密码</h4>
        <br />
        <div class="form-group">
          <input v-model="createForm.name" class="input-block" type="text" placeholder="名称" maxlength="20" />
        </div>
        <div class="form-group">
          <div class="row">
            <div class="col-6" style="padding-right: 10px;">
              <input v-model="createForm.account" class="input-block" type="text" placeholder="账号" maxlength="20" />
            </div>
            <div class="col-6" style="padding-left: 10px;">
              <input v-model="createForm.password" class="input-block" type="text" placeholder="密码" maxlength="20" />
            </div>
          </div>
        </div>
        <div class="form-group">
          <textarea v-model="createForm.desc" class="input-block" type="text" placeholder="备注" maxlength="20" />
        </div>
        <div class="text-right">
          <button class="btn-small" @click="closeCreateDialog">取消</button>
          <button class="btn-small" @click="onCreateDialogOk">创建</button>
        </div>
      </div>
    </div>

    <div :class="{ modal: true, 'modal-visible': skinVisible }">
      <label class="modal-bg"></label>
      <div class="modal-body" style="width: 80%;">
        <label class="btn-close" @click="closeSkinDialog">X</label>
        <h4 class="modal-title">设置皮肤</h4>
        <br />

        <div class="row">
          <div class="col-4 padding-small" v-for="(item, index) in themes" :key="index">
            <div :class="{ skin: true, active: item.theme === skinForm.theme }" @click="skinForm.theme = item.theme">
              <div class="skin__name">{{ item.name }}</div>
              <div class="skin__demo">
                <img v-if="item.theme === 'light'" src="../assets/light.png" />
                <img v-if="item.theme === 'chinese'" src="../assets/chinese.jpg" />
                <img v-if="item.theme === 'kiwifruit'" src="../assets/kiwifruit.jpg" />
                <img v-if="item.theme === 'micai'" src="../assets/micai.jpg" />
                <img v-if="item.theme === 'taiqiu'" src="../assets/taiqiu.png" />
                <img v-if="item.theme === 'wood'" src="../assets/wood.jpg" />
                <img v-if="item.theme === 'zhulian'" src="../assets/zhulian.jpg" />
              </div>
            </div>
          </div>
        </div>

        <div class="text-right">
          <button class="btn-small" @click="closeSkinDialog">取消</button>
          <button class="btn-small" @click="onSkinDialogOk">使用</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { isInitialize, parseAccounts, addAccount, setTheme, removeAccount } from "../helpers/util";

export default {
  name: "manager",
  data() {
    return {
      keyword: "",
      accounts: [],

      createVisible: false,
      createForm: {
        name: "",
        account: "",
        password: "",
        desc: "",
      },

      skinVisible: false,
      skinForm: {
        theme: "",
      },

      themes: [
        { name: "默认", theme: "light", desc: "" },
        { name: "中国风", theme: "chinese", desc: "" },
        { name: "猕猴桃", theme: "kiwifruit", desc: "" },
        { name: "迷彩服", theme: "micai", desc: "" },
        { name: "台球桌", theme: "taiqiu", desc: "" },
        { name: "木质", theme: "wood", desc: "" },
        { name: "竹帘", theme: "zhulian", desc: "" },
      ],
    };
  },
  computed: {
    ...mapState({
      key: (state) => state.app.key,
    }),
  },
  created() {
    const initialize = isInitialize();
    if (!initialize) {
      this.$router.push("/welcome");
    }
  },
  async mounted() {
    if (this.key === "") {
      this.$router.push("/lock");
    } else {
      this.accounts = await parseAccounts(this.key);
    }
  },
  methods: {
    lock() {
      this.$store.dispatch("app/setKey", "");
      this.$router.push("/lock");
    },

    showCreateDialog() {
      this.createVisible = true;
    },

    closeCreateDialog() {
      this.createVisible = false;
      this.createForm = {
        account: "",
        password: "",
        desc: "",
      };
    },

    async onCreateDialogOk() {
      const { name, account } = this.createForm;
      if (name === "") {
        alert("请填写名称");
        return;
      }
      if (account === "") {
        alert("请填写账号");
        return;
      }
      await addAccount(this.createForm, this.key);
      this.accounts = await parseAccounts(this.key);
      this.closeCreateDialog();
    },

    showSkinDialog() {
      this.skinVisible = true;
    },

    closeSkinDialog() {
      this.skinVisible = false;
      this.skinForm = {
        theme: "",
      };
    },

    async onSkinDialogOk() {
      const { theme } = this.skinForm;
      if (theme === "") {
        alert("请选择皮肤");
        return;
      }
      await setTheme(theme);
      await this.$store.dispatch("app/setTheme", theme);
      this.closeSkinDialog();
    },

    async remove(uuid) {
      const res = confirm("删除以后不可恢复, 是否继续?");
      if (res) {
        await removeAccount(uuid, this.key);
        this.accounts = await parseAccounts(this.key);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "manager";
</style>
