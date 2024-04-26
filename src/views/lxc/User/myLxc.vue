<template>
  <v-container data-app="true">
    <div v-if="!myLxcItem || myLxcItem.length == 0" class="start-msg text font-sans text-opacity-50 text-6xl tracking-widest my-align-center">
      空空如也
    </div>
    <div v-if="myLxcItem">
      <div>
        <!-- <h3 class="text-h4 font-weight-light mb-2">点击查看详情</h3> -->
        <div class="grid xl:grid-cols-3 md:grid-cols-2 lg:grid-cols-2 grid-cols-1 gap-6 ">
          <v-hover v-for="(myLxc, i) in myLxcItem.filter(
            (item) => item.lxcStatus !== '7'
          )" :key="i" v-slot="{ hover }">
            <v-card :disabled="myLxc.lxcStatus == 1 || myLxc.lxcStatus == 2" :elevation="hover ? 24 : 1" :loading="myLxc.lxcStatus == 1 || myLxc.lxcStatus == 2" close-delay="200" v-ripple
              class="w-full cursor-pointer" outlined @click="myLxc.lxcStatus == 1 || myLxc.lxcStatus == 2 ? '' : lxcModifyTrue(myLxc.lxcId)">
              <v-fade-transition v-if="myLxc.lxcStatus == 1 || myLxc.lxcStatus == 2">
                <v-overlay absolute light color="#656565" style="background-color: #12121287 !important" class="cursor-not-allowed">
                  <v-scroll-y-transition>
                    <div class="text-h4 flex-grow-1 text-center">
                      创建中
                      <!-- <v-progress-circular
                        indeterminate
                        size="30"
                      ></v-progress-circular> -->
                    </div>
                  </v-scroll-y-transition>
                </v-overlay>
              </v-fade-transition>
              <v-card-text>
                <div class="flex flex-row items-center space-x-4">
                  <v-avatar tile class="text-white" size="53" style="
                        box-shadow: 0 -1px 1px -2px rgba(0, 0, 0, 0.2),
                          0 2px 2px 0 rgba(0, 0, 0, 0.14),
                          0 1px 5px 0 rgba(0, 0, 0, 0.12) !important;
                        height: 40px !important;
                      ">
                    <!-- {{
                        myLxc.superName.slice(0, 2)
                    }}
                    <i class="fi fi-cn w-3 h-3"></i> -->
                    <v-icon :class="`fi fi-${myLxc.superTag}`" dark></v-icon>
                  </v-avatar>
                  <!-- <i class="fi fi-cn w-3 h-3"></i> -->
                  <!-- <div id="" class="animate-ping StatusLine_StatusLine__dashboard__lhiwZ" style="background-color: rgb(0, 168, 129);"></div> -->
                  <!-- <div id="" class="animate-ping StatusLine_StatusLine__dashboard__lhiwZ" style="background-color: rgb(0, 168, 129);"></div> -->

                  <!-- <span class="animate-ping absolute inline-flex h-full w-full rounded-full  opacity-75" style="background-color: rgb(0, 168, 129);"></span> -->
                  <div class="flex-grow-1 ml-5">
                    <div class="flex items-stretch text-xl text--primary font-black">
                      <div>
                        {{ myLxc.childName }}
                      </div>
                      <div class="flex self-center text-xl h-4 w-4 pl-2" v-if="myLxc.ping != null">
                        <span v-if="myLxc.ping" class="animate-ping absolute inline-flex rounded-full h-3 w-3" :style="{
                          backgroundColor: myLxc.ping
                            ? 'rgb(0, 168, 129)'
                            : 'red',
                        }"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 " :style="{
                          backgroundColor: myLxc.ping
                            ? 'rgb(0, 168, 129)'
                            : 'red',
                        }"></span>
                      </div>
                    </div>
                    <div class="text-current">ID：{{ myLxc.lxcId }}</div>
                  </div>
                  <v-menu class="items-start flex-grow-0 m-0" offset-y transition="scroll-y-transition">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn class="mb-3" v-bind="attrs" v-on="on" color="white" icon>
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item v-for="(item, index) in moreMenu" :key="index">
                        <v-btn text @click="handleLxcMenuClick(myLxc, item.method)">
                          {{ item.title }}
                        </v-btn>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                <div class="grid grid-cols-3 mt-5">
                  <div>
                    <div>
                      <div class="text-sm text--primary font-black">
                        配额时长
                      </div>
                    </div>
                    <div>{{ myLxc.endTime }}</div>
                  </div>
                  <div>
                    <div>
                      <div class="text-sm text--primary font-black">
                        SSH端口
                      </div>
                    </div>
                    <div v-clipboard:copy="myLxc.sshPort" v-clipboard:success="clipboardSuccess">
                      {{ myLxc.sshPort }}
                    </div>
                  </div>
                  <div>
                    <div>
                      <div class="text-sm text--primary font-black">IP地址</div>
                    </div>
                    <div v-clipboard:copy="myLxc.ip" v-clipboard:success="clipboardSuccess">{{ myLxc.ip }}</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-hover>
        </div>
        <v-row class="pb-10 pt-13" v-if="myLxcItem.filter((item) => item.lxcStatus === '7').length > 0">
          <v-col>
            <div class="start-msg text text-h4 text-opacity-50">
              以下小鸡已过期，待回收
            </div>
          </v-col>
        </v-row>
        <div class="grid xl:grid-cols-3 grid-cols-1 gap-6">
          <v-hover v-for="(myLxc, i) in myLxcItem.filter(
            (item) => item.lxcStatus === '7'
          )" :key="i" v-slot="{ hover }">
            <v-card :disabled="myLxc.lxcStatus == 1 || myLxc.lxcStatus == 2" :elevation="hover ? 24 : 1" :loading="myLxc.lxcStatus == 1 || myLxc.lxcStatus == 2" close-delay="200" v-ripple
              class="w-full cursor-pointer" outlined>
              <v-fade-transition v-if="myLxc.lxcStatus == 1 || myLxc.lxcStatus == 2">
                <v-overlay absolute light color="#656565" style="background-color: #12121287 !important" class="cursor-not-allowed">
                  <v-scroll-y-transition>
                    <div class="text-h4 flex-grow-1 text-center">
                      创建中
                      <!-- <v-progress-circular
                        indeterminate
                        size="30"
                      ></v-progress-circular> -->
                    </div>
                  </v-scroll-y-transition>
                </v-overlay>
              </v-fade-transition>
              <v-card-text>
                <div class="flex space-x-4">
                  <v-avatar tile class="text-white" size="53" style="
                        box-shadow: 0 -1px 1px -2px rgba(0, 0, 0, 0.2),
                          0 2px 2px 0 rgba(0, 0, 0, 0.14),
                          0 1px 5px 0 rgba(0, 0, 0, 0.12) !important;
                        height: 40px !important;
                      ">
                    <!-- {{
                        myLxc.superName.slice(0, 2)
                    }}
                    <i class="fi fi-cn w-3 h-3"></i> -->
                    <v-icon :class="`fi fi-${myLxc.superTag}`" dark></v-icon>
                  </v-avatar>
                  <!-- <i class="fi fi-cn w-3 h-3"></i> -->
                  <!-- <div id="" class="animate-ping StatusLine_StatusLine__dashboard__lhiwZ" style="background-color: rgb(0, 168, 129);"></div> -->
                  <!-- <div id="" class="animate-ping StatusLine_StatusLine__dashboard__lhiwZ" style="background-color: rgb(0, 168, 129);"></div> -->

                  <!-- <span class="animate-ping absolute inline-flex h-full w-full rounded-full  opacity-75" style="background-color: rgb(0, 168, 129);"></span> -->
                  <span class="h-3 w-1 float-right" v-if="myLxc.ping != null">
                    <span v-if="myLxc.ping" class="animate-ping absolute inline-flex rounded-full h-3 w-3 mt-2" :style="{
                      backgroundColor: myLxc.ping
                        ? 'rgb(0, 168, 129)'
                        : 'red',
                    }"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 mt-2" :style="{
                      backgroundColor: myLxc.ping
                        ? 'rgb(0, 168, 129)'
                        : 'red',
                    }"></span>
                  </span>
                  <div class="flex-grow ml-5">
                    <div class="text-xl text--primary font-black">
                      {{ myLxc.childName }}
                    </div>
                    <p class="text-current">ID：{{ myLxc.lxcId }}</p>
                  </div>
                  <v-menu class="flex-grow-0 m-0" offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" color="white" icon>
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item v-for="(item, index) in moreMenu" :key="index">
                        <v-btn text @click="handleLxcMenuClick(myLxc, item.method)">
                          {{ item.title }}
                        </v-btn>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                <div class="grid grid-cols-3 mt-5">
                  <div>
                    <div>
                      <div class="text-sm text--primary font-black">
                        配额时长
                      </div>
                    </div>
                    <div>{{ myLxc.endTime }}</div>
                  </div>
                  <div>
                    <div>
                      <div class="text-sm text--primary font-black">
                        SSH端口
                      </div>
                    </div>
                    <div v-clipboard:copy="myLxc.sshPort" v-clipboard:success="clipboardSuccess">
                      {{ myLxc.sshPort }}
                    </div>
                  </div>
                  <div>
                    <div>
                      <div class="text-sm text--primary font-black">IP地址</div>
                    </div>
                    <div v-clipboard:copy="myLxc.ip" v-clipboard:success="clipboardSuccess">{{ myLxc.ip }}</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-hover>
        </div>
      </div>
    </div>

    <v-row justify="center">
      <v-dialog v-model="lxcDialog" max-width="680" max-height="800" transition="dialog-top-transition">
        <v-card class="relative">
          <div class="m-5 text-xl text-center subpixel-antialiased font-bold">
            <v-btn style="float: inline-start" class="bottom-4 right-4" icon @click="lxcDialog = false">
              <v-icon>mdi-window-close</v-icon>
            </v-btn>
            选择申请的主机
          </div>

          <v-divider />

          <div class="grid xl:grid-cols-2 grid-cols-1 gap-10 p-5">
            <v-card v-for="(lxc, i) in lxcItems" v-show="!lxc.state" :key="i" v-ripple class="cursor-pointer w-full" outlined @click="applicationLxc(lxc.id)">
              <div class="flex">
                <v-card-text class="align-middle pr-0" style="width: 85%">
                  <v-icon class="fi mr-3 z-deep-1" :class="`fi-${lxc.tag}`" dark size="35" style="
                        box-shadow: 0 -1px 1px -2px rgba(0, 0, 0, 0.2),
                          0 2px 2px 0 rgba(0, 0, 0, 0.14),
                          0 1px 5px 0 rgba(0, 0, 0, 0.12) !important;
                        height: 35px !important;
                      "></v-icon>
                  {{ lxc.childName }}
                </v-card-text>
                <v-card-text class="pl-0 pr-1 fi align-self-center">到期时间：{{ lxc.superDead }}
                </v-card-text>
              </div>
            </v-card>
          </div>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="lxcDeleteDialog" max-width="500" transition="dialog-top-transition">
        <v-card class="relative">
          <v-btn class="absolute top-0 right-0" icon @click="lxcDeleteDialog = false">
            <v-icon>mdi-window-close</v-icon>
          </v-btn>

          <div class="m-4 text-xl text-center subpixel-antialiased font-bold">
            确定要删除吗？
          </div>

          <v-divider />

          <div class="grid grid-cols-2 gap-10 p-5">
            <div class="text-center">
              <v-btn rounded color="primary" dark @click="lxcDeleteDialog = false">
                取消删除</v-btn>
            </div>
            <div class="text-center">
              <v-btn rounded color="red" dark @click="lxcModify('delete')">
                确定删除</v-btn>
            </div>
          </div>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row justify="center">
      <v-dialog v-model="lxcModifyDialog" max-width="500" overlay-opacity="0.95" overlay-color="#1C1C1C" transition="dialog-transition">
        <!-- fullscreen -->
        <v-card class="relative">
          <div class="m-5 text-xl text-center subpixel-antialiased font-bold">
            <v-btn absolute style="float: inline-start" class="left-3 top-3" icon @click="lxcModifyDialog = false">
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
              主机密码<strong class="cursor-pointer" v-clipboard:copy="lxcPassword" v-clipboard:success="clipboardSuccess">
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
                    <div class="cursor-pointer" v-clipboard:copy="lxcInfo.ip" v-clipboard:success="clipboardSuccess">
                      {{ lxcInfo.ip }}
                    </div>
                  </div>
                  <div>
                    <div>
                      <div class="text-sm text--primary font-black">
                        SSH端口
                      </div>
                    </div>
                    <div class="cursor-pointer" v-clipboard:copy="lxcInfo.sshPort" v-clipboard:success="clipboardSuccess">
                      {{ lxcInfo.sshPort }}
                    </div>
                  </div>
                  <div>
                    <div>
                      <div class="text-sm text--primary font-black">
                        开始端口
                      </div>
                    </div>
                    <div class="cursor-pointer" v-clipboard:copy="lxcPortStart" v-clipboard:success="clipboardSuccess">
                      {{ lxcPortStart }}
                    </div>
                  </div>
                  <div>
                    <div>
                      <div class="text-sm text--primary font-black">
                        结束端口
                      </div>
                    </div>
                    <div class="cursor-pointer" v-clipboard:copy="lxcPortEnd" v-clipboard:success="clipboardSuccess">
                      {{ lxcPortEnd }}
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
            <v-card class="w-full" outlined v-if="lxcInfo.ipv6Addr">
              <v-card-text>
                <div class="grid grid-cols-1 justify-items-left">
                  <div class="text-sm text--primary font-black pl-3" v-clipboard:copy="lxcInfo.ipv6Addr" v-clipboard:success="clipboardSuccess">IPV6地址： {{ lxcInfo.ipv6Addr }}</div>
                </div>
              </v-card-text>
            </v-card>


            <v-card class="w-full mt-4">
              <!-- <v-card class="d-flex justify-space-around mb-6 align-center" :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'" flat tile>
                <div class="pa-2" outlined tile>流量使用情况</div>
                <div class="pa-2" outlined>
                  <v-list-item-subtitle>
                    上行流量：{{ (netUsage && netUsage[1]) || "-" }}
                  </v-list-item-subtitle>
                </div>
                <div class="pa-2" outlined tile>
                  <v-list-item-subtitle>
                    下行流量：{{ (netUsage && netUsage[0]) || "-" }}
                  </v-list-item-subtitle>
                </div>
              </v-card> -->
              <v-img
                :src="netImageSrc"
                :lazy-src="netImageSrc"
                class="min-h-300"
                contain
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-card>


            <div class="grid xl:grid-cols-3 grid-cols-3 gap-10 p-5">
              <div class="text-center">
                <v-btn rounded color="primary" dark @click="lxcModify('start')">
                  开 机
                </v-btn>
              </div>
              <div class="text-center">
                <v-btn rounded color="warning" dark @click="lxcModify('restart')">
                  重 启</v-btn>
              </div>
              <div class="text-center">
                <v-btn rounded color="red" dark @click="lxcModify('stop')">
                  关 机
                </v-btn>
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
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
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
import {
  addone,
  listAllQueue,
  userLxcData,
  modifyLxc,
  ping,
  getNetImage
} from "@/api/lxc/lxc.js";
import { mapGetters, mapState } from "vuex";
import { loginLxc, userNav } from "@/api/login";
import { listWebsiteNotice } from "@/api/system/notice";
export default {
  name: "myLxc",
  computed: {
    ...mapGetters(["name", "token"]),
    // ...mapState(["userinfo"]),
  },
  data: () => ({
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
  mounted() { },
  //创建前设置
  beforeCreate() { },
  created: function () {
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
    /** 复制代码成功 */
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
      this.getNetImage(lxcId,'summary')
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
  },
  beforeDestroy() {
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
