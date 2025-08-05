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
          // this.form.code = "";
        }
        console.log("验证码输入：", this.form.code);
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
// .login {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
//   background-color: #f0f2f5;

//   &-form {
//     width: 350px;
//     padding: 35px;
//     border-radius: 8px;
//     background: #ffffff;
//     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

//     .title {
//       margin-bottom: 30px;
//       text-align: center;
//       color: #333;
//       font-size: 24px;
//       font-weight: bold;
//     }

//     .el-input {
//       height: 40px;

//       input {
//         height: 40px;
//       }
//     }

//     .input-icon {
//       height: 39px;
//       width: 14px;
//       margin-left: 2px;
//     }
//   }

//   &-code {
//     width: 33%;
//     height: 40px;
//     float: right;

//     &-img {
//       height: 40px;
//       cursor: pointer;
//       vertical-align: middle;
//       border-radius: 4px;
//     }
//   }

//   &-options {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-bottom: 20px;
//   }
// }

// .el-checkbox {
//   color: #606266;
// }

// .el-button--text {
//   color: #409EFF;

//   &:hover {
//     color: #66b1ff;
//   }
// }

// .el-login-footer {
//   position: fixed;
//   bottom: 0;
//   width: 100%;
//   height: 40px;
//   line-height: 40px;
//   text-align: center;
//   color: #606266;
//   font-family: Arial, sans-serif;
//   font-size: 12px;
//   letter-spacing: 1px;
// }
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  position: relative;
  overflow: hidden;

  // 添加动态背景效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
      radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }

  &-form {
    width: 380px;
    padding: 40px;
    border-radius: 20px;
    background: rgba(40, 40, 40, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.05);
    position: relative;
    z-index: 2;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
      pointer-events: none;
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6),
        0 0 0 1px rgba(255, 255, 255, 0.15);
    }

    .title {
      margin-bottom: 40px;
      text-align: center;
      color: #ffffff;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, transparent, #ffffff, transparent);
        border-radius: 2px;
      }
    }

    // Element UI 输入框样式重写
    ::v-deep .el-form-item {
      margin-bottom: 24px;

      .el-input {
        height: 48px;

        .el-input__inner {
          height: 48px;
          line-height: 48px;
          background: rgba(60, 60, 60, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #ffffff;
          font-size: 15px;
          padding-left: 45px;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);

          &::placeholder {
            color: #b0b0b0;
            font-weight: 400;
          }

          &:hover {
            border-color: rgba(255, 255, 255, 0.2);
            background: rgba(70, 70, 70, 0.8);
          }

          &:focus {
            border-color: rgba(255, 255, 255, 0.3);
            background: rgba(80, 80, 80, 0.8);
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
          }
        }

        .el-input__prefix {
          left: 15px;
          color: #cccccc;

          .svg-icon {
            color: #cccccc;
            font-size: 16px;
            transition: all 0.3s ease;
          }
        }

        &.is-focus {
          .el-input__prefix .svg-icon {
            color: #ffffff;
            transform: scale(1.1);
          }
        }
      }

      .el-form-item__error {
        color: #ff5252;
        font-size: 13px;
        margin-top: 8px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
    }

    .input-icon {
      height: 20px !important;
      width: 16px !important;
      margin-left: 0 !important;
      color: #cccccc !important;
    }
  }

  &-code {
    width: 33%;
    height: 48px;
    float: right;

    &-img {
      height: 48px;
      cursor: pointer;
      vertical-align: middle;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
      background: rgba(60, 60, 60, 0.8);

      &:hover {
        border-color: rgba(255, 255, 255, 0.2);
        transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
    }
  }

  &-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding: 0 4px;
  }
}

// Element UI 复选框样式重写
::v-deep .el-checkbox {
  color: #e0e0e0;

  .el-checkbox__input {
    .el-checkbox__inner {
      background: rgba(60, 60, 60, 0.8);
      border-color: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(255, 255, 255, 0.3);
      }
    }

    &.is-checked .el-checkbox__inner {
      background: linear-gradient(135deg, #4a4a4a, #333333);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }

  .el-checkbox__label {
    color: #e0e0e0;
    font-weight: 500;
  }
}

// Element UI 按钮样式重写
::v-deep .el-button {
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;

  &--primary {
    background: linear-gradient(135deg, #4a4a4a, #333333);
    color: #ffffff;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    height: 48px;

    &:hover {
      background: linear-gradient(135deg, #555555, #3a3a3a);
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    }

    &.is-loading {
      background: rgba(60, 60, 60, 0.8);
      transform: none;

      .el-icon-loading {
        color: #ffffff;
      }
    }
  }

  &--text {
    color: #e0e0e0;
    font-weight: 500;
    background: transparent;
    padding: 0;

    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
      padding: 8px 12px;
      border-radius: 8px;
    }
  }
}

.el-login-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #b0b0b0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 13px;
  letter-spacing: 1px;
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-weight: 500;
}

// 响应式优化
@media (max-width: 768px) {
  .login {
    padding: 20px;

    &-form {
      width: 100%;
      max-width: 350px;
      padding: 30px 25px;

      .title {
        font-size: 24px;
        margin-bottom: 30px;
      }

      ::v-deep .el-form-item .el-input {
        height: 44px;

        .el-input__inner {
          height: 44px;
          line-height: 44px;
          font-size: 14px;
        }
      }
    }

    &-code-img {
      height: 44px !important;
    }
  }

  .el-login-footer {
    font-size: 12px;
    height: 45px;
    line-height: 45px;
  }
}

// 加载动画优化
::v-deep .el-loading-mask {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);

  .el-loading-spinner {
    color: #ffffff;

    .el-icon-loading {
      font-size: 32px;
    }
  }
}

// 自定义滚动条
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

// 选择文本样式
::selection {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}
</style>