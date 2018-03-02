//index.js
//获取应用实例
const app = getApp()
var socketOpen = false
var socketMsgQueue = []

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    msg:1
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onPullDownRefresh () {
    this.data.msg += 1
    this.setData({msg: this.data.msg})
    wx.stopPullDownRefresh()
    console.log(this.msg)
  },



  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function () {
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123'
    }
  },

  clickMe: function() {
    this.setData({ msg: "Happy New Year" })
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        var latitude = res.latitude // 经度
        var longitude = res.longitude // 纬度
      }
    })
  },
  
  markertap: function() {
    this.setData({ msg: "click map" })
  },
  connect: function () {
    console.log("connect")
    this.setData({ msg: "connect" })
    wx.connectSocket({
      url: 'wss://wx.printf.top '
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      socketOpen = true
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
      socketOpen = false
    })
  },
    send: function () {
      console.log("send")
      this.setData({ msg: "send" })
      if (socketOpen == true) {
        for (var i = 0; i < socketMsgQueue.length; i++) {
          sendSocketMessage(socketMsgQueue[i])
        }
        socketMsgQueue = []
      }

      function sendSocketMessage(msg) {
        if (socketOpen) {
          wx.sendSocketMessage({
            data: msg
          })
        } else {
          socketMsgQueue.push(msg)
        }
      }

    },
      get: function () {
        console.log("get")
      this.setData({ msg: "get" })

      wx.onSocketMessage(function (res) {
        console.log('收到服务器内容：' + res.data)
        this.setData({ msg: res.data })
      })

    },



})
