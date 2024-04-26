<template>
  <v-app id="neon">

    <v-app-bar id="appbar" app elevate-on-scroll>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-btn v-if="indexIcon" class="no-change" icon @click="$router.push('/home')">
        <v-img contain :lazy-src="logo" max-height="40" max-width="40" :src="logo" alt="logo"></v-img>
        <!-- <v-icon>mdi-lighthouse</v-icon> -->
      </v-btn>
      <v-app-bar-nav-icon app v-if="!indexIcon" class="no-change" @click.stop="openSidebar = !openSidebar"></v-app-bar-nav-icon>

      <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu @click="menu = false" v-model="menu" v-if="loginState" :close-on-content-click="false" offset-y transition="scroll-y-transition">
        <!-- -->
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
                <!-- <img
                  src="https://source.boringavatars.com/beam"
                  lazy-src="https://source.boringavatars.com/beam"
                  :alt="loginForm.username"
                /> -->
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
            <v-list-item @click.native="logout" link>
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
      <v-btn v-if="false" icon>
        <v-icon v-if="!loginState" @click="login" alt="Avatar">mdi-account-circle-outline</v-icon>
        <v-menu v-if="false" v-model="menu" :close-on-content-click="true" :nudge-left="200" :nudge-top="25" :nudge-width="200" offset-x offset-overflow>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar v-bind="attrs" v-on="on" color="accent" class="text-white" size="35">{{ loginForm.username.slice(0, 2) }}</v-avatar>
          </template>
          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <img
                    :src="`https://api.dicebear.com/6.x/micah/svg?seed=${loginForm.username}&backgroundColor=b6e3f4,c0aede,d1d4f9&hair=dannyPhantom,fonze,full,mrClean,mrT,pixie,turban&baseColor=f9c9b6&size=130&backgroundType=gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9`"
                    :alt="loginForm.username" />
                  <!-- <v-avatar color="primary" class="text-white" size="35">
                    {{ loginForm.username.slice(0, 2) }}
                  </v-avatar> -->
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{
                    loginForm.username
                  }}</v-list-item-title>
                  <v-list-item-subtitle>TGID：{{ userData.tgId }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <!-- <v-list-item-action>
              <v-btn :class="fav ? 'red--text' : ''" icon @click="fav = !fav">
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-chip class="ma-2" color="green" text-color="white">
                <v-avatar left class="green darken-4">
                  {{ userData.lxcQuota }}
                </v-avatar>
                配额
              </v-chip>
            </v-list-item-action> -->

            <v-divider></v-divider>
            <v-list>
              <v-chip class="ma-2" color="green" text-color="white">
                <v-avatar left class="green darken-3">
                  {{ userData.lxcQuota }}
                </v-avatar>
                配额
              </v-chip>
              <v-chip class="ma-2" color="blue" text-color="white">
                <v-avatar left class="blue darken-3">
                  {{ userData.usingQuota }}
                </v-avatar>
                已使用
              </v-chip>
            </v-list>
            <v-divider></v-divider>
            <!-- <v-list> -->
            <!-- <v-list-item>
                <v-chip class="ma-2" color="green" text-color="white">
                  <v-avatar left class="green darken-4">
                    {{userData.lxcQuota}}
                  </v-avatar>
                  配额
                </v-chip>
              </v-list-item> -->
            <!-- <v-list-item>
                <v-list-item-action>
                  <v-switch v-model="hints" color="purple"></v-switch>
                </v-list-item-action>
                <v-list-item-title>Enable hints</v-list-item-title>
              </v-list-item> -->
            <!-- </v-list> -->
            <v-list dense>
              <v-list-item v-for="item in menuItems" :key="`index-${item.title}`" link @click.native="routTo(item.to)">
                <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn text @click="menu = false"> Cancel </v-btn>
              <v-btn color="primary" text @click.native="logout"> 注销 </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
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
      <!-- <v-list>
        <template v-for="(item, index) in items">
          <v-list-item v-if="item.action" :key="item.title" link>
            <v-list-item-action>
              <v-icon>{{ item.action }}</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider v-else-if="item.divider" :key="index"></v-divider>

          <v-subheader v-else-if="item.header" :key="item.header">
            {{ item.header }}
          </v-subheader>
        </template>
      </v-list> -->
      <template v-slot:append>
        <div class="pa-2" @click.stop="logout">
          <v-btn block> Logout </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <!-- 给应用提供合适的间距 -->
      <v-container fluid class="pa-0 home-main-container">
      <!-- <v-container fluid :class="[{ 'pa-0': isIndex }, !isIndex ? otherView : '']"> -->
        <!-- 如果使用 vue-router -->
        <router-view @hideOverlay="hideOverlay($event)" @showOverlay="showOverlay($event)"></router-view>
      </v-container>
    </v-main>

    <v-row v-if="loginDialog" justify="center">
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
            <v-text-field prepend-icon="mdi-identifier" name="tgId" v-model="tgId" :rules="[(v) => !!v || '用户名或TGID不能为空']" label="TGID或用户名" required></v-text-field>
          </div>

          <div class="ml-10 mr-10">
            <v-text-field prepend-icon="mdi-lock" :type="showPassword ? 'text' : 'password'" :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword"
              name="password" v-model="loginForm.password" :rules="[(v) => !!v || '密码不能为空']" label="密码" required>
            </v-text-field>
          </div>
          <div class="ml-10 mr-10">
            <!-- <div class="grid grid-cols-5 gap-2 grid-rows-2">
              <v-text-field class="col-span-5" prepend-icon="mdi-check-decagram" v-model="checkCode" :counter="4" label="验证码" required></v-text-field>
              <v-img
              class="w-full col-start-4 col-end-6" @click="newCheckCode"
              :src="checkCodeUrl"
              :lazy-src="checkCodeUrl"
              max-height="50"
              max-width="140"
            > -->
            <div class="grid grid-cols-2 gap-12">
              <v-text-field prepend-icon="mdi-check-decagram" v-model="checkCode" :counter="4" label="验证码" required></v-text-field>
              <v-img class="w-full" @click="newCheckCode" :src="checkCodeUrl" :lazy-src="checkCodeUrl" max-height="50" max-width="140" contain>
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </div>
          </div>

          <div class="ml-10 mr-10">
            <div class="flex flex-row-reverse space-x-4 space-x-reverse">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="white" v-bind="attrs" v-on="on" depressed>
                    更多选项
                    <v-icon right dark> mdi-menu-down </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="jumpDialog(item.type)" v-for="(item, index) in loginTypeItems" :key="index">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>

          <div class="text-center mt-5">
            <v-btn @click="loginUser" depressed rounded color="primary" width="200" dark>
              登录</v-btn>
          </div>

          <v-card-actions> </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row v-if="regDialog" justify="center">
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
              <v-text-field autocomplete="off" prepend-icon="mdi-account-box-outline" v-model="registerForm.username" :rules="usernameRules" :counter="10" label="用户名" clearable required
                name="username"></v-text-field>
            </div>
            <div class="ml-10 mr-10">
              <v-text-field autocomplete="off" prepend-icon="mdi-identifier" v-model="registerForm.tgId" :rules="tgIdRules" :counter="10" label="TGID" clearable required name="tgId"></v-text-field>
            </div>

            <div class="ml-10 mr-10">
              <v-text-field name="password" autocomplete="off" prepend-icon="mdi-lock" hint="密码长度在5-20位之间" :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append="showPassword = !showPassword" v-model="registerForm.password" :rules="passwordRules" :counter="20" label="密码"
                required></v-text-field>
            </div>

            <div class="ml-10 mr-10">
              <v-text-field type="password" prepend-icon="mdi-lock" v-model="registerForm.confirmPassword" :rules="[
                (v) => v === registerForm.password || '两次密码不一致',
              ]" :counter="20" label="确认密码" autocomplete="off" required></v-text-field>
            </div>

            <div class="ml-10 mr-10">
              <v-text-field type="text" prepend-icon="mdi-closed-caption-outline" v-model="registerForm.invitationCode"  label="邀请码" placeholder="非必填" autocomplete="off" required></v-text-field>
            </div>

            <div class="ml-10 mr-10">
              <div class="grid grid-cols-2 gap-10">
                <v-text-field prepend-icon="mdi-check-decagram" v-model="registerForm.code" :rules="[
                  (v) => !!v || '请输入验证码',
                  (v) => v.length === 4 || '验证码长度为4位',
                ]" :counter="4" label="验证码" required></v-text-field>
                <v-img max-height="50" max-width="140" autocomplete="off" class="w-full" @click="newCheckCode" :src="checkCodeUrl" :lazy-src="checkCodeUrl">
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
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="white" v-bind="attrs" v-on="on" depressed>
                    更多选项
                    <v-icon right dark> mdi-menu-down </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="jumpDialog(item.type)" v-for="(item, index) in regTypeItems" :key="index">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
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
    </v-row>

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

    <!-- <v-overlay :value="overlay">
      <v-progress-circular v-if="overlay" indeterminate size="64"></v-progress-circular>
    </v-overlay> -->
  </v-app>
