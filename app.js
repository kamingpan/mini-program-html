//app.js
App({
  onLaunch: function () {
    const _this = this

    // 初始化微信小程序api拦截器，必须在调用小程序api之前调用
    const wxApiInterceptors = require('./utils/wxapp-api-interceptors/wxApiInterceptors')
    wxApiInterceptors({
      request: {
        request(params) {
          // 开启loading提示框
          wx.showLoading()

          // 处理请求地址
          if (!/(http|https):\/\/\S*/.test(params.url)) {
            params.url = _this.globalData.serverRoot + params.url
          }

          // 初始化请求头对象
          if (!params.header) {
            params.header = {}
          }

          // 处理请求内容类型，设置为默认类型
          const contentType = params.header['Content-Type']
          if (!contentType) {
            params.header['Content-Type'] = 'application/x-www-form-urlencoded'
          }

          // 请求统一加上token
          const token = wx.getStorageSync(_this.globalData.tokenKey)
          if (token) {
            params.header.token = token
          }

          return params
        },
        response(res) {
          // 关闭loading提示框
          wx.hideLoading()

          // 获取响应码和状态码
          const statusCode = res.statusCode
          const status = res.data.status

          // 如果响应正常，则直接返回响应内容
          if (statusCode == 200 && status == '00000') {
            return res.data.data
          }

          // 判断如果是未登录或者登录异常，则清除本地token缓存，并跳转到登录页面
          if (statusCode == 401 && status == '01001') {
            wx.removeStorageSync(_this.globalData.tokenKey)
            wx.navigateTo({
              url: '/pages/login/login'
            })

            // 获取当前页面，保存到全局变量中
            console.log(getCurrentPages().pop())

            return
          }

          // 剩余情况弹窗提示服务器异常，并打印出异常
          wx.showModal({
            title: '异常提示',
            content: '服务器发生异常，请联系相关客服人员',
            showCancel: false,
            success(res) {
            }
          })

          console.log('服务器异常', res.data.message)
        },
      },
    })
  },
  globalData: {
    serverRoot: 'http://127.0.0.1:8030/mini-program',
    // serverRoot: 'http://www.kamingpan.com/mini-program',
    tokenKey: 'user:token',
    currenPage: null
  }
})
