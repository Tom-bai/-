<template>
    <div class="Home">
        <router-view/>
        <Tabbar></Tabbar>
    </div>
</template>

<script>
import Tabbar from '../components/Tabbar'
import '../assets/stylus/default.styl'
export default {
    name: 'Home',
    props: {
        msg: String
    },
    components:{
        Tabbar
    },
    data () {
        return {
            username: '',
            password: '',
            checked: true,
            show: true,
            count: '',
            timer: null,
        }
    },
    methods:{
        getCode(){
            const thime_count = 60
            if (!this.timer) {
                this.count = thime_count
                this.show = false
                this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= thime_count) {
                        this.count--
                    } else {
                        this.show = true;
                        clearInterval(this.timer)
                        this.timer = null
                    }
                }, 1000)
            }
        }  
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Login
    background-image url('../assets/img/login.png')
    position absolute
    width 100%
    height 100%
    background-repeat no-repeat
    background-size 100% 100%
    top 0
    left 0
    .LoginBox
        width 90%
        position absolute
        left 50%
        top 42%
        transform translate(-50%,-50%)
        .LoginName
            font-size 24px
            margin-bottom 18px
            color #fff
        .borderR
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        .borderR2
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        .input
            font-size 16px
            padding 10px 20px
            >>> .van-button
                background-color transparent 
                border none
                color #007EFF
                font-size 14px
        .checked
            margin 15px 0px
            >>> .van-checkbox__label
                color #fff
</style>
