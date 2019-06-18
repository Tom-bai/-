<template>
    <div class="Square" :class="PublishShow || SquareMessageShow || SquareMessageListShow?'hidden':''">
        <div class="header">
            <div class="headerlogo"><img src="../assets/img/guangchang.png" alt=""></div>
            <div class="headerlfabiao">
                <div class="hfabiao" @click="PublishClick"><i></i>发表</div>
                <div class="xiaoxi" :class="Msgdata !== 0?'xiaoxiT':''" @click="SquareMessageClick"><i></i>消息</div>
            </div>
        </div>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <div class="main">
                <div class="box">
                    <div class="list" v-for="(item,index) in dataList">
                        <div class="listheader"><img :src="item.avatar?item.avatar:Mavatar" alt=""></div>
                        <div class="mainT">
                            <div class="headername">
                                <div class="name">{{item.nick}}</div>
                                <div class="time">{{item.pastTime}}</div>
                            </div>
                            <div class="msg" v-if="item.content == null"></div>
                            <div class="msg" v-else>{{brandFold?filterLength(item.content):item.content}} <span v-if="item.content.length > 70" class="brandFold" @click="changeFoldState">{{brandFold?'【展开】':'【收起】'}}</span></div>
                            <div class="msgimg">
                                <div class="imgbox" v-for="(imgs,index) in item.imageUrls" @click="ImagePreviewC(item.imageUrls,index)"><img :src="imgs" alt=""></div>
                            </div>
                            <div class="pingjia">
                                <div class="zan" @click="zanClick(item.isLike?item.likeId:item.id,index)">
                                    <div v-if="item.isLike"><span class="zanL"></span> </div>
                                    <div v-else><span class="zanH"></span></div>
                                    <div>{{item.likeCount}}</div>
                                </div>
                                <div class="gong" @click="SquareMessageListClick(item.id,item.userId)">
                                    <div><img src="../assets/img/gong-h.png" alt=""></div>
                                    <div>{{item.commentCount}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="nomore" v-if="!flag">没有更多了</div>
                </div>
            </div>
        </van-pull-refresh>
        <!-- 我的消息 -->
        <transition name="Transition">
            <SquareMessage :SquareMessageShow="SquareMessageShow" v-if="SquareMessageShow"></SquareMessage>
        </transition>
        <!-- 评论消息 -->
        <transition name="Transition">
            <SquareMessageList :SquareMessageListShow="SquareMessageListShow" v-if="SquareMessageListShow" :objId="objId" :objuserId="objuserId"></SquareMessageList>
        </transition>
        <!-- 发表 -->
        <transition name="Transition">
            <Publish :PublishShow="PublishShow" v-if="PublishShow"></Publish>
        </transition>
    </div>
</template>

<script>
import Vue from 'vue';
import { Collapse, ImagePreview, PullRefresh } from 'vant'
import { post,toast,get } from '../axios/axios.js'
import SquareMessage from './SquareMessage/SquareMessage'
import SquareMessageList from './SquareMessage/SquareMessageList'
import Publish from './SquareMessage/Publish'
import '../assets/stylus/default.styl'
import Bus from '../bus.js'
export default {
    name: 'Square',
    props: {
        msg: String
    },
    components:{
        [Collapse.name]: Collapse,
        SquareMessage: SquareMessage,
        SquareMessageList: SquareMessageList,
        Publish: Publish,
        [PullRefresh.name]: PullRefresh,
    },
    data () {
        return {
            isLoading: false,
            objId: '',
            objuserId: '',
            dataList: [],
            Mavatar: require('../assets/img/touxiang.png'),
            zan: 0,
            brandFold: true,
            SquareMessageShow: false,
            SquareMessageListShow: false,
            PublishShow: false,
            LZdata: JSON.parse(localStorage.getItem('LZdata')),
            scrollTop:'',
            flag: true,
            pageNum: 1,
            Msgdata: 0
        }
    },
    mounted() {   
        Bus.$on('SquareMessageShow', (val) => {
            this.SquareMessageShow = val
            this.getMsg()
            document.body.classList.remove('scrollFixed')
            document.scrollingElement.scrollTop = this.scrollTop
        })
        Bus.$on('SquareMessageListShow', (val) => {
            this.SquareMessageListShow = val
            this.getMsg()
            document.body.classList.remove('scrollFixed')
            document.scrollingElement.scrollTop = this.scrollTop
        })
        Bus.$on('PublishShow', (val) => { // 发帖
            document.body.classList.remove('scrollFixed')
            document.scrollingElement.scrollTop = this.scrollTop
            this.PublishShow = val
            this.pageNum = 1
            this.dataList = []
            this.flag = true
            this.getData()
        })
        window.addEventListener('scroll', this.handleScroll)
        this.getData()
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll)
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
        onRefresh() { // 下拉刷新
            this.pageNum = 1
            this.getData() 
        },
        ImagePreviewC (imgs,index) { // 预览图片
            ImagePreview(imgs,index)
        },
        handleScroll() {
            let that = this     
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
            let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
            if (scrollTop + windowHeight == scrollHeight || scrollTop + windowHeight + 100 >= scrollHeight) {
                if (that.flag) {   
                    that.getData()  
                }
            }
        },
        PublishClick() {
            this.scrollTop = document.scrollingElement.scrollTop
            document.body.classList.add('scrollFixed')
            document.body.style.top = - this.scrollTop + 'px'
            this.PublishShow = true
        },
        SquareMessageListClick(Id,userId) {
            this.scrollTop = document.scrollingElement.scrollTop
            document.body.classList.add('scrollFixed')
            document.body.style.top = - this.scrollTop + 'px'
            this.objId = Id
            this.objuserId = userId
            this.SquareMessageListShow = true
        },
        SquareMessageClick() {
            this.scrollTop = document.scrollingElement.scrollTop
            document.body.classList.add('scrollFixed')
            document.body.style.top = - this.scrollTop + 'px'
            this.SquareMessageShow = true
        },
        changeFoldState() {
            this.brandFold = !this.brandFold
        },
        filterLength(value) {
            let len = 65
            if (value.length > len) {
                value = value.substring(0, len)
            }
            return value
        },
        zanClick(id,index) { // 点赞按钮
            let that = this
            let databody
            that.dataList[index].isLike = !that.dataList[index].isLike
            that.dataList[index].likeCount = that.dataList[index].isLike?parseInt(that.dataList[index].likeCount) +1:parseInt(that.dataList[index].likeCount) -1
            if (that.dataList[index].isLike) {
                databody = {
                    "token": that.LZdata.token,
                    "postId": id,
                    "commentId": null
                }
                post('/post/takeLike', databody).then(res => { // 点赞
                    // console.log(res)
                    that.dataList[index].likeId = res.data.likeId
                }).catch(function (error) {
                    console.log(error)
                })
            } else {
                databody = {
                    "token": that.LZdata.token,
                    "likeId": id
                }
                post('/post/cancelLike', databody).then(res => { // 取消点攒
                    // console.log(res)
                }).catch(function (error) {
                    console.log(error)
                })
            }
        },
        getData() { // 获取广场帖子列表
            let that = this
            that.flag = false
            let databody = {
                "token": that.LZdata.token,
                "pageNum": that.pageNum,
                "pageSize": 10
            }
            get('/post/postList', databody).then(res => {
                if (that.pageNum == 1) { // 下拉刷新要清空
                    that.dataList = []
                }
                if (res.data.total <= that.dataList.length) {
                    that.flag = false
                    return false
                } else {
                    that.isLoading = false
                    that.getMsg()
                    that.dataList = that.dataList.concat(res.data.list)
                    that.flag = true
                    that.pageNum++ 
                }  
            }).catch(function (error) {
                console.log(error)
            })
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Squarehiddle
    overflow hidden !important
    position fixed !important
    width 100%
    z-index 9
.Square
    background linear-gradient(180deg,#070573,#544AFF)
    position absolute
    width 100%
    min-height 100%
    background-repeat no-repeat
    background-size 100%
    top 0
    left 0
    .header
        display flex
        align-items center
        padding 26px 0px 10px 0px
        position: fixed
        width 100%
        height 50px
        top 0
        left 0
        background-color #110e85
        z-index 9
        .headerlogo
            margin 0 20px
            img 
                width 60px
                display block
        .headerlfabiao
            display flex
            align-items center
            color #fff
            margin-left auto
            margin-right 20px
            font-size 14px
            .hfabiao
                display flex
                align-items center
                margin-right 40px
                i
                    background-image url('../assets/img/fabiao.png')
                    background-size 100% 100%
                    background-repeat no-repeat
                    width 20px
                    height 20px
                    display inline-block
                    margin-right 4px
            .xiaoxi
                display flex
                align-items center
                i
                    background-image url('../assets/img/xiaoxiH.png')
                    background-size 100% 100%
                    background-repeat no-repeat
                    width 20px
                    height 20px
                    display inline-block
                    background-position 0 1px
                    margin-right 5px
                    position relative
            .xiaoxiT
                i::after
                    content:"";
                    width 10px
                    height 10px
                    background-color red
                    position absolute
                    right -5px
                    top 0
                    border-radius 50% 
    .main
        padding 0 15px
        margin-top 100px
        .box
            margin-bottom 60px
            .list
                display flex
                border-radius 5px
                background-color #fff
                margin-top 10px
                padding-top 8px
                .listheader
                    padding 10px 0 10px 10px
                    img 
                        width 40px
                        height 40px
                        border-radius 50%
                .mainT
                    padding 10px 10px 10px 0
                    flex 1
                    text-align left 
                    .headername
                        padding 0 15px
                        .name
                            font-size 14px
                            color #007EFF
                            display flex
                            align-items center
                            height 20px
                            .tip
                                margin-left auto
                                background-color #0CCB69
                                color #Fff
                                line-height 1
                                padding 6px 10px
                                border-radius 5px
                        .time
                            font-size 12px
                            font-weight normal
                            color #999
                            margin-top 4px
                    .msg
                        font-size 14px
                        padding 15px
                        font-weight 600
                        flex 1
                        .brandFold 
                            font-weight normal
                            color #007EFF
                            margin-left 5px
                    .msgimg
                        display flex
                        align-items center
                        flex-wrap wrap
                        .imgbox
                            flex 0 0 29%
                            padding 5px
                            img 
                                width 100%
                                height 80px
                                border-radius 5px
                                display block
                        .imgboxOne
                            img 
                                width 80%
                                border-radius 5px
                                display block
                        .imgboxTwo
                            flex 0 0 45%
                            padding 5px
                            img 
                                width 100%
                                height 80px
                                border-radius 5px
                                display block
                .pingjia
                    display flex
                    align-items center
                    justify-content flex-end
                    padding 10px
                    color #999
                    .zan
                        display flex
                        align-items center
                        font-size 14px
                        margin-right 50px
                        .zanL
                            width 23px
                            height 24px
                            display block
                            margin-right 5px
                            background-image url('../assets/img/xin-l.png')
                            background-size 100% 100%
                            background-repeat no-repeat
                        .zanH
                            width 23px
                            height 24px
                            display block
                            margin-right 5px
                            background-image url('../assets/img/xin-h.png')
                            background-size 100% 100%
                            background-repeat no-repeat
                    .gong
                        display flex
                        align-items center
                        font-size 14px
                        img 
                            width 23px
                            height 24px
                            display block
                            margin-right 5px
</style>
