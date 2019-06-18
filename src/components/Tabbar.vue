<template>
    <div class="Tabbar">
        <van-tabbar v-model="active">
            <van-tabbar-item v-for="(item,index) in icon" :key="index" @click="Router(item.url)">
                    <img
                        slot="icon"
                        slot-scope="props"
                        :src="props.active?item.active : item.normal"
                    >
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import { Tabbar,TabbarItem } from 'vant'
export default {
    name: 'Tabbar',
    components:{
        [Tabbar .name]: Tabbar,
        [TabbarItem .name]: TabbarItem 
    },
    data() {
        return {
            active: 3,
            icon: [
                {
                    normal: require('../assets/img/Tr_iocA_h.png'),
                    active: require('../assets/img/Tr_iocA.png'),
                    url: '/Transaction'
                },
                {
                    normal: require('../assets/img/Le_iocA_h.png'),
                    active: require('../assets/img/Le_iocA.png'),
                    url: '/Ranking'
                },
                {
                    normal: require('../assets/img/Tz_ioc_A_h.png'),
                    active: require('../assets/img/Tz_ioc_A.png'),
                    url: '/Square'
                },
                {
                    normal: require('../assets/img/Ac_ioc_A_h.png'),
                    active: require('../assets/img/Ac_ioc_A.png'),
                    url: '/Account'
                },
                {
                    normal: require('../assets/img/Pc_ioc_A_h.png'),
                    active: require('../assets/img/Pc_ioc_A.png'),
                    url: '/Personal'
                }
            ]
        }
    },
    mounted() {
        if (this.$route.path === '/Transaction') {
            this.active = 0
        } else if (this.$route.path === '/Ranking') {
            this.active = 1
        } else if (this.$route.path === '/Square') {
            this.active = 2
        } else if (this.$route.path === '/Account') {
            this.active = 3
        } else if (this.$route.path === '/Personal') {
            this.active = 4
        } else if (this.$route.path === '/Personal/Message') {
            this.active = 4
        } else if (this.$route.path === '/Personal/Posts') {
            this.active = 4
        }
        // if (this.$route.path === '/Transaction') {
        //     this.active = 0
        // } else if (this.$route.path === '/Ranking') {
        //     this.active = 1
        // } else if (this.$route.path === '/Account') {
        //     this.active = 2
        // } else if (this.$route.path === '/Personal') {
        //     this.active = 3
        // } else if (this.$route.path === '/Home') {
        //     this.active = 2
        // }
    },
    methods:{
        Router(url){
            this.$router.push({path: url})
        },
        Cactive () { 
            // if (this.$route.path === '/Transaction') {
            //     this.active = 0
            // } else if (this.$route.path === '/Ranking') {
            //     this.active = 1
            // } else if (this.$route.path === '/Account') {
            //     this.active = 2
            // } else if (this.$route.path === '/Personal') {
            //     this.active = 3
            // } else if (this.$route.path === '/Home') {
            //     this.active = 2
            // }
            if (this.$route.path === '/Transaction') {
                this.active = 0
            } else if (this.$route.path === '/Ranking') {
                this.active = 1
            } else if (this.$route.path === '/Square') {
                this.active = 2
            } else if (this.$route.path === '/Account') {
                this.active = 3
            } else if (this.$route.path === '/Personal') {
                this.active = 4
            } else if (this.$route.path === '/Home') {
                this.active = 2
            } else if(this.$route.path === '/Personal/Message') {
                this.active = 4
            } else if(this.$route.path === '/Personal/Posts') {
                this.active = 4
            }
        },
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        "$route": "Cactive"
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
>>> .van-tabbar--fixed
        .van-tabbar-item
            .van-tabbar-item__icon img
                width 26px
                height 26px
                margin-bottom 0
</style>
