// compoents/scale_button/scale_button.js
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
    animationData: {}
  },
  /**
   * 组件的方法列表
   */
  methods: {
    action(e, s) {
      var index = e.currentTarget.dataset.index
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.scale(s, s).step()
      this.setData({
          animationData: this.animation.export()
      })
    },
    start(e) { 
      this.action(e, 0.8)
    },
    end(e) {
      this.action(e, 1.0)
    },
  }
})
