<template>
  <div v-if="show">  
    <x-dialog v-model="show" style="height:300px;width:350px">
    <mt-header title="登录">
    </mt-header>
    <div class="weui-dialog__hd showContent">
      <strong class="weui-dialog__title">用户身份验证</strong>
    </div>
    <div class="weui-dialog__bd weui-cells weui-cells_form">
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <label class="weui-label">账号</label>
        </div>
        <div class="weui-cell__bd">
          <input
            type="text"
            class="weui-input"
            v-model="user.username"
            v-ab-validate="{'required':true}"
            desc="名字"
          >
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <label class="weui-label">密码</label>
        </div>
        <div class="weui-cell__bd">
          <input
            type="password"
            class="weui-input"
            v-model="user.password"
            v-ab-validate="{'required':true}"
            desc="名字"
          >
        </div>
      </div>
    </div>
    <div class="weui-dialog__ft">
      <a class="weui-dialog__btn weui-dialog__btn_default" v-on:click="ok()">登录</a>
      <a class="weui-dialog__btn weui-dialog__btn_default" v-on:click="cancel()">取消</a>
    </div>
  </x-dialog>
  </div>
  
</template>

<script>
import Vue from "vue";
export default {
  props: [],
  data: function() {
    return {
      user: { username: "", password: "" },
      show: false
    };
  },
  methods: {
    ok: function() {
        if (!this.user.username || !this.user.password) {
        Vue.tools.toast("请完善登录信息！", "warn");
        return;
      }
      if(this.user && localStorage.getItem("wxOpenId") != undefined){
      	this.user.wxOpenId=localStorage.getItem("wxOpenId");
      }
      this.user.deviceId=localStorage.getItem("deviceId");
	  	this.user.client_id='webApp';
	  	this.user.client_secret='1';
	  	this.user.grant_type='password';
	    var vm = this;
       Vue.baseService.postForm(
        Vue.__ctx + "/oauth/token",
        this.user
      ).then(function(e){
      	 	localStorage.setItem("accessToken", e.value);
			   	localStorage.setItem("refresh_token", e.refreshToken.value);
          vm.show = false;
          Vue.tools.toast("身份认证成功！", "success");
          vm.$router.push("/home");
      },function(e){
      		Vue.tools.alert("登录失败");
      });
    },
    cancel: function() {
      this.show = false;
      this.$emit("cancel", this.flowParam);
    }
  },
  created: function() {},
 watch: {
    show(val){
        if(val){
          this.show=false;
           location.hash='#/'; 
         } 
     }
  }
};

function createDialogVM(Vue) {
  if (typeof document === "undefined") {
    console.error("[VUX] Alert plugin cannot be used in ssr.");
    return;
  }
}
</script>
