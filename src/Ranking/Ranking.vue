<template>
    <div class="Ranking">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <div class="header">排行榜</div> 
            <div class="rankingList">
                <div class="two">
                    <div class="twoText" v-if="settleList[1]">
                        <div class="Timg"><img :src="settleList[1].avatar == null?Mavatar:settleList[1].avatar" alt=""></div>
                        <div class="Tname">{{settleList[1].nick}}</div>
                        <div class="Tnum">{{settleList[1].total | toFixedSix}}</div>
                    </div>
                    <div class="twoText" v-else>
                        <div class="Tname">暂无信息</div>
                    </div>
                </div>
                <div class="one">
                    <div class="twoText" v-if="settleList[0]">
                        <div class="Timg"><img :src="settleList[0].avatar == null?Mavatar:settleList[0].avatar" alt=""></div>
                        <div class="Tname">{{settleList[0].nick}}</div>
                        <div class="Tnum">{{settleList[0].total | toFixedSix}}</div>
                    </div>
                    <div class="twoText" v-else>
                        <div class="Tname">暂无信息</div>
                    </div>
                </div>
                <div class="three">
                    <div class="twoText" v-if="settleList[2]">
                        <div class="Timg"><img :src="settleList[2].avatar == null?Mavatar:settleList[2].avatar" alt=""></div>
                        <div class="Tname">{{settleList[2].nick}}</div>
                        <div class="Tnum">{{settleList[2].total | toFixedSix}}</div>
                    </div>
                    <div class="twoText" v-else>
                        <div class="Tname">暂无信息</div>
                    </div>
                </div>
            </div>
            <div class="contentList">
                <el-select v-model="value" placeholder="请选择" @change="currentSel" id="input1" class="input1">
                    <el-option v-for="item in Navlist" :label="item.coinName" :value="item.coinId"></el-option>
                </el-select>
                <van-list :finished="finished" v-if="settleList.length > 3">
                    <van-cell v-for="(item,index) in settleList.slice(3)" :key="index">
                        <div slot="title">
                            <div class="ListBox">
                                <div class="listD">{{index + 4}}</div>
                                <div class="listI"><img :src="item.avatar == null?Mavatar:item.avatar" alt=""></div>
                                <div class="listN">{{item.nick}}</div>
                                <div class="listM"><span class="num">{{item.total | toFixedSix}}</span></div>
                            </div>
                        </div>
                    </van-cell>
                </van-list>
                <div class="twoText" v-else>
                    <div class="tips Nodata"><span>暂无更多记录</span></div>
                </div>
            </div>
        </van-pull-refresh>
    </div>
</template>

<script>
import Vue from 'vue'
import {Select, Option } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Select)
Vue.use(Option)
import { Collapse, CollapseItem, List, Cell, PullRefresh  } from 'vant'
import { post,toast,get } from '../axios/axios.js'
import '../assets/stylus/default.styl'
export default {
    name: 'Ranking',
    props: {
        msg: String
    },
    components:{
        [Collapse.name]: Collapse,
        [CollapseItem.name]: CollapseItem,
        [List.name]: List,
        [PullRefresh.name]: PullRefresh,
        [Cell.name]: Cell
    },
    data () {
        return {
            isLoading: false,
            activeNames: '1',
            textName:'BTC',
            list: [],
            settleList: [],
            Mavatar: require('../assets/img/touxiang.png'),
            loading: false,
            finished: false,
            LZdata: JSON.parse(localStorage.getItem('LZdata')),
            Navlist:[],
            value: ''
        }
    },
    mounted() {   
        this.getcoinData() 
        var oInput = document.getElementById("input1")
        oInput.setAttribute('type','button')
    },
    methods:{
        onRefresh() { // 下拉刷新
            this.getcoinData() 
        },
        currentSel(val){
            this.getsettleData(val)
        },
        getcoinData() { // 获取排行榜币种列表
            let that = this
            let databody = {
                "token": that.LZdata.token
            }
            get('/quantitativeTrade/coin/list', databody).then(res => {
                that.Navlist = res.data
                that.value = that.Navlist[0].coinId
                that.getsettleData(that.value)
            }).catch(function (error) {
                console.log(error)
            })
        },
        getsettleData(coinId) { // 获取排行榜列表
            let that = this
            let databody = {
                "token": that.LZdata.token,
                "coinId": coinId
            }
            get('/quantitativeTrade/quantitative-settle/list', databody).then(res => {
                that.settleList = res.data
                that.isLoading = false
            }).catch(function (error) {
                console.log(error)
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.tips
    background-color #fff
.Ranking
    background #3f37d8
    background-image url('../assets/img/ranking.png')
    position absolute
    width 100%
    min-height 100%
    background-repeat no-repeat
    background-size 100%
    top 0
    left 0
    .header
        font-size 24px
        color #fff
        font-weight 400
        padding 100px 0 16px 0
    .rankingList
        display flex
        color #fff
        justify-content center
        align-items flex-end
        font-size 12px
        .one
            background-image url('../assets/img/one.png')
            background-size 100% 100%
            background-repeat no-repeat
            width 125px
            height 150px
            position relative
            .twoText
                position absolute
                width 100%
                left 0
                bottom 20px
                .Timg
                    img
                        width 44px
                        height 44px
                        border-radius 8px
                .Tname
                    padding 2px 0
        .two
            background-image url('../assets/img/two.png')
            background-size 100% 100%
            background-repeat no-repeat
            width 110px
            height 130px
            position relative
            .twoText
                position absolute
                width 100%
                left 0
                bottom 6px
                .Timg
                    img
                        width 39px
                        height 39px
                        border-radius 8px
                .Tname
                    padding 2px 0
        .three
            background-image url('../assets/img/three.png')
            background-size 100% 100%
            background-repeat no-repeat
            width 100px
            height 140px
            position relative
            .twoText
                position absolute
                width 100%
                left 0
                bottom 5px
                .Timg
                    img
                        width 34px
                        height 34px
                        border-radius 8px
                .Tname
                    padding 2px 0
    .contentList
        width 94%
        margin 0 auto 60px auto
        position relative
        margin-top 46px
        >>> .el-select
            width 100%
            background-color #fff
            box-shadow 0px 5px 10px #ccc
        >>>.el-input__inner
                border-radius 0
                text-align left
                &:focus
                    border-color #fff
        >>> .van-hairline--top-bottom
                position absolute
                width 100%
                top -44px
                left 0
                z-index 999
                box-shadow 0px 5px 10px #ccc
                .van-cell--clickable
                    border-radius 5px 5px 0px 0px
        >>> .van-cell__title
                text-align left
        >>> .van-list
                background-color #fff
                .van-cell:last-child
                     border-radius 0px 0px 5px 5px
        >>> .van-list__finished-text
                background-color #fff
        .ListBox
            display flex
            align-items center
            font-size 14px
            .listD
                width 30px
                text-align center
                padding-right 10px
            .listI
                width 40px
                height 40px
                img
                    border-radius 8px
                    width 100%
                    height 100%
                    display block
            .listN
                flex 1
                padding 0 10px
</style>
