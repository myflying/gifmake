// pages/gifmake/gifmake.js
var gifinfo;
var talklist;
var oldList;
var id;
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
    id = options.id;
    console.log('gifmake id --->'+ options.id)
    var Page$this = this;
    wx.request({
      url: 'https://nz.qqtn.com/zbsq/index.php?m=api&c=make_gif&a=zimu',
      method: 'GET',
      data: {
        'id': id
      },
      success: function (res) {
        wx.hideLoading()
        gifinfo = res.data.data;
        //console.log(gifinfo)
        wx.setNavigationBarTitle({
          title: gifinfo.name,
        })
        talklist = gifinfo.input_placeholder;
        oldList = [].concat(talklist);
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
    let oldinput = oldList[i];
    //console.log(oldinput)
    if(e.detail.value){
      talklist[i] = e.detail.value;
    }else{
      talklist[i] = oldinput;
    }
  },
  create:function(){

    var params = talklist.toString();
    params = params.replace(/,/g,'%#');

    console.log(params)

    wx.showLoading({
      title: '生成中',
    })

    wx.request({
      url: 'https://nz.qqtn.com/zbsq/index.php?m=api&c=make_gif&a=create',
      method: 'GET',
      data: {
        'id': id,
        'inputs': params
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 1){
          var gifpath = res.data.data.path;
          console.log(gifpath);

          wx.navigateTo({
            url: '/pages/gifresult/gifresult?gifpath=' + gifpath + "&name=" + gifinfo.name,
          })
        }else{
          wx.showToast({
            icon:'none',
            title: res.data.msg,
          })
          return;
        }
      },
      fail: function (res) {
        wx.hideLoading()
        console.log("fail--->" + JSON.stringify(res));
      }
    })

  }
})