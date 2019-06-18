<template>
    <div class="Perfect">
        <div class="perfectC">
            <div class="header">
                <div class="close" @click="closeC()"></div>
                <div class="headerT">
                    <div class="headerL"></div>
                    <div class="headerN">完善资料</div>
                    <div class="headerL"></div>
                </div>
                <div class="headerI">
                    <div class="headerIimg">
                        <img :src="LZavatarP == null || LZavatarP == 'null'?Mavatar:LZavatarP" alt="">
                    </div>
                    <div class="headerUp">
                        <van-uploader :after-read="onRead" accept="image/jpeg, image/png, image/jpg">
                            <div class="headerIbtn">上传头像</div>
                        </van-uploader>
                    </div>
                    <div class="headerN">
                        <van-field v-model="LZnickP" placeholder="输入您的昵称" />
                    </div>
                    <div class="headerBtn" @click="postData">保存</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Uploader, Field,Toast  } from 'vant'
import { toast } from '../../axios/axios.js'
import axios from 'axios'
import Bus from '../../bus.js'
import '../../assets/stylus/default.styl'
import 'lrz/dist/lrz.all.bundle.js'
export default {
    name: 'Perfect',
    props: ['LZavatar','LZnick'],
    components:{
        [Field.name]: Field,
        [Uploader.name]: Uploader
    },
    data () {
        return {
            LZavatarP: '',
            LZnickP: '',
            headerImgFile: '',
            Mavatar: require('../../assets/img/touxiang.png'),
            LZdata: JSON.parse(localStorage.getItem('LZdata'))
        }
    },
    mounted() {
        this.LZavatarP = this.$store.state.avatar
        if (this.$store.state.nick == 'null') {
            this.LZnickP = ''
        } else {
            this.LZnickP = this.$store.state.nick
        }
    },
    methods:{
        onRead(file) {
            let that = this
            lrz(file.file)
            .then(function (rst) {
                // 处理成功会执行
                that.LZavatarP = rst.base64
                that.headerImgFile = rst.file
            })
            .catch(function (err) {
                // 处理失败会执行
                toast('上传失败，请刷新页面重新上传！')
            })
            .always(function () {
                // 不管是成功失败，都会执行
            });
        },
        closeC() {
            Bus.$emit('PerfectShow', false)
        },
        postData() {
            let that = this
            if (that.LZnickP == '' || !that.LZnickP.replace(/\s+/g,'')) {
                toast('输入您的昵称')
                return false
            } else if(that.LZnickP == 'null') {
                toast('非法字符！')
                that.LZnickP = ''
                return false
            } else if (that.LZnickP.length > 8) {
                toast('最长为8个字符')
                // that.LZnickP = that.LZnickP.slice(0,8)
                return false
            } else {
                let databody = {
                    "token": that.LZdata.token,
                    "nickName": that.LZnickP
                }
                const instance = {
                    headers: {'Content-Type': 'multipart/form-data;'},
                    params: {
                        data: databody
                    },
                }
                let param = new FormData();
                if (that.headerImgFile.size / 1024 > 1024) {
                    toast('图片过大，最大为1M')
                    return false
                }
                param.append('photo', that.headerImgFile)
                let loading = Toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '修改中...'
                });
                axios.post('/quantitativeTrade/user/update/userInfo',param,instance).then(res=>{
                    if (res.data.code === 200) {
                        loading.clear()
                        toast('修改成功')
                        Bus.$emit('gaiAvatar', res.data.data.avatar)
                        Bus.$emit('gaiNick', res.data.data.nick)
                        that.$store.commit('setNick', res.data.data.nick)
                        that.$store.commit('setAvatar', res.data.data.avatar)
                        that.LZnickP = this.$store.state.nick
                        that.LZavatarP = this.$store.state.avatar 
                        setTimeout(() => {
                            Bus.$emit('PerfectShow', false)
                        }, 1000);
                    }
                }).catch(err => {
                    loading.clear()
                })
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Perfect
    position absolute
    width 100%
    height 100%
    background-color #fff
    top 0
    left 0
    .perfectC
        position absolute
        width 90%
        left 50%
        top 45%
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
            .headerI
                .headerIimg
                    margin-top 50px
                    img
                        width 80px
                        height 80px
                        display block
                        margin auto
                        border-radius 15px
                        border solid 1px #f1f1f1
                .headerUp
                    .headerIbtn
                        font-size 14px
                        font-weight 400
                        margin-top 10px
                .headerN
                    margin-top 50px
                    >>> .van-field
                            .van-field__control
                                text-align center
                                border-bottom solid 1px #e4dfdf
                                width 80%
                                margin auto
                                height 40px
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
                    margin-top 50px
    </style>
