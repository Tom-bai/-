<template>
    <div class="PostsMessage">
        <div class="bgbox" ref="orderBox" @scroll="handleScroll()">
            <div class="header">
                <div class="back" @click="back">{{total}}条新消息</div>
                <div class="msgnum" @click="back"></div>
            </div>
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
                <div class="main">
                    <div class="box">
                        <div class="list" v-for="(item,index) in MsgdataList">
                            <div class="listheader" :class="!item.hasRead?'listheaderT':''"><img :src="item.senderAvatar" alt=""></div>
                            <div class="mains">
                                <div class="msg" v-if="item.likeType == 1">{{item.senderName}}点赞了您的评论<span>{{item.passTime}}</span></div>
                                <div class="msg" v-else-if="item.likeType == 0">{{item.senderName}}点赞了您的帖子<span>{{item.passTime}}</span></div>
                                <div class="msg" v-else @click="ListC(item.senderName,item.postId,item.senderId,item.parentCommentId,item.commentId)">{{item.senderName}}回复您：{{item.commentContent}}<span>{{item.passTime}}</span></div>
                                <div class="msgimg"><img :src="item.images" alt=""></div>
                            </div>
                        </div>
                        <div class="nomore" v-if="!flag">没有更多了</div>
                    </div>
                </div>
            </van-pull-refresh>
        </div>
        <div class="inputpl">
            <van-field v-model="PLvalue" :placeholder="placeholder" ref="input" v-if="MessageH">
                <van-button slot="button" size="small" type="primary" @click="postpublish">发送</van-button>
            </van-field>
        </div>
    </div>
</template>

<script>
import { PullRefresh,Field,Button } from 'vant'
import { post,toast,get } from '../../axios/axios.js'
import axios from 'axios'
import Bus from '../../bus.js'
import '../../assets/stylus/default.styl'
export default {
    name: 'PostsMessage',
    props: {
        msg: String
    },
    components:{
        [PullRefresh.name]: PullRefresh,
        [Field.name]: Field,
        [Button.name]: Button,
    },
    data () {
        return {
            MessageH: false,
            placeholder: '输入你的评论，一起来唠嗑~',
            PLvalue: '',
            isLoading: false,
            MsgdataList: [],
            LZdata: JSON.parse(localStorage.getItem('LZdata')),
            pageNum: 1,
            flag: true,
            total: 0,
            objId: '',
            toReplierId: '',
            replyCommentId: '',
            commentId: ''
        }
    },
    mounted() {
        this.getMsgList()
    },
    methods:{
        getMsg() { // 获取新消息
            let that = this
            let databody = {
                "token": that.LZdata.token,
                "userId": that.LZdata.id
            }
            get('/msg/hasNewMsg', databody).then(res => {
                that.total = res.data
            }).catch(function (error) {
                console.log(error)
            })
        },
        onRefresh() { // 下拉刷新
            this.pageNum = 1
            this.getMsgList() 
        },
        getreadMsg(){ // 已读消息
            let that = this
            let databody = {
                "userId": that.LZdata.id
            }
            post('/msg/readMsg', databody).then(res => {
            }).catch(function (error) {
                console.log(error)
            })
        },
        handleScroll(e){
            let that = this     
            let scrollTop = that.$refs.orderBox.scrollTop
            let windowHeight = that.$refs.orderBox.clientHeight
            let scrollHeight = that.$refs.orderBox.scrollHeight
            if (scrollTop + windowHeight == scrollHeight || scrollTop + windowHeight + 100 >= scrollHeight) {
                if (that.flag) {   
                    that.getMsgList()  
                }
            }
        },
        getMsgList() { // 获取消息页
            let that = this
            that.flag = false
            let databody = {
                "token": that.LZdata.token,
                "userId": that.LZdata.id,
                "pageNum": that.pageNum,
                "pageSize": 10
            }
            get('/msg/pagingList', databody).then(res => {
                if (that.pageNum == 1) { // 下拉刷新要清空
                    that.MsgdataList = []
                }
                if (res.data.totalCount <= that.MsgdataList.length) {
                    that.flag = false
                    return false
                } else {
                    that.getMsg()
                    that.isLoading = false
                    that.MsgdataList = that.MsgdataList.concat(res.data.list)
                    that.flag = true
                    that.pageNum++
                }  
            }).catch(function (error) {
                console.log(error)
            })
        },
        back() {
            Bus.$emit('PostsMessageShow', false)
            this.getreadMsg()
        },
        ListC(name,id,userId,replyCommentId,commentId) {
            let that = this
            this.$nextTick(() => {
                this.placeholder = `回复${name}：`
                this.MessageH = true
                this.objId = id
                this.toReplierId = userId
                this.replyCommentId = replyCommentId
                this.commentId = commentId
                setTimeout(() => {
                    that.$refs.input.focus()
                }, 100)
            })
        },
        postpublish() { // 发表评论
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
                "postId": that.objId, // 帖子id
                "content": that.PLvalue,
                "replyCommentId": that.replyCommentId == null?that.commentId:that.replyCommentId // 二级评论id
            }
            post('/comment/publish', databody, '回复中...').then(res => {
                toast('回复成功！')
                that.PLvalue = ''
                that.placeholder = `输入你的评论，一起来唠嗑~`
                that.MessageH = false
            }).catch(function (error) {
                console.log(error)
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.PostsMessage
    position: fixed
    width: 100%
    height: 100%
    left 0
    top 0
    z-index 99
    background-color transparent
    overflow-y auto
    .bgbox
        position: fixed
        width: 100%
        height: 100%
        left 0
        top 80px
        z-index 99
        background-color #fff
        overflow-y auto
        .header
            display flex
            align-items center
            font-size 14px
            border-bottom solid 1px #D2D2D2
            position fixed
            width 100%
            top 80px
            background-color #fff
            height 50px
            z-index 999
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
                margin-bottom 80px
                .list
                    display flex
                    align-items center
                    .listheader
                        position relative
                        img 
                            width 40px
                            height 40px
                            border-radius 50%
                    .listheaderT::after
                            content:"";
                            width 10px
                            height 10px
                            background-color red
                            position absolute
                            right 0
                            top 0
                            border-radius 50% 
                    .mains
                        display flex
                        align-items center
                        padding 10px 0
                        border-bottom solid 1px #ccc
                        flex 1
                        .msg
                            text-align left 
                            font-size 14px
                            padding 0 15px
                            font-weight 600
                            flex 1
                            span 
                                font-size 12px
                                font-weight normal
                                color #999
                                margin-left 10px
                        .msgimg
                            img 
                                width 50px
                                height 50px
                                border-radius 5px
</style>
