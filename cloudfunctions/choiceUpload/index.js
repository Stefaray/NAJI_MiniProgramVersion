// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 1. 获取数据库引用
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  // 获取今日日期
  var curDate = event.curDate
  const _ =db.command
  
  var hasData = await db.collection('singleChoice').where({
    openid: wxContext.OPENID,
    date:   _.and(_.gte(new Date(curDate+" 00:00:00")),_.lte(new Date(curDate+" 23:59:59"))),
  }).get()


  console.log(hasData)

  // rate计算方式
  // var rate = "smile"

  if(hasData.data.length == 0 || hasData === {}){
    db.collection('singleChoice').add({
      data:{
        openid: wxContext.OPENID,
        date: new Date(curDate),
        isFinish: true,
        rate: event.rate,
        choice: event.choiceStr,
      },
      success: function(res){
        console.log('**********单选题上传成功**********')
      },
      fail: function(res){
        console.error('**********单选题上传失败**********')
      }
    })
    db.collection('user').doc(wxContext.OPENID).update({
      data: {
        accumulativeRecord: _.inc(1),
      }
    })
    console.log('**********用户累计记录天数+1成功**********')
    
  }
  else if(hasData.data.length == 1){
    db.collection('singleChoice').where({
      openid: wxContext.OPENID,
      date:   _.and(_.gte(new Date(curDate+" 00:00:00")),_.lte(new Date(curDate+" 23:59:59"))),
    }).update({
      data:{
        date: new Date(curDate),
        choice: event.choiceStr,
        isFinish: true,
        rate: event.rate,
      },
      success: function(res){
        console.log('**********单选题更新成功**********')
      },
      fail: function(res){
        console.error('**********单选题更新失败**********')
      }
      
    })
  }
  else{
    console.error('******singleChoice表有重复索引*****')
  }

  return {
    rate: event.rate,
  }
}