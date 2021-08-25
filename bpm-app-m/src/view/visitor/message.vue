<template>
  <div>
    <div class="BfrMessage" style="margin-top: 10px">
      <span
        style="font-size: 16px; font-weight: 999; width: 10%; margin-left: 40%"
        >创建访客单</span
      >
      <van-field
        style="margin-left: 10px"
        v-model="visitName"
        label="访客姓名:"
        placeholder="请输访客姓名"
        @input="change"
      />
      <van-field
        v-model="visitDate"
        label="来访日期:"
        placeholder="请选择来访日期"
        @click="showCalendar = true"
        style="margin-left: 10px"
        :value="visitDate"
      />
      <van-calendar v-model="showCalendar" @confirm="onConfirm" />
      <div
        class="visitDays"
        style="
          margin-left: 10px;
          margin-top: 10px;
          margin-bottom: 15px;
          display: flex;
        "
      >
        <span style="font-size: 14px">来访天数：</span>
        <!-- <el-input-number
          v-model="visitDays"
          controls-position="right"
          @change="changeVisitDays"
          :min="1"

        ></el-input-number> -->
        <div class="input-number">
          <div @click="sub" :class="(islight ? 'light' : '') + ' sub'">-</div>
          <div class="num">{{ visitDays }}</div>
          <div class="add" @click="add">+</div>
        </div>
      </div>
      <div
        class="visitMatters"
        style="margin-left: 10px; margin-top: 10px; margin-bottom: 10px"
      >
        <span style="font-size: 14px">来访事项：</span>
        <el-select
          v-model="visitMatters"
          placeholder="请选择访问类别"
          style="margin-left: 10px"
          @change="chooseVisitMatters"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <van-field
        style="margin-left: 10px"
        v-model="visitCarnum"
        label="车号:"
        placeholder="请输入车号"
        @input="change_visitCarnum"
      />
      <div
        class="leader"
        v-if="show_leader"
        style="margin-left: 10px; margin-top: 10px; margin-bottom: 10px"
      >
        <span style="font-size: 14px">主管领导：</span>
        <el-select
          v-model="leaderId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入主管领导"
          :remote-method="remoteMethod"
          @change="chooseLeader"
          @focus="showAllName"
          clearable
        >
          <el-option
            v-for="item in options_leader"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="btn">
      <el-row :gutter="20">
        <el-col
          :span="12"
          :offset="6"
          style="margin-top: 10px; margin-bottom: 10px"
        >
          <el-button type="primary" @click="submit()">提交</el-button>
          <el-button type="default" style="float: right" @click="back"
            >返回</el-button
          >
        </el-col>
      </el-row>
    </div>
    <van-popup v-model="show_pop">
      <van-image width="200" height="200" :src="imgUrl" />
      <van-button
        type="info"
        @click="createQrCode"
        style="width: 60%; margin-left: 20%"
        >生成二维码</van-button
      >
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";
import Qs from "qs";
// import utils from "@/assets/api/common";
// import qs from "qs";
Vue.use(Toast);
export default {
  data() {
    return {
      id: "",
      visitName: "",
      visitDays: 1,
      //显示来访日期插件
      showCalendar: false,
      //来访日期
      visitDate: "",
      //来访类别
      showVisitMatters: false,
      visitMatters: "",
      visitCarnum: "",
      visitPhoneError: "",
      islight: "",
      options: [
        {
          value: "0",
          label: "普通访问",
        },
        {
          value: "1",
          label: "驾车访问",
        },
        {
          value: "2",
          label: "送货",
        },
        {
          value: "3",
          label: "高层访问",
        },
      ],
      //0 普通访问 1驾车访问 2 送货 3高层访问
      options_leader: [],
      leaderId: "",
      show_pop: false,
      imgUrl: "",
      ids: "",
      Id: "",
      show_leader:false,
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.visitDate =
      new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate();
  },
  methods: {
    changeDate(value) {
      console.log(value);
    },
    change(name) {
      console.log(name);
    },
    showAllName() {
      this.remoteMethod();
    },
    //获取主管领导
    remoteMethod(value, query) {
      this.leaderId = "";
      this.options_leader = [];
      let obj = {
        offset: 0,
        limit: 100,
        fullname_$VLK: value,
      };
      let that = this;
      var url =
        Vue.__ctx +"/org/orgRelation/roleJson?roleId=425726845984178177";
      var post = Vue.baseService.postForm(url, obj);
      post.then(function (e) {
        for (var i = 0; i < e.rows.length; i++) {
          let nameAndCode = {
            value: e.rows[i].userId,
            label: e.rows[i].userName,
          };
          that.options_leader.push(nameAndCode);
        }
      });
    },
    changeVisitDays(value) {
      console.log(value);
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(date) {
      this.showCalendar = false;
      this.visitDate = this.formatDate(date);
      console.log(this.date);
    },
    chooseVisitMatters(value) {
      console.log(value);
      if(value == 1){
        this.show_leader = true
      }else{
        this.show_leader = false
      }
    },
    change_visitCarnum(num) {
      console.log(num);
    },
    chooseLeader(value) {
      console.log(value);
      this.leaderId = value;
    },
    back() {
      this.$router.push("/visitor");
    },
    submit() {
      //saveVisitorRecord
      let that = this;
      let obj = {};
      if (this.visitName == "") {
        Toast.fail("必须填写来访者姓名");
        return;
      }
      obj.visitName = this.visitName;
      obj.visitDate = this.visitDate;
      let strDays = this.visitDate.split("-");
      if (strDays[1] < 10) {
        obj.visitDate = strDays[0] + "-0" + strDays[1] + "-" + strDays[2];
      }
      if (strDays[2] < 10) {
        obj.visitDate = obj.visitDate.substr(0, 8) + "0" + strDays[2];
      }
      obj.visitDays = this.visitDays;
      obj.visitCarnum = this.visitCarnum;
      obj.visitMatters = this.visitMatters;
      obj.leaderId = this.leaderId;
      console.log(obj);
      var url = Vue.__ctx + "/visitor/visitorRecord/save";
      var post = Vue.baseService.post(url, obj);
      post.then(function (e) {
        debugger;
        if (e.isOk) {
          that.Id = e.data;
          console.log(e.data);
          that.show_pop = true;
        } else {
          Toast.fail(e.msg);
        }
      });
    },
    // 减少数量
    sub() {
      console.log("-----");
      if (this.visitDays < 2) {
        return;
      }
      this.visitDays--;
      this.islight = this.lightFunc();
    },
    // 增加数量
    add() {
      console.log("+++++");
      this.visitDays++;
      this.islight = this.lightFunc();
    },
    lightFunc() {
      if (this.visitDays < 2) {
        return true;
      } else {
        return false;
      }
    },
    createQrCode() {
      //postFrom_blob
      console.log("createQrCode");
      let that = this;
      let obj = {
        id: this.Id,
      };
      var url = Vue.__ctx + "/visitor/visitorRecord/createQrCode";
      Vue.baseService.postForm_blob(url, obj).then(function (ie) {
        let bytes = new Uint8Array(ie);
        let data = "";
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          data += String.fromCharCode(bytes[i]);
        }

        that.imgUrl = "data:image/png;base64," + window.btoa(data);
        console.log(that.imgUrl);
      });
    },
  },
};
</script>

<style lang="less" scoped>
@fs12: 3.2vw;
@fs20: 5.333vw;
body,
p,
h1,
h2,
h3,
h4,
h5,
h6,
img {
  padding: 0;
  margin: 0;
  border: 0;
}
.input-number {
  color: black;
  font-size: @fs20;

  width: 30%;
  height: 1.375rem;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  position: relative;
  top: 50%;
  display: flex;
  justify-content: space-between;
  .sub,
  .add,
  .num {
    height: 100%;
    line-height: 1.25rem;
    text-align: center;
    font-size: @fs12;
  }
  .sub,
  .add {
    transform: scale(1.5, 1.5) translateY(-0.3vw);
  }
  .num {
    border-left: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
    padding: 0 0.6rem;
    font-weight: 700;
  }

  .light {
    color: #e5e5e5;
  }
}
</style>
