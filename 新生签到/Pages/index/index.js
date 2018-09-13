// Pages/index/index.js

var amapFile = require('../../amap-wx.js');
// 实例化API核心类
var myAmapFun = new amapFile.AMapWX({ key: '9b14dde7a0513606260b7e3941158985' });

var app = getApp()

var page_functions = {
    page_1: page_1_load,
    page_2: page_2_load,
    page_3: page_3_load,
    page_4: page_4_load,
    page_5: page_5_load,
    page_6: page_6_load,
}

function go_to_bind_user_info(that) {
    wx.showModal({
        title: '提示',
        content: '你还没绑定信息呢，快去绑定吧',
        confirmText: '去绑定',
        showCancel: false,
        success: msg => {
            if (msg.confirm) {
                that.change_tag_by_id(that, 4)
            }
        }
    })
}

function page_1_load(that) {
    console.log('page-1加载事件触发')

    wx.request({
        url: app.globalData.url.getLocationList,
        method: 'POST',
        header: { 'content-type': 'application/json' },
        data: { openid: app.globalData.openid },
        success: res => {
            if (res.data.msg == 'noBind') {
                console.log('未绑定跳转')
                go_to_bind_user_info(that)
            }
            else {
                console.log('获取地点列表', res)
                let location_list = []
                let all_locations = res.data.position_data
                let pagedata = that.data.pagedata

                all_locations.forEach((item, index, array) => {
                    location_list = location_list.concat(item.position_name)
                })

                pagedata.page_1.location_list = location_list
                pagedata.page_1.position_data = all_locations

                that.setData({
                    pagedata: pagedata
                })
            }
        },
        fail: err => {
            console.error('获取地点列表失败', err)
        }
    })

}

function page_2_load(that) {
    console.log('page-2加载事件触发')
    let openid = app.globalData.openid

    wx.showLoading({
        title: '加载中...',
        mask: true,
    })

    wx.request({
        url: app.globalData.url.getInfo,
        method: 'POST',
        data: {
            openid: openid
        },
        header: {
            'content-type': 'application/json'
        },
        success: res => {
            wx.hideLoading()
            if (res.data.msg == 'noBind') {
                console.log('未绑定跳转')
                go_to_bind_user_info(that)
            }
            else {
                console.log('获取个人信息成功', res)
                let pagedata = that.data.pagedata

                pagedata.page_2.info = res.data.data

                that.setData({
                    pagedata: pagedata
                })
            }
        },
        fail: err => {
            wx.hideLoading()
        }
    })
}


function page_3_load(that) {
    console.log('page-3加载事件触发')
    let openid = app.globalData.openid

    wx.showLoading({
        title: '加载中...',
        mask: true,
    })

    wx.request({
        url: app.globalData.url.getLocationList,
        method: 'POST',
        header: { 'content-type': 'application/json' },
        data: { openid: openid },
        success: res => {
            wx.hideLoading()

            if (res.data.msg == 'noBind') {
                console.log('未绑定跳转')
                go_to_bind_user_info(that)
            }
            else {
                console.log('获取地点列表成功', res)
                let location_list = res.data.position_data
                let pagedata = that.data.pagedata

                pagedata.page_3.location_list = location_list

                that.setData({
                    pagedata: pagedata
                })
            }
        },
        fail: err => {
            wx.hideLoading()
        }
    })
}

function page_4_load(that) {
    console.log('page-4加载事件触发')


    that.get_list(that)
}

function page_5_load() {
    console.log('page-5加载事件触发')

    wx.showModal({
        title: '提示',
        content: '请根据校园卡上的信息填写，奖品领取需要验证校园卡上的信息（本次活动仅限 2018级新生参加）。',
        confirmText: '我知道了',
        showCancel: false,
    })
}


function page_6_load() {
    console.log('page-6加载事件触发')
}

