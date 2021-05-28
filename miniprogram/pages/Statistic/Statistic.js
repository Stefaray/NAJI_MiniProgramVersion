import * as echarts from '../../components/ec-canvas/echarts';

const app = getApp();

let chartLine;
let chartGraph;






// pieChart
function pieChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    tooltip: {
      trigger: 'item'
    },
    color: ["#027b92","#23a0a5","#3bbbb3","#5bdec5","#76fdd5","#54eec0",],
    title: {
      top: "5%",
      text: '疏导记录统计',
      textStyle: {
        color:'#448088'
      },
      left: 'center'
    },
    legend:{
      bottom: '2%',
      left:'center',
      itemWidth: 13,
      textStyle:{
        color: '#646464'
      }
      },
    series: [{
      label: {
        normal: {
          fontSize: 12,
        },
        show:false
      },
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['0%', '60%'],
      data: this.pieData
    }]
  };
  chart.setOption(option);
  return chart;
}

// barChart
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    title: {
      top: "5%",
      text: '快乐事主题',
      textStyle: {
        color:'#448088'
      },
      left: 'center'
    },
    grid: {
      left: '10%',
      right: '8%',
      bottom: '15%'
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
        lineStyle: {
          color: "#a8a8a8"
        },
      },
    },
    color: ['#37a2da', '#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          color: "#a8a8a8"
        },
      },
      data: this.xBar
  },
  series: [{
      data: this.data,
      type: 'bar'
  }]
  };

  chart.setOption(option);
  return chart;
}



