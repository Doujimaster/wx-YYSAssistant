//index.js
var WxParse = require('../wxParse/wxParse.js');
//获取应用实例
const app = getApp()

Page({
  data: {
      isShowPayAlert: true, //  true是隐藏
      isShowYYSSelecteView: true,//  true是隐藏
      isShowSSSelecteView: true,//  true是隐藏
      isHideModeBtn: true,  //  隐藏模式按钮
      isHideDetail: true,  //  详情框
      isGuessModel: false, // 是否是猜牌模式
      isReadyHide: false,
      enemyWinRate: "计算中",
      myWinRate: "计算中",
      functionList: [],
      enemyTeam: [{},{},{},{},{}],
      myTeam: [{},{},{},{},{}],
      SSList: null,
      YYSList: null,
      enemyYYS: null,
      myYYS: null,
      overflowY:130,
      teamIndex: 0,
      modelName:'猜牌模式',
      arrowX: 0,
      userInfo:{},
      resInfo:"",
      scrollViewHeight:0,
      // 页面总高度将会放在这里
      windowHeight: 0,
  },
  onLoad: function () {
    // 先取出页面高度 windowHeight
    wx.getSystemInfo({
      success: res=> {
        console.log('-------')
        console.log(res)
        this.setData({
          windowHeight: res.windowHeight,
          scrollViewHeight: res.windowHeight - 168
        })
      },
    })

    var functionList = [
      {
        img:"../../images/more_function_grade_img.png",
        name: "模拟对战",
        des: "即将上线"
      },
      {
        img: "../../images/more_function_team_config_img.png",
        name: '猜牌模式',
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
    // WxParse.wxParse('article', 'html', this.data.resInfo, this, 5);
  },
  //  点击选择阴阳师
  onClickSelecteYYS: function(e) {

    this.isReadyHide = true;
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

    this.isReadyHide = true;
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
  onClickWaiteFunture: function(e) {
    console.log(e)
    var index = parseInt(e.currentTarget.dataset.index)
    console.log(index)
    switch (index) {
      case 1:
        if (!this.data.isGuessModel) {
          this.changeModel()
        }
      break
      default:
        wx.showModal({
          content: '功能正在开发，敬请期待',
          showCancel: false
        })
      break
    }
    
  },
  onTapCloseOverflow: function() {
    if(this.isReadyHide){
      this.isReadyHide = false
      return
    }

    if (!this.data.isShowSSSelecteView || !this.data.isShowYYSSelecteView) {
      this.setData(
        {
          isShowSSSelecteView: true,
          isShowYYSSelecteView: true
        }
      )
    }
  },
  //  清空地方式神
  cleanEnemySS: function() {
    this.scrollViewHeight = this.windowHeight - 168
    this.setData({
      enemyTeam: [{}, {}, {}, {}, {}],
      myWinRate: "计算中",
      isHideDetail:true,
      enemyWinRate: "计算中",
      enemyYYS:null
    })
  },
  //  清空我方式神
  cleanMySS: function() {
    this.scrollViewHeight= this.windowHeight - 168
    this.setData({
      myTeam: [{},{},{},{},{}],
      myWinRate: "计算中",
      isHideDetail: true,
      
      enemyWinRate: "计算中",
      myYYS:null

    })
  },
  //  更改模式
  changeModel: function() {
    if (this.data.isGuessModel) {
      this.setData({
        isGuessModel: false,
        isHideModeBtn: true,
        modelName:'猜牌模式'
      })
    } else {
      this.setData({
        isGuessModel: true,
        isHideModeBtn: false,
        modelName: '自选模式'
      })
      this.cleanEnemySS()
      this.cleanMySS()

      wx.showToast({
        title: '请选择我方和敌方第一张卡牌',
        icon:'none',
        mask: true
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

    let member = this.data.SSList[index]
    var targetTeam = null
    if (isMy) { // 我方
      targetTeam = this.data.myTeam
      targetTeam[this.data.teamIndex] = member
    
      this.setData({
        myTeam: targetTeam,
        isShowSSSelecteView: true
      })
    } else { // 敌方
      targetTeam = this.data.enemyTeam
      targetTeam[this.data.teamIndex] = member
      
      this.setData({
        enemyTeam: targetTeam,
        isShowSSSelecteView: true
      })
    }

    var count = 0
    
    targetTeam.forEach(function (element) {
      if (element.Cardid != null) {
        count ++
      }
    })
    console.log(count)
    if (this.data.isGuessModel && count == 1) {
      this.getGuessCardGroup(member.Cardid,res => {
        console.log('team')
        console.log(res)
        if (res.data.data.group.length == 0) {
          return
        }
        let timestamp = Date.parse(new Date());
        let index = timestamp % res.data.data.group.length
        let group = res.data.data.group[index].Cards
        let detail = res.data.data.group[index].Detail
        let role = res.data.data.group[index].Role
        console.log('-----------------')
        console.log(group)
        
        if (isMy) {
          this.setData({
            myTeam: group,
            myYYS: role,
            resInfo: detail
          })
          
        } else {
          this.setData({
            enemyTeam: group,
            enemyYYS: role,
            resInfo: detail
            
          })
        }
        this.getWinRate()
      })
    } else{
      this.getWinRate()
    }
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
  getGuessCardGroup: function (cardID,cb) {
    let callback = new Promise((resolve,reject) => {
      wx: wx.request({
        url: app.globalData.baseUrl + '/v1/querySCardGroup',
        data: {
          'cardID': cardID
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: res => {
          typeof cb == "function" && cb(res)
        },
        fail: function (res) {
          typeof cb == "function" && cb(res)
        },
        complete: function (res) {

        },
      })
    })
    return callback;
    
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
        'myCardidArray': '['+cards.toString()+']',
        'hisCardidArray': '['+hisCards.toString()+']'
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
        let winRate = res.data.data.winrate.toFixed(4)
        this.setData({
          myWinRate: (winRate * 100).toFixed(2) + "%",
          enemyWinRate: (100 - winRate * 100).toFixed(2) + "%",
          isHideDetail: false,
          scrollViewHeight:'auto'

        })
        // WxParse.wxParse('article', 'html', this.data.resInfo, this, 5);
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
