//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
      isShowPayAlert: true, //  true是隐藏
      isShowYYSSelecteView: true,//  true是隐藏
      isShowSSSelecteView: true,//  true是隐藏
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
        name: "模拟对战",
        des: ""
      },
      {
        img: "../../images/more_function_team_config_img.png",
        name: "猜牌模式",
        des: ""
      },
      {
        img: "../../images/more_function_train_img.png",
        name: "战绩分析",
        des: "即将上线"
      },
      {
        img: "../../images/more_function_yh_img.png",
        name: "模拟御魂强化",
        des: "即将上线"
      }
    ]

    wx.showShareMenu({
      withShareTicket: true
    })

    this.setData({
      functionList: functionList,
    })

    this.getDataInfo();

  },
  //  点击选择阴阳师
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
  //  点击选择式神
  onClickSelecteSS: function(e) {
    var isMy = e.currentTarget.dataset.ismy
    var y = this.data.overflowY
    var index = parseInt(e.currentTarget.dataset.index)
    if (isMy) {
      y = 616
    } else {
      y = 298
    }
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
  //  展示敬请期待弹窗
  onClickWaiteFunture: function() {
    wx.showModal({
      content: '敬请期待',
      showCancel: false
    })
  },
  onTapCloseOverflow: function() {
    // console.log(this.data.isShowSSSelecteView)
    // console.log(this.data.isShowYYSSelecteView)
    // if (!this.data.isShowSSSelecteView || !this.data.isShowYYSSelecteView) {
    //   this.setData(
    //     {
    //       isShowSSSelecteView: true,
    //       isShowYYSSelecteView: true
    //     }
    //   )
    // }
  },
  //  清空地方式神
  cleanEnemySS: function() {
    this.setData({
      enemyTeam: [{}, {}, {}, {}, {}]
    })
  },
  //  清空我方式神
  cleanMySS: function() {
    this.setData({
      myTeam: [{},{},{},{},{}]
    })
  },
  //  更改模式
  changeModel: function() {
    if (this.data.isGuessModel) {
      this.setData({
        isGuessModel: false,
        currentModel: "自选模式",
        // isShowPayAlert: false
      })
      this.getGuessCardGroup(true)
      this.getGuessCardGroup(false)
    } else {
      this.setData({
        isGuessModel: true,
        currentModel: "猜牌模式"
      })
    }
    
  },
  //  选择阴阳师
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
  //  选择式神
  chooseSS: function(e) {

    var index = parseInt(e.currentTarget.dataset.index)
    var isMy = this.data.overflowY > 320

    if (isMy) { // 我方
      var myTeam = this.data.myTeam
      myTeam[this.data.teamIndex] = this.data.SSList[index]
    
      this.setData({
        myTeam: myTeam,
        isShowSSSelecteView: true
      })
    } else { // 敌方
      var enemyTeam = this.data.enemyTeam
      enemyTeam[this.data.teamIndex] = this.data.SSList[index]
      this.setData({
        enemyTeam: enemyTeam,
        isShowSSSelecteView: true
      })
    }

    this.getWinRate()
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
  //  获取猜牌模式卡组
  getGuessCardGroup: function(isMy) {
    wx:wx.request({
      url: app.globalData.baseUrl + '/v1/querySCardGroup',
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        console.log(res)
        if (isMy) {
          this.setData({
            myTeam: res.data.data.group
          })
        } else {
          this.setData({
            enemyTeam: res.data.data.group
          })
        }
      },
      fail: function(res) {

      },
      complete: function(res) {

      },
    })
  },
  //  获取胜率
  getWinRate: function () {

    var cards = []
    var hisCards = []

    this.data.myTeam.forEach(function (element) {
      if (element.Cardid != null) {
        cards.push(element.Cardid)
      }
      
    });

    this.data.enemyTeam.forEach(function (element) {
      if (element.Cardid != null) {
        hisCards.push(element.Cardid)
      }

    });

    if (cards.length != 5 || hisCards.length != 5) {
      return
    }

    wx:wx.request({
      url: app.globalData.baseUrl + "/v1/caculateSCards",
      data: {
        'myCardidArray': cards[0],
        'myCardidArray': cards[1],
        'myCardidArray': cards[2],
        'myCardidArray': cards[3],
        'myCardidArray': cards[4],
        'hisCardidArray': hisCards[0],
        'hisCardidArray': hisCards[1],
        'hisCardidArray': hisCards[2],
        'hisCardidArray': hisCards[3],
        'hisCardidArray': hisCards[4],
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        console.log("计算胜率成功")
        console.log(res)
        // this.setData({
        //   myWinRate: res.data.winrate,
        //   enemyWinRate: 1 - res.data.winrate
        // })
      },
      fail: function(res) {
        console.log("计算胜率失败")
      },
      complete: function(res) {
        console.log("计算胜率完成")
      },
    })
  },
  onShareAppMessage: function () {
    if (!this.data.id) {
      // todo 返回默认分享信息，比如小程序首页
    }

    return {
      title: '分享',
      path: 'share?id=' + app.globalData.code,
      success: function (res) {
        console.log("分享出去了")
        console.log(res)

        wx.showShareMenu({
          withShareTicket: true
        })
      }
    };
  },
  payment: function() {
    wx:wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: '',
      paySign: '',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onTapCloseAlert: function() {
    this.setData({
      isShowPayAlert: true
    })
  }
})
