// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'

import router from './router/index'
import Mint from 'mint-ui';
// import html2canvas from 'html2canvas'
// import jspdf from 'jspdf'
import { Toast } from 'mint-ui';
import './assets/css/font-awesome/css/font-awesome.min.css'
import './assets/css/weui/weui.css'
import 'mint-ui/lib/style.css'
import './assets/css/glabol.css'
import { setRollingHeight } from './utils/index'
import BaseService from './service/common/baseService'
import Tools from './service/common/tools'
import axios from 'axios'
import wx from 'weixin-js-sdk'
import ViewUI from 'view-design';
// import style
import 'view-design/dist/styles/iview.css';
import Uiicon from '@/components/ui-icon.vue'
import  '@/assets/js/iconfont.js'
import Apiclound from './apiclound';
import {store} from './store'
import 'vant/lib/index.css';
import { NoticeBar ,Dialog ,Tag } from 'vant';
import XdhMap from 'xdh-map'
import 'xdh-map/lib/xdhmap.css'

import Vant from 'vant';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import XEUtils from 'xe-utils'
import VXEUtils from 'vxe-utils'
import VXETable from 'vxe-table';
import 'vxe-table/lib/index.css';
import VXETablePluginMenus from 'vxe-table-plugin-menus'
import VXETablePluginElement from 'vxe-table-plugin-element'
Vue.use(VXETable);
VXETable.use(VXETablePluginMenus);
VXETable.use(VXETablePluginElement);



Vue.use(VXEUtils, XEUtils, { mounts: ['cookie'] })

Vue.use(Vant);
Vue.use(ElementUI);

Vue.use(XdhMap)

Vue.use(Dialog);
Vue.use(NoticeBar);
Vue.use(Tag);


Vue.prototype.Apiclound=Apiclound;
Vue.prototype.wx = wx
Vue.prototype.$axios = axios
Vue.prototype.$setRollingHeight=setRollingHeight;


/**
* 处理控件权限
*
* @param element [type='.class'] calss  id  String
* @param binding   [type='title']  标题  String
* @returns
*/
const $exportPDF=(element,title)=>{
html2canvas(document.querySelector(element)).then(canvas => {
  var pageData = canvas.toDataURL('image/jpeg',1.0);
  const imgTitle = `_doc/${title}.jpg`;

  const div=document.querySelector('#intImg')
  let img=document.createElement('img')
    // img.download=imgTitle;
    img.src=pageData;
    img.style.width="100%"
    img.style.height="100%"
    div.appendChild(img)
  Toast('插入成功');

});
};
 window.$exportPDF=$exportPDF
Vue.use(Mint);
import { LoadingPlugin, ToastPlugin, AlertPlugin,GroupTitle,Cell, Grid,GridItem,XHeader,Popup,TransferDom,XSwitch, Tabbar, TabbarItem,Loading,Flexbox, FlexboxItem,XDialog } from 'vux'
Vue.use(LoadingPlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(ViewUI);
Vue.component('x-header', XHeader)
Vue.component('grid', Grid)
Vue.component('grid-item', GridItem)
Vue.component('group-title', GroupTitle)
Vue.component('cell', Cell)
Vue.directive('transfer-dom', TransferDom)
Vue.component('x-switch', XSwitch)
Vue.component('tabbar', Tabbar)
Vue.component('tabbar-item', TabbarItem)

Vue.component('popup', Popup)
Vue.component('x-dialog', XDialog)

Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
//Vue.use(Vuex)
Vue.use(VueRouter)
Vue.component('ui-icon',Uiicon)
// util 和baseService 直接注入到Vue上
Vue.use(Tools)
Vue.use(BaseService)
// seesion 过期弹框登录
import login from '@/components/user/loginDialog.vue'
Vue.use(login)

//注册AbScroller
import AbScroller from '@/components/form/abScroller.vue';
Vue.component('abScroller', AbScroller);
//注册AbCustDialog
import AbCustDialog from '@/components/form/abCustDialog.vue';
Vue.component('abCustDialog', AbCustDialog);

FastClick.attach(document.body)

Vue.config.productionTip = false

//权限 指令

Vue.directive('permissions',{

  inserted(el,binding){
      const {
        value
      }=binding;
      const orgRole=store.state.orgRole;
      const state=orgRole.some(item=>item.roleName==value)
      if(value&&!state){
          el.parentNode.removeChild(el);
      }
  }
})
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
