// Pages/info/info.js
var app = getApp()


Page({
    data: {
        data: '',
    },

    onLoad: function (options) {
        let position_name = app.globalData.select_position_name
        let openid = app.globalData.openid
        let that = this

        wx.request({
            url: app.globalData.url.getPositionInfo,
            method: 'POST',
            header: { 'content-type': 'application/json' },
            data: { openid: openid, position: position_name },
            success: res => {
                console.log('获取地点详细信息', res)

                //处理地点介绍文本
                res.data.introduction = '&nbsp;&nbsp;&nbsp;&nbsp;' + res.data.introduction.replace(/\n/g, '\n&nbsp;&nbsp;&nbsp;&nbsp;')
                
                that.setData({
                    data: res.data
                })
            },
            complete: msg => {
                wx.hideLoading()
            }
        })
    },

    toMap: function(event){
        app.globalData.map.destination = this.data.data
        wx.navigateTo({
            url: '../map/map',
        })
    },
})