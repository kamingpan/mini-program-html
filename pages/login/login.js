// pages/login/login.js
// 获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoginButton: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取本地token缓存
    let token = wx.getStorageSync(app.globalData.tokenKey)

    // 检查登录状态态是否过期
    wx.checkSession({
      success() {
        // session_key 未过期，并且在本生命周期一直有效
        // 判断token是否存在，如果存在，则跳转到首页
        if (token) {
          // 跳转到首页
          console.log('已登录，跳转到首页')

          /*wx.redirectTo({
            url: '/pages/index/index'
          })*/
          wx.navigateBack()
          return
        }

        // 点击按钮触发授权和重新执行登录流程
      },
      fail() {
        // session_key 已经失效，需要点击按钮触发授权和重新执行登录流程
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 获取用户授权信息
   */
  getUserInfo: function (e) {
    const _this = this

    // 触发小程序登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const code = res.code

        // 获取用户授权信息
        wx.getSetting({
          success: res => {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                lang: 'zh_CN',
                success: res => {
                  _this.login(code, res.encryptedData, res.iv)

                  // 临时缓存到全局变量，后期必须删除
                  app.globalData.userInfo = res.userInfo
                }
              })
            } else {
              // 尚未授权，需要用户点击授权登录按钮
            }
          }
        })
      }
    })
  },

  /**
   * 获取用户手机号
   */
  getPhoneNumber: function (e) {
    const _this = this

    // 将手机号加密数据提交到服务器，保存用户手机号码
    wx.request({
      url: '/system/bind-mobile',
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      method: 'POST',
      success(res) {
        // 跳转到上一个页面或首页
        /*wx.redirectTo({
          url: '/pages/index/index'
        })*/
        wx.navigateBack()
      },
      fail(res) {
      }
    })
  },

  /**
   * 系统登录
   */
  login: function (code, encryptedData, iv) {
    const _this = this

    // 将登录code和用户信息提交到服务器，触发系统登录获取token
    wx.request({
      url: '/system/login',
      data: {
        code: code,
        encryptedData: encryptedData,
        iv: iv
      },
      method: 'POST',
      success(res) {
        // 保存token到本地缓存
        wx.setStorageSync(app.globalData.tokenKey, res.token)

        // 登录成功后展示“授权获取手机”按钮和“跳过”的链接
        _this.setData({
          showLoginButton: false
        })
      },
      fail(res) {
      }
    })
  },

  /**
   * 跳转到上一个页面或者首页
   */
  redirectTo: function (e) {
    /*wx.redirectTo({
      url: '/pages/index/index'
    })*/
    wx.navigateBack()
  }
})
