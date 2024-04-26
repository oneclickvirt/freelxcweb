<template>
  <v-app>
    <div class="ssh-container w-full" :class="type === 'super' ? '' : 'max-h-screen'" :style="type === 'super' ? 'height: 88%;' : 'height: 100%;'" ref="terminal"></div>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{
            reTry !== 0 ? `密码错误${reTry}次，请重试` : "请输入主机密码"
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="formValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field label="Password*" type="password" v-model="form.passwd" :rules="[(v) => !!v || '密码不能为空']" required></v-text-field>
                </v-col>
              </v-row>
            </v-form>
            <small>默认密码已更改，无法自动连接，请输入密码</small>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeWindow"> 退出 </v-btn>
          <v-btn color="blue darken-1" text @click="subPasswd"> 连接 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { Terminal } from "xterm"; // 初始化组件
import { AttachAddon } from "xterm-addon-attach"; // 给终端窗口绑定功能
import { FitAddon } from "xterm-addon-fit"; // 窗口自适应
import "xterm/css/xterm.css";
import { debounce } from "lodash";
import { getToken } from "@/utils/auth";

const packStdin = (data) =>
  JSON.stringify({
    Op: "stdin",
    Data: data,
  });

const packResize = (cols, rows, height, width) =>
  JSON.stringify({
    op: "resize",
    cols: cols,
    rows: rows,
    height: height,
    width: width,
  });
export default {
  name: "Terminal",
  meta: {
    title: "Terminal",
  },
  data() {
    return {
      lxc: "",
      dialog: false,
      formValid: false,
      type: "lxc",
      reTry: 0,
      form: {
        passwd: "",
      },
      inited: false,
      initText: "",
      first: true,
      term: null,
      fitAddon: null,
      ws: null,
      //socketUrl: "/terminal",
      socketUrl: "/web/terminal",
      option: {
        lineHeight: 1.0,
        fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
        // cursorStyle: "block", // 光标样式 'block' | 'underline' | 'bar'
        // fontSize: 18,
        // fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
        // theme: {
        //   background: "#181d28",
        // },
        cols: 130, // 初始化的时候不要设置fit，设置col为较小值（最小为可展示initText初始文字即可）方便屏幕缩放
        rows: 40,
        rendererType: "canvas", //渲染类型
        convertEol: true, //启用时，光标将设置为下一行的开头
        //   scrollback: 50, //终端中的回滚量
        disableStdin: true, //是否应禁用输入。
        cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        useStyle: true, //是否应使用样式
        screenKeys: true, //是否应启用屏幕键
        theme: {
          // foreground: "#7e9192", //字体
          // background: "#002833", //背景色
          background: "#181d28",
          cursor: "help", //设置光标
        },
      },
    };
  },
  mounted() { },
  beforeDestroy() {
    if (this.type === "lxc") {
      document.querySelector("body").style.backgroundColor = "";
    }
    this.removeResizeListener();
    this.ws && this.ws.close();
    this.term && this.term.dispose();
  },
  //创建前设置
  created() {
    let type = this.$route.query && this.$route.query.type;
    let loc = window.location;
    let url = loc.host + this.socketUrl;
    this.socketUrl = /https/.test(loc.protocol)
      ? "wss://" + url
      : "ws://" + url;
    if (type) {
      this.type = type;
      this.socketUrl =
        this.socketUrl + "/super/" + this.$route.query.lxcId + "/" + getToken();
      this.initText = `连接${this.$route.query.ip}中...\r\n`;
      this.$route.meta.title = `${this.$route.query.ip}`;
    } else {
      if (localStorage.getItem("lxc")) {
        let lxc = localStorage.getItem("lxc");
        lxc = JSON.parse(lxc);
        this.lxc = lxc;
        document.title = `${lxc.childName}@${lxc.ip}:${lxc.sshPort}`;
        localStorage.clear();
      }
      const lxcId = this.lxc.lxcId;
      if (!lxcId) {
        this.$message.error("请从我的小鸡中发起连接");
        setTimeout(() => {
          this.closeWindow();
        }, 3000);
        return;
      }
      this.socketUrl = this.socketUrl + "/lxc/" + lxcId + "/" + getToken();
      this.initText = `连接${this.lxc.childName}中...\r\n`;
    }
    if (this.type === "lxc") {
      document.querySelector("body").style.backgroundColor = "#181d28";
    }
    this.initSocket();
  },
  methods: {
    isWsOpen() {
      return this.ws && this.ws.readyState === 1;
    },
    initTerm() {
      this.term = new Terminal(this.option);

      this.fitAddon = new FitAddon();
      this.term.loadAddon(this.fitAddon);
      this.term.open(this.$refs.terminal);

      // 换行并输入起始符“$”
      this.term.prompt = () => {
        this.term.write("\r\n" + this.initText);
      };
      this.term.prompt();
    },
    // resize 相关
    resizeRemoteTerminal() {
      if (this.inited) {
        console.log("屏幕宽度:", document.documentElement.clientWidth);
        console.log("屏幕高度:", document.documentElement.clientHeight);
        const { cols, rows } = this.term;
        console.log("列数、行数：", cols, rows);
        // 调整后端终端大小 使后端与前端终端大小一致
        this.isWsOpen() &&
          this.ws.send(
            packResize(
              cols,
              rows,
              document.documentElement.clientHeight,
              document.documentElement.clientWidth
            )
          );
      }
    },
    onResize: debounce(function () {
      this.fitAddon.fit();
    }, 100),
    onTerminalResize() {
      window.addEventListener("resize", this.onResize, { passive: false });
      this.term.onResize(this.resizeRemoteTerminal);
    },
    removeResizeListener() {
      window.removeEventListener("resize", this.onResize);
    },
    // socket
    initSocket() {
      this.ws = new WebSocket(this.socketUrl);
      this.onOpenSocket();
      this.onCloseSocket();
      this.onErrorSocket();
      this.onMessageSocket();
    },
    // 打开连接
    onOpenSocket() {
      this.ws.onopen = () => {
        console.log("websocket 已连接");
        // 第一次连接成功将 initText 清空
        this.initTerm();
      };
    },
    // 关闭连接
    onCloseSocket() {
      const _this = this;
      this.ws.onclose = (res) => {
        // console.log("关闭连接");
        // _this.term.write("websoket连接失败，请刷新！\r\n");
        // _this.$message.error("websoket连接失败，请刷新！");
        // setTimeout(() => {
        //   this.initSocket();
        // }, 3000);
        if (_this.inited) {
          try {
            _this.term.options.disableStdin = true;
          } catch (error) { }
          _this.term.write("\r\n\x1b[31m连接已断开\x1b[0m");
          _this.$alert("连接超时或会话已结束！", "提示", {
            type: "warning",
          }).then(() => {
            this.closeWindow();
          }).catch(() => { });
        } else if (res.reason === 'exception') {
          _this.term.write("\r\n\x1b[31m连接异常\x1b[0m");
          _this.$alert("连接异常！", "提示", {
            type: "error",
          }).then(() => {
            this.closeWindow();
          }).catch(() => { });
        }

      };
    },
    // 连接错误
    onErrorSocket() {
      const _this = this;
      this.ws.onerror = () => {
        this.closeWS();
        _this
          .$alert("连接异常，请反馈给站长！", "提示", {
            type: "error",
          })
          .then(() => {
            this.closeWindow();
          })
          .catch(() => { });
        //
      };
    },
    // 接收消息
    onMessageSocket() {
      const _this = this;
      this.ws.onmessage = (res) => {
        // console.log("收到：", res.data);
        if (!_this.inited) {
          if (res.data === "success") {
            _this.inited = true;
            this.onTerminalResize();
            _this.resizeRemoteTerminal();
            _this.form.passwd = "";
            _this.term.reset();
            const attachAddon = new AttachAddon(_this.ws);
            _this.term.loadAddon(attachAddon);
            _this.term.options.disableStdin = false;
            _this.term.element && _this.term.focus();
            setTimeout(() => {
              _this.fitAddon.fit();
              _this.term.element && _this.term.focus();
            }, 200);
          } else if (res.data === "JSchException: Auth fail") {
            this.term.reset();
            // 输出红色字体
            this.term.write("\r\n\x1b[31mAuth fail\x1b[0m");
            if (_this.reTry >= 3) {
              this.term.write("\r\n\x1b[31m密码错误次数过多\x1b[0m");
              this.closeWS();
              _this
                .$alert("密码错误次数过多，好好想想吧！", "提示", {
                  type: "error",
                })
                .then(() => {
                  this.closeWindow();
                })
                .catch(() => { });
            } else {
              _this.dialog = true;
            }
          }
        }
      };
    },
    closeWindow() {
      if (this.type === "lxc") {
        var userAgent = navigator.userAgent;
        if (
          userAgent.indexOf("Firefox") != -1 ||
          userAgent.indexOf("Chrome") != -1
        ) {
          window.close();
          setTimeout(function () {
            window.location.href = "about:blank";
          }, 100);
        } else {
          window.opener = null;
          window.open("about:blank", "_self");
          window.close();
        }
      } else {
        const obj = { path: this.$route.query.cPath };
        this.$tab.closeOpenPage(obj);
      }
    },
    closeWS() {
      this.ws.onclose = () => { };
      this.isWsOpen() && this.ws.close();
    },
    subPasswd() {
      if (this.$refs.form.validate()) {
        if (this.passwd === "") {
          this.$message.error("请输入密码");
          return;
        }
        this.reTry = this.reTry + 1;
        this.term.reset();
        this.term.write("重连中...");
        let data = {
          passwd: this.form.passwd,
        };
        this.ws.send(JSON.stringify(data));
        this.dialog = false;
      }
    },
  },
};
//
</script>
<style lang="scss" scoped>
.ssh-container {
  // overflow: hidden;
  border-radius: 0;
  background: #181d28;
  padding: 0;
  margin: 0;

  .xterm-scroll-area::-webkit-scrollbar-thumb {
    background-color: #b7c4d1;
    /* 滚动条的背景颜色 */
  }
}
</style>
