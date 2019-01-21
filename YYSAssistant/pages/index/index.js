//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
      isShowYYSSelecteView: true,
      isShowSSSelecteView: true,
      isGuessModel: true,
      enemyWinRate: "0%",
      myWinRate: "0%",
      currentModel: "猜牌模式",
      functionList: [],
      enemyTeam: [],
      myTeam: [],
      SSList: [],
      YYSList: []
  },
  onLoad: function () {
    var functionList = [
      {
        img:"../../images/more_function_grade_img.png",
        name: "战绩分析"
      },
      {
        img: "../../images/more_function_team_config_img.png",
        name: "阵容搭配"
      },
      {
        img: "../../images/more_function_train_img.png",
        name: "翻牌训练"
      },
      {
        img: "../../images/more_function_yh_img.png",
        name: "模拟御魂强化"
      }
    ];

    this.setData({
      functionList: functionList
    })
  },
  onClickSelecteYYS: function() {
    this.setData({ isShowYYSSelecteView: false })
  },
  onClickSelecteSS: function() {
    this.setData({ isShowSSSelecteView: false })
  },
  onClickWaiteFunture: function() {
    wx.showModal({
      content: '敬请期待',
      showCancel: false
    })
  },
  onTapCloseOverflow: function() {

  },
  cleanEnemySS: function() {

  },
  cleanMySS: function() {

  },
  changeModel: function() {
    if (this.data.isGuessModel) {
      this.setData({
        isGuessModel: false,
        currentModel: "自选模式"
      })
    } else {
      this.setData({
        isGuessModel: true,
        currentModel: "猜牌模式"
      })
    }
    
  }
})
