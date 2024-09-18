<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules" class="login-form">
      <h3 class="title">{{ showLogin ? '登 录' : '注 册' }}</h3>
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" placeholder="密码" @keyup.enter.native="handleSubmit">
          <svg-icon slot="prefix" icon-class="password" />
        </el-input>
      </el-form-item>
      <el-form-item v-if="captchaEnabled" prop="code">
        <el-input v-model="form.code" placeholder="验证码" style="width: 63%" @keyup.enter.native="handleSubmit">
          <svg-icon slot="prefix" icon-class="validCode" />
        </el-input>
        <img :src="codeUrl" @click="getCode" class="login-code-img" alt="验证码" />
      </el-form-item>
      <div class="login-options">
        <el-checkbox v-if="showLogin" v-model="form.rememberMe">记住密码</el-checkbox>
        <el-button type="text" @click="toggleLoginRegister">
          {{ showLogin ? '注册账号' : '返回登录' }}
        </el-button>
      </div>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleSubmit">
          {{ showLogin ? (loading ? '登 录 中...' : '登 录') : '注 册' }}
        </el-button>
      </el-form-item>
    </el-form>
    <div class="el-login-footer">
      <span>Copyright © {{ new Date().getFullYear() }}</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      form: {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      rules: {
        username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
        password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      captchaEnabled: true,
      showLogin: true,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.data.captchaEnabled ?? true;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.data.img;
          this.form.uuid = res.data.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.form = {
        ...this.form,
        username: username ?? this.form.username,
        password: password ? decrypt(password) : this.form.password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.showLogin) {
            this.handleLogin();
          } else {
            this.handleRegister();
          }
        }
      });
    },
    handleLogin() {
      if (this.form.rememberMe) {
        Cookies.set("username", this.form.username, { expires: 30 });
        Cookies.set("password", encrypt(this.form.password), { expires: 30 });
        Cookies.set('rememberMe', this.form.rememberMe, { expires: 30 });
      } else {
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove('rememberMe');
      }
      this.$store.dispatch("Login", this.form).then(() => {
        this.$router.push({ path: this.redirect || "/" }).catch(() => { });
      }).catch(() => {
        this.loading = false;
        if (this.captchaEnabled) {
          this.getCode();
        }
      });
    },
    handleRegister() {
      console.log("注册功能待实现");
      this.loading = false;
    },
    toggleLoginRegister() {
      this.showLogin = !this.showLogin;
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;

  &-form {
    width: 350px;
    padding: 35px;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .title {
      margin-bottom: 30px;
      text-align: center;
      color: #333;
      font-size: 24px;
      font-weight: bold;
    }

    .el-input {
      height: 40px;

      input {
        height: 40px;
      }
    }

    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }

  &-code {
    width: 33%;
    height: 40px;
    float: right;

    &-img {
      height: 40px;
      cursor: pointer;
      vertical-align: middle;
      border-radius: 4px;
    }
  }

  &-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
}

.el-checkbox {
  color: #606266;
}

.el-button--text {
  color: #409EFF;

  &:hover {
    color: #66b1ff;
  }
}

.el-login-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #606266;
  font-family: Arial, sans-serif;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
