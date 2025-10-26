<!-- <template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>LXC</h2>
      </el-col>
    </el-row>
    <el-divider />
    <instance-usage-chart :instancesRunningInfo=runningInfoMap />
  </div>
</template>

<script>
import auth from '@/plugins/auth';
import InstanceUsageChart from '@/components/InstanceUsageChart/instanceUsageChart.vue';
import { getRunningInfoList } from '@/api/lxc/lxcAdmin';
export default {
  name: "Index",
  components: {
    InstanceUsageChart // 👈 注册组件
  },
  data() {
    return {
      // 版本号
      version: "4.3.0",
      ws: undefined,
      runningInfoMap: {},
      trafficTotalLimit: undefined,
      //////////////////
      message: '',
      messages: [],
      socket: null
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
    this.getRunningInfoList();
    // setInterval(() => {
    //   this.getRunningInfoList();
    // }, 60000);
  },
  methods: {
    getRunningInfoList() {
      getRunningInfoList().then(res => {
        this.runningInfoMap = res.data;
        console.log("this.runningInfoMap:", this.runningInfoMap)
      })
    },
    goTarget(href) {
      window.open(href, "_blank");
    },
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
 -->




<template>
  <div class="app-container home">
    <!-- <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>LXC</h2>
      </el-col>
    </el-row>
    <el-divider /> -->
    <el-card shadow="always" class="main-card">
      <div slot="header" class="card-header">
        <span style="font-size: 22px; font-weight: bold; color: #1989fa;">容器状态监控</span>
        <el-button 
          icon="el-icon-refresh" 
          size="mini" 
          type="primary"
          class="refresh-btn"
          @click="fetchContainerStatus"
          :loading="loading"
        >
          <span v-if="!loading" class="refresh-text" style="">刷新</span>
          <span v-else-if="loading">刷新中</span>
        </el-button>
      </div>

      <!-- 加载状态 -->
      <!-- <div 
        v-loading="loading" 
        :loading-text="`正在获取容器状态...`"
        :loading-background="`rgba(255, 255, 255, 0.9)`"
        class="loading-container"
      > -->
        <!-- 无数据提示 -->
        <div v-if="!loading && Object.keys(instanceMap).length === 0" class="empty-tip">
          <el-empty 
          image="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
            description="暂无运行中的容器数据"
            class="empty-component">
          </el-empty>
        </div>

        <!-- 宿主机分组展示 -->
        <div v-else class="host-group" v-for="(containers, hostIp) in instanceMap" :key="hostIp">
          <el-collapse :value="[hostIp]" class="host-collapse">
            <el-collapse-item :title="`宿主机 IP: ${hostIp}`" :name="hostIp" class="host-collapse-item">
              <el-table 
           
                :data="containers" 
                border 
                style="width: 100%; margin-top: 15px"
                size="medium"
                class="container-table"
                highlight-current-row
              >
                <el-table-column prop="instancename" label="容器名称" width="180" ></el-table-column>
                <el-table-column label="CPU 使用率" width="220" >
                  <template slot-scope="scope">
                    <div class="progress-item">
                      <el-progress 
                        :text-inside="true"
                        :percentage="Number(Number(scope.row.cpuUsage * 100).toFixed(2))"
                        :stroke-width="12" 
                        border
                        :status="getProgressStatus(Number(scope.row.cpuUsage * 100))"
                        class="progress-bar"
                      ></el-progress>
                      <span class="progress-value">
                        {{ (scope.row.cpuUsage * 100).toFixed(2) }}%
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="内存使用" width="280">
                  <template slot-scope="scope">
                    <div class="progress-item">
                      <el-progress 
                        :text-inside="true"  
                        :percentage="Number(getUsagePercent(scope.row.memory, scope.row.memLimit))" 
                        :stroke-width="12" 
                        border
                        :status="getProgressStatus(Number(getUsagePercent(scope.row.memory, scope.row.memLimit)))"
                        class="progress-bar"
                      ></el-progress>
                      <span class="progress-value">
                        {{ formatBytes(scope.row.memory) }} / {{ formatBytes(scope.row.memLimit) }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="磁盘使用" width="280">
                  <template slot-scope="scope">
                    <div class="progress-item">
                      <el-progress 
                        :text-inside="true"
                        :percentage="Number(getUsagePercent(scope.row.disk, scope.row.diskLimit))" 
                        :stroke-width="12" 
                        border
                        :status="getProgressStatus(Number(getUsagePercent(scope.row.disk, scope.row.diskLimit)))"
                        class="progress-bar"
                      ></el-progress>
                      <span class="progress-value">
                        {{ formatBytes(scope.row.disk) }} / {{ formatBytes(scope.row.diskLimit) }}
                      </span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
      <!-- </div> -->
    </el-card>
  </div>
</template>


<script>
// import axios from 'axios';
import auth from '@/plugins/auth';
import { getRunningInfoList } from '@/api/lxc/lxcAdmin';
export default {
  data() {
    return {
      loading: false,
      instanceMap: {}, // 存储 {hostIp: [containerList]} 结构
      refreshTimer: null
    }
  },
  created() {
    this.fetchContainerStatus()
    // 定时刷新（每60秒）
    this.refreshTimer = setInterval(() => {
      this.fetchContainerStatus()
    }, 60000)
  },
  beforeDestroy() {
    clearInterval(this.refreshTimer)
  },
  methods: {
    // 获取容器状态数据
    async fetchContainerStatus() {
      this.loading = true
      try {
        const res = await getRunningInfoList();  // 改用await语法更清晰
        if (res.code === 200) {
          this.instanceMap = res.data;
          console.log("this.instanceMap:", this.instanceMap);
        } else {
          this.$message.error('获取容器状态失败：' + res.msg);
        }
      } catch (err) {
        this.$message.error('接口请求失败：' + err.message)
      } finally {
        this.loading = false;
      }
    },

    // 计算使用率百分比（使用量/限制量）
    getUsagePercent(used, limit) {
      if (!used || !limit || limit === 0) return 0
      return Math.min(Math.round((used / limit) * 100), 100) // 限制最大100%
    },

    // 根据百分比获取进度条状态
    getProgressStatus(percent) {
      if (percent > 80) return 'warning'
      if (percent > 90) return 'exception'
      return 'success'
    },

    // 字节单位转换（B -> KB/MB/GB）
    formatBytes(bytes) {
      if (!bytes || bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
  }
}
</script>


<style scoped lang="scss">
/* 卡片头部布局：标题与按钮横向紧凑排列 */
.card-header {
  // 保持头部整体左对齐
  text-align: left;
  padding: 12px 20px; /* 调整内边距，避免边缘拥挤 */
}

/* 标题与刷新按钮的容器 */
.title-with-refresh {
  display: inline-flex; /* 横向紧凑排列 */
  align-items: center; /* 垂直居中对齐 */
  gap: 10px; /* 标题与按钮之间的间距 */
}

/* 刷新按钮样式：紧凑、轻量，贴近标题 */
.refresh-btn {
  color: #1989fa;
  background: transparent;
  border: none;
  padding: 4px;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  transition: all 0.2s ease;

  // 新增：禁用状态样式（视觉提示）
  &:disabled {
    // opacity: 0.6;  // 降低透明度
    cursor: not-allowed;  // 鼠标样式改为"禁止"
    transform: none !important;  // 禁用悬停/点击的变换效果
  }
  &:hover {
    color: #0066cc;
    background: #e6f7ff;
    transform: scale(1.1);
  }
  &:active {
    transform: scale(1);
  }
  &.is-loading .el-icon-loading {
    animation: rotate 1.5s linear infinite;
  }
}

/* 旋转动画 */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 其他原有样式保持不变 */
.home {
  padding: 20px;
}

.main-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
}

.loading-container {
  min-height: 400px;
  padding: 20px;
}

.empty-tip {
  padding: 80px 0;
  text-align: center;
  .empty-component {
    width: 300px;
    margin: 0 auto;
    .el-empty__description {
      font-size: 16px;
      color: #606266;
      margin-top: 20px;
    }
  }
}

.host-group {
  margin-bottom: 25px;
  &:last-child {
    margin-bottom: 0;
  }
}

.host-collapse {
  .el-collapse-item__header {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    height: 50px;
    line-height: 50px;
    background-color: #f0f7ff;
    border-radius: 8px 8px 0 0;
    &:hover {
      background-color: #e6f0ff;
      color: #1989fa;
    }
  }
  .el-collapse-item__content {
    padding: 15px;
    background-color: #fafafa;
    border: 1px solid #ebeef5;
    border-top: none;
    border-radius: 0 0 8px 8px;
  }
}

.container-table {
  .el-table__header-wrapper {
    .el-table__header {
      th {
        font-size: 14px;
        font-weight: bold;
        color: #2d3748;
        background-color: #f8f9fa;
        height: 45px;
      }
    }
  }
  .el-table__body-wrapper {
    .el-table__row {
      height: 60px;
      td {
        font-size: 14px;
        color: #4a5568;
        vertical-align: middle;
      }
      &:hover {
        background-color: #f0f8fb !important;
      }
    }
    .el-table__current-row {
      background-color: #e8f4f8 !important;
    }
  }
}

.progress-item {
  position: relative;
  padding-right: 110px;
  height: 40px;
  display: flex;
  align-items: center;
}

.progress-bar {
  flex: 1;
  .el-progress__bar {
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.1); 
  }
  &.el-progress--success .el-progress__bar {
    background-color: #48bb78;
  }
  &.el-progress--warning .el-progress__bar {
    background-color: #ed8936;
  }
  &.el-progress--error .el-progress__bar {
    background-color: #e53e3e;
  }
}

.progress-value {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: bold;
  color: #2d3748;
  min-width: 90px;
  text-align: right;
}
</style>