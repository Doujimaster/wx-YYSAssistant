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
      YYSList: [],
      enemyYYS: null,
      myYYS: null,
      overflowY:65,
      teamIndex: 0,
      arrowX: 0
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

    var defSSList = [
      {
        cardID:1,
        name: "aaa",
        winRate: 0.6,
        coverUrl: "../../images/yys.png",
        rareLevel: 1,
        fightType: 2
      },
      {
        cardID: 1,
        name: "aaa",
        winRate: 0.8,
        coverUrl: "../../images/yys2.png",
        rareLevel: 1,
        fightType: 2
      }, 
      {
        cardID: 1,
        name: "aaa",
        winRate: 1,
        coverUrl: "../../images/yys3.png",
        rareLevel: 1,
        fightType: 2
      }
    ]

    var defYYSList = [
      {
        roleID:1,
        name:"阿标",
        avatarUrl:"../../images/yys.png"
      },
      {
        roleID: 1,
        name: "阿标",
        avatarUrl: "../../images/yys2.png"
      },
      {
        roleID: 1,
        name: "阿标",
        avatarUrl: "../../images/yys3.png"
      },
      {
        roleID: 1,
        name: "阿标",
        avatarUrl: "../../images/yys.png"
      },
      {
        roleID: 1,
        name: "阿标",
        avatarUrl: "../../images/yys2.png"
      }
    ]

    var userinfo={
      userID:1,
      name:"ddd",
      isPaidBasic:true,
      inviterID: 2
    }

    this.setData({
      functionList: functionList,
      SSList: defSSList,
      YYSList: defYYSList
    })
  },
  onClickSelecteYYS: function(e) {

    var isMy = e.currentTarget.dataset.ismy;
    var y = this.data.overflowY;
    if (isMy) {
      y = 225
    } else {
      y = 65
    }
    this.setData(
      { 
        arrowX: 32,
        overflowY: y,
        isShowYYSSelecteView: false
      }
     )
  },
  onClickSelecteSS: function(e) {
    var isMy = e.currentTarget.dataset.ismy
    var y = this.data.overflowY
    var index = parseInt(e.currentTarget.dataset.index)
    if (isMy) {
      y = 308
    } else {
      y = 149
    }
    this.setData(
      { 
        arrowX: e.detail.x-8,
        teamIndex: index,
        overflowY: y,
        isShowSSSelecteView: false
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
      enemyTeam:[]
    })
  },
  cleanMySS: function() {
    this.setData({
      myTeam: []
    })
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
    
  },
  chooseYYS: function(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    var isMy = this.data.overflowY > 160
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
    var isMy = this.data.overflowY > 160
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
    
  }
})
