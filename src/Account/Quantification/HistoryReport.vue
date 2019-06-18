<template>
    <div class="Subjective" :class="Commission?'hidden':''">
        <div class="header"></div>
        <div class="content">
            <div class="back" @click="back()"></div>
            <div class="contentBox">
                <img :src="HistoryReportImg" alt="" width="100%">
            </div>
            <!-- 选项卡 -->
        </div>
    </div>
</template>

<script>
import { Field,Cell } from 'vant'
import Commission from './Commission'
import Bus from '../../bus.js'
import '../../assets/stylus/default.styl'
export default {
    name: 'Subjective',
    props: ['HistoryReportImg'],
    components:{
        [Field .name]: Field,
        [Cell.name]: Cell,
        Commission: Commission
    },
    data () {
        return {
            HeaderBtnA: 1,
            Mavatar: require('../../assets/img/touxiang.png'),
            Commission: false
        }
    },
    mounted() {
        Bus.$on('Commission', (val) => {
            this.Commission = val
        })
    },
    methods:{
        HeaderBtn(val) {
            this.HeaderBtnA = val
        },
        CommissionC() {
            this.Commission = true
        },
        back() {
            Bus.$emit('HistoryReport', false)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.Subjective
    width 100%
    height 100%
    position fixed
    top 0
    left 0
    z-index 9999
    background-color #000
    overflow auto
    .BTN
        position fixed
        width 100%
        height 50px
        line-height 50px
        left 0
        bottom 0
        background linear-gradient(269deg,rgba(30,219,142,1),rgba(0,168,255,1))
        font-size 14px
        color #fff
    .header
        background-repeat no-repeat
        background-size 100% 100%
        height 350px
    .content
        position absolute
        top 26px
        left 50%
        width 100%
        transform translate(-50%,0)
        margin-bottom 80px
        .back
            background-image url('../../assets/img/youjiantou.png')
            background-repeat no-repeat
            width 25px
            height 25px
            background-size 100% 100%
            transform rotate(180deg)
            margin-left 20px
        .contentBox
            position absolute
            width 100%
            top 50%
            left 0
            transform translate(0%,20%)
            .contentH
                display flex
                align-items center
                color #ffffff
                font-size 14px
                margin-bottom 30px
                .name
                    font-size 18px
                    flex 1
                    text-align left 
                    align-items center
                    padding 0 20px 
                .tips
                    display inline-block
                    width 80px
                    height 40px
                    line-height 40px
                    border-radius 20px 0 0 20px
                    background-color #0CCB69
                    text-align center
                    padding-left 16px
                .tipsN
                    display inline-block
                    width 80px
                    height 40px
                    line-height 40px
                    border-radius 20px 0 0 20px
                    background-color #A0A0A0
                    text-align center
                    padding-left 16px
            .contentT
                font-size 12px
                color #ffffff
                text-align left 
                padding 15px 20px
                line-height 1
                .time
                    padding-bottom 8px
            .contentL
                width 90%
                display flex
                line-height 1
                font-size 14px
                color #000
                background-color #fff
                margin auto
                box-shadow 3px 2px 13px #ccc 
                .listI
                    flex 1
                    padding 5px 0
                    margin 15px 0
                    .Inum
                        padding 6px 0
                .LRborder
                    border-left dashed 1px #999
                    border-right dashed 1px #999
        .contentBoxTwo
            width 90%
            margin auto
            box-shadow 3px 2px 13px #ccc 
            margin-top 15px
            .HeaderBtn
                background-color #f1f1f1
                display flex
                justify-content center
                font-size 14px
                font-weight normal
                .BtnOne
                    flex 1
                    height 40px
                    line-height 40px
                .BtnTwo   
                    flex 1
                    height 40px
                    line-height 40px
                .active
                    background linear-gradient(269deg,rgba(30,219,142,1),rgba(0,168,255,1))
                    color #fff
                    position relative
            .navZ
                .list
                    background-color #fff
                    font-size 14px
                   .listItem
                        display flex 
                        border-bottom solid 1px #f1f1f1
                        padding 15px 0
                        margin 0 20px
                        &:last-child
                            border-bottom none
                        .itemName
                            flex 1
                            text-align left 
            .navW
                .list
                    font-size 14px
                    background-color #fff
                    .headerL
                        display flex
                        align-items center
                        padding 10px 0
                        margin 0 10px
                        border-bottom solid 1px #f1f1f1
                        .textH
                            flex 1
                    .headerItem
                        .headerbox
                            display flex
                            align-items center
                            padding 10px 0
                            margin 0 10px
                            border-bottom solid 1px #f1f1f1
                            &:last-child
                                border-bottom none
                            .textN
                                flex 0 0 100px
                            .textT
                                flex 1
        .contentThree
            width 90%
            margin auto
            background #fff
            box-shadow 3px 2px 13px #ccc 
            .ThreeBox
                .headerT
                    display flex
                    justify-content center
                    align-items center
                    margin-top 10px
                    padding 20px 0 10px 0
                    .headerL
                        width 60px
                        height 1px
                        border-top solid 1px rgba(51,51,51,1)
                        border-bottom solid 1px rgba(51,51,51,1)
                    .headerN
                        font-size 16px
                        padding 0 5px
                        font-weight 400
                .Boxtext
                    display flex
                    align-items center
                    padding 0 20px 20px 20px
                    .Ttime
                        text-align left
                        flex 1
                        font-size 12px
                        color #666666
                        .timeN
                            font-size 14px
                            font-weight bold
                            color #000
                            padding-bottom 5px
                    .Tlook
                        background-image url('../../assets/img/anniu.png')
                        background-repeat no-repeat
                        background-size 100%
                        width 60px
                        height 60px
                        line-height 60px
                        color #fff
        .contentFour
            width 90%
            margin auto
            background #fff
            box-shadow 3px 2px 13px #ccc 
            .ThreeBox
                .headerT
                    display flex
                    justify-content center
                    align-items center
                    margin-top 10px
                    padding 20px 0 10px 0
                    .headerL
                        width 60px
                        height 1px
                        border-top solid 1px rgba(51,51,51,1)
                        border-bottom solid 1px rgba(51,51,51,1)
                    .headerN
                        font-size 16px
                        padding 0 5px
                        font-weight 400
                .tips
                    font-size 12px
                    color #999
                    text-align center
                .Boxtext
                    padding 0 20px 0px 20px
                    .textItem
                        font-size 14px
                        border-bottom solid 1px #f1f1f1
                        padding 10px 0
                        &:last-child
                            border-bottom none
                        .itemName
                            display flex
                            align-items center
                            padding-bottom 10px
                            .nameN
                                flex 1
                                text-align left 
                        .itemTime
                            text-align right
        .contentFiver
            width 90%
            margin auto
            background #fff
            box-shadow 3px 2px 13px #ccc 
            .FivereBox
                .headerT
                    display flex
                    justify-content center
                    align-items center
                    margin-top 10px
                    padding 20px 0 10px 0
                    .headerL
                        width 60px
                        height 1px
                        border-top solid 1px rgba(51,51,51,1)
                        border-bottom solid 1px rgba(51,51,51,1)
                    .headerN
                        font-size 16px
                        padding 0 5px
                        font-weight 400
                .contenText
                    .textT
                        text-align left 
                        font-size 14px
                        padding 0 20px 20px 20px
</style>    
