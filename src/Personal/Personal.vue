<template>
    <div class="Personal">
        <div class="content">
            <div class="header">
                <div class="headerI" @click="PerfectShowC">
                    <img :src="LZavatar == null || LZavatar == 'null'?Mavatar:LZavatar" alt="">
                </div>
                <div class="headerN">{{LZnick == null || LZnick == 'null'?'暂无昵称':LZnick}}</div>
            </div>
            <div class="contentList">
                <div class="listBox" @click="myMessage">
                    <div class="iocX"></div>
                    <div class="listN">我的消息<van-tag round type="danger" v-if="Msgdata !== 0">{{Msgdata}}</van-tag></div>
                    <div class="iocJ"></div>
                </div>
                <div class="listBox" @click="myPosts">
                    <div class="iocTz"></div>
                    <div class="listN">我的帖子</div>
                    <div class="iocJ"></div>
                </div>
                <div class="listBox" @click="RealnameShowC">
                    <div class="iocS"></div>
                    <div class="listN">实名认证</div>
                    <div class="listS" v-if="flagData == 0">实名认证审核中</div>
                    <div class="listS" v-else-if="flagData == 1">实名认证通过</div>
                    <div class="listS" v-else-if="flagData == 2">实名认证失败</div>
                    <div class="listS" v-else-if="flagData == 3">未认证</div>
                    <div class="iocJ"></div>
                </div>
                <div class="listBox" @click="FeedbackShowC">
                    <div class="iocY"></div>
                    <div class="listN">意见反馈</div>
                    <div class="iocJ"></div>
                </div>
                <div class="listBox">
                    <div class="iocW"></div>
                    <div class="listN">客服微信</div>
                    <div class="listS">{{LZdata.customWechat}}</div>
                </div>
                <div class="listBox" @click="LoginC">
                    <div class="iocT"></div>
                    <div class="listN">退出登录</div>
                </div>
            </div>
        </div>
        <transition name="Transition">
            <Perfect :PerfectShow="PerfectShow" :LZavatar="LZavatar" :LZnick="LZnick" v-if="PerfectShow"></Perfect>
        </transition>
        <transition name="Transition">
            <Realname :RealnameShow="RealnameShow" v-if="RealnameShow"></Realname>
        </transition>
        <transition name="Transition">
            <Feedback :FeedbackShow="FeedbackShow" v-if="FeedbackShow"></Feedback>
        </transition>
    </div>
</template>

<script>
import { Dialog, Tag} from 'vant'
import Perfect from './Perfect/Perfect'
import Realname from './Realname/Realname'
import Feedback from './Feedback/Feedback'
import { post,toast,get } from '../axios/axios.js'
import Bus from '../bus.js'
import '../assets/stylus/default.styl'
export default {
    name: 'Personal',
    props: {
        msg: String
    },
    components:{
        [Tag.name]: Tag,
        Perfect: Perfect,
        Realname: Realname,
        Feedback: Feedback
    },
    data () {
        return {
            Msgdata: 0,
            LZavatar: '',
            LZnick: '',
            PerfectShow: false,
            RealnameShow: false,
            FeedbackShow: false,
            Mavatar: require('../assets/img/touxiang.png'),
            LZdata: JSON.parse(localStorage.getItem('LZdata')),
            flagData: '',
            SFtip: '未认证'
        }
    },
    mounted() {
        Bus.$on('flagData', (val) => {
            this.flagData = val
        })
        Bus.$on('PerfectShow', (val) => {
            this.PerfectShow = val
        })
        Bus.$on('RealnameShow', (val) => {
            this.RealnameShow = val
        })
        Bus.$on('FeedbackShow', (val) => {
            this.FeedbackShow = val
        })
        Bus.$on('gaiAvatar', (val) => {
           this.LZavatar  = val
        })
        Bus.$on('gaiNick', (val) => {
            this.LZnick = val
        })
        Bus.$on('SFtip', (val) => {
            this.SFtip = val
        })
        this.flagData = this.$store.state.flag
        this.LZavatar = this.$store.state.avatar
        this.LZnick = this.$store.state.nick
        this.getMsg()
    },
    methods:{
        getMsg() { // 获取新消息
            let that = this
            let databody = {
                "token": that.LZdata.token,
                "userId": that.LZdata.id
            }
            get('/msg/hasNewMsg', databody).then(res => {
                that.Msgdata = res.data
            }).catch(function (error) {
                console.log(error)
            })
        },
        myMessage() {
            this.$router.push('/Personal/Message')
        },
        myPosts() {
            this.$router.push('/Personal/Posts')
        },
        PerfectShowC() {
            this.PerfectShow = true
        },
        RealnameShowC() {
            if(this.flagData == 0) {
                Dialog.alert({
                    message: '审核中，请等待审核！'
                }).then(() => {
                    // on close
                });
            } else if (this.flagData == 1) {
                return false
            } else if (this.flagData == 2) {
                Dialog.alert({
                    message: '实名认证失败，请重新认证！'
                }).then(() => {
                    this.RealnameShow = true
                });
            } else {
                this.RealnameShow = true
            }
        },
        FeedbackShowC() {
            this.FeedbackShow = true
        },
        LoginC() {
            let that = this
            Dialog.confirm({
                message: '退出登录'
            }).then(() => {
                localStorage.clear()
                that.$router.push({path: '/'})
            }).catch(() => {
                // on cancel
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Personal
    .content
        position absolute
        width 90%
        left 50%
        top 10%
        transform translate(-50%,0)
        box-shadow 6px 4px 40px #ccc
        border-radius 10px
        .header
            .headerI
                margin-top -35px
                img
                    display block
                    margin auto
                    height 70px
                    width 70px
                    border-radius 15px
            .headerN
                font-size 14px
                padding 10px 0
        .contentList
            padding-bottom 50px
            .listBox
                display flex
                font-size 14px
                align-items center
                margin 0 20px
                border-bottom solid 1px #f1f1f1
                padding 20px 0
                &:last-child
                    border-bottom none
                .iocX
                    background-image url('../assets/img/xiaoxi.png')
                    background-size 100% 100%
                    background-repeat no-repeat
                    width 20px
                    height 21px
                .iocTz
                    background-image url('../assets/img/teizi.png')
                    background-size 100% 100%
                    background-repeat no-repeat
                    width 20px
                    height 21px
                .iocS
                    background-image url('../assets/img/renzheng.png')
                    background-size 100% 100%
                    background-repeat no-repeat
                    width 20px
                    height 21px
                .iocY
                    background-image url('../assets/img/fankui.png')
                    background-size 100% 100%
                    background-repeat no-repeat
                    width 20px
                    height 21px
                .iocW
                    background-image url('../assets/img/ic_feedback.png')
                    background-size 100% 100%
                    background-repeat no-repeat
                    width 20px
                    height 21px
                .iocT
                    background-image url('../assets/img/tuichu.png')
                    background-size 100% 100%
                    background-repeat no-repeat
                    width 20px
                    height 21px
                .iocJ
                    background-image url('../assets/img/youjiantou.png')
                    background-size 100% 100%
                    background-repeat no-repeat
                    width 15px
                    height 15px
                .listN
                    flex 1
                    text-align left
                    padding 0 10px
                    display flex
                    align-items center
                    span
                        margin-left auto
                .listS
                    color #999999
                    padding 0 10px
</style>