Page({
    data: {
        titles: [
            { id: 'page_1', name: '地点签到', style: '' },
            { id: 'page_2', name: '个人信息', style: '' },
            { id: 'page_3', name: '所有地点', style: '' },
            { id: 'page_4', name: '用户排名', style: '' },
            { id: 'page_5', name: '信息绑定', style: '' },
            { id: 'page_6', name: '活动介绍', style: '' },
        ],
        currentTag: 0,
        currentTagStyle: 'border-bottom: none; color: #68AB78; border-bottom-right-radius: 0; border-bottom-left-radius: 0;',
        pagedata: {
            page_1: {
                show: false,
                location_list: [],
                position_data: [],
            },
            page_2: {
                show: false,
                info: {}

            },
            page_3: {
                show: false,
                showList: true,
                selectLocation: 0,
                location_list: []
            },
            page_4: {
                show: false,
                list: [],
                page: 1,
                user_rankInfo: {},
            },
            page_5: {
                show: false,
                submit_data: {},
                aca_list: [
                    '中国语言文学类',
                    '法学类',
                    '哲学类',
                    '经济管理类',
                    '外国语言文学类',
                    '数学物理类',
                    '化学生物环境类',
                    '地信类',
                    '计算机信息类',
                    '电子信息类',
                    '冶金材料类',
                    '能源类',
                    '土木安全类',
                    '交通运输类',
                    '机械类',
                    '自动化与电气类',
                    '航空航天类',
                    '软件工程类',
                    '临床及口腔五年制医学类',
                    '临床八年类',
                    '非临床五年制医学类',
                    '口腔医学(5+3)类',
                    '医学四年类',
                    '运动训练类',
                    '艺术设计类',
                    '建筑城规类',
                    '音乐舞蹈类',
                ]
            },
            page_6: {
                show: false
            },
        }
    },

    onLoad: function (event) {
        if (app.globalData.select_page_id != '') {
            let current_tag = app.globalData.select_page_id
            let titles = this.data.titles
            let pagedata = this.data.pagedata
            let current_id = titles[current_tag].id

            titles[current_tag].style = this.data.currentTagStyle
            pagedata[current_id].show = !pagedata[current_id].show
            app.globalData.select_page_id = ''

            this.setData({
                titles: titles,
                pagedata: pagedata,
                currentTag: current_tag
            })

            page_functions[current_id](this)
        }
        else {
            let current_tag = this.data.currentTag
            let titles = this.data.titles
            let pagedata = this.data.pagedata
            let current_id = titles[current_tag].id

            titles[current_tag].style = this.data.currentTagStyle
            pagedata[current_id].show = !pagedata[current_id].show

            this.setData({
                titles: titles,
                pagedata: pagedata
            })

            page_functions[current_id](this)
        }
    },

    change_tag_by_id: function (that, id) {
        let current_tag = that.data.currentTag
        let titles = that.data.titles
        let pagedata = that.data.pagedata
        let current_id = titles[current_tag].id
        let next_id = titles[id].id

        titles[current_tag].style = ''
        titles[id].style = that.data.currentTagStyle

        pagedata[current_id].show = !pagedata[current_id].show
        pagedata[next_id].show = !pagedata[next_id].show

        //改变样式，切换页面
        that.setData({
            titles: titles,
            currentTag: id,
            pagedata: pagedata,
        })

        page_functions[next_id](that)
    },

    changeTag: function (event) {
        //console.log('点击事件', event)

        let index = Number(event.currentTarget.dataset.index)
        let that = this
        this.change_tag_by_id(that, index)
    },

    setValue: function (event) {
        console.log('用户输入', event.currentTarget.dataset.id, event.detail.value)

        let key = event.currentTarget.dataset.id
        let value = event.detail.value

        if (key == 'stuCollege') {
            this.data.pagedata.page_5.submit_data[key] = this.data.pagedata.page_5.aca_list[value]
        }
        else {
            this.data.pagedata.page_5.submit_data[key] = value
        }


        this.setData({
            pagedata: this.data.pagedata
        })
    },

    showLocationInfo: function (event) {
        console.log('page-3点击事件', event)

        let index = event.currentTarget.dataset.id

        app.globalData.select_position_name = this.data.pagedata.page_3.location_list[index].position_name

        wx.navigateTo({
            url: '../info/info',
            success: res => {
                wx.showLoading({
                    title: 'Loading',
                    mask: true,
                })
            }
        })
    },

    page_1_selector_change: function (event) {
        console.log('选择签到地点', event)
        let index = Number(event.detail.value)
        let pagedata = this.data.pagedata

        pagedata.page_1.will_sign_position = index

        this.setData({
            pagedata: pagedata
        })
    },

    page_1_success_sign: function (that) {
        let page_1 = that.data.pagedata.page_1
        let id = page_1.will_sign_position
        let position_name = page_1.location_list[id]
        let openid = app.globalData.openid

        wx.request({
            url: app.globalData.url.sign,
            method: 'POST',
            header: { 'content-type': 'application/json' },
            data: { openid: openid, position: position_name },
            success: res => {
                console.log('签到返回数据', res)
                let data = res.data
                if (data.msg == 'hasBind') {
                    //打卡成功
                    wx.showToast({
                        title: '打卡成功',
                    })

                    app.globalData.select_position_name = position_name

                    wx.navigateTo({
                        url: '../info/info',
                    })
                }
                else if (data.msg == 'haveSign') {
                    //已打卡
                    wx.showModal({
                        title: '提示',
                        content: '此地点已经签到过了哦',
                        showCancel: false,
                        confirmText: '确定',
                    })
                }
                else if (data.msg == 'noBind') {
                    //未绑定
                }
                else {
                    //错误的信息
                }
            },
            fail: err => {
                console.log('签到请求发起失败', err)
            }
        })
    },

    page_1_sign: function (event) {
        console.log('page-1点击签到按钮')

        let begin_day = new Date(2018, 8 - 1, 25)
        let end_day = new Date(2018, 9 - 1, 15 + 1)
        let now = new Date()

        if (now < begin_day) {
            wx.showModal({
                title: '提示',
                content: '活动还没开始哦',
                showCancel: false,
            })
        }
        else if (now > end_day) {
            wx.showModal({
                title: '提示',
                content: '活动已经结束啦',
                showCancel: false,
            })
        }
        else {
            if (this.data.pagedata.page_1.will_sign_position >= 0) {
                let id = this.data.pagedata.page_1.will_sign_position
                let position = this.data.pagedata.page_1.position_data[id]
                let that = this

                console.log(position)

                wx.showLoading({
                    title: '签到中...',
                    mask: true,
                })

                wx.getLocation({
                    'type': 'gcj02',
                    success: function (res) {
                        myAmapFun.getWalkingRoute({
                            origin: res.longitude + ',' + res.latitude,
                            destination: position.position_longitude + ',' + position.position_latitude,
                            success: res => {
                                console.log('获取地理信息成功', res)

                                wx.hideLoading()
                                let distance = Number(res.paths[0].distance)

                                if (distance <= Number(position.position_radius)) {
                                    that.page_1_success_sign(that)
                                }
                                else {
                                    wx.showModal({
                                        title: '提示',
                                        content: '呀，离得有点远',
                                        showCancel: true,
                                        confirmText: '确定',
                                    })
                                }
                            },
                            fail: err => {
                                wx.hideLoading()
                                console.log('获取地理信息失败', err)
                            }
                        })
                    },
                })
            }
            else {
                wx.showModal({
                    title: '提示',
                    content: '请选择签到地点',
                    showCancel: false,
                    confirmText: '确定',
                    confirmColor: 'green',
                })
            }
        }
    },

    get_list: function (that) {
        let pagedata = that.data.pagedata
        let page_num = pagedata.page_4.page
        let openid = app.globalData.openid

        wx.request({
            url: app.globalData.url.getList,
            method: 'POST',
            header: { 'content-type': 'application/json' },
            data: { openid: openid, page: page_num },
            success: res => {
                if (res.data.msg == 'noBind') {
                    console.log('未绑定跳转')
                    go_to_bind_user_info(that)
                }
                else {
                    console.log('获取排名信息', res)

                    pagedata.page_4.page += 1
                    pagedata.page_4.list = pagedata.page_4.list.concat(res.data.data)
                    if (res.data.user_rankInfo) {
                        pagedata.page_4.user_rankInfo = res.data.user_rankInfo
                    }

                    that.setData({
                        pagedata: pagedata
                    })
                }
            },
            fail: err => {
                console.log('获取排名失败', err)
            }
        })
    },

    page_4_lazy_load: function (event) {
        console.log('加载排名...', event)

        this.get_list(this)
    },

    check_submit_data: function (acquire_data, data) {
        let result = true
        acquire_data.forEach((value) => {
            if (!(value in data && data[value])) {
                result = false
            }
        })
        return result
    },

    submit: function (that, user_info) {

    },

    page_5_submitInfo: function () {
        let that = this
        let acquire_data = ['stuName', 'stuId', 'stuTel', 'stuSex', 'stuCollege', 'stuClass']
        let data = that.data.pagedata.page_5.submit_data



        if (that.check_submit_data(acquire_data, data)) {

            wx.showLoading({
                title: '提交中...',
                mask: true,
            })

            wx.getUserInfo({
                success: res => {
                    console.log('获取用户信息', res)

                    let user_info = res.userInfo

                    data.username = user_info.nickName
                    data.face = user_info.avatarUrl
                    data.openid = app.globalData.openid

                    console.log('提交信息', data)

                    wx.request({
                        url: app.globalData.url.submit_info,
                        method: 'POST',
                        data: { data: data },
                        header: { 'content-type': 'application/json' },
                        success: res => {
                            console.log('提交成功', res)
                            wx.hideLoading()
                            wx.showToast({
                                title: '提交成功',
                                icon: 'success',
                                success: res => {
                                    that.change_tag_by_id(that, 1)
                                }
                            })
                        },
                        fail: err => {
                            console.error('提交失败', err)
                            wx.hideLoading()
                            wx.showToast({
                                title: '提交失败',
                                image: '../../Images/fail.png',
                            })
                        },
                    })
                },
                fail: err=>{
                    console.log('获取授权失败', err)
                }
            })
        }
        else {
            wx.showModal({
                title: '提示',
                content: '请填写完整信息',
            })
        }
    }
})