//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
      isShowYYSSelecteView: true,
      isShowSSSelecteView: true,
      isGuessModel: true,
      enemyWinRate: "计算中",
      myWinRate: "计算中",
      currentModel: "猜牌模式",
      functionList: [],
      enemyTeam: [{},{},{},{},{}],
      myTeam: [{},{},{},{},{}],
      SSList: null,
      YYSList: null,
      enemyYYS: null,
      myYYS: null,
      overflowY:130,
      teamIndex: 0,
      arrowX: 0,
      userInfo:{}
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
    ]



    this.setData({
      functionList: functionList,
    })

    this.getDataInfo();

  },
  onClickSelecteYYS: function(e) {

    var isMy = e.currentTarget.dataset.ismy;
    var y = this.data.overflowY;
    if (isMy) {
      y = 450
    } else {
      y = 130
    }
    this.setData(
      { 
        arrowX: 65,
        overflowY: y,
        isShowYYSSelecteView: false,
        isShowSSSelecteView: true
      }
     )
  },
  onClickSelecteSS: function(e) {
    var isMy = e.currentTarget.dataset.ismy
    var y = this.data.overflowY
    var index = parseInt(e.currentTarget.dataset.index)
    if (isMy) {
      y = 616
    } else {
      y = 298
    }
    console.log(e)
    this.setData(
      { 
        arrowX: index*(128 + 16)  + 8 + 64,
        teamIndex: index,
        overflowY: y,
        isShowSSSelecteView: false,
        isShowYYSSelecteView: true
      }
    )
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
    this.setData({
      enemyTeam: [{}, {}, {}, {}, {}]
    })
  },
  cleanMySS: function() {
    this.setData({
      myTeam: [{},{},{},{},{}]
    })
  },
  changeModel: function() {
    if (this.data.isGuessModel) {
      this.setData({
        isGuessModel: false,
        currentModel: "自选模式"
      })
      self.getGuessCardGroup(true)
      self.getGuessCardGroup(false)
    } else {
      this.setData({
        isGuessModel: true,
        currentModel: "猜牌模式"
      })
    }
    
  },
  chooseYYS: function(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    var isMy = this.data.overflowY > 320
    if (isMy) {
      var myYYS = this.data.myYYS
      myYYS = this.data.YYSList[index]
      this.setData({
        myYYS: myYYS,
        isShowYYSSelecteView: true
      })
    } else {
      var enemyYYS = this.data.enemyYYS
      enemyYYS = this.data.YYSList[index]
      this.setData({
        enemyYYS: enemyYYS,
        isShowYYSSelecteView: true
      })
    }
  },
  chooseSS: function(e) {

    var index = parseInt(e.currentTarget.dataset.index)
    var isMy = this.data.overflowY > 320
    console.log(index)
    if (isMy) { // 我方
      var myTeam = this.data.myTeam
      if (myTeam.length <= index) { //  新增
        myTeam.push(this.data.SSList[index])
      } else { // 修改
        myTeam[this.data.teamIndex] = this.data.SSList[index]
      }
    
      this.setData({
        myTeam: myTeam,
        isShowSSSelecteView: true
      })
    } else { // 敌方
      var enemyTeam = this.data.enemyTeam
      if (enemyTeam.length <= index) { //  新增
        enemyTeam.push(this.data.SSList[index])
      } else { // 修改
        enemyTeam[this.data.teamIndex] = this.data.SSList[index]
      }
      this.setData({
        enemyTeam: enemyTeam,
        isShowSSSelecteView: true
      })
    }

    this.getWinRate(ismy)
  },
  getDataInfo: function(isMy) {

    wx:wx.request({
      url: app.globalData.baseUrl + "/v1/querySCardsInfo",
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        console.log(res.data.data)
        this.setData({
          SSList: res.data.data.cards,
          YYSList: res.data.data.roles
        })
        console.log("querySCardsInfo Success!!!!")
      },
      fail: function(res) {
        console.log("querySCardsInfo Fail!!!!!!")
      },
      complete: function(res) {
        console.log("querySCardsInfo complete!!!!!!")
      },
    })
  },
  getGuessCardGroup: function(isMy) {
    wx:wx.request({
      url: app.globalData.baseUrl + '/v1/querySCardGroup',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'json',
      success: res => {
        if (ismy) {
          this.setData({
            myTeam: res.result.cards
          })
        } else {
          this.setData({
            enemyTeam: res.result.cards
          })
        }
      },
      fail: function(res) {

      },
      complete: function(res) {

      },
    })
  },
  getWinRate:function() {

    var cards = []
    var team = this.data.myTeam
    var roleID = this.data.myYYS.roleID
    for (x in team) {
      if (x.cardID == null) {
        continue
      }
      cards.push(x.cardID)
    }

    if(cards.length != 5) {
      return
    }

    wx:wx.request({
      url: app.globalData.baseUrl + "/v1/calculateSCardWRate",
      data: {
        cards: cards,
        role: roleID
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'json',
      success: res => {
        if (isMy) {
          this.setData({
            myWinRate: res.data.resul
          })
        } else {
          this.setData({
            enemyWinRate: res.data.resul
          })
        }
      },
      fail: function(res) {

      },
      complete: function(res) {

      },
    })
  }
})
