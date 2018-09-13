// Pages/first/first.js
var app = getApp()


Page({
    data: {

    },

    onToProblem: function (event) {
        wx.navigateTo({
            url: '../questions/questions',
        })
    },

    change_page: function(event){
        console.log('跳转页面', event)

        app.globalData.select_page_id = Number(event.currentTarget.dataset.id)

        wx.navigateTo({
            url: '../index/index',
        })
    },
})