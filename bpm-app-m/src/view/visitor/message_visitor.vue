<template>
  <div v-if="isUseSubmit">
    <div class="BfrMessage" style="margin-top: 10px">
      <span
        style="font-size: 16px; font-weight: 999; width: 10%; margin-left: 40%"
        >访客填写</span
      >
      <van-radio-group
        v-model="radioType"
        direction="horizontal"
        style="
          text-align: center;
          display: flex;
          justify-content: center;
          margin-top: 10px;
          margin-bottom: 10px;
        "
        @change="chooseRadio"
      >
        <van-radio name="0" v-if="showTsIn">唐山市内</van-radio>
        <van-radio name="1" v-if="showTsOut">唐山市外</van-radio>
      </van-radio-group>
      <div style="display: flex">
        <van-field
          style="margin-left: 10px"
          v-model="visitName"
          label="访客姓名:"
          required
          placeholder="请输访客姓名"
          :disabled="editFlag"
        />
        <van-button
          type="primary"
          size="small"
          style="margin-top: 8px; margin-right: 10px"
          @click="addVisitor"
          >+</van-button
        >
      </div>
      <van-field
        v-model="visitIdentity"
        label="身份证号:"
        required
        placeholder="请输入身份证号"
        style="margin-left: 10px"
        @input="gainIdCard"
      />
      <van-field
        v-model="visitPhone"
        label="访客电话:"
        required
        placeholder="请输入手机号"
        style="margin-left: 10px"
      />
      <div v-if="showEpidemicNews">
        <van-field
         readonly
         clickable
          v-model="area"
          label="户籍地区:"
          placeholder="请选择户籍地区"
          style="margin-left: 10px"
          @click="showArea = true"
          required
          clearable
        />
        <van-popup v-model="showArea" position="bottom">
          <van-area
            title="户籍地区:"
            :area-list="areaList"
            :columns-placeholder="columnsPlaceholder"
            @confirm="confirmArea"
            @cancel="cancelArea"
          />
        </van-popup>
      </div>
      <van-field
        v-model="fullAddress"
        label="详细住址:"
        required
        placeholder="请输入详细住址"
        style="margin-left: 10px"
        @input="inputFullAddress"
        v-if="showEpidemicNews"
      />
      <div v-if="showEpidemicNews">
        <van-field
          readonly
         clickable
          v-model="areaNow"
          label="现住地区:"
          placeholder="请选择现住地区"
          style="margin-left: 10px"
         @click="showAreaNow = true"
        />
        <van-popup v-model="showAreaNow" position="bottom">
          <van-area
            title="户籍地区:"
            :area-list="areaList"
            :columns-placeholder="columnsPlaceholderNow"
            @confirm="confirmAreaNow"
            @cancel="cancelAreaNow"
          />
        </van-popup>
      </div>
      <van-field
        v-model="fullAddressNow"
        label="详细现住址:"
        required
        placeholder="请输入详细现住址"
        style="margin-left: 10px"
        @input="inputFullAddressNow"
        v-if="showEpidemicNews"
      />
      <van-field
      readonly
      clickable
        v-model="comeDate"
        label="来丰南日期:"
        placeholder="请选择来丰南日期"
        @click="showCalendarCome = !editFlagCome"
        required
        style="margin-left: 10px"
        :disabled="editFlagCome"
        v-if="showEpidemicNews"
      />
      <van-calendar
        v-model="showCalendarCome"
        @confirm="onConfirmCome"
        required
        :min-date="minDate"
      />
      <van-field
        v-model="temp"
        label="体温:"
        required
        placeholder="请输入体温"
        style="margin-left: 10px"
        @input="inputTemp"
        v-if="showEpidemicNews"
      /><van-field
        v-model="company"
        label="所属企业"
        required
        placeholder="请输入所属企业"
        style="margin-left: 10px"
        @input="inputCompany"
        v-if="showEpidemicNews"
      />
      <div v-if="showEpidemicNews" style="background: #fff">
        <span style="margin-left: 25px; font-size: 14px"
          >是否去过中高风险地区</span
        >
        <van-checkbox-group
          style="margin-left: 25px; padding-bottom: 5px"
          v-model="radioZgfxdq"
          direction="horizontal"
          @change="clickBox"
        >
          <van-checkbox
            :name="item.name"
            v-for="(item, index) in optionsZgfxdq"
            :key="index"
            >{{ item.name }}</van-checkbox
          >
        </van-checkbox-group>
      </div>
      <van-field
        v-model="interviewerName"
        label="被访者姓名:"
        required
        placeholder="请输入被访者姓名"
        style="margin-left: 10px"
      />
      <child-message
        v-for="(item, index) in messageList"
        :key="index"
        @func="delContent(index)"
        @uploadData="getData"
        :index="index"
        :items="items"
        :radioType='radioType'
        :company="company"
      ></child-message>
      <van-field
      readonly
      clickable
        v-model="visitDate"
        label="来访日期:"
        placeholder="请选择来访日期"
        @click="showCalendar = !editFlag"
        required
        style="margin-left: 10px"
        :disabled="editFlag"
      />
      <van-calendar v-model="showCalendar" @confirm="onConfirm" required />
      <div
        class="visitDays"
        style="
          margin-left: 25px;
          margin-top: 10px;
          margin-bottom: 15px;
          display: flex;
        "
      >
        <span style="font-size: 14px; height: 40px; line-height: 40px"
          >来访天数:</span
        >
        <!-- <el-input-number
          v-model="visitDays"
          controls-position="right"
          @change="changeVisitDays"
          :min="1"

        ></el-input-number> -->
        <div class="input-number">
          <div :class="(islight ? 'light' : '') + ' sub'" @click="sub">-</div>
          <van-field class="num" v-model="visitDays" :center="true"></van-field>
          <div class="add" @click="add">+</div>
        </div>
      </div>
      <div
        class="visitMatters"
        style="margin-left: 25px; margin-top: 10px; margin-bottom: 10px"
      >
        <span style="font-size: 14px">来访事项:</span>
        <el-select
          v-model="visitMatters"
          placeholder="请选择访问类别"
          style="margin-left: 10px"
          @change="chooseVisitMatters"
          required
          :disabled="editFlag"
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
      <div
        class="visitorDoor"
        style="margin-left: 25px; margin-top: 10px; margin-bottom: 10px"
      >
        <span style="font-size: 14px">进厂门口：</span>
        <el-select
          v-model="visitorDoor"
          placeholder="请选择进厂门口"
          style="margin-left: 10px"
          @change="chooseVisitorDoor"
          required
          :disabled="editFlag"
        >
          <el-option
            v-for="item in optionsDoor"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <van-field
        style="margin-left: 10px"
        v-if="show_visitCarnum"
        v-model="visitCarnum"
        label="车号:"
        placeholder="请输入车号"
        :disabled="editFlag"
      />
    </div>
    <div class="FkMessage">
      <van-field
        v-model="visitGoods"
        autosize
        label="随身物品"
        type="textarea"
        placeholder="请输入随身物品"
        style="margin-left: 10px"
      />

      <van-field
        v-model="visitContent"
        autosize
        label="来访内容"
        type="textarea"
        required
        placeholder="请输入来访内容"
        style="margin-left: 10px"
        @input="acquire_visitContent"
      />
    </div>
    <div class="btn">
      <el-row :gutter="20">
        <el-col
          :span="12"
          :offset="9"
          style="margin-top: 10px; margin-bottom: 10px"
        >
          <el-button
            type="primary"
            @click="submit()"
            :disabled="submitbtn_Disabled"
            style="position: fixed; bottom: 20px"
            >提交</el-button
          >
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";
import { Dialog } from "vant";
import { areaList } from "@vant/area-data";
import { Area } from "vant";
import { Checkbox, CheckboxGroup } from "vant";
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Area);
Vue.use(Toast);
import ChildMessage from "../visitor/childMessage.vue";
import qs from "qs";
export default {
  data() {
    return {
      id: "",
      url: "",
      isUseSubmit: true,
      showFkMessage: false,
      showMw: false,
      showMwList: false,
      editFlag: false, //是否可编辑
      editFlagCome: false,
      submitFlag: false, //提交是否可用
      ownerFlag: false, //所有者标识
      orgUserId: "", //所有者主键
      visitName: "",
      visitDays: "1",
      //显示来访日期插件
      showCalendar: false,
      showCalendarCome: false,
      //来访日期
      visitDate: this.formatDate("YYYY-mm-dd", new Date()),
      //来访类别
      showVisitMatters: false,
      //进厂门口
      visitorDoor: "",
      visitMatters: "",
      //来访状态
      visitState: "",
      //车号
      visitCarnum: "",
      visitPhoneError: "",
      //随身物品
      visitGoods: "",
      //访客电话
      visitPhone: "",
      //来访内容
      visitContent: "",
      //身份证号
      visitIdentity: "",
      //地区状态
      radioType: "0",
      visitInTime: "",
      visitOutTime: "",
      detainReason: "",
      show_detainReason: false,
      disabled_detainReason: true,
      uptDate: "",
      options: [
        {
          value: "0",
          label: "普通访问",
        },
        {
          value: "1",
          label: "驾车访问",
        },
        // {
        //   value: "2",
        //   label: "送货",
        // },
        // {
        //   value: "3",
        //   label: "高层访问",
        // },
      ],
      optionsDoor: [
        {
          value: "1",
          label: "二号门",
        },
        {
          value: "2",
          label: "南门",
        },
      ],
      //0 普通访问 1驾车访问 2 送货 3高层访问
      options_leader: [],
      show_pop: false,
      imgUrl: "",
      ids: "",
      interviewerName: "",
      type: 1,
      islight: "",
      show_leader: false,
      show_visitCarnum: false,
      submitbtn_Disabled: false,
      messageList: [],
      items: [],
      //关于疫情的信息显示控制
      showEpidemicNews: false,
      //显示地区选择器
      showArea: false,
      showAreaNow: false,
      area: "",
      areaNow: "",
      areaList,
      columnsPlaceholder: ["请选择", "请选择", "请选择"],
      columnsPlaceholderNow: ["请选择", "请选择", "请选择"],
      sex: "",
      age: "",
      isNotTsPerson: "",
      //详细住址
      fullAddress: "",
      //详细现住址
      fullAddressNow: "",
      //户籍地址
      permanentAddress: "",
      //现住址
      nowAddress: "",
      //体温
      temp: "",
      //所属企业
      company: "",
      //是否去过高风险地区
      hightDangerArea: "",
      //来丰南日期
      comeDate: "",
      minDate: new Date(2010, 0, 1),
      //中高风险地区
      optionsZgfxdq: [],
      radioZgfxdq: [],
      showTsIn:true,
      showTsOut:true,
    };
  },
  components: {
    ChildMessage,
  },
  mounted() {},
  created() {
    let href = window.location.href;
    //"27.191.146.122:8083/modules/wx/index.html#/message_visitor?secret=03b7ef6da5f843a595572933122fdd26";
    if (href != "http://127.0.0.1:8080/#/message_visitor") {
      var n1 = href.length; //地址的总长度
      var n2 = href.indexOf("="); //取得=号的位置
      var secret = decodeURI(href.substr(n2 + 1, n1 - n2)); //从=号后面的内容
    } else {
      var secret = "77d36c4f7ff24d81bd447fab060136fb";
    }
    var url = Vue.__ctx + "/visitor//visitorIgnore/selectByQR";
    let obj = {
      secret,
    };
    let that = this;
    var post = Vue.baseService.postForm(url, obj);
    post.then(function (e) {
      if (!e.isOk) {
        that.isUseSubmit = true;
        Toast.fail(e.msg);
        return;
      } else {
        if (e.data.visitName != undefined) {
          that.submitbtn_Disabled = false;
        }
          
        
        
        if (e.data.visitorPersons.length != 0) {
          if(e.data.visitorPersons[0].temp != ''){
            that.radioType = '1'
          that.showTsIn = false
          that.showTsOut = true
        }else{
          that.showTsIn = true
          that.showTsOut = false
        }
        console.log(e.data.visitorPersons.length,that.radioType)
          if (e.data.visitorPersons.length == 1 && that.radioType == 1) {
            that.visitName = e.data.visitorPersons[0].visitName;
            that.visitIdentity = e.data.visitorPersons[0].visitIdentity;
            that.visitPhone = e.data.visitorPersons[0].visitPhone;
            that.comeDate = e.data.visitorPersons[0].comeDate;
            that.temp = e.data.visitorPersons[0].temp;
            that.company = e.data.visitorPersons[0].company;
            that.radioZgfxdq = e.data.visitorPersons[0].hightDangerArea.split(",");
            // //详细住址
            // fullAddress: "",
            // //详细现住址
            // fullAddressNow: "",
            // //户籍地址
            // permanentAddress: "",
            // //现住址
            // nowAddress: "",
            var index = e.data.visitorPersons[0].permanentAddress .lastIndexOf("-");
            //e.data.visitorPersons[0].permanentAddress = e.data.visitorPersons[0].permanentAddress .substring(index + 1, e.data.visitorPersons[0].permanentAddress .length);
            var index1 = e.data.visitorPersons[0].nowAddress .lastIndexOf("-");
            //e.data.visitorPersons[0].nowAddress = e.data.visitorPersons[0].nowAddress .substring(index1 + 1, e.data.visitorPersons[0].nowAddress .length);
            that.fullAddress = e.data.visitorPersons[0].permanentAddress.substring(index + 1, e.data.visitorPersons[0].permanentAddress .length);
            that.fullAddressNow = e.data.visitorPersons[0].nowAddress.substring(index1 + 1, e.data.visitorPersons[0].nowAddress .length);
            that.area = e.data.visitorPersons[0].permanentAddress.substring(0, index)
            that.areaNow = e.data.visitorPersons[0].nowAddress.substring(0, index1)
            console.log(that.fullAddress)
          } else if(e.data.visitorPersons.length == 1 && that.radioType == 0){
            that.visitName = e.data.visitorPersons[0].visitName;
            that.visitIdentity = e.data.visitorPersons[0].visitIdentity;
            that.visitPhone = e.data.visitorPersons[0].visitPhone;
          }else if(e.data.visitorPersons.length != 1 && that.radioType == 1) {
            that.visitName = e.data.visitorPersons[0].visitName;
            that.visitIdentity = e.data.visitorPersons[0].visitIdentity;
            that.visitPhone = e.data.visitorPersons[0].visitPhone;
            that.comeDate = e.data.visitorPersons[0].comeDate;
            that.temp = e.data.visitorPersons[0].temp;
            that.company = e.data.visitorPersons[0].company;
            that.radioZgfxdq = e.data.visitorPersons[0].hightDangerArea.split(",");
            var index = e.data.visitorPersons[0].permanentAddress .lastIndexOf("-");
            //e.data.visitorPersons[0].permanentAddress = e.data.visitorPersons[0].permanentAddress .substring(index + 1, e.data.visitorPersons[0].permanentAddress .length);
            var index1 = e.data.visitorPersons[0].nowAddress .lastIndexOf("-");
            //e.data.visitorPersons[0].nowAddress = e.data.visitorPersons[0].nowAddress .substring(index1 + 1, e.data.visitorPersons[0].nowAddress .length);
            that.fullAddress = e.data.visitorPersons[0].permanentAddress.substring(index + 1, e.data.visitorPersons[0].permanentAddress .length);
            that.fullAddressNow = e.data.visitorPersons[0].nowAddress.substring(index1 + 1, e.data.visitorPersons[0].nowAddress .length);
            that.area = e.data.visitorPersons[0].permanentAddress.substring(0, index)
            that.areaNow = e.data.visitorPersons[0].nowAddress.substring(0, index1)
            e.data.visitorPersons.splice(0, 1);
            that.messageList = that.items = e.data.visitorPersons;
            console.log(that.messageList)
            for (var i = 0; i < e.data.visitorPersons.length; i++) {
              var index = e.data.visitorPersons[0].permanentAddress .lastIndexOf("-");
              var index1 = e.data.visitorPersons[0].nowAddress .lastIndexOf("-");
              e.data.visitorPersons[i].radioZgfxdq = e.data.visitorPersons[i].hightDangerArea.split(',')
               e.data.visitorPersons[i].fullAddress = e.data.visitorPersons[i].permanentAddress.substring(index + 1, e.data.visitorPersons[i].permanentAddress .length);
            e.data.visitorPersons[i].fullAddressNow = e.data.visitorPersons[i].nowAddress.substring(index1 + 1, e.data.visitorPersons[i].nowAddress .length);
            e.data.visitorPersons[i].area = e.data.visitorPersons[i].permanentAddress.substring(0, index)
            e.data.visitorPersons[i].areaNow = e.data.visitorPersons[i].nowAddress.substring(0, index1)
              e.data.visitorPersons[i].dis_name = false;
              e.data.visitorPersons[i].dis_btn = false;
              e.data.visitorPersons[i].dis_id = false;
              e.data.visitorPersons[i].dis_fullAddress = false;
              e.data.visitorPersons[i].dis_fullAddressNow = false;
              e.data.visitorPersons[i].dis_areaNow = false;
              e.data.visitorPersons[i].dis_area = false;
              e.data.visitorPersons[i].dis_comeDate = false;
              e.data.visitorPersons[i].dis_temp = false;
              e.data.visitorPersons[i].dis_company = false;
              e.data.visitorPersons[i].dis_hightDangerArea = false;
              e.data.visitorPersons[i].dis_phone = false;
              e.data.visitorPersons[i].show_btn = true;
              e.data.visitorPersons[i].req_name = true;
              e.data.visitorPersons[i].req_id = true;
              e.data.visitorPersons[i].req_phone = true;
              e.data.visitorPersons[i].req_area = true;
              e.data.visitorPersons[i].req_fullAddress = true;
              e.data.visitorPersons[i].req_areaNow = true;
              e.data.visitorPersons[i].req_fullAddressNow = true;
              e.data.visitorPersons[i].req_comeDate = true;
              e.data.visitorPersons[i].req_company = true;
              e.data.visitorPersons[i].req_hightDangerArea = true;
              e.data.visitorPersons[i].req_temp = true;
            }
          }else if(e.data.visitorPersons.length != 1 && that.radioType == 0){
            console.log('11111')
            that.visitName = e.data.visitorPersons[0].visitName;
            that.visitIdentity = e.data.visitorPersons[0].visitIdentity;
            that.visitPhone = e.data.visitorPersons[0].visitPhone;
            e.data.visitorPersons.splice(0, 1);
            that.messageList = that.items = e.data.visitorPersons;
          }
        }
        that.orgUserId = e.data.orgUserId;
        that.ids = e.data.id;

        that.visitDate = e.data.visitDate;
        that.visitGoods = e.data.visitGoods;
        //被访者姓名
        that.interviewerName = e.data.interviewerName;
        that.visitMatters = e.data.visitMatters;
        that.visitorDoor = e.data.visitorDoor;
        if (that.visitMatters == 1) {
          that.show_visitCarnum = true;
        } else {
          that.show_visitCarnum = false;
        }

        that.visitState = e.data.visitState;
        that.visitCarnum = e.data.visitCarnum;
        that.uptDate = e.data.uptDate;
        that.visitContent = e.data.visitContent;
      }
    });
    var url = Vue.__ctx + "/sys/dataDict/getDictData";
    let objZgfxdq = {
      hasRoot: true,
      dictKey: "zgfxdq",
    };
    var postDicZgfxdq = Vue.baseService.postForm(url, objZgfxdq);
    postDicZgfxdq.then((e) => {
      that.optionsZgfxdq = e.data.splice(1, e.data.length);
    });
  },
  updated() {},
  methods: {
    //获取新增组件的数据
    getData: function (val) {
      // nowAddress:'',
        // permanentAddress:'',
      let index = val.index;
      this.messageList[index] = val.data;
      this.messageList[index].nowAddress = this.messageList[index].areaNow +"-"+ this.messageList[index].fullAddressNow
      this.messageList[index].permanentAddress = this.messageList[index].area +"-"+ this.messageList[index].fullAddress
      if(this.messageList[index].temp != ''){
        this.radioType = '1'
      }
    },
    //删除新增组件
    delContent(index) {
      this.messageList.splice(index, 1);
    },
    //添加组件
    addVisitor() {
      this.messageList.push({
        visitName: "",
        visitIdentity: "",
        visitPhone: "",
        area:'',
        fullAddress:'',
        areaNow:'',
        fullAddressNow:'',
        comeDate:'',
        //体温
        temp: "",
        company:'',
        hightDangerArea:'',
        dis_name: false,
        dis_btn: false,
        dis_id: false,
        dis_phone: false,
        dis_area:false,
        dis_fullAddress:false,
        dis_areaNow:false,
        dis_fullAddressNow:false,
        dis_comeDate:false,
        dis_temp:false,
        dis_company:false,
        dis_hightDangerArea:false,
        show_btn: true,
        req_name: true,
        req_id: true,
        req_phone: true,
        req_area:true,
        req_fullAddress:true,
        req_areaNow:true,
        req_fullAddressNow:true,
        req_comeDate:true,
        req_temp:true,
        req_company:true,
        req_hightDangerArea:true,
      });
    },
    //选择地区
    chooseRadio(val) {
      console.log(val)
      
      if(this.messageList.length == 0){
        
      }else{
        if(this.messageList[0].visitName == ''){
          this.messageList.length = 0
        }
      }
      if (val == 0) {
        this.showEpidemicNews = false;
      } else {
        this.showEpidemicNews = true;
      }
    },
    acquire_visitContent(value) {
      this.visitContent = value;
    },
    back() {
      this.$router.push("/visitor");
    },
    onConfirm(date) {
      this.showCalendar = false;
      this.visitDate = this.formatDate("YYYY-mm-dd", date);
    },
    //使用
    onConfirmCome(date) {
      this.showCalendarCome = false;
      this.comeDate = this.formatDate("YYYY-mm-dd", date);
    },
    chooseVisitMatters(value) {
      if (value == 1 || value == 2) {
        this.show_leader = true;
        this.show_visitCarnum = true;
      } else {
        this.show_leader = false;
        this.show_visitCarnum = false;
      }
    },
    chooseVisitorDoor(value) {
      console.log(value);
    },
    formatDate(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
      //return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
    chooseLeader(value) {
      this.leaderId = value;
    },

    submit() {
      Dialog.confirm({
        message: "是否确认提交,提交后将无法再次提交",
      })
        .then(() => {
          // on confirm
          let basisMessage = {};
          

          var url = Vue.__ctx + "/visitor/visitorIgnore/fillIn";
          let obj = {};
          if (!/^1[3456789]\d{9}$/.test(this.visitPhone)) {
            Toast.fail("手机号码有误，请重填");
            return false;
          }
          if (!/^\d{17}(\d|x)$/i.test(this.visitIdentity)) {
            Toast.fail("身份证号码有误，请重填");
            return false;
          }
          obj.id = this.ids;
          //obj.id = "8fc0c93ba479e5adbd10abeec945a96e";
          // visitorPersons 人员基本信息（姓名，身份证号，手机号）
          basisMessage.visitName = this.visitName;
          basisMessage.visitIdentity = this.visitIdentity;
          var birthday = this.getBirthdayFromIdCard(basisMessage.visitIdentity);
          //计算年龄
          this.age = this.getAge(birthday).substring(0, 2);
          console.log(this.age);
          basisMessage.age = this.age;
          //判断性别
          var sexNum = basisMessage.visitIdentity.substring(
            basisMessage.visitIdentity.length - 2,
            basisMessage.visitIdentity.length - 1
          );
          console.log(sexNum);
          if (
            sexNum == "1" ||
            sexNum == "3" ||
            sexNum == "5" ||
            sexNum == "7" ||
            sexNum == "9"
          ) {
            this.sex = "男";
          } else {
            this.sex = "女";
          }
          basisMessage.sex = this.sex;
          basisMessage.permanentAddress = this.area + "-" + this.fullAddress;
          basisMessage.nowAddress = this.areaNow + "-" + this.fullAddressNow;
          basisMessage.visitPhone = this.visitPhone;
          basisMessage.temp = this.temp;
          basisMessage.comeDate = this.comeDate;
          basisMessage.hightDangerArea = this.hightDangerArea;
          basisMessage.company = this.company;
          basisMessage.localPermanent = this.localPermanent;
          var visitorPersons = [];
          if (this.messageList) {
            // obj.visitName = this.visitName + "," + this.nameString;
            visitorPersons.push(basisMessage);
            for (var i = 0; i < this.messageList.length; i++) {
              if (!/^1[3456789]\d{9}$/.test(this.messageList[i].visitPhone)) {
                Toast.fail("手机号码有误，请重填");
                return false;
              }
              if (!/^\d{17}(\d|x)$/i.test(this.messageList[i].visitIdentity)) {
                Toast.fail("身份证号码有误，请重填");
                return false;
              }
              var birthday = this.getBirthdayFromIdCard(this.messageList[i].visitIdentity);
          //计算年龄
          this.messageList[i].age = this.getAge(birthday).substring(0, 2);
          console.log(this.age);
          //判断性别
          var sexNum = this.messageList[i].visitIdentity.substring(
            this.messageList[i].visitIdentity.length - 2,
            this.messageList[i].visitIdentity.length - 1
          );
          console.log(sexNum);
          if (
            sexNum == "1" ||
            sexNum == "3" ||
            sexNum == "5" ||
            sexNum == "7" ||
            sexNum == "9"
          ) {
            this.messageList[i].sex = "男";
          } else {
            this.messageList[i].sex = "女";
          }
              delete this.messageList[i].dis_name;
              delete this.messageList[i].dis_btn;
              delete this.messageList[i].dis_id;
              delete this.messageList[i].dis_phone;
              delete this.messageList[i].dis_area;
              delete this.messageList[i].dis_fullAddress;
              delete this.messageList[i].dis_areaNow;
              delete this.messageList[i].dis_fullAddressNow;
              delete this.messageList[i].dis_comeDate;
              delete this.messageList[i].dis_temp;
              delete this.messageList[i].dis_company;
              delete this.messageList[i].dis_hightDangerArea;
              delete this.messageList[i].show_btn;
              delete this.messageList[i].req_name;
              delete this.messageList[i].req_id;
              delete this.messageList[i].req_phone;
              delete this.messageList[i].req_area;
              delete this.messageList[i].req_fullAddress;
              delete this.messageList[i].req_areaNow;
              delete this.messageList[i].req_fullAddressNow;
              delete this.messageList[i].req_comeDate;
              delete this.messageList[i].req_temp;
              delete this.messageList[i].req_company;
              delete this.messageList[i].req_hightDangerArea;
              visitorPersons.push(this.messageList[i]);
            }
          } else {
            // obj.visitName = this.visitName
            visitorPersons.push(basisMessage);
          }
          //如意排序用
          for (var i = 0; i < visitorPersons.length; i++) {
            visitorPersons[i].visitOrder = i;
          }
          obj.visitorPersons = visitorPersons;
          obj.visitDate = this.visitDate;
          obj.visitDays = this.visitDays;
          obj.visitCarnum = this.visitCarnum;
          obj.visitMatters = this.visitMatters;
          obj.orgUserId = this.orgUserId;
          if (obj.visitMatters == 1 || obj.visitMatters == 2) {
            if (obj.visitCarnum == "") {
              Toast("请填写车号！");
              return;
            }
          }

          obj.visitContent = this.visitContent;
          obj.visitGoods = this.visitGoods;
          //目前输入的是被访者姓名，后面再改
          obj.interviewerName = this.interviewerName;
          obj.uptDate = this.uptDate;
          if (this.visitorDoor == "") {
            Toast("请选择进厂门口！");
            return;
          } else {
            obj.visitorDoor = this.visitorDoor;
          }
          console.log(obj);
          console.log(this.radioType)
          if(this.radioType == '0'){
             for(var i = 0; i < obj.visitorPersons.length; i++){
            if (
                obj.visitorPersons[i].visitName == "" ||
                obj.visitorPersons[i].visitIdentity == "" ||
                obj.visitorPersons[i].visitPhone == "" 
              ) {
                Toast.fail("请完善未填写的数据");
                return false;
              }
          }
          }else if(this.radioType == '1'){
             for(var i = 0; i < obj.visitorPersons.length; i++){
            if (
                obj.visitorPersons[i].visitName == "" ||
                obj.visitorPersons[i].visitIdentity == "" ||
                obj.visitorPersons[i].visitPhone == "" ||
                obj.visitorPersons[i].permanentAddress == "" ||
                obj.visitorPersons[i].nowAddress == "" ||
                obj.visitorPersons[i].temp == "" ||
                obj.visitorPersons[i].comeDate == "" ||
                obj.visitorPersons[i].localPermanent == "" 
              ) {
                Toast.fail("请完善未填写的数据");
                return false;
              }
          }
          }
         
          var post = Vue.baseService.post(url, obj);
          let that = this;
          post.then(function (e) {
            if (e.isOk) {
              Toast("提交成功");
              that.submitbtn_Disabled = true;
            } else {
              Toast.fail(e.msg);
            }
          });
        })
        .catch(() => {
          // on cancel
          Toast("取消提交成功");
        });
    },
    confirmArea(val) {
      this.showArea = false;
      console.log(val);
      for (var i = 0; i < val.length; i++) {
        if (val[i].name == "" || val[i] == undefined) {
          Toast("请选择完成地区");
          return;
        }
      }
      if (this.area == "") {
        for (var i = 0; i < val.length; i++) {
          if (val[i].name) {
            console.log(val[i].name);
            this.area += val[i].name + "-";
          }
        }
        //把最后一个字符"-"去掉
        this.area = this.area.substring(0, this.area.length - 1);
      } else {
        this.area = "";
        for (var i = 0; i < val.length; i++) {
          if (val[i].name) {
            console.log(val[i].name);
            this.area += val[i].name + "-";
          }
        }
        //把最后一个字符"-"去掉
        this.area = this.area.substring(0, this.area.length - 1);
      }
      console.log(this.area);
      if (this.area == "河北省-唐山市-丰南区") {
        this.localPermanent = '是';
      } else {
        this.localPermanent = '否';
      }
    },
    cancelArea(val) {
      this.showArea = false;
      console.log(val);
    },
    confirmAreaNow(val) {
      this.showAreaNow = false;
      console.log(val);
      for (var i = 0; i < val.length; i++) {
        if (val[i].name == "" || val[i] == undefined) {
          Toast("请选择完成地区");
          return;
        }
      }
      if (this.areaNow == "") {
        for (var i = 0; i < val.length; i++) {
          if (val[i].name) {
            console.log(val[i].name);
            this.areaNow += val[i].name + "-";
          }
        }
        //把最后一个字符"-"去掉
        this.areaNow = this.areaNow.substring(0, this.areaNow.length - 1);
      } else {
        this.areaNow = "";
        for (var i = 0; i < val.length; i++) {
          if (val[i].name) {
            console.log(val[i].name);
            this.areaNow += val[i].name + "-";
          }
        }
        //把最后一个字符"-"去掉
        this.areaNow = this.areaNow.substring(0, this.areaNow.length - 1);
      }
    },
    cancelAreaNow(val) {
      this.showAreaNow = false;
      console.log(val);
    },

    focusAreaNow() {
      this.showAreaNow = true;
    },
    gainIdCard(val) {
      console.log(val);
      this.visitIdentity = val;
    },
    inputFullAddress(val) {
      console.log(val);
      this.fullAddress = val;
    },
    inputFullAddressNow(val) {
      console.log(val);
      this.fullAddressNow = val;
    },
    getBirthdayFromIdCard(idCard) {
      var birthday = "";
      if (idCard != null && idCard != "") {
        if (idCard.length == 15) {
          birthday = "19" + idCard.substr(6, 6);
        } else if (idCard.length == 18) {
          birthday = idCard.substr(6, 8);
        }

        birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
      }

      return birthday;
    },
    //计算年龄
    getAge(str) {
      var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})/);
      if (r == null) return false;

      var d = new Date(r[1], r[3] - 1, r[4]);
      var returnStr = "输入的日期格式错误！";

      if (
        d.getFullYear() == r[1] &&
        d.getMonth() + 1 == r[3] &&
        d.getDate() == r[4]
      ) {
        var date = new Date();
        var yearNow = date.getFullYear();
        var monthNow = date.getMonth() + 1;
        var dayNow = date.getDate();

        var largeMonths = [1, 3, 5, 7, 8, 10, 12], //大月， 用于计算天，只在年月都为零时，天数有效
          lastMonth = monthNow - 1 > 0 ? monthNow - 1 : 12, // 上一个月的月份
          isLeapYear = false, // 是否是闰年
          daysOFMonth = 0; // 当前日期的上一个月多少天

        if ((yearNow % 4 === 0 && yearNow % 100 !== 0) || yearNow % 400 === 0) {
          // 是否闰年， 用于计算天，只在年月都为零时，天数有效
          isLeapYear = true;
        }

        if (largeMonths.indexOf(lastMonth) > -1) {
          daysOFMonth = 31;
        } else if (lastMonth === 2) {
          if (isLeapYear) {
            daysOFMonth = 29;
          } else {
            daysOFMonth = 28;
          }
        } else {
          daysOFMonth = 30;
        }

        var Y = yearNow - parseInt(r[1]);
        var M = monthNow - parseInt(r[3]);
        var D = dayNow - parseInt(r[4]);
        if (D < 0) {
          D = D + daysOFMonth; //借一个月
          M--;
        }
        if (M < 0) {
          // 借一年 12个月
          Y--;
          M = M + 12; //
        }

        if (Y < 0) {
          returnStr = "出生日期有误！";
        } else if (Y === 0) {
          if (M === 0) {
            returnStr = D + "D";
          } else {
            returnStr = M + "M";
          }
        } else {
          if (M === 0) {
            returnStr = Y + "Y";
          } else {
            returnStr = Y + "Y" + M + "M";
          }
        }
      }

      return returnStr;
    },
    inputTemp(val) {
      this.temp = val;
    },
    inputCompany(val) {
      this.company = val;
    },
    clickBox(val) {
      this.hightDangerArea = val.toString();
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
  width: 30%;
  border: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  .sub,
  .add,
  .num {
    line-height: 1.25rem;
  }
  .sub,
  .add {
    transform: scale(1.5, 1.5) translateY(-0.3vw);
    height: 38px;
    line-height: 38px;
    width: 80px;
    text-align: center;
  }
  .num {
    border-left: 1px solid #e5e5e5;
    border-right: 1px solid #e5e5e5;
    padding-left: 20px;
    height: 38px;
  }

  .light {
    color: #e5e5e5;
  }
}
</style>

