import request from '@/utils/request'

// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data,
    timeout: 20000
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data,
    timeout: 20000
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get',
    timeout: 20000
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post',
    timeout: 20000
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

// 短信验证码
export function getCodeSms() {
  return request({
    url: '/captchaSms',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}


// 登录方法
export function loginLxc(data) {
  return request({
    url: '/lxc/user/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data,
    timeout: 20000
  })
}

export function userNav() {
  return request({
    url: '/lxc/user/nav',
    headers: {
      isToken: true
    },
    method: 'get',
    timeout: 20000
  })
}