//app.js

App({
  data: {
    openid: '',
    nickname:'',
    avatarUrl:'',
    like:0,
    continueLogin:0,
    cumulativeRecord:0
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'stefaray-3gxwogx2a161685a',
        traceUser: true,
      })
    }


    // 微信登录
    console.log('*********缓存查找openid中*********')
    let that = this
    wx.getStorage({
      key: 'openid',  
      success:function(res){
        // 缓存有openid
        console.log('*********缓存查找openid成功*********')
        console.log('用户openid为 '+res.data)
        wx.cloud.callFunction({
          name:'login',
          success:function(res){
            console.log('执行云函数login成功')
            console.log('用户openid为 '+res.result.openid)
            wx.setStorage({
              key: 'openid',
              data: res.result.openid,
            })
          },
          fail:function(res){
            console.log(res)
            console.error('执行云函数login失败')
          }
        })

      },
      fail:function(res){
        // 缓存中没有openid，需要访问云数据库
        console.log('*********缓存查找openid失败*********')
        console.log('*********login调用中*********');
        wx.cloud.callFunction({
          name:'login',
          success:function(res){
            console.log('执行云函数login成功')
            console.log('用户openid为 '+res.result.openid)
            // this.openid = res.openid
            wx.setStorage({
              key: 'openid',
              data: res.result.openid,
            })
          },
          fail:function(){
            console.error('执行云函数login失败')
          }
        })
        
      }
    })

    this.globalData = {}
  },
  onReady: function() {
    console.log(this.data.openid)
  }
})
