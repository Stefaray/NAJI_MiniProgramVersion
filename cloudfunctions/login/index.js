// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  var user = await db.collection('user').where({
    // _id: wxContext.OPENID,
    _id: wxContext.OPENID
  }).get()
  
  console.log(user.data.length)
  console.log(wxContext.OPENID)

  if(user.data.length == 0){
    var nowDay = new Date()
    var lastRecordDay = new Date(2018,0,1)
    nowDay.setHours(nowDay.getHours() + 8);
    db.collection('user').add({
      data: {
        _id: wxContext.OPENID,
        date: nowDay,
        nickname: 'NAJI用户',
        avatarUrl: 'NAJI.jpg',
        continueLoginDay: 1,
        lastLoginDay: nowDay,
        accumulativeRecord: 0,
        // lastRecordTime: lastRecordDay,
        receiveLike: 0,
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    }).catch()
  }
  else if(user.data.length == 1){
    console.log(user.data[0])
    var lastLoginDay = user.data[0].lastLoginDay
    var nowDay = new Date()
    // nowDay.setHours(nowDay.getHours() + 8);
    var difValue = parseInt((nowDay - lastLoginDay) / (1000 * 60 * 60 * 24));
    var continueLoginDay = 0
    console.log(lastLoginDay)
    console.log(nowDay)
    console.log(difValue)
    if(difValue==0){
      continueLoginDay = user.data[0].continueLoginDay
    }
    else if (difValue==1){
      continueLoginDay = user.data[0].continueLoginDay+1
    }
    else{
      continueLoginDay = 1
    }
    var result = await db.collection('user').doc(wxContext.OPENID).update({
      data: {
        continueLoginDay: continueLoginDay,
        lastLoginDay: nowDay,
      },
      success: function(res) {
        console.log(res)
      },
      fail:function(res){
        console.log(res)
      }
    })
  }
  else{
    console.error('****user表有重复openid****')
  }

  return {
    openid: wxContext.OPENID,
  }
}