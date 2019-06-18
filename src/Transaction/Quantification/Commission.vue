<template>
    <div class="Commission">
        <div class="content">
            <div class="header">
                <div class="close" @click="closeC()"></div>
                <div class="headerT">
                    <div class="headerL"></div>
                    <div class="headerN">委托</div>
                    <div class="headerL"></div>
                </div>
                <div class="contentT">
                    <div class="contentBox">
                        <div class="boxN">委托类型：</div>
                        <div class="boxT">量化</div>
                    </div>
                    <div class="contentBox">
                        <div class="boxN">委托对象：</div>
                        <div class="boxT">{{Msgentrust.nick}}</div>
                    </div>
                    <div class="contentBox">
                        <div class="boxN">委托周期：</div>
                        <div class="boxT">{{Msgentrust.entrustCycle}}天</div>
                    </div>
                    <div class="contentBox">
                        <div class="boxN">委托币种：</div>
                        <div class="boxT">{{Msgentrust.coinName}}</div>
                    </div>
                    <div class="contentBox">
                        <div class="boxN">最低起投：</div>
                        <div class="boxT">{{Msgentrust.minInvest | toFixedSix}} {{Msgentrust.coinName}}</div>
                    </div>
                </div>
                <div class="headerInput">
                    <van-field v-model="entrustNum" type="number" placeholder="输入您要委托的金额" @input="shouyi(entrustNum)">
                        <span slot="button">{{Msgentrust.coinName}}</span>
                    </van-field>
                    <div class="Nyuji">预计收益量 : <span class="num">{{shouyiNum}}</span></div>
                </div>
                <div class="headerBtn" @click="postData">提交</div>
            </div>
        </div>
    </div>
</template>

<script>
import { Field,Cell } from 'vant'
import Bus from '../../bus.js'
import { post,toast,get } from '../../axios/axios.js'
import '../../assets/stylus/default.styl'
export default {
    name: 'Commission',
    props: ['entrust'],
    components:{
        [Field .name]: Field,
    },
    data () {
        return {
            HeaderBtnA: 1,
            entrustNum: '',
            LZdata: JSON.parse(localStorage.getItem('LZdata')),
            Msgentrust: {},
            shouyiNum: 0
        }
    },
    mounted() {
        this.Msgentrust = this.entrust   
    },
    methods:{
        HeaderBtn(val) {
            this.HeaderBtnA = val
        },
        closeC() {
            Bus.$emit('Commission', false)
        },
        shouyi(money) {
            this.shouyiNum = (this.entrustNum * (this.Msgentrust.estimatedRevenue * (1 - this.Msgentrust.commissionRatio))).toFixed(6)
            this.entrustNum = (money.match(/^\d*(\.?\d{0,6})/g)[0]) || null
        },
        postData() { // 开始委托
            let that = this
            if (that.entrustNum < that.Msgentrust.minInvest) {
                toast(`最低起投 ${that.Msgentrust.minInvest}${that.Msgentrust.coinName}`)
                return false
            } else {
                let databody = {
                    "token": that.LZdata.token,
                    "entrustId": that.Msgentrust.id,
                    "entrustNum": that.entrustNum
                }
                post('/quantitativeTrade/user-entrust-log/add', databody).then(res => {
                    if (res.code === 400) {
                        toast(res.message)
                    } else {
                        toast('提交成功')
                        setTimeout(() => {
                            Bus.$emit('Commission', false)
                        }, 1000);
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Commission
    width 100%
    height 100%
    position fixed
    top 0
    left 0
    z-index 999
    background-color rgba(10, 10, 10, 0.35)
    overflow auto
    .content
        position absolute
        width 90%
        left 50%
        top 50%
        transform translate(-50%,-50%)
        box-shadow 6px 4px 40px #ccc
        border-radius 10px
        background-color #fff
        .header
            overflow hidden
            padding-bottom 20px
            .close
                background-image url('../../assets/img/cuowu.png')
                background-size 100% 100%
                background-repeat no-repeat
                width 18px
                height 18px 
                margin 20px 20px 0 auto
            .headerT
                display flex
                justify-content center
                align-items center
                margin-top 10px
                .headerL
                    width 60px
                    height 2px
                    border-top solid 1px rgba(51,51,51,1)
                    border-bottom solid 1px rgba(51,51,51,1)
                .headerN
                    font-size 18px
                    padding 0 5px
                    font-weight bold
            .contentT
                font-size 14px
                margin-top 30px
                .contentBox
                    display flex
                    align-items center
                    line-height 1
                    padding 8px 20px
                    .boxN
                        text-align right
                    .boxT
                        flex 1
                        text-align left
            .headerInput
                margin 30px 15px 0 15px
                >>> .van-field
                        border-bottom solid 1px #e4dfdf
                        .van-field__control
                            text-align left
                            margin auto
                            height 40px
                            font-size 14px
                .Nyuji
                    text-align right 
                    padding 20px 0
                    font-size 14px
            .headerBtn
                background linear-gradient(269deg,rgba(30,219,142,1),rgba(0,168,255,1))
                height 45px
                line-height 45px
                width 74%
                margin auto
                font-size 16px
                color #fff
                border-radius 44px
                margin-top 30px
</style>    
