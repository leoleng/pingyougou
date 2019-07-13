import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, MessageBox } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Message)
Vue.use(Element)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.prototype.$masssge = Message
Vue.prototype.$confirm = MessageBox.confirm