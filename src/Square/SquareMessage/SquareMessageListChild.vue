<template>
    <div class="SquareMessageListChild">
        <div class="bgbox" ref="orderBox" @scroll="handleScroll()">
            <div class="header">
                <div class="back">有{{totalCount}}条消息</div>
                <div class="msgnum" @click="back"></div>
            </div>
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <div class="main">
                    <div class="box">
                        <div class="list" v-for="(item,index) in listData">
                            <div class="mains">
                                <div class="mainlist" @click="ListC(item.replierName,item.id,item.userId)">
                                    <div class="listheader"><img :src="item.replierAvatar" alt=""></div>
                                    <div class="mainss">
                                        <div class="mainlist">
                                            <div class="msg">
                                                <div class="childname">{{item.replierName}}<span class="louzhu" v-if="item.postOwner">楼主</span><span class="huifu">回复：</span>{{item.toReplierName}}</div>
                                                <div class="msgtext">{{item.content}}<span>{{item.passTime}}</span></div>
                                            </div>
                                            <div class="msgimg" @click="zanClick(item.like?item.likeId:item.id,index)">
                                                <div v-if="item.like"><span class="zanL"></span> </div>
                                                <div v-else><span class="zanH"></span></div>
                                                <div>{{item.likes}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="nomore" v-if="!flag">没有更多了</div>
                    </div>
                </div>
            </van-pull-refresh>
            <div class="inputpl">
                <van-field v-model="PLvalue" :placeholder="placeholder" ref="input">
                    <van-button slot="button" size="small" type="primary" @click="postpublish">发送</van-button>
                </van-field>
            </div>
        </div>
    </div>
</template>

<script>
import { Field, Button, PullRefresh } from 'vant'
import { post,toast,get } from '../../axios/axios.js'
import axios from 'axios'
import Bus from '../../bus.js'
import '../../assets/stylus/default.styl'
export default {
    name: 'SquareMessageList',
    props: {
        msg: String
    },
    components:{
        [Field.name]: Field,
        [Button.name]: Button,
        [PullRefresh.name]: PullRefresh
    },
    data () {
        return {
            isLoading: false,
            placeholder: '输入你的评论，一起来唠嗑~',
            flagZ: false,
            zan: false,
            PLvalue: '',
            LZdata: JSON.parse(localStorage.getItem('LZdata')),
            listData: [],
            replyCommentId: '',
            toReplierId: '',
            flag: true,
            pageNum: 1,
            totalCount: 0,
        }
    },
    props: ['ListChildid','ListChilduserid','ListChildpostId','objuserIdN'],
    mounted() {
        this.toReplierId = this.ListChilduserid
        this.getpagingList()
    },
    destroyed () {
    },
    methods:{
        onRefresh() { // 下拉刷新
            this.pageNum = 1
            this.getpagingList() 
        },
        handleScroll(e){
            let that = this     
            let scrollTop = that.$refs.orderBox.scrollTop
           	let windowHeight = that.$refs.orderBox.clientHeight
           	let scrollHeight = that.$refs.orderBox.scrollHeight
            if (scrollTop + windowHeight == scrollHeight || scrollTop + windowHeight + 100 >= scrollHeight) {
                if (that.flag) {   
                    that.getpagingList()  
                }
             }
        },
        zanClick(id,index) { 
            let that = this
            let databody
            that.listData[index].like = !that.listData[index].like
            that.listData[index].likes = that.listData[index].like?parseInt(that.listData[index].likes) +1:parseInt(that.listData[index].likes) -1
            if (that.listData[index].like) {
                databody = {
                    "token": that.LZdata.token,
                    "postId": that.objId,
                    "commentId": id
                }
                post('/post/takeLike', databody).then(res => { // 点赞
                    // console.log(res)
                    that.listData[index].likeId = res.data.likeId
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
        back() {
            Bus.$emit('SquareMessageListChild', false)
        },
        ListC(name,id,userId) {
            this.$nextTick(() => {
                this.placeholder = `回复${name}：`
                this.flagZ = true
                this.replyCommentId = id
                this.toReplierId = userId
                this.$refs.input.focus()
            })
        },
        getpagingList() { // 获取消息页
            let that = this
            that.flag = false
            let databody = {
                "token": that.LZdata.token,
                "parentCommentId": that.ListChildid,
                "userId": that.LZdata.id,
                "postOwnerId": that.objuserIdN, //发帖人的id
                "pageNum": that.pageNum,
                "pageSize": 10
            }
            get('/comment/pagIngListSubComments', databody).then(res => {
                if (that.pageNum == 1) { // 下拉刷新要清空
                    that.listData = []
                }
                if (res.data.list == '') {
                    that.flag = false
                    return false
                } else {
                    that.isLoading = false
                    that.totalCount = res.data.totalCount
                    that.listData = that.listData.concat(res.data.list)
                    that.flag = true
                    that.pageNum++ 
                }

                
            }).catch(function (error) {
                console.log(error)
            })
        },
        postpublish(id) { // 发表评论
            let that = this
            if (that.PLvalue.length > 120) {
                toast('评论字数最多120字')
                return false
            } else if (that.PLvalue == '' || !that.PLvalue.replace(/\s+/g,'')) {
                toast('请输入您的评论!')
                return false
            }
            let  databody = { // 回复二级评论
                "token": that.LZdata.token,
                "replierId": that.LZdata.id, // 当前用户id
                "toReplierId": that.toReplierId, // 被回复用户id
                "postId": that.ListChildpostId, // 帖子id
                "content": that.PLvalue,
                "replyCommentId": that.ListChildid // 二级评论id
            }
            post('/comment/publish', databody).then(res => {
                that.PLvalue = ''
                that.pageNum = 1
                that.listData = []
                that.getpagingList()
                that.listData.unshift(res.data)
                that.placeholder = `输入你的评论，一起来唠嗑~`
            }).catch(function (error) {
                console.log(error)
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.SquareMessageListChild
    position: fixed
    width: 100%
    height: 100%
    left 0
    top 0
    z-index 999
    background-color #fff
    overflow-y auto
    .bgbox
        position: fixed
        width: 100%
        height: 100%
        left 0
        top 0
        z-index 99999
        background-color #fff
        overflow-y auto
        box-shadow 0 1px 10px #ccc
        .header
            display flex
            align-items center
            font-size 14px
            border-bottom solid 1px #D2D2D2
            position fixed
            width 100%
            top 0
            background-color #fff
            height 50px
            z-index 9999
            .back
                font-size 14px
                display flex
                align-items center
                flex 1
                justify-content center
                margin-left 38px
            .msgnum
                background-image url('../../assets/img/cuowu.png')
                background-size 100% 100%
                background-repeat no-repeat
                width 18px
                height 18px 
                margin-right 20px
        .main
            padding 0 15px
            margin-top 50px
            .box
                margin-bottom 60px
                .list
                    display flex
                    .listheader
                        padding 10px 0
                        img 
                            width 40px
                            height 40px
                            border-radius 50%
                    .mains
                        padding 10px 0
                        flex 1
                        .more
                            font-size 12px
                            padding 10px 0
                        .mainlist
                            display flex
                            flex 1
                            .mainss
                                padding 10px 0
                                flex 1 
                            .msg
                                text-align left 
                                font-size 14px
                                padding 0 15px
                                flex 1
                                >.msgheader
                                    color #007EFF
                                    >span
                                        color #0CCB69
                                        font-size 12px
                                        margin-left 5px
                                >.msgtext
                                    >span 
                                        font-size 12px
                                        font-weight normal
                                        color #999
                                        margin-left 10px
                                >.childname
                                    color #007eff
                                    >.huifu
                                        color #ccc
                                        font-size 12px
                                    >.louzhu
                                        color #0CCB69
                                        font-size 12px
                                        margin 0 5px
                            .msgimg
                                .zanL
                                    width 23px
                                    height 24px
                                    display block
                                    background-image url('../../assets/img/xin-l.png')
                                    background-size 100% 100%
                                    background-repeat no-repeat
                                .zanH
                                    width 23px
                                    height 24px
                                    display block
                                    background-image url('../../assets/img/xin-h.png')
                                    background-size 100% 100%
                                    background-repeat no-repeat
        .inputpl
            position fixed
            bottom 0
            width 100%
            left 0
            box-shadow 0 1px 10px #ccc                    
</style>
