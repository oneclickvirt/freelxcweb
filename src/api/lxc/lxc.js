import request from "@/utils/request";

export function ping(query) {
  return request({
    url: "/lxc/pingLxc",
    method: 'get',
    params: query,
    timeout: 60000,
  })
}

export function getLxcList() {
  return request({
    url: "/lxc/getLxcList",
    headers: {
      isToken: true,
    },
    method: "get",
    timeout: 20000,
  });
}

export function addone(data) {
  return request({
    url: "/lxc/queue/addone",
    headers: {
      isToken: true,
      repeatSubmit: true,
    },
    method: "post",
    data: data,
    timeout: 30000,
  });
}

export function applyLxc(data) {
  return request({
    url: "/lxc/queue/applyLxc",
    headers: {
      isToken: true,
      repeatSubmit: true,
    },
    method: "post",
    data: data,
    timeout: 600000,
  });
}

export function listAllQueue(data) {
  return request({
    url: "/lxc/queue/listAll",
    headers: {
      isToken: true,
      repeatSubmit: true,
    },
    method: "get",
    data: data,
    timeout: 60000,
  });
}

export function userLxcData(data) {
  return request({
    url: "/lxc/userLxcData",
    headers: {
      isToken: true,
    },
    method: "post",
    data: data,
    timeout: 20000,
  });
}

export function modifyLxc(data) {
  return request({
    url: "/lxc/queue/modifyLxc",
    headers: {
      isToken: true,
      repeatSubmit: true,
    },
    method: "post",
    data: data,
    timeout: 40000,
  });
}

export function onLineLxc(data) {
  return request({
    url: "/lxc/onLineLxc",
    headers: {
      isToken: true,
    },
    method: "get",
    data: data,
    timeout: 20000,
  });
}


// 查询可申请的母鸡列表
export function listSuperCart() {
  return request({
    url: '/lxc/superLxc/listSuperCart',
    method: 'get',
  })
}

// 获取实例的网络流量图

export function getNetImage(lxcId, type) {
  return request({
    url: "/lxc/getNetImage/" + lxcId + "/" + type,
    method: "get",
    responseType:'blob'
  });
}