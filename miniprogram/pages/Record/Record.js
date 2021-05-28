// pages/Record/Record.js
import todo from '../../components/v2/plugins/todo'
import selectable from '../../components/v2/plugins/selectable'
import solarLunar from '../../components/v2/plugins/solarLunar/index'
import timeRange from '../../components/v2/plugins/time-range'
import week from '../../components/v2/plugins/week'
import holidays from '../../components/v2/plugins/holidays/index'
import plugin from '../../components/v2/plugins/index'

plugin
  .use(todo)
  .use(solarLunar)
  .use(selectable)
  .use(week)
  .use(timeRange)
  .use(holidays)


Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    //*******总页面********//
    // dataArr:[
    //   {
    //     date:"2021-04-16",
    //     isFinish: false,
    //     choice:[0,0,0,0,0,0],
    //     rate:0,
    //     happyThing:[
    //         {
    //             photoURL:"",
    //             happyThingText:"",
    //             isSharing:false
    //         }
    //     ],
    //     note:'<p>2021/04/16</p><p>32432</p><ol><li>32432432</li><li>432</li></ol><ul><li>4234234234</li><li>456</li></ul><p>54654</p><p>65</p><p>46</p><p>5</p><p>6</p><p>65<strong>很多事难<u>32442343243</u></strong></p><p><strong><u>3243</u></strong></p><p><strong><u>24</u></strong></p><p><strong><u>32</u></strong></p><p><strong><u>424</u></strong></p>'
    //   },
    //   {
    //     date:"2021-04-17",
    //     isFinish: false,
    //     choice:[0,0,0,0,0,0],
    //     rate:0,
    //     happyThing:[
    //         {
    //             photoURL:"",  
    //             happyThingText:"",
    //             isSharing:false
    //         }
    //     ],
    //     note:'<p>2021/04/17</p><p>32432</p><ol><li>32432432</li><li>432</li></ol><ul><li>4234234234</li><li>456</li></ul><p>54654</p><p>65</p><p>46</p><p>5</p><p>6</p><p>65<strong>很多事难<u>32442343243</u></strong></p><p><strong><u>3243</u></strong></p><p><strong><u>24</u></strong></p><p><strong><u>32</u></strong></p><p><strong><u>424</u></strong></p>'
    //   },
    // ],
    dataArr: [],
    // 页面索引
    curIndex:-1,
    curPage:0,
    nowYear:0,
    nowMonth:0,
    //*******总页面********//

    //*******statusMain********//
      indicatorDots:false,
    //*******statusMain********//

    // 快乐事模块 begin
      happyThingCount:1,
    // 快乐事模块 end

      height: 20,
      focus: false,


    //*****单选题模块 begin*****//
      question:['我感觉胃口很好且摄入量适中','我感到心情愉悦','我感觉自己有活力',
                '我对生活中的事物充满兴趣','我能正常入睡和睡醒','我觉得心平气和，并且容易安静地坐着'],
      sortArr : [0,0,0,0,0,0],
      //应该显示第几个单选题
      newRadioIndex:0,
    //*****单选题模块 end*****//
    // 日历数据
      calanderShow:false,
      calendarConfig: {
        theme: 'default'
      },
      dateArr:[],
      
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    onLoad: function() {
      const that = this
      // 单选题打乱顺序
      var notSortArr=new Array(); 
      notSortArr = [0,1,2,3,4,5];

      // 调用记录页初始化云函数
      var mydate = new Date()
      mydate.setHours(mydate.getHours() + 8);
      var curYear = mydate.getFullYear()
      var curMonth = mydate.getMonth()+1
      wx.cloud.callFunction({
        name:'recordInitial',
        data:{
          curYear: curYear,
          curMonth: curMonth,
        },
        success:function(res){
          that.data.nowYear = curYear
          that.data.nowMonth = curMonth
          console.log(res.result)
          // 日历日期映射
          that.data.dateArr = res.result.dateArr
          const calendar = that.selectComponent('#calendar').calendar
          const dates = res.result.dateArr
          calendar['enableDates'](dates)
          
          // 设置单选题完成后的值
          for(var i in res.result.res){
            if(res.result.res[i].rate == 0 || res.result.res[i].rate != ''){
              if(res.result.res[i].rate>=-18 && res.result.res[i].rate<-12){
                res.result.res[i].resExpressionSrc = "../../style/record/resExpression/baobao.png"
                res.result.res[i].resTitle = "抱抱，今天辛苦啦"
                res.result.res[i].resDesc = "3天内一定会有好事发生~"
              }
              else if(res.result.res[i].rate>=-12 && res.result.res[i].rate<0){
                res.result.res[i].resExpressionSrc = "../../style/record/resExpression/momo.png"
                res.result.res[i].resTitle = "摸摸，会好起来的！"
                res.result.res[i].resDesc = "总有一束光，为你而来"
              }
              else if(res.result.res[i].rate>=0 && res.result.res[i].rate<9){
                res.result.res[i].resExpressionSrc = "../../style/record/resExpression/bucuo.png"
                res.result.res[i].resTitle = "不错，你真的很不错"
                res.result.res[i].resDesc = "日子平凡往复，却也熠熠生辉"
              }
              else if(res.result.res[i].rate>=9 && res.result.res[i].rate<=11){
                res.result.res[i].resExpressionSrc = "../../style/record/resExpression/henhao.png"
                res.result.res[i].resTitle = "很好，今天也在好好生活呢"
                res.result.res[i].resDesc = "愿你眼中总有光芒，愿你活出想要的模样"
              }
              else if(res.result.res[i].rate>=12 && res.result.res[i].rate<=18){
                res.result.res[i].resExpressionSrc = "../../style/record/resExpression/chaobang.png"
                res.result.res[i].resTitle = "超棒，活力满满诶！"
                res.result.res[i].resDesc = "愿你一生努力，一生被爱"
              }
            }
          }
          that.setData({
            dataArr: res.result.res,
            curPage: res.result.res.length-1,
          })
        },
        fail:function(res){
          console.error(res)
          
        }

      })

      this.setData({
        sortArr : notSortArr.sort(this.randomsort)
      })

      
    },
    // *****整个页面 begin *****// 
    selfGroomingEvent(){
      wx.showToast({
        title: '自主疏导模块暂未开启~敬请期待',
        icon:'none',
        duration:1500,
      })
    },

    // 日历begin
    controlCalanderShow(){
      this.setData({
        calanderShow:true,
      })
    },
    controlCalanderHide(){
      this.setData({
        calanderShow:false,
      })
    },
    afterCalendarRender(e) {
      const calendar = this.selectComponent('#calendar').calendar
      const { year, month } = calendar.getCurrentYM()
      // const dates = this.data.dateArr
      console.log('afterCalendarRender')
      const dates = [
        // `${year}-${month}-${5}`,
        // `${year}-${month}-${6}`,
        // `${year}-${month}-${15}`,
        // `${year}-${month}-${16}`,
        // '2021-5-19',
      ]
      calendar['enableDates'](dates)
      this.setData({
        rstStr: JSON.stringify(dates)
      })
    },
    generateRandomDate(type) {
      let random = ~~(Math.random() * 10)
      switch (type) {
        case 'year':
          random = 201 * 10 + ~~(Math.random() * 10)
          break
        case 'month':
          random = (~~(Math.random() * 10) % 9) + 1
          break
        case 'date':
          random = (~~(Math.random() * 100) % 27) + 1
          break
        default:
          break
      }
      return random
    },
    afterTapDate(e) {
      const that = this
      console.log('afterTapDate', e.detail)
      var year = e.detail.year
      var month = e.detail.month
      if(this.data.nowYear==year && this.data.nowMonth==month){
        for(var i in this.data.dataArr){
          var dayInt = parseInt(this.data.dataArr[i].date.split("-")[2]) 
          console.log(dayInt)
          if(e.detail.date == dayInt){
            this.data.curPage = i
            this.setData({
              curPage: this.data.curPage
            })
            break
          }
        }
      }
      else{
        // 单选题打乱顺序
        var notSortArr=new Array(); 
        notSortArr = [0,1,2,3,4,5];

        // 调用记录页初始化云函数

        var curYear = year
        var curMonth = month
        wx.cloud.callFunction({
          name:'recordInitial',
          data:{
            curYear: curYear,
            curMonth: curMonth,
          },
          success:function(res){
            that.data.nowYear = curYear
            that.data.nowMonth = curMonth

            for(var i in res.result.res){
              var dayInt = parseInt(res.result.res[i].date.split("-")[2]) 
              console.log(dayInt)
              if(e.detail.date == dayInt){
                that.data.curPage = i
                break
              }
            }
            console.log(res.result)
            // 日历日期映射
            // that.data.dateArr = res.result.dateArr
            // const calendar = that.selectComponent('#calendar').calendar
            // const dates = res.result.dateArr
            // calendar['enableDates'](dates)
            
            // 设置单选题完成后的值
            for(var i in res.result.res){
              if(res.result.res[i].rate == 0 || res.result.res[i].rate != ''){
                if(res.result.res[i].rate>=-18 && res.result.res[i].rate<-12){
                  res.result.res[i].resExpressionSrc = "../../style/record/resExpression/baobao.png"
                  res.result.res[i].resTitle = "抱抱，今天辛苦啦"
                  res.result.res[i].resDesc = "3天内一定会有好事发生~"
                }
                else if(res.result.res[i].rate>=-12 && res.result.res[i].rate<0){
                  res.result.res[i].resExpressionSrc = "../../style/record/resExpression/momo.png"
                  res.result.res[i].resTitle = "摸摸，会好起来的！"
                  res.result.res[i].resDesc = "总有一束光，为你而来"
                }
                else if(res.result.res[i].rate>=0 && res.result.res[i].rate<9){
                  res.result.res[i].resExpressionSrc = "../../style/record/resExpression/bucuo.png"
                  res.result.res[i].resTitle = "不错，你真的很不错"
                  res.result.res[i].resDesc = "日子平凡往复，却也熠熠生辉"
                }
                else if(res.result.res[i].rate>=9 && res.result.res[i].rate<=11){
                  res.result.res[i].resExpressionSrc = "../../style/record/resExpression/henhao.png"
                  res.result.res[i].resTitle = "很好，今天也在好好生活呢"
                  res.result.res[i].resDesc = "愿你眼中总有光芒，愿你活出想要的模样"
                }
                else if(res.result.res[i].rate>=12 && res.result.res[i].rate<=18){
                  res.result.res[i].resExpressionSrc = "../../style/record/resExpression/chaobang.png"
                  res.result.res[i].resTitle = "超棒，活力满满诶！"
                  res.result.res[i].resDesc = "愿你一生努力，一生被爱"
                }
              }
            }
            that.setData({
              dataArr: res.result.res,
              curPage: that.data.curPage,
            })
          },
          fail:function(res){
            console.error(res)
            
          }

        })

        this.setData({
          sortArr : notSortArr.sort(this.randomsort)
        })
      }
      
      
    },
    // *****整个页面 end *****// 

    // *****单选题 begin *****// 
    // 排序函数---随机排序
    randomsort: function(a, b) {
      return Math.random()>.5 ? -1 : 1; 
    },
    // 排序函数---将打乱题目排好顺序
    targetSort: function(a, b){
      return a.rule - b.rule
    },
    // 单选题按钮事件
    radioCheck: function(e){
      console.log(e)
      console.log(e.target.dataset.totalindex)
      var cur_index=e.target.dataset.totalindex
      var cur_radio=e.target.dataset.radioindex
      var value = e.detail.value
      // 设置全局页面索引，方便editor页查询
      
      this.data.dataArr[cur_index].choice[cur_radio] = parseInt(value)
      console.log(this.data.dataArr[cur_index].choice)//
      var judge = true
      var newRadioIndex = 0
      for(var i=0; i<6; i++){
        if(this.data.dataArr[cur_index].choice[i] == 0){
          judge = false
          newRadioIndex = i
          this.setData({
            newRadioIndex: newRadioIndex
          })
          break;
        }
      }
      if(judge){
        // 生成对象数组，排成目标序列
        var objArr = [
          {res: this.data.dataArr[cur_index].choice[0], rule: this.data.sortArr[0]},
          {res: this.data.dataArr[cur_index].choice[1], rule: this.data.sortArr[1]},
          {res: this.data.dataArr[cur_index].choice[2], rule: this.data.sortArr[2]},
          {res: this.data.dataArr[cur_index].choice[3], rule: this.data.sortArr[3]},
          {res: this.data.dataArr[cur_index].choice[4], rule: this.data.sortArr[4]},
          {res: this.data.dataArr[cur_index].choice[5], rule: this.data.sortArr[5]},
        ]
        objArr.sort(this.targetSort)
        var targetArr = []
        var score = [0,-3,-2,-1,0,1,2,3]
        this.data.dataArr[cur_index].rate = 0
        for(var i in objArr){
          targetArr.push(objArr[i].res)
          this.data.dataArr[cur_index].rate += score[objArr[i].res]
        }

        console.log(this.data.dataArr[cur_index].rate)
        
        var tempRate = this.data.dataArr[cur_index].rate

        if(tempRate>=-18 && tempRate<-12){
          this.data.dataArr[cur_index].resExpressionSrc = "../../style/record/resExpression/baobao.png"
          this.data.dataArr[cur_index].resTitle = "抱抱，今天辛苦啦"
          this.data.dataArr[cur_index].resDesc = "3天内一定会有好事发生~"
        }
        else if(tempRate>=-12 && tempRate<0){
          this.data.dataArr[cur_index].resExpressionSrc = "../../style/record/resExpression/momo.png"
          this.data.dataArr[cur_index].resTitle = "摸摸，会好起来的！"
          this.data.dataArr[cur_index].resDesc = "总有一束光，为你而来"
        }
        else if(tempRate>=0 && tempRate<9){
          this.data.dataArr[cur_index].resExpressionSrc = "../../style/record/resExpression/bucuo.png"
          this.data.dataArr[cur_index].resTitle = "不错，你真的很不错"
          this.data.dataArr[cur_index].resDesc = "日子平凡往复，却也熠熠生辉"
        }
        else if(tempRate>=9 && tempRate<=11){
          this.data.dataArr[cur_index].resExpressionSrc = "../../style/record/resExpression/henhao.png"
          this.data.dataArr[cur_index].resTitle = "很好，今天也在好好生活呢"
          this.data.dataArr[cur_index].resDesc = "愿你眼中总有光芒，愿你活出想要的模样"
        }
        else if(tempRate>=12 && tempRate<=18){
          this.data.dataArr[cur_index].resExpressionSrc = "../../style/record/resExpression/chaobang.png"
          this.data.dataArr[cur_index].resTitle = "超棒，活力满满诶！"
          this.data.dataArr[cur_index].resDesc = "愿你一生努力，一生被爱"
        }

        this.data.dataArr[cur_index].isFinish = true
        this.setData({
          dataArr: this.data.dataArr,
        })
        console.log(this.data.dataArr)
        var targetStr = String(targetArr)
        // 调用云函数，上传单选题数据
        wx.cloud.callFunction({
          name:'choiceUpload',
          data:{
            choiceStr: targetStr,
            curDate:   this.data.dataArr[cur_index].date,
            rate:      this.data.dataArr[cur_index].rate,
          },
          success:function(res){
            console.log('****执行云函数choiceUpload成功****')
            // console.log(res)
          },
          fail:function(){
            console.error('执行云函数choiceUpload失败')
          }
        })
        
      }
      
    },
    // *****单选题 end   *****// 


    // *****快乐事 begin *****//
    // photoURL
    afterRead:function(e){
      // 更新页面的dataArr对象，加上暂时图片链接
      console.log(e)
      var cur_index=e.target.dataset.totalindex
      var cur_happythingindex=e.target.dataset.happythingindex
      var tempObj = {}
      var prevPhoto = ''
      if(this.data.dataArr[cur_index].happyThing.length == 0){
        this.data.dataArr[cur_index].happyThing.push(tempObj)
      }
      prevPhoto = this.data.dataArr[cur_index].happyThing[cur_happythingindex].photoURL
      this.data.dataArr[cur_index].happyThing[cur_happythingindex].photoURL = e.detail.file.url
      this.setData({
        dataArr: this.data.dataArr
      })
      console.log(this.data.dataArr[cur_index].happyThing)

      // 上传图片到云函数
      wx.getFileSystemManager().readFile({
        filePath: e.detail.file.url, //选择图片返回的相对路径
        encoding: 'base64', //编码格式
        success: res => { //成功的回调
          wx.cloud.callFunction({
            name:'happyThingUpload',
            data:{
              type:'photoURL',
              tmpPhotoURL: res.data,
              curDate: this.data.dataArr[cur_index].date,
              todayIndex: cur_happythingindex,
              prevPhoto: prevPhoto
            },
            success:function(res){
              console.log('上传成功')
            },
            fail:function(res){
              console.log('上传失败')
            }
          })
        }
      })

      
    },
    // happyThingText
    textChange(e){
      // console.log(e)
      var cur_index=e.target.dataset.totalindex
      var cur_happythingindex=e.target.dataset.happythingindex
      var tempObj = {}
      var prevText = ''
      if(this.data.dataArr[cur_index].happyThing.length == 0){
        this.data.dataArr[cur_index].happyThing.push(tempObj)
      }
      prevText = this.data.dataArr[cur_index].happyThing[cur_happythingindex].happyThingText
      if(typeof(prevText)=="undefined"){
        prevText = ''
      }
      this.data.dataArr[cur_index].happyThing[cur_happythingindex].happyThingText = e.detail.value
      // this.setData({
      //   dataArr: this.data.dataArr
      // })

      // 上传happyThingText到云函数
      if(prevText != e.detail.value){
        wx.cloud.callFunction({
          name:'happyThingUpload',
          data:{
            type:'happyThingText',
            happyThingText: e.detail.value,
            curDate: this.data.dataArr[cur_index].date,
            todayIndex: cur_happythingindex,
          },
          success:function(res){
            console.log('happyThingText上传数据库成功')
          },
          fail:function(res){
            console.log('happyThingText上传数据库失败')
          }
        })
      }
      else{
        console.log(this.data.dataArr[cur_index].date+' '+' - 索引'+cur_happythingindex+' - happyThingText不变 ')
      }
      

    },
    // isSharing
    quickShare(e){
      // console.log(e)
      var cur_index=e.currentTarget.dataset.totalindex
      var cur_happythingindex=e.currentTarget.dataset.happythingindex
      var tempObj = {}
      var prevSharing = ''
      if(this.data.dataArr[cur_index].happyThing.length == 0){
        this.data.dataArr[cur_index].happyThing.push(tempObj)
      }
      console.log(this.data.dataArr[cur_index].happyThing[cur_happythingindex])
      if(typeof(this.data.dataArr[cur_index].happyThing[cur_happythingindex].photoURL)=='undefined'||this.data.dataArr[cur_index].happyThing[cur_happythingindex].photoURL=="" && typeof(this.data.dataArr[cur_index].happyThing[cur_happythingindex].happyThingText)=='undefined'||this.data.dataArr[cur_index].happyThing[cur_happythingindex].happyThingText==""){
        wx.showToast({
          title: '您还未记录快乐事~',
          icon: 'none',
          duration: 2000
        })
      }
      else{
        prevSharing = this.data.dataArr[cur_index].happyThing[cur_happythingindex].isSharing
        this.data.dataArr[cur_index].happyThing[cur_happythingindex].isSharing = !prevSharing
        this.setData({
          dataArr: this.data.dataArr
        })
        // 上传happyThingText到云函数
        wx.cloud.callFunction({
          name:'happyThingUpload',
          data:{
            type:'isSharing',
            isSharing: !prevSharing,
            curDate: this.data.dataArr[cur_index].date,
            todayIndex: cur_happythingindex,
          },
          success:function(res){
            console.log('快乐事-isSharing-上传数据库成功')
          },
          fail:function(res){
            console.log('快乐事-isSharing-上传数据库失败')
          }
        })
      }
    },
    // 再来一件 快乐事
    happyThingAgain(e){
      // console.log(e.target.dataset.totalindex)
      var cur_index=e.target.dataset.totalindex
      var space_obj = {
        happyThingText:'',
        photoURL: '',
        isSharing: false
      }
      if(this.data.dataArr[cur_index].happyThing.length < 3){
        this.data.dataArr[cur_index].happyThing.push(space_obj)
        this.setData({
          dataArr: this.data.dataArr
        })
      }
      else{
        wx.showToast({
          title: '每日最多书写 3 件快乐事哦！',
          icon: 'none',
          duration: 2000
        })
      }
      

    },
    
    // *****快乐事 end *****//
    

    // *****随手小记事件 begin *****//

    // rich-text点击
    editNote: function(e){
      // console.log(e.currentTarget.dataset.totalindex);
      this.data.curIndex = e.currentTarget.dataset.totalindex
      wx.navigateTo({
        url:'editor/editor'
      })
    },


    bindHappyThingFormSubmit: function(e) {
      console.log(e.detail.value.textarea)
    },
  
    bindButtonTap: function() {
      this.setData({
        focus: true
      })
    },
    bindTextAreaBlur: function(e) {
      console.log(e.detail.value)
    },
    bindFormSubmit: function(e) {
      console.log(e.detail.value.textarea)
    },



  }
})


