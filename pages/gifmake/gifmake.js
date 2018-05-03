// pages/gifmake/gifmake.js
var gifinfo;
var talklist;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    console.log('gifmake id --->'+ options.id)
    var Page$this = this;
    wx.request({
      url: 'https://nz.qqtn.com/zbsq/index.php?m=api&c=make_gif&a=zimu',
      method: 'GET',
      data: {
        'id': options.id
      },
      success: function (res) {
        wx.hideLoading()
        gifinfo = res.data.data;
        wx.setNavigationBarTitle({
          title: gifinfo.name,
        })
        talklist = gifinfo.input_placeholder;
        Page$this.setData({
          gifImgUrl: gifinfo.preview_image,
          senslist: talklist,
          maxlength: gifinfo.zimu_num
        })
      },
      fail: function (res) {
        wx.hideLoading()
        console.log('fail--->')
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  inputChange:function(e){
    let i = e.currentTarget.dataset.i
    talklist[i] = e.detail.value;
  },
  create:function(){
    console.log(talklist)
    wx.navigateTo({
      url: '/pages/gifresult/gifresult',
    })
  }
})