import Vue from 'vue';
import Vuex from 'vuex';



Vue.use(Vuex);


export default new Vuex.Store({
  // 1. state
  state: {
    sname: "",
    scode: "",
    sId: ""
  },


  mutations: {
    // 保存游资大佬首页点击详情数据
    saveHotmoney(state, path) {
      state.sId = path;
    },

  }
});
