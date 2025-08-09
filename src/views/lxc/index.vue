<template>
  <v-app id="neon">
    <v-app-bar id="appbar" app elevate-on-scroll>
      <v-btn v-if="indexIcon" class="no-change" icon @click="$router.push('/home')">
        <v-img contain :lazy-src="logo" max-height="40" max-width="40" :src="logo" alt="logo"></v-img>
      </v-btn>
      <v-app-bar-nav-icon app v-if="!indexIcon" class="no-change"
        @click.stop="openSidebar = !openSidebar"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu @click="menu = false" v-model="menu" v-if="loginState" :close-on-content-click="false" offset-y
        transition="scroll-y-transition">
        <template v-slot:activator="{ on }">
          <v-btn id="user-menu-button" v-on="on" tile>
            <v-icon left>mdi-account-circle</v-icon> {{ loginForm.username }}
            <i class="el-icon-caret-bottom" />
          </v-btn>
        </template>

        <v-card id="user-menu-dropdown">
          <v-list>
            <v-list-item>
              <v-list-item-avatar class="avatar-head">
                <img
                  :src="`https://api.dicebear.com/6.x/micah/svg?seed=${loginForm.username}&backgroundColor=b6e3f4,c0aede,d1d4f9&hair=dannyPhantom,fonze,full,mrClean,mrT,pixie,turban&baseColor=f9c9b6&size=130&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9`"
                  :alt="loginForm.username" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ loginForm.username }}</v-list-item-title>
                <v-list-item-subtitle>TGID：{{ userData.tgId }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <div id="employee-dept" class="px-4">
            <v-list>
              <v-chip class="ma-2" color="green" text-color="white">
                配额
                <v-avatar right class="green darken-2">
                  {{ userData.lxcQuota }}
                </v-avatar>
              </v-chip>
              <v-chip class="ma-2" color="blue" text-color="white">
                已使用
                <v-avatar right class="blue darken-2">
                  {{ userData.usingQuota }}
                </v-avatar>
              </v-chip>
            </v-list>
          </div>
          <v-divider></v-divider>

          <v-list dense>
            <v-list-item-group v-model="activeMenu" mandatory>
              <v-list-item v-for="(item, i) in menuItems" v-show="item.showIndex" :key="i" link :value="`/${item.to}`">
                <v-list-item-title>
                  <v-icon left>{{ item.icon }}</v-icon> {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <v-divider></v-divider>

          <v-list dense>
            <v-list-item @click="logout" link>
              <v-list-item-title>
                <v-icon left>mdi-logout</v-icon> 注 销
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <v-btn text v-if="!loginState" @click="login">
        <v-icon class="mr-2" alt="Avatar">mdi-account-circle-outline</v-icon>
        登录/注册
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer :floating="floating" v-if="!indexIcon" v-model="openSidebar" app>
      <v-list-item class="px-3 pt-1 pb-1">
        <v-list-item-avatar>
          <v-img
            :src="`https://api.dicebear.com/6.x/micah/svg?seed=${loginForm.username}&backgroundColor=b6e3f4,c0aede,d1d4f9&hair=dannyPhantom,fonze,full,mrClean,mrT,pixie,turban&baseColor=f9c9b6&size=130&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9`"
            lazy-src="`https://api.dicebear.com/6.x/micah/svg?seed=${loginForm.username}&backgroundColor=b6e3f4,c0aede,d1d4f9&hair=dannyPhantom,fonze,full,mrClean,mrT,pixie,turban&baseColor=f9c9b6&size=130&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9`"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>{{ loginForm.username }}</v-list-item-title>

        <v-btn icon @click.stop="openSidebar = !openSidebar">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list>
        <v-list-item-group v-model="activeMenu" mandatory>
          <v-list-item v-for="(item, i) in menuItems" :key="i" link :value="`/${item.to}`">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div class="pa-2" @click.stop="logout">
          <v-btn block> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid :class="[{ 'pa-0': isIndex }, !isIndex ? otherView : '']">
        <router-view @hideOverlay="hideOverlay" @showOverlay="showOverlay"></router-view>
      </v-container>
    </v-main>

    <v-dialog v-model="loginDialog" max-width="450" transition="dialog-top-transition">
      <v-card class="relative">
        <v-btn @click="loginDialog = false" class="absolute top-0 right-0" icon>
          <v-icon>mdi-window-close</v-icon>
        </v-btn>

        <div class="m-4 text-xl text-center subpixel-antialiased font-bold">
          登录
        </div>

        <v-divider></v-divider>

        <div class="ml-10 mt-5 mr-10">
          <v-text-field @keyup.enter="loginUser" prepend-icon="mdi-identifier" name="tgId" v-model="tgId"
            :rules="[(v) => !!v || '用户名或TGID不能为空']" label="TGID或用户名" required></v-text-field>
        </div>

        <div class="ml-10 mr-10">
          <v-text-field @keyup.enter="loginUser" prepend-icon="mdi-lock" :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword"
            name="password" v-model="loginForm.password" :rules="[(v) => !!v || '密码不能为空']" label="密码" required>
          </v-text-field>
        </div>
        <div class="ml-10 mr-10">
          <div class="grid grid-cols-2 gap-12">
            <v-text-field @keyup.enter="loginUser" prepend-icon="mdi-check-decagram" v-model="checkCode" :counter="4"
              label="验证码" required></v-text-field>
            <v-img class="w-full" @click="newCheckCode" :src="checkCodeUrl" :lazy-src="checkCodeUrl" max-height="50"
              max-width="140" contain>
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </div>
        </div>

        <div class="text-center mt-5" @keyup.enter="loginUser">
          <v-btn @click="loginUser" depressed rounded color="primary" width="200" dark>
            登录
          </v-btn>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="switchToRegister">
            没有账号?注册
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="regDialog" max-width="450" transition="dialog-top-transition">
      <v-card class="relative">
        <v-btn @click="regDialog = false" class="absolute top-0 right-0" icon>
          <v-icon>mdi-window-close</v-icon>
        </v-btn>

        <div class="m-4 text-xl text-center subpixel-antialiased font-bold">
          注册
        </div>

        <v-divider></v-divider>

        <v-form ref="registerForm" v-model="registerValid">
          <div class="ml-10 mt-5 mr-10">
            <v-text-field autocomplete="off" prepend-icon="mdi-account-box-outline" v-model="registerForm.username"
              :rules="usernameRules" :counter="10" label="用户名" clearable required name="username"></v-text-field>
          </div>
          <div class="ml-10 mr-10">
            <v-text-field autocomplete="off" prepend-icon="mdi-identifier" v-model="registerForm.tgId"
              :rules="tgIdRules" :counter="10" label="TGID" clearable required name="tgId"></v-text-field>
          </div>

          <div class="ml-10 mr-10">
            <v-text-field name="password" autocomplete="off" prepend-icon="mdi-lock" hint="密码长度在5-20位之间"
              :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword" v-model="registerForm.password" :rules="passwordRules"
              :counter="20" label="密码" required></v-text-field>
          </div>

          <div class="ml-10 mr-10">
            <v-text-field type="password" prepend-icon="mdi-lock" v-model="registerForm.confirmPassword" :rules="[
              (v) => v === registerForm.password || '两次密码不一致',
            ]" :counter="20" label="确认密码" autocomplete="off" required></v-text-field>
          </div>

          <div class="ml-10 mr-10">
            <v-text-field type="text" prepend-icon="mdi-closed-caption-outline" v-model="registerForm.invitationCode"
              label="邀请码" placeholder="非必填" autocomplete="off" required></v-text-field>
          </div>

          <div class="ml-10 mr-10">
            <div class="grid grid-cols-2 gap-10">
              <v-text-field prepend-icon="mdi-check-decagram" v-model="registerForm.code" :rules="[
                (v) => !!v || '请输入验证码',
                (v) => v.length === 4 || '验证码长度为4位',
              ]" :counter="4" label="验证码" required></v-text-field>
              <v-img max-height="50" max-width="140" autocomplete="off" class="w-full" @click="newCheckCode"
                :src="checkCodeUrl" :lazy-src="checkCodeUrl">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </div>
          </div>
        </v-form>

        <div class="text-center mt-5">
          <v-btn @click="handleRegister" depressed rounded color="primary" width="200" dark>
            注册</v-btn>
        </div>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="switchToLogin">
            已有账号?登录
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="regDialog" max-width="450" transition="dialog-top-transition">
      <v-card class="relative">
        <v-btn @click="regDialog = false" class="absolute top-0 right-0" icon>
          <v-icon>mdi-window-close</v-icon>
        </v-btn>

        <div class="m-4 text-xl text-center subpixel-antialiased font-bold">
          注册
        </div>

        <v-divider></v-divider>

        <v-form ref="registerForm" v-model="registerValid">
          <div class="ml-10 mt-5 mr-10">
            <v-text-field autocomplete="off" prepend-icon="mdi-account-box-outline" v-model="registerForm.username"
              :rules="usernameRules" :counter="10" label="用户名" clearable required name="username"></v-text-field>
          </div>
          <div class="ml-10 mr-10">
            <v-text-field autocomplete="off" prepend-icon="mdi-identifier" v-model="registerForm.tgId"
              :rules="tgIdRules" :counter="10" label="TGID" clearable required name="tgId"></v-text-field>
          </div>

          <div class="ml-10 mr-10">
            <v-text-field name="password" autocomplete="off" prepend-icon="mdi-lock" hint="密码长度在5-20位之间"
              :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword" v-model="registerForm.password" :rules="passwordRules"
              :counter="20" label="密码" required></v-text-field>
          </div>

          <div class="ml-10 mr-10">
            <v-text-field type="password" prepend-icon="mdi-lock" v-model="registerForm.confirmPassword" :rules="[
              (v) => v === registerForm.password || '两次密码不一致',
            ]" :counter="20" label="确认密码" autocomplete="off" required></v-text-field>
          </div>

          <div class="ml-10 mr-10">
            <v-text-field type="text" prepend-icon="mdi-closed-caption-outline" v-model="registerForm.invitationCode"
              label="邀请码" placeholder="非必填" autocomplete="off" required></v-text-field>
          </div>

          <div class="ml-10 mr-10">
            <div class="grid grid-cols-2 gap-10">
              <v-text-field prepend-icon="mdi-check-decagram" v-model="registerForm.code" :rules="[
                (v) => !!v || '请输入验证码',
                (v) => v.length === 4 || '验证码长度为4位',
              ]" :counter="4" label="验证码" required></v-text-field>
              <v-img max-height="50" max-width="140" autocomplete="off" class="w-full" @click="newCheckCode"
                :src="checkCodeUrl" :lazy-src="checkCodeUrl">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </div>
          </div>
        </v-form>
        <div class="ml-10 mr-10">
          <div class="flex flex-row-reverse space-x-4 space-x-reverse">
            <v-menu offset-y>
            </v-menu>
          </div>
        </div>

        <div class="text-center mt-5">
          <v-btn @click="handleRegister" depressed rounded color="primary" width="200" dark>
            注册</v-btn>
        </div>

        <v-card-actions> </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar class="z-10" v-model="tipSnackbar">
      {{ tipSnackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="tipSnackbar = false">
          确定
        </v-btn>
      </template>
    </v-snackbar>

    <v-overlay :value="overlay">
      <v-dialog v-model="overlay" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Please stand by
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-overlay>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { loginLxc, userNav, getCodeImg, register } from '@/api/login';
import { encrypt, decrypt } from '@/utils/jsencrypt';
import Cookies from 'js-cookie';
import logo from '@/assets/logo/logo.png';

export default {
  name: 'Lxc',
  computed: {
    ...mapState(['settings']),
    ...mapGetters(['name', 'token', 'websiteSidebar']),
    isIndex() {
      return this.activeMenu === '/home';
    },
    activeMenu: {
      get() {
        return this.$route.path;
      },
      set(val) {
        if (val !== this.$route.path) {
          this.handleSelect(val);
        }
      },
    },
    openSidebar: {
      get() {
        return this.$store.state.website.websiteSidebar.hide;
      },
      set(val) {
        this.$store.dispatch('website/setWebsiteSideBarHide', val);
      },
    },
    isCollapse() {
      return !this.websiteSidebar.opened;
    },
  },
  data() {
    return {
      logo,
      menuItems: [
        { title: '主页', icon: 'mdi-home', to: 'home', showIndex: true },
        { title: '个人中心', icon: 'mdi-account', to: 'lxc/user', showIndex: true },
        { title: '我的小鸡', icon: 'mdi-server-network', to: 'lxc/user/myLxc', showIndex: false },
        { title: '领取小鸡', icon: 'mdi-cart-minus', to: 'cart/index', showIndex: false },
      ],
      otherView: ['px-sm-2', 'px-md-4', 'px-lg-8', 'px-xl-12', 'pt-sm-2', 'pt-md-4', 'pt-lg-8', 'pt-xl-12'],
      floating: true,
      indexIcon: true,
      menu: false,
      overlay: false,
      tipSnackbarText: '',
      tipSnackbar: false,
      loginDialog: false,
      regDialog: false,
      checkCodeUrl: '/api/getCaptchaImage?a=' + new Date().getTime(),
      loginState: false,
      checkCode: '',
      tgId: '',
      showPassword: false,
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: '',
      },
      registerValid: false,
      registerForm: {
        tgId: '',
        username: '',
        password: '',
        confirmPassword: '',
        invitationCode: null,
        code: '',
        uuid: '',
      },
      captchaEnabled: true,
      usernameRules: [
        v => !!v || '用户名不能为空',
        v => /^[a-zA-Z0-9_]+$/.test(v) || '用户名只能包含字母、数字、下划线',
        v => (v && v.length >= 4) || '用户名长度不能小于4位',
        v => (v && v.length <= 20) || '用户名长度不能超过20位',
        v => !/^[0-9_]/.test(v) || '用户名不能以数字和下划线开头',
      ],
      tgIdRules: [
        v => !!v || '请输入TGID',
        v => v.length <= 10 || '用户名不得超过10位',
      ],
      passwordRules: [
        v => !!v || '请输入密码',
        v => v.length >= 5 || '密码不得少于5位',
        v => v.length <= 20 || '密码不得超过20位',
        v => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9._!$&@]{5,20}$/g.test(v) ||
          '必须包含大小写字母和数字的组合，可以使用特殊字符. & _ ! $',
      ],
      userData: '',
    };
  },
  watch: {
    $route: {
      handler(val) {
        this.setIndexParam(val.fullPath);
      },
      immediate: true,
    },
  },
  created() {
    this.handleSelect(this.$route.path);
    this.getCookie();
    this.loginState = this.name !== '';
    if (this.loginState) {
      this.loginForm.username = this.name;
      this.getLxcUser();
    }
    this.$bus.$on('flush_user_data', this.getLxcUser);
    this.$bus.$on('showLoginDialog', () => this.jumpDialog('chooseLogin'));
  },
  methods: {
    async getLxcUser() {
      try {
        const response = await userNav();
        if (response.code === 200) {
          this.loginState = true;
          this.loginForm.username = response.data.name;
          this.userData = response.data;
          this.$store.state.userinfo = response.data;
        } else {
          this.loginState = false;
        }
      } catch (error) {
        console.error(error);
        this.loginState = false;
      }
    },
    switchToRegister() {
      this.loginDialog = false;
      this.regDialog = true;
      this.newCheckCode();
    },

    switchToLogin() {
      this.regDialog = false;
      this.loginDialog = true;
      this.newCheckCode();
    },

    newCheckCode() {
      this.getCode();
    },
    login() {
      if (this.loginState) {
        this.$router.push('/lxc/user');
      } else {
        this.newCheckCode();
        this.loginDialog = true;
      }
    },
    getCode() {
      this.checkCodeUrl = '';
      getCodeImg().then(res => {
        this.captchaEnabled = res.data.captchaEnabled === undefined ? true : res.data.captchaEnabled;
        if (this.captchaEnabled) {
          this.checkCodeUrl = 'data:image/gif;base64,' + res.data.img;
          this.loginForm.uuid = res.data.uuid;
          this.registerForm.uuid = res.data.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get('username');
      const password = Cookies.get('password');
      const rememberMe = Cookies.get('rememberMe');
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    loginUser() {
      this.loginDialog = false;
      this.overlay = true;
      if (this.loginForm.rememberMe) {
        Cookies.set('username', this.loginForm.username, { expires: 30 });
        Cookies.set('password', encrypt(this.loginForm.password), { expires: 30 });
        Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
      } else {
        Cookies.remove('username');
        Cookies.remove('password');
        Cookies.remove('rememberMe');
      }
      this.loginForm.username = this.tgId;
      this.loginForm.code = this.checkCode;
      this.$store.dispatch('LxcLogin', this.loginForm)
        .then(() => {
          this.newCheckCode();
          return userNav();
        })
        .then(response => {
          const name = response.data.name;
          this.tipSnackbarText = `登录成功 欢迎回来 ${name}`;
          this.tipSnackbar = true;
          this.loginState = true;
          this.loginDialog = false;
          this.loginForm.username = name;
          this.overlay = false;
          this.userData = response.data;
          this.$store.state.userinfo = response.data;
        })
        .catch(() => {
          this.overlay = false;
          this.newCheckCode();
          setTimeout(() => {
            this.loginDialog = true;
          }, 200);
          if (this.captchaEnabled) {
            this.getCode();
            this.checkCode = '';
          }
        });
    },
    handleRegister() {
      if (this.$refs.registerForm.validate()) {
        this.regDialog = false;
        this.overlay = true;
        let registerForm = this.registerForm;
        registerForm.userType = 'sys_user';
        register(registerForm)
          .then(() => {
            this.overlay = false;
            const username = this.registerForm.username;
            this.$alert(`<font color='red'>恭喜你，您的账号 ${username} 注册成功！</font>`, '系统提示', {
              dangerouslyUseHTMLString: true,
              type: 'success',
            }).then(() => {
              Object.assign(this.$data.registerForm, this.$options.data().registerForm);
              Object.assign(this.$data.loginForm, this.$options.data().loginForm);
              this.regDialog = false;
              this.$router.push('/home');
              this.overlay = false;
            }).catch(() => { });
          })
          .catch(() => {
            this.overlay = false;
            this.regDialog = true;
            if (this.captchaEnabled) {
              this.newCheckCode();
            }
          });
      }
    },
    logout() {
      this.menu = false;
      this.loginState = false;
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.indexIcon = true;
        this.$store.dispatch('website/setWebsiteSideBarHide', true);
        this.$store.dispatch('LogOut').then(() => {
          location.href = process.env.VUE_APP_CONTEXT_PATH;
        });
      }).catch(() => {
        this.loginState = true;
      });
    },
    handleSelect(to) {
      this.showOverlay();
      this.menu = false;
      this.$router.push({ path: to || '/' });
      this.hideOverlay();
    },
    setIndexParam(to) {
      if (to === '/home' || to === '' || to === '/') {
        this.$vuetify.theme.dark = false;
        this.indexIcon = true;
        document.querySelector('body').style.backgroundColor = '';
        this.$store.dispatch('website/setWebsiteSideBarHide', false);
      } else {
        this.indexIcon = false;
        this.$vuetify.theme.dark = true;
        this.$store.dispatch('website/setWebsiteSideBarHide', true);
        document.querySelector('body').style.backgroundColor = '#121212';
      }
    },
    showOverlay() {
      this.overlay = true;
    },
    hideOverlay() {
      this.overlay = false;
    },
  },
};
</script>

<style lang="scss" scoped>
// #neon {
//   .home-main-container {
//     height: 100%;
//   }

//   .theme--light.v-application {
//     font-size: 14px;
//     color: #323232;
//   }

//   .v-menu__content {
//     box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
//       0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12) !important;
//     border-radius: 2px;
//   }

//   #appbar:not(.theme--dark) {
//     background: linear-gradient(45deg, #005bac, #1578cf);
//     color: #ffffff;
//   }

//   #appbar {
//     #user-menu-button {
//       text-transform: unset;
//     }

//     button {
//       color: #ffffff;
//     }

//     button:not(.no-change) {
//       height: inherit;
//     }

//     .v-toolbar__title {
//       padding-left: 8px;
//     }

//     #searchbar {
//       .v-input {
//         width: 296px;

//         .v-icon {
//           color: #505050;
//         }
//       }

//       button {
//         color: #505050;
//       }
//     }

//     #user-menu-button {
//       background-color: transparent;
//       box-shadow: none;

//       .el-icon-caret-bottom {
//         cursor: pointer;
//         font-size: 12px;
//       }
//     }

//     #user-menu-dropdown {
//       width: 290px;

//       .v-divider {
//         border-color: #e0e0e0;
//       }

//       .v-btn,
//       .v-input__control {
//         height: 32px;
//         min-height: 32px;
//       }

//       .avatar-head {
//         height: 50px !important;
//         min-width: 50px !important;
//         width: 50px !important;
//       }

//       .v-icon:not(.theme--dark) {
//         color: #323232;
//       }
//     }
//   }
// }
#neon {
  // 主应用背景
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
  min-height: 100vh;

  .home-main-container {
    height: 100%;
  }

  .theme--light.v-application {
    font-size: 14px;
    color: #e0e0e0 !important;
  }

  .v-menu__content {
    background: rgba(30, 30, 30, 0.98) !important;
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
    border-radius: 12px !important;
  }

  // 应用栏样式
  #appbar {
    background: linear-gradient(135deg, #333333, #4a4a4a) !important;
    color: #ffffff !important;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;

    #user-menu-button {
      text-transform: unset;
      background: rgba(255, 255, 255, 0.1) !important;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 10px !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background: rgba(255, 255, 255, 0.15) !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
      }
    }

    button {
      color: #ffffff !important;
      border-radius: 8px !important;
      transition: all 0.3s ease;

      &:hover:not(.no-change) {
        background: rgba(255, 255, 255, 0.1) !important;
        transform: translateY(-1px);
      }
    }

    button:not(.no-change) {
      height: inherit;
    }

    .v-toolbar__title {
      padding-left: 8px;
      font-weight: 600 !important;
      color: #ffffff !important;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    #searchbar {
      .v-input {
        width: 296px;
        background: rgba(255, 255, 255, 0.1) !important;
        border-radius: 8px !important;
        backdrop-filter: blur(8px);

        .v-icon {
          color: #b0b0b0 !important;
        }
      }

      button {
        color: #b0b0b0 !important;

        &:hover {
          color: #e0e0e0 !important;
        }
      }
    }

    #user-menu-button {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;

      .el-icon-caret-bottom {
        cursor: pointer;
        font-size: 12px;
        color: #e0e0e0 !important;
        transition: transform 0.2s ease;
      }

      &:hover .el-icon-caret-bottom {
        transform: rotate(180deg);
      }
    }

    #user-menu-dropdown {
      width: 290px;
      background: rgba(30, 30, 30, 0.98) !important;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 16px !important;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;

      .v-divider {
        border-color: rgba(255, 255, 255, 0.12) !important;
      }

      .v-btn,
      .v-input__control {
        height: 32px;
        min-height: 32px;
        border-radius: 8px !important;
      }

      .avatar-head {
        height: 50px !important;
        min-width: 50px !important;
        width: 50px !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.1);
      }

      .v-icon {
        color: #e0e0e0 !important;
      }

      .v-list-item {
        color: #e0e0e0 !important;
        border-radius: 8px !important;
        margin: 2px 8px;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateX(4px);
        }

        .v-list-item-title {
          color: #ffffff !important;
          font-weight: 500;
        }

        .v-list-item-subtitle {
          color: #b0b0b0 !important;
        }
      }
    }
  }

  // 导航抽屉样式
  .v-navigation-drawer {
    background: rgba(25, 25, 25, 0.98) !important;
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 4px 0 16px rgba(0, 0, 0, 0.3) !important;

    .v-list-item {
      color: #e0e0e0 !important;
      border-radius: 12px !important;
      margin: 4px 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      &.v-list-item--active {
        background: rgba(255, 255, 255, 0.15) !important;
        color: #ffffff !important;

        &::before {
          opacity: 0;
        }
      }

      .v-list-item-avatar {
        border-radius: 12px !important;
        border: 2px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .v-list-item-icon {
        .v-icon {
          color: #e0e0e0 !important;
          transition: all 0.2s ease;
        }
      }

      &:hover .v-list-item-icon .v-icon {
        color: #ffffff !important;
        transform: scale(1.1);
      }

      .v-list-item-title {
        color: #e0e0e0 !important;
        font-weight: 500;
      }

      &:hover .v-list-item-title {
        color: #ffffff !important;
      }
    }

    .v-btn {
      background: rgba(255, 255, 255, 0.1) !important;
      color: #e0e0e0 !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 10px !important;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.15) !important;
        color: #ffffff !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
      }
    }
  }

  // 主内容区域
  .v-main {
    background: transparent;

    .v-container {
      &.pa-0 {
        padding: 0;
      }

      &:not(.pa-0) {
        background: rgba(20, 20, 20, 0.3);
        backdrop-filter: blur(5px);
        border-radius: 16px;
        margin: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
    }
  }

  // 对话框样式
  .v-dialog {
    .v-card {
      background: rgba(30, 30, 30, 0.98) !important;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 20px !important;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5) !important;

      .v-card-title {
        background: rgba(20, 20, 20, 0.8);
        color: #ffffff !important;
        font-weight: 600;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px 20px 0 0;
      }

      .v-card-text {
        color: #e0e0e0 !important;
      }

      .v-btn {
        border-radius: 10px !important;
        font-weight: 600 !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &.v-btn--contained.primary {
          background: linear-gradient(135deg, #4a4a4a, #333333) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;

          &:hover {
            background: linear-gradient(135deg, #555555, #3a3a3a) !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
          }
        }

        &.v-btn--text {
          color: #b0b0b0 !important;

          &:hover {
            background: rgba(255, 255, 255, 0.1) !important;
            color: #e0e0e0 !important;
          }
        }

        &.v-btn--icon {
          background: transparent !important;

          &:hover {
            background: rgba(255, 255, 255, 0.1) !important;
          }

          .v-icon {
            color: #e0e0e0 !important;
          }
        }
      }
    }
  }

  // 表单元素样式
  .v-text-field {
    .v-input__control {
      background: rgba(50, 50, 50, 0.8) !important;
      border-radius: 8px !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }

    .v-label {
      color: #b0b0b0 !important;
    }

    .v-input__slot {
      background: transparent !important;

      input {
        color: #e0e0e0 !important;
      }
    }

    .v-icon {
      color: #b0b0b0 !important;
    }

    &.v-input--is-focused {
      .v-input__control {
        border-color: rgba(255, 255, 255, 0.3) !important;
      }
    }
  }

  // 芯片样式
  .v-chip {
    background: rgba(50, 50, 50, 0.8) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: #e0e0e0 !important;
    border-radius: 12px !important;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(60, 60, 60, 0.9) !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    &.green {
      background: rgba(46, 125, 50, 0.8) !important;
      border-color: rgba(76, 175, 80, 0.3) !important;
    }

    &.blue {
      background: rgba(25, 118, 210, 0.8) !important;
      border-color: rgba(33, 150, 243, 0.3) !important;
    }

    .v-avatar {
      background: rgba(255, 255, 255, 0.2) !important;
      color: #ffffff !important;
      font-weight: 600;
    }
  }

  // 网格布局
  .grid {
    &.grid-cols-2 {
      gap: 1rem;
    }
  }

  // 图片样式
  .v-img {
    border-radius: 8px !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.02);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }

  // 通知条样式
  .v-snackbar {
    .v-snack__wrapper {
      background: rgba(40, 40, 40, 0.95) !important;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px !important;
      color: #e0e0e0 !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }

    .v-btn {
      color: #b0b0b0 !important;

      &:hover {
        color: #e0e0e0 !important;
      }
    }
  }

  // 覆盖层样式
  .v-overlay {
    backdrop-filter: blur(8px);
    background: rgba(0, 0, 0, 0.7) !important;

    .v-dialog .v-card {
      background: rgba(40, 40, 40, 0.95) !important;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px !important;

      .v-card-text {
        color: #e0e0e0 !important;
      }

      .v-progress-linear {
        border-radius: 4px;

        .v-progress-linear__background {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .v-progress-linear__determinate,
        .v-progress-linear__indeterminate .long,
        .v-progress-linear__indeterminate .short {
          background: #ffffff !important;
        }
      }
    }
  }

  // 分隔线
  .v-divider {
    border-color: rgba(255, 255, 255, 0.12) !important;
    opacity: 0.6;
  }

  // 进度指示器
  .v-progress-circular {
    color: #ffffff !important;
  }

  // 员工部门区域
  #employee-dept {
    background: rgba(20, 20, 20, 0.5);
    border-radius: 8px;
    margin: 8px 0;
  }

  // 表单验证
  .v-messages {
    color: #ff5252 !important;
  }

  // 提示文本
  .v-text-field .v-input__slot {
    .v-text-field__details {
      .v-messages {
        color: #b0b0b0 !important;
      }
    }
  }
}

// #neon {
//   // 主应用背景
//   background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
//   min-height: 100vh;

//   .home-main-container {
//     height: 100%;
//   }

//   .theme--light.v-application {
//     font-size: 14px;
//     color: #e0e0e0 !important;
//   }

//   .v-menu__content {
//     background: rgba(30, 30, 30, 0.98) !important;
//     backdrop-filter: blur(20px);
//     border: 1px solid rgba(255, 255, 255, 0.1) !important;
//     box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
//     border-radius: 12px !important;
//   }

//   // 应用栏样式
//   #appbar {
//     background: linear-gradient(135deg, #333333, #4a4a4a) !important;
//     color: #ffffff !important;
//     backdrop-filter: blur(10px);
//     border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
//     box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;

//     #user-menu-button {
//       text-transform: unset;
//       background: rgba(255, 255, 255, 0.1) !important;
//       backdrop-filter: blur(8px);
//       border: 1px solid rgba(255, 255, 255, 0.15) !important;
//       border-radius: 10px !important;
//       transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

//       &:hover {
//         background: rgba(255, 255, 255, 0.15) !important;
//         transform: translateY(-1px);
//         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
//       }
//     }

//     button {
//       color: #ffffff !important;
//       border-radius: 8px !important;
//       transition: all 0.3s ease;

//       &:hover:not(.no-change) {
//         background: rgba(255, 255, 255, 0.1) !important;
//         transform: translateY(-1px);
//       }
//     }

//     button:not(.no-change) {
//       height: inherit;
//     }

//     .v-toolbar__title {
//       padding-left: 8px;
//       font-weight: 600 !important;
//       color: #ffffff !important;
//       text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
//     }

//     #searchbar {
//       .v-input {
//         width: 296px;
//         background: rgba(255, 255, 255, 0.1) !important;
//         border-radius: 8px !important;
//         backdrop-filter: blur(8px);

//         .v-icon {
//           color: #b0b0b0 !important;
//         }
//       }

//       button {
//         color: #b0b0b0 !important;

//         &:hover {
//           color: #e0e0e0 !important;
//         }
//       }
//     }

//     #user-menu-button {
//       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;

//       .el-icon-caret-bottom {
//         cursor: pointer;
//         font-size: 12px;
//         color: #e0e0e0 !important;
//         transition: transform 0.2s ease;
//       }

//       &:hover .el-icon-caret-bottom {
//         transform: rotate(180deg);
//       }
//     }

//     #user-menu-dropdown {
//       width: 290px;
//       background: rgba(30, 30, 30, 0.98) !important;
//       backdrop-filter: blur(20px);
//       border: 1px solid rgba(255, 255, 255, 0.1) !important;
//       border-radius: 16px !important;
//       box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;

//       .v-divider {
//         border-color: rgba(255, 255, 255, 0.12) !important;
//       }

//       .v-btn,
//       .v-input__control {
//         height: 32px;
//         min-height: 32px;
//         border-radius: 8px !important;
//       }

//       .avatar-head {
//         height: 50px !important;
//         min-width: 50px !important;
//         width: 50px !important;
//         border-radius: 12px !important;
//         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
//         border: 2px solid rgba(255, 255, 255, 0.1);
//       }

//       .v-icon {
//         color: #e0e0e0 !important;
//       }

//       .v-list-item {
//         color: #e0e0e0 !important;
//         border-radius: 8px !important;
//         margin: 2px 8px;
//         transition: all 0.2s ease;

//         &:hover {
//           background: rgba(255, 255, 255, 0.1) !important;
//           transform: translateX(4px);
//         }

//         .v-list-item-title {
//           color: #ffffff !important;
//           font-weight: 500;
//         }

//         .v-list-item-subtitle {
//           color: #b0b0b0 !important;
//         }
//       }
//     }
//   }

//   // 导航抽屉样式
//   .v-navigation-drawer {
//     background: rgba(25, 25, 25, 0.98) !important;
//     backdrop-filter: blur(20px);
//     border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
//     box-shadow: 4px 0 16px rgba(0, 0, 0, 0.3) !important;

//     .v-list-item {
//       color: #e0e0e0 !important;
//       border-radius: 12px !important;
//       margin: 4px 8px;
//       transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

//       &:hover {
//         background: rgba(255, 255, 255, 0.1) !important;
//         transform: translateX(4px);
//         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
//       }

//       &.v-list-item--active {
//         background: rgba(255, 255, 255, 0.15) !important;
//         color: #ffffff !important;

//         &::before {
//           opacity: 0;
//         }
//       }

//       .v-list-item-avatar {
//         border-radius: 12px !important;
//         border: 2px solid rgba(255, 255, 255, 0.1);
//         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
//       }

//       .v-list-item-icon {
//         .v-icon {
//           color: #e0e0e0 !important;
//           transition: all 0.2s ease;
//         }
//       }

//       &:hover .v-list-item-icon .v-icon {
//         color: #ffffff !important;
//         transform: scale(1.1);
//       }

//       .v-list-item-title {
//         color: #e0e0e0 !important;
//         font-weight: 500;
//       }

//       &:hover .v-list-item-title {
//         color: #ffffff !important;
//       }
//     }

//     .v-btn {
//       background: rgba(255, 255, 255, 0.1) !important;
//       color: #e0e0e0 !important;
//       border: 1px solid rgba(255, 255, 255, 0.15) !important;
//       border-radius: 10px !important;
//       transition: all 0.3s ease;

//       &:hover {
//         background: rgba(255, 255, 255, 0.15) !important;
//         color: #ffffff !important;
//         transform: translateY(-2px);
//         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
//       }
//     }
//   }

//   // 主内容区域
//   .v-main {
//     background: transparent;

//     .v-container {
//       &.pa-0 {
//         padding: 0;
//       }

//       &:not(.pa-0) {
//         background: rgba(20, 20, 20, 0.3);
//         backdrop-filter: blur(5px);
//         border-radius: 16px;
//         margin: 1rem;
//         border: 1px solid rgba(255, 255, 255, 0.05);
//       }
//     }
//   }

//   // 对话框样式
//   .v-dialog {
//     .v-card {
//       background: rgba(30, 30, 30, 0.98) !important;
//       backdrop-filter: blur(20px);
//       border: 1px solid rgba(255, 255, 255, 0.1) !important;
//       border-radius: 20px !important;
//       box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5) !important;

//       .v-card-title {
//         background: rgba(20, 20, 20, 0.8);
//         color: #ffffff !important;
//         font-weight: 600;
//         border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//         border-radius: 20px 20px 0 0;
//       }

//       .v-card-text {
//         color: #e0e0e0 !important;
//       }

//       .v-btn {
//         border-radius: 10px !important;
//         font-weight: 600 !important;
//         transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

//         &.v-btn--contained.primary {
//           background: linear-gradient(135deg, #4a4a4a, #333333) !important;
//           color: #ffffff !important;
//           box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;

//           &:hover {
//             background: linear-gradient(135deg, #555555, #3a3a3a) !important;
//             transform: translateY(-2px);
//             box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
//           }
//         }

//         &.v-btn--text {
//           color: #b0b0b0 !important;

//           &:hover {
//             background: rgba(255, 255, 255, 0.1) !important;
//             color: #e0e0e0 !important;
//           }
//         }

//         &.v-btn--icon {
//           background: transparent !important;

//           &:hover {
//             background: rgba(255, 255, 255, 0.1) !important;
//           }

//           .v-icon {
//             color: #e0e0e0 !important;
//           }
//         }
//       }
//     }
//   }

//   // 表单元素样式
//   .v-text-field {
//     .v-input__control {
//       background: rgba(50, 50, 50, 0.8) !important;
//       border-radius: 8px !important;
//       border: 1px solid rgba(255, 255, 255, 0.1) !important;
//     }

//     .v-label {
//       color: #b0b0b0 !important;
//     }

//     .v-input__slot {
//       background: transparent !important;

//       input {
//         color: #e0e0e0 !important;
//       }
//     }

//     .v-icon {
//       color: #b0b0b0 !important;
//     }

//     &.v-input--is-focused {
//       .v-input__control {
//         border-color: rgba(255, 255, 255, 0.3) !important;
//       }
//     }
//   }

//   // 芯片样式
//   .v-chip {
//     background: rgba(50, 50, 50, 0.8) !important;
//     border: 1px solid rgba(255, 255, 255, 0.1) !important;
//     color: #e0e0e0 !important;
//     border-radius: 12px !important;
//     transition: all 0.3s ease;

//     &:hover {
//       background: rgba(60, 60, 60, 0.9) !important;
//       transform: translateY(-1px);
//       box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
//     }

//     &.green {
//       background: rgba(46, 125, 50, 0.8) !important;
//       border-color: rgba(76, 175, 80, 0.3) !important;
//     }

//     &.blue {
//       background: rgba(25, 118, 210, 0.8) !important;
//       border-color: rgba(33, 150, 243, 0.3) !important;
//     }

//     .v-avatar {
//       background: rgba(255, 255, 255, 0.2) !important;
//       color: #ffffff !important;
//       font-weight: 600;
//     }
//   }

//   // 网格布局
//   .grid {
//     &.grid-cols-2 {
//       gap: 1rem;
//     }
//   }

//   // 图片样式
//   .v-img {
//     border-radius: 8px !important;
//     border: 1px solid rgba(255, 255, 255, 0.1);
//     transition: all 0.3s ease;

//     &:hover {
//       transform: scale(1.02);
//       border-color: rgba(255, 255, 255, 0.2);
//     }
//   }

//   // 通知条样式
//   .v-snackbar {
//     .v-snack__wrapper {
//       background: rgba(40, 40, 40, 0.95) !important;
//       backdrop-filter: blur(12px);
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 12px !important;
//       color: #e0e0e0 !important;
//       box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
//     }

//     .v-btn {
//       color: #b0b0b0 !important;

//       &:hover {
//         color: #e0e0e0 !important;
//       }
//     }
//   }

//   // 覆盖层样式
//   .v-overlay {
//     backdrop-filter: blur(8px);
//     background: rgba(0, 0, 0, 0.7) !important;

//     .v-dialog .v-card {
//       background: rgba(40, 40, 40, 0.95) !important;
//       border: 1px solid rgba(255, 255, 255, 0.1);
//       border-radius: 12px !important;

//       .v-card-text {
//         color: #e0e0e0 !important;
//       }

//       .v-progress-linear {
//         border-radius: 4px;

//         .v-progress-linear__background {
//           background: rgba(255, 255, 255, 0.1) !important;
//         }

//         .v-progress-linear__determinate,
//         .v-progress-linear__indeterminate .long,
//         .v-progress-linear__indeterminate .short {
//           background: #ffffff !important;
//         }
//       }
//     }
//   }

//   // 分隔线
//   .v-divider {
//     border-color: rgba(255, 255, 255, 0.12) !important;
//     opacity: 0.6;
//   }

//   // 进度指示器
//   .v-progress-circular {
//     color: #ffffff !important;
//   }

//   // 员工部门区域
//   #employee-dept {
//     background: rgba(20, 20, 20, 0.5);
//     border-radius: 8px;
//     margin: 8px 0;
//   }

//   // 表单验证
//   .v-messages {
//     color: #ff5252 !important;
//   }

//   // 提示文本
//   .v-text-field .v-input__slot {
//     .v-text-field__details {
//       .v-messages {
//         color: #b0b0b0 !important;
//       }
//     }
//   }
// }

// // 响应式设计
// @media (max-width: 768px) {
//   #neon {
//     #appbar #user-menu-dropdown {
//       width: 260px;
//     }

//     .v-navigation-drawer {
//       .v-list-item {
//         margin: 2px 4px;
//       }
//     }

//     .v-dialog .v-card {
//       margin: 1rem;
//       border-radius: 16px !important;
//     }
//   }
// }

// // 滚动条样式
// ::-webkit-scrollbar {
//   width: 8px;
//   height: 8px;
// }

// ::-webkit-scrollbar-track {
//   background: rgba(255, 255, 255, 0.05);
//   border-radius: 4px;
// }

// ::-webkit-scrollbar-thumb {
//   background: rgba(255, 255, 255, 0.2);
//   border-radius: 4px;

//   &:hover {
//     background: rgba(255, 255, 255, 0.3);
//   }
// }

// // 文本选择样式
// ::selection {
//   background: rgba(255, 255, 255, 0.2);
//   color: #ffffff;
// }

// // 动画效果
// @keyframes shimmer {
//   0% {
//     background-position: -1000px 0;
//   }

//   100% {
//     background-position: 1000px 0;
//   }
// }

// // 焦点状态
// *:focus {
//   outline: 2px solid rgba(255, 255, 255, 0.3) !important;
//   outline-offset: 2px;
//   border-radius: 4px;
// }
</style>
