import request from '@/utils/request'

// 查询小鸡流量统计列表
export function listTraffic(query) {
  return request({
    url: '/system/traffic/list',
    method: 'get',
    params: query
  })
}

// 查询小鸡流量统计详细
export function getTraffic(lxcId) {
  return request({
    url: '/system/traffic/' + lxcId,
    method: 'get'
  })
}

// 新增小鸡流量统计
export function addTraffic(data) {
  return request({
    url: '/system/traffic',
    method: 'post',
    data: data
  })
}

// 修改小鸡流量统计
export function updateTraffic(data) {
  return request({
    url: '/system/traffic',
    method: 'put',
    data: data
  })
}

// 删除小鸡流量统计
export function delTraffic(lxcId) {
  return request({
    url: '/system/traffic/' + lxcId,
    method: 'delete'
  })
}
