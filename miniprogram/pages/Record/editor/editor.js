// pages/Record/editor/editor.js
var that;

Component({
  data: {
    content: '',
    formats: {}, // 样式
    placeholder: '开始输入...',
  },
  
  methods:{
    onLoad() {
      that = this;
    },
    // 初始化编辑器
    onEditorReady() {
      wx.createSelectorQuery().select('#editor').context(function(res) {
        that.editorCtx = res.context
        

        var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
        // var currentPage = pages[pages.length - 1]  // 获取当前页面
        var prevPage = pages[pages.length - 2]    //获取上一个页面
        if(prevPage.data.curIndex != -1)
          that.data.content = prevPage.data.dataArr[prevPage.data.curIndex].note
        else
          console.error('*****curIndex全局页面索引值为-1******')
        console.log(that.data.content)
        that.editorCtx.insertText(that.data.content) // 注意：插入的是对象
        that.editorCtx.setContents({
          html:that.data.content,
          success:function(res){
            console.log('***随手小记文本获取成功***')
          }
        })

  
      }).exec()
    },
    // 返回选区已设置的样式
    onStatusChange(e) {
      console.log(e.detail)
      const formats = e.detail
      this.setData({
        formats
      })
    },
    // 内容发生改变
    onContentChange(e) {
      // console.log("内容改变")
      // console.log(e.detail)
      // that.setData({
      //   content: e.detail
      // })
      // wx.setStorageSync("content", e.detail)
    },
    // 失去焦点
    onNoFocus(e) {
      // console.log("失去焦点")
      // console.log(e.detail)
      // that.setData({
      //   content: e.detail
      // })
      // wx.setStorageSync("content", e.detail)
    },
    // 获取内容
    clickLogText(e) {

      that.editorCtx.getContents({
        success: function(res) {
          var pages = getCurrentPages()    
          var prevPage = pages[pages.length - 2]  

          //*********对Record页面数据做修改********//
          if(prevPage.data.curIndex != -1)
            prevPage.data.dataArr[prevPage.data.curIndex].note = res.html
          else
            console.error('*****curIndex全局页面索引值为-1******')
          
          console.log(prevPage.data.dataArr[prevPage.data.curIndex].note)
          prevPage.setData({
            dataArr: prevPage.data.dataArr
          })
          console.log('*******修改Record页面数据成功*******')
          that.noteBack()

          //*********上传数据库********//
          wx.cloud.callFunction({
            name:'noteUpload',
            data:{
              curDate: prevPage.data.dataArr[prevPage.data.curIndex].date,
              noteHTML: res.html
            },
            success:function(res){
              console.log('****执行云函数noteUpload成功****')
            },
            fail:function(res){
              console.error('****执行云函数noteUpload失败****')
            }
          })

          

        }
      })
    },
    // 清空所有
    clear() {
      this.editorCtx.clear({
        success: function(res) {
          console.log("清空成功")
        }
      })
    },
    // 清除样式
    removeFormat() {
      this.editorCtx.removeFormat()
    },
    // 记录样式
    format(e) {
      let {
        name,
        value
      } = e.target.dataset
      if (!name) return
      this.editorCtx.format(name, value)
    },
  
     // 返回
     noteBack:function(e){
      console.log('返回到Record页');
      // console.log(getCurrentPages());
      wx.navigateBack({
        delta: 1
      })
    }
  }
  

 
  
  
})
