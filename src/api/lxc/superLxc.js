import request from '@/utils/request'

// 查询母鸡信息列表
export function listSuperLxc(query) {
  return request({
    url: '/lxc/superLxc/list',
    method: 'get',
    params: query
  })
}

// 查询母鸡信息列表
export function listBaseInfoAll(query) {
  return request({
    url: '/lxc/superLxc/listBaseInfoAll',
    method: 'get',
    params: query
  })
}



// 查询母鸡信息详细
export function getSuperLxc(id) {
  return request({
    url: '/lxc/superLxc/' + id,
    method: 'get'
  })
}

// 新增母鸡信息
export function addSuperLxc(data) {
  return request({
    url: '/lxc/superLxc',
    method: 'post',
    data: data
  })
}

// 新增母鸡信息
export function addLxcMulti(data) {
  return request({
    url: '/lxc/superLxc/addLxcMulti',
    method: 'post',
    data: data
  })
}

// 修改母鸡信息
export function updateSuperLxc(data) {
  return request({
    url: '/lxc/superLxc',
    method: 'put',
    data: data
  })
}

// 删除母鸡信息
export function delSuperLxc(id) {
  return request({
    url: '/lxc/superLxc/' + id,
    method: 'delete'
  })
}

// 改变母鸡开小鸡限制
export function changeSuperStatus(id, superStatus) {
  const data = {
    id,
    superStatus
  }
  return request({
    url: '/lxc/superLxc/changeSuperStatus',
    method: 'put',
    data: data
  })
}