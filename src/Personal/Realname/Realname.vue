<template>
    <div class="Realname">
        <div class="RealnameC">
            <div class="header">
                <div class="close" @click="closeC()"></div>
                <div class="headerT">
                    <div class="headerL"></div>
                    <div class="headerN">实名认证</div>
                    <div class="headerL"></div>
                </div>
                <div class="headerTps">
                    <div>请务必上传清晰的身份证照片</div>
                    <div>实名认证审核通过后，才能使用委托功能</div>
                </div>
                <div class="headerI">
                    <div class="headerUp">
                        <div class="Upimg"><img :src="headerImgZ" alt=""></div>
                        <van-uploader :after-read="onReadZ" accept="image/jpeg, image/png, image/jpg">
                            <div class="imgBg">
                                <span>上传身份证正面照片</span>
                            </div>
                        </van-uploader>
                    </div>
                    <div class="headerUp">
                        <div class="Upimg"><img :src="headerImgF" alt=""></div>
                        <van-uploader :after-read="onReadF" accept="image/jpeg, image/png, image/jpg">
                            <div class="imgBg">
                                <span>上传身份证反面照片</span>
                            </div>
                        </van-uploader>
                    </div>
                    <div class="headerBtn" @click="postData">保存</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Field, Uploader,Toast } from 'vant'
import { post,toast,get } from '../../axios/axios.js'
import axios from 'axios'
import Bus from '../../bus.js'
import '../../assets/stylus/default.styl'
import 'lrz/dist/lrz.all.bundle.js'
export default {
    name: 'Realname',
    props: {
        msg: String
    },
    components:{
        [Field .name]: Field,
        [Uploader.name]: Uploader,
    },
    data () {
        return {
            valueName: '',
            headerImgZ: '',
            headerImgF: '',
            headerImgZFile: '',
            headerImgFile: '',
            LZdata: JSON.parse(localStorage.getItem('LZdata'))
        }
    },
    methods:{
        onReadZ(file) {
            let that = this
            lrz(file.file)
            .then(function (rst) {
                // 处理成功会执行
                that.headerImgZ = rst.base64
                that.headerImgZFile = rst.file
            })
            .catch(function (err) {
                // 处理失败会执行
                toast('上传失败，请刷新页面重新上传！')
            })
            .always(function () {
                // 不管是成功失败，都会执行
            });
        },
        onReadF(file) {
            let that = this
            lrz(file.file)
            .then(function (rst) {
                // 处理成功会执行
                that.headerImgF = rst.base64
                that.headerImgFile = rst.file
            })
            .catch(function (err) {
                // 处理失败会执行
                toast('图片上传失败请刷新页面后重新上传！')
            })
            .always(function () {
                // 不管是成功失败，都会执行
            });
        },
        closeC() {
            Bus.$emit('RealnameShow', false)
        },
        postData() {
            let that = this
            if (that.headerImgZ == '' || that.headerImgF == '') {
                toast('请上传身份证正反照')
                return false
            } else {
                let databody = {
                    "token": that.LZdata.token
                }
                const instance = {
                    headers: {'Content-Type': 'multipart/form-data;'},
                    params: {
                        data: databody
                    },
                }
                let param = new FormData();
                param.append('file', that.headerImgZFile)
                param.append('file', that.headerImgFile)
                let loading = Toast.loading({
                    duration: 0,       // 持续展示 toast
                    forbidClick: true, // 禁用背景点击
                    loadingType: 'spinner',
                    message: '上传中...'
                });
                axios.post('/quantitativeTrade/identity-card/upload',param,instance).then(res=>{   
                    if (res.data.code === 200) {
                        loading.clear()
                        toast('提交成功')
                        Bus.$emit('SFtip', res.data.message)
                        Bus.$emit('flagData', 0)
                        that.$store.commit('setFlag', 0)
                        setTimeout(() => {
                            Bus.$emit('RealnameShow', false)
                        }, 1000);
                    }
                }).catch(err => {
                    toast('上传出错请刷新页面！')
                    setTimeout(() => {
                        loading.clear()
                    }, 1000);
                })
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Realname
    position absolute
    width 100%
    height 100%
    background-color #fff
    top 0
    left 0
    .RealnameC
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
            .headerTps
                font-size 12px
                color #999
                text-align center
                margin-top 5px
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
                .headerUp
                    width 70%
                    margin auto
                    border dashed 1px #ccc
                    position relative
                    margin-top 10px
                    >>> .van-uploader
                            .van-uploader__input
                                z-index 9
                            .imgBg
                                font-size 12px
                                background-image url('../../assets/img/paizhao.png')
                                background-size 60px 60px
                                background-repeat: no-repeat
                                width 100%
                                height 110px
                                background-position 50%
                                display flex
                                background-position-y 15px
                                span
                                    display flex
                                    align-items flex-end
                                    margin-bottom 10px
                    .Upimg
                        width 100%
                        height 100%
                        position absolute
                        left 0
                        top 0
                        z-index 1
                        img 
                            display block
                            margin auto
                            width 100%
                            height 100%
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
