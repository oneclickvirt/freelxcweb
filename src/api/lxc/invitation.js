import request from '@/utils/request'

// 查询邀请码列表
export function listInvitation(query) {
  return request({
    url: '/lxc/invitation/list',
    method: 'get',
    params: query
  })
}

// 查询邀请码详细
export function getInvitation(tgId) {
  return request({
    url: '/lxc/invitation/' + tgId,
    method: 'get'
  })
}

// 新增邀请码
export function addInvitation(data) {
  return request({
    url: '/lxc/invitation',
    method: 'post',
    data: data
  })
}

// 修改邀请码
export function updateInvitation(data) {
  return request({
    url: '/lxc/invitation',
    method: 'put',
    data: data
  })
}

// 删除邀请码
export function delInvitation(tgId) {
  return request({
    url: '/lxc/invitation/' + tgId,
    method: 'delete'
  })
}
