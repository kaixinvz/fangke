<template>
  <div id="PasswordChange">
    <mt-header title="密码修改">
      <!-- <router-link to="/aq/main" slot="left">
        <ui-icon icon="left" />
      </router-link> -->
      <div @click="back" slot="left">
        <ui-icon icon="left"  />
      </div>
      
       <mt-button icon slot="right" @click="hide = true">退出</mt-button>
    </mt-header>
    <div class="main">
      <van-cell-group>
        <van-field v-model="orgPassword" type="password" :error="originalState" required :error-message="originalText"
          label="原密码" placeholder="请输入原密码" />
        <van-field v-model="password" type="password" :error="currentState" required :error-message="currentText"
          label="新密码" placeholder="请输入新密码" />
        <van-field v-model="passwordTwo" type="password" :error="confirmState" required :error-message="confirmText"
          label="确认新密码" placeholder="请输入新密码" />
      </van-cell-group>
      <van-button type="primary" class="submits" @click="submit">确认修改</van-button>
    </div>

    <div v-show="hide" class="foot">
        <div class="frame">
          <div class="top">
            <p>退出后需要重新登录，并且收不到考勤消息！</p>
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
  import Vue from 'vue'
  import {
    Field,
    Button,
    Toast
  } from 'vant';

  Vue.use(Field);
  Vue.use(Button);
  Vue.use(Toast);
  export default {
    data() {
      return {
        orgPassword: '',
        password: '',
        passwordTwo: '',
        originalState: false,
        originalText: '',
        currentState: false,
        currentText: '',
        confirmState: false,
        confirmText: '',
        reg:null,
         hide: false,
      }
    },
    mounted() {
        this.getLIst();
    },
    methods: {
      logout() {
        
        var obj = {
          client_id: "webApp",
          client_secret: "1",
          grant_type: "password",
        };
        var getremove = Vue.baseService.post(
          Vue.__ctx + "/oauth/clear/token",
          obj
        );
          localStorage.clear();
    
   /*     let wxOpenId = localStorage.getItem("wxOpenId");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("roleId");
         localStorage.removeItem("userID");
        localStorage.removeItem("userName");
    
        //var get = Vue.baseService.get("/wx/api/loginOut/" + wxOpenId);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refresh_token");
        //设置 组织状态 为  null
        this.$store.commit("Get_organization", null);*/
        this.$router.push("/");
      },
      back(){
        console.log(localStorage.getItem("passwords"))
        if(localStorage.getItem("passwords") != undefined && localStorage.getItem("passwords") == '1'){
          localStorage.clear();
          this.$router.push("/");
        }else{
          this.$router.push("/aq/main");
        }
      },
      submit() {
        const {
          orgPassword,
          password,
          passwordTwo,
          reg
        } = this;
        let passwordLengthState;
        const patrn =eval(`/${reg.key}/`) ;
        if (!orgPassword.length) {
          this.originalState = true;
          this.originalText = '密码不能为空';
          passwordLengthState = true;
        } else {
          this.originalState = false;
          this.originalText = '';
        }
        if (!password.length) {
          this.currentState = true;
          this.currentText = '密码不能为空';
          passwordLengthState = true;
        } else {
          this.currentState = false;
          this.currentText = '';
        }
        if (!passwordTwo.length) {
          this.confirmState = true;
          this.confirmText = '密码不能为空';
          passwordLengthState = true;
        } else {
          this.confirmState = false;
          this.confirmText = '';
        }
        if (passwordLengthState) {
          return;
        }
        if (password != passwordTwo) {
          this.confirmState = true;
          this.confirmText = '两次密码不一致';
          this.currentState = true;
          this.currentText = '两次密码不一致';
          return
        } else if (!patrn.exec(password)) {
          this.confirmState = true;
          this.confirmText = reg.name;
          this.currentState = true;
          this.currentText = reg.name;
          return
        } else {
          this.confirmState = false;
          this.currentState = false;
          this.confirmText = '';
          this.currentText = '';
        }

        const url = Vue.__ctx + "/org/user/updateUserPassWorld";
        const param = {
          oldPassword: orgPassword,
          newPassword: password,
          newPassword1: passwordTwo,
          id: localStorage.getItem('userID')
        };
        Vue.baseService.postForm(url, param).then(result => {
          const {
            code,
            isOk,
            msg
          } = result;
          if (code === '200' && isOk) {
              Toast.success(msg);
              localStorage.removeItem('passwords')
              this.$router.push('/aq/main')
          } else if (code === '500' && !isOk&&msg=='旧密码输入错误') {
            this.originalState = true;
            this.originalText = '旧密码输入错误';
            Toast.fail(msg);
          } else {
            Toast.fail(msg);
          }
        })
        Vue.baseService
              .post(Vue.__ctx + "/org/userResource/userMsg", {})
              .then(function (res1) {
                console.log(res1);
                if (res1.code == 200) {
                  localStorage.setItem(
                    "orgRole",
                    JSON.stringify(res1.data.orgRole)
                  );
                }
              });
      },
      getLIst() {
        var url = Vue.__ctx + "/sys/dataDict/getDictData";
        const data = {
          'hasRoot': true,
          'dictKey': 'yddmmxgzz'
        }
        var defer = Vue.baseService.postForm(url, data);
        defer.then(data => {
          if (data.code == '200' && data.isOk) {
             console.log(data)
             this.reg=data.data[1];
          }else{
            console.log('error ============== ')
          }
        })
      }
    }
  }

</script>

<style lang="less" scoped>
  #PasswordChange {
    .main {
      height: calc(100vh - 40px);
      background: white;
      text-align: center;

      .submits {
        width: 200px;
        margin-top: 50px;
      }

      /deep/ .van-cell {
        border-bottom: 1px solid #C0C0C0;
      }
    }

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
</style>
