<template>
  <v-container id="cartIndex" data-app="true">
    <div
      v-if="!hasAliveSuper"
      class="start-msg text font-sans text-opacity-50 text-6xl tracking-wide my-align-center"
    >
      暂无可领取的小鸡
    </div>
    <v-item-group active-class="primary">
      <v-container class="mt-6 pl-15 pr-15">
        <v-row class="pb-10">
          <v-col>
            <div class="start-msg-h">
              <span class="text text-h4 text-gray-300 text-opacity-75 pr-5"
                >{{ currentTitle }}
              </span>
            </div>
          </v-col>
        </v-row>
        <v-window v-model="step" class="min-h-300">
          <v-window-item :value="1">
            <v-row>
              <v-col
                v-for="n in superCartList"
                :key="n.id"
                cols="12"
                md="4"
                lg="3"
                xl="3"
              >
                <v-item v-slot="{ active, toggle }">
                  <v-hover v-slot="{ hover }">
                    <v-card
                      :elevation="hover ? 12 : 2"
                      class="cart-category cursor-pointer"
                      :class="{ 'on-hover': hover }"
                      dark
                      height="102"
                      @click="selectSuper(toggle, n, active)"
                    >
                      <v-list-item>
                        <v-list-item-avatar tile size="64">
                          <v-icon class="fi" :class="`fi-${n.tag}`"></v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title
                            class="card-title font-weight-bold"
                            :style="active ? 'color: white !important' : ''"
                            v-text="n.name"
                          ></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider
                        class="hr-line"
                        :class="active ? 'white' : ''"
                      ></v-divider>
                      <small
                        :style="active ? 'color: white !important' : ''"
                        class="expire"
                        >到期时间：{{ n.dead }}</small
                      >
                    </v-card>
                  </v-hover>
                </v-item>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- <v-window-item :value="2">
            <v-card-text>
              <v-text-field label="Password" type="password"></v-text-field>
              <v-text-field
                label="Confirm Password"
                type="password"
              ></v-text-field>
              <span class="text-caption grey--text text--darken-1">
                Please enter a password for your account
              </span>
            </v-card-text>
          </v-window-item> -->

          <v-window-item :value="2">
            <div class="pa-4 text-center mt-12 align-self-center">
              <!-- <v-img
                class="mb-4"
                contain
                height="128"
                src="https://cdn.vuetifyjs.com/images/logos/v.svg"
              ></v-img> -->
              <svg
                t="1670153462228"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="7407"
                width="200"
                height="200"
              >
                <path
                  d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m238.933333 349.866666l-2.133333 2.133334-277.333333 277.333333c-10.666667 10.666667-29.866667 12.8-42.666667 2.133333L426.666667 704l-149.333334-149.333333c-12.8-12.8-12.8-32 0-44.8 10.666667-10.666667 29.866667-12.8 42.666667-2.133334l2.133333 2.133334 125.866667 125.866666 253.866667-253.866666c10.666667-10.666667 29.866667-12.8 42.666666-2.133334l2.133334 2.133334c12.8 12.8 12.8 32 4.266666 42.666666z"
                  p-id="7408"
                  fill="#0cc160"
                ></path>
              </svg>
              <h3 class="text-h6 font-weight-light mt-10 mb-2">
                {{ applyMsg }}
              </h3>
            </div>
          </v-window-item>
        </v-window>
        <!-- <v-row v-show="hasAliveSuper && hasSelect" class="mt-12 p-2" fixed>
          <v-btn v-if="step != 1" :disabled="step === 1" text @click="step--">
            Back
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="hasAliveSuper && step != 2"
            :disabled="step === 2 || !hasSelect"
            depressed
            color="success"
            @click="submit()"
          >
            提交
          </v-btn>
        </v-row> -->
      </v-container>
    </v-item-group>
    <v-overlay :value="firstOverlay">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <v-footer
      v-if="hasAliveSuper && step != 2 && hasSelect"
      absolute
      class="cart-footer space-x-10"
    >
      <v-row align="stretch" justify="center" dense>
        <v-col cols="4" sm="4" md="2" lg="2" xl="2">
          <div class="form-group">
            <div
              class="flex flex-row align-items-center mb-1 mb-md-3 order-summary-title"
            >
              <h3>宿主机:</h3>
            </div>
            <div
              class="text-primary h1 flex flex-row align-center order-summary-content"
            >
              <span>
                {{ selectedSuper.name }}
              </span>
            </div>
          </div>
        </v-col>
        <v-col cols="4" sm="4" md="2" lg="2" xl="2">
          <div class="form-group">
            <div
              class="flex flex-row align-items-center mb-1 mb-md-3 order-summary-title"
            >
              <h3>到期时间:</h3>
            </div>
            <div
              class="text-primary h1 flex flex-row align-center order-summary-content"
            >
              <span>
                {{ selectedSuper.dead }}
              </span>
            </div>
          </div>
        </v-col>
        <v-col cols="4" sm="4" md="2" lg="2" xl="2">
          <div class="form-group">
            <div
              class="flex flex-row align-items-center mb-1 mb-md-3 order-summary-title"
            >
              <h3>磁盘:</h3>
            </div>
            <div
              class="text-primary h1 flex flex-row align-center order-summary-content"
            >
              <span> {{ selectedSuper.diskLimit }} <small>GB</small> </span>
            </div>
          </div>
        </v-col>
        <v-col cols="4" sm="4" md="2" lg="2" xl="2">
          <div class="form-group">
            <div
              class="flex flex-row align-items-center mb-1 mb-md-3 order-summary-title"
            >
              <h3>内存:</h3>
            </div>
            <div
              class="text-primary h1 flex flex-row align-center order-summary-content"
            >
              <span> {{ selectedSuper.memoryLimit }} <small>MB</small> </span>
            </div>
          </div>
        </v-col>
        <v-col cols="4" sm="4" md="2" lg="2" xl="2">
          <div class="form-group">
            <div
              class="flex flex-row align-items-center mb-1 mb-md-3 order-summary-title"
            >
              <h3>支持IPV6:</h3>
            </div>
            <div
              class="text-primary h1 flex flex-row align-center order-summary-content"
            >
              <span>
                {{ selectedSuper.ipv6Flag == "Y" ? "是" : "否" }}
              </span>
            </div>
          </div>
        </v-col>
        <v-col cols="4" sm="4" md="2" lg="2" xl="2">
          <div class="form-group">
            <v-form ref="form" v-model="valid" lazy-validation>
              <!-- <div
                class="flex flex-row align-items-center mb-1 mb-md-3 order-summary-title"
              >
                <h3>镜像:</h3>
              </div> -->
              <div
                class="text-primary h1 flex flex-row align-center order-summary-content"
              >
                <v-select
                  hide-details
                  v-model="mirrorImage"
                  auto-select-first
                  :items="handelSourcesList(selectedSuper.sourceConfig)"
                  item-text="alias"
                  item-value="alias"
                  label="请选择镜像"
                  required
                  :rules="required"
                  chips
                  :menu-props="{ top: true, offsetY: true }"
                  no-data-text="Oops! Nothing found."
                  clearable
                  filled
                  solo
                  disable-lookup
                  eager
                  outlined
                  deletable-chips
                >
                  <template v-slot:selection="data">
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      v-bind="data.attrs"
                      :input-value="data.selected.alias"
                      :disabled="data.disabled"
                      color="primary"
                      outlined
                      pill
                      @click:close="data.parent.selectItem(data.item.alias)"
                    >
                      <v-icon dark>
                        mdi-{{ getMirrorIcon(data.item.alias) }}
                      </v-icon>
                      {{ data.item.alias }}
                    </v-chip>
                  </template>
                </v-select>
              </div>
            </v-form>
          </div>
        </v-col>
      </v-row>
      <div class="justify-between my-2 mr-4">
        <v-btn
          v-if="hasAliveSuper && step != 2"
          :disabled="step === 2 || !hasSelect"
          x-large
          elevation="10"
          color="success"
          @click="submit()"
        >
          提交
        </v-btn>
      </div>
    </v-footer>
  </v-container>
