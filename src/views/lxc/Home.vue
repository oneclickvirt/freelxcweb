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
              spiritlhl的免费LXC申请网站
            </span>
          </h1>
          <p class="text-xl text-gray-600">你可以在这里申请到你想要的小鸡</p>
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
#home .notice ::v-deep p {
  margin: 0 !important;
}
</style>