Page({
  data: {
    year:  new Date().getFullYear(),
    month: new Date().getMonth()+1,
    ecLine: {
      lazyLoad: true 
    },
    ecGraph:{
      lazyLoad: true,
      month:'2021-04',
      stateData:[]
    },
    ecPie: {
      onInit: pieChart,
      pieData:[
      {value: 55,name: '感动'}, 
      {value: 20,name: '悲伤'}, 
      {value: 10,name: '恐惧'},
      {value: 20,name: '开心'},
      {value: 38,name: '愤怒'},
      {value: 90,name: '焦虑'}]
    },
    ecBar: {
      onInit: initChart,
      xBar: ['家庭','朋友','恋爱','学业','运动','美食'
      //,'爱好','成就','上网','旅游','宠物','其他'
    ],
      data: [
        {value:20,itemStyle:{color:"#54eec0"}},
        {value:10,itemStyle:{color:"#76fdd5"}},
        {value:15,itemStyle:{color:"#52cec3"}},
        {value:30,itemStyle:{color:"#b4ebe7"}},
        {value:19,itemStyle:{color:"#baf2d6"}},
        {value:40,itemStyle:{color:"#027b92"}},
        //color: ["#027b92","#23a0a5","#3bbbb3","#5bdec5","#76fdd5","#54eec0",],
      /*
        {value:24,itemStyle:{color:"#edb35b"}},
        {value:35,itemStyle:{color:"#f48194"} },
        {value:24,itemStyle:{color:"#cfb1f8"}},
        {value:17,itemStyle:{color:"#a6b3ea"}},
        {value:37,itemStyle:{color:"#e79ecc"}},
        {value:41,itemStyle:{color:"#d7d7d7"}},
      */
      ]
    }
  },
  onReady() {
  },
  onLoad(){
    this.lineComponent = this.selectComponent('#mychart-dom-line');
    this.graphComponent = this.selectComponent('#mychart-dom-graph');
    const that = this
    wx.cloud.callFunction({
      name: 'statistic',
      data: {
        year: that.data.year,
        month:that.data.month,
      },
      success: function(res){
        var graphData = res.result.graphRes
        var lineData = res.result.lineRes
        var lineX = []
        var year =  that.data.year
        var month = that.data.month
        var thisMonth = year + '-' + month
        for(var i in graphData){
          lineX.push(graphData[i][0].split("-")[2])
        }
        var maxVisualPoint = 0
        if(lineData.length >10)
          maxVisualPoint = 10
        else
          maxVisualPoint = lineData.length

        // var lineOption = getLineOption(lineData,lineX,maxVisualPoint)
        // var graphOption = getGraphOption(thisMonth, graphData)
        // chartLine.setOption(lineOption)
        // chartGraph.setOption(graphOption);
        that.initLineChart(lineData,lineX,maxVisualPoint)
        that.initGraphChart(thisMonth, graphData)
        console.log(graphData)
        console.log(lineData)
        console.log(lineX)
        console.log(thisMonth)

      },
      fail: function(res){
        console.error(res)
      }
    })
  },

  // lineChart
  getLineOption(lineData,lineX,maxVisualPoint){
    var option = {
      title: {
        top: "5%",
        text: '月度状态变化',
        textStyle: {
          color:'#448088'
        },
        left: 'center'
      },
      color: ["#37A2DA"],
      grid: {
        left: '10%',
        right: '8%',
        bottom: '15%'
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter:'{b}日'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: lineX,
        axisLine: {
          lineStyle: {
            color: "#a8a8a8"
          }
        }
      },
      yAxis: {
        type: 'value',
        max: 4,    //设置最大值
        min: 0,                                 //最小值
        splitNumber: 5,                 //11个刻度线，也就是10等分
        axisLabel: {
          show: true,
          backgroundColor: null,
          // borderColor: "#448088",
          borderWidth: 2.5,
          borderRadius: [10,10,10,10],
          color: "#448088",
          formatter: function (value) {
            var texts = [];
            if(value==0){
            texts.push('😫');
            }
            else if (value <=1) {
            texts.push('😦');
            }
            else if (value<= 2) {
            texts.push('🙂');
            }
            else if(value<= 3){
            texts.push('😋');
            }
            else{
            texts.push('😆');
            }
            return texts;
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: "#a8a8a8"
          },
        },


      },
      /*左右拖动*/
      
      dataZoom: [{
        startValue: '1',
        endValue: maxVisualPoint,
        zoomLock:'true',
        type: 'inside',
        filterMode:'empty'
        }],
      visualMap: {
        show: false,
        borderColor:'#000',
        text:['佳','欠佳'],
        top: "30%",
        itemGap: 10,
        itemWidth: 16,
        itemHeight: 16,
        pieces: [
        
        {gt: 0,lte: 1,color: '#027b92'}, 
        {gt: 1,lte: 2,color: '#23a0a5'}, 
        {gt: 2,lte: 3,color: '#3bbbb3'},
        {gt: 3,lte: 4,color: '#5bdec5'},
        {gt: 4,lte: 5,color: '#54eec0'}
        
      ]
      },
    series: [{
        name: 'state',
        type: 'line',
        smooth: true,
        symbol:'circle',
        symbolSize: 6,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: '#e0f5f0'
          }, {
              offset: 1,
              color: '#f9fdfc'
          }])
        },
        data: lineData
      },
    ]
    };
    return option;
  },
  initLineChart(lineData,lineX,maxVisualPoint){
    console.log(this.lineComponent)
    this.lineComponent.init((canvas, width, height, dpr) => {
      chartLine = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chartLine);
      var lineOption = this.getLineOption(lineData,lineX,maxVisualPoint)
      chartLine.setOption(lineOption)
      return chartLine;
    });
  },

  //graph日历
  getVirtulData(year) {
    var date = +echarts.number.parseDate(year + '-01-01');
    var end = +echarts.number.parseDate(year + '-12-01');
    var dayTime = 3600 * 24 * 1000;
    var data = [];
    for (var time = date; time < end; time += dayTime) {
        data.push([
            echarts.format.formatTime('yyyy-MM-dd', time)
        ]);
    }
    return data;
  },
  getGraphOption(thisMonth, graphData){
  var option = {
    title: {
      top: "5%",
      text: '我的状态日历',
      textStyle: {
        color:'#448088'
      },
      left: 'center'
    },
    tooltip: {
      triggerOn:'mousemove'
    },
    visualMap: {
      type: "piecewise",
      itemWidth: 16,
      itemHeight: 16,
      splitNumber: 5,
      min: 0,
      max: 5,
      calculable: true,
      itemGap: 20,
      realtime: false,
      text:['佳','欠佳'],
      inRange: {
        color: ["#027b92","#23a0a5","#3bbbb3","#5bdec5","#54eec0",]
      },
      orient:'horizontal',
      left:'center',
      bottom:'2.5%',
      textStyle:{
        color: '#646464'
      }
  },
    calendar: [{
      left: 'center',
      top: '25%',
      cellSize: [38, 38],
      yearLabel: {show: false},
      orient: 'vertical',
      splitLine: {
        show:false,
      },
      itemStyle:{
        color: '#f4f4f4',
        borderWidth: 1,
        borderColor:'#fff'
      },
      dayLabel: {
          color: '#272343',
          nameMap:'cn',
          firstDay: 1,
          fontSize: 16,
          margin: '7',
          fontWeight: 'bolder',
      },
      monthLabel: {
          show: false
      },
      range: thisMonth
    }],
    series: [
    {
      name: '状态',
      type: 'heatmap',
      coordinateSystem: 'calendar',
      
      data: graphData
    },
    {
    type: 'scatter',
        coordinateSystem: 'calendar',
        symbolSize: 1,
        label: {
            show: true,
            formatter: function (params) {
                var d = echarts.number.parseDate(params.value[0]);
                return d.getDate();
            },
            color: '#fff'
        },
        data: graphData
      }
    ]
  };
  return option;
  },
  initGraphChart(thisMonth, graphData){
    console.log(this.graphComponent)
    this.graphComponent.init((canvas, width, height, dpr) => {
      chartGraph = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chartGraph);
      var graphOption = this.getGraphOption(thisMonth, graphData)
      chartGraph.setOption(graphOption)
      return chartGraph;
    });
  },


  prevMonth(){
    const that = this
    var prevMonth = that.data.month-1;
    var prevYear = that.data.year;
    if(prevMonth<=0){
      prevMonth = 12
      prevYear = prevYear-1
    }
    wx.cloud.callFunction({
      name: 'statistic',
      data:{
        type:  'prev',
        year:  prevYear,
        month: prevMonth,
      },
      success:function(res){
        console.log(res)
        if(res.result.signal == 'fail'){
          wx.showToast({
            title: '没有更早的记录了~',
            icon:'none',
            duration:1500
          })
        }
        else{
          var graphData = res.result.graphRes
          var lineData = res.result.lineRes
          var lineX = []
          var year =  prevYear
          var month = prevMonth
          var thisMonth = year + '-' + month
          for(var i in graphData){
            lineX.push(graphData[i][0].split("-")[2])
          }
          var maxVisualPoint = 0
          if(lineData.length >10)
            maxVisualPoint = 10
          else
            maxVisualPoint = lineData.length

          that.initLineChart(lineData,lineX,maxVisualPoint)
          that.initGraphChart(thisMonth, graphData)
          
          console.log(graphData)
          console.log(lineData)
          console.log(lineX)
          console.log(thisMonth)

          that.setData({
            year: prevYear,
            month: prevMonth,
          })
        }
      }
    })
  },
  nextMonth(){
    const that = this
    if(that.data.year==new Date().getFullYear() && that.data.month==new Date().getMonth()+1){
      wx.showToast({
        title: '下个月还没到来哦',
        icon:'none',
        duration: 1500
      })
    }
    else{
      var nextMonth = that.data.month+1;
      var nextYear = that.data.year;
      if(nextMonth>=13){
        nextYear+=1
        nextMonth=1
      }
      wx.cloud.callFunction({
        name:'statistic',
        data:{
          type:'next',
          year: nextYear,
          month: nextMonth,
        },
        success:function(res){
          console.log(res)
          var graphData = res.result.graphRes
          var lineData = res.result.lineRes
          var lineX = []
          var year =  nextYear
          var month = nextMonth
          var thisMonth = year + '-' + month
          for(var i in graphData){
            lineX.push(graphData[i][0].split("-")[2])
          }
          var maxVisualPoint = 0
          if(lineData.length >10)
            maxVisualPoint = 10
          else
            maxVisualPoint = lineData.length

          that.initLineChart(lineData,lineX,maxVisualPoint)
          that.initGraphChart(thisMonth, graphData)
          
          console.log(graphData)
          console.log(lineData)
          console.log(lineX)
          console.log(thisMonth)

          that.setData({
            year: nextYear,
            month: nextMonth,
          })
        },
        fail:function(res){
          console.error(res)
        }
      })
    }
  }
});