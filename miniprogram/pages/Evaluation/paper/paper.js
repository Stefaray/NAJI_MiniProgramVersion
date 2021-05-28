// pages/Evaluation/paper/paper.js
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
    scaleFinish:   false,
    profileFinish: false,
    title: "",

    radio: 0,
    answer:[],
    group :[],
    nowPageIndex:0,
    twentyOneAnswer : [],
    question:[],
    scaleFinishStop: false,
    claim:'',

    finishDialogShow: false,
    finishButtons: [{text: '取消'}, {text: '确定'}],
    finishDialogContent:"",
    finishDialogTitle:"",

    genderItems: [
      {name: '男', value: '男', checked: false},
      {name: '女', value: '女'}
    ],
    formData: {
      age: '',
      gender: '',
      education: '',
      childOnly: '',
    },
    educations: ["小学", "初中", "高中","本科","硕士","博士"],
    educationIndex: -1,
    childOnlyItems: [
      {name: '是', value: '是', checked: false},
      {name: '否', value: '否'}
    ],
    testData:'🔸你<center>的测试结果</center>表明你当前处于<strong>轻度抑郁</strong>状态，在日常生活中，你经常会纠结于生活中不好的事情，对自己和生活没有信心，愧疚、多疑，总是将外界的敌意或过错归到自己身上。白天学习或工作的时候，你可能会有些难以集中注意力；而在某些夜晚则在床上辗转反侧、无<span class="red">法入睡。你可能容易</span>感到不安和悲伤，或是觉得烦躁或低落。<br/>🔸不用过分担忧，你只是有些轻微的抑郁症状，轻度抑郁是能够通过调整心态、规律作息等方法自我疗愈的，坚持锻炼、健康饮食、培养固定的睡眠时间、多和家人朋友聊聊天——请不要轻视这些日常小事，它们都是能让你的心情重新明媚起来的有效方法——<br/>😊最重要的是，保持良好的心态，不要放纵自己被负面情绪拖垮。我明白，生活中存在太多不如人意之事，你可以愤怒、可以悲伤、甚至可以嚎啕大哭，但请不要用消极的心态长久地惩罚自己。因为只要生活还在继续，快乐的闪光总会照亮那一小片黑暗，而抓住那些生命的光点，并努力让自己向它们靠近，幸福的温度会比想象中更加温暖而让人感动。<br/>'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 表单事件
    ageEvent(e){
      console.log(e.detail.value)
      this.data.formData.age = e.detail.value
    },
    genderEvent(e){
      console.log(e.detail.value)
      this.data.formData.gender = e.detail.value
    },
    educationEvent(e){
      this.setData({
        educationIndex: e.detail.value
      })
      console.log(this.data.educations[parseInt(e.detail.value)])
      this.data.formData.education = this.data.educations[parseInt(e.detail.value)]
    },
    childOnlyEvent(e){
      console.log(e.detail.value)
      this.data.formData.childOnly = e.detail.value
    },
    profileFinish(e){
      console.log(this.data.formData)
      var user = this.data.formData
      var judge = true
      if(user.age=="" || user.gender=="" || user.education=="" || user.childOnly==""){
        judge = false
      }
      if(judge){
        wx.cloud.callFunction({
          name:'profileFinish',
          data:{
            profile: user,
          },
          success:function(res){
            console.log(res)
            wx.redirectTo({
              url: '../result/result?title=fiveDimension&result='+res.result.resResult,
            })
          },
          fail: function(res){
            console.error(res)
          }
        })
      }
      else{
        wx.showToast({
          title: '还有未完成的信息哦~',
          icon: 'none',
          duration: 1000,
        })
      }
    },

    onLoad: function(e){
      const that = this
      console.log(e)
      var title = e.title
      this.data.title = e.title

      switch(title){
        case('fiveDimension'):
          wx.cloud.callFunction({
            name:'evaluation',
            data:{
              title: 'fiveDimension'
            },
            success: function(res){
              console.log(res)
              var user = res.result
              if(user.resResult!='' && typeof(user.resResult)!='undefined'){
                // 直接跳到结果页
                console.log('结果页')
                wx.redirectTo({
                  url: '../result/result?title=fiveDimension&result='+user.resResult,
                })
              }
              else if(user.resFinish==true && (user.resEducation==''||typeof(user.resEducation)=='undefined')){
                // 说明已经完毕，可以跳转到个人信息页
                console.log('跳转到个人信息页')
                that.data.scaleFinish = true
                that.data.profileFinish = false
                that.setData({
                  scaleFinish: that.data.scaleFinish,
                  profileFinish: that.data.profileFinish,
                })
              }
              else{
                console.log('跳转到测评页')
                if(user.resFinish!=true)
                  that.data.scaleFinish = false
                else
                  that.data.scaleFinish = true
                if(user.resEducation=='' || typeof(user.resEducation)=='undefined')
                  that.data.profileFinish = false
                else
                  that.data.profileFinish = true

                console.log(user)
                var answerArr = user.res.split(",")
                that.data.answer = answerArr
                that.data.group = [
                  [0,1,2,3],
                  [4,5,6,7],
                  [8,9,10,11],
                  [12,13,14,15],
                  [16,17,18,19],
                  [20], 
                  [21,22,23,24,25],
                  [26,27,28,29,30],
                  [31,32,33,34,35],
                  [36,37,38,39,40],
                  [41,42,43,44,45],
                  [46,47,48,49,50],
                  [51,52,53,54,55],
                  [56,57,58,59,60],
                  [61,62,63,64,65],
                  [66,67,68,69,70],
                  [71,72,73,74,75],
                  [76,77,78,79,80],
                  [81,82,83,84,85],
                  [86,87,88,89,90],
                  [91,92,93,94,95],
                  [96,97,98,99,100],
                  [101,102,103,104,105],
                  [106,107,108,109,110],
                  [111,112,113,114,115],
                  [116,117,118,119,120],
                  [121,122,123,124,125],
                  [126,127,128],
                  [129,130,131,132,133],
                  [134],
                  [135,136,137,138,139],
                  [140,141,142,143,144],
                  [145,146,147,148,149],
                  [150,151,152,153,154],
                  [155,156,157,158,159],
                  [160,161,162,163,164],
                ]
                var jud = false
                for(var i in that.data.group){
                  for(var j in that.data.group[i]){
                    if(answerArr[that.data.group[i][j]] == "0"){
                      that.data.nowPageIndex = parseInt(i)
                      jud = true
                      break;
                    }
                  }
                  if(jud){
                    break;
                  }
                }
                if(!jud){
                  that.data.scaleFinishStop = true
                  that.data.nowPageIndex = that.data.group.length-1
                }
                // console.log(that.data.nowPageIndex)
                // 改变claim值
                that.claimChange()
                that.setData({
                  answer: answerArr,
                  twentyOneAnswer: [
                                        {
                                            A:'A.我不感到悲伤',
                                            B:'B.我感到悲伤',
                                            C:'C.我始终悲伤，不能自制',
                                            D:'D.我太悲伤或不愉快，不堪忍受',
                                        },
                                        {
                                            A:'A.我对将来并不失望',
                                            B:'B.对未来我感到心灰意冷',
                                            C:'C.我感到全景暗淡',
                                            D:'D.我觉得将来毫无希望，无法改善',
                                        },
                                        {
                                            A:'A.我没有感到失败',
                                            B:'B.我觉得比一般人失败要多一些',
                                            C:'C.回首往事，我能看到的是很多次失败',
                                            D:'D.我觉得我是一个完全失败的人',
                                        },
                                        {
                                            A:'A.我和以前一样，从各种事件中得到满足',
                                            B:'B.我不象往常一样从各种事件中得到满足',
                                            C:'C.我不再能从各种事件中得到真正的满足',
                                            D:'D.我对一切事情都不满意或感到枯燥无味',
                                        },
                                        {
                                            A:'A.我不感到罪过',
                                            B:'B.我在相当部分的时间里感到罪过',
                                            C:'C.我在大部分时间里觉得有罪',
                                            D:'D.我在任何时候都觉得有罪',
                                        },
                                        {
                                            A:'A.我没有觉得受到惩罚',
                                            B:'B.我觉得可能受到惩罚',
                                            C:'C.我预料将受到惩罚',
                                            D:'D.我觉得正受到惩罚',
                                        },
                                        {
                                            A:'A.我对自己并不失望',
                                            B:'B.我对自己感到失望',
                                            C:'C.我对自己感到讨厌',
                                            D:'D.我恨我自己',
                                        },
                                        {
                                            A:'A.我觉得我并不比其他人更不好',
                                            B:'B.我对自己的弱点和错误要批判',
                                            C:'C.我在所有的时间里都责备自己的过错',
                                            D:'D.我责备自己所有的事情都弄坏了',
                                        },
                                        {
                                            A:'A.我没有任何想弄死自己的想法',
                                            B:'B.我有自杀的想法，但我不会去做',
                                            C:'C.我想自杀',
                                            D:'D.如果有机会我就自杀',
                                        },
                                        {
                                            A:'A.我哭泣和往常一样',
                                            B:'B.我比往常哭的多',
                                            C:'C.我现在一直要哭',
                                            D:'D.我过去能哭，但现在要哭也哭不出来',
                                        },
                                        {
                                            A:'A.和过去相比，我现在生气并不多',
                                            B:'B.我现在比往常更容易生气发火',
                                            C:'C.我觉得现在所有的时间都容易生气',
                                            D:'D.过去使我生气的事，现在一点也不能使我生气了',
                                        },
                                        {
                                            A:'A.我对其他人没有失去兴趣',
                                            B:'B.和过去相比，我对别人的兴趣减少了',
                                            C:'C.我对别人的兴趣大部分失去了',
                                            D:'D.我对别人的兴趣已全部丧失了',
                                        },
                                        {
                                            A:'A.我作决定和过去一样好',
                                            B:'B.我推迟作出决定比过去多了',
                                            C:'C.我作决定比以前困难大的多',
                                            D:'D.我再也不能作出决定了',
                                        },
                                        {
                                            A:'A.我觉得看上去我的外表并不比过去差',
                                            B:'B.我担心看上去我显得老了，没吸引力了',
                                            C:'C.我觉得我的外貌有些固定的变化，使我难看了',
                                            D:'D.我相信我看起来很丑陋',
                                        },
                                        {
                                            A:'A.我工作和以前一样好',
                                            B:'B.要着手做事，我现在要额外花些力气',
                                            C:'C.无论做什么事我必须努力',
                                            D:'D.我什么工作也不能做了催促自己才行',
                                        },
                                        {
                                            A:'A.我睡觉与往常一样好',
                                            B:'B.我睡觉不如过去好',
                                            C:'C.我比往常早醒1～2小时，难以再入睡',
                                            D:'D.我比往常早醒几个小时，不能再睡',
                                        },
                                        {
                                            A:'A.我并不感到比往常更疲乏',
                                            B:'B.我比过去更容易感到疲乏',
                                            C:'C.几乎不管做什么，我都感到疲乏无力',
                                            D:'D.我太疲乏无力，不能做任何事情',
                                        },
                                        {
                                            A:'A.我的食欲与往常一样',
                                            B:'B.我的食欲不如过去好',
                                            C:'C.我现在的食欲差得多了',
                                            D:'D.我一点也没有食欲了',
                                        },
                                        {
                                            A:'A.最近我的体重并无很大减轻',
                                            B:'B.我的体重下降了5磅（约2.25kg）以上',
                                            C:'C.我的体重下降了10磅以上',
                                            D:'D.我的体重下降15磅以上',
                                        },
                                        {
                                            A:'A.我对最近的健康状况并不比往常更担心',
                                            B:'B.我担心身体上的问题，如疼痛、胃不适或便秘',
                                            C:'C.我非常担心身体问题，想别的事情很难',
                                            D:'D.我对身体问题如此担忧以致不能想其他任何事情',
                                        },
                                        {
                                            A:'A.我没有发现我对性的兴趣最近有什么变化',
                                            B:'B.我对性的兴趣比过去降低了',
                                            C:'C.现在我对性的兴趣又大下降',
                                            D:'D.我对性的兴趣已经完全丧失',
                                        },
                                    ],
                  question:[
                              '','','','','','','','','','','','','','','','','','','','','',
                              '1.通过工作学习或一些其他活动解脱',
                              '2.与人交谈，倾诉内心烦恼',
                              '3.尽量看到事物好的一面',
                              '4.改变自己的想法，重新发现生活中什么重要',
                              '5.不把问题看得太严重',
                              '6.坚持自己的立场，为自己想得到的斗争',
                              '7.找出几种不同的解决问题的方法',
                              '8.向亲戚朋友或同学寻求建议',
                              '9.改变原来的一些做法或自己的一些问题',
                              '10.借鉴他人处理类似困难情景的办法',
                              '11.寻求业余爱好，积极参加文体活动',
                              '12.尽量克制自己的失望、悔恨、悲伤和愤怒',
                              '13.试图休息或休假，暂时把问题（烦恼）抛开',
                              '14.通过吸烟、喝酒、服药和吃东西来解除烦恼',
                              '15.认为时间会改变现状，唯一要做的便是等待',
                              '16.试图忘记整个事情',
                              '17.依靠别人解决问题',
                              '18.接受现实，因为没有其它办法',
                              '19.幻想可能会发生某种奇迹改变现状',
                              '20.自己安慰自己',
                              '1.你是否有许多不同的业余爱好？',
                              '2.你是否在做任何事情以前都要停下来仔细思考？',
                              '3.你的心境是否常有起伏？',
                              '4.你曾有过明知是别人的功劳而你去接受奖励的事吗？',
                              '5.你是否健谈？',
                              '6.欠债会使你不安吗？',
                              '7.你曾无缘无故觉得“真是难受”吗？',
                              '8.你曾贪图过分外之物吗？',
                              '9.你是否在晚上小心翼翼地关好门窗？',
                              '10.你是否比较活跃？',
                              '11.你在见到一小孩或一动物受折磨时是否会感到非常难过？',
                              '12.你是否常常为自己不该做而做了的事，不该说而说了的话而紧张？',
                              '13.你喜欢跳降落伞吗？',
                              '14.通常你能在热闹联欢会中尽情地玩吗？',
                              '15.你容易激动吗？',
                              '16.你曾经将自己的过错推给别人吗？',
                              '17.你喜欢会见陌生人吗？',
                              '18.你是否相信保险制度是一种好办法？',
                              '19.你是一个容易伤感情的人吗？',
                              '20.你所有的习惯都是好的吗？',
                              '21.在社交场合你是否总不愿露头角？',
                              '22.你会服用奇异或危险作用的药物吗？',
                              '23.你常有“厌倦”之感吗？',
                              '24.你曾拿过别人的东西吗（哪怕一针一线）？',
                              '25.你是否常爱外出？',
                              '26.你是否从伤害你所宠爱的人而感到乐趣？',
                              '27.你常为有罪恶之感所苦恼吗？',
                              '28.你在谈论中是否有时不懂装懂？',
                              '29.你是否宁愿去看书而不愿去多见人？',
                              '30.你有要伤害你的仇人吗？',
                              '31.你觉得自己是一个神经过敏的人吗？',
                              '32.对人有所失礼时你是否经常要表示歉意？',
                              '33.你有许多朋友吗？',
                              '34.你是否喜爱讲些有时确能伤害人的笑话？',
                              '35.你是一个多忧多虑的人吗？',
                              '36.你在童年是否按照吩咐要做什么便做什么，毫无怨言？',
                              '37.你认为你是一个乐天派吗？',
                              '38.你很讲究礼貌和整洁吗？',
                              '39.你是否总在担心会发生可怕的事情？',
                              '40.你曾损坏或遗失过别人的东西吗？',
                              '41.交新朋友时一般是你采取主动吗？',
                              '42.当别人向你诉苦时，你是否容易理解他们的苦衷？',
                              '43.你认为自己很紧张，如同“拉紧的弦”一样吗？',
                              '44.在没有废纸篓时，你是否将废纸扔在地板上？',
                              '45.当你与别人在一起时，你是否言语很少？',
                              '46.你是否认为结婚制度是过时了，应该废止？',
                              '47.你是否有时感到自己可怜？',
                              '48.你是否有时有点自夸？',
                              '49.你是否很容易将一个沉寂的集会搞得活跃起来？',
                              '50.你是否讨厌那种小心翼翼地开车的人？',
                              '51.你为你的健康担忧吗？',
                              '52.你曾讲过什么人的坏话吗？',
                              '53.你是否喜欢对朋友讲笑话和有趣的故事？',
                              '54.你小时候曾对父母粗暴无礼吗？',
                              '55.你是否喜欢与人混在一起？',
                              '56.你如知道自己工作有错误，这会使你感到难过吗？',
                              '57.你患失眠吗？',
                              '58.你吃饭前必定洗手吗？',
                              '59.你常无缘无故感到无精打采和倦怠吗？',
                              '60.和别人玩游戏时，你有过欺骗行为吗？',
                              '61.你是否喜欢从事一些动作迅速的工作？',
                              '62.你的母亲是一位善良的妇人吗？',
                              '63.你是否常常觉得人生非常无味？',
                              '64.你曾利用过某人为自己取得好处吗？',
                              '65.你是否常常参加许多活动，超过你的时间所允许？',
                              '66.是否有几个人总在躲避你？',
                              '67.你是否为你的容貌而非常烦恼？',
                              '68.你是否觉得人们为了未来有保障而办理储蓄和保险所花的时间太多？',
                              '69.你曾有过不如死了为好的愿望吗？',
                              '70.如果有把握永远不会被别人发现，你会逃税吗？',
                              '71.你能使一个集会顺利进行吗？',
                              '72.你能克制自己不对人无礼吗？',
                              '73.遇到一次难堪的经历后，你是否在一段很长的时间内还感到难受？',
                              '74.你患有“神经过敏”吗？',
                              '75.你曾经故意说些什么来伤害别人的感情吗？',
                              '76.你与别人的友谊是否容易破裂，虽然不是你的过错？',
                              '77.你常感到孤单吗？',
                              '78.当人家寻你的差错,找你工作中的缺点时,你是否容易在精神上受挫伤？',
                              '79.你赴约会或上班曾迟到过吗？',
                              '80.你喜欢忙忙碌碌地过日子吗？',
                              '81.你愿意别人怕你吗？',
                              '82.你是否觉得有时浑身是劲，而有时又是懒洋洋的吗？',
                              '83.你有时把今天应做的事拖到明天去做吗？',
                              '84.别人认为你是生气勃勃吗？',
                              '85.别人是否对你说了许多谎话？',
                              '86.你是否容易对某些事物容易冒火？',
                              '87.当你犯了错误时，你是否常常愿意承认它？',
                              '88.你会为一动物落入圈套被捉拿而感到很难过吗？',
                              '1.我感觉胃口很好且摄入量适中',
                              '2.我感到心情愉悦',
                              '3.我感觉自己有活力',
                              '4.我对生活中的事物充满兴趣',
                              '5.我能正常入睡和睡醒',
                              '6.我觉得心平气和，并且容易安静地坐着', 
                              '1.我觉得活在世上困难重重。',
                              '2.我不好。',
                              '3.为什么我总不能成功？',
                              '4.没有人理解我。',
                              '5.我让人失望。',
                              '6.我觉得过不下去了。',
                              '7.真希望我能好一点。',
                              '8.我很虚弱。',
                              '9.我的生活不按我的愿望发展。',
                              '10.我对自己很不满意。',
                              '11.我觉得一切都不好了。',
                              '12.我无法坚持下去。',
                              '13.我无法重新开始。',
                              '14.我究竟犯了什么毛病？',
                              '15.真希望我是在另外一个地方。',
                              '16.我无法同时对付这些事情。',
                              '17.我恨我自己。',
                              '18.我亳无价值。',
                              '19.真希望我一下子就消失了',
                              '20.我这是怎么了？',
                              '21.我是个失败者。',
                              '22.我的生活一团糟。',
                              '23.我一事无成。',
                              '24.我不可能干好。',
                              '25.我觉得孤立无援。',
                              '26.有些东西必须改变。',
                              '27.我肯定有问题。',
                              '28.我的将来亳无希望。',
                              '29.这根本亳无价值。',
                              '30.我干什么事都有头无尾。',
                            ],
                  group:that.data.group,
                  nowPageIndex:that.data.nowPageIndex,
                  claim: that.data.claim,
                  scaleFinish: that.data.scaleFinish,
                  profileFinish: that.data.profileFinish,
                  title: that.data.title,
                  scaleFinishStop: that.data.scaleFinishStop,
                })
              }
              console.log(res)
            },
            fail:function(res){
              console.error(res)
            }
          })
          break;
        case('selfEsteem'):
          console.log('selfEsteem')
          wx.cloud.callFunction({
            name:'evaluation',
            data:{
              title: 'selfEsteem'
            },
            success: function(res){
              console.log(res)
              var user = res.result
              if(user.resResult!='' && typeof(user.resResult)!='undefined'){
                // 直接跳到结果页
                console.log('结果页')
                wx.redirectTo({
                  url: '../result/result?title=selfEsteem&result='+user.resResult,
                })
              }
              else{
                console.log('跳转到测评页')

                console.log(user)
                var answerArr = user.res.split(",")
                that.data.answer = answerArr
                that.data.group = [
                  [0,1,2,3,4],
                  [5,6,7,8,9],
                ]
                var jud = false
                for(var i in that.data.group){
                  for(var j in that.data.group[i]){
                    if(answerArr[that.data.group[i][j]] == "0"){
                      that.data.nowPageIndex = parseInt(i)
                      jud = true
                      break;
                    }
                  }
                  if(jud){
                    break;
                  }
                }
                if(!jud){
                  that.data.scaleFinishStop = true
                  that.data.nowPageIndex = that.data.group.length-1
                }
                // console.log(that.data.nowPageIndex)
                // 改变claim值
                that.claimChange()
                that.setData({
                  answer: answerArr,
                  group:  that.data.group,
                  question:[
                    '1.我感到自己是一个有价值的人，至少与其他人在同一水平上',
                    '2.我感到自己有许多好的品质',
                    '3.归根到底，我倾向于认为自己是一个失败者',
                    '4.我能像大多数人一样把事情做好',
                    '5.我感到自己值得骄傲的地方不多',
                    '6.我对自己持肯定态度',
                    '7.总的来说，我对自己是满意的',
                    '8.我希望我能为自己赢得更多尊重',
                    '9.我确实是时常感到自己毫无用处',
                    '10.我时常认为自己一无是处',
                            ],
                  nowPageIndex:that.data.nowPageIndex,
                  claim: that.data.claim,
                  title: that.data.title,
                  scaleFinishStop: that.data.scaleFinishStop,
                })
              }
              console.log(res)
            },
            fail:function(res){
              console.error(res)
            }
          })
          break;
        case('nervous'):
          console.log('nervous')
          wx.cloud.callFunction({
            name:'evaluation',
            data:{
              title: 'nervous'
            },
            success: function(res){
              console.log(res)
              var user = res.result
              if(user.resResult!='' && typeof(user.resResult)!='undefined'){
                // 直接跳到结果页
                console.log('结果页')
                wx.redirectTo({
                  url: '../result/result?title=nervous&result='+user.resResult,
                })
              }
              else{
                console.log('跳转到测评页')
                console.log(user)
                var answerArr = user.res.split(",")
                that.data.answer = answerArr
                that.data.group = [
                  [0,1,2,3,4],
                  [5,6,7,8,9],
                  [10,11,12,13,14],
                  [15,16,17,18,19],
                ]
                var jud = false
                for(var i in that.data.group){
                  for(var j in that.data.group[i]){
                    if(answerArr[that.data.group[i][j]] == "0"){
                      that.data.nowPageIndex = parseInt(i)
                      jud = true
                      break;
                    }
                  }
                  if(jud){
                    break;
                  }
                }
                if(!jud){
                  that.data.scaleFinishStop = true
                  that.data.nowPageIndex = that.data.group.length-1
                }
                // console.log(that.data.nowPageIndex)
                // 改变claim值
                that.claimChange()
                that.setData({
                  answer: answerArr,
                  group:  that.data.group,
                  question:[
                    '1.我觉得比平时容易紧张或着急',
                    '2.我无缘无故在感到害怕',
                    '3.我容易心里烦乱或感到惊恐',
                    '4.我觉得我可能将要发疯',
                    '5.我觉得一切都很好',
                    '6.我手脚发抖打颤',
                    '7.我因为头疼、颈痛和背痛而苦恼',
                    '8.我觉得容易衰弱和疲乏',
                    '9.我觉得心平气和，并且容易安静坐着',
                    '10.我觉得心跳得很快',
                    '11.我因为一阵阵头晕而苦恼',
                    '12.我有晕倒发作，或觉得要晕倒似的',
                    '13.我吸气呼气都感到很容易',
                    '14.我的手脚麻木和刺痛',
                    '15.我因为胃痛和消化不良而苦恼',
                    '16.我常常要小便',
                    '17.我的手脚常常是干燥温暖的',
                    '18.我脸红发热',
                    '19.我容易入睡并且一夜睡得很好',
                    '20.我作恶梦',
                            ],
                  nowPageIndex:that.data.nowPageIndex,
                  claim: that.data.claim,
                  title: that.data.title,
                  scaleFinishStop: that.data.scaleFinishStop,
                })
              }
              console.log(res)
            },
            fail:function(res){
              console.error(res)
            }
          })
          break;
        case('weekStatus'):
          console.log('weekStatus')
          wx.cloud.callFunction({
            name:'evaluation',
            data:{
              title: 'weekStatus'
            },
            success: function(res){
              console.log(res)
              var user = res.result
              if(user.resResult!='' && typeof(user.resResult)!='undefined'){
                // 直接跳到结果页
                console.log('结果页')
                wx.redirectTo({
                  url: '../result/result?title=weekStatus&result='+user.resResult,
                })
              }
              else{
                console.log('跳转到测评页')
                console.log(user)
                var answerArr = user.res.split(",")
                that.data.answer = answerArr
                that.data.group = [
                  [0,1,2,3,4],
                  [5],
                ]
                var jud = false
                for(var i in that.data.group){
                  for(var j in that.data.group[i]){
                    if(answerArr[that.data.group[i][j]] == "0"){
                      that.data.nowPageIndex = parseInt(i)
                      jud = true
                      break;
                    }
                  }
                  if(jud){
                    break;
                  }
                }
                if(!jud){
                  that.data.scaleFinishStop = true
                  that.data.nowPageIndex = that.data.group.length-1
                }
                // console.log(that.data.nowPageIndex)
                // 改变claim值
                that.claimChange()
                that.setData({
                  answer: answerArr,
                  group:  that.data.group,
                  question:[
                    '1.我感觉胃口很好且摄入量适中',
                    '2.我感到心情愉悦',
                    '3.我感觉自己有活力',
                    '4.我对生活中的事物充满兴趣',
                    '5.我能正常入睡和睡醒',
                    '6.我觉得心平气和，并且容易安静地坐着',
                            ],
                  nowPageIndex:that.data.nowPageIndex,
                  claim: that.data.claim,
                  title: that.data.title,
                  scaleFinishStop: that.data.scaleFinishStop,
                })
              }
              console.log(res)
            },
            fail:function(res){
              console.error(res)
            }
          })
          break;
      }
    },
    onChange(event) {
      this.setData({
        radio: event.detail,
      });
    },
    claimChange(){
      console.log('当前的索引是：'+this.data.nowPageIndex)
      var nowPageIndex = this.data.nowPageIndex
      if(this.data.title == 'fiveDimension'){
        if(nowPageIndex>=0 && nowPageIndex<=5){
          this.data.claim = '说明：请你仔细阅读每一题，然后根据你近一周（包括今天）的感觉，选择最符合你本人情况的选项。'
        }
        else if(nowPageIndex>=6 && nowPageIndex<=9){
          this.data.claim = '说明：以下列出的是当你在生活中经受到挫折打击或遇到困难时可能采取的态度和做法。请你仔细阅读每一项后选择最符合你本人情况的选项。A.不采取 B.偶尔采取 C.有时采取 D.经常采取'
        }
        else if(nowPageIndex>=10 && nowPageIndex<=27){
          this.data.claim = '说明：本测验由许多与你有关的问题组成。当你阅读每一题目时，请考虑是否符合你自己的实际情况和看法。如果情况符合，请选择“是（A）”，反之则选择“否（B）”。'
        }
        else if(nowPageIndex>=28 && nowPageIndex<=29){
          this.data.claim = '说明：请你仔细阅读每一题，然后根据你近一周（包括今天）的感觉，选择最符合你本人情况的选项。A.从不；B.偶尔；C.有时；D.经常'
        }
        else if(nowPageIndex>=30 && nowPageIndex<=35){
          this.data.claim = '说明：下列是一些可能涌入人们头脑中的想法。请逐条阅读，回忆你在最近一周内是否出现过这类想法、其频度如何，并选择最符合你情况的选项.A.从不；B.偶尔；C.有时；D.经常；E.持续存在'
        }
      }
      else if(this.data.title == 'selfEsteem'){
        this.data.claim = '说明：请你仔细阅读每一题，选择最符合你本人情况的选项。A.非常符合；B.符合；C.不符合；D.非常不符合'
      }
      else if(this.data.title == 'nervous'){
        this.data.claim = '说明：请仔细阅读每一条文字，然后根据您最近一星期的实际情况进行选择。 A没有或很少时间；B小部分时间；C相当多时间；D绝大部分或全部时间。 '
      }
      else if(this.data.title == 'weekStatus'){
        this.data.claim = '说明：请你仔细阅读每一题，然后根据你近一周（包括今天）的感觉，选择最符合你本人情况的选项。 A.从不；B.偶尔；C.有时；D.经常'
      }
    },
    prev(e){
      var nowPageIndex = this.data.nowPageIndex - 1;
      if(nowPageIndex<0){
        nowPageIndex =0
        wx.showToast({
          title: '已经是最前一页~',
          icon: 'none',
          duration: 1000,
        })
      }
      this.data.nowPageIndex = nowPageIndex
      this.claimChange()
      this.setData({
        nowPageIndex: nowPageIndex,
        claim: this.data.claim
      })
    },
    next(e){
      var nowPageIndex = this.data.nowPageIndex + 1;
      
      if(nowPageIndex>=this.data.group.length){
        nowPageIndex = this.data.group.length-1
        wx.showToast({
          title: '已经是最后一页~',
          icon: 'none',
          duration: 1000,
        })
      }
      this.data.nowPageIndex = nowPageIndex
      this.claimChange()
      this.setData({
        nowPageIndex: nowPageIndex,
        claim: this.data.claim
      })
    },
    finish(e){
      if(this.data.title == 'fiveDimension'&&this.data.answer.length >= 165 ||
         this.data.title == 'selfEsteem'&&this.data.answer.length >= 10 ||
         this.data.title == 'nervous'&&this.data.answer.length >= 20 ||
         this.data.title == 'weekStatus'&&this.data.answer.length >= 6
      ){
          var judge = true
          for(var i in this.data.answer){
            if(this.data.answer[i] == "0"){
              judge = false
              break;
            }
          }
          if(judge){
            // 数据全部收集完毕
            this.setData({
              finishDialogShow: true,
              finishDialogTitle: "所有题目已完成~",
              finishDialogContent:"您已完成所有测评题目，确认提交吗",
            })
          }
          else{
            // 数据还未收集完毕
            this.setData({
              finishDialogShow: true,
              finishDialogTitle: "还有题目未完成~",
              finishDialogContent:"已为您自动保存已完成的题目，保存时间为24小时。确认要暂时离开吗？",
            })
          }
      }
      
    },
    // 弹窗框-确认取消键
    tapDialogButton(e) {
      const that = this
      if(e.detail.item.text=='确定'){
        var finish;
        if(this.data.finishDialogTitle == "所有题目已完成~"){
          finish = true
        }
        else{
          finish = false
        }
        wx.cloud.callFunction({
          name: 'evaluationFinish',
          data:{
            isFinish: finish,
            data: this.data.answer.join(","),
            title: this.data.title,
          },
          success:function(res){
            console.log(res)
            if(that.data.title == 'fiveDimension'){
              if(finish){
                that.setData({
                  scaleFinish: true,
                })
              }
              else{
                // 返回测评页
                wx.switchTab({
                  url: '../../Evaluation/Evaluation',
                })
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 1500,
                })
              }
            }
            else{
              if(finish){
                if(that.data.title == 'selfEsteem'){
                  wx.redirectTo({
                    url: '../result/result?title=selfEsteem&result='+res.result.resResult,
                  })
                }
                else if(that.data.title == 'nervous'){
                  wx.redirectTo({
                    url: '../result/result?title=nervous&result='+res.result.resResult,
                  })
                }
                else if(that.data.title == 'weekStatus'){
                  wx.redirectTo({
                    url: '../result/result?title=weekStatus&result='+res.result.resResult,
                  })
                }   
              }
              else{
                // 返回测评页
                wx.switchTab({
                  url: '../../Evaluation/Evaluation',
                })
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 1500,
                })
              }
            }
            
          },
          fail:function(res){
            console.log(res)
          }
        })
        this.setData({
          finishDialogShow: false,
        })
      }
      else{
        this.setData({
          finishDialogShow: false,
        })
      }
    },
    chooseRearRadio(e){
      console.log(e.target.dataset.index)
      console.log(e.target.dataset.value)
      if(typeof(e.target.dataset.value) == "undefined"){
        console.log('yyyyyyy')
      }
      console.log(e.detail.value)
    },
    chooseFrontRadio(e){
      const that = this
      var index= e.target.dataset.index
      var value;
      if(typeof(e.target.dataset.value) == "undefined"){
        value = e.detail.value
      }
      else{
        value = e.target.dataset.value
      }
      console.log('index:'+index+' value:'+value)
      
      var nowItem = that.data.group[that.data.nowPageIndex]

      // 更改选中答案背景
      that.data.answer[index] = value
      that.setData({
        answer : that.data.answer
      })
      
      // 自动跳转
      for(var i in nowItem){
        var judge = true
        if(that.data.answer[nowItem[i]] == "0"){
          judge = false
          break;
        }
      }
      // 这一页的全都做完了
      if(judge){
        var judgeNotFinish = false;
        var newPage = parseInt(that.data.nowPageIndex);
        for(var i=newPage+1; i<that.data.group.length; i++){
          for(var j=0; j<that.data.group[i].length; j++){
            if(that.data.answer[that.data.group[i][j]] == "0"){
              newPage = i;
              judgeNotFinish = true;
              break;
            }
          }
          if(judgeNotFinish)
            break;
        }
        if(!judgeNotFinish){
          for(var i=0; i<newPage; i++){
            for(var j=0; j<that.data.group[i].length; j++){
              if(that.data.answer[that.data.group[i][j]] == "0"){
                newPage = i;
                judgeNotFinish = true;
                break;
              }
            }
            if(judgeNotFinish)
              break;
          }
        }
        if(!judgeNotFinish){
          that.data.scaleFinishStop = true;
        }
        that.data.nowPageIndex = newPage
        that.claimChange()
        that.setData({
          nowPageIndex: newPage,
          scaleFinishStop:  that.data.scaleFinishStop,
          claim: that.data.claim
        })
      }
      
      
      // console.log(that.data.answer)
    }
  }
})
