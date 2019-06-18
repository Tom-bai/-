<template>
    <div class="Account" :class="rechargeShow || QuantificationShow?'hidden':''">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <div class="Header">
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
                    <div class="BtnOne" :class="HeaderBtnA === 1?'active':''" @click="HeaderBtn(1)">资产</div>
                    <div class="BtnTwo" :class="HeaderBtnA === 2?'active':''" @click="HeaderBtn(2)">委托</div>
                </div>
                <div class="navZ" v-if="HeaderBtnA === 1">
                    <van-tabs v-model="activeC" @click="Navtext">
                        <van-tab v-for="(item,index) in Navlist" :title="item.coinName" :key="index">
                            <div class="Listcontent">
                                <div class="Listbox">
                                    <div class="header">
                                        <div class="headerT">
                                            <div class="iocB"><img :src="userWalletList.logo == null?mtou:userWalletList.logo" alt=""></div>
                                            <div>可用资产 : <span class="num">{{userWalletList.balance || 0 | toFixedSix}}</span> {{userWalletList.coinName}}</div>
                                        </div>
                                        <div class="headerJ" @click="recharge()">充提</div>
                                    </div>
                                    <div class="content" v-if="userWalletLogList.length > 0">
                                        <div class="contentList" v-for="(item,index) in userWalletLogList" :key="index">
                                            <div class="ListOne">
                                                <div class="contentT">{{item.memo}}</div>
                                                <div class="contentJ"><span class="num">{{item.balance | toFixedSix}} {{item.coinName}}</span></div>
                                            </div>
                                            <div class="ListTwo">{{item.date}}</div>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="tips Nodata"><span>暂无充提记录</span></div>
                                    </div>
                                </div>
                            </div>
                        </van-tab>
                    </van-tabs>
                    <div class="nomore" v-if="userWalletLogList.length > 0 && !flagO">没有更多了</div>
                </div>
                <div class="NavW" v-if="HeaderBtnA === 2">
                    <van-tabs v-model="activeC" @click="Navtext">
                        <van-tab v-for="(item,index) in Navlist" :title="item.coinName" :key="index">
                            <div class="ListcontentList" v-if="entrustLoglist.length > 0">
                                <div class="Listbox" v-for="(item,index) in entrustLoglist" :key="index"  @click="QuantificationC(item.entrustId)">
                                    <div class="header">
                                        <div class="headerT">{{item.nick}}</div>
                                        <div class="headerJ">>></div>
                                    </div>
                                    <div class="content">
                                        <div class="contentT">委托金额 : <span class="num">{{item.entrustNum | toFixedSix}}</span></div>
                                        <div class="contentJ">收益量 :  <span class="num">{{item.estimatedRevenue | toFixedSix}}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div class="Listcontent" v-else>
                                <div class="tips Nodata"><span>您还没有委托历史</span></div>
                                <div class="Go" @click="weituo(item.coinId)">前往委托</div>
                            </div>
                        </van-tab>
                    </van-tabs>
                    <div class="nomore" v-if="entrustLoglist.length > 0 && !flagT">没有更多了</div>
                </div>
            </div>
        </van-pull-refresh>
        <transition name="Transition">
            <Recharge v-if="rechargeShow" :coinIdData="coinIdData" :coinNameData="coinNameData"></Recharge>
        </transition>
        <transition name="Transition">
            <Quantification v-if="QuantificationShow" :Msgid="Msgid"></Quantification>
        </transition>
    </div>
</template>

