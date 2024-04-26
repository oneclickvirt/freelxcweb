import request from '@/utils/request'

// 查询小鸡信息列表
export function listLxc(query) {
  return request({
    url: '/lxc/list',
    method: 'get',
    params: query
  })
}

// 查询小鸡信息详细
export function getLxc(id) {
  return request({
    url: '/lxc/' + id,
    method: 'get'
  })
}

// 新增小鸡信息
export function addLxc(data) {
  return request({
    url: '/lxc',
    method: 'post',
    data: data
  })
}

// 修改小鸡信息
export function updateLxc(data) {
  return request({
    url: '/lxc',
    method: 'put',
    data: data
  })
}

// 删除小鸡信息
export function delLxc(id) {
  return request({
    url: '/lxc/' + id,
    method: 'delete'
  })
}
