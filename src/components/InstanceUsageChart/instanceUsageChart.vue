<template>
  <div class="container-info">
    <div v-for="(containers, ip) in instancesRunningInfo" :key="ip" class="ip-group">
      <h3>IP: {{ ip }}</h3>
      <div v-for="container in containers" :key="container.instancename" class="container-info-item">
        <p>instancename: {{ container.instancename }}</p>
        <p>cpu: {{ container.cpuUsage }}</p>
        <p>memory: {{ container.memory }}</p>
        <p>disk: {{ container.disk }}</p>
        <el-card :header="`实例: ${container.instancename}`">
          <div class="progress-container">
            <el-progress
              v-for="(value, resource) in container.resources"
              :key="resource"
              :percentage="(value.used / value.total) * 100"
              :stroke-width="18"
              :text-inside="true"
              :show-text="true"
              :color="getProgressColor(resource)"
              :format="getProgressText(resource, value.used, value.total)"
            >
            </el-progress>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InstanceUsageChart',
  props: {
    instancesRunningInfo: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 根据资源类型动态返回进度条颜色
    getProgressColor(resource) {
      switch (resource) {
        case 'cpu':
          return '#67C23A'; // Green
        case 'memory':
          return '#E6A23C'; // Orange
        case 'disk':
          return '#F56C6C'; // Red
        default:
          return '#409EFF'; // Blue
      }
    },
    // 格式化进度条上的显示文本
    getProgressText(resource, used, total) {
      return `${resource.toUpperCase()}: ${this.formatBytes(used)} / ${this.formatBytes(total)} (${((used / total) * 100).toFixed(1)}%)`;
    },
    // 字节转化为适合展示的格式
    formatBytes(bytes) {
      if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + ' GB';
      if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(2) + ' MB';
      if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
      return bytes + ' B';
    }
  }
};
</script>

<style scoped>
.container-info {
  display: flex;
  flex-direction: column;
  margin: 20px;
}

.ip-group {
  margin-bottom: 40px;
}

.container-info-item {
  margin-bottom: 20px;
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>





<!-- <template>
  <div class="chart-wrapper">
    <el-card :header="`实例资源使用 - ${instance.instancename}`">
      <div class="chart-container">
        <div ref="barChart" class="chart-bar"></div>
        <div ref="pieChart" class="chart-pie"></div>
      </div>
    </el-card>
  </div>
</template>

<script>


export default {
  name: 'InstanceUsageChart',
  props: {
    instance: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.renderCharts();
      window.addEventListener('resize', this.resizeCharts);
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts);
  },
  methods: {
    formatBytes(bytes) {
      if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + ' GB';
      if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(2) + ' MB';
      if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
      return bytes + ' B';
    },
    resizeCharts() {
      this.barChart && this.barChart.resize();
      this.pieChart && this.pieChart.resize();
    },
    renderCharts() {
      const used = this.instance;
      const limits = used.limits || {
        cpu: 4e11,
        memory: 4e8,
        disk: 5e8,
        network: 1e7
      };

      const barData = [
        { name: 'CPU', value: used.cpu, total: limits.cpu },
        { name: '内存', value: used.memory, total: limits.memory },
        { name: '磁盘', value: used.disk, total: limits.disk }
      ];

      const trafficUsed = used.recv + used.send;
      const trafficFree = Math.max(0, limits.network - trafficUsed);

      // === 柱形图配置 ===
      // this.barChart = echarts.init(this.$refs.barChart);
      // 通过全局引入的方式，初始化图表时需要使用 window.echarts.init()
      this.barChart = window.echarts.init(this.$refs.barChart);
      this.barChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: params => {
            const item = params[0].data;
            return `${item.name}<br>已用: ${this.formatBytes(item.rawValue)} / 总量: ${this.formatBytes(item.total)} (${((item.rawValue / item.total) * 100).toFixed(2)}%)`;
          }
        },
        grid: { left: 40, right: 20 },
        xAxis: {
          type: 'value',
          max: 1,
          axisLabel: {
            formatter: val => `${(val * 100).toFixed(0)}%`
          }
        },
        yAxis: {
          type: 'category',
          data: barData.map(item => item.name)
        },
        series: [
          {
            type: 'bar',
            barWidth: 10,
            data: barData.map(item => ({
              name: item.name,
              value: item.value / item.total,
              rawValue: item.value,
              total: item.total
            })),
            label: {
              show: true,
              position: 'right',
              formatter: p => `${(p.value * 100).toFixed(1)}%`
            },
            itemStyle: {
              color: '#67C23A'
            }
          }
        ]
      });

      const usedPercent = ((trafficUsed / (trafficUsed + trafficFree)) * 100).toFixed(1);
      // this.pieChart = echarts.init(this.$refs.pieChart);
      // 通过全局引入的方式，初始化图表时需要使用 window.echarts.init()
      this.pieChart = window.echarts.init(this.$refs.pieChart);

      this.pieChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: ({ name, value, percent }) => {
            if (name === '已用流量') {
              return `${name}<br>已用: ${this.formatBytes(value)} (${percent}%)`;
            } else {
              return `${name}<br>剩余: ${this.formatBytes(value)} (${percent}%)`;
            }
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['已用流量', '剩余流量']
        },
        series: [
          {
            name: '流量使用',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'center',
              formatter: `已用 ${usedPercent}% / 100%`,
              fontSize: 12,
              color: '#333'
            },
            // 👇 注释掉这段 emphasis，防止悬停时改变中心文字
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: 16,
            //     fontWeight: 'bold',
            //     formatter: p => `已用:\n${this.formatBytes(p.value)}`
            //   }
            // },
            labelLine: {
              show: false
            },
            data: [
              { value: trafficUsed, name: '已用流量' },
              { value: trafficFree, name: '剩余流量' }
            ]
          }
        ]
      });
    }
  }
};
</script>

<style scoped>
.chart-wrapper {
  margin: 20px;
}
.chart-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.chart-bar {
  flex: 1;
  min-width: 150px;
  height: 200px;
}
.chart-pie {
  flex: 1;
  min-width: 150px;
  height: 200px;
}
</style> -->
