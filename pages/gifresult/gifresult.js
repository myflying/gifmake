// pages/gifresult/gifresult.js
var downUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("button share--->")
    }
    return {
      title: 'gif在线制作',
      path: '/pages/gifresult/gifresult',
      imageUrl: '../images/g1.jpg',
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    downUrl = 'https://soy.qqtn.com/cache/wangjingze-80f1ddd4fc52a5f25047547962463589.gif';
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
  downimage: function (e) {

    if (downUrl.indexOf('https') == -1) {
      downUrl = downUrl.replace('http', 'https');
    }
    console.log("down img https--->" + downUrl);

    //文件下载
    wx.downloadFile({
      url: downUrl,
      success:
      function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:
          function (data) {
            console.log("save success--->" + data);
            wx.showToast({
              title: '图片已保存',
            })
          },
          fail:
          function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  }
                  else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      }
    })
  },

  tohome:function(){
    wx.navigateTo({
      url: '/pages/home/home',
    })
  }
})