// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ =db.command

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

  var result = await db.collection('singleChoice').where({
    openid: wxContext.OPENID,
    date:  _.and(_.gte(new Date(event.year, event.month-1, 1)),_.lte(new Date(event.year, event.month, 0))),
  }).get()
  
  var monthData = result.data
  var graphData = []
  var lineData = []
  var tmpGraphData = 0
  var tmpLineData = 0
  if(event.type == 'prev' || event.type == 'next'){
    if(monthData.length==0){
      var user = await db.collection('user').doc(wxContext.OPENID).get()
      var signUpDay = user.data.date
      console.log(signUpDay)
      var signUpYear = signUpDay.getFullYear()
      var signUpMonth = signUpDay.getMonth()+1
      var judge = false
      if((signUpYear==event.year&&signUpMonth<=event.month) || (signUpYear<event.year))
        judge = true
      if(!judge){
        return {
          signal: 'fail'
        }
      }
    }
    for(var i in monthData){
      // tmpLineData
      if(monthData[i].rate>=-18 && monthData[i].rate<-12){
        tmpLineData = 0
      }
      else if(monthData[i].rate>=-12 && monthData[i].rate<0){
        tmpLineData = 1
      }
      else if(monthData[i].rate>=0 && monthData[i].rate<9){
        tmpLineData = 2
      }
      else if(monthData[i].rate>=9 && monthData[i].rate<=11){
        tmpLineData = 3
      }
      else if(monthData[i].rate>=12 && monthData[i].rate<=18){
        tmpLineData = 4
      }
      // tmpGraphData
      tmpGraphData = Math.round((monthData[i].rate+18)/7.2 * 100) / 100 

      // Graph
      var perData = []
      perData.push(monthData[i].date.Format('yyyy-MM-dd'))
      perData.push(tmpGraphData) 
      graphData.push(perData)
      // Line
      lineData.push(tmpLineData)
    }
    return {
      graphRes: graphData,
      lineRes: lineData,
      signal: 'success'
    }
  }
  // onLoad
  for(var i in monthData){
    // tmpLineData
    if(monthData[i].rate>=-18 && monthData[i].rate<-12){
      tmpLineData = 0
    }
    else if(monthData[i].rate>=-12 && monthData[i].rate<0){
      tmpLineData = 1
    }
    else if(monthData[i].rate>=0 && monthData[i].rate<9){
      tmpLineData = 2
    }
    else if(monthData[i].rate>=9 && monthData[i].rate<=11){
      tmpLineData = 3
    }
    else if(monthData[i].rate>=12 && monthData[i].rate<=18){
      tmpLineData = 4
    }
    // tmpGraphData
    tmpGraphData = Math.round((monthData[i].rate+18)/7.2 * 100) / 100 

    // Graph
    var perData = []
    perData.push(monthData[i].date.Format('yyyy-MM-dd'))
    perData.push(tmpGraphData) 
    graphData.push(perData)
    // Line
    lineData.push(tmpLineData)
  }
  return {
    graphRes: graphData,
    lineRes: lineData,
  }
}

