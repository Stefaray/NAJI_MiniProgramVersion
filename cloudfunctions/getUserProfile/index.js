// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 1. 获取数据库引用
const db = cloud.database()



/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {

  console.log('------------------------------------------------------------------------------------------------------------')

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()
  // console.log(wxContext.APPID)
  // console.log(wxContext.OPENID)

  // 数据库操作
  var user_info = await db.collection('user').where({
    _id: wxContext.OPENID,
  }).get()

  console.log(event.userInfo)
  console.log(user_info.data.length)
  console.log(event.userInfo.nickName)

  if(user_info.data.length === 0){
    // 新用户
    db.collection('user').add({
      data: {
        _id: wxContext.OPENID,
        date: new Date(),
        avatarUrl: event.userInfo.avatarUrl,
        nickname: event.userInfo.nickName,
        gender: event.userInfo.gender,
        language: event.userInfo.language,
        country: event.userInfo.country,
        province: event.userInfo.province,
        city: event.userInfo.city,
        like: 0,  
        continueLoginDay: 1,
        lastLoginDay: new Date(),
        // accumulativeRecord: 0,
        // lastRecordTime: new Date(),
        receiveLike: 0,
      }
    })
    .then(res => {
      console.log(res)
    })
  }
  else if(user_info.data.length === 1){
    // 老用户
    db.collection('user').doc(wxContext.OPENID).update({
      data: {
        avatarUrl: event.userInfo.avatarUrl,
        nickname: event.userInfo.nickName,
        gender: event.userInfo.gender,
        language: event.userInfo.language,
        country: event.userInfo.country,
        province: event.userInfo.province,
        city: event.userInfo.city
      },
      success: function(res) {
        console.log(res.data)
      }
    })
  }
  else{
    console.error(user_info.data.length)
    console.error('****user表有重复openid****')
  }
  return user_info.data;

}

