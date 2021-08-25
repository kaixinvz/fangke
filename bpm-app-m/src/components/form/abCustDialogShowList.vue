<template>
  <div>
    <!--<ab-scroller :url="url" :list="rows" :pageSize="dialog.pageSize" :conditions="conditions">   -->
    <div style="height: 432px;overflow-y: auto;">
      
      <group>
        <flexbox :gutter="0">
          <flexbox-item span="120">
            <selector v-model="condition" :options="conditions" placeholder="姓名"></selector>
          </flexbox-item>
          <flexbox-item>
            <x-input v-model="findInput" placeholder="请输入" @on-enter="find"></x-input>
          </flexbox-item>
        </flexbox>
      </group>
      <x-table :cell-bordered="true" style="background-color:#fff;">
        <thead style="background-color: #F7F7F7">
          <tr>
            <th></th>
            <th v-for="(field,index) in dialog.displayFields" :key="index">
              {{field.showName}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id" v-on:click="check(row)">
            <td><input :type="isCheckbox?'checkbox':'radio'" name="radios" :value="row" v-model="row.checked"> </td>
            <td v-for="(field,index) in dialog.displayFields" :key="index">
              {{row[field.columnName]?row[field.columnName]:"-"}}</td>
          </tr>
        </tbody>
      </x-table> 
      <InfiniteLoading :on-infinite="onInfinite" ref="infiniteLoading"> </InfiniteLoading>

    </div>
    <!-- </ab-scroller> -->
  </div>
</template>

<script>
  import Vue from "vue";
  import InfiniteLoading from 'vue-infinite-loading';
  import {
    XTable
  } from 'vux';
  Vue.component('x-table', XTable);
  import {
    LoadMore
  } from 'vux';
  Vue.component('loadMore', LoadMore);
  import {
    XButton
  } from 'vux';
  Vue.component('x-button', XButton);
  export default {
    name: "abCustDialogShowList",
    props: ["dialog", "initData", "isCheckbox", "dynamic","isdyKey" ], //dialog:列表对话框
    data: function () {
      return {
        listData: [], //列表数据
        url: "", //获取数据的url地址
        rows: [],
        condition: "",
        findInput: '',
        page: 0,
        total: 0,
		conditions: [],
		dynamicKey:""
      }
    },
    
    created: function () {
     
      this.getList();
    },
    methods: {
      getList() {
		  
        if (this.dialog) {
          this.url = "/form/formCustDialog/listData_" + this.dialog.key;
        }
        //拼装查询条件
        var that = this;
        this.dialog.conditionFields.forEach(function (field) {
          var json = {};
          json.key = that.getId(field);
          json.value = field.showName; 
          that.conditions.push(json);
		}); 
        const post = {
          offset: this.page,
		  limit: '10', 
		  [`${this.isdyKey}^VEQ`]:this.dynamic&&this.dynamicKey.length?this.dynamicKey:undefined
        }
        this.queryData(post);
      },
      queryData(post) {
        //获取对话框数据 
        var url = Vue.__ctx + this.url;
        Vue.baseService.postForm(url, post).then(res => {
          if (res.code === "200" && res.isOk && res.rows.length) {
            this.rows.push(...res.rows);
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          } else {
            //   this.rows=[];
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          }
        })
	  },
	  emptyRows(value){ 
		  this.page=0;
		  this.dynamicKey=value;
		  this.rows.splice(0); //置空数组
		  this.getList();
	  },
      find() {
        this.rows.splice(0); //置空数组
        this.page = this.page + 10;
        const post = {
          offset: 0,
          limit: '10',
          'fullname_^VLK': this.findInput
        }
        this.queryData(post)
      },
      onInfinite() {
		 
        setTimeout(() => {
			
          this.page = this.page + 10;
          const post = {
            offset: this.page,
			limit: '10',
			 ['pxjb^VEQ']:this.dynamic&&this.dynamicKey.length?this.dynamicKey:undefined
          }
          this.queryData(post)
        }, 1000)
      },
      check: function (row) {

        if (this.isCheckbox) {
          //单选
          if (!this.dialog.multiple) {
            this.rows.forEach(function (item) {
              Vue.set(item, "checked", false);
            });
          }
          Vue.set(row, "checked", !row.checked);
        } else {
          //单选
          if (!this.dialog.multiple) {
            this.rows.forEach(function (item) {
              Vue.set(item, "checked", false);
            });
          }
          // 复选框的  
          row["checked"] = true
          this.rows.forEach((item, index, ) => {
            if (item.id_ !== row.id_) {
              item.checked = false;
            }

          })
          this.row = [row]
        }
      },
      rowStyle: function (row) {
        if (row.checked) {
          return {
            backgroundColor: "#F7F7F7"
          }
        }
        return {};
      },
      //获取选中的结果
      getData: function () {
        var data = [];
        var that = this;
        this.rows.forEach(function (row) {
          if (!row.checked) {
            return;
          }
          var json = {};
          that.dialog.returnFields.forEach(function (field) {

            json[field.returnName] = row[field.columnName];
          });

          data.push(json);
        });
        return data;
      },
      /**
       * 判断两个json是否相等 ps：只比较只b中存在的字段
       */
      jsonEqual: function (a, b) {
        if (a === b) {
          return true;
        }
        var allEq = true; //全相等
        var hasOneEq = false; // 有一个字段相等
        for (var key in b) {
          if (a[key] && b[key] && b[key] !== a[key]) {
            allEq = false;
            break;
          }
          if (a[key] && b[key] && b[key] === a[key]) {
            hasOneEq = true;
          }
        }
        return allEq && hasOneEq;
      },
      //获取查询字段的id
      getId: function (field) {
        var id = field.columnName + "^";
        if (field.dbType === "varchar") {
          id += "V";
        }
        if (field.dbType === "number") {
          id += "N";
        }
        if (field.dbType === "date") {
          id += "D";
        }
        id += field.condition;
        return id;
      }
    },
    components: {
      InfiniteLoading,
    },
    watch: {
      //监听dialog对象
      dialog: function (newVal, oldVal) {
        if (!newVal || newVal === oldVal) {
          return;
        }
        this.url = "/form/formCustDialog/listData_" + newVal.key
      },
      rows: function (newVal, oldVal) {
        if (!this.initData) {
          return;
        }
        var that = this;
        this.rows.forEach(function (row) {
          that.initData.forEach(function (item) {
            if (item.inited) {
              return;
            }

            //处理返回字段的返回名映射为字段名
            var itemTemp = {};

            for (var key in item) {
              var val = item[key];
              var isMatch = false;
              that.dialog.returnFields.forEach(function (field) {
                if (field.returnName === key) {
                  itemTemp[field.columnName] = val;
                  isMatch = true;
                }
              });
              if (!isMatch) {
                itemTemp[key] = val;
              }
            }

            if (that.jsonEqual(row, itemTemp)) {
              Vue.set(row, "checked", true);
              item.inited = true; //标记已经初始化过
            }
          });
        });
      }
    }
  }

</script>



<!-- <template>
<div>
	<ab-scroller :url="url" :list="rows" :pageSize="dialog.pageSize" :conditions="conditions">
		<x-table :cell-bordered="true"  style="background-color:#fff;">
		<thead style="background-color: #F7F7F7">
			<tr>
				<th></th>
				<th v-for="field in dialog.displayFields">
					{{field.showName}}
				</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="row in rows" v-on:click="check(row)">
				<td><input type="checkbox" v-model="row.checked"> </td>
				<td v-for="field in dialog.displayFields">{{row[field.columnName]?row[field.columnName]:"-"}}</td>
			</tr>
		</tbody>
		</x-table>
	</ab-scroller>
</div>
</template>

<script>
import Vue from "vue";
import { XTable } from 'vux';
Vue.component('x-table', XTable);
import { LoadMore } from 'vux';
Vue.component('loadMore', LoadMore);
import { XButton } from 'vux';
Vue.component('x-button', XButton);

export default {
	name:"abCustDialogShowList",
 	props:["dialog","initData"],//dialog:列表对话框
	data: function () {
	  return {
		  listData:[],//列表数据
		  url:"",//获取数据的url地址
		  rows : [],
		  conditions:[]
	  }
	},
	created : function(){ 
		if(this.dialog){
			this.url = "/form/formCustDialog/listData_"+this.dialog.key;
		}
		//拼装查询条件
		var that = this;
		this.dialog.conditionFields.forEach(function(field){
			var json = {};
			json.key = that.getId(field);
			json.value = field.showName;
			that.conditions.push(json);
		});
	},
	 
	methods: {
		check : function(row){
			//单选
			if(!this.dialog.multiple){
				this.rows.forEach(function(item){
					Vue.set(item, "checked", false);
				});
			}
			Vue.set(row, "checked", !row.checked);
		},
		rowStyle : function(row){
			if(row.checked){
				return {
					backgroundColor:"#F7F7F7"
				}
			}
			return {};
		},
		//获取选中的结果
		getData : function(){
			var data = [];
			var that = this;
			this.rows.forEach(function(row){
				if(!row.checked){
					return;
				}
				var json = {};
				that.dialog.returnFields.forEach(function(field){
					json[field.returnName] = row[field.columnName];
				});
				data.push(json);
			}); 
			return data;
		},
		/**
		 * 判断两个json是否相等 ps：只比较只b中存在的字段
		 */
		jsonEqual : function(a, b) {
			if (a === b) {
				return true;
			}
			var allEq = true;//全相等
			var hasOneEq = false;// 有一个字段相等
			for ( var key in b) {
				if (a[key] && b[key] && b[key] !== a[key]) {
					allEq = false;
					break;
				}
				if (a[key] && b[key] && b[key] === a[key]) {
					hasOneEq = true;
				}
			}
			return allEq&&hasOneEq;
		},
		//获取查询字段的id
		getId : function(field) {
			var id = field.columnName + "^";
			if (field.dbType === "varchar") {
				id += "V";
			}
			if (field.dbType === "number") {
				id += "N";
			}
			if (field.dbType === "date") {
				id += "D";
			}
			id += field.condition;
			return id;
		}
	},
	watch : {
		//监听dialog对象
		dialog : function(newVal,oldVal){
			if(!newVal||newVal===oldVal){
				return;
			}
			this.url ="/form/formCustDialog/listData_"+newVal.key
		},
		rows : function(newVal,oldVal){ 
			if(!this.initData){
				return;
			}
			var that = this;
			this.rows.forEach(function(row){
				that.initData.forEach(function(item){
					if(item.inited){
						return;
					}
					
					//处理返回字段的返回名映射为字段名
					var itemTemp = {};
					
					for(var key in item){
						var val = item[key];
						var isMatch = false;
						that.dialog.returnFields.forEach(function(field){
							if(field.returnName===key){
								itemTemp[field.columnName] = val;
								isMatch = true;
							}
						});
						if(!isMatch){
							itemTemp[key] = val;
						}
					}
					
					if (that.jsonEqual(row, itemTemp)) {
						Vue.set(row, "checked", true);
						item.inited = true;//标记已经初始化过
					}
				});
			});
		}
	}
}

</script> -->
