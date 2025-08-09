<template>
  <!-- class="bg-gray-50" -->
  <div id="home" >
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
          <p class="text-xl text-gray-600">你可以在这里申请到免费的容器</p>
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

<style lang="scss" scoped>
//#home .notice ::v-deep p {
//  margin: 0 !important;
//}

// 主容器背景
#home {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
  min-height: 100vh;
  color: #e0e0e0 !important;

  // 公告样式
  .notice ::v-deep p {
    margin: 0 !important;
    color: #e0e0e0 !important;
    line-height: 1.6;
  }
}

// 横幅样式
.v-banner {
  background: rgba(40, 40, 40, 0.95) !important;
  // backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
  margin-bottom: 2rem;

  .v-icon {
    color: #cccccc !important;
    filter: drop-shadow(0 0 8px rgba(204, 204, 204, 0.3));
  }

  .notice {
    color: #e0e0e0 !important;

    ::v-deep * {
      color: #e0e0e0 !important;
    }
  }
}

// 网格容器
.grid {
  &.max-w-7xl {
    background: rgba(20, 20, 20, 0.3);
    // backdrop-filter: blur(5px);
    border-radius: 24px;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
}

// 视频样式
video {
  border-radius: 20px !important;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1) !important;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.15) !important;
  }
}

// 主标题样式
h1 {
  .bg-clip-text {
    background: linear-gradient(135deg, #ffffff, #cccccc, #999999) !important;
    background-clip: text !important;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
    font-weight: 800 !important;
    letter-spacing: -0.02em;
    text-shadow: 0 4px 16px rgba(255, 255, 255, 0.1);
  }
}

// 副标题
p.text-xl {
  color: #b0b0b0 !important;
  font-weight: 500;
  opacity: 0.9;
}

// 特色标签卡片
.bg-blue-50 {
  background: rgba(50, 50, 50, 0.8) !important;
  // backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.15) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
  }

  p {
    color: #ffffff !important;
    font-weight: 600 !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

// 按钮样式
.v-btn {
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.v-btn--fab {
    background: linear-gradient(135deg, #4a4a4a, #333333) !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1) !important;

    &:hover {
      transform: translateY(-4px) scale(1.1);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.15) !important;
    }

    .v-icon {
      color: #ffffff !important;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }
  }

  &.v-btn--text {
    color: #b0b0b0 !important;

    &:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      color: #e0e0e0 !important;
    }
  }
}

// 动画效果
.animate-bounce {
  animation: modernBounce 2s infinite;
}

@keyframes modernBounce {

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

// 分隔线
.v-divider {
  border-color: rgba(255, 255, 255, 0.12) !important;
  opacity: 0.6;
}

// 容器样式
.v-container {
  background: transparent;
}

// 轮播图样式
.v-carousel {
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5) !important;
  }

  .v-sheet {
    background: linear-gradient(135deg, #333333, #4a4a4a) !important;

    .v-icon {
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    }
  }

  .absolute {
    background: rgba(0, 0, 0, 0.8) !important;
    // backdrop-filter: blur(8px);

    p {
      color: #ffffff !important;
      font-weight: 600;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
  }
}

// 功能卡片
.bg-gradient-to-br {
  background: linear-gradient(135deg, #4a4a4a, #333333) !important;
  border-radius: 20px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.15) !important;

    &::before {
      opacity: 1;
    }
  }

  .icon-park {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
    transition: all 0.3s ease;
  }

  &:hover .icon-park {
    transform: scale(1.1);
  }

  p {
    color: #ffffff !important;
    font-weight: 700 !important;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    position: relative;
    z-index: 2;
  }
}

// 图表容器
#bar_chart,
#bar_chart_used {
  background: rgba(40, 40, 40, 0.95) !important;
  // backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 20px !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3) !important;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4) !important;
  }
}

// 对话框样式
.v-dialog {
  .v-card {
    background: rgba(30, 30, 30, 0.98) !important;
    // backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    border-radius: 20px !important;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5) !important;

    .v-card-title {
      color: #ffffff !important;
      font-weight: 600;
      background: rgba(20, 20, 20, 0.8);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px 20px 0 0;
    }

    .v-card-text {
      color: #e0e0e0 !important;

      &.notice {
        ::v-deep * {
          color: #e0e0e0 !important;
        }
      }

      &.cursor-pointer {
        background: rgba(50, 50, 50, 0.8);
        border-radius: 8px;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(60, 60, 60, 0.9);
          color: #ffffff !important;
        }
      }
    }

    .v-img {
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
}

// 对话框中的图片背景
.v-img.bg-gray-100 {
  background: rgba(40, 40, 40, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

// 覆盖层样式
.v-overlay {
  // backdrop-filter: blur(8px);
  // background: rgba(0, 0, 0, 0.8) !important;

  .v-card {
    background: rgba(40, 40, 40, 0.95) !important;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .v-card-text {
      color: #e0e0e0 !important;
    }

    .v-progress-linear {
      border-radius: 4px;
      .v-progress-linear__background {
        background: rgba(255, 255, 255, 0.1) !important;
      }
    }
  }
}

// 通知条样式
.v-snackbar {
  .v-snack__wrapper {
    background: rgba(40, 40, 40, 0.95) !important;
    // backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px !important;
    // color: #e0e0e0 !important;
    color: #e0e0e0 !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
}

// 工具提示
.v-tooltip__content {
  background: rgba(40, 40, 40, 0.95) !important;
  // backdrop-filter: blur(8px);
  color: #e0e0e0 !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

// 进度指示器
.v-progress-circular {
  color: #ffffff !important;
}

// 响应式优化
@media (max-width: 1200px) {
  .grid.max-w-7xl {
    padding: 1.5rem;
  }

  video {
    border-radius: 16px !important;
  }
}

@media (max-width: 768px) {
  .grid.max-w-7xl {
    padding: 1rem;
    border-radius: 16px;
  }

  h1 .bg-clip-text {
    font-size: 2rem !important;
  }

  .bg-gradient-to-br {
    height: 140px !important;

    .icon-park {
      width: 50px !important;
      height: 50px !important;
    }

    p {
      font-size: 1rem !important;
    }
  }
}

// 滚动条样式
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

// 文本选择样式
::selection {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

// 特殊动画效果
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }

  100% {
    background-position: 1000px 0;
  }
}

.bg-gradient-to-br:hover {
  background-image: linear-gradient(135deg, #4a4a4a, #333333, #4a4a4a);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

#neon {
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

  // 应用栏样式 - 从蓝色改为深色
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
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        transform: translateX(8px);
      }

      &.v-list-item--active {
        background: rgba(255, 255, 255, 0.15) !important;
        color: #ffffff !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .v-list-item-title {
        color: inherit !important;
        font-weight: 500;
      }

      .v-list-item-subtitle {
        color: #b0b0b0 !important;
      }
    }

    .v-list-group__header {
      color: #e0e0e0 !important;
      border-radius: 12px !important;
      margin: 4px 8px;

      &:hover {
        background: rgba(255, 255, 255, 0.1) !important;
      }

      .v-list-item-title {
        color: inherit !important;
        font-weight: 600;
      }
    }

    .v-list-group__items {
      .v-list-item {
        margin-left: 16px;
        border-radius: 8px !important;
      }
    }
  }
}
</style>
