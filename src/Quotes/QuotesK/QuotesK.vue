<template>
    <div class="QuotesK">
        <div class="header">BTC</div>
        <div class="content">
            <div class="back" @click="back()"></div>
        </div>
        <div class="headerT">
            <div class="Tnew">
                <div class="newList">最新价：<span class="colorR">0.0013313</span></div>
                <div class="newList">涨跌幅：<span class="colorL">-28.46%</span></div>
                <div class="newList">≈9.08CNY</div>
            </div>
            <div class="Tnum">
                <div class="numList">24h成交量：0.0013313</div>
                <div class="numList">24h成交量：0.0013313</div>
                <div class="numList">24h成交量：0.0013313</div>
            </div>
        </div>
        <div class="echartsNav">
            <van-tabs v-model="active">
                <van-tab v-for="(item,index) in echartsNavlist" :title="item" :key="index">
                    <div class="echarts">
                        <IEcharts :option="bar" ref="echarts"></IEcharts>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
import { Tab,Tabs } from 'vant'
import IEcharts from 'vue-echarts-v3/src/full.js'
import Bus from '../../bus.js'
import '../../assets/stylus/default.styl'
export default {
    name: 'QuotesK',
    props: {
        msg: String
    },
    components:{
        [Tabs.name]: Tabs,
        [Tab.name]: Tab,
        IEcharts: IEcharts
    },
    data () {
        return {
            active: '1',
            echartsNavlist:['分时', '1分', '小时线', '日线', '周线', 'MAS', 'MA10', 'MA20'],
            bar: {
                    grid: {
                        // 布局
                        borderColor: 'rgba(255,255,255,0.5)'
                    },
                    xAxis: {
                        name: '',
                        nameTextStyle: {
                            color: '#999999'
                        },
                        type: 'category',
                        boundaryGap: false,
                        data: ['2018-1', '2018-2', '2018-3', '2018-4', '2018-5', '2018-6','2018-1', '2018-2', '2018-3', '2018-4', '2018-5', '2018-6','2018-1', '2018-2', '2018-3', '2018-4', '2018-5', '2018-6', ],
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#999999',
                                width: '2'
                            }
                        },
                        axisLabel: {
                            show: true
                        }
                    },
                    yAxis: {
                        name: '',
                        type: 'value',
                        padding: [5, 10, 5, 0],
                        nameTextStyle: {
                            color: '#fff'
                        },
                        // y轴网格线
                        splitLine: {
                            lineStyle: {
                                color: 'rgba(255,255,255,0.2)'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#999999',
                                width: '2'
                            }
                        }
                    },
                    series: [{
                        data: [10,20,30,40,5,100,150,120,170,110,190,120,200,230,240,300,100,10], // 数据值
                        type: 'line',
                        showSymbol: false, // 小圆点
                        hoverAnimation: true, // hover的时候的小圆点
                        lineStyle: {
                            color: '#6BB5F3',
                            width: 2
                        },
                        areaStyle: {
                            color: 'rgba(107, 181, 243, 0.3)'
                        },
                        itemStyle: { 
                            color: '#6BB5F3',
                            width: 2
                        }
                    }],
                    // 提示层
                    tooltip: {
                        trigger: 'axis',
                        padding: [5, 10, 5, 10],
                        backgroundColor:'#6BB5F3',
                        formatter: (data) => {
                            let _val = data[0]
                            return `<div class='tipHead'>${_val.value}</div>`
                        }
                    },
                    dataZoom: [
                        {
                            type: 'inside',
                            startValue: null,
                            endValue: null
                        }
                    ],
                    toolbox: {
                        // 工具箱
                    }
                }
        }
    },
    methods:{
        NavBtn(val) {
            this.NavBtnA = val
        },
        back() {
            Bus.$emit('QuotesK', false)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.colorR
    color #02BD9D
.colorL
    color #FF7052
.QuotesK
    width 100%
    height 100%
    position absolute
    top 0
    left 0
    z-index 999
    background-color #fff
    .header
        background-image url('../../assets/img/hangqing.png')
        height 80px
        background-repeat no-repeat
        background-size 100% 100%
        color #fff
        font-size 18px
        line-height 1
        padding-bottom 10px
        display flex
        align-items center
        justify-content center
    .content
        position absolute
        top 26px
        left 50%
        width 90%
        transform translate(-50%,0)
        .back
            background-image url('../../assets/img/youjiantou.png')
            background-repeat no-repeat
            width 25px
            height 25px
            background-size 100% 100%
            transform rotate(180deg)
    .headerT
        display flex
        align-items center
        font-size 14px
        box-shadow 0px 5px 20px #e3e3e3
        border-radius 10px 10px 0px 00px
        margin-top -10px
        background-color #fff
        padding 10px 20px
        .Tnew
            flex 1
            text-align left  
            .newList
                margin-bottom 5px 
        .Tnum
            flex 1
            text-align left 
            .numList
                margin-bottom 5px
    .echartsNav
        >>> .van-tabs__line
            background-color #292D6E
        >>> .van-tab
                &:nth-last-child(3)
                    color #007EFF
                &:nth-last-child(2)
                    color #11C15B
                &:nth-last-child(1)
                    color #FF7800
        .echarts
            height 300px
</style>
