<template>
  <div>
    <div class="BfrMessage" style="margin-top: 10px">
      <van-field
        style="margin-left: 10px"
        v-model="visitName"
        label="访客姓名:"
        readonly
      />
      <van-field
        v-model="visitPhone"
        label="访客电话"
        placeholder="请输入手机号"
        style="margin-left: 10px"
        readonly
      />
      <van-field
        v-model="visitIdentity"
        label="身份证号"
        placeholder="请输入身份证号"
        style="margin-left: 10px"
        readonly
      />
      <van-field
        v-if="showEpidemicNews"
        v-model="permanentAddress"
        label="户籍地址"
        placeholder="请输入户籍地址"
        style="margin-left: 10px"
        rows="1"
        autosize
        type="textarea"
        readonly
      />
      <van-field
        v-if="showEpidemicNews"
        v-model="nowAddress"
        label="现住址"
        placeholder="请输入现住址"
        rows="1"
        autosize
        type="textarea"
        style="margin-left: 10px"
        readonly
      />
      <van-field
        v-if="showEpidemicNews"
        v-model="sex"
        label="性别"
        placeholder="请输入性别"
        style="margin-left: 10px"
        readonly
      />
      <van-field
        v-if="showEpidemicNews"
        v-model="age"
        label="年龄"
        placeholder="请输入年龄"
        style="margin-left: 10px"
        readonly
      />
      <van-field
        v-if="showEpidemicNews"
        v-model="comeDate"
        label="来丰日期"
        placeholder="请输入来丰日期"
        style="margin-left: 10px"
        readonly
      />
      <van-field
        v-if="showEpidemicNews"
        v-model="temp"
        label="体温"
        placeholder="请输入体温"
        style="margin-left: 10px"
        readonly
      />
      <van-field
        v-if="showEpidemicNews"
        v-model="company"
        label="所属企业"
        placeholder="请输入所属企业"
        style="margin-left: 10px"
        readonly
      />
      <van-field
        v-if="showEpidemicNews"
        v-model="hightDangerArea"
        label="是否去过高风险地区"
        placeholder=""
        style="margin-left: 10px"
        readonly
      />
      <van-field
        v-if="showEpidemicNews"
        v-model="localPermanent"
        label="是否为本区户籍"
        placeholder=""
        style="margin-left: 10px"
        readonly
      />
      <child-message
        v-for="(item, index) in messageList"
        :key="index"
        @func="delContent(index)"
        @uploadData="getData"
        :index="index"
        :items="items"
        :radioType="radioType"
      ></child-message>
      <van-field
        v-model="interviewerName"
        label="被访者姓名"
        placeholder="请输入被访者姓名"
        style="margin-left: 10px"
        readonly
      />
      <van-field
        v-model="visitDate"
        label="来访日期:"
        style="margin-left: 10px"
        readonly
      />
      <van-field
        style="margin-left: 10px"
        label="来访天数:"
        v-model="visitDays"
        readonly
      >
      </van-field>
      <van-field
        style="margin-left: 10px"
        label="来访事项:"
        v-model="visitMatters"
        placeholder="请选择访问类别"
        readonly
      >
      </van-field>
      <van-field
        style="margin-left: 10px"
        label="进厂门口:"
        v-model="visitorDoor"
        placeholder="请选择进厂门口"
        readonly
      >
      </van-field>
      <van-field
        v-if="show_visitCarnum"
        style="margin-left: 10px"
        v-model="visitCarnum"
        label="车号:"
        readonly
      />
      <van-field
        v-if="show_leader"
        style="margin-left: 10px"
        v-model="leaderName"
        label="主管领导:"
        readonly
      />
      <!-- <div
        class="leader"
        style="margin-left: 10px; margin-top: 10px; margin-bottom: 10px;"
        v-if="show_leader"
      >
        <span style="font-size: 14px;color:#c8c9cc">主管领导：</span>
        <el-select
          v-model="leaderName"
          filterable
          remote
          reserve-keyword
          placeholder="请输入主管领导"
          :remote-method="remoteMethod"
          @change="chooseLeader"
          @focus="showAllName"
          clearable
          :disabled="leader_disabled"
        >
          <el-option
            v-for="item in options_leader"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div> -->
    </div>
    <div v-if="showFkMessage" class="FkMessage">
      <van-field
        v-model="visitGoods"
        autosize
        label="随身物品"
        type="textarea"
        placeholder="请输入随身物品"
        style="margin-left: 10px"
        readonly
      />

      <van-field
        v-model="visitContent"
        autosize
        label="来访内容"
        type="textarea"
        placeholder="请输入来访内容"
        style="margin-left: 10px"
        @input="acquire_visitContent"
        readonly
      />
    </div>
    <div v-if="showMwList" class="Mw">
      <span
        style="font-size: 16px; font-weight: 999; width: 10%; margin-left: 40%"
        >门卫填写</span
      >
      <van-radio-group
        v-model="radio"
        direction="horizontal"
        style="margin-left: 10px; margin-top: 10px"
        @change="chooseRadio"
        v-if="showMw"
      >
        <van-radio name="1">进厂</van-radio>
        <van-radio name="2">出厂</van-radio>
        <van-radio name="3">扣留</van-radio>
      </van-radio-group>
      <van-field
        v-model="visitInTime"
        label="进厂时间"
        placeholder=""
        style="margin-left: 10px"
        readonly
      />
      <van-field
        v-model="visitOutTime"
        label="出厂时间"
        placeholder=""
        style="margin-left: 10px"
        readonly
      />
      <van-field
        v-if="show_detainReason"
        v-model="detainReason"
        autosize
        label="扣留原因"
        type="textarea"
        placeholder="请输入扣留原因"
        style="margin-left: 10px"
        :disabled="disabled_detainReason"
      />
    </div>
    <div
      class="btn"
      style="
        display: flex;
        justify-content: center;
        align-item: center;
        padding-top: 20px;
        padding-bottom: 20px;
      "
    >
      <div>
        <el-button
          v-if="!submitFlag"
          type="success"
          @click="submit()"
          size="mini"
          >提交</el-button
        >
        <el-button type="default" @click="back" size="mini">返回</el-button>
        <el-button
          v-if="!ownerFlag"
          type="danger"
          @click="delRecord"
          size="mini"
          >删除</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";
