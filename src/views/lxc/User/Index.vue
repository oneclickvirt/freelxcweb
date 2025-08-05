<template>
  <v-container data-app="true">
    <v-row class="mt-8 mb-12">
      <v-col cols="12" xl="12">
        <v-card outlined>
          <v-card-text>
            <h2 class="text-h4 text--primary mb-4">👋 你好：{{ userData.name }}</h2>

            <v-row class="mb-6">
              <v-col cols="12" sm="4">
                <v-card outlined>
                  <v-card-text>
                    <p class="text-subtitle-1">剩余配额</p>
                    <p class="text-h5 font-weight-bold">{{ userData.surplusQuota }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card outlined>
                  <v-card-text>
                    <p class="text-subtitle-1">使用配额</p>
                    <p class="text-h5 font-weight-bold">{{ userData.usingQuota }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4">
                <v-card outlined>
                  <v-card-text>
                    <p class="text-subtitle-1">类型</p>
                    <p class="text-h5 font-weight-bold">{{ userData.roleName }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-alert class="mb-4" dense type="info" outlined>
              请注意站长<strong>公告</strong>
            </v-alert>

            <v-alert dismissible color="#E6A23C" border="left" elevation="2" colored-border>
              <p class="pa-4" v-html="notice"></p>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="lxcDialog" max-width="680" max-height="800" transition="dialog-top-transition">
      <v-card>
        <v-card-title class="text-h5 text-center">
          选择申请的主机
          <v-btn icon @click="lxcDialog = false" class="position-absolute" style="right: 16px; top: 16px;">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-row>
            <v-col v-for="(lxc, i) in lxcItems" :key="i" cols="12" sm="6" v-show="!lxc.state">
              <v-card outlined hover @click="applicationLxc(lxc.id)">
                <v-card-text class="d-flex align-center">
                  <v-icon class="mr-3" :class="`fi-${lxc.tag}`" dark size="35"></v-icon>
                  <div>
                    <div>{{ lxc.childName }}</div>
                    <div class="text-caption">到期时间：{{ lxc.superDead }}</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="lxcDeleteDialog" max-width="500" transition="dialog-top-transition">
      <v-card>
        <v-card-title class="text-h5 text-center">
          确定要删除吗？
          <v-btn icon @click="lxcDeleteDialog = false" class="position-absolute" style="right: 16px; top: 16px;">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="lxcDeleteDialog = false">
            取消删除
          </v-btn>
          <v-btn color="red" text @click="lxcModify('delete')">
            确定删除
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="lxcModifyDialog" max-width="500" transition="dialog-transition">
      <v-card>
        <v-card-title class="text-h5 text-center">
          主机操作
          <v-btn icon @click="lxcModifyDialog = false" class="position-absolute" style="right: 16px; top: 16px;">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-alert dense type="info" outlined class="mb-4">
            请不要<strong> 重复执行 </strong>命令，否则会宕机，点击一次即可。
          </v-alert>

          <v-alert dense type="success" outlined class="mb-4">
            主机密码：
            <strong class="cursor-pointer" @click="onCopy(lxcPassword)">
              {{ lxcPassword }}
            </strong>
          </v-alert>

          <v-card outlined class="mb-4">
            <v-card-text>
              <v-row>
                <v-col cols="3" class="text-center">
                  <div class="text-caption">IP</div>
                  <div class="cursor-pointer" @click="onCopy(lxcInfo.ip)">
                    {{ lxcInfo.ip }}
                  </div>
                </v-col>
                <v-col cols="3" class="text-center">
                  <div class="text-caption">SSH端口</div>
                  <div class="cursor-pointer" @click="onCopy(lxcInfo.sshPort)">
                    {{ lxcInfo.sshPort }}
                  </div>
                </v-col>
                <v-col cols="3" class="text-center">
                  <div class="text-caption">开始端口</div>
                  <div class="cursor-pointer" @click="onCopy(lxcPortStart)">
                    {{ lxcPortStart }}
                  </div>
                </v-col>
                <v-col cols="3" class="text-center">
                  <div class="text-caption">结束端口</div>
                  <div class="cursor-pointer" @click="onCopy(lxcPortEnd)">
                    {{ lxcPortEnd }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card flat :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'" class="mb-4">
            <v-card-text class="d-flex justify-space-between">
              <div>流量使用情况</div>
              <div>上行流量：{{ netUsage[1] || "-" }}</div>
              <div>下行流量：{{ netUsage[0] || "-" }}</div>
            </v-card-text>
          </v-card>

          <v-row>
            <v-col cols="4" class="text-center">
              <v-btn color="primary" @click="lxcModify('start')">
                主机开机
              </v-btn>
            </v-col>
            <v-col cols="4" class="text-center">
              <v-btn color="primary" @click="lxcModify('stop')">
                主机关机
              </v-btn>
            </v-col>
            <v-col cols="4" class="text-center">
              <v-btn color="primary" @click="lxcModify('restart')">
                主机重启
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-overlay :value="firstOverlay">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <v-overlay :value="overlay">
      <v-dialog v-model="overlay" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            请稍候
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-overlay>

    <v-snackbar v-model="tipSnackbar" :timeout="3000" top>
      {{ tipSnackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="tipSnackbar = false">
          关闭
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
import {
  getLxcList,
  addone,
  listAllQueue,
  userLxcData,
  modifyLxc,
  ping,
} from "@/api/lxc/lxc.js";
import { mapGetters, mapState } from "vuex";
import { loginLxc, userNav } from "@/api/login";
import { listWebsiteNotice } from "@/api/system/notice";

export default {
  name: "lxcUser",
  computed: {
    ...mapGetters(["name", "token"]),
  },
  data: () => ({
    lxcDeleteDialog: false,
    lxcId: "",
    lxcChildName: "",
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
  }),
  created() {
    listWebsiteNotice(this.noticeParams)
      .then((response) => {
        if (response.rows[0] && response.rows[0].status == "0") {
          this.notice = response.rows[0].noticeContent;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    if (this.token) {
      this.userLxcList(true);
    }
  },
  methods: {
    clipboardSuccess() {
      this.$modal.msgSuccess("复制成功");
    },
    onCopy(copyData) {
      let _this = this;
      this.$copyText(copyData)
        .then(() => {
          _this.tipSnackbarText = "已复制到剪贴板";
          _this.tipSnackbar = true;
        })
        .catch(() => {
          _this.tipSnackbarText = "复制失败，请手动复制";
          _this.tipSnackbar = true;
        });
    },
    userLxcList(first) {
      if (!first) {
        this.overlay = true;
      }
      let _this = this;
      userNav()
        .then((response) => {
          _this.userData = response.data;
          this.$route.params.lxcDialog &&
            this.$nextTick(() => {
              this.lxcList();
            });
        })
        .catch(function (error) {
          console.log(error);
        });
      listAllQueue()
        .then((response) => {
          if (response.code == 200) {
            this.myLxcItem = response.data;
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
    lxcList() {
      this.overlay = true;
      let _this = this;
      getLxcList()
        .then((response) => {
          this.lxcItems = response.data;
          this.overlay = false;
          this.lxcDialog = true;
        })
        .catch(function (error) {
          console.log(error);
          _this.overlay = false;
          _this.lxcDialog = true;
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
          this.lxcChildName = response.data.childName;
          this.lxcPassword = response.data.password;
          this.lxcId = lxcId;
          this.lxcModifyDialog = true;
        })
        .catch(function (error) {
          console.log(error);
          _this.overlay = false;
        });
    },
    lxcModify(type) {
      var data = {
        lxcId: this.lxcId,
        modifyType: type,
      };
      this.lxcModifyDialog = false;
      if (this.lxcDeleteDialog) this.lxcDeleteDialog = false;
      this.overlay = true;
      let _this = this;
      modifyLxc(data)
        .then((response) => {
          this.overlay = false;
          this.tipSnackbarText = response.msg;
          this.tipSnackbar = true;
          this.userLxcList();
        })
        .catch(function (error) {
          _this.overlay = false;
          console.log(error);
        });
    },
  },
};
</script>


<style lang="scss" scoped>
// .status-indicator {
//   width: 0.5rem;
//   height: 0.5rem;
//   border-radius: 50%;
//   display: inline-block;
//   margin-right: 0.5rem;
// }

// .cursor-pointer {
//   cursor: pointer;
// }

// .position-absolute {
//   position: absolute;
// }
.status-indicator {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.5rem;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.cursor-pointer {
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #e0e0e0 !important;
    transform: translateY(-1px);
  }
}

.position-absolute {
  position: absolute;
}

.v-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  min-height: 100vh;
  padding-top: 2rem;
}

.v-card {
  background: rgba(40, 40, 40, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1) !important;
  }

  .v-card-text {
    color: #e0e0e0 !important;
  }
}

.text-h4 {
  background: linear-gradient(135deg, #ffffff, #e0e0e0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600 !important;
  letter-spacing: -0.02em;
}

.v-row .v-col .v-card {
  background: rgba(50, 50, 50, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;

  .text-subtitle-1 {
    color: #b0b0b0 !important;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 0.875rem !important;
  }

  .text-h5 {
    color: #ffffff !important;
    font-weight: 700 !important;
    font-size: 1.75rem !important;
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

  &[color="#E6A23C"] {
    background: rgba(45, 39, 28, 0.9) !important;
    color: #f5c842 !important;
    border-left: 4px solid #e6a23c !important;
  }
}

.v-dialog .v-card {
  background: rgba(30, 30, 30, 0.98) !important;
  backdrop-filter: blur(20px);

  .v-card-title {
    background: rgba(20, 20, 20, 0.8);
    color: #ffffff !important;
    font-weight: 600;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px 16px 0 0 !important;
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

.v-btn {
  border-radius: 10px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.02em;
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

  &.v-btn--text.red--text {
    color: #ff5252 !important;

    &:hover {
      background: rgba(255, 82, 82, 0.1) !important;
    }
  }

  &.v-btn--icon {
    &:hover {
      background: rgba(255, 255, 255, 0.1) !important;
    }
  }
}

.v-divider {
  border-color: rgba(255, 255, 255, 0.12) !important;
}

.v-icon {
  &[class*="fi-"] {
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

.v-progress-circular {
  color: #ffffff !important;
}

.v-progress-linear {
  border-radius: 4px !important;

  .v-progress-linear__background {
    background: rgba(255, 255, 255, 0.1) !important;
  }
}

.v-overlay {
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.7) !important;

  .v-card {
    border-radius: 12px !important;
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

@media (max-width: 768px) {
  .v-container {
    padding: 1rem;
  }

  .v-card {
    margin-bottom: 1rem;
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
</style>