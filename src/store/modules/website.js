import Cookies from 'js-cookie'

const state = {
  websiteSidebar: {
    opened: Cookies.get('websiteSidebarStatus') ? !!+Cookies.get('websiteSidebarStatus') : true,
    withoutAnimation: false,
    hide: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'medium'
}

const mutations = {
  TOGGLE_WEBSITE_SIDEBAR: state => {
    state.websiteSidebar.hide = !state.websiteSidebar.hide;
    // if (state.websiteSidebar.hide) {
    //   return false;
    // }
    // state.websiteSidebar.opened = !state.websiteSidebar.opened
    // state.websiteSidebar.withoutAnimation = false
    // if (state.websiteSidebar.opened) {
    //   Cookies.set('websiteSidebarStatus', 1)
    // } else {
    //   Cookies.set('websiteSidebarStatus', 0)
    // }
  },
  CLOSE_WEBSITE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('websiteSidebarStatus', 0)
    state.websiteSidebar.opened = false
    state.websiteSidebar.withoutAnimation = withoutAnimation
  },
  SET_WEBSITE_HIDE: (state, status) => {
    state.websiteSidebar.hide = status
  }
}

const actions = {
  toggleWebsiteSideBar({ commit }) {
    commit('TOGGLE_WEBSITE_SIDEBAR')
  },
  setWebsiteSideBarHide({ commit }, status) {
    commit('SET_WEBSITE_HIDE', status)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
