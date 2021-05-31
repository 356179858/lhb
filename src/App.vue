<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
    created() {
      //全局监听，页面刷新的时候将store里state的值存到sessionStorage中，然后从sessionStorage中获取，再赋值给store。然后再把session里面存的删除即可，相当于中间件的作用。
      //在页面加载时读取sessionStorage里的状态信息
      if (sessionStorage.getItem("store")) {
        this.$store.replaceState(
          Object.assign({},
            this.$store.state,
            JSON.parse(sessionStorage.getItem("store"))
          )
        );
        sessionStorage.removeItem("store")
      }

      //在页面刷新时将vuex里的信息保存到sessionStorage里
      window.addEventListener("pagehide", () => {
        sessionStorage.setItem("store", JSON.stringify(this.$store.state));
      });
    }
  }
</script>

<style>
  /*每个页面公共css */
  @import '../static/css/common.css';
  @import '../static/css/font.css';
  @import '../static/css/mui.css';
  @import '../static/css/rank.css';
</style>
