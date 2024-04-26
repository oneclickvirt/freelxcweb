import { sshWS } from "./sshWS";

const install = function(Vue) {
  const base = {
    //参数&方法 
    sshWS({ url, openFn, messageFn, errorFn, isInit = false } = {}) {
      return new sshWS({ url, openFn, messageFn, errorFn, isInit });
    },
  };
  Vue.prototype.base = base;
};

export default {
  install
};

