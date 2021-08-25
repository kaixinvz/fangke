<template>
  <div>
    <mt-header title="主页">
      <mt-button
        icon
        style="margin-top: 2px; display: inline-block"
      ></mt-button>
      <mt-button icon slot="right" @click="userInfoState = !userInfoState"
        >个人信息</mt-button
      >
      <!-- <mt-button icon slot="right" @click="hide=true">退出</mt-button> -->
    </mt-header>
    <!-- <van-notice-bar text="通知内容 消息通知展示啊...11111111111111111111111111111111111111 .啊" left-icon="volume-o" /> -->
    <div id="top">
      <div v-if="userInfoState" class="userIfno">
        <router-link slot="left" to="/aq/PasswordChange">
          <p>修改密码</p>
        </router-link>
        <p @click="quit_login()">退出登录</p>
      </div>
      <div
        style="
          width: 100%;
          height: 2rem;
          line-height: 2rem;
          text-align: center;
          font-size: 12px;
        "
      >
        <span style="margin-left: 18px"> 您好,{{ user.fullname }}！ </span>
      </div>
    </div>

    <div id="middle">
      <ul>
        <li style="position: relave" @click="toIndex">
            <ui-icon :style="iconStyle" icon="Hidden-perils" /><br />
            <span class="span"> 访客系统 </span>
        </li>

      </ul>
    </div>
    <div id="buttom"></div>

    <!-- 退出提示弹框 -->
    <div v-show="hide" class="foot">
      <div class="frame">
        <div class="top">
          <p>退出后需要重新登录，并且收不到审批消息！</p>
        </div>
        <div class="buttom">
          <button class="btn1" @click="hide = false">取消</button>
          <button class="btn2" @click="logout">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Badge } from "mint-ui";
import apiClound from "@/apiclound";
Vue.component(Badge.name, Badge);
export default {
  created() {
    debugger;
    const passwords = localStorage.getItem("passwords");
    // if (passwords && passwords.length < 8) {
    //   this.$router.push("/aq/PasswordChange");
    // }
    this.user = sessionStorage.getItem("fullname") || "";
    var that = this;
    var accessToken = this.$route.query.accessToken;
    var wxOpenId = this.$route.query.wxOpenId;
    localStorage.setItem("wxOpenId", wxOpenId);
    console.log(accessToken, wxOpenId);
    if (accessToken && wxOpenId) {
      localStorage.setItem("accessToken", accessToken);
      // Vue.baseService.post(Vue.__ctx +"/wx/api/getMember/"+wxOpenId).then(e=>{
      // 			localStorage.setItem("wxuser",JSON.stringify(e.data));
      // 		 	// that.user=e.data;
      // 	});
    } else {
      // var wxuser = localStorage.getItem("wxuser");
      // if (wxuser && wxuser != "undefined") {
      //   // this.user = JSON.parse(wxuser);
      // }
    }
    //if(localStorage.getItem("userName")==null){
    Vue.baseService
      .post(Vue.__ctx + "/org/userResource/getUserMsg", {})
      .then(function (res) {
        console.log(res);
        that.user = {
          fullname: res.data.user.fullname + "欢迎使用东华APP",
        };
        if (res.code == 200) {
          localStorage.setItem("userName", res.data.user.fullname);
          localStorage.setItem("userID", res.data.user.userId);
        }
      });
    // }
    // Vue.baseService.get(Vue.__ctx + "/org/userResource/userMsg").then(result => {
    //   if (result.code == '200' && result.isOk) {
    //     const user = result.data.user;
    //     const {
    //       jobCode,
    //       jobName,
    //       sex
    //     } = user;
    //     // 派发 当前组织
    //     const orgRole = JSON.parse(JSON.stringify(result.data.orgRole || []))

    //     localStorage.setItem('isMSS', false)
    //     orgRole.forEach(item => {
    //       if (item.roleName === '安全部') {
    //         localStorage.setItem('isMSS', true)
    //       }
    //     });
    //     this.organization = orgRole;
    //     this.$store.commit('Get_organization', orgRole)
    //     this.$store.commit('GET_OrgJob', result.data.orgJob);
    //     this.$store.commit('SET_UserGs', result.data.userGw);
    //     sessionStorage.setItem('sex', sex)

    //     this.user = user;
    //     localStorage.setItem('userID', user.userId);
    //     if (jobCode && jobName) {
    //       const type = result.data.orgJob.type;
    //       const groupId = result.data.orgJob.org_group_id;

    //       localStorage.setItem('userJob', JSON.stringify({
    //         jobCode,
    //         jobName,
    //         type,
    //         groupId
    //       }));
    //     }

    //     sessionStorage.setItem('userName', user.fullname);
    //     sessionStorage.setItem('usergroupId', result.data.currentOrg && result.data.currentOrg.groupId);

    //   } else {
    //     this.user = {
    //       fullname: "欢迎使用东华APP"
    //     }

    //   }

    // }).then(function (data) {

    //   if (data.isOk === false) {
    //     return;
    //   }
    //   that.cont = data.total;
    // });
    // Vue.baseService.post(Vue.__ctx + "/bpm/my/todoTaskList?supportMobile$V=true").then(e => {
    //   that.contDB = e.total;
    // });
  },
  methods: {
    onItemClick() {
      console.log("on item click");
    },
    toIndex(){
      this.$router.push("/visitor");
      
    },
    logout() {
      // let wxOpenId = localStorage.getItem("wxOpenId");
      // localStorage.removeItem("userInfo");
      // localStorage.removeItem("userID");
      // localStorage.removeItem("userName");

      var obj = {
        client_id: "webApp",
        client_secret: "1",
        grant_type: "password",
      };
      debugger;
      //  var get = Vue.baseService.get("/wx/api/loginOut/" + wxOpenId);
      var getremove = Vue.baseService.post(
        Vue.__ctx + "/oauth/clear/token",
        obj
      );
      // console.log("getremove  "+localStorage);
      // localStorage.removeItem("accessToken");
      // localStorage.removeItem("refresh_token");
      //  console.log("remove "+localStorage);
      // //设置 组织状态 为  null
      // this.$store.commit("Get_organization", null);
      localStorage.clear();
      //  console.log("clear :"+localStorage);
      this.$router.push("/");
    },
    quit_login() {
      localStorage.clear();
      this.$router.push("/");
    },
  },
  name: "Home",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      hide: false,
      cont: "0",
      contDB: "0",
      user: {},
      organization: null,
      integralState: false,
      userInfoState: false,
    };
  },
  computed: {
    iconStyle() {
      const style = "width:40px;height: 40px;";
      return style;
    },
  },
};
</script>

