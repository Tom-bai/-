<template>
    <div class="Recharge">
        <div class="header"></div>
        <div class="content">
            <div class="back" @click="back()"></div>
            <div class="assets">
                <div class="assetsK">可用资产 : {{userWalletDataT.balance | toFixedSix}} </div>
                <div class="assetsW">委托冻结 : {{userWalletDataT.unbalance | toFixedSix}} </div>
            </div>
            <div class="contentInput">
                <div class="nav">
                    <div class="BtnOne" :class="NavBtnA === 1?'active':''" @click="NavBtn(1)">充值</div>
                    <div class="BtnTwo" :class="NavBtnA === 2?'active':''" @click="NavBtn(2)">提现</div>
                </div>
                <div class="feeF" v-if="NavBtnA === 2">
                    <form>
                        <van-field
                            v-model="address"
                            clearable
                            placeholder="请输入提现地址"
                            class="input borderR"
                        />
                        <van-field
                            v-model="number"
                            @input="checkNumber(number)"
                            type="number"
                            placeholder="请输入提现额"
                            class="input borderR2"
                        >
                        </van-field>
                    </form>
                    <div class="inputT">
                        <div class="fee">手续费 : <span class="num">{{userWalletData.withdrawFee *100 | toFixedFour}}%</span> </div>
                        <div class="withdraw">可提现 : <span class="num">{{userWalletDataT.balance | toFixedSix}} </span>  </div>
                    </div>
                    <div class="withdrawBtn" @click="shotP">提现</div>
                    <div class="withdrawtip">
                        <div class="tipheader"><span>温馨提示</span></div>
                        <div class="tiptext">
                            <div>一、最小提币数量 <span class="num">{{userWalletData.withdrawMin | toFixedSix}}</span>。</div>
                            <div>二、请不要直接提到ICO的众筹地址，这会导致您无法收取众筹到的数字资产。</div>
                            <div>三、网络转账费用是不固定的，取决于转账时合约执行需要消耗的算力。</div>
                            <div>四、请务必确认电脑及浏览器安全，防止信息被篡改和泄露。</div>
                        </div>
                    </div>
                    <van-dialog v-model="show" show-cancel-button confirm-button-text="确认提现" :before-close="beforeClose">
                        <div class="showTixian">
                            <div>提现地址：{{address}}</div>
                            <div>提现数量：{{number}}</div>
                            <div>手续费：{{shouxufei(this.number) | toFixedSix}}</div>
                            <div>实际到账金额：<span class="num">{{shijidaozhang(this.number) | toFixedSix}}</span></div>
                        </div>
                    </van-dialog>
                </div>
                <div class="withdrawF" v-if="NavBtnA === 1">
                    <div class="QRcode">
                        <img :src="QRcode" alt="">
                    </div>
                    <div class="QRtext" id="QRtext">{{userWalletDataT.coinAddress || '暂无充值地址'}}</div>
                    <div class="QRtip">
                        <div class="tipheader"><span>温馨提示</span></div>
                        <div class="tiptext">
                            <div>一、请勿向上述地址充值任何非<span class="num">{{coinNameData}}</span>资产，否则资产将不可找回。</div>
                            <div>二、您充值至上述地址后，需要整个网络节点的确认，<span class="num">1</span>次网络确认后到账，<span class="num">6</span>次网络确认后可提币。</div>
                            <div>三、请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</div>
                        </div>
                    </div>
                    <div class="QRbtn">
                        <div class="btnX" @click="downs">保存二维码至相册</div>
                        <div class="btnC" ref="copy" data-clipboard-action="copy" data-clipboard-target="#QRtext" @click="copyLink">复制充值地址</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { Field, Cell, Toast, checkSix,Dialog} from 'vant'
