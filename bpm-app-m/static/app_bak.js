//*/ 扩展API是否准备好，如果没有则监听“plusready"事件
if(window.plus){
	alert("isplus");
    plusReady();
}else{ 
	alert("is not plus");
    document.addEventListener( "plusready", plusReady, false );
}
// 扩展API准备完成后要执行的操作
function plusReady(){
	 var pinf = plus.push.getClientInfo();  
	 var cid = pinf.clientid;//客户端标识
	 alert(cid);
	
    var ws = plus.webview.currentWebview(); //pw回车可输出plus.webview
	//监听系统通知栏消息点击事件  
	plus.push.addEventListener('click', function(msg){  
		 alert("监听系统通知栏消息");
		 console.log("1111")
	}, false); 
		//监听接收透传消息事件  
		plus.push.addEventListener('receive', function(msg){  
		    //处理透传消息的业务逻辑代码  
					  alert("透传"+msg);
			
		}, false); 
    // ... code
} 
function openNewPage(){
	var url = "http://www.baidu.com";
	plus.webview.create(url).show();
}
	document.addEventListener('plusready', function(){  
	    // 页面加载时触发  
	  /*  var pinf = plus.push.getClientInfo();  
	    var cid = pinf.clientid;//客户端标识
		console.log(pinf.clientid);
		alert(cid); */
		console.log("1111")
		plus.push.addEventListener('click', function(msg){  
			 alert("监听系统通知栏消息1111");
			 console.log("22222")
		}, false); 
	}, false ); 
*/