// pages/User/User.js

Page({

  /**
   * 组件的初始数据
   */
  data: {
    avatarUrl:'',
    nickname:'',
    continueLogin:0,
    accumulativeRecord:0,
    receiveLike:0,
    isInit:false,
    test:'32749832'
  },

  

  onShow:function(options){
    var that = this
    console.log('*******缓存中获取openid中*******')
    wx.getStorage({
      key: 'isInit',
      success: result=>{
        that.setData({
          isInit:'true'
        })
        wx.getStorage({
          key: 'openid',
          success: result=> {
            console.log('*******缓存中获取openid成功*******')
            console.log('*******从云数据库获取最新用户资料中*******')
            const db = wx.cloud.database()
            db.collection('user').where({
              _id: result.data
            }).get({
              success:res=>{
                console.log('*******从云数据库获取最新用户资料成功*******')
                console.log(res)
                
                this.setData({
                  nickname:           res.data[0].nickname,
                  avatarUrl:          res.data[0].avatarUrl,
                  continueLogin:      res.data[0].continueLoginDay,
                  accumulativeRecord: res.data[0].accumulativeRecord,
                  receiveLike:        res.data[0].like,
                })
              }
            })
          },
          fail: (res) => {
            console.error('*******缓存中获取openid失败*******')
            // 暂时不做这一块
          },
          complete: (res) => {},
        })
      },
      fail:function(){
        console.log('*******缓存中没有isInit*******')
      }
    })
      
  },

// 获取用户信息
  getUserProfile(){
    var that = this
    console.log('*********getUserProfile调用中*********');
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success(res){
        // console.log(res.userInfo);
        console.log('用户允许透露信息，调用云函数getUserProfile成功')
        wx.cloud.callFunction({
          name:'getUserProfile',
          data:{
            userInfo: res.userInfo,
          },
          success:function(res2){
            console.log('执行云函数getUserProfile成功')
            console.log(res2)
            that.setData({
              isInit: true,
              nickname:           res.userInfo.nickName,
              avatarUrl:          res.userInfo.avatarUrl,
              continueLogin:      res2.result[0].continueLoginDay,
              accumulativeRecord: res2.result[0].accumulativeRecord,
              receiveLike:        res2.result[0].like,
            })
          },
          fail:function(){
            console.error('执行云函数getUserProfile失败')
          }
        })
      },
      fail(res){
        console.log('用户拒绝透露信息，调用云函数getUserProfile失败')
        wx.getStorage({
          key: 'openid',
          success:function(res){
            const db = wx.cloud.database()
            db.collection('user').where({
              _id: res.data
            }).get({
              success:function(res2){
                console.log(res2)
                that.setData({
                  isInit:             true,
                  nickname:           'NAJI用户',
                  avatarUrl:          'NAJI.jpg',
                  continueLogin:      res2.data[0].continueLoginDay,
                  accumulativeRecord: res2.data[0].accumulativeRecord,
                  receiveLike:        res2.data[0].like,
                })
              }
            })
          }
        })
        
      }
    })
    wx.setStorage({
      data: true,
      key: 'isInit',
    })
    
    console.log('*********getUserProfile调用完毕*********');
  },

  // 重新登录
  reLogin(){
    console.log('重新授权登录')
    if(this.data.avatarUrl === 'NAJI.jpg'){
      this.getUserProfile();
    }
  },
  toast(){
    wx.showToast({
      title: '该模块暂未开启，敬请期待~',
      icon:'none',
      duration:1500,
    })
  }
})