<script>
import { Tab,Tabs,PullRefresh } from 'vant'
import Recharge from './Recharge/Recharge'
import Quantification from './Quantification/Quantification'
import { post,toast,get } from '../axios/axios.js'
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
        Recharge: Recharge,
        Quantification: Quantification
    },
    data () {
        return {
            isLoading: false,
            show: true,
            flagO: true,
            flagT: true,
            activeC: 0,
            pageNum: 1,
            Navlist:[],
            userWallet:{},
            userWalletList: [],
            entrustLoglist: [],
            userWalletLogList:[],
            Navmsg:'',
            coinIdData: '',
            coinNameData: '',
            MsgcoinId: '',
            Msgid: '',
            HeaderBtnA: 1,
            rechargeShow: false,
            QuantificationShow: false,
            mtou: require('../assets/img/touxiang.png'),
            LZdata: JSON.parse(localStorage.getItem('LZdata'))
        }
    },
    mounted() {
        Bus.$on('rechargeShow', (val) => {
            document.body.classList.remove('scrollFixed')
            document.scrollingElement.scrollTop = this.scrollTop
            this.rechargeShow = val
        })
        Bus.$on('QuantificationShow', (val) => {
            document.body.classList.remove('scrollFixed')
            document.scrollingElement.scrollTop = this.scrollTop
            this.QuantificationShow = val
        })
        this.getcoinData() 
        window.addEventListener('scroll', this.handleScroll)
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll)
    },
    methods:{
        onRefresh() { // 下拉刷新
            let that = this
            this.pageNum = 1
            if (that.HeaderBtnA == 1) {
                that.getwalletData(that.coinIdData) 
            } else if (that.HeaderBtnA == 2) {
                that.getentrustData(that.coinIdData)
            }
        },
        handleScroll() {
            let that = this      
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
            let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
            if (scrollTop + windowHeight == scrollHeight  || scrollTop + windowHeight + 100 >= scrollHeight) { 
                if (that.coinIdData) {
                    if (that.HeaderBtnA == 1) {
                        if (that.flagO) {
                            that.getwalletData(that.coinIdData) 
                        }
                    } else if (that.HeaderBtnA == 2) {
                        if (that.flagT) {
                            that.getentrustData(that.coinIdData)
                        }
                    }
                }
            }
        },
        weituo (coinId) {
            this.$router.push({ path: '/Transaction',query: {CoinId: coinId, activeC: this.activeC}})
        },
        QuantificationC(Msgid) { 
            this.scrollTop = document.scrollingElement.scrollTop
            document.body.classList.add('scrollFixed')
            document.body.style.top = - this.scrollTop + 'px'
            this.QuantificationShow = true
            this.Msgid = Msgid    
        },
        Navtext(index,title) {
            this.Navmsg = title
            let coinId = this.Navlist.find(person => person.coinName === title)
            this.coinIdData = coinId.coinId
            this.coinNameData = coinId.coinName
            this.userWalletLogList = []
            this.entrustLoglist = []
            this.pageNum = 1
            this.flagO = true
            this.flagT = true
            this.getwalletData(this.coinIdData)
            this.getData(this.coinIdData)
            this.getentrustData(this.coinIdData)
        },
        HeaderBtn(val) {
            this.HeaderBtnA = val
            this.pageNum = 1
            this.flagO = true
            this.flagT = true
            this.getwalletData(this.coinIdData)
        },
        recharge() { // 充提
            this.scrollTop = document.scrollingElement.scrollTop
            document.body.classList.add('scrollFixed')
            document.body.style.top = - this.scrollTop + 'px'
            this.rechargeShow = true
        },
        getData(coinId) { // 获取账户信息
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
        getcoinData() { // 获取币种列表
            let that = this
            let databody = {
                "token": that.LZdata.token
            }
            get('/quantitativeTrade/coin/list', databody).then(res => {
                that.Navlist = res.data
                that.coinIdData = that.Navlist[0].coinId
                that.coinNameData = that.Navlist[0].coinName
                that.getwalletData(that.coinIdData)
                that.getentrustData(that.coinIdData)
                that.getData(that.coinIdData)
            }).catch(function (error) {
                console.log(error)
            })
        },
        getwalletData(coinId) { // 币种ID获取用户资产和流水
            let that = this
            that.flagO = false
            let databody = {
                "token": that.LZdata.token,
                "coinId": coinId,
                "pageSize": 10,
                "pageNum": that.pageNum
            }
            get('/quantitativeTrade/user-wallet/userWalletInfo', databody).then(res => {
                that.userWalletList = res.data
                if (that.pageNum == 1) { // 下拉刷新要清空
                    that.userWalletLogList = []
                }
                if (res.data.userWalletLogList.length <= 0) {
                    that.flagO = false
                } else {
                    that.isLoading = false
                    that.flagO = true
                    that.userWalletLogList = that.userWalletLogList.concat(res.data.userWalletLogList)
                    that.pageNum++ 
                }
            }).catch(function (error) {
                console.log(error)
            })
        },
        getentrustData(coinId) { // 用户委托列表
            let that = this
            that.flagT = false
            let databody = {
                "token": that.LZdata.token,
                "coinId": coinId,
                "pageSize": 10,
                "pageNum": that.pageNum
            }
            get('/quantitativeTrade/user-entrust-log/list', databody).then(res => {
                if (that.pageNum == 1) { // 下拉刷新要清空
                    that.entrustLoglist = []
                }
                if (res.data.list.length <= 0) {
                    that.flagT = false
                } else {
                    that.isLoading = false
                    that.flagT = true
                    that.entrustLoglist = that.entrustLoglist.concat(res.data.list)
                    that.pageNum++
                }     
            }).catch(function (error) {
                console.log(error)
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Account
    background-color #fff
    .Header
        background-image url('../assets/img/Account_B.png')
        height 260px
        background-repeat no-repeat
        background-size 100% 100%
        .Totalbox
            display flex
            justify-content center
            padding-top 50px
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
            line-height 1
            .BtnOne
                flex 1
                padding 13.5px 0
                border-top-left-radius 15px
                border-bottom-left-radius 15px
            .BtnTwo   
                flex 1
                padding 13.5px 0
                border-top-right-radius 15px
                border-bottom-right-radius 15px
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
        .NavW
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
                .tips
                    color #999
                    font-size 12px
                .Go
                    background linear-gradient(269deg,rgba(30,219,142,1),rgba(0,168,255,1))
                    height 40px
                    line-height 40px
                    border-radius 20px
                    width 150px
                    color #fff
                    margin 0 auto
                    font-size 14px
            .ListcontentList
                .Listbox
                    box-shadow 3px 2px 13px #ccc 
                    border-radius 8px
                    margin 10px 10px 0 10px
                    .header
                        background-color #292D6E
                        border-top-left-radius 8px
                        border-top-right-radius 8px
                        color #fff
                        display flex
                        align-items center
                        padding 0px 15px
                        height 50px
                        line-height 50px
                        font-size 14px
                        .headerT
                            flex 1
                            text-align left 
                    .content
                        font-size 14px
                        display flex
                        align-items center
                        padding 0px 15px
                        height 50px
                        font-size 14px
                        text-align left 
                        .contentT
                            flex 1
                        .contentJ
                            flex 1
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
                .Listbox
                    box-shadow 3px 2px 13px #ccc 
                    border-radius 8px
                    margin 10px 10px 0 10px
                    .header
                        background-color #12165E
                        border-top-left-radius 8px
                        border-top-right-radius 8px
                        color #fff
                        display flex
                        align-items center
                        padding 0px 15px
                        height 60px
                        line-height 60px
                        font-size 14px
                        .headerT
                            flex 1
                            text-align left 
                            display flex
                            align-items center
                            .iocB
                                // background-image url('../assets/img/login.png')
                                width 30px
                                height 30px
                                margin-right 10px
                                img 
                                    width 100%
                                    display block
                                    margin auto
                        .headerJ
                            border solid 1px
                            display inline-block
                            width 70px
                            height 25px
                            line-height 25px
                            border-radius 13px
                            font-size 12px
                    .content
                        font-size 14px
                        padding 0px 15px
                        font-size 14px
                        .contentList
                            width 100%
                            border-bottom: solid 1px #f1f1f1
                            &:last-child
                                border-bottom: none
                            .ListOne
                                display flex
                                padding-top 10px
                                .contentT
                                    flex 1
                                    text-align left 
                            .ListTwo
                                padding 10px 0
                                text-align right 

</style>
