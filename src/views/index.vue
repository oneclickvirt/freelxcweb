<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>LXC</h2>
      </el-col>

      <!-- <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>SpringBoot</li>
              <li>Sa-Token</li>
              <li>JWT</li>
              <li>MyBatis</li>
              <li>Druid</li>
              <li>Jackson</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Vuex</li>
              <li>Element-ui</li>
              <li>Axios</li>
              <li>Sass</li>
              <li>Quill</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col> -->
    </el-row>
    <el-divider />
    <instance-usage-chart :instance="{
      instancename: 'JpChick4',
      cpu: 2.53310894E11,
      memory: 1.83390208E8,
      disk: 2.22793728E8,
      recv: 1.1147512E7,
      send: 382685.0,
      limits: {
        cpu: 4e11,
        memory: 4e8,
        disk: 5e8,
        network: 2e7
      }
    }" />
  </div>
</template>

<script>
import auth from '@/plugins/auth';
import InstanceUsageChart from '@/components/InstanceUsageChart/instanceUsageChart.vue';
export default {
  name: "Index",
  components: {
    InstanceUsageChart // 👈 注册组件
  },
  data() {
    return {
      // 版本号
      version: "4.3.0",
      ws: undefined
    };
  },
  mounted() {
    try {
      if (!auth.hasRoleOr(['admin'])) {
        this.$router.replace({
          path: '/home'
        })
      }
    } catch (error) {
      this.$router.replace({
        path: '/home'
      })
    }
    this.connectWebSocket();
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    // 连接 WebSocket
    connectWebSocket() {
      const socketUrl = "ws://localhost:1024/ws/container-data";
      this.ws = new WebSocket(socketUrl);

      this.ws.onopen = () => {
        console.log("WebSocket 连接成功");
      };

      this.ws.onmessage = (event) => {
        console.log("onMessage:",event.data);
        // 假设返回的数据格式是 JSON
        // const data = JSON.parse(event.data);
        // this.cpu = data.cpu;
        // this.memory = data.memory;
        // this.disk = data.disk;
        // this.sent = data.sent;
        // this.recv = data.recv;

        // // 根据数据更新图表或其他 UI 元素
        // this.updateChart(data);
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket 出错:", error);
      };

      this.ws.onclose = () => {
        console.log("WebSocket 连接关闭");
      };
    },

    // 更新图表
    updateChart(data) {
      // 在这里调用你图表组件更新数据
      console.log("更新图表数据", data);
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

