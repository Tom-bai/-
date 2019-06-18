<template>
    <div class="Transaction" :class="Quantification?'hidden':''">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <div class="Header">
                <div class="HeaderName">
                    <div class="NameImg"><img :src="LZavatar == null || LZavatar == 'null'?Mavatar:LZavatar" alt=""></div>
                    <div class="NameText">
                        <div>{{LZnick == null || LZnick == 'null'?'暂无昵称':LZnick}}</div>
                        <div v-if="flagData == 0">实名认证审核中</div>
                        <div v-else-if="flagData == 1">实名认证审核通过</div>
                        <div v-else-if="flagData == 2">实名认证审核失败</div>
                        <div v-else-if="flagData == 3">未认证</div>
                    </div>
                </div>
                <div class="Totalbox">
                    <div class="Total">
                        <p class="Money">{{userWallet.total | toFixedSix}} {{userWallet.coinName}}</p>
                        <p class="Text">总资产</p>
                    </div>
                </div>
                <div class="Totalbox">
                    <div class="Total">
                        <p class="Money">{{userWallet.unBalance | toFixedSix}} {{userWallet.coinName}}</p>
                        <p class="Text">委托冻结</p>
                    </div>
                    <div class="Total">
                        <p class="Money">{{userWallet.income | toFixedSix}} {{userWallet.coinName}}</p>
                        <p class="Text">总收益量</p>
                    </div>
                </div>
            </div>
            <div class="Content">
                <div class="HeaderBtn">
                    <div class="BtnOne" :class="HeaderBtnA === 1?'active':''" @click="HeaderBtn(1)">量化</div>
                    <div class="BtnTwo" :class="HeaderBtnA === 2?'active':''" @click="HeaderBtn(2)">主观</div>
                </div>
                <!-- 量化 -->
                <div class="navZ" v-if="HeaderBtnA === 1">
                    <van-tabs v-model="activeC" @click="Navtext">
                        <van-tab v-for="(item,index) in Navlist" :title="item.coinName" :key="index">
                            <div class="Listcontent">
                                <div class="Listcontent" v-if="entrustLoglist == ''">
                                    <div class="tips Nodata"><span>暂无记录</span></div>
                                </div>
                                <div class="Listbox" v-else>
                                    <div class="listItem" v-for="(item,index) in entrustLoglist" :key="index"  @click="QuantificationC(item.id)">
                                        <div class="header">
                                            <div class="headerT">
                                                <div>{{item.nick}}</div>
                                            </div>
                                            <div class="headerJ" v-if="item.state === 0">募资进行中</div>
                                            <div class="headerN" v-if="item.state === 1">募资已结束</div>
                                            <div class="headerN" v-if="item.state === 2">暂未开放</div>
                                        <!--  <div class="headerN" @click="QuantificationC">暂未开放</div> -->
                                        </div>
                                        <div class="content">
                                            <div class="contentList">
                                                <div class="listI">
                                                    <div class="Inum">{{item.estimatedRevenue*100 | toFixedFour}}%</div>
                                                    <div>预计收益</div>
                                                </div>
                                                <div class="listI LRborder">
                                                    <div class="Inum">{{item.entrustCycle}}天</div>
                                                    <div>委托周期</div>
                                                </div>
                                                <div class="listI">
                                                    <div class="Inum">{{item.minInvest | toFixedSix}} {{item.coinName}}</div>
                                                    <div>最低起投</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="Listtime">
                                            <div class="time">
                                                剩余时间：<span>{{listdata[index].day}}天</span> <span>{{listdata[index].hou}}小时</span> <span>{{listdata[index].min}}分钟</span> <span>{{listdata[index].sec}}秒</span>
                                            </div>
                                            <div>已募金额：{{item.raiseNum | toFixedSix}} {{item.coinName}}</div>
                                            <!-- <div class="timeN">暂未开放 , 敬请期待</div> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </van-tab>
                    </van-tabs>
                    <div class="nomore" v-if="entrustLoglist.length > 10 && !flag">没有更多了</div>
                </div>
                <!-- 主观 -->
                <div class="navZ" v-if="HeaderBtnA === 2">
                    <van-tabs v-model="activeC" @click="Navtext">
                        <van-tab v-for="(item,index) in Navlist" :title="item.coinName" :key="index" >
                            <div class="Listcontent">
                                <div class="Listcontent" v-if="entrustLoglist == ''">
                                    <div class="tips Nodata"><span>暂无记录</span></div>
                                </div>
                                <div class="Listbox" v-else>
                                    <div class="listItem" v-for="(item,index) in entrustLoglist" :key="index"  @click="QuantificationC(item.id)">
                                        <div class="header">
                                            <div class="headerT">
                                                <div>{{item.nick}}</div>
                                            </div>
                                            <div class="headerJ" v-if="item.state === 0">募资进行中</div>
                                            <div class="headerN" v-if="item.state === 1">募资已结束</div>
                                            <div class="headerN" v-if="item.state === 2">暂未开放</div>
                                        <!--  <div class="headerN" @click="QuantificationC">暂未开放</div> -->
                                        </div>
                                        <div class="content">
                                            <div class="contentList">
                                                <div class="listI">
                                                    <div class="Inum">{{item.estimatedRevenue*100 | toFixedFour}}%</div>
                                                    <div>预计收益</div>
                                                </div>
                                                <div class="listI LRborder">
                                                    <div class="Inum">{{item.entrustCycle}}天</div>
                                                    <div>委托周期</div>
                                                </div>
                                                <div class="listI">
                                                    <div class="Inum">{{item.minInvest | toFixedSix}} {{item.coinName}}</div>
                                                    <div>最低起投</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="Listtime">
                                            <div class="time">
                                                剩余时间：<span>{{listdata[index].day}}天</span> <span>{{listdata[index].hou}}小时</span> <span>{{listdata[index].min}}分钟</span> <span>{{listdata[index].sec}}秒</span>
                                            </div>
                                            <div>已募金额：{{item.raiseNum | toFixedSix}} {{item.coinName}}</div>
                                            <!-- <div class="timeN">暂未开放 , 敬请期待</div> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </van-tab>
                    </van-tabs>
                    <div class="nomore" v-if="entrustLoglist.length > 0 && !flag">没有更多了</div>
                </div>
            </div>
        </van-pull-refresh>
        <!-- 内页 -->
        <transition name="Transition">
            <Quantification v-if="Quantification" :Msgid="Msgid"></Quantification>
        </transition>
    </div>
