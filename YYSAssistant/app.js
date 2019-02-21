//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

        console.log("code" + res)
        this.login(res.code)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    baseUrl: "https://www.eos1234.cn:8080",
    openID: null,
    session: null
  },
  login: function (code) {
    wx: wx.request({
      url: this.globalData.baseUrl + "/v1/accessUser",
      data: {
        'accessCode': code
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => { 
        console.log(res)
        this.globalData.openID = res.data.data.userinfo.openid
        this.globalData.session = res.data.data.userinfo.session_key
      },
      fail: function (res) {
        console.log("登录失败:" + res)
      },
      complete: function (res) { 
        console.log("登录完成:"+res)
      },
    })
  },
  onShow: function (options) {
    console.log(options)
    wx.showShareMenu({
      withShareTicket: true
    })

    
  }
})