import request from '@/utils/request'

// 查询小鸡和用户关联表列表
export function listQueue(query) {
  return request({
    url: '/lxc/queue/list',
    method: 'get',
    params: query
  })
}

// 查询小鸡和用户关联表详细
export function getQueue(id) {
  return request({
    url: '/lxc/queue/' + id,
    method: 'get'
  })
}

// 新增小鸡和用户关联表
export function addQueue(data) {
  return request({
    url: '/lxc/queue',
    method: 'post',
    data: data
  })
}

// 修改小鸡和用户关联表
export function updateQueue(data) {
  return request({
    url: '/lxc/queue',
    method: 'put',
    data: data
  })
}

// 删除小鸡和用户关联表
export function delQueue(id) {
  return request({
    url: '/lxc/queue/' + id,
    method: 'delete'
  })
}

// 查询开机日志
export function getInitLog(id) {
  return request({
    url: '/lxc/queue/getInitLog/' + id,
    method: 'get',
  })
}

// 重建小鸡20240904
export function resetLxcQueue(childName) {
  return request({
    url: '/lxc/queue/resetLxc/' + childName,
    method: 'post',
  })
}
