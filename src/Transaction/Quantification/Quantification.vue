<template>
    <div class="Quantification" >
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <div class="content">
                <div class="back" @click="back()"></div>
                <div class="contentBox">
                    <div class="contentH">
                        <div class="name">{{entrust.nick}}</div>
                        <div class="tips" v-if="entrust.state === 0">募资进行中</div>
                        <div class="tipN" v-if="entrust.state === 1">募资已结束</div>
                        <div class="tipN" v-if="entrust.state === 2">暂未开放</div>
                    </div>
                    <div class="contentT">
                        <div v-if="entrust.state == 0">
                            <div class="time" v-if="listdata.length > 0">
                                剩余时间：<span>{{listdata[0].day}}天</span> <span>{{listdata[0].hou}}小时</span> <span>{{listdata[0].min}}分钟</span> <span>{{listdata[0].sec}}秒</span>
                            </div>
                            <div>已募金额：{{entrust.raiseNum | toFixedSix}} {{entrust.coinName}}</div>
                        </div>
                    </div>
                    <div class="contentL">
                        <div class="listI">
                            <div class="Inum">{{entrust.estimatedRevenue*100 | toFixedFour}}%</div>
                            <div>预计收益</div>
                        </div>
                        <div class="listI LRborder">
                            <div class="Inum">{{entrust.entrustCycle}}天</div>
                            <div>委托周期</div>
                        </div>
                        <div class="listI">
                            <div class="Inum">{{entrust.minInvest | toFixedSix}} {{entrust.coinName}}</div>
                            <div>最低起投</div>
                        </div>
                    </div>
                </div>
                <!-- 选项卡 -->
                <div class="contentBoxTwo">
                    <div class="HeaderBtn">
                        <div class="BtnOne" :class="HeaderBtnA === 1?'active':''" @click="HeaderBtn(1)">基本信息</div>
                        <div class="BtnTwo" :class="HeaderBtnA === 2?'active':''" @click="HeaderBtn(2)">策略信息</div>
                    </div>
                    <div class="navZ" v-if="HeaderBtnA === 1">
                        <div class="list">
                            <div class="listItem">
                                <div class="itemName">委托周期</div>
                                <div><span class="num">{{entrust.entrustCycle}}天</span></div>
                            </div>
                            <div class="listItem">
                                <div class="itemName">委托金额</div>
                                <div><span class="num">{{entrust.minInvest | toFixedSix}} {{entrust.coinName}}</span></div>
                            </div>
                            <div class="listItem">
                                <div class="itemName">佣金收取</div>
                                <div><span class="num">{{entrust.commissionRatio*100 | toFixedFour}}%</span></div>
                            </div>
                            <div class="listItem">
                                <div class="itemName">最大回撤</div>
                                <div><span class="num">{{entrust.maxRetreat | toFixedFour}}%</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="navW" v-if="HeaderBtnA === 2">
                        <div class="list">
                            <div class="headerItem">
                                <div class="headerBox">
                                    <div class="textN">
                                        <div class="textNname">日期</div>
                                        <div class="textNname">最小资金量</div>
                                        <div class="textNname">最大资金量</div>
                                        <div class="textNname">月收益率</div>
                                        <div class="textNname">平均资金使用率</div>
                                        <div class="textNname">最大回撤率</div>
                                    </div>
                                    <div class="textTbox" v-if="strategyInfoList.length !== 0">
                                        <div class="textT" v-for="(item,index) in strategyInfoList" :key="index">
                                            <div class="textTname">{{item.strategyDate}}</div>
                                            <div class="textTname"><span class="num">{{item.minFinancingVol | toFixedSix}}{{entrust.coinName}}</span></div>
                                            <div class="textTname"><span class="num">{{item.maxFinancingVol | toFixedSix}}{{entrust.coinName}}</span></div>
                                            <div class="textTname"><span class="num">{{item.monthlyIncomeRatio | toFixedFour}}{{entrust.coinName}}</span></div>
                                            <div class="textTname"><span class="num">{{item.avgFinancingUsingRatio | toFixedFour}}{{entrust.coinName}}</span></div>
                                            <div class="textTname"><span class="num">{{item.maxRetreatRatio | toFixedFour}}{{entrust.coinName}}</span></div>
                                        </div>
                                    </div>
                                    <div class="noM" v-else>
                                        <div class="tips Nodata"><span>暂无记录</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="contentThree">
                    <div class="ThreeBox">
                        <div class="headerT">
                            <div class="headerL"></div>
                            <div class="headerN">历史研报</div>
                            <div class="headerL"></div>
                        </div>
                        <div class="Boxtext">
                            <div class="Ttime">
                                <div class="timeN">历史实盘数据</div>
                                <div class="timeT" v-if="entrust.historyReport == null">暂无记录</div>
                                <div v-else>{{entrust.startTime}}</div>
                            </div>
                            <div class="Tlook" @click="historyReportC">
                                <div>查看</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="contentFour">
                    <div class="ThreeBox">
                        <div class="headerT">
                            <div class="headerL"></div>
                            <div class="headerN">委托历史</div>
                            <div class="headerL"></div>
                        </div>
                        <div class="tips">（只显示最近3条）</div>
                        <div class="Boxtext" v-if="entrustList.length !== 0">
                            <div class="textItem" v-for="(item,index) in entrustList" :key="index">
                                <div class="itemName">
                                    <div class="nameN">{{item.nick}}</div>
                                    <div><span class="num">{{item.entrustCount | toFixedSix}} {{entrust.coinName}}</span></div>
                                </div>
                                <div class="itemTime">{{item.entrustTime}}</div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="tips Nodata"><span>暂无记录</span></div>
                        </div>
                    </div>
                </div>
                <div class="contentFiver">
                    <div class="FivereBox">
                        <div class="headerT">
                            <div class="headerL"></div>
                            <div class="headerN">信息介绍</div>
                            <div class="headerL"></div>
                        </div>
                        <div class="contenText">
                            <div class="textT">
                                {{entrust.introduce}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </van-pull-refresh>
        <transition name="Transition">
            <Commission v-if="Commission" :entrust="entrust"></Commission>
        </transition>
        <transition name="Transition">
            <HistoryReport v-if="HistoryReport" :HistoryReportImg="entrust.historyReport"></HistoryReport>
        </transition>
        <div class="BTN" @click="CommissionC" v-if="entrust.state === 0">开始委托</div>
        <div class="BTN_Y" v-if="entrust.state === 1">募资已结束</div>
        <div class="BTN_Y" v-if="entrust.state === 2">敬请期待</div>
    </div>
</template>

<script>
import { Field,Cell,PullRefresh } from 'vant'
import Commission from './Commission'
import HistoryReport from './HistoryReport'
import { post,toast,get,remainingTime } from '../../axios/axios.js'
import Bus from '../../bus.js'
import '../../assets/stylus/default.styl'
export default {
    name: 'Quantification',
    props: ['Msgid'],
    components:{
        [Field .name]: Field,
        [Cell.name]: Cell,
        [PullRefresh.name]: PullRefresh,
        Commission: Commission,
        HistoryReport: HistoryReport
    },
    data () {
        return {
            isLoading: false,
            flagData: '',
            HeaderBtnA: 1,
            endTimelist: [], //剩余天
            entrust:[], // 委托信息
            entrustList: [], //委托历史
            strategyInfoList: [], // 策略信息
            Commission: false,
            HistoryReport: false,
            LZdata: JSON.parse(localStorage.getItem('LZdata')),
            listdata: [],
            timeOut: null //定时器
        }
    },
    mounted() {
        this.flagData = this.$store.state.flag
        Bus.$on('Commission', (val) => {
            this.Commission = val
        })
        Bus.$on('HistoryReport', (val) => {
            this.HistoryReport = val
        })
        this.getData(this.Msgid)
        if(this.endTimelist) {
            this.timeOut = setInterval(this.countDown, 1000)
        }
    },
    destroyed () {
        clearInterval(this.timeOut)
    },
    methods:{
        onRefresh() { // 下拉刷新
            this.getData(this.Msgid)
        },
        countDown(it) { //倒计时函数
            // 获取当前时间，同时得到活动结束时间数组  
            let that = this
            let newTime = Date.now(); 
            let endTimeList = that.endTimelist 
            let countDownArr = [];
            // 对结束时间进行处理渲染到页面
            endTimeList.forEach(o => {
                let endTime = new Date(o.replace(/-/g,'/')).getTime();
                let obj = null;
                // 如果活动未结束，对时间进行处理
                if (endTime - newTime > 0) {
                    let time = (endTime - newTime) / 1000;
                    // 获取天、时、分、秒
                    let day = parseInt(time / (60 * 60 * 24));
                    let hou = parseInt(time % (60 * 60 * 24) / 3600);
                    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
                    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
                    obj = {
                        day: that.timeFormat(day),
                        hou: that.timeFormat(hou),
                        min: that.timeFormat(min),
                        sec: that.timeFormat(sec)
                    }
                } else { //活动已结束，全部设置为'00'
                    obj = {
                        day: '00',
                        hou: '00',
                        min: '00',
                        sec: '00'
                    }
                }
                countDownArr.push(obj)
                that.listdata = countDownArr
            })
        },
        timeFormat(param) { //小于10的格式化函数
            return param < 10 ? '0' + param : param;
        },
        HeaderBtn(val) {
            this.HeaderBtnA = val
        },
        CommissionC() {
            if (this.flagData !== 1) {
                toast('实名未认证！')
            } else {
                this.Commission = true
            }
        },
        back() {
            Bus.$emit('Quantification', false)
        },
        historyReportC() { // 
            if (this.entrust.historyReport == null) {
                toast('暂无历史记录')
            } else {
                this.HistoryReport = true
            }
        },
        getData(id) { // 获取量化内页委托信息
            let that = this
            let databody = {
                "token": that.LZdata.token,
                "id": id
            }
            get('/quantitativeTrade/quantitative-entrust/info', databody).then(res => {
                that.entrust = res.data.entrust
                that.entrustList = res.data.entrustList
                that.strategyInfoList = res.data.strategyInfoList
                that.endTimelist.push(that.entrust.endTime) // 储存时间
                that.countDown()
                that.isLoading = false
            }).catch(function (error) {
                console.log(error)
            })
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Quantification
    width 100%
    height 100%
    position fixed
    top 0
    left 0
    z-index 999
    background-color #fff
    overflow auto
    .BTN
        position fixed
        width 100%
        height 50px
        line-height 50px
        left 0
        bottom 0
        background linear-gradient(269deg,rgba(30,219,142,1),rgba(0,168,255,1))
        font-size 14px
        color #fff
    .BTN_Y
        position fixed
        width 100%
        height 50px
        line-height 50px
        left 0
        bottom 0
        background #A0A0A0
        font-size 14px
        color #fff
    .content
        padding-bottom 80px
        background-image url('../../assets/img/lianghua.png')
        background-repeat no-repeat
        background-size 100% 350px
        padding-top 26px
        .back
            background-image url('../../assets/img/youjiantou.png')
            background-repeat no-repeat
            width 25px
            height 25px
            background-size 100% 100%
            transform rotate(180deg)
            margin-left 20px
        .contentBox
            padding-top 10px
            .contentH
                display flex
                align-items center
                color #ffffff
                font-size 14px
                .name
                    font-size 18px
                    flex 1
                    text-align left 
                    align-items center
                    padding 0 20px 
                .tips
                    display inline-block
                    width 80px
                    height 40px
                    line-height 40px
                    border-radius 20px 0 0 20px
                    background-color #0CCB69
                    text-align center
                    padding-left 16px
                .tipN
                    display inline-block
                    width 80px
                    height 40px
                    line-height 40px
                    border-radius 20px 0 0 20px
                    background-color #A0A0A0
                    text-align center
                    padding-left 16px
            .contentT
                font-size 12px
                color #ffffff
                text-align left 
                padding 15px 20px
                line-height 1
                .time
                    padding-bottom 8px
            .contentL
                width 90%
                display flex
                line-height 1
                font-size 14px
                color #000
                background-color #fff
                margin auto
                box-shadow 3px 2px 13px #ccc 
                .listI
                    flex 1
                    padding 5px 0
                    margin 15px 0
                    .Inum
                        padding 6px 0
                .LRborder
                    border-left dashed 1px #999
                    border-right dashed 1px #999
        .contentBoxTwo
            width 90%
            margin auto
            box-shadow 3px 2px 13px #ccc 
            margin-top 15px
            .HeaderBtn
                background-color #f1f1f1
                display flex
                justify-content center
                font-size 14px
                font-weight normal
                .BtnOne
                    flex 1
                    height 40px
                    line-height 40px
                .BtnTwo   
                    flex 1
                    height 40px
                    line-height 40px
                .active
                    background linear-gradient(269deg,rgba(30,219,142,1),rgba(0,168,255,1))
                    color #fff
                    position relative
            .navZ
                .list
                    background-color #fff
                    font-size 14px
                   .listItem
                        display flex 
                        border-bottom solid 1px #f1f1f1
                        padding 15px 0
                        margin 0 20px
                        &:last-child
                            border-bottom none
                        .itemName
                            flex 1
                            text-align left 
            .navW
                .list
                    font-size 14px
                    background-color #fff
                    .headerL
                        display flex
                        align-items center
                        padding 10px 0
                        margin 0 10px
                        border-bottom solid 1px #f1f1f1
                        .textH
                            flex 1
                    .headerItem
                        .headerBox
                            display flex
                            align-items center
                            padding 10px 0
                            margin 0 10px
                            border-bottom solid 1px #f1f1f1
                            overflow auto
                            .textN
                                flex 0 0 25%
                                .textNname
                                    height 40px
                                    display flex
                                    align-items center
                                    justify-content center
                            .textTbox
                                flex 1
                                display flex
                                .textT
                                    flex 0 0 33.3333%
                                    .textTname
                                        height 40px
                                        display flex
                                        align-items center
                                        justify-content flex-end
                            .noM
                                flex 1
                        .headerbox
                            display flex
                            align-items center
                            padding 10px 0
                            margin 0 10px
                            border-bottom solid 1px #f1f1f1
                            overflow auto
                            &:last-child
                                border-bottom none
                            .textN
                                flex 0 0 100px
                            .textT
                                flex 1
        .contentThree
            width 90%
            margin auto
            background #fff
            box-shadow 3px 2px 13px #ccc 
            .ThreeBox
                .headerT
                    display flex
                    justify-content center
                    align-items center
                    margin-top 10px
                    padding 20px 0 10px 0
                    .headerL
                        width 60px
                        height 1px
                        border-top solid 1px rgba(51,51,51,1)
                        border-bottom solid 1px rgba(51,51,51,1)
                    .headerN
                        font-size 16px
                        padding 0 5px
                        font-weight 400
                .Boxtext
                    display flex
                    align-items center
                    padding 0 20px 20px 20px
                    .Ttime
                        text-align left
                        flex 1
                        font-size 12px
                        color #666666
                        .timeN
                            font-size 14px
                            color #000
                            padding-bottom 5px
                    .Tlook
                        background-image url('../../assets/img/anniu.png')
                        background-repeat no-repeat
                        background-size 100%
                        width 60px
                        height 60px
                        line-height 60px
                        color #fff
        .contentFour
            width 90%
            margin auto
            background #fff
            box-shadow 3px 2px 13px #ccc 
            .ThreeBox
                .headerT
                    display flex
                    justify-content center
                    align-items center
                    margin-top 10px
                    padding 20px 0 10px 0
                    .headerL
                        width 60px
                        height 1px
                        border-top solid 1px rgba(51,51,51,1)
                        border-bottom solid 1px rgba(51,51,51,1)
                    .headerN
                        font-size 16px
                        padding 0 5px
                        font-weight 400
                .tips
                    font-size 12px
                    color #999
                    text-align center
                .Boxtext
                    padding 0 20px 0px 20px
                    .textItem
                        font-size 14px
                        border-bottom solid 1px #f1f1f1
                        padding 10px 0
                        &:last-child
                            border-bottom none
                        .itemName
                            display flex
                            align-items center
                            padding-bottom 10px
                            .nameN
                                flex 1
                                text-align left 
                        .itemTime
                            text-align right
        .contentFiver
            width 90%
            margin auto
            background #fff
            box-shadow 3px 2px 13px #ccc 
            .FivereBox
                .headerT
                    display flex
                    justify-content center
                    align-items center
                    margin-top 10px
                    padding 20px 0 10px 0
                    .headerL
                        width 60px
                        height 1px
                        border-top solid 1px rgba(51,51,51,1)
                        border-bottom solid 1px rgba(51,51,51,1)
                    .headerN
                        font-size 16px
                        padding 0 5px
                        font-weight 400
                .contenText
                    .textT
                        text-align left 
                        font-size 14px
                        padding 0 20px 20px 20px
</style>    
