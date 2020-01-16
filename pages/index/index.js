// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const _this = this

    // 查询当前登录用户信息
    wx.request({
      url: '/user/message',
      method: 'GET',
      success(res) {
        _this.setData({
          userInfo: res,
          hasUserInfo: true
        })
      }
    })
  },
  // 退出登录
  logout: function () {
    wx.showModal({
      title: '退出确认',
      content: '确定要退出登录吗？',
      success(res) {
        if (res.confirm) {
          // 移除本地token缓存，并跳转到登录页面
          wx.removeStorageSync(app.globalData.tokenKey)
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })
  }
})
