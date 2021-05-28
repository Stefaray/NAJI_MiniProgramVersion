// pages/chooseLib/chooseLib.js
// 日期格式化
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    happyThingText:'',
    photoURL:'',
    date:'',
    userNickname:'',
    avatarURL:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  likeEvnet(e){
    wx.showToast({
      title: '点赞功能暂未开启~敬请期待',
      icon:'none',
      duration:1500,
    })
  },
  async popCornEvent(){
    const db = wx.cloud.database()
    var data  = await db.collection('happyThing')
      .aggregate()
      .match({
        isSharing: true
      })
      .sample({
        size: 1
      })
      .end()
    var res = data.list[0]
    var userData = await db.collection('user').doc(res.openid).get()
    var user = userData.data
    

    var happyThingText = res.happyThingText
    var photoURL = res.photoURL
    var date = res.date.Format('yyyy-MM-dd')
    var userNickname = user.nickname
    var avatarURL = user.avatarUrl
    
    this.setData({
      happyThingText: happyThingText,
      photoURL: photoURL,
      date: date,
      userNickname: userNickname,
      avatarURL: avatarURL,
    })
    
    console.log(res)
    console.log(user)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
