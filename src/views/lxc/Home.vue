<template>
  <div id="home">
    <v-banner initial>
      <v-icon slot="icon" color="primary" size="30">
        mdi-information-outline
      </v-icon>
      <div v-if="notice" v-html="notice" class="notice"></div>

      <!-- <template v-slot:actions>
        <v-btn color="primary" text> Connection Settings </v-btn>
      </template> -->
    </v-banner>
    <div class="grid xl:grid-cols-10 grid-cols-1 gap-10 m-8">
      <div class="xl:col-span-6">
        <video
          src="https://jihulab.com/darkland/lxc_files/-/raw/main/0bknv3_-_02.mp4?inline=false"
          loop
          autoplay="autoplay"
          muted
        ></video>
        <!-- <lottie-player style="width: 100%; height: 100%" src="https://assets7.lottiefiles.com/packages/lf20_3jezq8s4.json" speed="1" loop autoplay></lottie-player> -->
      </div>

      <div class="xl:col-span-4">
        <div class="xl:mt-8">
          <div class="text-5xl font-extrabold text-center">
            <span
              class="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
            >
              spiritlhl的免费LXC申请网站
            </span>
            <p
              class="xl:mt-10 sm:mt-5 text-base sm:text-xl text-center font-black text-gray-400"
            >
              你可以在这里申请到你想要的小鸡
            </p>
          </div>

          <div class="space-y-10 xl:mt-10 sm:mt-5">
            <div v-for="(topTagItem, i) in hoemTopTagItem" :key="i">
              <div
                class="shadow-lg rounded-lg w-full ring-blue-500 text-center ring-2"
              >
                <p class="text-blue-500 font-black p-4">
                  {{ topTagItem }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-14 text-center">
            <v-btn
              class="ma-2 animate-bounce"
              @click="toHome"
              large
              fab
              color="primary"
            >
              <v-icon dark>mdi-arrow-down-thick</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <v-divider></v-divider>

    <v-container class="mt-6">
      <div :id="'home'" class="grid xl:grid-cols-10 grid-cols-1 gap-10">
        <div @click="showTosDialog" class="xl:col-span-4 grid-cols-1">
          <v-carousel
            :show-arrows="false"
            height="310"
            style="background-color: rgb(24 118 210 / 91%)"
            class="cursor-pointer mx-auto w-full rounded-lg relative"
            cycle
            hide-delimiter-background
            show-arrows-on-hover
          >
            <!-- hide-delimiters -->
            <v-carousel-item v-for="(topImage, i) in topImageItem" :key="i">
              <v-sheet color="white">
                <icon-park
                  style="background-color: rgb(24 118 210 / 91%)"
                  class="mt-4 flex flex-column align-center"
                  type="announcement"
                  theme="outline"
                  size="210"
                  fill="#ffffff"
                />
              </v-sheet>
            </v-carousel-item>
            <div
              class="w-full absolute inset-x-0 bottom-0 bg-gray-900 bg-opacity-50"
            >
              <p class="font-grey font-weight-bold text-white mt-5 ml-6">
                用户须知
              </p>
            </div>
          </v-carousel>
        </div>
        <div class="xl:col-span-6 grid-cols-1">
          <div class="grid xl:grid-cols-3 grid-cols-1 gap-5">
            <div
              v-ripple
              v-for="(homeFunction, i) in homeFunctionItem"
              :key="i"
              style="background-color: rgb(24 118 210 / 91%)"
              class="cursor-pointer overflow-hidden rounded-lg relative h-36 w-full bg-img"
              @click="jumpUrl(homeFunction)"
            >
              <icon-park
                class="mt-2 flex flex-column align-center"
                :type="homeFunction.ico"
                theme="outline"
                size="95"
                fill="#ffffff"
              />
              <div
                class="flex rounded-b-lg justify-center w-full absolute inset-x-0 bottom-0 bg-gray-900 bg-opacity-50 h-8"
              >
                <p class="font-black text-white m-1">
                  {{ homeFunction.title }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <v-divider class="mt-10 mb-2"></v-divider>

      <div class="grid xl:grid-cols-2 grid-cols-1 gap-0 mt-10 justify-center">
        <div id="bar_chart" class="w-full h-96"></div>
        <div id="bar_chart_used" class="w-full h-96"></div>
      </div>

      <v-dialog v-model="sponsorDialog" persistent max-width="400">
        <v-card>
          <v-card-title>
            <v-card-text class="text-h4 text-center">赞助我们</v-card-text>
          </v-card-title>
          <v-img
            :src="sponsorImgUrl"
            alt="赞助我们"
            aspect-ratio="1"
            contain
            class="lighten-2"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                <v-card-text
                v-clipboard:copy="'TZ7nf8XAL9zQUo63xokazaBdCPeCgPfcwd'" v-clipboard:success="clipboardSuccess"
                  class="mt-4 text-center cursor-pointer"
                >
                  TZ7nf8XAL9zQUo63xokazaBdCPeCgPfcwd
                </v-card-text>
              </span>
            </template>
            <span>点击复制</span>
          </v-tooltip>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="light-blue darken-2 darken-1"
              text
              @click="sponsorDialog = false"
            >
              再想想
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="tosDialog" persistent max-width="850">
        <v-card>
          <v-card-title class="m-0">
            <v-card-text class="text-h4 text-center">{{
              tos.title
            }}</v-card-text>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="notice">
            <div v-html="tos.content"></div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="tosDialog = false">
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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

      <v-snackbar class="z-10" v-model="tipSnackbar">
        {{ tipSnackbarText }}
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
// import * as echarts from "echarts";
import { IconPark } from "@icon-park/vue/es/all";
import { onLineLxc } from "@/api/lxc/lxc.js";
import { listWebsiteNotice } from "@/api/system/notice";
export default {
  components: {
    IconPark,
  },
  name: "home",
  data() {
    return {
      notice: "",
      overlay: false,
      tosDialog: false,
      sponsorDialog: false,
      sponsorImgUrl: undefined,
      tos: {
        content: "",
        title: "用户须知",
      },
      lxcOnLineList: [],
      lxcLxcUsedList: [],
      charts_id: "bar_chart",
      hoemTopTagItem: [
        "绑定简单，只需要一个TG账号！",
        "超长测试时间，你理论上可以使用几个月！",
        "免费开放，提供优质小鸡。",
      ],
      noticeParams: {
        noticeType: "website",
      },
      topImageItem: [
        "https://ftp.bmp.ovh/imgs/2021/01/8646e0485688935f.jpg",
        // "https://s3.bmp.ovh/imgs/2021/12/963e0fac710a24e9.jpeg",
      ],
      tipSnackbar: false,
      tipSnackbarText: "",
      homeFunctionItem: [
        {
          title: "个人中心",
          path: "/lxc/user",
          ico: "me",
          needLogin: true,
        },
        {
          title: "主机列表",
          path: "/cart/index",
          name: "cartIndex",
          params: {
            lxcDialog: true,
          },
          ico: "server",
          needLogin: true,
        },
        {
          title: "合作伙伴",
          url: "https://t.me/vps_reviews",
          ico: "holding-hands",
        },
        {
          title: "频道地址",
          url: "https://t.me/VPS_spiders",
          ico: "telegram",
        },
        {
          title: "赞助我们",
          imageUrl:
            "https://jihulab.com/darkland/lxc_files/-/raw/main/usdt.jpg?inline=false",
          url: "/",
          ico: "OvalLoveTwo",
        },
        {
          title: "联系我们",
          url: "https://t.me/spiritlhl_bot",
          ico: "communication",
        },
      ],
    };
  },

  mounted: function () {
    //请求
    onLineLxc()
      .then((response) => {
        this.lxcOnLineList = response.data.lxcOnLineList;
        this.lxcLxcUsedList = response.data.lxcLxcUsedList;
        this.loadChart();
      })
      .catch(function (error) {
        console.log(error);
      });

    listWebsiteNotice(this.noticeParams)
      .then((response) => {
        // console.log('listWebsiteNotice',response.rows[0]);
        if (response.rows[0] && response.rows[0].status == "0") {
          this.notice = response.rows[0].noticeContent;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  methods: {
    /** 复制代码成功 */
    clipboardSuccess() {
      this.$modal.msgSuccess("复制成功");
    },
    handleAnimation: function (anim) {
      this.anim = anim;
    },
    toHome() {
      document.getElementById("home").scrollIntoView();
    },
    jumpUrl(to) {
      if (to.imageUrl) {
        this.showSponsorDialog(to.imageUrl);
        return;
      }else if(to.url){
        window.open(to.url, '_blank')
      }else{
        if(to.needLogin && !this.$store.getters.token){
            this.$bus.$emit("showLoginDialog");
            this.$modal.msgError("请先登录");
            return;
        }
        this.$router.push(to.path);
      }
    },
    loadChart() {
      this.$nextTick(() => {
        this.myChart = echarts.init(document.getElementById(this.charts_id));
        this.myChart.setOption(this.initOption());
        echarts
          .init(document.getElementById("bar_chart_used"))
          .setOption(this.initOptionUsed());
      });
    },
    initOption() {
      const option = {
        title: {
          text: "本站空闲主机地区分布",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "auto",
          top: 'middle',
          type: "scroll",
          z: 1
        },
        series: [
          {
            name: "地区",
            type: "pie",
            minAngle:'10',
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            // center: ["70%", "50%"],
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.lxcOnLineList,
          },
        ],
      };
      return option;
    },
    initOptionUsed() {
      const option = {
        title: {
          text: "本站已领取的主机地区分布",
          // subtext: "仅空闲主机",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "auto",
          top: 'middle',
          type: "scroll",
          z: 1
        },
        series: [
          {
            name: "地区",
            type: "pie",
            minAngle:'10',
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            // center: ["70%", "50%"],
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.lxcLxcUsedList,
          },
        ],
      };
      return option;
    },
    showTosDialog() {
      this.overlay = true;
      listWebsiteNotice({ noticeType: "tos" })
        .then((response) => {
          // console.log('listWebsiteNotice',response.rows[0]);
          if (response.rows[0] && response.rows[0].status == "0") {
            this.tos.content = response.rows[0].noticeContent;
            this.tos.title = response.rows[0].noticeTitle;
          }
          this.overlay = false;
          this.tosDialog = true;
        })
        .catch(function (error) {
          this.overlay = true;
          console.log(error);
        });
    },
    async routTo(to) {
      this.menu = false;
      this.$router.push({ path: `/${to}` || "/" }).catch(() => {});
    },
    showSponsorDialog(url) {
      this.sponsorDialog = true;
      this.sponsorImgUrl = url;
    },
    onCopy(copyData) {
      let _this = this;
      _this
        .$copyText(copyData)
        .then(() => {
          _this.tipSnackbarText = "已复制到剪贴板，若无法粘贴请双击复制";
          _this.tipSnackbar = true;
        })
        .catch(() => {
          _this.tipSnackbarText = "复制失败，请手动复制";
          _this.tipSnackbar = true;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
#home{
  .bg-img {
    background-size: cover;
  }
  
  .notice {
    ::v-deep  p {
      margin: 0 !important;
    }
  } 
}

</style>
