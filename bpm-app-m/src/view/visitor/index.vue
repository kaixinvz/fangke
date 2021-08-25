<template>
  <div>
    <div class="sub">
      <van-field
        v-model="visitName"
        placeholder="输入姓名"
        style="width: 18%; margin-left: 5px"
      />
      <span>|</span>
      <van-field
        v-model="visitIdentity"
        maxlength="4"
        placeholder="身份证后4位"
        style="width: 23%"
      />
      <DatePicker
        type="date"
        v-model="visitDate"
        showToday
        placeholder="选择时间"
        style="width: 35%; font-size: 12px"
      ></DatePicker>
      <Button
        type="info"
        @click="search"
        style="width: 10%; margin-left: 10px; font-size: 12px; padding: 0"
        :loading="loading"
        >查询</Button
      >

      <Button
        type="info"
        style="
          color: #fff;
          width: 10%;
          margin-left: 10px;
          margin-right: 5px;
          font-size: 12px;
          padding: 0;
        "
        @click="build"
        >创建</Button
      >
    </div>
    <div class="header1">
      <div class="li" style="width: 18%">被访姓名</div>
      <div class="li" style="width: 20%">被访部门</div>
      <div class="li" style="width: 18%">来访姓名</div>
      <div class="li" style="width: 20%">来访类型</div>
      <div class="li" style="width: 24%">状态</div>
    </div>
    <div class="contentding">
      <div
        class="content"
        v-bind:class="item.isActive ? 'activeClass' : ''"
        v-for="(item, index) in personList"
        :key="index"
        @click="showMessage(index)"
      >
        <div class="contentLi" style="width: 18%">
          {{ item.interviewerName == undefined ? "" : item.interviewerName }}
        </div>
        <div class="contentLi" style="width: 20%">
          {{ item.orgUserDept }}
        </div>
        <div class="contentLi" style="width: 18%">
          {{ item.visitName }}
        </div>
        <div class="contentLi" style="width: 20%">
          {{ item.visitMatters }}
        </div>
        <div class="contentLi" style="width: 24%">
          {{ item.visitState }}
        </div>
      </div>
    </div>
    <van-popup v-model="show_pop">
      <van-image width="200" height="200" :src="imgUrl" />
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";
Vue.use(Toast);
export default {
  data() {
    return {
      personList: [],
      visitName: "",
      visitDate: new Date(),
      //visitDate: '',
      loading: false,
      imgUrl: "",
      show_pop: false,
      Id: "",
      visitIdentity: "",
    };
  },
  created() {
    this.search();
  },
  methods: {
    //显示具体信息
    showMessage(index) {
      let id = this.personList[index].id;
      let that = this;
      let obj_message = {
        id,
      };
      var url = Vue.__ctx + "/visitor/visitorIgnore/select";
      var post = Vue.baseService.post(url, obj_message);
      post.then(function (e) {
        console.log(e)
        that.$router.push({
          path: "/message_edit/",
          query: {
            message: JSON.stringify(e.data),
          },
        });
        localStorage.setItem("id", id);
      });
    },
    search() {
      var visitorDoor = localStorage.getItem("address");

      if (this.visitDate != "") {
        var obj = {
          visitName: this.visitName,
          visitDate: this.formatDate("YYYY-mm-dd", this.visitDate),
          visitIdentity: this.visitIdentity,
          visitorDoor,
        };
        if (visitorDoor.length == 0 || visitorDoor == "undefined") {
          console.log(visitorDoor);
          delete obj.visitorDoor;
        }
      } else {
        var obj = {
          visitName: this.visitName,
          visitDate: "",
          visitIdentity: this.visitIdentity,
          visitorDoor,
        };
        if (visitorDoor.length == 0 || visitorDoor == "undefined") {
          console.log(visitorDoor);
          delete obj.visitorDoor;
        }
      }

      let that = this;
      var url = Vue.__ctx + "/visitor/visitorRecord/selects";
      var post = Vue.baseService.post(url, obj);
      post.then(function (e) {
        //访客状态 0建单 1填单 2 被访者确认 3厂/部长确认 4保卫部长确认 5 进厂 6 出厂 7扣留
        //来访类别  0 普通访问 1驾车访问 2 送货 3高层访问
        for (var i = 0; i < e.data.length; i++) {
          let date1 = Date.parse(e.data[i].createDate);
          let date2 = Date.parse(e.data[i].visitDate);
          if (date2 > date1) {
            e.data[i].interviewerName = e.data[i].interviewerName + "(预约)";
          }
        }
        for (var i = 0; i < e.data.length; i++) {
          if (e.data[i].visitName) {
            var str = e.data[i].visitName.charAt(
              e.data[i].visitName.length - 1
            );

            if (str == ",") {
              e.data[i].visitName = e.data[i].visitName.substring(
                0,
                e.data[i].visitName.lastIndexOf(",")
              );
            }
          }
          if (e.data[i].visitState == 0) {
            e.data[i].visitState = "建单";
          } else if (e.data[i].visitState == 1) {
            e.data[i].visitState = "填单";
          } else if (e.data[i].visitState == 2) {
            e.data[i].visitState = "被访者确认";
          } else if (e.data[i].visitState == 3) {
            e.data[i].visitState = "厂/部长确认";
          } else if (e.data[i].visitState == 4) {
            e.data[i].visitState = "保卫部长确认";
          } else if (e.data[i].visitState == 5) {
            e.data[i].visitState = "进厂";
          } else if (e.data[i].visitState == 6) {
            e.data[i].visitState = "出厂";
          } else if (e.data[i].visitState == 7) {
            e.data[i].visitState = "扣留";
          }
          //else if (e.data[i].visitState == 8) {
          //   e.data[i].visitState = "被访者接见";
          // }
          if (e.data[i].visitMatters == 0) {
            e.data[i].visitMatters = "普通访问";
          } else if (e.data[i].visitMatters == 1) {
            e.data[i].visitMatters = "驾车访问";
          } else if (e.data[i].visitMatters == 2) {
            e.data[i].visitMatters = "送货";
          } else if (e.data[i].visitMatters == 3) {
            e.data[i].visitMatters = "高层访问";
          }
        }
        if (e.data.length === 0) {
          that.personList = [];
          Toast.fail("暂无信息");
          return;
        }
        that.personList = e.data;
      });
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
    },
    build() {
      let that = this;
      let obj = {};
      var url = Vue.__ctx + "/visitor/visitorRecord/save";
      var post = Vue.baseService.post(url, obj);
      post.then(function (e) {
        if (e.isOk) {
          let Id = e.data;
          let obj1 = {
            id: Id,
          };
          var url = Vue.__ctx + "/visitor/visitorRecord/createQrCode";
          Vue.baseService.postForm_blob(url, obj1).then(function (ie) {
            let bytes = new Uint8Array(ie);
            let data = "";
            let len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
              data += String.fromCharCode(bytes[i]);
            }

            that.imgUrl = "data:image/png;base64," + window.btoa(data);
          });
          that.show_pop = true;
        } else {
          Toast.fail(e.msg);
        }
      });
    },
  },
};
</script>

<style lang="less" >
.header1 {
  display: flex;
  width: 100%;
  background-color: #00b7ee;
}
.li {
  text-align: center;
  line-height: 40px;
  height: 40px;
  font-weight: 700;
}
.content {
  display: flex;
  border-bottom: 1px solid #000000;
}
.contentLi {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 20px;
}
.sub {
  height: 50px;
  display: flex;
  align-items: center;
}
.van-cell {
  padding: 10px 0 !important;
}
.activeClass {
  background-color: mediumseagreen;
}
</style>

