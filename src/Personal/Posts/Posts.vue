<template>
    <div class="Posts" :class="PostsMessageShow?'hidden':''">
        <div class="header">
            <div class="back" @click="back"><i></i>我的帖子</div>
            <div class="msgnum" @click="guanli">{{guanliShowT}}</div>
        </div>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <div class="main">
                <div class="box">
                    <div class="list" v-for="(item,index) in dataList">
                        <div class="listheader"><img :src="item.avatar?item.avatar:Mavatar" alt=""></div>
                        <div class="main">
                            <div class="headername">
                                <div class="name">{{item.nick}}<van-checkbox v-if="guanliShow" @change="checkedDel(item.deleted,item.id,index)" v-model="item.deleted" checked-color="#0CCB69" class="checked"></van-checkbox></div>
                                <div class="time">{{item.pastTime}}</div>
                            </div>
                            <div class="msg" v-if="item.content == null"></div>
                            <div class="msg" v-else>{{brandFold?filterLength(item.content):item.content}} <span v-if="item.content.length > 70" class="brandFold" @click="changeFoldState">{{brandFold?'【展开】':'【收起】'}}</span></div>
                            <div class="msgimg">
                                <div class="imgbox" v-for="(imgs,index) in item.imageUrls" @click="ImagePreviewC(item.imageUrls)"><img :src="imgs" alt=""></div>
                            </div>
                            <div class="pingjia">
                                <div class="zan" @click="zanClick(item.isLike?item.likeId:item.id,index)">
                                    <div v-if="item.isLike"><span class="zanL"></span> </div>
                                    <div v-else><span class="zanH"></span></div>
                                    <div>{{item.likeCount}}</div>
                                </div>
                                <div class="gong" @click="SquareMessageListClick(item.id,item.userId)">
                                    <div><img src="../../assets/img/gong-h.png" alt=""></div>
                                    <div>{{item.commentCount}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="nomore" v-if="!flag">没有更多了</div>
                </div>
            </div>
        </van-pull-refresh>
        <div class="footBtn">
            <div class="fabiao" @click="PublishClick"><i></i>发表帖子</div>
            <div class="xiaoxi" :class="Msgdata !== 0?'xiaoxiT':''" @click="PostsMessageClick"><i></i>我的消息</div>
        </div>
        <!-- 我的消息 -->
        <transition name="Transition">
            <PostsMessage :PostsMessageShow="PostsMessageShow" v-if="PostsMessageShow"></PostsMessage>
        </transition>
        <!-- 评论消息 -->
        <transition name="Transition">
            <SquareMessageList :SquareMessageListShow="SquareMessageListShow" v-if="SquareMessageListShow" :objId="objId" :objuserId="objuserId"></SquareMessageList>
        </transition>
        <!-- 发表 -->
        <transition name="Transition">
            <Publish :PublishShow="PublishShow" v-if="PublishShow"></Publish>
        </transition>
        <!-- 管理删除 -->
        <div class="shanchuBtn" v-if="guanliShow" @click="del">删除</div>
    </div>
</template>

<script>
import { Checkbox, CheckboxGroup, Dialog, ImagePreview, PullRefresh } from 'vant'
import { post,toast,get,postTwo } from '../../axios/axios.js'
import PostsMessage from './PostsMessage'
import Publish from '../../Square/SquareMessage/Publish'
import SquareMessageList from '../../Square/SquareMessage/SquareMessageList'
import axios from 'axios'
import Bus from '../../bus.js'
import '../../assets/stylus/default.styl'
export default {
    name: 'Posts',
    props: {
        msg: String
    },
    components:{
        [Checkbox.name]: Checkbox,
        [CheckboxGroup.name]: CheckboxGroup,
        PostsMessage: PostsMessage,
        SquareMessageList: SquareMessageList,
        [PullRefresh.name]: PullRefresh,
        Publish: Publish
    },
    data () {
        return {
            isLoading: false,
            objId: '',
            objuserId: '',
            flag: true,
            dataList: [],
            Mavatar: require('../../assets/img/touxiang.png'),
            brandFold: true,
            zan: false,
            checked: false,
            guanliShow: false,
            PostsMessageShow: false,
            SquareMessageListShow: false,
            PublishShow: false,
            guanliShowT: '管理',
            LZdata: JSON.parse(localStorage.getItem('LZdata')),
            deleteID: [],
            pageNum: 1,
            Msgdata: 0
        }
    },
    mounted() {
        Bus.$on('PostsMessageShow', (val) => {
            this.PostsMessageShow = val
            this.getMsg()
            document.body.classList.remove('scrollFixed')
            document.scrollingElement.scrollTop = this.scrollTop
        })
        Bus.$on('SquareMessageListShow', (val) => {
            this.SquareMessageListShow = val
            document.body.classList.remove('scrollFixed')
            document.scrollingElement.scrollTop = this.scrollTop
        })
        Bus.$on('PublishShow', (val) => { // 发表帖子
            this.PublishShow = val
            this.pageNum = 1
            this.dataList = []
            this.flag = true
            this.getData()
            document.body.classList.remove('scrollFixed')
            document.scrollingElement.scrollTop = this.scrollTop
        })
        this.getData()
        window.addEventListener('scroll', this.handleScroll)
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
        ImagePreviewC (imgs) { // 预览图片
            ImagePreview(imgs)
        },
        SquareMessageListClick(Id,userId) { // 评论
            this.scrollTop = document.scrollingElement.scrollTop
            document.body.classList.add('scrollFixed')
            document.body.style.top = - this.scrollTop + 'px'
            this.objId = Id
            this.objuserId = userId
            this.SquareMessageListShow = true
        },
        PublishClick() { // 发帖
            this.PublishShow = true
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
        getData() { // 获取广场帖子列表
            let that = this
            that.flag = false
            let databody = {
                "token": that.LZdata.token,
                "pageNum": that.pageNum,
                "pageSize": 10
            }
            get('/post/postMyList', databody).then(res => {
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
        filterLength(value) {
            let len = 65
            if (value.length > len) {
                value = value.substring(0, len)
            }
            return value
        },
        PostsMessageClick() {
            this.scrollTop = document.scrollingElement.scrollTop
            document.body.classList.add('scrollFixed')
            document.body.style.top = - this.scrollTop + 'px'
            this.PostsMessageShow = true
        },
        back() {
            this.$router.push('/Personal')
        },
        checkedDel(del,id,index) { // 批量选择帖子id
            let flags = false
            this.dataList[index].deleted = del
            if (this.dataList[index].deleted) {
                for (var i in this.deleteID) {
                    if (this.deleteID[i] == id) {
                        flags = true
                    }
                }
                if (flags == false) {
                    this.deleteID.push(id)
                }
            } else {
                for (var i in this.deleteID) {
                    if (this.deleteID[i] == id) {
                        this.deleteID.splice(i, 1)
                    }
                }
            }
        },
        guanli() {
            if (this.dataList.length <= 0) {
                toast('暂无管理内容！')
            }
            if (this.guanliShow == true){
                this.guanliShow = false
                this.guanliShowT = '管理'
            } else {
                this.guanliShow = true
                this.guanliShowT = '取消'
            }
        },
        removeByVal: function(array, val) { // 查询删除帖子
            for (var i = 0; i < array.length; i++) {
                if(array[i].id == val) {
                    array.splice(i, 1)
                    break
                }
            }
        },
        del() {
            let that = this
            Dialog.confirm({
                message: '确定删除？'
            }).then(() => {
                let databody = {
                    "token": that.LZdata.token,
                    "postIds": `[${that.deleteID}]`
                }
                let newdata = `data=${JSON.stringify(databody)}`
                axios({
                    method: "post",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    url: "/post/batchDelete",
                    data: newdata
                }).then((res) => {
                    if (res.data.code == 200) {
                        toast('删除成功！')
                        for (var i in that.deleteID) {
                            let coinId = that.dataList.find(person => person.id === that.deleteID[i])
                            that.removeByVal(that.dataList,coinId.id)
                        }
                        if (that.dataList.length <=0 ) {
                            that.guanliShow = false
                        }
                        that.deleteID = [] // 清空选择内容
                    } else {
                        toast('删除失败！')
                     }
                }).catch(function (error) {
                     console.log(error)
                })
            }).catch(() => {
                // on cancel
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Posts
    background-color #fff
    .header
        display flex
        align-items center
        font-size 14px
        height 60px
        box-shadow 0 1px 10px #ccc
        position fixed
        width 100%
        top 0
        left 0
        background #fff
        z-index 9
        .back
            font-size 16px
            font-weight 600
            display flex
            align-items center
            margin: 0 15px
            i 
                background-image url('../../assets/img/youjiantou.png')
                background-size 100% 100%
                background-repeat no-repeat
                width 26px
                height 26px
                transform rotate(180deg)
                display inline-block
                margin-right 10px
        .msgnum
            margin-left auto
            margin-right 15px
    .main
        padding 0 15px
        .box
            margin-bottom 60px
            margin-top 70px
            .list
                display flex
                box-shadow 0px 5px 15px #ccc
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
                .main
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
                            .checked
                                margin-left auto
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
                        span 
                            font-size 12px
                            font-weight normal
                            color #999
                            margin-left 10px
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
                            background-image url('../../assets/img/xin-l.png')
                            background-size 100% 100%
                            background-repeat no-repeat
                        .zanH
                            width 23px
                            height 24px
                            display block
                            margin-right 5px
                            background-image url('../../assets/img/xin-h.png')
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
    .footBtn
        font-size 14px
        display flex
        align-items center
        height 50px
        border-top solid 1px #f1f1f1
        position fixed
        width 100%
        bottom 0
        background-color #fff
        z-index 99
        left 0
        .fabiao
            display flex
            align-items center
            justify-content center
            flex 1
            border-right solid 1px #D2D2D2
            i
                background-image url('../../assets/img/renzheng.png')
                background-size 100% 100%
                background-repeat no-repeat
                width 20px
                height 20px
                display inline-block
                margin-right 10px
        .xiaoxi
            display flex
            align-items center
            flex 1
            justify-content center
            i
                background-image url('../../assets/img/xiaoxi.png')
                background-size 100% 100%
                background-repeat no-repeat
                background-position 0px 1px
                width 20px
                height 20px
                display inline-block
                margin-right 10px
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
    .shanchuBtn
        background linear-gradient(269deg,rgba(30,219,142,1),rgba(0,168,255,1))
        font-size 16px
        display flex
        align-items center
        justify-content center
        height 50px
        color #fff
        position fixed
        width 100%
        bottom 0
        z-index 999
        left 0
</style>
