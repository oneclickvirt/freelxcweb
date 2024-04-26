<!--
 * @Descripttion: ip 组件
 * @version: 1.0
 * @Author: hanjg
 * @Date: 2020-07-29 19:32:01
 * @LastEditors: hanjg
 * @LastEditTime: 2020-07-30 17:53:24
 -->
 <template>
    <div class="ipDiv" @paste="pasting" :key="refreshTime">
      <el-input ref="ipv1" @focus="focusInput('ipv2')" v-model="ipv1" class="ip-el-input"></el-input>
      <div  class="ipDiv-dot">.</div>
      <el-input ref="ipv2" @focus="focusInput('ipv3')" v-model="ipv2" class="ip-el-input"></el-input>
      <div class="ipDiv-dot">.</div>
      <el-input ref="ipv3"  @focus="focusInput('ipv4')" v-model="ipv3" class="ip-el-input"></el-input>
      <div class="ipDiv-dot">.</div>
      <el-input ref="ipv4" v-model="ipv4" class="ip-el-input" @blur="check=null"></el-input>
      <i class="el-icon-document-copy" v-clipboard:copy="ipInfo.ip" v-clipboard:success="onCopy" v-clipboard:error="onError"></i>
    </div>
  </template>
  <script>
  export default {
    data () {
      return {
        ipv1: null,
        ipv2: null,
        ipv3: null,
        ipv4: null,
        check: null,
        ipInfo: {
          flag: false,
          ip: null
        },
        ipInfo1: {
          flag: false,
          ip: null
        },
        refreshTime: null
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.initEvent()
        this.initIpconponent()
      },
      onCopy () {
        this.$message({
          message: '复制成功',
          type: 'success',
          duration: 1000
        })
      },
      onError () {
        this.$message({
          message: '复制失败',
          type: 'error',
          duration: 1000
        })
      },
      pasting (e) {
        console.log('pasting-e:', e)
        console.log('value:', e.clipboardData.getData('text/plain'))
        let tempIp = e.clipboardData.getData('text/plain')
        console.log('tempIpArr:', tempIp.split('.'))
        let tempIpArr = tempIp.split('.')
        this.ipv1 = tempIpArr[0] || null
        this.ipv2 = tempIpArr[1] || null
        this.ipv3 = tempIpArr[2] || null
        this.ipv4 = tempIpArr[3] || null
        this.refreshTime= new Date().getTime()
      },
      initIpconponent () {
        console.log('ip 组件初始化')
        this.ipv1 = this.configIp.split('.')[0] || null
        this.ipv2 = this.configIp.split('.')[1] || null
        this.ipv3 = this.configIp.split('.')[2] || null
        this.ipv4 = this.configIp.split('.')[3] || null
        this.ipInfo = this.ipInfo1
        if (this.autoFocus) {
          this.$refs.ipv1.focus()
        }
      },
      // 返回ip信息
      returnIpInfo () {
        if (this.ipv1 === null || this.ipv2 === null || this.ipv3 === null || this.ipv4 === null) {
          this.ipInfo.flag = false
        } else {
          this.ipInfo.flag = true
        }
        this.ipInfo.ip = this.ipv1 + '.'  + this.ipv2 + '.' + this.ipv3 + '.' + this.ipv4
        this.$emit('getIp', this.ipInfo)
      },
      // 当前聚焦输入框,预先聚焦下一个输入框
      focusInput (flag) {
        this.check = flag
      },
      // 初始化键盘事件,监听enter按下事件
      initEvent () {
        document.addEventListener('keydown', this.getEventType)
      },
      // 各分支IP校验正则表达式
      valid (val) {
        let reg = /^\d{1,}$/
        return reg.test(val)
      },
      // enter按键后，所聚焦的输入框
      getEventType (e) {
       /*  console.log('check: ', this.check)
        console.log('e: ', e) */
        // console.log('e: ', e)
        // console.log('ipv1:', this.ipv1)
        // console.log('ipv2:', this.ipv2)
        // console.log('ipv3:', this.ipv3)
        // console.log('ipv4:', this.ipv4)
        if (e.keyCode === 13 || e.keyCode === 110) {
          switch (this.check) {
            case 'ipv1':
              if (this.ipv4 === null) return
              this.$refs.ipv1.focus()
              break
            case 'ipv2':
              if (this.ipv1 === null) return
              this.$refs.ipv2.focus()
              break
            case 'ipv3':
              if (this.ipv2 === null) return
              this.$refs.ipv3.focus()
              break
            case 'ipv4':
              if (this.ipv3 === null) return
              this.$refs.ipv4.focus()
              break
            // default:
            //   this.$refs.ipv1.focus()
          }
        }
      }
    },
    watch: {
      'ipv1': {
        handler (cur) {
          // console.log('cur:' + this.valid(cur))
          if (this.valid(cur)) {
            if (Number(cur) === 0) {
              return this.ipv1 = null
            }
            if (this.ipType === 'ip') {
              if (cur > 253) {
                this.ipv1 = 253
                this.$refs.ipv2.focus()
                this.$message({
                  message: '只能输入1~253之间的数字',
                  type: 'warning',
                  duration: 1000
                })
              }
            } else if (this.ipType === 'subnet') {
              if (cur > 255) {
                this.ipv1 = 255
                this.$refs.ipv2.focus()
                this.$message({
                  message: '只能输入1~255之间的数字',
                  type: 'warning',
                  duration: 1000
                })
              }
            }
            if (cur.length === 3) {
              this.$refs.ipv2.focus()
            }
            this.returnIpInfo()
          } else {
            this.ipv1 = null
          }
        }
      },
      'ipv2': {
        handler (cur) {
          // console.log('cur:' + this.valid(cur))
          if (this.valid(cur)) {
            if (cur > 255) {
              this.ipv2 = 255
              this.$refs.ipv3.focus()
            } else {
              this.ipv2 = Number(cur)
            }
            if (cur.length === 3) {
              this.$refs.ipv3.focus()
            }
            this.returnIpInfo()
          } else {
            this.ipv2 = null
          }
        }
      },
      'ipv3': {
        handler (cur) {
          // console.log('cur:' + this.valid(cur))
          console.log('cur:' + cur)
          if (this.valid(cur)) {
            if (cur > 255) {
              this.ipv3 = 255
              this.$refs.ipv4.focus()
            } else {
              this.ipv3 = Number(cur)
            }
            if (cur.length === 3) {
              this.$refs.ipv4.focus()
            }
            this.returnIpInfo()
          } else {
            this.ipv3 = null
          }
        }
      },
      'ipv4': {
        handler (cur) {
          // console.log('cur:' + this.valid(cur))
          if (this.valid(cur)) {
            if (Number(cur) === 0) {
              return this.ipv4 = null
            }
            if (cur > 254) {
              this.ipv4 = 254
            }
            if (cur === 0) {
              this.ipv4 = null
            }
            this.returnIpInfo()
          } else {
            this.ipv4 = null
          }
        }
      }
    },
    props: {
      // 是否需要自动聚焦
      autoFocus: {
        type: Boolean,
        default: false
      },
      ipType: { // ip(dns),subnet
        String: 'ip',
        default: false
      },
      configIp: {
        type: String,
        default: String
      }
    },
    // 销毁键盘监听事件,enter按下事件
    destroyed () {
      document.removeEventListener('keydown', this.getEventType)
    }
  }
  </script>
  <style>
  .ipDiv {
    width: 100%;
    display: flex;
    border: 1px solid #EEEEEE;
    border-radius: 4px;
  }
  .ip-el-input {
    width: 25%;
    text-align: center;
  }
  .ipDiv .el-input__inner, .ipDiv .el-input__inner:focus {
    text-align: center;
    border: 0;
  }
  .el-input__inner {
    width: 100%;
  }
  .ipDiv-dot {
    width: 3%;
  }
  </style>
  
  