<template>
    <div class="Feedback">
        <div class="FeedbackC">
            <div class="header">
                <div class="close" @click="closeC()"></div>
                <div class="headerT">
                    <div class="headerL"></div>
                    <div class="headerN">意见反馈</div>
                    <div class="headerL"></div>
                </div>
                <div class="headerI">
                    <div class="headerN">
                        <van-field
                            v-model="content"
                            type="textarea"
                            placeholder="您有任何意见或者建议可以通过反馈提交给我们！ 我们会及时尊听您的宝贵建议!"
                            rows="1"
                        />
                    </div>
                    <div class="headerBtn" @click="postData">提交</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Field  } from 'vant'
import { post,toast,get } from '../../axios/axios.js'
import Bus from '../../bus.js'
import '../../assets/stylus/default.styl'
export default {
    name: 'Feedback',
    props: {
        msg: String
    },
    components:{
        [Field .name]: Field
    },
    data () {
        return {
            content: '',
            LZdata: JSON.parse(localStorage.getItem('LZdata'))
        }
    },
    methods:{
        closeC() {
            Bus.$emit('FeedbackShow', false)
        },
        postData() {
            let that = this
            if (that.content == '' || !that.content.replace(/\s+/g,'')) {
                toast('请输入意见或者建议！')
                return false
            }
            let databody = {
                "token": that.LZdata.token,
                "content": that.content
            }
            post('/quantitativeTrade/feedback/add',databody).then(res => {
                if (res.code === 200) {
                    toast('提交成功')
                    setTimeout(() => {
                        Bus.$emit('FeedbackShow', false)
                    }, 1000);
                }
            }).catch(function (error) {
                console.log(error)
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Feedback
    position absolute
    width 100%
    height 100%
    background-color #fff
    top 0
    left 0
    .FeedbackC
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
                .headerN
                    height 250px
                    background-color #f1f1f1
                    width 90%
                    margin auto
                    border-radius 10px
                    margin-top 30px
                    >>> .van-field
                            height 250px
                            background-color #f1f1f1
                            border-radius 10px
                            .van-cell__value
                                height 250px
                                textarea
                                    height 250px
                                
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
