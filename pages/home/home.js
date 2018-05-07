// pages/home/home.js
var list = null
var page
var pSize = 50
var end = false
var nodata = false
Page({
  /**
   * 页面的初始数据
   */
  data: {
    is_load_more: false,
    is_end: end,
    is_nodata: nodata
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'GIF在线制作',
    })
    
    page = 1;
    list = null;
    var Page$this = this;
    this.getData(Page$this);
  },
  getData: function (that) {

    console.log('getData--->')

    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://nz.qqtn.com/zbsq/index.php?m=api&c=make_gif&a=templist',
      method: 'GET',
      data: {
        'page': page,
        'page_size': pSize
      },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh();

        if(page == 1){
          list = res.data.data;
        }else{
          if(list != null){
            list = list.concat(res.data.data);
          }
        }

        if (res.data.data != null && res.data.data.length < pSize){
          end = true;
        }
        
        if(list == null || list.length == 0){
          nodata = true;
        }
        
        that.setData({
          giflist: list,
          is_end : end,
          is_nodata : nodata
        });
      },
      fail: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      }
    })
  },
  onrefresh:function(){
    page = 1;
    list = null;
    var Page$this = this;
    this.getData(Page$this);
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    page = 1;
    list = null;
    var Page$this = this;
    this.getData(Page$this);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!end) {
      page++;
      var Page$this = this;
      this.getData(Page$this);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'gif在线制作',
      path: '/pages/home/home',
      imageUrl: '',
      success: function (res) {
        // 转发成功
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  },
  createDetail:function(e){
    var id = e.currentTarget.dataset.id;
    console.log('id--->'+id);
    wx.navigateTo({
      url: '/pages/gifmake/gifmake?id='+id,
    })
  }
})