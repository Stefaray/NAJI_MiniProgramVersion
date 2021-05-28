// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')
const { fail } = require('assert')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 1. 获取数据库引用
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event.curDate)
  // 获取今日日期
  var curDate = event.curDate
  const _ =db.command
  var res
  
  var hasData = await db.collection('happyThing').where({
    openid: wxContext.OPENID,
    date:   _.and(_.gte(new Date(curDate+" 00:00:00")),_.lte(new Date(curDate+" 23:59:59"))),
    todayIndex: event.todayIndex
  }).get()
  console.log(hasData)

  // insert：photoURL
  if(event.type == 'photoURL'){
    res = await cloud.uploadFile({
      cloudPath: wxContext.OPENID +'-'+ Date.parse( new Date()), // 上传至云端的路径
      fileContent: Buffer.from(event.tmpPhotoURL, 'base64'), // 小程序临时文件路径 
    })
    // 返回文件 ID
    console.log('*****上传图片-云函数->云存储-成功*****')
    console.log(res.fileID)
    
    // 写入云数据库
    // add操作
    if(hasData.data.length == 0 || JSON.stringify(hasData) === '{}'){
      db.collection('happyThing').add({
        data:{
          photoURL: res.fileID,
          openid: wxContext.OPENID,
          date:   new Date(curDate),
          todayIndex: event.todayIndex,
          happyThingText:'',
          isSharing: false,
        },
        success:function(res2){
          console.log('*****照片fileID增加云数据库-成功*****')
          res.fileID = 'success'
        },
        fail:function(res2){
          console.error('*****照片fileID增加云数据库-失败*****')
          res.fileID = 'fail'
        }
      })
    }
    // update操作
    else{
      db.collection('happyThing').where({
        openid: wxContext.OPENID,
        date:   _.and(_.gte(new Date(curDate+" 00:00:00")),_.lte(new Date(curDate+" 23:59:59"))),
        todayIndex: event.todayIndex
      }).update({
        data:{
          photoURL: res.fileID,
        },
        success:function(res2){
          console.log('*****照片fileID更新云数据库-成功*****')
          res.fileID = 'success'
        },
        fail:function(res2){
          console.error('*****照片fileID更新云数据库-失败*****')
          res.fileID = 'fail'
        }
      })
    }

    // 说明之前有图片，需要将云存储中的原始图片删掉
    if(hasData.data.length == 0 || JSON.stringify(hasData) === '{}' ){

    }
    else if(hasData.data[0].photoURL === ''){
      
    }
    else{
      cloud.deleteFile({
        fileList:[hasData.data[0].photoURL],
        success: function(res){
          console.log('删除原始照片成功')
          console.log(res.fileList)
        },
        fail: function(res){
          console.log('删除原始照片失败')
        }
      })
    }

    return {
      fileID: res.fileID,
    }
  }
  // insert：happyThingText
  else if(event.type == 'happyThingText'){
    // 写入云数据库
    // add操作
    if(hasData.data.length == 0 || JSON.stringify(hasData) === '{}'){
      db.collection('happyThing').add({
        data:{
          photoURL: '',
          openid: wxContext.OPENID,
          date:   new Date(curDate),
          todayIndex: event.todayIndex,
          happyThingText: event.happyThingText,
          isSharing: false,
        },
        success:function(res2){
          console.log('*****happyThingText增加云数据库-成功*****')
        },
        fail:function(res2){
          console.error('*****happyThingText增加云数据库-失败*****')
        }
      })
    }
    // update操作
    else{
      db.collection('happyThing').where({
        openid: wxContext.OPENID,
        date:   _.and(_.gte(new Date(curDate+" 00:00:00")),_.lte(new Date(curDate+" 23:59:59"))),
        todayIndex: event.todayIndex
      }).update({
        data:{
          happyThingText: event.happyThingText,
        },
        success:function(res2){
          console.log('*****happyThingText更新云数据库-成功*****')
          res.fileID = 'success'
        },
        fail:function(res2){
          console.error('*****happyThingText更新云数据库-失败*****')
          res.fileID = 'fail'
        }
      })
    }
  }
  // insert：isSharing
  else if(event.type == 'isSharing'){
    // 写入云数据库
    // add操作
    if(hasData.data.length == 0 || JSON.stringify(hasData) === '{}'){
      db.collection('happyThing').add({
        data:{
          photoURL: '',
          openid: wxContext.OPENID,
          date:   new Date(curDate),
          todayIndex: event.todayIndex,
          happyThingText: '',
          isSharing: true,
        },
        success:function(res2){
          console.log('*****快乐事-isSharing-增加云数据库-成功*****')
        },
        fail:function(res2){
          console.error('*****快乐事-isSharing-增加云数据库-失败*****')
        }
      })
    }
    // update操作
    else{
      db.collection('happyThing').where({
        openid: wxContext.OPENID,
        date:   _.and(_.gte(new Date(curDate+" 00:00:00")),_.lte(new Date(curDate+" 23:59:59"))),
        todayIndex: event.todayIndex
      }).update({
        data:{
          isSharing: event.isSharing,
        },
        success:function(res2){
          console.log('*****快乐事-isSharing-更新云数据库-成功*****')
          res.fileID = 'success'
        },
        fail:function(res2){
          console.error('*****快乐事-isSharing-更新云数据库-失败*****')
          res.fileID = 'fail'
        }
      })
    }
  }
  else{
    console.error('happyThing数据类型出错！！')
  }
  
  return {
    rate: event.rate,
  }
}