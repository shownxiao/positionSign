
var app = getApp()
var amapFile = require('../../amap-wx.js');
// 实例化API核心类
var myAmapFun = new amapFile.AMapWX({ key: '9b14dde7a0513606260b7e3941158985' });
var width = 50
var height = width

Page({
    data: {
        longitude: '',
        latitude: '',
        markers: [],
        circles: [],
        scale: 18
    },

    onLoad: function () {
        let that = this
        //初始化数据
        let destination = app.globalData.map.destination
        let destination_marker = {
            id: Number(destination.id),
            latitude: Number(destination.latitude),
            longitude: Number(destination.longitude),
            iconPath: '/Images/destination-pos.png',
            width: width,
            height: height,
            callout: {
                content: destination.position+'\n（点击去打卡）',
                color: 'white',
                bgColor: '#00000080',
                fontSize: 18,
                borderRadius: 8,
                padding: 5,
                display: 'ALWAYS',
                textAlign: 'center',
            }
        }
        let destination_circle = {
            latitude: Number(destination.latitude),
            longitude: Number(destination.longitude),
            radius: Number(destination.radius),
            color: '#51B4E7CC',
            fillColor: '#51B4E74D',
            strokeWidth: 1,
        }

        //创建 map组件
        let mymap = wx.createMapContext('map', this)

        wx.getLocation({
            'type': 'gcj02',
            success: function(res) {
                //渲染页面
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude,
                    markers: [destination_marker],
                    circles: [destination_circle],
                    mymap: mymap,
                    destination: destination
                })
                that.show_all_point()
            },
        })

    },
    
    focus_self: function(event){
        console.log('当前位置居中')

        this.data.mymap.moveToLocation()
        this.setData({
            scale: 18
        })
    },

    get_points: function(data){
        let all_point = []

        data.paths[0].steps.forEach((value) => {
            let points = value.polyline.split(';')
            points.forEach((point) => {
                let xy = point.split(',')
                all_point.push({
                    longitude: Number(xy[0]),
                    latitude: Number(xy[1]),
                })
            })
        })

        return all_point
    },

    show_walk_path: function(event){
        console.log('显示步行路线')

        let that = this
        let destination = this.data.destination

        wx.showLoading({
            title: '加载中',
            mask: true,
        })

        wx.getLocation({
            'type': 'gcj02',
            success: function(res) {
                myAmapFun.getWalkingRoute({
                    origin: res.longitude+','+res.latitude,
                    destination: destination.longitude + ',' + destination.latitude,
                    success: data=>{
                        console.log('获取步行路径', data)
                        
                        let points = that.get_points(data)

                        that.setData({
                            polyline: [{
                                points: points,
                                color: '#C71585AA',
                                width: 6
                            }],
                            longitude: destination.longitude,
                            latitude: destination.latitude,
                            scale: 18,
                        })

                        wx.hideLoading()
                    },
                    fail: err => {
                        wx.hideLoading()
                    }
                })
            },
        })
    },

    show_bike_path: function(event){
        console.log('显示骑行路线')

        let that = this
        let destination = this.data.destination

        wx.showLoading({
            title: '加载中',
            mask: true,
        })

        wx.getLocation({
            'type': 'gcj02',
            success: function (res) {
                myAmapFun.getRidingRoute({
                    origin: res.longitude + ',' + res.latitude,
                    destination: destination.longitude + ',' + destination.latitude,
                    success: data => {
                        console.log('获取骑行路径', data)

                        let points = that.get_points(data)

                        that.setData({
                            polyline: [{
                                points: points,
                                color: '#B8860BAA',
                                width: 6
                            }],
                            longitude: destination.longitude,
                            latitude: destination.latitude,
                            scale: 18,
                        })

                        wx.hideLoading()
                    },
                    fail: err=>{
                        wx.hideLoading()
                    }
                })
            },
        })
    },

    to_sign: function(id){
        console.log('点击气泡', id)

        wx.redirectTo({
            url: '../index/index',
        })
    },

    show_all_point: function(event){
        let that = this
        let destination = this.data.destination

        wx.getLocation({
            'type': 'gcj02',
            success: function(res) {
                that.data.mymap.includePoints({
                    points: [
                        { 
                            longitude: destination.longitude,
                            latitude: destination.latitude,
                        },
                        {
                            longitude: res.longitude,
                            latitude: res.latitude,
                        }
                    ],
                    padding: [120, 120, 120, 120]
                })
            },
        })
    }
})