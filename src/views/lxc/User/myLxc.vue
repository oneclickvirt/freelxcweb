<template>
  <v-container data-app="true">
    <div v-if="!myLxcItem || myLxcItem.length == 0" class="text-center my-16">
      <v-icon size="64" color="grey lighten-1">mdi-server-off</v-icon>
      <div class="text-h4 grey--text text--lighten-1 mt-4">空空如也</div>
    </div>

    <template v-else>
      <v-row>
        <v-col cols="12" sm="6" md="4"
          v-for="(myLxc, i) in myLxcItem.filter(item => item.lxcStatus !== '7' && item.lxcStatus !== '8')" :key="i">
          <v-hover v-slot="{ hover }">
            <v-card :elevation="hover ? 8 : 2"
              :class="[{ 'on-hover': hover }, myLxc.lxcStatus == '6' ? 'forbid-card' : '']"
              :disabled="myLxc.lxcStatus == 0 || myLxc.lxcStatus == 1 || myLxc.lxcStatus == 2 || myLxc.lxcStatus == 6"
              @click="(myLxc.lxcStatus == 0 || myLxc.lxcStatus == 1 || myLxc.lxcStatus == 2 || myLxc.lxcStatus == 6) ? '' : lxcModifyTrue(myLxc.lxcId)">
              <v-card-text>
                <v-row no-gutters align="center">
                  <v-col cols="auto" class="mr-3">
                    <v-avatar tile color="primary" size="48">
                      <v-icon dark :class="`fi fi-${myLxc.superTag}`"></v-icon>
                    </v-avatar>
                  </v-col>
                  <v-col>
                    <div class="text-h6 d-flex align-center">
                      {{ myLxc.childName }}
                      <v-icon v-if="myLxc.lxcStatus == '6'" color="red" class="ml-2">mdi-close-circle</v-icon>
                    </div>
                    <div class="text-subtitle-2">ID：{{ myLxc.lxcId }}</div>
                  </v-col>
                  <v-col cols="auto" class="d-flex align-center">
                    <v-btn icon @click.stop="$refs[`menu-${i}`].open()">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    <v-menu ref="menu-${i}" :close-on-content-click="false" :nudge-width="200" offset-x>
                      <v-list>
                        <v-list-item v-for="(item, index) in moreMenu" :key="index"
                          @click="handleLxcMenuClick(myLxc, item.method)">
                          <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
                <v-divider class="my-3"></v-divider>
                <v-row no-gutters>
                  <v-col cols="4">
                    <div class="text-overline">配额时长</div>
                    <div>{{ myLxc.endTime }}</div>
                  </v-col>
                  <v-col cols="4">
                    <div class="text-overline">SSH端口</div>
                    <div class="cursor-pointer" @click.stop="onCopy(myLxc.sshPort)">{{ myLxc.sshPort }}</div>
                  </v-col>
                  <v-col cols="4">
                    <div class="text-overline">IP地址</div>
                    <div class="cursor-pointer" @click.stop="onCopy(myLxc.ip)">{{ myLxc.ip }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-overlay :value="myLxc.lxcStatus == 0 || myLxc.lxcStatus == 1 || myLxc.lxcStatus == 2" absolute>
                <v-progress-circular indeterminate size="64"></v-progress-circular>
                <div class="text-h5 mt-4">创建中</div>
              </v-overlay>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>
      <!-- 已过期，待回收 / 流量已用完-->
      <div v-if="myLxcItem.filter(item => item.lxcStatus === '7').length > 0">
        <div v-if="myLxcItem.filter(item => item.lxcStatus === '7').length > 0" class="text-h5 mb-4 grey--text">已过期，待回收
        </div>
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="(myLxc, i) in myLxcItem.filter(item => item.lxcStatus === '7')"
            :key="i">
            <v-card outlined>
              <v-card-text>
                <v-row no-gutters align="center">
                  <v-col cols="auto" class="mr-3">
                    <v-avatar tile color="grey" size="48">
                      <v-icon dark :class="`fi fi-${myLxc.superTag}`"></v-icon>
                    </v-avatar>
                  </v-col>
                  <v-col>
                    <div class="text-h6 grey--text">{{ myLxc.childName }}</div>
                    <div class="text-subtitle-2 grey--text">ID：{{ myLxc.lxcId }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <!-- 流量已用完 -->
      <div v-if="myLxcItem.filter(item => item.lxcStatus === '8').length > 0">
        <div v-if="myLxcItem.filter(item => item.lxcStatus === '8').length > 0" class="text-h5 mb-4 grey--text">
          流量已用完，每月1号可重新使用</div>
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="(myLxc, i) in myLxcItem.filter(item => item.lxcStatus === '8')"
            :key="i">
            <v-card outlined>
              <v-card-text>
                <v-row no-gutters align="center">
                  <v-col cols="auto" class="mr-3">
                    <v-avatar tile color="grey" size="48">
                      <v-icon dark :class="`fi fi-${myLxc.superTag}`"></v-icon>
                    </v-avatar>
                  </v-col>
                  <v-col>
                    <div class="text-h6 grey--text">{{ myLxc.childName }}</div>
                    <div class="text-subtitle-2 grey--text">ID：{{ myLxc.lxcId }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </template>

    <v-dialog v-model="lxcDialog" max-width="680" scrollable>
      <v-card>
        <v-card-title class="text-h5">
          选择申请的主机
          <v-spacer></v-spacer>
          <v-btn icon @click="lxcDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 400px;">
          <v-row>
            <v-col cols="12" sm="6" v-for="(lxc, i) in lxcItems" :key="i" v-show="!lxc.state">
              <v-card outlined hover @click="applicationLxc(lxc.id)">
                <v-card-text>
                  <v-row no-gutters align="center">
                    <v-col cols="auto" class="mr-3">
                      <v-avatar tile color="primary" size="40">
                        <v-icon dark :class="`fi fi-${lxc.tag}`"></v-icon>
                      </v-avatar>
                    </v-col>
                    <v-col>
                      <div class="text-subtitle-1">{{ lxc.childName }}</div>
                      <div class="text-caption">到期时间：{{ lxc.superDead }}</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="lxcDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">确定要删除吗？</v-card-title>
        <v-card-text>此操作将永久删除该主机，是否继续？</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="lxcDeleteDialog = false">取消</v-btn>
          <v-btn color="red darken-1" text @click="lxcModify('delete')">确定删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="lxcModifyDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="lxcModifyDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>主机操作</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-alert type="info" outlined>
              请不要<strong>重复执行</strong>命令，否则会宕机，点击一次即可。
            </v-alert>

            <v-alert type="success" outlined class="mt-4">
              主机密码：
              <span class="font-weight-bold cursor-pointer" @click="onCopy(lxcPassword)">{{ lxcPassword }}</span>
            </v-alert>

            <v-card outlined class="mt-4">
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="3">
                    <div class="text-overline">IP</div>
                    <div class="cursor-pointer" @click="onCopy(lxcInfo.ip)">{{ lxcInfo.ip }}</div>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <div class="text-overline">SSH端口</div>
                    <div class="cursor-pointer" @click="onCopy(lxcInfo.sshPort)">{{ lxcInfo.sshPort }}</div>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <div class="text-overline">开始端口</div>
                    <div class="cursor-pointer" @click="onCopy(lxcPortStart)">{{ lxcPortStart }}</div>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <div class="text-overline">结束端口</div>
                    <div class="cursor-pointer" @click="onCopy(lxcPortEnd)">{{ lxcPortEnd }}</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card outlined class="mt-4" v-if="lxcInfo.ipv6Addr">
              <v-card-text>
                <div class="text-overline">IPV6地址</div>
                <div class="cursor-pointer" @click="onCopy(lxcInfo.ipv6Addr)">{{ lxcInfo.ipv6Addr }}</div>
              </v-card-text>
            </v-card>

            <v-card class="mt-4">
              <v-img :src="netImageSrc" :lazy-src="netImageSrc" aspect-ratio="2" class="grey lighten-2" max-width="100%"
                max-height="500" contain style="min-height:320px;">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-card>

            <v-row class="mt-4">
              <v-col cols="6">
                <v-btn block color="primary" @click="lxcModify('start')">开机</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block color="warning" @click="lxcModify('restart')">重启</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block color="error" @click="lxcModify('stop')">关机</v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn block color="warning" @click="lxcModify('reset')">重建</v-btn>
              </v-col>
              <!-- <v-col cols="4">
                <v-btn block color="error" @click="lxcDeleteDialog = true">删除主机</v-btn>
              </v-col> -->
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-overlay :value="firstOverlay">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>

    <v-snackbar v-model="tipSnackbar" :timeout="3000" top color="info">
      {{ tipSnackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="tipSnackbar = false">关闭</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
// 保持原有的 JavaScript 代码不变
import {
  addone,
  listAllQueue,
  userLxcData,
  modifyLxc,
  ping,
  getNetImage
} from "@/api/lxc/lxc.js";
import {
  resetLxcQueue
} from "@/api/lxc/queue.js";
import { mapGetters, mapState } from "vuex";
import { loginLxc, userNav } from "@/api/login";
import { listWebsiteNotice } from "@/api/system/notice";

export default {
  name: "myLxc",
  computed: {
    ...mapGetters(["name", "token"]),
  },
  data: () => ({
    childName: "",
    lxcDeleteDialog: false,
    lxcId: "",
    lxcPassword: "",
    lxcModifyDialog: false,
    lxcPortStart: "",
    lxcIp: "",
    lxcPortEnd: "",
    tipSnackbar: false,
    tipSnackbarText: "",
    noticeParams: {
      noticeType: "user_index",
    },
    netUsage: [],
    lxcInfo: {},
    notice: "",
    overlay: false,
    firstOverlay: true,
    username: "",
    lxcDialog: false,
    surplusQuota: "",
    usingQuota: "",
    myLxcItem: [],
    lxcItems: [],
    userData: {},
    moreMenu: [
      { title: "详 情", method: "detail" },
      { title: "SSH", method: "ssh" },
    ],
    netImageSrc: "",
  }),
  created() {
    this.$vuetify.theme.dark = true;
    if (this.token) {
      this.userLxcList(true);
    }
  },
  methods: {
    getNetImage(lxcId, type) {
      getNetImage(lxcId, type).then(res => {
        this.netImageSrc = URL.createObjectURL(new Blob([res]));
      })
    },
    clipboardSuccess() {
      this.$modal.msgSuccess("复制成功");
    },
    userLxcList(first) {
      if (!first) {
        this.overlay = true;
      }
      let _this = this;
      userNav()
        .then((response) => {
          _this.userData = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
      listAllQueue()
        .then((response) => {
          if (response.code == 200) {
            this.myLxcItem = response.data;
            console.log("myLxcItem:", this.myLxcItem);
          } else {
            this.$router.push("/home");
          }
          this.overlay = false;
          this.firstOverlay = false;
          this.myLxcItem.forEach((item) => {
            ping({ lxcId: item.lxcId })
              .then((response) => {
                this.$nextTick(() => {
                  item.ping = response;
                  this.$forceUpdate();
                });
              })
              .catch(function (error) {
                console.log(error);
              });
          });
        })
        .catch(function (error) {
          _this.overlay = false;
          _this.firstOverlay = false;
          console.log(error);
        });
    },
    applicationLxc(lxcId) {
      var data = {
        lxcId: lxcId,
      };
      this.lxcDialog = false;
      this.overlay = true;
      let _this = this;
      addone(data)
        .then((response) => {
          this.overlay = false;
          this.tipSnackbarText = response.msg;
          this.tipSnackbar = true;
          _this.userLxcList();
          _this.$bus.$emit("flush_user_data");
        })
        .catch(function (error) {
          console.log(error);
          _this.overlay = false;
        });
    },
    lxcModifyTrue(lxcId) {
      var data = {
        id: lxcId,
      };
      this.lxcDialog = false;
      this.overlay = true;
      let _this = this;
      this.getNetImage(lxcId, 'summary')
      userLxcData(data)
        .then((response) => {
          this.overlay = false;
          this.tipSnackbarText = response.msg;
          this.$modal.msgSuccess(this.tipSnackbarText);
          this.lxcInfo = response.data;
          this.lxcPortStart = response.data.portStart;
          this.lxcPortEnd = response.data.portEnd;
          this.netUsage = response.data.netUsage;
          this.lxcIp = response.data.ip;
          this.childName = response.data.childName;
          this.lxcPassword = response.data.password;
          this.lxcId = lxcId;
          this.lxcModifyDialog = true;
        }).catch(function (error) {
          console.log(error);
          _this.overlay = false;
        });
    },
    lxcModify(type) {
      var data = {
        lxcId: this.lxcId,
        modifyType: type,
        childName: this.childName,
      };
      this.lxcModifyDialog = false;
      if (this.lxcDeleteDialog) this.lxcDeleteDialog = false;
      // this.overlay = true;
      let _this = this;
      if (data.modifyType == 'reset') {
        resetLxcQueue(data.childName)
          .then((response) => {
            // this.overlay = false;
            this.tipSnackbarText = response.msg;
            this.tipSnackbar = true;
            this.userLxcList();
          })
          .catch(function (error) {
            // _this.overlay = false;
            console.log(error);
          });
      } else {
        modifyLxc(data)
          .then((response) => {
            // this.overlay = false;
            this.tipSnackbarText = response.msg;
            this.tipSnackbar = true;
            this.userLxcList();
          })
          .catch(function (error) {
            // _this.overlay = false;
            console.log(error);
          });
      }
    },
    handleLxcMenuClick(myLxc, method) {
      switch (method) {
        case "detail":
          if (!(myLxc.lxcStatus === 2)) {
            this.lxcModifyTrue(myLxc.lxcId);
          }
          break;
        case "ssh":
          if (myLxc.ping == null || !myLxc.ping) {
            this.$modal.msgWarning("小鸡未开机，无法连接");
            return;
          }
          let pathInfo = this.$router.resolve({
            name: "Terminal"
          });
          localStorage.setItem("lxc", JSON.stringify(myLxc))
          window.open(pathInfo.href, "_blank");
          break;
      }
    },
    onCopy(text) {
      this.$copyText(text).then(() => {
        this.$modal.msgSuccess("复制成功");
      }, () => {
        this.$modal.msgError("复制失败");
      })
    }
  },
  beforeDestroy() {
    // 保持原有的代码
  },
};
</script>

<style lang="scss" scoped>
// .cursor-pointer {
//   cursor: pointer;
// }

// .v-card.on-hover {
//   transition: all 0.3s ease-in-out;
// }

// .v-card.on-hover:hover {
//   transform: translateY(-5px);
// }

// .forbid-card {
//   cursor: not-allowed !important;
//   pointer-events: auto !important;
// }

.cursor-pointer {
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #e0e0e0 !important;
    transform: translateY(-1px);
  }
}

.v-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  min-height: 100vh;
  padding-top: 2rem;
}

.text-center.my-16 {
  .v-icon {
    opacity: 0.3;
    margin-bottom: 1rem;
  }

  .text-h4 {
    background: linear-gradient(135deg, #666666, #999999);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 300;
  }
}

.v-card {
  background: rgba(40, 40, 40, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &.on-hover:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.15) !important;
  }

  &.forbid-card {
    cursor: not-allowed !important;
    pointer-events: auto !important;
    opacity: 0.6;
    filter: grayscale(0.3);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(45deg,
          transparent,
          transparent 10px,
          rgba(255, 0, 0, 0.1) 10px,
          rgba(255, 0, 0, 0.1) 20px);
      z-index: 1;
    }
  }

  &.v-card--outlined {
    background: rgba(30, 30, 30, 0.8) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;

    .v-avatar {
      opacity: 0.6;
    }

    .text-h6,
    .text-subtitle-2 {
      opacity: 0.7;
    }
  }

  .v-card-text {
    color: #e0e0e0 !important;
    position: relative;
    z-index: 2;
  }
}

.v-avatar {
  border-radius: 12px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(135deg, #4a4a4a, #333333) !important;
  }

  &.grey {
    background: linear-gradient(135deg, #666666, #555555) !important;
  }

  .v-icon {
    &[class*="fi-"] {
      border-radius: 4px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }
  }
}

.text-h6 {
  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 1.25rem !important;

  .v-icon {
    filter: drop-shadow(0 0 4px rgba(255, 82, 82, 0.5));
  }
}

.text-subtitle-2 {
  color: #b0b0b0 !important;
  font-size: 0.875rem !important;
  opacity: 0.8;
}

.text-overline {
  color: #999999 !important;
  font-weight: 600 !important;
  letter-spacing: 0.1em !important;
  text-transform: uppercase;
  font-size: 0.75rem !important;
  margin-bottom: 0.25rem;
}

.text-h5 {
  color: #cccccc !important;
  font-weight: 500 !important;
  margin-bottom: 1rem;

  &.grey--text {
    background: linear-gradient(135deg, #666666, #888888);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.v-divider {
  border-color: rgba(255, 255, 255, 0.12) !important;
  margin: 1rem 0;
}

.v-btn {
  border-radius: 10px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.02em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.v-btn--icon {
    background: rgba(255, 255, 255, 0.05) !important;

    &:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      transform: scale(1.1);
    }
  }

  &.v-btn--block {
    height: 48px !important;

    &.primary {
      background: linear-gradient(135deg, #4a4a4a, #333333) !important;
      color: #ffffff !important;

      &:hover {
        background: linear-gradient(135deg, #555555, #3a3a3a) !important;
        transform: translateY(-2px);
      }
    }

    &.warning {
      background: linear-gradient(135deg, #e6a23c, #d4941a) !important;
      color: #ffffff !important;

      &:hover {
        background: linear-gradient(135deg, #f5b041, #e6a23c) !important;
        transform: translateY(-2px);
      }
    }

    &.error {
      background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
      color: #ffffff !important;

      &:hover {
        background: linear-gradient(135deg, #f1556c, #e74c3c) !important;
        transform: translateY(-2px);
      }
    }
  }

  &.v-btn--text {
    &.grey {
      color: #b0b0b0 !important;

      &:hover {
        background: rgba(176, 176, 176, 0.1) !important;
      }
    }

    &.red {
      color: #ff5252 !important;

      &:hover {
        background: rgba(255, 82, 82, 0.1) !important;
      }
    }
  }
}

.v-dialog {
  .v-card {
    background: rgba(30, 30, 30, 0.98) !important;
    backdrop-filter: blur(20px);

    .v-card-title,
    .v-toolbar-title {
      color: #ffffff !important;
      font-weight: 600;
    }

    .v-toolbar {
      background: rgba(20, 20, 20, 0.9) !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .v-card-text {
      color: #e0e0e0 !important;

      .v-card {
        margin-bottom: 1rem;

        &:hover {
          background: rgba(60, 60, 60, 0.9) !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
      }
    }
  }
}

.v-menu__content {
  background: rgba(40, 40, 40, 0.95) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;

  .v-list {
    background: transparent !important;

    .v-list-item {
      color: #e0e0e0 !important;
      border-radius: 8px;
      margin: 4px 8px;

      &:hover {
        background: rgba(255, 255, 255, 0.1) !important;
      }

      .v-list-item-title {
        font-weight: 500;
      }
    }
  }
}

.v-alert {
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(8px);

  &.v-alert--type-info {
    background: rgba(33, 33, 33, 0.9) !important;
    color: #e0e0e0 !important;
    border-left: 4px solid #666 !important;
  }

  &.v-alert--type-success {
    background: rgba(27, 94, 32, 0.2) !important;
    color: #a5d6a7 !important;
    border-left: 4px solid #4caf50 !important;
  }
}

.v-overlay {
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.7) !important;

  .v-progress-circular {
    color: #ffffff !important;
  }

  .v-card {
    border-radius: 12px !important;
  }

  .text-h5 {
    color: #ffffff !important;
    margin-top: 1rem;
    font-weight: 300;
  }
}

.v-img {
  border-radius: 12px !important;
  border: 1px solid rgba(255, 255, 255, 0.1);

  .v-responsive__content {
    backdrop-filter: blur(4px);
  }
}

.v-snackbar {
  .v-snack__wrapper {
    background: rgba(40, 40, 40, 0.95) !important;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px !important;
    color: #e0e0e0 !important;
  }

  .v-btn {
    color: #b0b0b0 !important;
  }
}

.v-toolbar {
  .v-btn--icon {
    .v-icon {
      color: #ffffff !important;
    }
  }
}

@media (max-width: 768px) {
  .v-container {
    padding: 1rem;
  }

  .v-card {
    margin-bottom: 1rem;
  }

  .v-dialog--fullscreen .v-card {
    border-radius: 0 !important;
  }
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
}

::selection {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.v-card:hover {
  animation: pulse 2s infinite;
}
</style>
