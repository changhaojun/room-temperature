// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import httpClient from './public/server';
import 'muse-ui/lib/styles/base.less';
import { Button, Select, Helpers, TextField,Checkbox,Radio,Switch,theme,DateInput,Picker,Form, AppBar,List, Menu,Icon} from 'muse-ui';
import 'muse-ui/lib/styles/theme.less';
import echarts from 'echarts';

Vue.prototype.$echarts = echarts 

Vue.use(Button);
Vue.use(Select);
Vue.use(Helpers);
Vue.use(TextField);
Vue.use(Checkbox);
Vue.use(Radio);
Vue.use(Switch);
Vue.use(theme);
Vue.use(DateInput);
Vue.use(Picker);
Vue.use(AppBar);
Vue.use(Form);
Vue.use(List);
Vue.use(Icon);
Vue.use(Menu);

Vue.config.productionTip = false;
Vue.use(ElementUI)
Vue.prototype.$http = httpClient;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
