
var site_root = 'https://test.geebos.cn/index.php/index'

App({
    globalData: {
        url:{
            questions: site_root+'/user/submitProblem',
            openid: site_root+'/index/login',
            getInfo: site_root+'/user/getInfo',
            getList: site_root+'/user/getRankInfo',
            submit_info: site_root+'/user/submitInfo',
            getLocationList: site_root+'/user/getAllPosition',
            sign: site_root+'/user/successSign',
            getPositionInfo: site_root +'/user/getPositionInfo',
        },
        location_list: [],
        map: {},
    },

    onLaunch: function(){
        let settings = {}
        let need_auth = ['scope.userLocation','scope.userInfo']

        wx.getSetting({
            success: (res) => {
                console.log('授权信息', res)
                settings = res.authSetting

                need_auth.forEach(value => {
                    if (!settings[value]) {
                        wx.authorize({
                            scope: value,
                            success: res=>{
                                console.log('授权成功', res)
                            },
                            fail: err=>{
                                console.log('授权失败', err)
                            }
                        })
                    }
                })
            }
        })

        let that = this

        wx.login({
            success: res => {
                let code = res.code;
                if (code) {
                    // console.log('获取用户登录凭证：' + code);
                    // ------ 发送凭证 ------
                    wx.request({
                        url: that.globalData.url.openid,
                        data: { code: code },
                        method: 'GET',
                        header: {
                            'content-type': 'application/json'
                        },
                        success: res => {
                            console.log(res)
                            that.globalData.openid = res.data.openid
                        }
                    })
                }
            }
        })
    }
})