Vue.use(Dialog)
import { post,toast,get } from '../../axios/axios.js'
import Bus from '../../bus.js'
import QRCode from 'qrcode'
import '../../assets/stylus/default.styl'
export default {
    name: 'Recharge',
    props: ['coinIdData','coinNameData'],
    components:{
        [Field .name]: Field,
        [Cell.name]: Cell,
        [Toast.name]: Toast
    },
    data () {
        return {
            show: false,
            NavBtnA: 1,
            address: '',
            number: '',
            QRcode: require('../../assets/img/touxiang.png'),
            userWalletData: [],
            userWalletDataT: [],
            copyBtn: null,
            LZdata: JSON.parse(localStorage.getItem('LZdata'))
        }
    },
    mounted() {
        this.copyBtn = new this.clipboard(this.$refs.copy)
        this.getData()   
    },
    methods:{
        shijidaozhang(val) {
            let shiji = val - (this.userWalletData.withdrawFee) * val
            return shiji
        },
        shouxufei(val) {
            let num = (this.userWalletData.withdrawFee) * val
            return num
        },
        beforeClose(action, done) {
            if (action === 'confirm') {
                this.getWithdraw()
                done()
            } else {
                done();
            }
        },
        checkNumber (val) {
            this.number= (val.match(/^\d*(\.?\d{0,6})/g)[0]) || null
        },
        downs() {
            //必须同源才能下载
            var alink = document.createElement("a");
            alink.href = this.QRcode;
            alink.download =  this.userWalletDataT.coinAddress
            alink.click();
        },
        NavBtn(val) {
            this.NavBtnA = val
        },
        back() {
            Bus.$emit('rechargeShow', false)
        },
        copyLink() {
            let that = this;
            let clipboard = that.copyBtn;
            clipboard.on('success', function() {
                Toast({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    position: 'bottom',
                    message: '复制成功！'
                });
                let second = 1
                const timer = setInterval(() => {
                    second--
                    if (!second) {
                        clearInterval(timer)
                        Toast.clear()
                    }
                }, 1000);
            });
            clipboard.on('error', function() {
                Toast({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '复制失败！'
                });
                let second = 1
                const timer = setInterval(() => {
                    second--
                    if (!second) {
                        clearInterval(timer)
                        Toast.clear()
                    }
                }, 1000);
            });
        },
        getData() {
            let that = this
            let databody = {
                "token": that.LZdata.token,
                "coinId": that.coinIdData
            }
            get('/quantitativeTrade/user-wallet/userWalletData', databody).then(res => {
                that.userWalletData = res.data
                that.userWalletDataT = res.data.userWallet
                if (that.userWalletDataT.coinAddress !== null){
                    QRCode.toDataURL('I am a pony!').then(url => {
                        that.QRcode = url
                    }).catch(err => {
                        console.error(err)
                    })
                }
            }).catch(function (error) {
                console.log(error)
            })
        },
        shotP() {
            if (this.address == '' && this.number == '') {
                toast('请填写地址和提现数量！')
            } else {
                this.show = true
            }
        },
        getWithdraw() {
            let that = this
            let databody = {
                "token": that.LZdata.token,
                "coinId": that.coinIdData,
                "address": that.address,
                "number": that.number
            }
            post('/quantitativeTrade/user-withdraw/add', databody).then(res => {
                if (res.code === 400) {
                    toast(res.message)
                } else {
                    toast('提交成功')
                    setTimeout(() => {
                        that.address = ''
                        that.number = ''
                        that.getData()
                        that.$parent.getwalletData(that.coinIdData)
                        that.$parent.getentrustData(that.coinIdData)
                        that.$parent.getData(that.coinIdData)
                    }, 1000);
                }
            }).catch(function (error) {
                console.log(error)
            })
        },
    },
    filters: {
        MoneytoFixed(num) {
            return num.toFixed(6)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Recharge
    width 100%
    height 100%
    position fixed
    top 0
    left 0
    z-index 999
    background-color #fff
    overflow auto
    .header
        background-image url('../../assets/img/recharge.png')
        background-repeat no-repeat
        background-size 100% 100%
        height 300px
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
        .assets
            display flex
            color #fff
            font-size 14px
            padding 20px 0 20px 0
            .assetsK
                flex 1
            .assetsW
                flex 1
        .contentInput
            box-shadow 3px 2px 13px #ccc 
            background-color #fff
            margin-bottom 30px
            .nav
                background-color rgba(246,246,246,1)
                display flex
                width 100%
                margin auto
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
            .feeF
                padding 20px 0
                >>>.van-field__body
                    height 30px
                .inputT
                    display flex
                    margin  0 15px
                    border-top solid 1px #f1f1f1
                    padding 15px 0
                    font-size 14px
                    .fee
                        flex 1
                        text-align left 
                    .withdraw
                        flex 1
                        text-align right 
                .withdrawBtn
                    background linear-gradient(269deg,rgba(30,219,142,1),rgba(0,168,255,1))
                    height 40px
                    color #fff
                    line-height 40px
                    font-size 14px
                    border-radius 44px
                    margin 30px 15px 0 15px
                .withdrawtip
                    font-size 12px
                    padding 10px 20px
                    margin-top 20px
                    >.tipheader
                        text-align left
                        span
                            font-size 14px
                            color #ffffff
                            background-color #00a8ff
                            padding 8px 20px
                            border-radius 20px 20px 20px 0
                    >.tiptext
                        text-align left 
                        padding 20px 0 0px 0
                        >div
                            padding-bottom 5px
                .showTixian
                    font-size 14px
                    text-align left
                    padding 15px
                    >div
                        border-bottom solid 1px #9194BB
                        padding 10px 0
            .withdrawF
                font-size 14px
                .QRcode
                    padding 20px 0 0px 0
                    img
                        width 140px
                        height 140px
                        display block
                        margin auto
                .QRtext
                    font-size 12px
                    padding 20px 0 20px 0
                .QRtip
                    font-size 12px
                    padding 10px 20px
                    >.tipheader
                        text-align left
                        span
                            font-size 14px
                            color #ffffff
                            background-color #00a8ff
                            padding 8px 20px
                            border-radius 20px 20px 20px 0
                    >.tiptext
                        text-align left 
                        padding 20px 0 0px 0
                        >div
                            padding-bottom 5px
                .QRbtn
                    display flex
                    background-color rgba(246,246,246,1)
                    color #000
                    font-size 14px
                    height 50px
                    line-height 50px
                    .btnX
                        flex 1
                        border-right solid 1px #fff
                    .btnC
                        flex 1
</style>
