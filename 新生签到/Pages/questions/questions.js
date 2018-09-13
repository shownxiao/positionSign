// Pages/questions/questions.js
Page({

    data: {},

    setValue: function(event){
        let name = event.target.dataset.id
        this.data[name] = event.detail.value
        console.log(this.data)
    },

    onLoad: function(event){
        this.data.openid = getApp().globalData.openid
    },

    submit: function(){
        let required_data = ['openid', 'caption', 'phone', 'content']
        let data = {}
        let that = this

        required_data.forEach(value=>{
            data[value] = that.data[value]
        })

        wx.request({
            url: getApp().globalData.url.questions,
            data: data,
            method: 'POST',
            header: {'content-type':'application/json'},
            success: res=>{
                console.log(res)
            },
            faild: err=>{
                console.log(err)
            }
        })

    }
})