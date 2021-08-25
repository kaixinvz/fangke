<template>

</template>

<script>
import Vue from 'vue';

export default {
  	props: ['value'],
  	data :function () {
	    return {
	    }
	},
 	mounted : function(){
 		this.showFile();
 	},
 	methods : {

 		showFile : function(){
 			if(!this.value){
 				return;
 			}
			var list = JSON.parse(this.value);
			var parent = $(this.$el).parent();
			var element = $(this.$el);
			// 增加没有的下载链接
			$.each(list, function(index, file) {
				// 已存在，不存在则增加
				if (parent.find("[fileId='"+file.id+"']").length > 0) {
					return;
				}
				var images="<img style=\"width: 100px; height: 50px\" src="+Vue.__ctx +"/sys/sysFile/download?fileId="+file.id+" "+">";
				var a = $("<a>" + images+ "</a>");
				var href = Vue.__ctx + "/sys/sysFile/download?fileId=" + file.id;
				a.attr("href", href);
				a.attr("fileId", file.id);
				a.attr("style", "margin-right:10px");
				$(element).before(a);
			});
			// // 删除多余的没有的下载链接
			// $.each(parent.find("a[fileId]"), function(index, a) {
			// 	var exist = false;
			// 	var fileId = $(a).attr("fileId");
			// 	$.each(list, function(i, file) {
			// 		if (file.id == fileId) {
			// 			exist = true;
			// 		}
			// 	});
			// 	if (!exist) {
			// 		$(a).remove();
			// 	}
			// });
 		}
 	},
 	watch : {
 		//数据更新时 在td 下增加按钮
 		value : function(newVal,oldVal){
 			if (newVal!=oldVal) {
 				this.showFile();
			}
 		}
 	}
}
</script>
