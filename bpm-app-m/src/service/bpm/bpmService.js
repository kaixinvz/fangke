import Vue from 'vue'
import {baseService,arrayTools} from '@/service/common/baseService'
import tools from '@/service/common/tools'
import { Toast } from 'mint-ui';
import formService from '@/service/form/formService'
import opinionDialog from '@/components/bpm/opinionDialog' 
import taskOpinionHistory from '@/components/bpm/opinionHistoryDialog.vue'
import instanceImageDialog from '@/components/bpm/instanceImageDialog.vue'
import moment from 'moment'
Vue.component('opinionDialog', opinionDialog) 
Vue.component('opinion-history-dialog', taskOpinionHistory)
Vue.component('instance-image-dialog', instanceImageDialog) 
var BpmService = {};
/** taskId,instanceId,defId,bpmTask,form,buttons**/
BpmService.data ;
//初始化动作
BpmService.init = function(params,fn){
	this.data = params;
	var dataUrl = Vue.__ctx + "/bpm/task/getTaskData";// taskId=xxx 
	if(!params.taskId){
		dataUrl =  Vue.__ctx +"/bpm/instance/getInstanceData";//?defId="+defId+"&instanceId="+instanceId+"&readonly="+param.readonly;
	} 
	var defer = baseService.postForm(dataUrl,params);
	Vue.tools.getResultData(defer,function(data){
		if(fn)fn(data); 
		Vue.tools.extend(data,BpmService.data);
	},"alert",function(){
		// Vue.$router ? this.$router.back() : window.history.back();
		Vue.$router.push('/')
	});
};

//获取表单的数据
BpmService.getFormData = function(custFormContext,button){
	var validateForm = "start,agree,oppose".indexOf(button.alias)!=-1;
	var frmType = this.data.form.type;
	if(frmType=='INNER'){
		var errorMsg = formService.getValidateMsg(custFormContext);
		if(errorMsg && validateForm){
			Vue.$vux.alert.show({  title: '表单校验提示',  content: errorMsg})
			return false; 
		}
		return custFormContext.data;
	}else{
		alert("TODO 移动端URL表单")
	}
};

BpmService.getSubmitFlowParam = function(){
	if(!this.data){
		alert("error");
		return;
	}
	
	if(this.data.task) {
		return {"taskId":this.data.taskId,instanceId:this.data.task.instId};
	}
	
	return {
			defId: this.data.defId,
			instanceId: this.data.instanceId
		}
}
/**
 * 流程按钮解析。
 * 关于按钮样式，对话框宽高属性，不做可配置行，因为前段无法统一，
 * 但是、请求资源路径要求一致，比如/bpm/task/   /bpm/instance.
 * 前缀自己前段控制
 */
