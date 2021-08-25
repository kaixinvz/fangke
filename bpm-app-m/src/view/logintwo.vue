<template>
  <div id="login">
    <div class="header">
      <div class="header_background">
        <img src="@/assets/img/loginTop.png" alt="" />
      </div>
      <div class="login_img">
        <img src="@/assets/img/Logins.png" alt="" />
      </div>
    </div>
    <div class="main">
      <div class="user">
        <ui-icon icon="account" />
        <input
          type="text"
          v-model="user.username"
          placeholder="请输入您的用户名"
        />
      </div>
      <div class="user">
        <ui-icon icon="password" />
        <input
          type="password"
          v-model="user.password"
          placeholder="请输入您的密码"
        />
      </div>
      <div class="IpConfig">
        <span>线路:</span>
        <Select v-model="model1" style="width: 65px" @on-change="setIp">
          <Option
            v-for="item in cityList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </div>
      <div class="userBut">
        <mt-button :disabled="loginState" @click="ok" type="primary"
          >登录
        </mt-button>
      </div>
      <div class="resetPassword">
        <!-- <el-button round @click="dialogVisible = true">重置密码</el-button> -->
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose"
      >
        <el-input v-model="input" placeholder="请输入本人身份证号"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="reset()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import apiClound from "@/apiclound";
