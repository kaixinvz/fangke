import Vue from 'vue'
import { Button,Message,Form,FormItem,Input,Aside,Container,Main,Header,Menu,Submenu,MenuItemGroup,MenuItem,Breadcrumb,
    BreadcrumbItem,Card,Row,Col,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,Popconfirm,Popover,MessageBox,Tag,Dropdown,DropdownItem,DropdownMenu } from 'element-ui'
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
//Vue.prototype.$confirm = Confirm
Vue.use(Button)
Vue.component(Message)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Container)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Popconfirm)
Vue.use(Popover)
Vue.use(Tag)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)