</template>

<script>
import { applyLxc, listSuperCart } from "@/api/lxc/lxc.js";
export default {
  name: "cartIndex",
  data() {
    return {
      valid: true,
      superCartList: null,
      step: 1,
      hasSelect: false,
      selectedSuper: null,
      applyMsg: null,
      firstOverlay: true,
      mirrorImage: null,
      required: [(v) => !!v || "Name is required"],
    };
  },
  computed: {
    // 计算是否有可领取的母鸡
    hasAliveSuper() {
      if (this.superCartList && this.superCartList.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    currentTitle() {
      switch (this.step) {
        case 1:
          if (this.superCartList && this.superCartList.length > 0) {
            if (this.hasSelect) {
              if(this.mirrorImage){
                return `已选择${this.selectedSuper.name}，镜像：${this.mirrorImage}`;
              }else{
                return "请选择镜像";
              }
              // return `已选择${this.selectedSuper.name}，母鸡到期时间：${this.selectedSuper.dead}`;
            } else {
              return "请选择宿主机";
            }
          } else {
            return "";
          }
          hasSelect;
        case 2:
          return "";
        default:
          return "Account created";
      }
    },
  },
  components: {},
  //创建前设置
  beforeCreate() {
    // @ts-ignore
  },
  created() {
    // document &&  (document.querySelector("body").style.background_color = "#121212 !important");
    this.getSuperCartList();
  },
  mounted() {},
  methods: {
    // 获取镜像图标
    getMirrorIcon(name) {
      name = name.toUpperCase();
      if (name.indexOf("DEBIAN") !== -1) {
        return "debian";
      } else if (name.indexOf("UBUNTU") !== -1) {
        return "ubuntu";
      } else if (name.indexOf("CENTOS") !== -1) {
        return "centos";
      }
    },
    // 处理镜像列表
    handelSourcesList(list) {
      if (list === null || list === "{}" || list === "[]" || list === "") {
        return [
          {
            alias: "debian/11",
          },
        ];
      }
      return JSON.parse(list);
    },
    submit() {
      if (!this.$refs.form.validate()) return;
      console.log("mirrorImage", this.mirrorImage);
      // return;
      this.$emit("showOverlay");
      applyLxc({ lxcSuperId: this.selectedSuper.id,mirrorImage: this.mirrorImage})
        .then((res) => {
          this.applyMsg = res.msg;
          this.step++;
          this.$emit("hideOverlay");
        })
        .catch((err) => {
          this.$emit("hideOverlay");
        });
    },
    selectSuper(toggle, n, active) {
      toggle();
      this.hasSelect = !active;
      this.selectedSuper = n;
    },
    getSuperCartList() {
      listSuperCart()
        .then((res) => {
          this.superCartList = res;
          this.firstOverlay = false;
        })
        .catch((err) => {
          this.firstOverlay = false;
        });
    },
  },
  beforeDestroy() {
    // @ts-ignore
    // document && document.querySelector("body").removeAttribute("style");
  },
};
</script>
<style lang="scss" scoped>
::v-deep body {
  background-color: #121212 !important;
}

#cartIndex {
  height: 100%;

  --main-black-1: #000;
  --main-black-2: #212121;
  --main-black-3: #373737;
  --main-black-4: #3f3f3f;
  --main-black-5: #515151;
  --main-black-6: #656565;
  --main-black-7: #acacac;
  --main-white-1: #fff;
  --main-white-2: #d4d4d4;
  --main-link-text: #a464ff;
  --main-link-text-hover: #b987ff;
  --main-text-bg: #8424ff;
  --main-link: #6200ee;
  --main-link-btn: #8424ff;
  --main-link-btn-hover: #b07af4;
  --main-link-btn-active: #4f04af;
  --btn-linear-bg-color: linear-gradient(135deg, #426dff, #ab25ff);
  --main-green: #00a247;
  --main-red: #f32b35;
  --main-yellow: #cc8f12;
  --btn-opacity-hover: 0.8;
  --btn-opacity-active: 1;

  .cart-category {
    background-color: #373737;
  }

  .v-card:hover {
    background-color: var(--main-link-btn-hover);
    background-color: var(--main-black-5);
    border-color: var(--main-link-btn-hover);
    border-color: var(--main-black-5);
  }

  .card-title {
    overflow: inherit;
    text-overflow: unset;
    white-space: unset;
    font-size: 1.25rem;
    font-weight: 500;
    letter-spacing: 0.0125em;
    line-height: 1.75rem;
    color: var(--main-white-2) !important;
  }

  .expire {
    top: -6px;
    left: 15px;
    position: relative;
    color: var(--main-black-7) !important;
  }

  .hr-line {
    top: -6px;
    position: relative;
  }

  .start-msg-h {
    color: var(--main-black-7) !important;

    h1,
    h2 {
      color: var(--main-black-7) !important;
    }
  }

  .cart-footer {
    box-sizing: border-box;
    justify-content: center;
    min-height: 120px;
    box-shadow: 0 0 40px -10px rgba(37, 45, 51, 0.3);
    overflow: hidden;
    padding: 10px;
    background: var(--main-black-2) !important;
    border-color: var(--main-black-4) !important;
    border-top: 0.07rem solid #ebecf042 !important;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background-color: var(--main-black-1);
    color: var(--main-white-2) !important;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  // .cart-footerc从下面弹出
  .cart-footer-enter-active {
    animation: slide-up 0.3s;
  }

  .order-summary-title {
    font-size: 1rem;
    color: #9ba0b3;
    margin-bottom: 0px;
    display: block;
    letter-spacing: 0.45px;
  }

  .order-summary-content {
    color: var(--main-white-1) !important;
    font-size: 1.71rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
  }
}
</style>
