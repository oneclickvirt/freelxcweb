<template>
  <div class="register">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">注 册</h3>
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="registerForm.password" type="password" auto-complete="off" placeholder="密码"
          @keyup.enter.native="handleRegister">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input v-model="registerForm.confirmPassword" type="password" auto-complete="off" placeholder="确认密码"
          @keyup.enter.native="handleRegister">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input v-model="registerForm.code" auto-complete="off" placeholder="验证码" style="width: 63%"
          @keyup.enter.native="handleRegister">
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img" />
        </div>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
          @click.native.prevent="handleRegister">
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div style="float: right;">
          <router-link class="link-type" :to="'/login'">使用已有账户登录</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-register-footer">
      <span>Copyright © 2018-2022 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg, register } from "@/api/login";

export default {
  name: "Register",
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      codeUrl: "",
      registerForm: {
        username: "",
        password: "",
        confirmPassword: "",
        code: "",
        uuid: "",
        user_type: "sys_user"
      },
      registerRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
          { min: 2, max: 20, message: '用户账号长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
          { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, trigger: "blur", message: "请再次输入您的密码" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      captchaEnabled: true
    };
  },
  created() {
    this.$router.replace({
      path: '/home'
    })
    this.getCode();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.data.captchaEnabled === undefined ? true : res.data.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.data.img;
          this.registerForm.uuid = res.data.uuid;
        }
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let registerForm = this.registerForm;
          registerForm.userType = "sys_user"
          register(registerForm).then(res => {
            const username = this.registerForm.username;
            this.$alert("<font color='red'>恭喜你，您的账号 " + username + " 注册成功！</font>", '系统提示', {
              dangerouslyUseHTMLString: true,
              type: 'success'
            }).then(() => {
              this.$router.push("/login");
            }).catch(() => { });
          }).catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          })
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
// .register {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100%;
//  // background-image: url("../assets/images/login-background.jpg");
//   background-size: cover;
// }
// .title {
//   margin: 0px auto 30px auto;
//   text-align: center;
//   color: #707070;
// }

// .register-form {
//   border-radius: 6px;
//   background: #ffffff;
//   width: 400px;
//   padding: 25px 25px 5px 25px;
//   .el-input {
//     height: 38px;
//     input {
//       height: 38px;
//     }
//   }
//   .input-icon {
//     height: 39px;
//     width: 14px;
//     margin-left: 2px;
//   }
// }
// .register-tip {
//   font-size: 13px;
//   text-align: center;
//   color: #bfbfbf;
// }
// .register-code {
//   width: 33%;
//   height: 38px;
//   float: right;
//   img {
//     cursor: pointer;
//     vertical-align: middle;
//   }
// }
// .el-register-footer {
//   height: 40px;
//   line-height: 40px;
//   position: fixed;
//   bottom: 0;
//   width: 100%;
//   text-align: center;
//   color: #fff;
//   font-family: Arial;
//   font-size: 12px;
//   letter-spacing: 1px;
// }
// .register-code-img {
//   height: 38px;
// }
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;

  // 添加动态背景效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
}

.title {
  margin: 0px auto 40px auto;
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

.register-form {
  border-radius: 20px;
  background: rgba(40, 40, 40, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  width: 420px;
  padding: 40px 35px 30px 35px;
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

  // Element UI 表单项样式重写
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

.register-tip {
  font-size: 14px;
  text-align: center;
  color: #b0b0b0;
  margin-bottom: 20px;
  font-weight: 500;
}

.register-code {
  width: 33%;
  height: 48px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.register-code-img {
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
}

// 链接样式
.link-type {
  color: #e0e0e0;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 8px;
  display: inline-block;
  margin-top: 12px;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
    text-decoration: none;
    transform: translateY(-1px);
  }
}

.el-register-footer {
  height: 50px;
  line-height: 50px;
  position: fixed;
  bottom: 0;
  width: 100%;
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

// Element UI 消息提示框样式重写
::v-deep .el-message-box {
  background: rgba(40, 40, 40, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);

  .el-message-box__header {
    background: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .el-message-box__title {
      color: #ffffff;
      font-weight: 600;
    }

    .el-message-box__headerbtn {
      .el-message-box__close {
        color: #cccccc;

        &:hover {
          color: #ffffff;
        }
      }
    }
  }

  .el-message-box__content {
    .el-message-box__message {
      color: #e0e0e0;
      font-size: 15px;
      line-height: 1.6;
    }
  }

  .el-message-box__btns {
    .el-button {
      border-radius: 8px;
      font-weight: 500;

      &--primary {
        background: linear-gradient(135deg, #4a4a4a, #333333);
        border: none;

        &:hover {
          background: linear-gradient(135deg, #555555, #3a3a3a);
        }
      }
    }
  }
}

// 响应式优化
@media (max-width: 768px) {
  .register {
    padding: 15px;

    .register-form {
      width: 100%;
      max-width: 380px;
      padding: 30px 25px 25px 25px;

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

    .register-code-img {
      height: 44px !important;
    }
  }

  .el-register-footer {
    font-size: 12px;
    height: 45px;
    line-height: 45px;
  }
}

@media (max-width: 480px) {
  .register {
    .register-form {
      padding: 25px 20px 20px 20px;

      .title {
        font-size: 22px;
        margin-bottom: 25px;
      }
    }
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

// Element UI 表单验证错误提示优化
::v-deep .el-form-item.is-error {
  .el-input__inner {
    border-color: #ff5252;
    box-shadow: 0 0 0 2px rgba(255, 82, 82, 0.2);
  }
}

// Router Link 样式优化
::v-deep .router-link-exact-active,
::v-deep .router-link-active {
  color: #ffffff;
}
</style>