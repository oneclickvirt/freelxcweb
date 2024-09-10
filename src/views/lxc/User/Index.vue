<template>
  <v-container data-app="true">
    <div
      class="grid xl:grid-cols-12 grid-cols-1 gap-10 mt-8 mb-12 max-h-screen"
    >
      <v-card class="xl:col-span-12 col-span-8 w-full max-h-screen" outlined>
        <v-card-text>
          <p class="text-h4 text--primary mt-2">👋你好：{{ userData.name }}</p>
          <div class="grid xl:grid-cols-3 grid-cols-2 gap-2 mb-3">
            <div>
              <p>剩余配额</p>
              <div class="text-xl text--primary font-black">
                {{ userData.surplusQuota }}
              </div>
            </div>
            <div>
              <p>使用配额</p>
              <div class="text-xl text--primary font-black">
                {{ userData.usingQuota }}
              </div>
            </div>
            <div>
              <p>类型</p>
              <div class="text-xl text--primary font-black"> {{ userData.roleName }}</div>
            </div>
          </div>
          <v-alert class="mt-5" dense type="info" outlined>
            请注意站长<strong>公告</strong>
          </v-alert>
          <v-alert
            dismissible
            color="#E6A23C"
            border="left"
            elevation="2"
            colored-border
          >
            <p class="m-4" v-html="notice"></p>
          </v-alert>
          <!-- <v-card class="w-auto mb-5" outlined>
            <p class="m-4" v-html="notice"></p>
          </v-card> -->
        </v-card-text>
      </v-card>
    </div>

    <v-row justify="center">
      <v-dialog
        v-model="lxcDialog"
        max-width="680"
        max-height="800"
        transition="dialog-top-transition"
      >
        <v-card class="relative">
          <div class="m-5 text-xl text-center subpixel-antialiased font-bold">
            <v-btn
              style="float: inline-start"
              class="bottom-4 right-4"
              icon
              @click="lxcDialog = false"
            >
              <v-icon>mdi-window-close</v-icon>
            </v-btn>
            选择申请的主机
          </div>

          <v-divider />

          <div class="grid xl:grid-cols-2 grid-cols-1 gap-10 p-5">
            <v-card
              v-for="(lxc, i) in lxcItems"
              v-show="!lxc.state"
              :key="i"
              v-ripple
              class="cursor-pointer w-full"
              outlined
              @click="applicationLxc(lxc.id)"
            >
              <div class="flex">
                <v-card-text class="align-middle pr-0" style="width: 85%">
                  <v-icon
                    class="fi mr-3 z-deep-1"
                    :class="`fi-${lxc.tag}`"
                    dark
                    size="35"
                    style="
                      box-shadow: 0 -1px 1px -2px rgba(0, 0, 0, 0.2),
                        0 2px 2px 0 rgba(0, 0, 0, 0.14),
                        0 1px 5px 0 rgba(0, 0, 0, 0.12) !important;
                      height: 35px !important;
                    "
                  ></v-icon>
                  {{ lxc.childName }}
                </v-card-text>
                <v-card-text class="pl-0 pr-1 fi align-self-center"
                  >到期时间：{{ lxc.superDead }}
                </v-card-text>
              </div>
            </v-card>
          </div>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog
        v-model="lxcDeleteDialog"
        max-width="500"
        transition="dialog-top-transition"
      >
        <v-card class="relative">
          <v-btn
            class="absolute top-0 right-0"
            icon
            @click="lxcDeleteDialog = false"
          >
            <v-icon>mdi-window-close</v-icon>
          </v-btn>

          <div class="m-4 text-xl text-center subpixel-antialiased font-bold">
            确定要删除吗？
          </div>

          <v-divider />

          <div class="grid grid-cols-2 gap-10 p-5">
            <div class="text-center">
              <v-btn
                rounded
                color="primary"
                dark
                @click="lxcDeleteDialog = false"
              >
                取消删除</v-btn
              >
            </div>
            <div class="text-center">
              <v-btn rounded color="red" dark @click="lxcModify('delete')">
                确定删除</v-btn
              >
            </div>
          </div>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog
        v-model="lxcModifyDialog"
        max-width="500"
        transition="dialog-transition"
      >
        <v-card class="relative">
          <div class="m-5 text-xl text-center subpixel-antialiased font-bold">
            <v-btn
              style="float: inline-start"
              class="bottom-4 right-4"
              icon
              @click="lxcModifyDialog = false"
            >
              <v-icon>mdi-window-close</v-icon>
            </v-btn>
            主机操作
          </div>

          <v-divider />

          <div class="text-center pl-5 pr-5">
            <v-alert class="mt-5" dense type="info" outlined>
              请不要<strong> 重复执行 </strong>命令，否则会宕机，点击一次即可。
            </v-alert>
          </div>

          <div class="pl-5 pr-5">
            <v-alert class="mt-5" dense type="success" outlined>
              主机密码<strong
                class="cursor-pointer"
                @click="onCopy(lxcPassword)"
              >
                {{ lxcPassword }}
              </strong>
            </v-alert>
          </div>

          <div class="pl-5 pr-5 space-y-1">
            <v-card class="w-full" outlined>
              <v-card-text>
                <div class="grid grid-cols-4 justify-items-center">
                  <div>
                    <div>
                      <div class="text-sm text--primary font-black">IP</div>
                    </div>
                    <div class="cursor-pointer" @click="onCopy(lxcInfo.ip)">
                      {{ lxcInfo.ip }}
                    </div>
                  </div>
                  <div>
                    <div>
                      <div class="text-sm text--primary font-black">
                        SSH端口
                      </div>
                    </div>
                    <div
                      class="cursor-pointer"
                      @click="onCopy(lxcInfo.sshPort)"
                    >
                      {{ lxcInfo.sshPort }}
                    </div>
                  </div>
                  <div>
                    <div>
                      <div class="text-sm text--primary font-black">
                        开始端口
                      </div>
                    </div>
                    <div class="cursor-pointer" @click="onCopy(lxcPortStart)">
                      {{ lxcPortStart }}
                    </div>
                  </div>
                  <div>
                    <div>
                      <div class="text-sm text--primary font-black">
                        结束端口
                      </div>
                    </div>
                    <div class="cursor-pointer" @click="onCopy(lxcPortEnd)">
                      {{ lxcPortEnd }}
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
            <v-card
              class="d-flex justify-space-around mb-6 align-center"
              :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'"
              flat
              tile
            >
              <div class="pa-2" outlined tile>流量使用情况</div>
              <div class="pa-2" outlined>
                <v-list-item-subtitle>
                  上行流量：{{ netUsage[1] || "-" }}
                </v-list-item-subtitle>
              </div>
              <div class="pa-2" outlined tile>
                <v-list-item-subtitle>
                  下行流量：{{ netUsage[0] || "-" }}
                </v-list-item-subtitle>
              </div>
            </v-card>

            <div class="grid xl:grid-cols-3 grid-cols-3 gap-10 p-5">
              <div class="text-center">
                <v-btn rounded color="primary" dark @click="lxcModify('start')">
                  主机开机
                </v-btn>
              </div>
              <div class="text-center">
                <v-btn rounded color="primary" dark @click="lxcModify('stop')">
                  主机关机
                </v-btn>
              </div>
              <div class="text-center">
                <v-btn
                  rounded
                  color="primary"
                  dark
                  @click="lxcModify('restart')"
                >
                  主机重启</v-btn
                >
              </div>
              <!-- <div class="text-center">
                <v-btn rounded color="red" @click="lxcDeleteDialog = true" dark>
                  重置密码</v-btn
                >
              </div> -->
              <!-- <div class="text-center">
                <v-btn rounded color="red" @click="lxcDeleteDialog = true" dark>
                  删除主机</v-btn
                >
              </div> -->
            </div>
          </div>
        </v-card>
      </v-dialog>
    </v-row>

    <v-overlay :value="firstOverlay">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <v-overlay :value="overlay">
      <v-dialog v-model="overlay" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>
            Please stand by
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-overlay>
    <v-snackbar v-model="tipSnackbar" class="z-10">
      {{ tipSnackbarText }}

      <template #action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="tipSnackbar = false">
          确定
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
// import vuetify from "@/plugins/vuetify";
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
  // extends: vuetify,
  computed: {
    ...mapGetters(["name", "token"]),
    // ...mapState(["userinfo"]),
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
  mounted() {},
  //创建前设置
  beforeCreate() {},
  created: function () {
    listWebsiteNotice(this.noticeParams)
      .then((response) => {
        // console.log('listWebsiteNotice', response.rows[0]);
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
    // this.$bus.$emit("global:homeTipSnackbar",  response.data)
    // this.$bus.$on('global:userData', (json) => {
    //   this.surplusQuota = json.surplusQuota
    //   this.usingQuota = json.usingQuota
    //   this.username = json.name
    //   this.userData = json
    // })
  },
  methods: {
    /** 复制代码成功 */
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
          // this.tipSnackbar = true;
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
  beforeDestroy() {
    // @ts-ignore
    // document && document.querySelector("body").removeAttribute("style");
    // document.querySelector("body").style.backgroundColor = "";
    // this.$vuetify.theme.dark = false;
  },
};
</script>
<style lang="less" scoped>
.StatusLine_StatusLine__dashboard__lhiwZ {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 20px;
}
</style>
