// pages/gifmake/gifmake.js
//获取应用实例
const app = getApp()
var gifinfo;
var talklist;
var oldList;
var id;
var code;
var encryptedData;
var iv;
var isUse = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        code = res.code
      }
    })
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
        isUse = gifinfo.is_lock;
        oldList = [].concat(talklist);
        Page$this.setData({
          gifImgUrl: gifinfo.preview_image,
          senslist: talklist,
          maxlength: gifinfo.zimu_num,
          nickname:decodeURI(gifinfo.nickname)
        })
      },
      fail: function (res) {
        wx.hideLoading()
        console.log('fail--->')
      }
    })
  },

  loadUserInfo: function (e) {
    var Page$this = this;
    
    var lock = true;
    console.log(typeof wx.getStorageSync('is_lock'))

    if (wx.getStorageSync('is_lock') == '' && typeof wx.getStorageSync('is_lock') == 'string') {
      lock = true
    } else {
      lock = wx.getStorageSync('is_lock')
    }
    console.log('make--->' + lock)
    if(isUse == 1){
      if (lock) {
        wx.getUserInfo({
          success: function (res) {
            Page$this.data.userinfo = res.userInfo
            console.log(res.userInfo)
            encryptedData = res.encryptedData;
            iv = res.iv;

            //获取用户信息之后登录
            Page$this.userLogin(Page$this);
          }
        })
      }else{
        this.create();
      }
    }else{
      this.create();
    }
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

  //制作
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
  },

  /**
     * 弹出框蒙层截断touchmove事件
     */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },

 /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var Page$this = this;
    return {
      title: 'gif在线制作',
      path: '/pages/home/home',
      imageUrl: '',
      success: function (res) {
        wx.showToast({
          title: '分享成功',
        })
        // 转发成功
        console.log('转发成功')

        wx.setStorage({
          key: "is_lock",
          data: false
        })

        Page$this.setData({
          showModal: false
        })
        Page$this.userLogin(Page$this);
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
        wx.showToast({
          title: '分享失败',
        })
      }
    }
  },

  userLogin:function(that){
    console.log(code + '---' + encryptedData + '---' + iv)
    wx.request({
      url: 'https://nz.qqtn.com/zbsq/index.php?m=api&c=make_gif&a=init',
      //注册
      data: {
        'code': code,
        'encryptedData': encryptedData,
        'iv': iv,
      },
      method: 'GET',
      success: function (result) {
        console.log(result.data)
        if(result && result.data){
          if(result.data.code == 1){
            console.log("登录成功")
            if (result.data.data.is_share == 1){
              wx.setStorage({
                key: "is_lock",
                data: false
              })

              that.create();
            }else{
              that.setData({
                showModal: true
              })
            }

          }else{
            console.log("登录失败")
          }
        }else{
          console.log("登录失败")
        }
      },
      fail: function (res) {
        console.log("登录失败")
      },
    })
  }

})