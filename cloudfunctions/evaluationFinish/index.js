// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 1. 获取数据库引用
const db = cloud.database()

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


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var title = event.title
  switch(title){
    case('fiveDimension'):
      db.collection('scale').doc(wxContext.OPENID).update({
        data:{
          fiveDimension: event.data,
          fiveDimensionFinish: event.isFinish,
        },
        success:function(res){
          console.log('测评数据保存成功')
        },
        fail:function(res){
          console.error('测评数据保存失败')
        }
      })
      break;
    case('selfEsteem'):
      var score = 0
      var data = event.data.split(",")
      for(var i in data){
        // negative
        if(i==0||i==1||i==3||i==5||i==6){
          if(data[i]=='A'){
            score+=4
          } 
          else if(data[i]=='B'){
            score+=3
          }
          else if(data[i]=='C'){
            score+=2
          }  
          else if(data[i]=='D'){
            score+=1
          } 
        }
        else{
          // positive
          if(data[i]=='A'){
            score+=1
          } 
          else if(data[i]=='B'){
            score+=2
          }
          else if(data[i]=='C'){
            score+=3
          }  
          else if(data[i]=='D'){
            score+=4
          } 
        }
      }
      var selfEsteemResult = ''
      if(score>=10 && score<=25){
        selfEsteemResult = '自尊水平较低'
      }
      else if(score>=26 && score<=32){
        selfEsteemResult = '自尊水平处于中等水平'
      }
      else{
        selfEsteemResult = '自尊水平较高'
      }
      db.collection('scale').doc(wxContext.OPENID).update({
        data:{
            selfEsteemResult: selfEsteemResult,
            selfEsteemFinish: event.isFinish,
            selfEsteem: event.data,
            selfEsteemLastRecordTime: new Date().Format('yyyy-MM-dd'),
            selfEsteemRate: score,
        }
      })
      return {
        resResult: selfEsteemResult,
        rate: score,
      }
      // 计算完成
      break;
    case('nervous'):
      var score = 0
      var data = event.data.split(",")
      for(var i in data){
        // negative
        if(i==4||i==8||i==12||i==16||i==18){
          if(data[i]=='A'){
            score+=4
          } 
          else if(data[i]=='B'){
            score+=3
          }
          else if(data[i]=='C'){
            score+=2
          }  
          else if(data[i]=='D'){
            score+=1
          } 
        }
        else{
          // positive
          if(data[i]=='A'){
            score+=1
          } 
          else if(data[i]=='B'){
            score+=2
          }
          else if(data[i]=='C'){
            score+=3
          }  
          else if(data[i]=='D'){
            score+=4
          } 
        }
      }
      score = score*1.25
      var nervousResult = ''
      if(score<=49){
        nervousResult = '无焦虑症状'
      }
      else if(score>=50 && score<=59){
        nervousResult = '轻度焦虑'
      }
      else{
        nervousResult = '重度焦虑'
      }
      db.collection('scale').doc(wxContext.OPENID).update({
        data:{
            nervousResult: nervousResult,
            nervousFinish: event.isFinish,
            nervous: event.data,
            nervousLastRecordTime: new Date().Format('yyyy-MM-dd'),
            nervousRate: score,
        }
      })
      return {
        resResult: nervousResult,
        rate: score,
      }
      // 计算完成
      break;
    case('weekStatus'):
      var score = 0
      var data = event.data.split(",")
      for(var i in data){
        if(data[i]=='A'){
          score+=1
        } 
        else if(data[i]=='B'){
          score+=2
        }
        else if(data[i]=='C'){
          score+=3
        }  
        else if(data[i]=='D'){
          score+=4
        } 
      }
      var weekStatusResult = ''
      if(score>=6 && score<=10){
        weekStatusResult = '抱抱，这周辛苦啦'
      }
      else if(score>=11 && score<=13){
        weekStatusResult = '摸摸，会好起来的！'
      }
      else if(score>=14 && score<=16){
        weekStatusResult = '不错，你真的很不错'
      }
      else if(score>=17 && score<=19){
        weekStatusResult = '很好，这周也在好好生活呢'
      }
      else{
        weekStatusResult = '超棒，活力满满诶！'
      }
      db.collection('scale').doc(wxContext.OPENID).update({
        data:{
            weekStatusResult: weekStatusResult,
            weekStatusFinish: event.isFinish,
            weekStatus: event.data,
            weekStatusLastRecordTime: new Date().Format('yyyy-MM-dd'),
            weekStatusRate: score,
        }
      })
      return {
        resResult: weekStatusResult,
        rate: score,
      }
      // 计算完成
      break;
  }
  
  

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}