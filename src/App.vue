<template>
  <div id="app">
    <!-- <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>
<style>
html,body{
    margin: 0;
    padding: 0;
    width: 100%;
    background-color: #fff
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.scrollFixed{
    position:fixed;
    width: 100%;
}
.van-dialog__message{
    padding: 40px 0 !important
}
.van-dialog__confirm{
    background:linear-gradient(269deg,rgba(30,219,142,1),rgba(0,168,255,1));
    color: #fff !important;
}
.van-dialog__cancel{
    background:#F6F6F6;
}
</style>
