import Vue from 'vue'
import App from './App'
import router from './router'
import store from '../store/store';


import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn'); //设置语言 或 moment.lang('zh-cn');
Vue.prototype.$moment = moment;//挂载到当前vue实例对象


import 'ant-design-vue/dist/antd.css';
import Button from 'ant-design-vue/lib/button';
import datePicker from 'ant-design-vue/lib/date-picker';
import Input from 'ant-design-vue/lib/input';
Vue.component(Button.name, Button);
Vue.component(datePicker.name, datePicker);
Vue.component(Input.name, Input);

Vue.use(datePicker)

import url from '../static/js/serviceAPI.config.js'
Vue.prototype.url=url;

import Utils from '../static/js/common.js';
Vue.prototype.utils=Utils;

import Jq from '../static/js/jq.js';
Vue.prototype.jq=Jq;

import fixTab from '../static/js/fixedTable.js';
Vue.prototype.ft=fixTab;


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
