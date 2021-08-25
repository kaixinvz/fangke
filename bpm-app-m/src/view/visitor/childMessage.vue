<template>
  <div>
    <div v-if="show1">
      <div style="display: flex">
      <van-field
        style="margin-left: 10px"
        v-model="obj.visitName"
        label="访客姓名:"
        placeholder="请输访客姓名"
        :readonly="obj.dis_name"
        :required="obj.req_name"
      />
      <van-button
        type="danger"
        size="small"
        style="margin-top: 8px; margin-right: 10px"
        @click="delVisitor"
        :disabled="obj.dis_btn"
        v-if="obj.show_btn"
        >-</van-button
      >
    </div>
    <van-field
      v-model="obj.visitIdentity"
      label="身份证号"
      placeholder="请输入身份证号"
      style="margin-left: 10px"
      @input="gainIdCard"
      :readonly="obj.dis_id"
      :required="obj.req_id"
    />
    <van-field
      v-model="obj.visitPhone"
      label="访客电话"
      placeholder="请输入手机号"
      style="margin-left: 10px"
      :readonly="obj.dis_phone"
      :required="obj.req_phone"
    />
    <div v-if="showEpidemicNews1">
      <van-field 
      v-model="obj.area"
      label="户籍地区"
      placeholder="请选择户籍地区" 
       style="margin-left: 10px"
      @focus="focusArea"
      :readonly="obj.dis_area"
      :required="obj.req_area"
      />
      <van-popup v-model="showArea" position="bottom">
      <van-area
        title="标题"
        :area-list="areaList"
        :columns-placeholder="columnsPlaceholder"
        @confirm="confirmArea"
        @cancel="cancelArea"
      />
    </van-popup>
    </div>
     <van-field
        v-model="obj.fullAddress"
        label="详细住址:"
        placeholder="请输入详细住址"
        style="margin-left: 10px"
        v-if="showEpidemicNews1"
        :readonly="obj.dis_fullAddress"
        :required="obj.req_fullAddress"
      />
       <div v-if="showEpidemicNews1">
        <van-field
          v-model="obj.areaNow"
          label="现住地区:"
          placeholder="请选择现住地区"
          style="margin-left: 10px"
          @focus="focusareaNow"
          :disabled="obj.dis_areaNow"
          :required="obj.req_areaNow"
        />
        <van-popup v-model="showareaNow" position="bottom">
          <van-area
            title="户籍地区:"
            :area-list="areaList"
            :columns-placeholder="columnsPlaceholderNow"
            @confirm="confirmareaNow"
            @cancel="cancelareaNow"
          />
        </van-popup>
      </div>
      <van-field
        v-model="obj.fullAddressNow"
        label="详细现住址:"
        placeholder="请输入详细现住址"
        style="margin-left: 10px"
        @input="inputFullAddressNow"
        v-if="showEpidemicNews1"
        :readonly="obj.dis_fullAddressNow"
      :required="obj.req_fullAddressNow"
      />
      <van-field
        v-model="obj.comeDate"
        label="来丰南日期:"
        placeholder="请选择来丰南日期"
        @click="showCalendarCome = !editFlagCome"
        style="margin-left: 10px"
        v-if="showEpidemicNews1"
        :readonly="obj.dis_comeDate"
      :required="obj.req_comeDate"
      />
      <van-calendar
        v-model="showCalendarCome"
        @confirm="onConfirm"
        :min-date="minDate"
      />
      <van-field
        v-model="obj.temp"
        label="体温:"
        placeholder="请输入体温"
        style="margin-left: 10px"
        @input="inputTemp"
        v-if="showEpidemicNews1"
         :readonly="obj.dis_temp"
        :required="obj.req_temp"
      />
      <van-field
        v-model="obj.company"
        label="所属企业"
        placeholder="请输入所属企业"
        style="margin-left: 10px"
        @input="inputCompany"
        v-if="showEpidemicNews1"
        :readonly="obj.dis_company"
        :required="obj.req_company"
      />
      <div v-if="showEpidemicNews1" style="background: #fff">
        <span style="margin-left: 25px; font-size: 14px"
          >是否去过中高风险地区</span
        >
        <van-checkbox-group
          style="margin-left: 25px; padding-bottom: 5px"
          v-model="obj.radioZgfxdq"
          direction="horizontal"
          @change="clickBox"
        >
          <van-checkbox
            :name="item.name"
            v-for="(item, index) in optionsZgfxdq"
            :key="index"
            :readonly="obj.dis_hightDangerArea"
            :required="obj.req_hightDangerArea"
            >{{ item.name }}</van-checkbox
          >
        </van-checkbox-group>
      </div>
    </div>
    
      <div v-if="show2">
        <van-field
        style="margin-left: 10px"
        v-model="obj.visitName"
        label="访客姓名:"
        readonly
      />
      <van-field
        v-model="obj.visitPhone"
        label="访客电话"
        placeholder="请输入手机号"
        style="margin-left: 10px"
        readonly
      />
      <van-field
        v-model="obj.visitIdentity"
        label="身份证号"
        placeholder="请输入身份证号"
        style="margin-left: 10px"
        readonly
      />
      <van-field
        v-model="obj.permanentAddress"
        label="户籍地址"
        placeholder="请输入户籍地址"
        style="margin-left: 10px"
               rows="1"
  autosize
  type="textarea"
        readonly
      />
      <van-field

        v-model="obj.nowAddress"
        label="现住址"
        placeholder="请输入现住址"
        style="margin-left: 10px"
        rows="1"
  autosize
  type="textarea"
        readonly
      />
      <van-field

        v-model="obj.sex"
        label="性别"
        placeholder="请输入性别"
        style="margin-left: 10px"
        readonly
      />
      <van-field

        v-model="obj.age"
        label="年龄"
        placeholder="请输入年龄"
        style="margin-left: 10px"
        readonly
      />
      <van-field

        v-model="obj.comeDate"
        label="来丰日期"
        placeholder="请输入来丰日期"
        style="margin-left: 10px"
        readonly
      />
      <van-field

        v-model="obj.temp"
        label="体温"
        placeholder="请输入体温"
        style="margin-left: 10px"
        readonly
      />
      <van-field

        v-model="obj.company"
        label="所属企业"
        placeholder="请输入所属企业"
        style="margin-left: 10px"
        readonly
      />
      <van-field

        v-model="obj.hightDangerArea"
        label="是否去过高风险地区"
        placeholder=""
        style="margin-left: 10px"
        readonly
      />
      <van-field

        v-model="obj.localPermanent"
        label="是否为本区户籍"
        placeholder=""
        style="margin-left: 10px"
        readonly
      />
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
export default {
  props: {
    index: {
      type: Number,
      required: true,
    },
    items: {
      type: Array,
      default: Array,
    },
    radioType: {
      type: String,
      default: String,
    },
    company: {
      type: String,
      default: String,
    },
  },
  created() {
    console.log(this.radioType)
    if(this.radioType == 0){
      this.showEpidemicNews1 = false
      this.show1 = true
      this.show2 = false
    }else if(this.radioType == 1){
      this.showEpidemicNews1 = true
      this.show1 = true
      this.show2 = false
      this.obj.company = this.company
    }else if(this.radioType == 2){
      this.show1 = false
      this.show2 = true
    }
    if (this.items != 0) {
      if (this.items[this.index].visitName != "") {
        this.obj = this.items[this.index];
      }
    }
    var url = Vue.__ctx + "/sys/dataDict/getDictData";
    let objZgfxdq = {
      hasRoot: true,
      dictKey: "zgfxdq",
    };
    let that = this
    var postDicZgfxdq = Vue.baseService.postForm(url, objZgfxdq);
    postDicZgfxdq.then((e) => {
      that.optionsZgfxdq = e.data.splice(1, e.data.length);
    });
  },
  data() {
    return {
      obj: {
        visitName: "",
        visitIdentity: "",
        visitPhone: "",
        area:'',
        fullAddress:'',
        areaNow:'',
        fullAddressNow:'',
        nowAddress:'',
        permanentAddress:'',
        radioZgfxdq:[],
        comeDate:'',
        localPermanent:'',
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
      },
      areaList,
      columnsPlaceholder:['请选择', '请选择', '请选择'],
      showArea:false,
      showareaNow:false,
      //疫情相关信息
      showEpidemicNews1:false,
      columnsPlaceholderNow: ["请选择", "请选择", "请选择"],
      sex: "",
      age: "",
      isNotTsPerson: "",     
      //是否去过高风险地区
      hightDangerArea: "",
      //来丰南日期
      comeDate: "",
      minDate: new Date(2010, 0, 1),
      //中高风险地区
      optionsZgfxdq: [],

      showCalendarCome:false,
      editFlagCome:false,
      radioZgfxdq:[],
      show1 : false,
      show2:false,
    };
  },
  watch: {
    obj: {
      handler(newV, oldV) {
        this.$emit("uploadData", { index: this.index, data: newV });
      },
      deep: true,
    },
    items: {
      handler(newV, oldV) {
        if (newV.length !== 0) {
          this.obj = { ...newV[this.index] };
        }
      },
      deep: true,
    },
  },

  methods: {
    delVisitor() {
      this.$emit("func", this.index);
    },
    confirm1Area(val){
      this.showArea = false
      console.log(val)
    },
    cancelArea(val){
      this.showArea = false
      console.log(val)
    },
    focusArea(){
      this.showArea = true
    },
    //使用
    cancelareaNow(val) {
      this.showareaNow = false;
      console.log(val);
    },
    focusArea() {
      this.showArea = true;
    },
    focusareaNow() {
      this.showareaNow = true;
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
      this.obj.fullAddressNow = val;
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
      this.obj.temp = val;
    },
    inputCompany(val) {
      this.obj.company = val;
    },
    clickBox(val) {
      this.obj.hightDangerArea = val.toString();
    },

    cancelArea(val) {
      this.showArea = false;
      console.log(val);
    },
    //使用
    confirmareaNow(val) {
      this.showareaNow = false;
      console.log(val);
      for (var i = 0; i < val.length; i++) {
        if (val[i].name == "" || val[i] == undefined) {
          Toast("请选择完成地区");
          return;
        }
      }
      if (this.obj.areaNow == "") {
        for (var i = 0; i < val.length; i++) {
          if (val[i].name) {
            console.log(val[i].name);
            this.obj.areaNow += val[i].name + "-";
          }
        }
        //把最后一个字符"-"去掉
        this.obj.areaNow = this.obj.areaNow.substring(0, this.obj.areaNow.length - 1);
      } else {
        this.obj.areaNow = "";
        for (var i = 0; i < val.length; i++) {
          if (val[i].name) {
            console.log(val[i].name);
            this.obj.areaNow += val[i].name + "-";
          }
        }
        //把最后一个字符"-"去掉
        this.obj.areaNow = this.obj.areaNow.substring(0, this.obj.areaNow.length - 1);
      }
    },
    onConfirm(date) {
      this.showCalendarCome = false;
      this.obj.comeDate = this.formatDate("YYYY-mm-dd", date);
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
    //使用
    confirmArea(val) {
      this.showArea = false;
      console.log(val);
      for (var i = 0; i < val.length; i++) {
        if (val[i].name == "" || val[i] == undefined) {
          Toast("请选择完成地区");
          return;
        }
      }
      if (this.obj.area == "") {
        for (var i = 0; i < val.length; i++) {
          if (val[i].name) {
            console.log(val[i].name);
            this.obj.area += val[i].name + "-";
          }
        }
        //把最后一个字符"-"去掉
        this.obj.area = this.obj.area.substring(0, this.obj.area.length - 1);
      } else {
        this.obj.area = "";
        for (var i = 0; i < val.length; i++) {
          if (val[i].name) {
            console.log(val[i].name);
            this.obj.area += val[i].name + "-";
          }
        }
        //把最后一个字符"-"去掉
        this.obj.area = this.obj.area.substring(0, this.obj.area.length - 1);
      }
      console.log(this.obj.area);
      if (this.obj.area == "河北省-唐山市-丰南区") {
        this.obj.localPermanent = '是';
      } else {
        this.obj.localPermanent = '否';
      }
    },
    //使用
    cancelArea(val) {
      this.showArea = false;
      console.log(val);
    },
    gainIdCard(val) {
      console.log(val);
      this.obj.visitIdentity = val;
    },
  },
};
</script>

<style>
</style>