</template>

<script>
import { Tab,Tabs,PullRefresh  } from 'vant'
import Quantification from './Quantification/Quantification'
import { get, toast } from '../axios/axios.js'
import Bus from '../bus.js'
import '../assets/stylus/default.styl'
export default {
    name: 'Account',
    props: {
        msg: String
    },
    components:{
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        [PullRefresh.name]: PullRefresh,
        Quantification: Quantification,
    },
    data () {
        return {
            isLoading: false,
            flag: true,
            coinIdData: '',
            pageNum: 1,
            activeC: 0,
            Navlist:[],
            userWallet:{},
            userWalletList: [],
            entrustLoglist: [],
            Navmsg:'',
            HeaderBtnA: 1,
            Quantification: false,
            Subjective: false,
            Mavatar: require('../assets/img/touxiang.png'),
            LZavatar: '',
            LZnick: '',
            flagData: '',
            LZdata: JSON.parse(localStorage.getItem('LZdata')),
            MsgcoinId: '',
            Msgid:'',
            scrollTop:'',
            endTimelist: [],
            listdata: [],
            timeOut: null //定时器
        }
    },
    created() {
    },
    mounted() {
        this.LZavatar = this.$store.state.avatar  
        this.LZnick = this.$store.state.nick 
        this.flagData = this.$store.state.flag 
        Bus.$on('Quantification', (val) => {
            this.Quantification = val
            document.body.classList.remove('scrollFixed')
            document.scrollingElement.scrollTop = this.scrollTop
        }) 
        this.getcoinData()   
        if (this.$route.query.CoinId) {
            this.activeC = this.$route.query.activeC
        }
        if(this.endTimelist) {
            this.timeOut = setInterval(this.countDown, 1000)
        }
        window.addEventListener('scroll', this.handleScroll)
    },
    destroyed () {
        clearInterval(this.timeOut)
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
        onRefresh() { // 下拉刷新
            this.pageNum = 1
            this.getentrustData(this.coinIdData) 
        },
        handleScroll() {
            let that = this      
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
           	let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
           	let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            if (scrollTop + windowHeight == scrollHeight || scrollTop + windowHeight + 100 >= scrollHeight) {
                if (that.coinIdData) {
                    if (that.flag) {   
                        that.getentrustData(that.coinIdData)  
                    }
                }
             }
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
        Navtext(index,title) {
            this.Navmsg = title
            let coinId = this.Navlist.find(person => person.coinName === title)
            this.coinIdData = coinId.coinId
            this.entrustLoglist = []
            this.pageNum = 1
            this.flag = true
            this.getentrustData(this.coinIdData)
            this.getData(this.coinIdData)
        },
        HeaderBtn(val) {
            this.HeaderBtnA = val
            this.entrustLoglist = []
            this.pageNum = 1
            this.flag = true
            this.getentrustData(this.coinIdData)
        },
        QuantificationC(Msgid) { // 记住位置
            this.scrollTop = document.scrollingElement.scrollTop
            document.body.classList.add('scrollFixed')
            document.body.style.top = - this.scrollTop + 'px'
            this.Quantification = true
            this.Msgid = Msgid    
        },
        getData(coinId) { // 量化页获取账户信息
            let that = this
            let databody = {
                "token": that.LZdata.token,
                "coinId": coinId
            }
            get('/quantitativeTrade/user-wallet/info', databody).then(res => {
                that.userWallet = res.data
            }).catch(function (error) {
                console.log(error)
            })
        },
        getcoinData() { // 量化页获取币种列表
            let that = this
            let databody = {
                "token": that.LZdata.token
            }
            get('/quantitativeTrade/coin/list', databody).then(res => {
                that.Navlist = res.data
                if (that.$route.query.CoinId) {
                    that.coinIdData = that.$route.query.CoinId
                } else {
                    that.coinIdData = that.Navlist[0].coinId
                }
                that.getentrustData(that.coinIdData)
                that.getData(that.coinIdData)
            }).catch(function (error) {
                console.log(error)
            })
        },
        getentrustData(coinId) { // 量化页募资委托列表
            let that = this
            that.flag = false
            let databody = {
                "token": that.LZdata.token,
                "coinId": coinId,
                "type": that.HeaderBtnA,
                "pageSize": 10,
                "pageNum": that.pageNum
            }
            get('/quantitativeTrade/quantitative-entrust/list', databody).then(res => {
                if (that.pageNum == 1) { // 下拉刷新要清空
                    that.entrustLoglist = []
                }
                if (res.data.list.length <= 0) {
                    that.flag = false
                } else {
                    that.isLoading = false
                    that.flag = true
                    that.entrustLoglist = that.entrustLoglist.concat(res.data.list)
                    that.pageNum++ 
                    that.entrustLoglist.forEach(o => { // 储存时间
                        that.endTimelist.push(o.endTime)
                    })
                    that.countDown()
                }
            }).catch(function (error) {
                console.log(error)
            })
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Transaction
    background-color #fff
    .Header
        background-image url('../assets/img/Account_B.png')
        height 260px
        background-repeat no-repeat
        background-size 100% 100%
        .HeaderName
            display flex
            align-items center
            color #fff
            text-align left 
            padding 20px
            font-size 14px
            .NameImg
                img
                    width 50px
                    height  50px
                    border-radius 8px
            .NameText
                flex 1
                padding 0 10px
        .Totalbox
            display flex
            justify-content center
            padding-top 10px
            .Total
                flex 1
                p
                    margin 0
                    color #fff
                .Money
                    font-size 18px
                    font-weight normal
                .Text
                    font-size 14px  
    .Content
        margin-top -20px
        .HeaderBtn
            background-color #f1f1f1
            display flex
            width 90%
            margin auto
            justify-content center
            border-radius 15px
            font-size 14px
            font-weight normal
            .BtnOne
                flex 1
                height 40px
                line-height 40px
                border-top-left-radius: 15px;
                border-bottom-left-radius: 15px;
            .BtnTwo   
                flex 1
                height 40px
                line-height 40px
                border-top-right-radius: 15px;
                border-bottom-right-radius: 15px;
            .active
                background linear-gradient(269deg,rgba(30,219,142,1),rgba(0,168,255,1))
                color #fff
                position relative
                &:after
                    content:"";
                    position absolute
                    width 0
                    height 0
                    border-left 10px solid transparent
                    border-right 10px solid transparent
                    border-top 8px solid rgb(17, 198, 190)
                    bottom: -8px;
                    left: 50%;
                    transform: translate(-50%,0);
                    z-index 999
        .navZ
            margin-top 20px
            margin-bottom 60px
            >>> .van-tabs__line
                display none
            >>> .van-tabs--line .van-tabs__wrap
                height auto
            >>> .van-tabs__nav
                background-color transparent
            >>> .van-hairline--top-bottom::after
                border none
            >>> .van-tab
                background #f1f1f1
                line-height 1
                margin 0 10px
                border-radius 20px
                padding: 11px 0
                flex-basis 22%
                flex 0 0 22%
            >>> .van-tabs__line
                position relative
            >>> .van-tab--active
                background linear-gradient(269deg,rgba(30,219,142,1),rgba(0,168,255,1))
                color #fff
                border-radius 20px
            .Listcontent
                .Listcontent
                    .tips
                        color #999
                        font-size 12px
                        margin-bottom 25px
                .Listbox
                    border-radius 8px
                    margin 10px 10px 0 10px
                    .listItem
                        box-shadow 3px 2px 13px #ccc 
                        margin-bottom 15px
                        border-radius 8px
                        .header
                            background-color #12165E
                            border-top-left-radius 8px
                            border-top-right-radius 8px
                            color #fff
                            display flex
                            align-items center
                            height 60px
                            line-height 60px
                            font-size 14px
                            .headerT
                                flex 1
                                text-align left 
                                display flex
                                align-items center
                                padding 0px 15px
                            .headerJ
                                padding 13.5px 0
                                display inline-block
                                width 80px
                                line-height 1
                                border-radius 20px 0 0 20px
                                background-color #0CCB69
                                text-align center
                                padding-left 16px
                            .headerN
                                padding 13.5px 0
                                display inline-block
                                width 80px
                                line-height 1
                                border-radius 20px 0 0 20px
                                background-color #A0A0A0
                                text-align center
                                padding-left 16px
                        .content
                            font-size 14px
                            padding 0px 15px
                            font-size 14px
                            .contentList
                                width 100%
                                border-bottom dashed 1px #999
                                display flex
                                line-height 1
                                font-size 14px
                                .listI
                                    flex 1
                                    padding 5px 0
                                    margin 15px 0
                                    .Inum
                                        padding 6px 0
                                .LRborder
                                    border-left dashed 1px #999
                                    border-right dashed 1px #999
                        .Listtime
                            text-align left 
                            font-size 14px
                            padding 15px
                            .time
                                padding-bottom 5px
                            .timeN
                                padding 12px
                                text-align center

</style>
