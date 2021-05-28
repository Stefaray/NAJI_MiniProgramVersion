// pages/Evaluation/Evaluation.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    fiveDimension(e){
      // var openid = wx.getStorageSync('openid')
      // const db = wx.cloud.database()
      // var res = await db.collection('scale').where({
      //   _id: 'stefaray'
      // }).get()
      // var length = res.data.length
      // res = res.data[0]
      // if(res.fiveDimensionResult!='' && typeof(res.fiveDimensionResult)!='undefined'){
      //   // 跳转到结果页 带着结果
      //   wx.navigateTo({
      //     url: './result/result?title=fiveDimension&result='+res.fiveDimensionResult,
      //   })
      // }
      // else{
      //   // 跳转到测评页
      //   wx.navigateTo({
      //     url: './paper/paper?title=fiveDimension&scaleFinish='+res.fiveDimensionFinish+'&education='+res.education,
      //   })
      // }
      wx.navigateTo({
        url: './introduce/introduce?title=fiveDimension',
      })
    },
    selfEsteem(e){
      wx.navigateTo({
        url: './introduce/introduce?title=selfEsteem',
      })
    },
    nervous(e){
      wx.navigateTo({
        url: './introduce/introduce?title=nervous',
      })
    },
    weekStatus(e){
      wx.navigateTo({
        url: './introduce/introduce?title=weekStatus',
      })
    },

  }
})