Vue.component('bpmButtons',{
	 props: ['buttons'],
	 data:function(){
		 return { 
		 
		 }
	 },
	 methods:{
		 buttonClick : function(button){  
			  
				this.$vux.loading.show({ text: 'Loading' }) 
				//执行前置js
				if(!this.execuFn(button.beforeScript)){
				
					 return;
				 } 
				//获取流程数据
				var custFormContext = getCustFormComponent(this.$parent);
				 
				//如果自定义表单定义了 custValid表单组件的function 则执行返回 false 则不提交
				if(custFormContext.custValid){
					if(custFormContext.custValid()===false){
						this.$vux.loading.hide();
						return;
					}
				}
				var busData = BpmService.getFormData(custFormContext,button);
				if(busData === false){//获取数据失败
					this.$vux.loading.hide();
					return;
				}
				var scope = this;
				var flowData = BpmService.getSubmitFlowParam(); 
				if(this.$parent.form.name=="pcrw1"){ 
					 let itemData=null
					 if(custFormContext&&custFormContext.isitem){
						itemData={'pcrw':custFormContext.isitem};
					 }else{
						itemData=busData
					 } 
					flowData.data=itemData;
				}else if(this.$parent.form.name=="培训计划"){
					flowData.data = busData;
				} 
				else if(this.$parent.form.name=="风险管控清单"){
					flowData.data = busData;
				} 
				flowData.action =  button.alias; 
				//获取更多完成动作配置
				if( button.configPage){
					this.$vux.loading.hide();
					var componentKey = "opinion-dialog";
					if( "taskOpinion" === button.alias){ componentKey = "opinion-history-dialog" }
					if( "flowImage" === button.alias){ componentKey = "instance-image-dialog" }
					
					var formContext = this.$parent;
					if(formContext.dynamicComponent.key === componentKey && componentKey != "opinion-dialog" ){
						formContext.dynamicComponent.show = true;
						return;
					}
					
					formContext.dynamicComponent = {
						show:true,
						key :componentKey,
						flowParam:flowData,
						callback:function(data){
							 
							scope.postAction(data); 
						}
					};
				}else{
					scope.postAction(flowData); 
				}
			},
			postAction : function(flowData){   
			
				 
				let that=this; 
			 
				if(flowData.data['aqpxjh']){ 
					this.$vux.loading.show({ text: 'Loading' })
					var url =  Vue.__ctx + (flowData.taskId ? "/bpm/task/doAction":"/bpm/instance/doAction");
					var defer = Vue.baseService.post(url,flowData).then(function(result){
						  that.$vux.loading.hide(); 
						 Vue.tools.getResult(result,function(){ 
							 Vue.$router ? this.$router.back() : window.history.back();
						 },"alert","alert",function(status){
						   alert("加载失败！"+status,2);
						 });
					 });
				}else if(flowData.data['fxgkqd']){
					 const {
						 lcfzrbm,
						 lcfzrxm
					 }=flowData.data.fxgkqd;
					 flowData.data.fxgkqd.sglx=JSON.stringify(flowData.data.fxgkqd.sglx);
					this.$vux.loading.show({ text: 'Loading' })
					if(!lcfzrbm&&!lcfzrxm){
						that.$vux.loading.hide(); 
						Toast({
							message: '请选择审批人',
							position: 'middle',
							duration: 3000
						});
						return;
					} 
					var url =  Vue.__ctx + (flowData.taskId ? "/bpm/task/doAction":"/bpm/instance/doAction");
					var defer = Vue.baseService.post(url,flowData).then(function(result){
						  that.$vux.loading.hide(); 
						 Vue.tools.getResult(result,function(){ 
							 Vue.$router ? this.$router.back() : window.history.back();
						 },"alert","alert",function(status){
						   alert("加载失败！"+status,2);
						 });
					 });
				}else {
				
					let jsonList={...flowData}; 
					this.$vux.loading.show({ text: 'Loading' })  
					//  撤回  

					if(jsonList.data.pcrw.lczt>=1&&jsonList.data.pcrw<=4){ 
						jsonList.data.pcrw.zgqdList[0].zgrq=moment(new Date(jsonList.data.pcrw.zgqdList[0].zgrq)).format('YYYY-MM-DD'); 
					} 
					if(typeof jsonList.data.pcrw.zgqdList[0].zgrq =='object'){
						jsonList.data.pcrw.zgqdList[0].zgrq=moment(new Date(jsonList.data.pcrw.zgqdList[0].zgrq)).format('YYYY-MM-DD');
					}
					

				
					//去掉验证 流程状态3 解决 厂长选择整改人 提示未选择
				   if(jsonList.data.pcrw.zgrxm&&jsonList.data.pcrw.zgrbm&&jsonList.data.pcrw.rwlx!='lsrw'){ 
					//存储 整改人  或  整改人下级   字段
					if(jsonList.data.pcrw.lczt==="2"||jsonList.data.pcrw.lczt==="3"||jsonList.data.pcrw.lczt==="4"||jsonList.data.pcrw.lczt==="1"&&jsonList.data.pcrw.lczt==="1"){
						  
						 
						jsonList.data.pcrw.zgqdList[0]['zgr']=jsonList.data.pcrw.zgrxm||jsonList.data.pcrw.zgr;
							jsonList.data.pcrw.zgqdList[0]['zgrbm']=jsonList.data.pcrw.zgrbm;
						 
					}else{ 
							jsonList.data.pcrw.zgqdList[0]['qtzgrxm']=jsonList.data.pcrw.zgrxm||jsonList.data.pcrw.zgr;
							jsonList.data.pcrw.zgqdList[0]['qtzgrbm']=jsonList.data.pcrw.zgrbm;
					}
					 
				   } 
				   	// 低风险 整改人是责任人  绑定
				   if(jsonList.data.pcrw.lczt==="7"&&jsonList.data.pcrw.fxjb===1){
						jsonList.data.pcrw.zgqdList[0]['zgr']=jsonList.data.pcrw.zrrmc;
						jsonList.data.pcrw.zgqdList[0]['zgrbm']=jsonList.data.pcrw.zrrbm;
						if(!jsonList.data.pcrw.lcfzrxm&&!jsonList.data.pcrw.lcfzrbm){
							that.$vux.loading.hide();
							Toast({
								message: '请选择上级人员',
								position: 'middle',
								duration: 5000
							  });
							return;
						}
				   } 
					if(jsonList.data.pcrw.lczt===10&&jsonList.data.pcrw.zgqdList[0].fczt){
						jsonList.data.pcrw.zgqdList[0].fcrq=moment().format('YYYY-MM-DD hh:mm:ss ');
					}
					let action=jsonList.action;
					if(jsonList.data.pcrw.rwlx!='lsrw'&&action=="agree"){ 
						const {lczt,fxjb,lcfzrxm,lcfzrbm}=jsonList.data.pcrw;
						if(lczt==2&&fxjb==3||lczt==2&&fxjb==4||lczt==3&&fxjb==4){
							that.$vux.loading.hide();
							if(!lcfzrxm&&!lcfzrbm){
								Toast({
									message: '请选择上级人员',
									position: 'middle',
									duration: 5000
								  });
								return;
							}
							 
						} 
					}

					if(jsonList.data.pcrw.lczt==='5'&&jsonList.data.pcrw.zgqdList[0].zgzt==='延期'||jsonList.data.pcrw.lczt==='6'&&jsonList.data.pcrw.zgqdList[0].zgzt==='延期'||jsonList.data.pcrw.lczt==='7'&&jsonList.data.pcrw.zgqdList[0].zgzt==='延期'){
						if(!jsonList.data.pcrw.zgqdList[0].wwccs||!jsonList.data.pcrw.zgqdList[0].wwcfa){
							that.$vux.loading.hide();
							Toast({
								message: '请填写未完成方案或措施',
								position: 'middle',
								duration: 5000
							  });
							return;
						}
					}
					
					if(jsonList.action==="reject"){ 
						if(jsonList.data.pcrw.lczt===8){
							jsonList.data.pcrw.zgqdList[0]['sjfczt']=2;
						}else if(jsonList.data.pcrw.lczt===10){
							jsonList.data.pcrw.zgqdList[0]['fczt']=2;
						}else if(jsonList.data.pcrw.lczt===9){
							jsonList.data.pcrw.zgqdList[0]['zyryfczt']=2;
						} 
					}else if(jsonList.action==="turn"){ 
						let rwlx=jsonList.data.pcrw.rwlx;
						if(rwlx=='lsrw'){ 
							let nodeUsers=jsonList.nodeUsers;
							let isKey=''
							for (let key in nodeUsers) { 
								isKey=key;
							}
							const user=jsonList.nodeUsers[isKey][0].name;
							const userId=jsonList.nodeUsers[isKey][0].id;
							jsonList.data.pcrw.yhcjzrmc=user;
							jsonList.data.pcrw.yhcjzrbm=userId; 
						}else{
							if(jsonList.data.pcrw.lczt==="2"&&jsonList.data.pcrw.fxjb==2){
								let nodeUsersInfo=jsonList.nodeUsers;
								let isKey=''
								for (let key in nodeUsersInfo) {  
									isKey=key;
								}  
								const user=jsonList.nodeUsers[isKey][0].name;
								const userId=jsonList.nodeUsers[isKey][0].id; 
								jsonList.data.pcrw.lcfzrxm=user;
								jsonList.data.pcrw.lcfzrbm=userId; 
							}
						} 
					}else{ 
                       	//整改阶段验证 是否选择整改人
					if(jsonList.data.pcrw.rwlx=='lsrw'){ 
						const userID=localStorage.getItem('userID')
						const {lczt,yhcjzrbm}=jsonList.data.pcrw; 
						let zgrxm,zgrbm,zgr;
						if(jsonList.data.pcrw.zgrxm){
							zgrxm=jsonList.data.pcrw.zgrxm;
							zgrbm=jsonList.data.pcrw.zgrbm;
							zgr=jsonList.data.pcrw.zgr; 
						}else{
							zgrxm=jsonList.data.pcrw.zgqdList[0].zgrxm;
							zgrbm=jsonList.data.pcrw.zgqdList[0].zgrbm;
							zgr=jsonList.data.pcrw.zgqdList[0].zgr; 
						}
					    
						if(lczt>=1&&lczt<=4&&userID==yhcjzrbm){ 
							if(!zgrxm&&!zgrbm||!zgr&&!zgrbm){
							   that.$vux.loading.hide(); 
							   Toast({
								   message: '请选择整改人员',
								   position: 'middle',
								   duration: 3000
							   });
							   return;
							}  
							if(lczt>=1&&lczt<=4&&userID==yhcjzrbm){ 
								jsonList.data.pcrw.zgqdList[0]['zgr']=zgrxm||zgr;
									jsonList.data.pcrw.zgqdList[0]['zgrbm']=zgrbm;
								 
							}
					   }
					}  
 
						 const {fxjb,lczt,rwlx}=jsonList.data.pcrw
						if(lczt==="1"&&fxjb==1){
							if(!jsonList.data.pcrw['lcfzrxm']&&!jsonList.data.pcrw['lcfzrbm']){
								that.$vux.loading.hide(); 
								Toast({
									message: '请选择上级复查人员',
									position: 'middle',
									duration: 3000
								});
								return;
							} 
						} 
						if(Number(lczt)<5&&rwlx=='lsrw'){ 
							if(!jsonList.data.pcrw['yhdj']){
								that.$vux.loading.hide(); 
								Toast({
									message: '请填写隐患等级',
									position: 'middle',
									duration: 3000
								});
								return;
							} 
							if(!jsonList.data.pcrw['fxjb']){
								that.$vux.loading.hide(); 
								Toast({
									message: '请填写风险级别',
									position: 'middle',
									duration: 3000
								});
								return;
							} 
						}
						 
						if(lczt==5&&fxjb==4||lczt==6&&fxjb==3||lczt==7&&fxjb==2||lczt==7&&fxjb==1||lczt==1&&fxjb==1){
							if(!jsonList.data.pcrw.zgqdList[0]['fa']){
								that.$vux.loading.hide(); 
								Toast({
									message: '请填写整改方案',
									position: 'middle',
									duration: 3000
								});
								return;
							} 
						}
						if(lczt>=8&&lczt<=10){
							if(lczt==8){
								jsonList.data.pcrw.zgqdList[0]['sjfczt']=3;
							}
							if(lczt==9){
								jsonList.data.pcrw.zgqdList[0]['zyryfczt']=3;
							}
							if(lczt==10){
								jsonList.data.pcrw.zgqdList[0]['fczt']=3;
							} 
						}
                        if(lczt>=5&&lczt<=7){
							if(!jsonList.data.pcrw.zgqdList[0]['zghzp']){
								that.$vux.loading.hide(); 
								Toast({
									message: '请填写整改照片',
									position: 'middle',
									duration: 3000
								});
								return;
							} 
						}

						if(jsonList.data.pcrw.lczt==="2"&&jsonList.data.pcrw.fxjb==2&&jsonList.data.pcrw.rwlx!='lsrw'||jsonList.data.pcrw.lczt==="3"&&jsonList.data.pcrw.fxjb==3&&jsonList.data.pcrw.rwlx!='lsrw'||jsonList.data.pcrw.lczt==="4"&&jsonList.data.pcrw.fxjb==4&&jsonList.data.pcrw.rwlx!='lsrw'){
							  
							if(!jsonList.data.pcrw.zgqdList[0]['zgr']&&!jsonList.data.pcrw.zgqdList[0]['zgrbm']){
								that.$vux.loading.hide(); 
								Toast({
									message: '请选择整改人',
									position: 'middle',
									duration: 3000
								});
								return;
							} 
						}
		
		                 switch (lczt) {
							 case 10:
								   //责任人复审
								   jsonList.data.pcrw.zgqdList[0]['zrr']=jsonList.data.pcrw.zrrmc;
								   jsonList.data.pcrw.zgqdList[0]['zrrbm']=jsonList.data.pcrw.zrrbm;
								 break;
							 case 8:
								 //整改人上级复审
								 jsonList.data.pcrw.zgqdList[0]['sjld']=jsonList.data.pcrw.lcfzrxm;
								 jsonList.data.pcrw.zgqdList[0]['sjldbm']=jsonList.data.pcrw.lcfzrbm;
							   break; 
							// case 9:
							//    //其他人复审
							//    break;
						 }
						  
					}     
					// pcrw.put("del_flag","1");  
					let param ={
					   pcrw:jsonList.data.pcrw
					 }     
					 jsonList.data=param;   
					 var url =  Vue.__ctx + (jsonList.taskId ? "/bpm/task/doAction":"/bpm/instance/doAction");
				     
					 ///bpm/instance/delete?id=417949298873597953
					 if(jsonList.action==="delete"){ 
						url= Vue.__ctx + "/bpm/instance/delete?id="+ jsonList.instanceId;
						jsonList=null;

					}
					 
					 var defer = Vue.baseService.post(url,jsonList).then(function(result){
						   that.$vux.loading.hide(); 
						   if(result.code==='200'&&result.isOk){
							Vue.$router ? this.$router.back() : window.history.back();
						   }else{
							Vue.tools.getResult(result,function(){ 
								Vue.$router ? this.$router.back() : window.history.back();
							},"alert","alert",function(status){
							  alert("加载失败！"+status,2);
							});
						   } 
					  });
				} 
				
			},
			execuFn : function(fnStr){  
				if(!fnStr)return true;  
				this.$vux.loading.hide();
				var parentScope = getCustFormComponent(this.$parent); 
				var script = "var tempFunction = function(scope){ "+fnStr+"};"
				var result =  eval(script+"tempFunction(parentScope);"); 
				if(result===false) return false;
				return true;
			},
			getButtonCss:function(alias){
				var  buttonsCss = {
					"start":"icon-success-fa fa fa-send",
					"draft":"icon-primary-fa fa fa-clipboard",
					"save":"icon-primary-fa fa fa-clipboard",
					"agree":"icon-success-fa fa fa-check-square-o",
					"delete":"icon-danger-fa fa fa-check-square-o",
					"oppose":"icon-primary-fa  fa-close",
					"reject":"icon-danger-fa fa fa-lastfm",
					"reject2Start":"icon-danger-fa  fa fa-lastfm",
					"lock":"icon-primary-fa fa fa-lock",
					"unlock":"icon-primary-fa fa fa-unlock",
					"taskOpinion":"icon-primary-fa fa fa-navicon",
					"manualEnd":"icon-primary-fa fa fa-ioxhost",
					"flowImage":"icon-primary-fa fa fa-image",
					"turn":"icon-primary-fa fa fa-mail-forward",
					"reminder":"icon-primary-fa fa  fa-flash",
					"withdraw":"icon-primary-fa fa fa-reply-all",
					"export":"icon-primary-fa fa fa-cloud-download",
				}
				if(buttonsCss[alias])return  buttonsCss[alias];
				return "";
			}
	 },                                                                                                     
	 template:'<tabbar style="position:fixed">                                                                                     						\
		 			<tabbar-item  v-for="btn in buttons" v-if="\'print,\'.indexOf(btn.alias)==-1">                                            \
						 <span slot="icon" :class="getButtonCss(btn.alias)" v-on:click="buttonClick(btn)"></span>													\
					     <span slot="label" v-on:click="buttonClick(btn)">{{btn.name}}</span>																		\
			 		</tabbar-item>                                                                          							\
	 		  </tabbar>',                                                                                   
	
});

function getCustFormComponent(pageComponent){
	for(var i=0,c;c=pageComponent.$children[i++];){ 
		if(c.$options._componentTag==="ab-custom-form"){
			return c;
		}else if(c.$options._componentTag==="CheckTask"){
			return c;
		}
	}
	// 不向下递归
	console.error("页面中找不到 cust-form 的组件！！！");
	return null;
}


function getCustFormComponentStatus(pageComponent){
	for(var i=0,c;c=pageComponent.$children[i++];){ 
	    if(c.$options._componentTag==="CheckTask"){
			return true;
		}
	} 
	return false;
}


export default  BpmService


