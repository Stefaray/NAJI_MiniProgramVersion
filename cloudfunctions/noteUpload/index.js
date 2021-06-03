// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 1. 获取数据库引用
const db = cloud.database()

async function generateFileID(notePhoto, curDate, OPENID){
  var fileIDArr = []
  // for(var i in notePhoto){
  //   var checkStr = notePhoto[i].substr(0,5)
  //   if(checkStr == 'cloud'){
  //     var res = await cloud.uploadFile({
  //       cloudPath: 'note' + '_' + curDate + '_' + i + '_' + new Date().toTimeString().substring(0,8) + '_' + OPENID  , // 上传至云端的路径
  //       fileContent: notePhoto[i], // 小程序临时文件路径 
  //     })
  //     fileIDArr[i] = {url: res.fileID, isImage: true}
  //   }
  // }
  for(var i in notePhoto){
    var checkStr = notePhoto[i].substr(0,5)
    if(checkStr != 'cloud'){
      var res = await cloud.uploadFile({
        cloudPath: 'note' + '_' + curDate + '_' + i + '_' + new Date().toTimeString().substring(0,8) + '_' + OPENID , // 上传至云端的路径
        fileContent: Buffer.from(notePhoto[i], 'base64'), // 小程序临时文件路径 
      })
      fileIDArr[i] = {url: res.fileID, isImage: true}
    }
    else{
      fileIDArr[i] = {url: notePhoto[i], isImage: true}
    }
  }
  return fileIDArr
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 获取今日日期
  var curDate = event.curDate
  const _ =db.command

  var hasData = await db.collection('note').where({
    openid: wxContext.OPENID,
    date:   _.and(_.gte(new Date(curDate+" 00:00:00")),_.lte(new Date(curDate+" 23:59:59"))),
  }).get()

  console.log(hasData)

  generateFileID(event.notePhoto, event.curDate,  wxContext.OPENID).then(function(fileIDArr){
    console.log(fileIDArr)
    if(hasData.data.length == 0 || hasData === {}){
      db.collection('note').add({
        data:{
          openid: wxContext.OPENID,
          date: new Date(curDate),
          noteHTML: event.noteHTML,
          notePhoto: fileIDArr,
        },
        success: function(res){
          console.log('**********noteHTML上传成功**********')
        },
        fail: function(res){
          console.error('**********noteHTML上传失败**********')
        }
      })
    }
    else if(hasData.data.length == 1){
      db.collection('note').where({
        openid: wxContext.OPENID,
        date:   _.and(_.gte(new Date(curDate+" 00:00:00")),_.lte(new Date(curDate+" 23:59:59"))),
      }).update({
        data:{
          noteHTML: event.noteHTML,
          notePhoto: fileIDArr,
        },
        success: function(res){
          console.log('**********noteHTML更新成功**********')
        },
        fail: function(res){
          console.error('**********noteHTML更新失败**********')
        }
        
      })
    }
    else{
      console.error('******note表有重复索引*****')
    }
    return {
      res: 'success',
    }
  })
  
}