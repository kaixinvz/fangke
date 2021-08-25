import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
 //  var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
      //   if (ua.match(/MicroMessenger/i) == "micromessenger") {
      //           //在微信中打开
      //           alert('微信公众号打开')
      //   }
const navigatorInfo=navigator.userAgent.toLowerCase();
const userAgent=window.navigator.userAgent.toLowerCase().indexOf('apiclound');
export const store=new Vuex.Store({
     state:{
        isApiClound:userAgent!=-1?true:false,
        getTerminal:{
            WeChat:navigatorInfo.match(/MicroMessenger/i) == "micromessenger",
        },
        orgRole:null,
        orgJob:null,
        Ip:'http://yypt.dhgtgroup.com/',  //  http://aqsk.dhgtgroup.com:8084    http://60.2.116.2:8085/
        userGs:null
     },
     getters:{
     },
     mutations:{
        Get_organization(state,params){
             state.orgRole=params;
        },
        GET_OrgJob(state,params){
            state.orgJob=params;
        },
        SET_Ip(state,params){
            state.Ip=params;
        },
        SET_UserGs(state,params){
            state.userGs=params;
        }
    }
})