import { Toast, Indicator } from "mint-ui"; //弹窗 和 加载中
import { mapState } from "vuex";
import axios from "axios";
export default {
  data: function () {
    return {
      user: {
        /* username:"15533153814",
        password: "syq123456", */
        username: "",
        password: "",
        wxbangd: false,
      },
      //所要修改的用户名或者账号
      input: "",
      dialogVisible: false,
      loginState: false,
      appCid: "",
      cityList: [
        {
          value: "60.2.116.2",
          label: "联通",
        },
        {
          value: "111.11.116.46",
          label: "移动",
        },
        {
          value: "27.191.146.122",
          label: "电信",
        },
      ],
      model1: "60.2.116.2",
      visitorDoor:'',
    };
  },
  created() {
    if (localStorage.getItem("userInfo")) {
      if (this.isApiClound) {
        //获取个推 cid
        setTimeout(() => {
          apiClound(
            {
              type: "pushGeTui",
              isApi: "initialize",
              parramsStatus: false,
            },
            (ret) => {
              var value = "";

              switch (ret.type) {
                case "cid":
                  value = "cid:" + ret.cid;
                  this.appCid = ret.cid;
                  break;
                case "payload":
                  value = "payload:" + ret.payload;
                  break;
                case "occurError":
                  value = "occurError";
                  break;
                case "onNotificationMessageClicked":
                  this.messageClicked(ret);
                  break;
                case "onNotificationMessageArrived":
                  if (ret.content.indexOf("抄送") == -1) {
                    this.$store.commit("addBacklog", ret);
                  }
                  value =
                    "onNotificationMessageArrived" +
                    ret.onNotificationMessageArrived;
                  break;
              }
            }
          );
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          this.user.username = userInfo.user;
          this.user.password = userInfo.password;
          setTimeout(() => {
            this.ok();
          }, 600);
        }, 300);
      } else {
        var wxOpenId =
          this.$route.query.wxOpenId || localStorage.getItem("wxOpenId");
        if (wxOpenId) {
          localStorage.setItem("wxOpenId", wxOpenId);
          Vue.baseService.get("/wx/api/getMember/" + wxOpenId).then((e) => {
            localStorage.setItem("wxuser", JSON.stringify(e.data));
            // this.user = e.data;
          });
        } else {
          var wxuser = localStorage.getItem("wxuser");
          if (wxuser && wxuser != "undefined") {
            this.user = JSON.parse(wxuser);
          }
        }
      }
    } else {
    }
  },
  computed: mapState(["isApiClound"]),
  methods: {
    ok() {
      if (!this.user.username || !this.user.password) {
        //   Vue.tools.toast("请完善登录信息！", "warn");
        let instance = Toast("请完善登录信息！");
        setTimeout(() => {
          instance.close();
        }, 2000);
        return;
      }
      this.loginState = true;
      const userInfo = {
        user: this.user.username,
        password: this.user.password,
      };
      console.log(userInfo);
      Indicator.open();

      if (this.isApiClound) {
        this.user.deviceId = this.appCid;
      } else {
        if (this.user && localStorage.getItem("wxOpenId") != undefined) {
          this.user.wxOpenId = localStorage.getItem("wxOpenId");
        }
      }
      // this.user.deviceId = this.appCid;
      //  this.user.deviceId=localStorage.getItem("deviceId");
      this.user.client_id = "webApp";
      this.user.client_secret = "1";
      this.user.grant_type = "password";
      var vm = this;
      console.log(vm.user);
      Vue.baseService.postForm(Vue.__ctx + "/oauth/token", this.user).then(
        //成功回调
        function (e) {
          console.log(e);
          Indicator.close();
          vm.loginState = false;
          const passwords = vm.user.password;
          console.log(passwords, passwords.length);
          if (passwords.length < 8) {
            localStorage.setItem("passwords", passwords);
          }
          // if(vm.isApiClound){
          //    localStorage.setItem("userInfo",JSON.stringify(userInfo));
          // }
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          localStorage.setItem("accessToken", e.value);
          localStorage.setItem("refresh_token", e.refreshToken.value);

          //           史占东  13012171177  访客受访者角色
          // 蒋仓  13933326654   访客厂部长角色
          // 吕树章  15232697477  访客保卫部长角色
          // 石永刚  18132379999  访客保卫角色

          vm.show = false;
          Vue.baseService
            .post(Vue.__ctx + "/org/userResource/getUserMsg", {})
            .then(function (res) {
              console.log(res);
              if (res.code == 200) {
                localStorage.setItem("userName", res.data.user.fullname);
                localStorage.setItem("userID", res.data.user.userId);
              }
              vm.visitorDoor = res.data.user.address
              console.log(vm.visitorDoor)
              localStorage.setItem("address", vm.visitorDoor);
            });

          if (passwords == "1") {
            Vue.tools.toast("密码过于简单请修改密码", "success");
            //跳转到修改密码界面修改密码
            vm.$router.push("/aq/PasswordChange");
            return
          } 
            Vue.baseService
              .post(Vue.__ctx + "/org/userResource/userMsg", {})
              .then(function (res1) {
                console.log(res1);
                if (res1.code == 200) {
                  localStorage.setItem(
                    "orgRole",
                    JSON.stringify(res1.data.orgRole)
                  );
                  let roles = JSON.parse(localStorage.getItem("orgRole"));
                  if (roles.length == 0) {
                    Vue.tools.toast("请使用正确角色登录");
                    return;
                  }
                  if (roles[0].roleName.substring(0, 2) == "访客") {
                    sessionStorage.setItem("integral", true);
                    Vue.tools.toast("身份认证成功！", "success");
                    vm.$router.push("/aq/main");
                  } else {
                    Vue.tools.toast("请使用正确角色登录");
                    return;
                  }
                } else {
                  Vue.tools.alert(res1.msg);
                  localStorage.setItem("roleId", "");
                }
              });
          
        },
        //失败回调
        function (e) {
          console.log(e);
          Indicator.close();
          vm.loginState = false;
          Vue.tools.alert("登录失败");
        }
      );
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.input = "";
          done();
        })
        .catch((_) => {});
    },
    //获取该账户或者用户名的密码并且重置为1
    reset() {
      console.log(this.input);
      //此处要写与后端交互代码，传值this.input，和默认密码
      //this.$router.push("/aq/PasswordChange");
    },
    setIp() {
      //正常开发环境 不需要在这里切换三网通  在状态里面修改默认值即可
      const ip = `http://${this.model1}:8082/`;
      Vue.baseService.setBaseUrl(ip);
      this.$store.commit("SET_Ip", ip);
    },
  },
};
</script>
<style lang="less" scoped>
#login {
  background: #ffffff;

  .header {
    //  height: 446px;
    .header_background {
      img {
        width: 100%;
        height: 100%;
        margin: 0 auto;
      }
    }
    .login_img {
      text-align: center;

      img {
        width: 168px;
        height: 168px;
      }
    }
  }

  .main {
    width: 75%;
    /* height: 390px; */
    margin: 0 auto;

    .user {
      width: 100%;
      height: 39px;
      border-bottom: 1px solid #acacac;

      input {
        border: 0px;
        line-height: 2;
        font-size: inherit;
        outline: none;
      }

      &:nth-child(1) {
        margin-bottom: 20px;
      }
    }
    .IpConfig {
      text-align: right;
      margin-top: 12px;
    }
    .userBut {
      margin-top: 60px;

      button {
        width: 100%;
        border-radius: 20px;
        background: #4566ff;
      }
    }
    .resetPassword {
      margin-top: 40px;
      button {
        width: 100%;
        border-radius: 20px;
      }
    }
  }
}
</style>
