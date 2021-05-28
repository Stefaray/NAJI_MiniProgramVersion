// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
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

  //<!-- E量表 -->
  var E=[41,45,50,53,54,57,65,73,77,81,89,93,95,101,105,111,120,124]
  var E_=[61,69,85]
  //<!-- N量表 -->
  var N=[43,47,52,55,59,63,67,71,75,79,83,87,91,97,99,103,107,109,113,114,117,118,122,126]
  //<!-- P量表 -->
  var P=[62,66,70,74,86,90,106,108,102,112,115,116,121,125,128]
  var P_=[42,46,49,51,58,78,82,96]
  //<!-- 抑郁BDI -->
  var BDI=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
  //<!-- 简式应对方式 -->
  var SCSQ=[21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
  
  var user = await db.collection('scale').doc(wxContext.OPENID).get()
  var data = user.data.fiveDimension.split(",")
  var gender = event.profile.gender

  // console.log(data[42])
  //********开始计算*********//
  // E
  var E_Rate = 0
  for(var i in E){
    if(data[E[i]] == "A")
      E_Rate++;
  }
  for(var i in E_){
    if(data[E[i]] == "B")
      E_Rate++;
  }
  // N
  var N_Rate = 0
  for(var i in N){
    if(data[N[i]] == "A")
      N_Rate++;
  }
  // P
  var P_Rate = 0
  for(var i in P){
    if(data[P[i]] == "A")
      P_Rate++;
  }
  for(var i in P_){
    if(data[P[i]] == "B")
      P_Rate++;
  }
  // BDI
  var BDI_Rate = 0
  for(var i in BDI){
    if(data[BDI[i]] == "A")
      BDI_Rate+=1;
    else if(data[BDI[i]] == "B")
      BDI_Rate+=2;
    else if(data[BDI[i]] == "C")
      BDI_Rate+=3;
    else if(data[BDI[i]] == "D")
      BDI_Rate+=4;
  }
  // SCSQ
  var SCSQ_Rate = 0
  var SCSQ_Rate1 = 0
  var SCSQ_Rate2 = 0
  for(var i in SCSQ){
    if(i<=32){
      if(data[SCSQ[i]] == "A")
        SCSQ_Rate1+=1;
      else if(data[SCSQ[i]] == "B")
        SCSQ_Rate1+=2;
      else if(data[SCSQ[i]] == "C")
        SCSQ_Rate1+=3;
      else if(data[SCSQ[i]] == "D")
        SCSQ_Rate1+=4;
    }
    else{
      if(data[SCSQ[i]] == "A")
        SCSQ_Rate2+=1;
      else if(data[SCSQ[i]] == "B")
        SCSQ_Rate2+=2;
      else if(data[SCSQ[i]] == "C")
        SCSQ_Rate2+=3;
      else if(data[SCSQ[i]] == "D")
        SCSQ_Rate2+=4;
    }
  }
  SCSQ_Rate=(SCSQ_Rate1 - 2.78)/0.52 - (SCSQ_Rate2 - 2.59)/0.66

  if(gender=='男'){
    E_Rate = 50+10*(E_Rate-9.93)/4.39
    N_Rate = 50+10*(N_Rate-10.06)/4.62
    P_Rate = 50+10*(P_Rate-6.08)/3.22
  }
  else{
    E_Rate = 50+10*(E_Rate-9.03)/4.12
    N_Rate = 50+10*(N_Rate-10.98)/4.66
    P_Rate = 50+10*(P_Rate-5.34)/2.95
  }
  
  var E_Res,N_Res,P_Res,BDI_Res,SCSQ_Res;
  //映射E_Rate的结果
  if(E_Rate<38.5)
    E_Res = '典型内向'
  else if(E_Rate>=38.5 && E_Rate<43.3)
    E_Res = '比较内向'
  else if(E_Rate>=43.3 && E_Rate<56.7)
    E_Res = '中间形态'
  else if(E_Rate>=56.7 && E_Rate<61.5)
    E_Res = '比较外向'
  else if(E_Rate>=61.5)
    E_Res = '典型外向'
  //映射N_Rate的结果
  if(N_Rate<38.5)
    N_Res = '情绪非常稳定'
  else if(N_Rate>=38.5 && N_Rate<43.3)
    N_Res = '情绪比较稳定'
  else if(N_Rate>=43.3 && N_Rate<56.7)
    N_Res = '中间形态'
  else if(N_Rate>=56.7 && N_Rate<61.5)
    N_Res = '情绪不太稳定'
  else if(N_Rate>=61.5)
    N_Res = '情绪波动较大'
  //映射P_Rate的结果
  if(P_Rate<38.5)
    P_Res = '适应性极强'
  else if(P_Rate>=38.5 && P_Rate<43.3)
    P_Res = '适应性较强'
  else if(P_Rate>=43.3 && P_Rate<56.7)
    P_Res = '适应性不错'
  else if(P_Rate>=56.7 && P_Rate<61.5)
    P_Res = '适应性一般'
  else if(P_Rate>=61.5)
    P_Res = '适应性欠佳'
  //映射BDI_Rate的结果
  if(BDI_Rate>=21 && BDI_Rate<=30)
    BDI_Res = '无抑郁症状'
  else if(BDI_Rate>=31 && BDI_Rate<=39)
    BDI_Res = '轻度抑郁'
  else if(BDI_Rate>=40 && BDI_Rate<=50)
    BDI_Res = '中度抑郁'
  else if(BDI_Rate>=51 && BDI_Rate<=84)
    BDI_Res = '重度抑郁'
  //映射SCSQ_Rate的结果
  if(SCSQ_Rate>0)
    SCSQ_Res = '偏积极'
  else if(SCSQ_Rate<0)
    SCSQ_Res = '偏消极'
  else if(SCSQ_Rate==0)
    SCSQ_Res = '混合型'

  var rate = [E_Rate,N_Rate,P_Rate,BDI_Rate,SCSQ_Rate].join(",")
  console.log(rate)
  var res = [E_Res,N_Res,P_Res,BDI_Res,SCSQ_Res].join(",")
  console.log(res)

  db.collection('scale').doc(wxContext.OPENID).update({
    data:{
      fiveDimensionLastRecordTime: new Date().Format("yyyy-MM-dd"),
      fiveDimensionResult: res,
      fiveDimensionRate: rate,
      age: event.profile.age,
      childOnly: event.profile.childOnly,
      gender: event.profile.gender,
      education: event.profile.education,
    }
  })


  return {
    resResult: res,
    rate: rate,
  }
}

  
