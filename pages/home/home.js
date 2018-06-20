// pages/home/home.js
//获取应用实例
const app = getApp()
var list = null
var page
var pSize = 50
var end = false
var nodata = false
var code
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
    wx.showLoading({
        title: '正在加载...',
        mask: true
    })
    this.onrefresh();
    var that = this

    wx.getStorage({
      key: 'openid',
      success: function(res) {
        console.log('已经存在openid--->' + res.data)
      },
      fail:function(e){
        // 登录
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            code = res.code
            that.getOpenid(code);
          }
        })
      }
    })
  },

  getOpenid:function(wcode){
    wx.request({
      url: 'https://nz.qqtn.com/zbsq/index.php?m=api&c=make_gif&a=init',
      //注册
      data: {
        'code': wcode
      },
      method: 'GET',
      success: function (result) {
        let openid = result.data.openid;
        console.log('新获取openid--->' + openid)
        wx.setStorage({
          key: 'openid',
          data: openid,
        })
      }
    })
  },
  getData: function () {
    var that = this;
    wx.request({
      url: 'https://nz.qqtn.com/zbsq/index.php?m=api&c=make_gif&a=templist',
      method: 'GET',
      data: {
        'page': page,
        'page_size': pSize
      },
      success: function (res) {
        wx.hideLoading();
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
        
        console.log('end--->' + end)

        if(list == null || list.length == 0){
          nodata = true;
        }
        
        that.setData({
          giflist: list,
          is_end : end,
          is_nodata : nodata,
          is_version_show:true
        });
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh()
      }
    })
  },
  onrefresh:function(){
    page = 1;
    list = null;
    this.getData();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    page = 1;
    list = null;
    this.getData();
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
      title: '抱歉，有了GIF在线制作真的可以为所欲为！',
      path: '/pages/home/home',
      imageUrl: '/pages/images/share_default.png',
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
  },
  
  version: function () {
    var text = 'GIF在线制作提醒您：GIF在线制作所有内容都由网友自行发布提供,GIF' +
      '在线制作仅为网友提供信息的交流平台。根据用户的信息发布指令' +
      'F在线制作系统会以非人工方式自动生成GIF。GIF在线制作自身不控' +
      '制、编辑或修改任何网页的信息。GIF在线制作重视知识产权保护' +
      '并制定了旨在保护权利人的合法权益的措施和步骤, 当权利人发现' +
      '在GIF在线制作的内容侵犯其著作权时, 请权利人向GIF在线制作发出书' +
      '面“权利通知”,GIF在线制作将依法采取措施移除相关内容或断开相关' +
      '链接。GlF在线制作高度重视知识产权保护并遵守各项知识产权法律' +
      '法规和具有约束力的规范性文件。根据法律、法规和规范性文件要' +
      '求, GIF在线制作制定了旨在保护知识产权权利人合法权益的措施和' +
      '步骤, 当著作权人或依法可以行使著作权的权利人(以下简称“权利' +
      '人)发现在GIF在线制作网页的内容侵犯其著作权时, 权利人应事先' +
      '向GIF在线制作发出书面的“权利通知”, GIF在线制作将根据法律法规和' +
      '政府规范性文件采取措施移除相关内容或断开相关链接。具体措施' +
      '和步骤如下:权利通知任何个人或单位如果同时符合以下两个条' +
      '件:1、是某一作品的著作权人或依法可以行使著作权的权利人' +
      '2、通过用户上传信息指令以非人工方式自动生成的GIF侵犯了上述' +
      '作品的著作权。请上述个人或单位务必以书面的通讯方式向GIF字' +
      '幕菌提交权利通知。为有效处理上述个人或单位的权利通知, 通知' +
      '书应当包含下列内容:1、权利人的姓名(名称) 、联系方式和地址' +
      '2、要求删除或者断开链接的侵权作品、表演、录像制品的名称和网' +
      '络地址;3、构成侵权的初步证明材料(包括且不限于权利人对涉嫌' +
      '侵权内容拥有著作权或依法可以行使著作权的权属证明) 。4、权利' +
      '人对通知书的真实性声明。5、请您签署该文件, 如果您是依法成立' +
      '的机构或组织, 请您加盖公章。请您把以上资料和联络方式书面发' +
      '往以下地址: gifmake2018_online@163.com'
    wx.showModal({
      title: '免责申明',
      content: text,
      showCancel: false,
      success: function (res) {
        if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})