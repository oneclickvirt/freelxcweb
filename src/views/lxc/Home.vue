<template>
  <div id="home" class="bg-gray-50">
    <v-banner v-if="notice" initial class="mb-6">
      <template #icon>
        <v-icon color="primary" size="30">mdi-information-outline</v-icon>
      </template>
      <div v-html="notice" class="notice"></div>
    </v-banner>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
      <div class="xl:col-span-7">
        <video src="https://jihulab.com/darkland/lxc_files/-/raw/main/0bknv3_-_02.mp4?inline=false" loop autoplay muted
          class="w-full rounded-xl shadow-2xl"></video>
      </div>

      <div class="xl:col-span-5 flex flex-col justify-center">
        <div class="text-center mb-8">
          <h1 class="text-4xl xl:text-5xl font-extrabold mb-4">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-500">
              spiritlhl的LXC容器共享网站
            </span>
          </h1>
          <p class="text-xl text-gray-600">你可以在这里申请到你想要的免费容器</p>
        </div>

        <div class="flex flex-col items-center space-y-4 mb-10">
          <div v-for="(item, i) in hoemTopTagItem" :key="i"
            class="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 shadow-md transition-all duration-300 hover:shadow-lg hover:border-blue-300 w-full max-w-md text-center">
            <p class="text-blue-700 font-bold text-lg">{{ item }}</p>
          </div>
        </div>

        <div class="text-center">
          <v-btn @click="toHome" x-large fab color="primary" class="animate-bounce shadow-lg">
            <v-icon dark>mdi-arrow-down-thick</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <v-divider></v-divider>

    <v-container class="mt-12 mb-16">
      <div class="grid grid-cols-12 gap-6">
        <div @click="showTosDialog" class="col-span-12 xl:col-span-3 cursor-pointer">
          <v-carousel :show-arrows="false" height="310" class="rounded-xl overflow-hidden shadow-xl" cycle
            hide-delimiter-background show-arrows-on-hover>
            <v-carousel-item v-for="(image, i) in topImageItem" :key="i">
              <v-sheet color="primary" class="fill-height d-flex justify-center align-center">
                <icon-park type="announcement" theme="outline" size="180" fill="#ffffff" />
              </v-sheet>
            </v-carousel-item>
            <div class="absolute inset-x-0 bottom-0 bg-gray-900 bg-opacity-60 py-3">
              <p class="font-bold text-white text-center text-lg">用户须知</p>
            </div>
          </v-carousel>
        </div>

        <div class="col-span-12 xl:col-span-9">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(func, i) in homeFunctionItem" :key="i"
              class="cursor-pointer overflow-hidden rounded-xl relative h-44 flex flex-col justify-center items-center transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-br from-blue-500 to-blue-600"
              @click="jumpUrl(func)" v-ripple>
              <icon-park :type="func.ico" theme="outline" size="70" fill="#ffffff" class="mb-3" />
              <p class="font-bold text-white text-center text-lg">{{ func.title }}</p>
            </div>
          </div>
        </div>
      </div>

      <v-divider class="my-16"></v-divider>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div id="bar_chart" class="h-96 bg-white rounded-xl shadow-lg p-4"></div>
        <div id="bar_chart_used" class="h-96 bg-white rounded-xl shadow-lg p-4"></div>
      </div>

      <v-dialog v-model="sponsorDialog" persistent max-width="400">
        <v-card>
          <v-card-title class="text-h4 text-center pb-0">赞助我们</v-card-title>
          <v-img :src="sponsorImgUrl" alt="赞助我们" aspect-ratio="1" contain class="bg-gray-100">
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-card-text v-bind="attrs" v-on="on" @click="onCopy('TZ7nf8XAL9zQUo63xokazaBdCPeCgPfcwd')"
                class="mt-4 text-center cursor-pointer">
                TZ7nf8XAL9zQUo63xokazaBdCPeCgPfcwd
              </v-card-text>
            </template>
            <span>点击复制</span>
          </v-tooltip>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="sponsorDialog = false">再想想</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="tosDialog" persistent max-width="850">
        <v-card>
          <v-card-title class="text-h4 text-center">{{ tos.title }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text class="notice" v-html="tos.content"></v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="tosDialog = false">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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

      <v-snackbar v-model="tipSnackbar" :timeout="3000" color="info" class="z-10">
        {{ tipSnackbarText }}
      </v-snackbar>
    </v-container>
  </div>
</template>

<script>
import { IconPark } from "@icon-park/vue/es/all";
import { onLineLxc } from "@/api/lxc/lxc.js";
import { listWebsiteNotice } from "@/api/system/notice";

export default {
  name: "Home",
  components: { IconPark },
  data() {
    return {
      notice: "",
      overlay: false,
      tosDialog: false,
      sponsorDialog: false,
      sponsorImgUrl: undefined,
      tos: { content: "", title: "用户须知" },
      lxcOnLineList: [],
      lxcLxcUsedList: [],
      hoemTopTagItem: [
        "绑定简单，只需要一个TG账号！",
        "超长测试时间，你理论上可以使用几个月！",
        "免费开放，提供优质小鸡。",
      ],
      topImageItem: ["https://ftp.bmp.ovh/imgs/2021/01/8646e0485688935f.jpg"],
      tipSnackbar: false,
      tipSnackbarText: "",
      homeFunctionItem: [
        { title: "个人中心", path: "/lxc/user", ico: "me", needLogin: true },
        { title: "主机列表", path: "/cart/index", name: "cartIndex", params: { lxcDialog: true }, ico: "server", needLogin: true },
        { title: "合作伙伴", url: "https://t.me/vps_reviews", ico: "holding-hands" },
        { title: "频道地址", url: "https://t.me/VPS_spiders", ico: "telegram" },
        { title: "赞助我们", imageUrl: "https://jihulab.com/darkland/lxc_files/-/raw/main/usdt.jpg?inline=false", url: "/", ico: "OvalLoveTwo" },
        { title: "联系我们", url: "https://t.me/spiritlhl_bot", ico: "communication" },
      ],
    };
  },
  mounted() {
    this.fetchLxcData();
    this.fetchWebsiteNotice();
  },
  methods: {
    toHome() {
      document.getElementById("home").scrollIntoView({ behavior: "smooth" });
    },
    jumpUrl(to) {
      if (to.imageUrl) {
        this.showSponsorDialog(to.imageUrl);
      } else if (to.url) {
        window.open(to.url, '_blank');
      } else {
        if (to.needLogin && !this.$store.getters.token) {
          this.$bus.$emit("showLoginDialog");
          this.$modal.msgError("请先登录");
          return;
        }
        this.$router.push(to.path);
      }
    },
    loadChart() {
      this.$nextTick(() => {
        const chart = echarts.init(document.getElementById("bar_chart"));
        chart.setOption(this.createChartOption("本站空闲主机地区分布", this.lxcOnLineList));

        const usedChart = echarts.init(document.getElementById("bar_chart_used"));
        usedChart.setOption(this.createChartOption("本站已领取的主机地区分布", this.lxcLxcUsedList));
      });
    },
    createChartOption(title, data) {
      return {
        title: { text: title, left: "center" },
        tooltip: { trigger: "item" },
        legend: { orient: "vertical", left: "auto", top: 'middle', type: "scroll", z: 1 },
        series: [{
          name: "地区", type: "pie", minAngle: 10, radius: ["40%", "70%"],
          itemStyle: { borderRadius: 10, borderColor: "#fff", borderWidth: 2 },
          label: { show: false, position: "center" },
          emphasis: { label: { show: true, fontSize: "20", fontWeight: "bold" } },
          data: data
        }]
      };
    },
    showTosDialog() {
      this.overlay = true;
      listWebsiteNotice({ noticeType: "tos" })
        .then(response => {
          if (response.rows[0] && response.rows[0].status == "0") {
            this.tos.content = response.rows[0].noticeContent;
            this.tos.title = response.rows[0].noticeTitle;
          }
          this.overlay = false;
          this.tosDialog = true;
        })
        .catch(error => {
          this.overlay = false;
          console.error(error);
        });
    },
    showSponsorDialog(url) {
      this.sponsorDialog = true;
      this.sponsorImgUrl = url;
    },
    onCopy(copyData) {
      this.$copyText(copyData)
        .then(() => {
          this.tipSnackbarText = "已复制到剪贴板，若无法粘贴请双击复制";
          this.tipSnackbar = true;
        })
        .catch(() => {
          this.tipSnackbarText = "复制失败，请手动复制";
          this.tipSnackbar = true;
        });
    },
    fetchLxcData() {
      onLineLxc()
        .then(response => {
          this.lxcOnLineList = response.data.lxcOnLineList;
          this.lxcLxcUsedList = response.data.lxcLxcUsedList;
          this.loadChart();
        })
        .catch(console.error);
    },
    fetchWebsiteNotice() {
      listWebsiteNotice({ noticeType: "website" })
        .then(response => {
          if (response.rows[0] && response.rows[0].status == "0") {
            this.notice = response.rows[0].noticeContent;
          }
        })
        .catch(console.error);
    },
  },
};
</script>

<style lang="scss">
// 顶部导航栏修复
.v-app-bar,
.v-toolbar {
  background: linear-gradient(135deg, #0f0f0f, #1a1a1a) !important;
  border-bottom: 1px solid #404040 !important;

  .v-toolbar__title,
  .v-btn {
    color: #ffffff !important;
  }

  .v-icon {
    color: #ffffff !important;
  }
}

.v-application {
  background: #0f0f0f !important;
}

#home {
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%);
  min-height: 100vh;
  padding-top: 80px;
}