import Qs from "qs";
import ChildMessage from "../visitor/childMessage.vue";
// import utils from "@/assets/api/common";
// import qs from "qs";
Vue.use(Toast);
export default {
  data() {
    return {
      id: "",
      url: "",
      showFkMessage: true,
      showMw: false,
      showMwList: false,
      submitFlag: true, //提交是否可用
      ownerFlag: true, //所有者标识
      orgUserId: "", //所有者主键
      visitName: "",
      visitDays: "1",
      //显示来访日期插件
      showCalendar: false,
      //来访日期
      visitDate: "",
      //来访类别
      showVisitMatters: false,
      visitMatters: "",
      //来访状态
      visitState: "",
      //车号
      visitCarnum: "",
      //被访者姓名
      interviewerName: "",
      visitPhoneError: "",
      //随身物品
      visitGoods: "",
      //访客电话
      visitPhone: "",
      //来访内容
      visitContent: "",
      //身份证号
      visitIdentity: "",
      //门卫状态
      radio: "1",
      visitInTime: "",
      visitOutTime: "",
      detainReason: "",
      show_detainReason: false,
      disabled_detainReason: true,
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
      leaderId: "",
      type: 1,
      //主管姓名
      leaderName: "",
      islight: "",
      show_leader: false,
      leader_disabled: true,
      uptDate: "",
      show_visitCarnum: true,
      message: "",
      leaderList: [],
      messageList: [],
      items: [],
      identityString: "",
      nameString: "",
      phoneString: "",
      visitorDoor: "",
      temp: "",
      permanentAddress: "",
      localPermanent: "",
      nowAddress: "",
      company: "",
      hightDangerArea: "",
      age: "",
      sex: "",
      comeDate: "",
      optionsZgfxdq: "",
      showEpidemicNews: "",
      radioType: "0",
    };
  },
  components: {
    ChildMessage,
  },
  created() {
    let message = this.$route.query.message;
    console.log(message);
    localStorage.setItem("message", message);
    var userMessage = JSON.parse(localStorage.getItem("message"));

    let that = this;
    that.orgUserId = userMessage.orgUserId;
    if (userMessage.visitorPersons[0].temp != "") {
      that.showEpidemicNews = true;
      that.radioType = "2";
    } else {
      that.showEpidemicNews = false;
      that.radioType = "0";
    }
    console.log(that.radioType)
    if (userMessage.visitorPersons.length == 1 && that.type == '2') {
      that.visitName = userMessage.visitorPersons[0].visitName;
      that.visitIdentity = userMessage.visitorPersons[0].visitIdentity;
      that.visitPhone = userMessage.visitorPersons[0].visitPhone;
      that.sex = userMessage.visitorPersons[0].sex;
      that.age = userMessage.visitorPersons[0].age;
      that.temp = userMessage.visitorPersons[0].temp;
      that.comeDate = userMessage.visitorPersons[0].comeDate;
      that.company = userMessage.visitorPersons[0].company;
      that.permanentAddress = userMessage.visitorPersons[0].permanentAddress;
      that.nowAddress = userMessage.visitorPersons[0].nowAddress;
      that.localPermanent = userMessage.visitorPersons[0].localPermanent;
      that.hightDangerArea = userMessage.visitorPersons[0].hightDangerArea;
    } else if(userMessage.visitorPersons.length == 1 && that.type == '0'){
      that.visitName = userMessage.visitorPersons[0].visitName;
      that.visitIdentity = userMessage.visitorPersons[0].visitIdentity;
      that.visitPhone = userMessage.visitorPersons[0].visitPhone;
    }else if (userMessage.visitorPersons.length == 0) {
      that.submitFlag = true;
      that.ownerFlag = false;
    } else {
      that.visitName = userMessage.visitorPersons[0].visitName;
      that.visitIdentity = userMessage.visitorPersons[0].visitIdentity;
      that.visitPhone = userMessage.visitorPersons[0].visitPhone;
      that.sex = userMessage.visitorPersons[0].sex;
      that.age = userMessage.visitorPersons[0].age;
      that.temp = userMessage.visitorPersons[0].temp;
      that.comeDate = userMessage.visitorPersons[0].comeDate;
      that.company = userMessage.visitorPersons[0].company;
      that.permanentAddress = userMessage.visitorPersons[0].permanentAddress;
      that.nowAddress = userMessage.visitorPersons[0].nowAddress;
      that.localPermanent = userMessage.visitorPersons[0].localPermanent;
      that.hightDangerArea = userMessage.visitorPersons[0].hightDangerArea;
      userMessage.visitorPersons.splice(0, 1);
      that.messageList = that.items = userMessage.visitorPersons;
      for (var i = 0; i < userMessage.visitorPersons.length; i++) {
        // userMessage.visitorPersons[i].dis_name = true;
        // userMessage.visitorPersons[i].dis_btn = true;
        // userMessage.visitorPersons[i].dis_id = true;
        // userMessage.visitorPersons[i].dis_phone = true;
        // userMessage.visitorPersons[i].show_btn = false;
        // userMessage.visitorPersons[i].req_name = false;
        // userMessage.visitorPersons[i].req_id = false;
        // userMessage.visitorPersons[i].req_phone = false;
        userMessage.visitorPersons[i].dis_name = true;
        userMessage.visitorPersons[i].dis_btn = true;
        userMessage.visitorPersons[i].dis_id = true;
        userMessage.visitorPersons[i].dis_fullAddress = true;
        userMessage.visitorPersons[i].dis_fullAddressNow = true;
        userMessage.visitorPersons[i].dis_areaNow = true;
        userMessage.visitorPersons[i].dis_area = true;
        userMessage.visitorPersons[i].dis_comeDate = true;
        userMessage.visitorPersons[i].dis_temp = true;
        userMessage.visitorPersons[i].dis_company = true;
        userMessage.visitorPersons[i].dis_hightDangerArea = true;
        userMessage.visitorPersons[i].dis_phone = true;
        userMessage.visitorPersons[i].show_btn = false;
        userMessage.visitorPersons[i].req_name = false;
        userMessage.visitorPersons[i].req_id = false;
        userMessage.visitorPersons[i].req_phone = false;
        userMessage.visitorPersons[i].req_area = false;
        userMessage.visitorPersons[i].req_fullAddress = false;
        userMessage.visitorPersons[i].req_areaNow = false;
        userMessage.visitorPersons[i].req_fullAddressNow = false;
        userMessage.visitorPersons[i].req_comeDate = false;
        userMessage.visitorPersons[i].req_company = false;
        userMessage.visitorPersons[i].req_hightDangerArea = false;
        userMessage.visitorPersons[i].req_temp = false;
      }
    }
    if (that.visitName === undefined) {
      that.submitFlag = true;
    } else {
      that.submitFlag = false;
    }
    that.visitDate = userMessage.visitDate;
    that.visitDays = userMessage.visitDays;
    if (userMessage.interviewerName) {
      that.interviewerName = userMessage.interviewerName;
    }
    if (userMessage.interviewerName == undefined) {
      that.interviewerName = "";
    }
    that.visitCarnum = userMessage.visitCarnum;
    //that.leaderId = userMessage.leaderId;
    var roles = JSON.parse(window.localStorage["orgRole"]);

    that.visitMatters = userMessage.visitMatters;
    that.visitorDoor = userMessage.visitorDoor;
    if (that.visitorDoor == "1") {
      that.visitorDoor = "二号门";
    } else if (that.visitorDoor == "2") {
      that.visitorDoor = "南门";
    }
    if (that.visitMatters == 1) {
      that.visitMatters = "驾车访问";
      that.show_leader = true;
    } else if (that.visitMatters == 0) {
      that.visitMatters = "普通访问";
      that.show_leader = false;
      that.show_visitCarnum = false;
    } else if (that.visitMatters == 2) {
      that.visitMatters = "送货";
      that.show_leader = false;
    } else if (that.visitMatters == 3) {
      that.visitMatters = "访问高层";
      that.show_leader = false;
    }
    that.visitContent = userMessage.visitContent;
    that.visitGoods = userMessage.visitGoods;
    that.visitState = userMessage.visitState;
    that.uptDate = userMessage.uptDate;
    if (that.visitState > 5) {
      that.ownerFlag = true;
    }
    if (that.visitState == 6) {
      that.show_detainReason = false;
    }
    var url1 = Vue.__ctx + "/visitor/visitorOrgUser/selectByAlias";
    for (var i = 0; i < roles.length; i++) {
      if (
        (roles[i].roleName == "访客保卫角色" && that.visitState == 1) ||
        roles[i].roleName == "访客保卫部长角色"
      ) {
        var obj = {
          //order: asc,
          alias: "fkbwbzjs",
        };
      } else {
        var obj = {
          //order: asc,
          alias: "fkcbzjs",
        };
      }
    }

    var post = Vue.baseService.post(url1, obj);
    post.then(function (e) {
      for (var i = 0; i < e.data.length; i++) {
        if (e.data[i].id == that.orgUserId) {
          that.leaderName = e.data[i].fullname;
        }
      }
    });
    that.detainReason = userMessage.detainReason;
    that.visitInTime = userMessage.visitInTime;
    that.visitOutTime = userMessage.visitOutTime;
    that.ids = userMessage.id;

    if (that.visitState == 0) {
      that.showFkMessage = true;
      that.showMwList = false;
      if (that.orgUserId == window.localStorage["userID"]) {
        that.ownerFlag = false;
      }
      // else {
      //   that.ownerFlag = true;
      // }
    } else {
      that.showFkMessage = true;
      if (that.visitState < 5) {
        if (that.orgUserId == window.localStorage["userID"]) {
          that.ownerFlag = false;
        }
        // else {
        //   that.ownerFlag = true;
        // }
      } else {
        that.ownerFlag = true;
      }
    }
    //访客状态 0建单 1填单 2 被访者确认 3厂/部长确认 4保卫部长确认 5 进厂 6 出厂 7扣留  8被访者接见（暂时删除这项）
    //来访类别  0 普通访问 1驾车访问 2 送货 3高层访问
    for (var i = 0; i < roles.length; i++) {
      if (roles[i].roleName == "访客保卫角色") {
        if (that.leaderId == userMessage.orgUserId) {
          that.leaderName = userMessage.orgUserName;
        }
        if (that.visitMatters != "驾车访问") {
          if (that.visitState > 2) {
            that.submitFlag = true;
            that.showMw = false;
            if (that.visitState == 6) {
              that.submitFlag = true;
              that.showMwList = true;
              that.showMw = false;
              that.show_detainReason = false;
            } else if (that.visitState == 5) {
              that.submitFlag = false;
              that.showMwList = true;
              that.showMw = true;
            } else if (that.visitState == 4) {
              that.submitFlag = false;
              that.showMwList = true;
              that.showMw = true;
              that.ownerFlag = false;
            } else if (that.visitState == 7) {
              that.submitFlag = true;
              that.showMwList = true;
              that.showMw = false;
              that.show_detainReason = true;
            } else if (that.visitState == 3) {
              that.submitFlag = false;
              that.showMwList = true;
              that.showMw = true;
              that.ownerFlag = false;
            }
            // else if (that.visitState == 8) {
            //   that.submitFlag = false;
            //   that.showMwList = true;
            //   that.showMw = true;
            // }
          } else if (that.visitState == 0) {
            that.submitFlag = false;
            that.showMw = false;
            that.showMwList = false;
          } else if (that.visitState == 1) {
            that.submitFlag = false;
            that.showMw = true;
            that.showMwList = true;
            that.url = Vue.__ctx + "/visitor/visitorRecord/inConfirm";
          } else {
            that.submitFlag = false;
            that.showMw = true;
            that.showMwList = true;
          }
        } else {
          if (that.visitState > 5) {
            if (that.visitState == 6) {
              that.submitFlag = true;
              that.showMwList = true;
              that.showMw = true;
            } else if (that.visitState == 7) {
              that.show_detainReason = true;
              that.submitFlag = true;
              that.showMwList = true;
              that.showMw = true;
            }
            // else if (that.visitState == 8) {
            //   that.submitFlag = false;
            //   that.showMwList = true;
            //   that.showMw = true;
            // }
          } else if (that.visitState == 2) {
            that.submitFlag = true;
            that.showMwList = false;
            that.showMw = false;
            that.ownerFlag = false;
          } else if (that.visitState == 5) {
            that.submitFlag = false;
            that.showMwList = true;
            that.showMw = true;
          } else {
            that.submitFlag = false;
            that.showMwList = true;
            that.showMw = true;
            that.ownerFlag = false;
          }
          if (that.orgUserId == window.localStorage["userID"]) {
            if (that.visitState == 1) {
              that.showMwList = false;
              that.showMw = false;
              that.url = Vue.__ctx + "/visitor/visitorRecord/inConfirm";
            }
          }
        }

        if (that.visitState <= 5 && that.visitState > 1) {
          that.url = Vue.__ctx + "/visitor/visitorRecord/inConfirm";
        } else if (that.visitState == 0) {
          that.submitFlag = true;
        } else if (that.visitState != 1) {
          that.url = Vue.__ctx + "/visitor/visitorRecord/outConfirm";
        }
        break;
      } else if (roles[i].roleName == "访客保卫部长角色") {
        //被访者为保卫部长的时候设置主管姓名
        that.leaderName = userMessage.orgUserName;
        console.log(that.ownerFlag);
        if (that.visitState < 5 && that.visitState >= 1) {
          that.submitFlag = false;
          that.ownerFlag = false;
          that.url = Vue.__ctx + "/visitor/visitorRecord/inConfirm";
        } else {
          that.submitFlag = true;
          that.showMwList = true;
          that.showMw = false;
          that.disabled_detainReason = true;
        }
        break;
      } else if (roles[i].roleName == "访客厂部长角色") {
        that.leaderName = userMessage.orgUserName;
        //创建者是访客厂部长
        if (that.visitMatters == "驾车访问") {
          // console.log(userMessage.orgUserId , userMessage.leaderId)
          // if (userMessage.orgUserId == userMessage.leaderId) {
          //   if (that.visitState == 1) {
          //     that.submitFlag = false;
          //     that.url = Vue.__ctx + "/visitor/visitorRecord/inConfirm";
          //   }
          // } else {
          //   if (that.visitState == 1) {
          //     that.submitFlag = true;
          //   }
          // }
          if (that.visitState == 1) {
            that.submitFlag = false;
            that.url = Vue.__ctx + "/visitor/visitorRecord/inConfirm";
          } else {
            that.submitFlag = true;
          }
        } else {
          if (that.orgUserId == window.localStorage["userID"]) {
            if (that.visitState == 1) {
              that.submitFlag = false;
              that.url = Vue.__ctx + "/visitor/visitorRecord/inConfirm";
            }
          } else {
            if (that.visitState == 1) {
              that.submitFlag = true;
            }
          }
        }

        if (that.visitState < 4 && that.visitState > 1) {
          that.submitFlag = false;
          that.url = Vue.__ctx + "/visitor/visitorRecord/inConfirm";
        } else if (that.visitState == 4) {
          that.submitFlag = true;
          that.showMwList = false;
          that.showMw = false;
          that.show_detainReason = false;
        } else if (that.visitState == 5) {
          that.submitFlag = false;
          that.url = Vue.__ctx + "/visitor/visitorRecord/inConfirm";
        } else if (that.visitState != 1) {
          that.submitFlag = true;
          that.showMwList = true;
          that.showMw = false;
          that.show_detainReason = true;
        }
        break;
      }
      //else if (roles[i].roleName == "访客受访者角色") {
      //   if (that.visitState <= 3) {
      //     that.submitFlag = false;
      //     if (that.visitState == 0) {
      //       that.submitFlag = true;
      //     } else {
      //       that.url = Vue.__ctx + "/visitor/visitorRecord/inConfirm";
      //     }
      //   } else {

      //     if (that.visitState == 5) {
      //       that.submitFlag = false;
      //       that.url = Vue.__ctx + "/visitor/visitorRecord/inConfirm";
      //     } else if(that.visitState == 4){
      //       that.submitFlag = true;
      //       that.showMw = false;
      //       that.showMwList = false;
      //       that.show_detainReason = false;
      //     }else {
      //       that.submitFlag = true;
      //       that.showMw = false;
      //       that.showMwList = true;
      //       that.show_detainReason = true;
      //     }

      //   }
      //   break;
      // }
    }
  },
  methods: {
    getData: function (val) {
      let index = val.index;
      this.messageList[index] = val.data;
    },

    delContent(index) {
      this.messageList.splice(index, 1);
    },
    addVisitor() {
      this.messageList.push({
        visitName: "",
        visitIdentity: "",
        visitPhone: "",
      });
    },
    sub() {
      if (this.visitDays < 2) {
        return;
      }
      this.visitDays--;
      this.islight = this.lightFunc();
    },
    // 增加数量
    add() {
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
    showAllName() {
      this.remoteMethod();
    },
    //下拉搜索上级人员
    remoteMethod(value, query) {
      this.options_leader = [];
      // if (value == "") {
      //   return;
      // }

      var roles = JSON.parse(window.localStorage["orgRole"]);
      //425717566605623297 保卫部长
      let that = this;
      var url = Vue.__ctx + "/visitor/visitorOrgUser/selectByAlias";
      for (var i = 0; i < roles.length; i++) {
        if (roles[i].roleName.substring(0, 2) == "访客") {
          if (roles[i].roleName == "访客保卫角色") {
            var obj = {
              //order: asc,
              alias: "fkbwbzjs",
            };
          } else {
            var obj = {
              //order: asc,
              alias: "fkcbzjs",
            };
          }
        }
      }

      var post = Vue.baseService.post(url, obj);
      post.then(function (e) {
        for (var i = 0; i < e.data.length; i++) {
          //that.options_leader.push()
          let nameAndCode = {
            value: e.data[i].id,
            label: e.data[i].fullname,
          };
          that.options_leader.push(nameAndCode);
        }
      });
    },
    //选择访问类别
    chooseVisitMatters(value) {
      if (value == 1) {
        this.show_leader = true;
      } else {
        this.show_leader = false;
      }
    },
    chooseLeader(value) {
      this.leaderId = value;
    },
    //进厂 出厂 扣留 1 2 3
    chooseRadio(value) {
      this.show_detainReason = false;
      this.type = value;
      if (value == 3) {
        this.show_detainReason = true;
        this.detainReason = "";
        this.disabled_detainReason = false;
      }
      var roles = JSON.parse(window.localStorage["orgRole"]);
      for (var i = 0; i < roles.length; i++) {
        if (this.visitState < 5 && this.visitState > 1) {
          if (this.type == 2 || this.type == 3) {
            Toast.fail("请选择进厂");
            this.submitFlag = true;
            return;
          }
          this.submitFlag = false;
          this.url = Vue.__ctx + "/visitor/visitorRecord/inConfirm";
        } else if (this.visitState == 5) {
          if (this.type == 1) {
            console.log("1111111111");
            Toast.fail("请选择出厂或扣留");
            this.submitFlag = true;
            return;
          }
          this.submitFlag = false;
          this.url = Vue.__ctx + "/visitor/visitorRecord/outConfirm";
        }
      }
    },
    acquire_visitContent(value) {
      this.visitContent = value;
    },
    back() {
      this.$router.push("/visitor");
    },
    delRecord() {
      var url = Vue.__ctx + "/visitor/visitorRecord/delete";
      let obj = {};
      obj.id = this.ids;
      var post = Vue.baseService.post(url, obj);
      let that = this;
      post.then(function (e) {
        if (e.isOk) {
          Toast.success("删除成功");
          that.$router.push("/visitor");
        } else {
          Toast.fail("删除失败");
        }
      });
    },
    submit() {
      // var roles = JSON.parse(window.localStorage["orgRole"]);
      // for (var i = 0; i < roles.length; i++) {
      //   if (roles[i].roleName.substring(0, 2) == "访客") {
      //     if (roles[i].roleName == "访客保卫角色") {
      //       if (
      //         this.visitState == 5 &&
      //         this.orgUserId != window.localStorage["userID"]
      //       ) {
      //         Toast.fail("出厂确认失败，受访者确认接见后方可出厂");
      //         return;
      //       }
      //     }
      //   }
      // }
      let obj = {};
      if (this.url == "") {
        Toast.fail("请选择正确的进出厂信息");
        return;
      }
      obj.id = this.ids;
      obj.orgUserId = this.orgUserId;
      // obj.visitName = this.visitName;
      // obj.visitDate = this.visitDate;
      // obj.visitDays = this.visitDays;
      // obj.visitIdentity = this.visitIdentity;
      // obj.visitPhone = this.visitPhone;
      // obj.visitCarnum = this.visitCarnum;
      // obj.visitContent = this.visitContent;
      // obj.visitGoods = this.visitGoods;
      //出厂或扣留判断
      if (this.type == 2) {
        this.visitState = 6;
      } else if (this.type == 3) {
        this.visitState = 7;
      }
      console.log(this.visitState, this.type);
      if (this.visitState == 5 && this.type == 1) {
        Toast.fail("访客已进厂，请选择出厂或扣留");
        return;
      }
      obj.visitState = this.visitState;
      obj.detainReason = this.detainReason;
      // obj.visitInTime = this.visitInTime;
      //obj.leaderId = this.leaderId;
      // obj.uptDate = this.uptDate;
      // if (this.visitMatters == "驾车访问") {
      //   if (obj.leaderId == "") {
      //     Toast.fail("请填写主管领导");
      //     return;
      //   }
      // }
      if (this.visitMatters == "普通访问") {
        this.visitMatters = 0;
      } else if (this.visitMatters == "驾车访问") {
        this.visitMatters = 1;
      }
      obj.visitMatters = this.visitMatters;
      //obj.visitOutTime = this.visitOutTime;

      let that = this;
      var post = Vue.baseService.post(this.url, obj);
      post.then(function (e) {
        if (e.isOk) {
          Toast.success("提交成功！");
          that.$router.push("/visitor");
        } else {
          Toast.fail(e.msg);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>