<style scoped>
.dbsxcss {
  width: 1rem;
  height: 1rem;
  border-radius: 100%;
  background: red;
  line-height: 1.1rem;
  position: absolute;
  left: 54%;
  top: 0px;
  color: white;
  font-size: 10px;
}

ul {
  list-style: none;
  margin: 1rem;
}

li {
  float: left;
  margin-top: 1rem;
  text-align: center;
  width: 45%;
}

.span {
  font-size: 17px;
}

.img {
  width: 2rem;
  height: 2rem;
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

.mint-header {
  height: 46px;
}

.weui-cells__title {
  color: #067ffb;
}

.vux-header {
  background-color: #31abff;
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
  background-color: rgba(0, 0, 0, 0.3);
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

.buttom button {
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

.integral {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

.integral .integral_auto {
  width: 80%;
  height: 160px;
  background: white;
  position: absolute;
  left: 10%;
  top: 20%;
}

.integral .integral_auto .integral_auto_title {
  width: 100%;
  height: 30px;
  border-bottom: 1px solid #f3f3f3;
  text-align: right;
  padding-right: 12px;
}

.integral .integral_auto .integral_auto_Content {
  width: 100%;
  height: 120px;

  font-size: 16px;
}

.integral .integral_auto .integral_auto_Content p {
  line-height: 50px;
  padding-left: 22px;
}

.integral .integral_auto .integral_auto_Content p span {
  display: inline-block;
  padding-left: 6px;
}

#middle a {
  color: black;
}

#middle ul li {
  position: relative;
}

#middle ul li .pcWz {
  width: 1rem;
  height: 1rem;
  border-radius: 100%;
  background: red;
  text-align: center;
  line-height: 1.1rem;
  position: absolute;
  top: 0px;
  left: 58%;
  color: white;
  font-size: 10px;
}
#top .userIfno {
  width: 93px;
  height: 82px;
  position: fixed;
  top: 46px;
  background: white;
  z-index: 1;
  right: 0;
  box-shadow: 1px 3px 4px #888888;
  text-align: center;
}
#top .userIfno p {
  line-height: 40px;
  border-bottom: 1px solid #888888;
  color: black;
}
</style>