.v-footer,
footer {
  background: linear-gradient(135deg, #0f0f0f, #1a1a1a) !important;
  border-top: 1px solid #404040 !important;
  color: #e0e0e0 !important;
}

.v-main {
  background: transparent !important;
  padding-top: 24px !important;
}

.v-main__wrap {
  background: transparent !important;
  padding-top: 20px;
}

.v-banner {
  background: linear-gradient(45deg, #1a1a1a, #2d2d2d) !important;
  border: 1px solid #404040 !important;

  .v-icon {
    color: #ffffff !important;
  }
}

#home .notice ::v-deep p {
  margin: 0 !important;
  color: #e0e0e0 !important;
}

.bg-clip-text.text-transparent.bg-gradient-to-r {
  background: linear-gradient(135deg, #ffffff 0%, #cccccc 50%, #999999 100%) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}

.text-gray-600 {
  color: #b0b0b0 !important;
}

.bg-blue-50 {
  background: linear-gradient(145deg, #2d2d2d, #3a3a3a) !important;
  border: 2px solid #505050 !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;

  &:hover {
    background: linear-gradient(145deg, #3a3a3a, #4a4a4a) !important;
    border-color: #666666 !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
    transform: translateY(-2px);
  }
}

.text-blue-700 {
  color: #ffffff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.v-divider {
  background-color: #404040 !important;
  height: 2px !important;
}

.v-container {
  background: transparent;
}

// 修复轮播图高度对齐问题
.v-carousel {
  background: #1a1a1a !important;
  border: 1px solid #404040 !important;
  height: 376px !important; // 调整高度以匹配右侧卡片区域 (176px * 2 + 24px gap)

  .v-sheet {
    background: #2d2d2d !important;
  }

  .absolute.inset-x-0.bottom-0 {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6)) !important;
  }
}

.bg-gradient-to-br.from-blue-500.to-blue-600 {
  background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 50%, #0f0f0f 100%) !important;
  border: 1px solid #404040;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

  &:hover {
    background: linear-gradient(135deg, #3a3a3a 0%, #2d2d2d 50%, #1a1a1a 100%) !important;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6) !important;
    border-color: #555555;
  }
}

.bg-white {
  background: linear-gradient(145deg, #1a1a1a, #2d2d2d) !important;
  border: 1px solid #404040 !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
}

.v-dialog .v-card {
  background: linear-gradient(145deg, #1a1a1a, #2d2d2d) !important;
  border: 1px solid #404040 !important;

  .v-card-title {
    color: #ffffff !important;
    background: linear-gradient(90deg, #2d2d2d, #3a3a3a);
    border-bottom: 1px solid #404040;
  }

  .v-card-text {
    color: #e0e0e0 !important;
    background: #1a1a1a;
  }

  .v-card-actions {
    background: linear-gradient(90deg, #2d2d2d, #3a3a3a);
    border-top: 1px solid #404040;
  }
}

.v-btn {
  &.primary {
    background: linear-gradient(135deg, #404040, #2d2d2d) !important;
    color: #ffffff !important;
    border: 1px solid #555555;

    &:hover {
      background: linear-gradient(135deg, #555555, #404040) !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    }
  }

  &.fab {
    background: linear-gradient(135deg, #2d2d2d, #1a1a1a) !important;
    border: 2px solid #404040;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);

    &:hover {
      background: linear-gradient(135deg, #3a3a3a, #2d2d2d) !important;
      border-color: #555555;
      transform: translateY(-2px);
    }

    .v-icon {
      color: #ffffff !important;
    }
  }
}

.v-progress-linear {
  background-color: #404040 !important;

  .v-progress-linear__bar {
    background: linear-gradient(90deg, #666666, #888888) !important;
  }
}

.v-progress-circular {
  color: #666666 !important;
}

.v-tooltip .v-overlay__content {
  background: #2d2d2d !important;
  border: 1px solid #404040 !important;
  color: #ffffff !important;
}

.v-snackbar {
  .v-snack__wrapper {
    background: linear-gradient(135deg, #2d2d2d, #3a3a3a) !important;
    border: 1px solid #404040 !important;
    color: #ffffff !important;
  }
}

.v-overlay .v-dialog .v-card {
  background: linear-gradient(145deg, #1a1a1a, #2d2d2d) !important;
  border: 1px solid #404040 !important;

  .v-card-text {
    color: #ffffff !important;
  }
}

.v-img {
  background: #1a1a1a !important;
  border: 1px solid #404040;
  border-radius: 8px;
}

.bg-gray-100 {
  background: #1a1a1a !important;
}

.text-white {
  color: #ffffff !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

video {
  border: 2px solid #404040 !important;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5) !important;
}

.grid.grid-cols-1.xl\\:grid-cols-12 {
  margin-top: 2rem !important;
  padding-top: 1rem;
}

@media (max-width: 768px) {
  .grid {
    gap: 1rem !important;
  }

  .bg-gradient-to-br.from-blue-500.to-blue-600 {
    margin-bottom: 0.5rem;
  }

  #home {
    padding-top: 60px !important;
  }

  .v-main__wrap {
    padding-top: 15px !important;
  }
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.v-banner {
  margin-top: 1rem !important;
}

@keyframes bounce {

  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    transform: translate3d(0, -8px, 0);
  }

  70% {
    transform: translate3d(0, -4px, 0);
  }

  90% {
    transform: translate3d(0, -2px, 0);
  }
}

* {
  scrollbar-width: thin;
  scrollbar-color: #404040 #1a1a1a;
}

*::-webkit-scrollbar {
  width: 8px;
}

*::-webkit-scrollbar-track {
  background: #1a1a1a;
}

*::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 4px;

  &:hover {
    background: #555555;
  }
}

h1,
h2,
h3,
h4,
h5,
h6,
p,
span,
div {
  &:not(.text-white):not(.text-gray-600):not(.text-blue-700) {
    color: #e0e0e0 !important;
  }
}

.v-content,
.v-container,
.container {
  background: transparent !important;
}

.v-application__wrap {
  background: #0f0f0f !important;
}

body,
html {
  background: #0f0f0f !important;
}

.bg-white,
.bg-gray-50,
.bg-gray-100,
.bg-gray-200,
.v-sheet--color-white,
.theme--light {
  background: linear-gradient(145deg, #1a1a1a, #2d2d2d) !important;
  color: #e0e0e0 !important;
}

.v-text-field,
.v-select,
.v-textarea {
  .v-input__control {
    background: #2d2d2d !important;
    border: 1px solid #404040 !important;
  }

  .v-label {
    color: #b0b0b0 !important;
  }

  input,
  textarea {
    color: #ffffff !important;
  }
}
</style>
