// pages/Evaluation/introduce/introduce.js
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
    title: '',
    headTitle:'测测你真实的自尊水平',
    scaleProfileContent:'',
    coverSrc:'',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function(e){
      this.data.title = e.title
      switch(e.title){
        case('fiveDimension'):
          this.data.headTitle = '测测你的五大纬度'
          this.data.scaleProfileContent = 
          '<center>如果你想更了解自己</center><center>如果你好奇自己思维风格和行为方式到底是怎样的</center><center>如果你希望了解自己当前的情绪状态</center><center>那么你可以通过这份问卷得到一些答案。</center><center>这份问卷包含了专用于测评<strong>人格、思维风格、情绪状态、应对方式</strong>的权威量表，经研究验证具有较高的准确性</center><center>整份问卷耗时大约15分钟，如果你感觉累了，可以中途退出，下次继续；但为了获得准确的测评报告，请真实作答~</center>'
          this.data.coverSrc = '../../../style/evaluation/1.png'
          break;
        case('selfEsteem'):
          this.data.headTitle = '测测你真实的自尊水平'
          this.data.scaleProfileContent = 
          '<center>自尊，亦称“自尊心”、“自尊感”，是个人基于自我评价产生和形成的一种自重、自爱、自我尊重，并要求受到他人、集体和社会尊重的情感体验。自尊是人格自我调节结构的心理成分，有强弱之分：过强则变成虚荣心，过弱则变成自卑。</center><center>你是否常常觉得自己一无是处？你是否常常想相信自己，但是无法做到？你是否是外人口中的“别人家的孩子”，心里却觉得自己很糟糕？如果你有过这样的想法，总是没有办法认可自己，容易怀疑自己的能力，那你可能是一个低自尊者。如果你想更加准确地了解自己的自尊水平，获得提升自尊的相关建议，可以看看我们的自尊测试~</center><center>我们使用的罗森伯格自尊量表经大量临床研究验证，可有效准确地进行自尊测量。通过该测评，你可以了解到自己的自尊类型，当前自尊水平对生活的影响，以及可能影响你自尊水平的多种因素.....当然，我们也会为你提供一些有效提升自尊的方法。</center><center>本量表共有10道题目，预计耗时3分钟。</center>'
          this.data.coverSrc = '../../../style/evaluation/2.png'
          break;
        case('nervous'):
          this.data.headTitle = '测测你真实的焦虑水平'
          this.data.scaleProfileContent = 
          '<center>如果你最近觉得压力很大、没有食欲、睡眠不好，或者觉得脾气渐长、很难控制情绪，又或者只是单纯想要掌握降低焦虑的小技巧，那么你可以通过这个问卷来探索自己。</center><center>我们的问卷采用的是SAS焦虑自评量表，经过临床研究验证，该量表可以有效准确地进行测量。通过这个测试，你可以了解现阶段你真实的焦虑水平，找出焦虑出现的真正原因，也能够知道当焦虑袭来时，你可以如何应对。</center><center>本量表共有20道题目，预计耗时5分钟。</center>'
          this.data.coverSrc = '../../../style/evaluation/3.png'
          break;
        case('weekStatus'):
          this.data.headTitle = '测测你这一周的整体状态'
          this.data.scaleProfileContent = 
          '<center>想回顾一下自己本周的心理状态？想长期追踪自己的心理健康轨迹？</center><center>本量表经过研究验证可有效测量你的一周状态</center><center>为了避免你的记忆误差，我们在每日小结页面也加入了这一部分的问题</center><center>如果你坚持进行每日小结，效果会比填写这份量表更好哦，测评报告也会更加精准！</center><center>本问卷共6小题，耗时约1分钟。</center>'
          this.data.coverSrc = '../../../style/evaluation/4.png'
          break;
          
      }
      this.setData({
        headTitle: this.data.headTitle,
        scaleProfileContent: this.data.scaleProfileContent,
        coverSrc: this.data.coverSrc,
        title: this.data.title,
      })
    },
    test(){
      switch(this.data.title){
        case('fiveDimension'):
          wx.navigateTo({
            url: '../paper/paper?title=fiveDimension',
          })
          break;
        case('selfEsteem'):
          wx.navigateTo({
            url: '../paper/paper?title=selfEsteem',
          })
          break;
        case('nervous'):
          wx.navigateTo({
            url: '../paper/paper?title=nervous',
          })
          break;
        case('weekStatus'):
          wx.navigateTo({
            url: '../paper/paper?title=weekStatus',
          })
          break;
      }
    }
  }
})
