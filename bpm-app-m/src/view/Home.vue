<template>
  <div>
    <mt-header title="首页">
     <mt-button  slot="left">您好,{{user}}！</mt-button>  
      <mt-button icon slot="right" @click="hide=true">退出</mt-button>
    </mt-header>

   
    <!-- 退出提示弹框 -->
    <div v-show="hide" class="foot">
      <div class="frame">
        <div class="top">
          <p>退出后需要重新登录，并且收不到审批消息！</p>
        </div>
        <div class="buttom">
          <button class="btn1" @click="hide=false">取消</button>
          <button class="btn2" @click="logout">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Badge } from 'mint-ui';
Vue.component(Badge.name, Badge);
export default {
  created() { 
    this.user=sessionStorage.getItem('userName')||''
    console.log(this.wx)
    var that = this;
    var accessToken = this.$route.query.accessToken;
    var wxOpenId = this.$route.query.wxOpenId;
    if (accessToken && wxOpenId) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("wxOpenId", wxOpenId);
     	Vue.baseService.post(Vue.__ctx +"/wx/api/getMember/"+wxOpenId).then(e=>{
						localStorage.setItem("wxuser",JSON.stringify(e.data));
					 	// that.user=e.data;
				});
    } else {
      var wxuser = localStorage.getItem("wxuser");
      if (wxuser && wxuser != "undefined") {
        // this.user = JSON.parse(wxuser);
      }
    }

    Vue.baseService.get(Vue.__ctx +"/org/userResource/userMsg").then(result=>{
			 if(result.code=='200'&&result.isOk){
         const user=result.data.user.fullname; 
         this.user=user;
         sessionStorage.setItem('userName',user)
       }

    });
    Vue.baseService.post(Vue.__ctx +"/bpm/my/todoTaskList?supportMobile$V=true").then(e=>{
      this.cont=e.total;
    });

  },
  methods: {
    onItemClick() {
      console.log("on item click");
    },
    logout() {
    	let wxOpenId=  localStorage.getItem("wxOpenId");

      var obj={client_id:"webApp",client_secret:"1",grant_type:"password"};
      var get = Vue.baseService.get("/wx/api/loginOut/"+wxOpenId);
      var getremove = Vue.baseService.post(Vue.__ctx+"/oauth/clear/token",obj);

      localStorage.removeItem("accessToken");
	  	localStorage.removeItem("refresh_token");
      this.$router.push("/");
    }
  },
  name: "Home",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      hide: false,
      cont:"0",
      user:''
    };
  }
};
</script>

<style scoped>
.span {
  font-size: 1rem;
}
.img {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 1rem;
}
.totd a {
  display: block;
  color: #313131;
  width: 98%;
  margin: 0 5px;
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  height: 70px;
}
.totd a img {
  width: 1.8125rem /* 58/16 */;
  height: 1.8125rem;
  margin-top: 1rem;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
}
.totd a span {
  vertical-align: middle;
  display: inline-block;
  margin-top: -1rem;
}
/* .weui-grid {
  width: 100%;
} */
.mint-header {
  height: 46px;
}
/* #app .vux-header-title {
  font-size: 32px !important;
}
#app .vux-header h1.vux-header-title {
  font-family: "PingFang SC";
  font-size: 32px !important;
} */
.weui-cells__title {
  color: #067ffb;
}
.vux-header {
  background-color: #4566E1;;
}
.fa-2x {
  color: #09bb07;
}

.grid-center {
  display: block;
  text-align: center;
  color: #666;
}
.weui-grids {
  background-color: #fff;
}
.foot {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: rgba(0,0,0,0.3);
}
.frame {
  position: fixed;
  width: 60%;
  height: 8rem;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.top {
  text-align: center;
  width: 100%;
  height: 5rem;
  padding-top: 1px;
  padding: 1px 10px 0;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
}
.top p {
  margin-top: 0.5rem;
}
.buttom {
  width: 100%;
  height: 3rem;
}
.buttom button{
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
}
.btn1 {
  width: 48%;
  height: 100%;
  background-color: #fff;
}
.buttom .btn2 {
  width: 49%;
  height: 100%;
  background-color: #fff;
  border-left: 1px solid #ccc;
}
</style>
