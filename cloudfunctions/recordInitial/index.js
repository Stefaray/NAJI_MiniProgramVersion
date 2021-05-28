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

  var dataArr = []
  var dateSet = {}
  
  var singleChoice = await db.collection('singleChoice').where({
    openid: wxContext.OPENID,
    // date:  _.and(_.gte(new Date(event.curYear, event.curMonth-1, 1)),_.lte(new Date(event.curYear, event.curMonth, 0))),
  }).get()
  var happyThing = await db.collection('happyThing').where({
    openid: wxContext.OPENID,
    // date:  _.and(_.gte(new Date(event.curYear, event.curMonth-1, 1)),_.lte(new Date(event.curYear, event.curMonth, 0))),
  }).orderBy('date', 'asc')
    .orderBy('todayIndex', 'asc')
    .get()
  var note = await db.collection('note').where({
    openid: wxContext.OPENID,
    // date:  _.and(_.gte(new Date(event.curYear, event.curMonth-1, 1)),_.lte(new Date(event.curYear, event.curMonth, 0))),
  }).get()

  // 遍历单选题
  for(var i in singleChoice.data){
    dateSet[singleChoice.data[i].date.Format("yyyy-M-d")] = ''
    // console.log()
    if(singleChoice.data[i].date.getFullYear()==event.curYear && singleChoice.data[i].date.getMonth()+1==event.curMonth){
      var nowDate = singleChoice.data[i].date.Format("yyyy-MM-dd")
      var judge = false
      for(var j in dataArr){
        if(dataArr[j].date == nowDate){
          judge = true
          dataArr[j].choice = singleChoice.data[i].choice.split(",")
          for(var k in dataArr[j].choice){
            dataArr[j].choice[k] = parseInt(dataArr[j].choice[k])
          }
          dataArr[j].isFinish = singleChoice.data[i].isFinish
          dataArr[j].rate   = singleChoice.data[i].rate
          break;
        }
      }
      if(!judge){
        var newObj = {}
        newObj.happyThing = []
        newObj.date = nowDate
        newObj.choice = singleChoice.data[i].choice.split(",")
        for(var k in newObj.choice){
          newObj.choice[k] = parseInt(newObj.choice[k])
        }
        newObj.isFinish = singleChoice.data[i].isFinish
        newObj.rate   = singleChoice.data[i].rate
        newObj.note = ''
        dataArr.push(newObj)
      }
    }
  }
  // 遍历快乐事
  for(var i in happyThing.data){
    dateSet[happyThing.data[i].date.Format("yyyy-M-d")] = ''
    if(happyThing.data[i].date.getFullYear()==event.curYear && happyThing.data[i].date.getMonth()+1==event.curMonth){
      var nowDate = happyThing.data[i].date.Format("yyyy-MM-dd")
      var judge = false
      for(var j in dataArr){
        if(dataArr[j].date == nowDate){
          judge = true
          var newObj = {}
          newObj.happyThingText = happyThing.data[i].happyThingText
          newObj.isSharing = happyThing.data[i].isSharing
          newObj.photoURL   = happyThing.data[i].photoURL
          dataArr[j].happyThing[happyThing.data[i].todayIndex] = newObj
          break;
        }
      }
      if(!judge){
        var newObj = {}
        newObj.date = nowDate
        newObj.happyThing = []
        newObj.rate = ''
        newObj.isFinish = false
        newObj.choice = [0,0,0,0,0,0]
        newObj.note = ''
        var newObj2 = {}
        newObj2.happyThingText = happyThing.data[i].happyThingText
        newObj2.isSharing = happyThing.data[i].isSharing
        newObj2.photoURL   = happyThing.data[i].photoURL
        var index = happyThing.data[i].todayIndex
        // console.log(index)
        newObj.happyThing[index] = newObj2

        dataArr.push(newObj)
      }
    }
  }
  // 遍历随手小记
  for(var i in note.data){
    dateSet[note.data[i].date.Format("yyyy-M-d")] = ''
    if(note.data[i].date.getFullYear()==event.curYear && note.data[i].date.getMonth()+1==event.curMonth){
      var nowDate = note.data[i].date.Format("yyyy-MM-dd")
      var judge = false
      for(var j in dataArr){
        if(dataArr[j].date == nowDate){
          judge = true
          dataArr[j].note = note.data[i].noteHTML
          break;
        }
      }
      if(!judge){
        var newObj = {}
        newObj.happyThing = []
        newObj.date = nowDate
        newObj.note = note.data[i].noteHTML
        newObj.rate = ''
        newObj.isFinish = false
        newObj.choice = [0,0,0,0,0,0]
        dataArr.push(newObj)
      }
    }
  }
  dataArr.sort(function(a,b){
      return b.date<a.date;    // -1 升序排列 
  })

  var mydate = new Date()
  mydate.setHours(mydate.getHours() + 8);
  var today = mydate.Format("yyyy-MM-dd")
  // 如果是本月，再加一天
  if(event.curYear==mydate.getFullYear() && event.curMonth==mydate.getMonth()+1){
    var judge = false
    for(var i in dataArr){
      if(dataArr[i].date == today){
        judge = true
        break;
      }
    }
    if(!judge){
      var newObj = {}
      var nowDate = today

      newObj.happyThing = []
      newObj.date = nowDate
      newObj.note = ''
      newObj.rate = ''
      newObj.isFinish = false
      newObj.choice = [0,0,0,0,0,0]
      dataArr.push(newObj)
    }
    
  }

  

  var dateArr = []
  for(var i in dateSet){
    dateArr.push(i)
  }
  console.log(dateSet)
  console.log(dateArr)
  return {
    res: dataArr,
    dateArr: dateArr,
  }
}