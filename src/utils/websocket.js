export default class ContainerWebSocket {
  constructor(containerId, onMessage) {
    // this.containerId = containerId; // 容器ID
    this.onMessage = onMessage; // 消息回调函数
    this.ws = null; // WebSocket实例
    this.reconnectTimer = null; // 重连计时器
    this.connect(); // 初始化连接
  }

  // 建立连接
  connect() {
    // 开发环境：ws://localhost:8080；生产环境：wss://域名（HTTPS对应wss）
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    this.ws = new WebSocket(`${protocol}//${host}/ws/containersRunningInfo`);

    // 连接成功
    this.ws.onopen = () => {
      console.log(`WebSocket连接成功`);
      clearTimeout(this.reconnectTimer); // 清除重连计时器
    };

    // 接收消息
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // 解析JSON消息
        this.onMessage(data); // 调用外部回调处理消息
      } catch (e) {
        console.error('WebSocket消息解析失败：', e);
      }
    };

    // 连接关闭
    this.ws.onclose = (event) => {
      console.log(`WebSocket连接关闭，状态码：${event.code}`);
      this.reconnect(); // 自动重连
    };

    // 连接错误
    this.ws.onerror = (error) => {
      console.error(`WebSocket错误：`, error);
      this.ws.close(); // 出错时主动关闭，触发重连
    };
  }

  // 发送消息给服务器
  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket未连接，无法发送消息');
    }
  }

  // 自动重连
  reconnect() {
    if (this.reconnectTimer) return;
    // 3秒后重连（可设置指数退避策略，如3s→6s→12s）
    this.reconnectTimer = setTimeout(() => {
      console.log(`尝试重连WebSocket`);
      this.connect();
    }, 3000);
  }

  // 关闭连接（组件销毁时调用）
  close() {
    if (this.ws) {
      this.ws.close(1000, '主动关闭连接'); // 1000表示正常关闭
    }
    clearTimeout(this.reconnectTimer);
  }
}