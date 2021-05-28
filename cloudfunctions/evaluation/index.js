// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 1. 获取数据库引用
const db = cloud.database()

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
  var scale = await db.collection('scale').where({
    _id: wxContext.OPENID,
  }).get()
  var result = scale.data[0]
  console.log(result)
  // scale表里有，更新
  if(scale.data.length!=0 && result._id==wxContext.OPENID){
    switch(title){
      case('fiveDimension'):
        // 之前已经写过，不用再写了
        if(result.fiveDimensionFinish==true && result.fiveDimensionLastRecordTime != '' && typeof(result.fiveDimensionLastRecordTime)!='undefined'){
            var startYear = new Date(result.fiveDimensionLastRecordTime).getFullYear();
            var endYear = new Date().getFullYear()
            if(startYear == endYear){
              return {
                // resFinish: true,
                // resEducation: result.education,
                resResult: result.fiveDimensionResult,
              }
            }
            else{
              var fiveDimensionInitial = [
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
              ].join(",")
              db.collection('scale').where({
                _id: wxContext.OPENID
              }).update({
                data:{
                  fiveDimension: fiveDimensionInitial,
                  fiveDimensionFinish: false,
                  fiveDimensionLastRecordTime: "",
                  fiveDimensionResult: "",
                },
                success:function(res){
                  console.log('五大维度-新的一年-用户：'+wxContext.OPENID+' 重置成功')
                  return {
                    resFinish: false,
                    res: fiveDimensionInitial,
                    resEducation: result.education,
                    resResult: '',
                  }
                },
                fail: function(res){
                  console.error('五大维度-新的一年-用户：'+wxContext.OPENID+' 重置成功')
                }
              })
              
            }
        }
        else{
          return {
            resFinish: false,
            res: result.fiveDimension,
            resEducation: false,
            resResult: '',
          }
        }
      case('selfEsteem'):
        // 之前已经写过，不用再写了
          if(result.selfEsteemFinish==true && result.selfEsteemLastRecordTime != '' && typeof(result.selfEsteemLastRecordTime)!='undefined'){
            var startYear = new Date(result.selfEsteemLastRecordTime).getFullYear();
            var endYear = new Date().getFullYear()
            if(startYear == endYear){
              return {
                resResult: result.selfEsteemResult,
              }
            }
            else{
              var selfEsteemInitial = [
                0,0,0,0,0,0,0,0,0,0,
              ].join(",")
              db.collection('scale').where({
                _id: wxContext.OPENID
              }).update({
                data:{
                  selfEsteem: selfEsteemInitial,
                  selfEsteemFinish: false,
                  selfEsteemLastRecordTime: "",
                  selfEsteemResult: "",
                },
                success:function(res){
                  console.log('自尊量表-新的一年-用户：'+wxContext.OPENID+' 重置成功')
                  return {
                    resFinish: false,
                    res: selfEsteemInitial,
                    resResult: '',
                  }
                },
                fail: function(res){
                  console.error('自尊量表-新的一年-用户：'+wxContext.OPENID+' 重置成功')
                }
              })
            }
          }
          else{
            return {
              resFinish: false,
              res: result.selfEsteem,
              resResult: '',
            }
          }
          break;
      case('nervous'):
        // 之前已经写过，不用再写了
        if(result.nervousFinish==true && result.nervousLastRecordTime != '' && typeof(result.nervousLastRecordTime)!='undefined'){
          var startYear = new Date(result.nervousLastRecordTime).getFullYear();
          var endYear = new Date().getFullYear()
          if(startYear == endYear){
            return {
              resResult: result.nervousResult,
            }
          }
          else{
            var nervousInitial = [
              0,0,0,0,0,0,0,0,0,0,
              0,0,0,0,0,0,0,0,0,0,
            ].join(",")
            db.collection('scale').where({
              _id: wxContext.OPENID
            }).update({
              data:{
                nervous: nervousInitial,
                nervousFinish: false,
                nervousLastRecordTime: "",
                nervousResult: "",
              },
              success:function(res){
                console.log('焦虑量表-新的一年-用户：'+wxContext.OPENID+' 重置成功')
                return {
                  resFinish: false,
                  res: nervousInitial,
                  resResult: '',
                }
              },
              fail: function(res){
                console.error('焦虑量表-新的一年-用户：'+wxContext.OPENID+' 重置成功')
              }
            })
          }
        }
        else{
          return {
            resFinish: false,
            res: result.nervous,
            resResult: '',
          }
        }
        break;
      case('weekStatus'):
        // 之前已经写过，不用再写了
        if(result.weekStatusFinish==true && result.weekStatusLastRecordTime != '' && typeof(result.weekStatusLastRecordTime)!='undefined'){
          
          var targetDateFormat = new Date().Format('yyyy-MM-dd');
          const targetDate = new Date(targetDateFormat);
          const startDate = new Date(targetDate);
          startDate.setMonth(0);
          startDate.setDate(1);
          startDate.setHours(0,0,0,0);
          const millisecondsOfWeek = 1000 * 60 * 60 * 24 * 7;
          const diff = targetDate.valueOf() - startDate.valueOf();
          var endWeek = Math.ceil(diff / millisecondsOfWeek)
          var startWeek = Math.ceil((new Date(result.weekStatusLastRecordTime).valueOf() - startDate.valueOf()) / millisecondsOfWeek)
          console.log(targetDate.valueOf())
          console.log(new Date(result.weekStatusLastRecordTime).valueOf())
          console.log('上一次记录周：'+startWeek)
          console.log('这一次记录周：'+endWeek)
          if(startWeek == endWeek){
            return {
              resResult: result.weekStatusResult,
            }
          }
          else{
            var weekStatusInitial = [
              0,0,0,0,0,0,
            ].join(",")
            db.collection('scale').where({
              _id: wxContext.OPENID
            }).update({
              data:{
                weekStatus: weekStatusInitial,
                weekStatusFinish: false,
                weekStatusLastRecordTime: "",
                weekStatusResult: "",
              },
              success:function(res){
                console.log('一周状态量表-新的一年-用户：'+wxContext.OPENID+' 重置成功')
              },
              fail: function(res){
                console.error('一周状态量表-新的一年-用户：'+wxContext.OPENID+' 重置成功')
              }
            })
            return {
              resFinish: false,
              res: weekStatusInitial,
              resResult: '',
            }
          }
        }
        else{
          return {
            resFinish: false,
            res: result.weekStatus,
            resResult: '',
          }
        }
        break;
    }
  }
  // scale表里没有，增加
  else{
    var fiveDimensionInitial = [
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    ].join(",")
    var nervousInitial = [
      0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
    ].join(",")
    var selfEsteemInitial = [
      0,0,0,0,0,0,0,0,0,0
    ].join(",")
    var weekStatusInitial = [
      0,0,0,0,0,0
    ].join(",")
    db.collection('scale').add({
      data:{
        _id: wxContext.OPENID,
        age: 0,
        childOnly: false,
        education: "",
        fiveDimension: fiveDimensionInitial,
        fiveDimensionFinish: false,
        fiveDimensionLastRecordTime: "",
        fiveDimensionResult:"",
        gender: "",
        nervous: nervousInitial,
        nervousFinish: false,
        nervousLastRecordTime: "",
        nervousResult:"",
        selfEsteem: selfEsteemInitial,
        selfEsteemFinish: false,
        selfEsteemLastRecordTime: "",
        selfEsteemResult:"",
        weekStatus: weekStatusInitial,
        weekStatusFinish: false,
        weekStatusLastRecordTime: "",
        weekStatusResult:"",
      },
      success:function(res){
        console.log('scale增加成功')
      },
      fail:function(res){
        console.error('scale增加失败')
      }
    })
    switch(title){
      case('fiveDimension'):
        return {
          res: fiveDimensionInitial,
          resFinish: false,
          resResult: '',
        }
      case('selfEsteem'):
        return {
          res: selfEsteemInitial,
          resFinish: false,
          resResult: '',
        }
      case('nervous'):
        return {
          res: nervousInitial,
          resFinish: false,
          resResult: '',
        }
      case('weekStatus'):
        return {
          res: weekStatusInitial,
          resFinish: false,
          resResult: '',
        }
    }

  }
  



  
}