</template>

<script>
// import vuetify from "@/plugins/vuetify";
import logo from "@/assets/logo/logo.png";
import axios from "axios";
import { loginLxc, userNav } from "@/api/login";
import { getCodeImg, register } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import { mapGetters, mapState } from "vuex";
import { listWebsiteNotice } from "@/api/system/notice";
export default {
  name: "Lxc",
  // extends: vuetify,
  metaInfo() {
    return {
      meta: [{
        charset: "utf-8"
      },
      {
        name: "msvalidate.01",
        content: "FC9B6B8BEB3D3B56844ADA69766DBB24"
      }]
    }
  },
  computed: {
    ...mapState(["settings"]),
    ...mapGetters(["name", "token", "websiteSidebar"]),
    isIndex: function () {
      return this.activeMenu === "/home";
    },
    activeMenu: {
      get() {
        const path = this.$route.path;
        let activePath = path;
        // if (path !== undefined && path.lastIndexOf("/") > 0) {
        //   const tmpPath = path.substring(1, path.length);
        //   activePath = "/" + tmpPath.substring(0, tmpPath.indexOf("/"));
        //   this.$store.dispatch('website/setWebsiteSideBarHide', false);
        // }
        return activePath;
      },
      set(val, oldVal) {
        if (val !== oldVal) {
          this.handleSelect(val);
        }
      },
    },
    openSidebar: {
      get() {
        return this.$store.state.website.websiteSidebar.hide;
      },
      set(val) {
        this.$store.dispatch("website/setWebsiteSideBarHide", val);
      },
    },
    isCollapse() {
      return !this.websiteSidebar.opened;
    },
  },
  data: () => ({
    otherView: ['px-sm-2', 'px-md-4', 'px-lg-8', 'px-xl-12','pt-sm-2','pt-md-4', 'pt-lg-8', 'pt-xl-12'],
    logo,
    menuItems: [
      { title: "主页", icon: "mdi-home", to: "home", showIndex: true },
      {
        title: "个人中心",
        icon: "mdi-account",
        to: "lxc/user",
        showIndex: true,
      },
      {
        title: "我的小鸡",
        icon: "mdi-server-network",
        to: "lxc/user/myLxc",
        showIndex: false,
      },
      {
        title: "领取小鸡",
        icon: "mdi-cart-minus",
        to: "cart/index",
        showIndex: false,
      },
    ],
    fav: true,
    floating: true,
    indexIcon: true,
    eager: true,
    elevation: 2,
    menu: false,
    message: false,
    hints: true,
    overlay: false,
    tipSnackbarText: "",
    tipSnackbar: false,
    loginDialog: false,
    regDialog: false,
    checkCodeUrl: "/api/getCaptchaImage?a=" + new Date().getTime(),
    userFace: "https://s3.bmp.ovh/imgs/2022/07/02/41c2334e2e946918.webp",
    loginState: false,
    checkbox: false,
    checkCode: "",
    username: "",
    password: "",
    lastpassword: "",
    userData: "",
    linkModel: 0,
    items: [
      { divider: true },
      { header: "Labels" },
      {
        action: "mdi-label",
        title: "Family",
      },
      {
        action: "mdi-label",
        title: "Friends",
      },
      {
        action: "mdi-label",
        title: "Work",
      },
    ],
    tgId: "",
    usernameRules: [
      (v) => !!v || "用户名不能为空",
      (v) => /^[a-zA-Z0-9_]+$/.test(v) || "用户名只能包含字母、数字、下划线",
      (v) => (v && v.length >= 4) || "用户名长度不能小于4位",
      (v) => (v && v.length <= 20) || "用户名长度不能超过20位",
      (v) => !/^[0-9_]/.test(v) || "用户名不能以数字和下划线开头",
    ],
    showPassword: false,
    loginTypeItems: [{ title: "注册账号", type: "regUser" }],
    regTypeItems: [{ title: "登录", type: "chooseLogin" }],
    tgIdRules: [
      (v) => !!v || "请输入TGID",
      (v) => v.length <= 10 || "用户名不得超过10位",
    ],
    passwordRules: [
      (v) => !!v || "请输入密码",
      (v) => v.length >= 5 || "密码不得少于5位",
      (v) => v.length <= 20 || "密码不得超过20位",
      //密码必须由数字，小写字母，大写字母，特殊字符中的两种组成
      (v) =>
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9._!$&@]{5,20}$/g.test(v) ||
        "必须包含大小写字母和数字的组合，可以使用特殊字符. & _ ! $",
    ],
    checkCodeules: [
      (v) => !!v || "请输入验证码",
      (v) => v.length <= 4 || "验证码不得超过4位",
    ],
    loginForm: {
      username: "",
      password: "",
      rememberMe: false,
      code: "",
      uuid: "",
    },
    registerValid: false,
    registerForm: {
      tgId: "",
      username: "",
      password: "",
      confirmPassword: "",
      invitationCode: null,
      code: "",
      uuid: "",
    },
    // 验证码开关
    captchaEnabled: true,
    protocol: location.protocol,
    httpsFlag: process.env.HTTPS_FLAG
  }),
  watch: {
    $route: {
      handler(val, oldval) {
        let fullPath = val.fullPath;
        this.setIndexParam(fullPath);
        // console.log(val); //新路由信息
        // console.log(oldval); //老路由信息
        // let _this = this;
        // switch (fullPath) {
        //   case "/lxc/user":
        //     userNav()
        //       .then((response) => {
        //         _this.loginState = true;
        //         _this.loginForm.username = response.data.name;
        //         _this.$bus.$emit("global:userData", response.data);
        //       })
        //       .catch(function (error) {
        //         _this.loginState = false;
        //         console.log(error);
        //       });
        //     break;
        //   default:
        //     break;
        // }
      },
      // 深度观察监听
      immediate: true,
    },
  },
  mounted: function () {
    // console.log(process.env.VUE_APP_HTTPS_FLAG == false);
    // todo: 重定向到https
    // if (process.env.VUE_APP_HTTPS_FLAG == "true" && this.protocol == "http:") {
    //   // 重定向到https
    //   location.href = location.href.replace("http", "https");
    // }
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5991535488582679';
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);
  },
  beforeCreate() { },
  created() {
    // this.linkModel = this.$route.path;
    this.handleSelect(this.$route.path);
    this.getCookie();
    this.loginState = this.name != "";
    if (this.loginState) {
      this.loginForm.username = this.name;
      this.getLxcUser();
    }
    this.$bus.$on("flush_user_data", () => {
      this.getLxcUser();
    });
    this.$bus.$on("showLoginDialog", () => {
      this.jumpDialog('chooseLogin');
    });
  },
  methods: {
    async getLxcUser() {
      let _this = this;
      userNav()
        .then((response) => {
          if (response.code == 200) {
            _this.loginState = true;
            _this.loginForm.username = response.data.name;
            _this.userData = response.data;
            _this.$store.state.userinfo = response.data;
          } else {
            _this.loginState = false;
          }
          switch (_this.$route.path) {
            case "/lxc/user":
              // console.log("跳转");
              break;
            default:
              // console.log("被敲击");
              break;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    jumpDialog(type) {
      this.newCheckCode();
      switch (type) {
        case "regUser":
          this.regDialog = true;
          this.loginDialog = false;
          break;
        case "chooseLogin":
          this.regDialog = false;
          this.loginDialog = true;
          break;
      }
    },
    newCheckCode() {
      this.getCode();
      // this.checkCodeUrl = "api/getCaptchaImage?a=" + new Date().getTime();
    },
    login() {
      if (this.loginState) {
        this.$router.push("/lxc/user");
      } else {
        this.newCheckCode();
        this.loginDialog = true;
      }
    },
    getCode() {
      this.checkCodeUrl = "";
      getCodeImg().then((res) => {
        this.captchaEnabled =
          res.data.captchaEnabled === undefined
            ? true
            : res.data.captchaEnabled;
        if (this.captchaEnabled) {
          this.checkCodeUrl = "data:image/gif;base64," + res.data.img;
          this.loginForm.uuid = res.data.uuid;
          this.registerForm.uuid = res.data.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    loginUser() {
      this.loginDialog = false;
      this.overlay = true;
      let _this = this;
      if (this.loginForm.rememberMe) {
        Cookies.set("username", this.loginForm.username, {
          expires: 30,
        });
        Cookies.set("password", encrypt(this.loginForm.password), {
          expires: 30,
        });
        Cookies.set("rememberMe", this.loginForm.rememberMe, {
          expires: 30,
        });
      } else {
        Cookies.remove("username");
        Cookies.remove("password");
        Cookies.remove("rememberMe");
      }
      this.loginForm.username = this.tgId;
      this.loginForm.code = this.checkCode;
      this.$store
        .dispatch("LxcLogin", this.loginForm)
        .then(() => {
          this.newCheckCode();
          userNav()
            .then((response) => {
              let name = response.data.name;
              this.tipSnackbarText = `登录成功 欢迎回来 ${name}`;
              this.tipSnackbar = true;
              this.loginState = true;
              this.loginDialog = false;
              this.loginForm.username = name;
              this.overlay = false;
              _this.loginState = true;
              _this.loginForm.username = name;
              _this.userData = response.data;
              _this.$store.state.userinfo = response.data;
            })
            .catch(function (error) {
              console.log(error);
              _this.loginState = false;
            });
        })
        .catch(() => {
          this.overlay = false;
          this.newCheckCode();
          setTimeout(() => {
            this.loginDialog = true;
          }, 200);
          if (this.captchaEnabled) {
            this.getCode();
          }
        });
    },
    handleRegister() {
      let _this = this;
      if (this.$refs.registerForm.validate()) {
        _this.regDialog = false;
        _this.overlay = true;
        let registerForm = this.registerForm;
        registerForm.userType = "sys_user";
        register(registerForm)
          .then((res) => {
            _this.overlay = false;
            const username = this.registerForm.username;
            _this
              .$alert(
                "<font color='red'>恭喜你，您的账号 " +
                username +
                " 注册成功！</font>",
                "系统提示",
                {
                  dangerouslyUseHTMLString: true,
                  type: "success",
                }
              )
              .then(() => {
                Object.assign(
                  this.$data.registerForm,
                  this.$options.data().registerForm
                );
                Object.assign(
                  this.$data.loginForm,
                  this.$options.data().loginForm
                );
                _this.regDialog = false;
                _this.$router.push("/home");
                _this.overlay = false;
              })
              .catch(() => { });
          })
          .catch(() => {
            _this.overlay = false;
            _this.regDialog = true;
            if (this.captchaEnabled) {
              _this.newCheckCode();
            }
          });
      }
    },
    regUser() {
      if (this.loginForm.password != this.lastpassword) {
        this.tipSnackbarText = "两次代码输入不一样";
        this.tipSnackbar = true;
        return "";
      }
      //注册开始
      var data = {
        tgId: this.tgId,
        password: this.loginForm.password,
        checkCode: this.checkCode,
      };
      this.regDialog = false;
      this.overlay = true;
      axios
        .post("lxc/user/users", data)
        .then((response) => {
          this.tipSnackbarText = response.data.msg;
          this.tipSnackbar = true;
          if (response.data.code == 200) {
            this.regDialog = false;
          } else {
            this.regDialog = true;
          }
          this.newCheckCode();
          this.overlay = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async logout() {
      this.menu = false;
      this.loginState = false;
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.indexIcon = true;
          this.$store.dispatch("website/setWebsiteSideBarHide", true);
          this.$store.dispatch("LogOut").then(() => {
            location.href = process.env.VUE_APP_CONTEXT_PATH;
          });
        })
        .catch(() => {
          this.loginState = true;
        });
    },
    async routTo(to) {
      this.menu = false;
      // this.$bus.$emit("global:userData", this.userData);
      this.$router.push({ path: `/${to}` || "/" }).catch(() => { });
      // location.href = process.env.VUE_APP_CONTEXT_PATH + to;
    },
    changeElevation(e) {
      this.elevation = e;
      this.$forceUpdate();
    },
    changeIndexIcon(val) {
      console.log(val);
      this.indexIcon = val;
      this.$forceUpdate();
    },
    showOverlay() {
      this.overlay = true;
    },
    hideOverlay() {
      this.overlay = false;
    },
    // 菜单选择事件
    handleSelect(to) {
      this.showOverlay();
      this.menu = false;
      this.$router.push({ path: to || "/" });
      this.hideOverlay();
    },
    setIndexParam(to) {
      if (to == "/home" || to == "" || to == "/") {
        this.$vuetify.theme.dark = false;
        this.indexIcon = true;
        document.querySelector("body").style.backgroundColor = "";
        this.$store.dispatch("website/setWebsiteSideBarHide", false);
      } else {
        this.indexIcon = false;
        this.$vuetify.theme.dark = true;
        this.$store.dispatch("website/setWebsiteSideBarHide", true);
        this.changeElevation("0");
        document &&
          (document.querySelector("body").style.backgroundColor = "#121212");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
#neon {
  .home-main-container{
    height: 100%;
  }
  .theme--light.v-application {
    font-size: 14px;
    color: #323232;
  }

  .v-menu__content {
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2),
      0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12) !important;
    border-radius: 2px;
  }

  #appbar:not(.theme--dark) {
    background: linear-gradient(45deg, #005bac, #1578cf);
    color: #ffffff;
  }

  // Topnav
  #appbar {
    #user-menu-button {
      text-transform: unset;
    }

    button {
      color: #ffffff;
    }

    button:not(.no-change) {
      height: inherit;
    }

    .v-toolbar__title {
      padding-left: 8px;
    }

    #searchbar {
      .v-input {
        width: 296px;

        .v-icon {
          color: #505050;
        }
      }

      button {
        color: #505050;
      }
    }

    #user-menu-button {
      background-color: transparent;
      box-shadow: none;

      .el-icon-caret-bottom {
        cursor: pointer;
        font-size: 12px;
      }
    }

    #user-menu-dropdown {
      width: 290px;

      .v-divider {
        border-color: #e0e0e0;
      }

      .v-btn,
      .v-input__control {
        height: 32px;
        min-height: 32px;
      }

      .avatar-head {
        height: 50px !important;
        min-width: 50px !important;
        width: 50px !important;
      }

      .v-icon:not(.theme--dark) {
        color: #323232;
      }
    }
  }
}
</style>
