// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 1. 获取数据库引用
const db = cloud.database()
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
  var likeReceiver = event.likeReceiver
  var happyThingID = event.happyThingID
  var isLike = event.type

// 点赞
  if(isLike == 'true'){
    db.collection('like').add({
      data:{
        likeReceiver: likeReceiver,
        likeSender: wxContext.OPENID,
        happyThingID: happyThingID
      }
    })
    db.collection('user').doc(likeReceiver).update({
      data:{
        receiveLike: _.inc(1)
      }
    })
  }
// 取消点赞
  else{
    db.collection('like').where({
      likeReceiver: likeReceiver,
      likeSender: wxContext.OPENID,
      happyThingID: happyThingID
    }).remove()
    db.collection('user').doc(likeReceiver).update({
      data:{
        receiveLike: _.inc(-1)
      }
    })
  }

  return {

  }
}