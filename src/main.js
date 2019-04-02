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
import VueAMap  from 'vue-amap';

import UserRecord from 'userrecord';
const $record = new UserRecord(7);

// import getUserIP from './public/address'
// getUserIP(ip => {
//     console.log(ip)
// })

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
Vue.use(VueAMap );

Vue.config.productionTip = false;
Vue.use(ElementUI)
Vue.prototype.$http = httpClient;

router.beforeEach((to, from, next) => {
    if(to.path === '/') {
        next();
    }else {
        if(!sessionStorage.getItem('userInfo')) {
            router.replace('/');
        }else {

            const userId = JSON.parse(sessionStorage.getItem('userInfo')).user_id,
                ip = returnCitySN.cip,
                page = to.name;
            $record.track({
                userId,
                ip,
                type:1,
                page
            })
            next();
        }
    }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
VueAMap .initAMapApiLoader({
  // 高德key
  key: 'f2d741c58347b3ac9de107fd34386cb6',
  // 插件集合 （插件按需引入）
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
});
