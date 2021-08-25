<template>
  <div id="app">
     <div v-if="isApiClound"  style="width: 100%;height: 25px;background: black;">
     </div>
     <router-view/>
  </div>
</template>

<script>
import {
    mapState
  } from 'vuex';
export default {
  name: 'App',
  data:function(){
	  return {
	  }
  },

  created:function(){
    // alert(11111222221)
  /* 	var post = Vue.baseService.postForm(Vue.__ctx+"/login/valid",{"account":"admin","password":"1"});
	post.then(function(data,a){
		console.log(data.msg)
	}) */
  },
  computed: mapState(["isApiClound"]),
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;

  .mint-toast{
     z-index: 100000 !important;
  }

  .vux-header {
  background-color: #4566E1 !important;
  }
  .mint-header{
    background-color: #4566E1 !important;
  }
  .mint-header a{
    color: white;
  }
  .mint-header a{
     width: 41px;
    height: 38px;

    display: inline-block;
    text-align: center;
    line-height: 38px;
}
}
//长按 复制
// html,body {
//         -webkit-touch-callout:none;
//         -webkit-text-size-adjust:none;
//         -webkit-tap-highlight-color:rgba(0, 0, 0, 0);
//         -webkit-user-select:auto;
//         background-color: #fff;
// }
</style>
