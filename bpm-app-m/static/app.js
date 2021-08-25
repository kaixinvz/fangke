mui.plusReady(function(){
    var deviceId = plus.push.getClientInfo().clientid; 
    localStorage.setItem("deviceId",deviceId)
	plus.push.addEventListener('click', function(msg){  
		 alert("监听系统通知栏消息");
		 console.log("1111")
	}, false); 
		//监听接收透传消息事件  
	plus.push.addEventListener('receive', function(msg){  
	    //处理透传消息的业务逻辑代码  
		alert("透传"+msg);
	}, false); 
})

