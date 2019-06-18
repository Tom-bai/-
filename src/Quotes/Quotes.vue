<template>
    <div class="Quotes">
        <div class="header">行情</div>
        <div class="headerNav">
            <div class="navItem">币种</div>
            <div class="navItem">最新价 / 交易量</div>
            <div class="navItem">涨跌幅 / ≈CNY</div>
        </div>
        <div class="content">
            <div class="contentList" v-for="(item,index) in coinMarket" @click="quoteskC">
                <div class="listB">
                    <div class="Bimg"><img src="http://temp.im/40x40/000/fff" alt=""></div>
                    <div>{{item.marketKey}}</div>
                </div>
                <div class="listN">
                    <div class="Nnum">{{item.high}}</div>
                    <div>{{item.buy}}</div>
                </div>
                <div class="listK">
                    <div class="Knum colorR">{{item.sell}}</div>
                    <div>{{item.vol}}</div>
                </div>
            </div>
        </div>
        <!-- 线图 -->
        <transition name="Transition">
            <QuotesK v-if="QuotesK"></QuotesK>
        </transition>
    </div>
</template>

<script>
import { Tab,Tabs  } from 'vant'
import { post,toast,get } from '../axios/axios.js'
import QuotesK from './QuotesK/QuotesK'
import Bus from '../bus.js'
import '../assets/stylus/default.styl'
export default {
    name: 'Quotes',
    props: {
        msg: String
    },
    components:{
        [Tab.name]: Tab,
        [Tabs.name]: Tabs,
        QuotesK: QuotesK
    },
    data () {
        return {
            Navlist:['BCT', 'ECT', 'USDT', 'QT', 'BCT'],
            Navmsg:'',
            HeaderBtnA: 1,
            QuotesK: false,
            coinMarket: [],
            LZdata: JSON.parse(localStorage.getItem('LZdata'))
        }
    },
    mounted() {
        Bus.$on('QuotesK', (val) => {
            this.QuotesK = val
        })
        this.getData()
    },
    methods:{
        Navtext(index,title) {
            this.Navmsg = title
        },
        HeaderBtn(val) {
            this.HeaderBtnA = val
        },
        quoteskC() {
            this.QuotesK = true
        },
        getData() {
            let that = this
            let databody = {
                "token": that.LZdata.token
            }
            get('/quantitativeTrade/coin-market/list', databody).then(res => {
                console.log(res);
                that.coinMarket = res.data
            }).catch(function (error) {
                console.log(error)
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Quotes
    .header
        background-image url('../assets/img/hangqing.png')
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
    .headerNav
        display flex
        align-items center
        box-shadow 0px 5px 20px #e3e3e3
        height 50px
        justify-content center
        border-radius 10px 10px 0px 00px
        margin-top -10px
        background-color #fff
        .navItem
            flex 1
            font-size 14px
    .content
        padding 0 20px
        margin-top 10px
        margin-bottom 50px
        .contentList
            display flex
            align-items center
            border-bottom solid 1px #f1f1f1
            padding 15px 0
            &:last-child
                border-bottom none
            .listB
                display flex
                align-items center
                font-size 14px
                flex 1
                .Bimg
                    img
                        display block
                        border-radius 5px
                        margin-right 8px
            .listN
                font-size 14px
                flex 1
                text-align right 
                .Nnum
                    font-size 16px
                    margin-bottom 5px
            .listK
                font-size 14px
                flex 1
                text-align right 
                .Knum
                    font-size 16px
                    margin-bottom 5px
                .colorR
                    color #02BD9D
                .colorL
                    color #FF7052
</style>
