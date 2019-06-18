import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        Tabstate: false,
        nick: localStorage.getItem("LZnick") || null,
        avatar: localStorage.getItem("LZavatar") || null,
        flag: localStorage.getItem("LZflag") || ''
    },
    mutations: {
        setTabstate(state, val) {
            state.Tabstate = val     
        },
        setNick(state, val) {
            localStorage.setItem("LZnick", val)
            state.nick = val     
        },
        setAvatar(state, val) {
            localStorage.setItem("LZavatar", val)
            state.avatar = val     
        },
        setFlag(state, val) {
            localStorage.setItem("LZflag", val)
            state.flag = val     
        },
    },
    actions: {
        setTabstate(state, val) {
            state.Tabstate = val     
        },
        setNick(state, val) {
            state.nick = val     
        },
        setAvatar(state, val) {
            localStorage.setItem("LZavatar", val)
            state.avatar = val     
        },
        setFlag(state, val) {
            localStorage.setItem("LZflag", val)
            state.flag = val     
        },
    }
})
