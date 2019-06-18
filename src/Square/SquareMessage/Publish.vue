<template>
    <div class="Publish">
        <div class="header">
            <div class="back" @click="back"><i></i>我的帖子</div>
            <div class="msgnum" @click="postData">发布</div>
        </div>
        <div class="textareabox">
            <van-field
                v-model="message"
                type="textarea"
                placeholder="给伙伴们分享点什么呢，编写下来. . ."
                rows="1"
                class="textarea"
                ref="input"
                @input="messageLenghtInput"
            />
            <div class="num">{{messageLenght}}字</div>
        </div>
        <div class="imgupload">
            <el-upload
                ref="upload"
                :limit="4"
                :multiple="true"
                action="123"
                :auto-upload="false"
                list-type="picture-card"
                class="upload"
                :on-exceed="handexceed"
                :on-change="onChange"
                :on-remove="handleRemove">
                <i class="upload-i"></i>
            </el-upload>
        </div>
        <div class="footBtn">
            <div class="fabiao"><i></i></div>
            <div class="xiaoxi"><button @click="focusjianpan"><i :class="flag?'jianH':'jianL'"></i></button></div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { Field, Toast } from 'vant'
import { Upload } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Upload)
import { toast } from '../../axios/axios.js'
import axios from 'axios'
import Bus from '../../bus.js'
import '../../assets/stylus/default.styl'
export default {
    name: 'Publish',
    props: {
        msg: String
    },
    components:{
        [Field.name]: Field
    },
    data () {
        return {
            myfileList: [],
            dialogImageUrl: '',
            dialogVisible: false,
            message: '',
            messageLenght: 500,
            flag: true,
            LZdata: JSON.parse(localStorage.getItem('LZdata'))
        }
    },
    mounted() {   
    },
    methods:{
        messageLenghtInput (val) {
            var nMax = 500
            var len =val.length  
            if (this.messageLenght == 0) {
                toast('最多输入500字！')
                return false
            } else {
                this.messageLenght = nMax-len
            }         
        },
        postData () {
            let that = this
            if (that.message == '' && that.myfileList.length <= 0) {
                toast('请填写发布内容！')
                return false
            }
            let databody = {
                "token": that.LZdata.token,
                "userId": that.LZdata.id,
                "content": that.message,
            }
            const instance = {
                headers: {'Content-Type': 'multipart/form-data;'},
                params: {
                    data: databody
                },
            }
            let formData = new FormData()
            that.myfileList.forEach( file => {
                formData.append('imgFile', file.raw)
            }) 
            let loading = Toast.loading({
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: 'spinner',
                message: '发布中...'
            });
            axios.post('/post/publish',formData,instance).then(res=>{
                loading.clear()
                if (res.data.code == 200) {
                    toast('发布成功！')
                    that.message = ''
                    that.$refs.upload.clearFiles()
                    setTimeout(() => {
                        Bus.$emit('PublishShow', false)
                    }, 1500);
                } else {
                    toast(res.data.message)
                }
            }).catch(err => {
                loading.clear()
            })
        },
        handexceed (file, fileList) { // 文件超出
            toast('最多只能上传4张图片！')
        },
        handleRemove (file, fileList) { // 移除文件
            console.log(file, fileList);
        },
        onChange (file, fileList) { // 添加文件
            let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
            if (existFile) {
                toast('当前文件已经存在！')
                fileList.pop()
                return false
            }
            this.myfileList = fileList
        },
        back () {
            Bus.$emit('PublishShow', false)
        },
        focusjianpan () {
            if(this.flag) {
                this.flag = false
                this.$refs.input.focus()
            } else {
                this.flag = true
                this.$refs.input.blur()
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Publish
    position: fixed
    width: 100%
    height: 100%
    left 0
    top 0
    z-index 99
    background-color #f1f1f1
    overflow-y auto  
    .header
        display flex
        align-items center
        font-size 14px
        padding 20px 15px
        box-shadow 0 1px 10px #ccc
        background-color #fff
        .back
            font-size 16px
            font-weight 600
            display flex
            align-items center
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
            color #007EFF    
    .textareabox 
        .textarea
            margin-top 10px
            background-color #f1f1f1
            >>>.van-field__control
                    height 120px
        .num
            font-size 12px
            text-align right 
            padding 0 15px
            color #999999
    .imgupload
        >>>.el-upload-list--picture-card
            display flex
            align-items center
            flex-wrap wrap
            padding 0 15px
            .el-upload-list__item
                width 33.3333%
                height 120px
                margin 0
                padding 5px
                background-color transparent
                border none
            .el-upload-list__item-actions
                .el-upload-list__item-preview
                    display none
                .el-upload-list__item-delete
                    position absolute
                    margin 0
        >>>.el-upload--picture-card
            position fixed
            left 0
            height 50px
            bottom 0
            z-index 100
            border none
            display flex
            width 50%
            border-radius 0
            .upload-i
                background-image url('../../assets/img/tu-h.png')
                background-size 100% 100%
                background-repeat no-repeat
                width 26px
                height 26px
                display block
                margin auto
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
            i
                background-image url('../../assets/img/tu-h.png')
                background-size 100% 100%
                background-repeat no-repeat
                width 26px
                height 26px
                display inline-block
        .xiaoxi
            display flex
            align-items center
            flex 1
            justify-content center
            button 
                border none 
                background-color #fff
                .jianH
                    background-image url('../../assets/img/jian-h.png')
                    background-size 100% 100%
                    background-repeat no-repeat
                    background-position 0px 1px
                    width 26px
                    height 26px
                    display inline-block
                    position relative
                .jianL
                    background-image url('../../assets/img/jian-l.png')
                    background-size 100% 100%
                    background-repeat no-repeat
                    background-position 0px 1px
                    width 26px
                    height 26px
                    display inline-block
                    position relative
</style>
