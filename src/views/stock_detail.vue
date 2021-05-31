<template>
  <div>
    <!-- 股票名称信息 -->
    <div class="rank-column">
      <div class="stock-name">
        <h4>{{sname}}</h4>
        <span class="bt-num">{{scode}}</span>
      </div>
      <div class="bottom-border"></div>
    </div>
    <!-- 股票详情 -->
    <div class="rank-detail-list">
      <!-- 时间列表合集 -->
      <ul class="rank-list">
        <!-- 当日详情循环列表 -->
        <li class="list-info bt-line" :class="index == listInxdex ? 'active' : ''" v-for="(value,index) in dataList"
          :key="value.index" @click="openLi(index,value.rq)">
          <!-- 基本信息 -->
          <div class="basic-info clearfix">
            <div class="basic-info-block clearfix">
              <p class="time fl">{{value.rq}}</p>
              <div class="change fr">
                <p :class="[{'add':value.jmmoney > 0},{'min':value.jmmoney < 0},{'':value.jmmoney == 0}]">净额&nbsp;<span
                    class="je">{{utils.numberFormat(value.jmmoney).value}}</span><span>{{utils.numberFormat(value.jmmoney).unit}}</span>
                </p>
                &nbsp;&nbsp;
                <p :class="[{'add':value.chgradio > 0},{'min':value.chgradio < 0},{'':value.chgradio == 0}]"><span
                    v-show="value.chgradio > 0" class="zdf">涨幅+</span><span v-show="value.chgradio < 0"
                    class="zdf">跌幅</span><span class="zdf">{{value.chgradio.toFixed(2)}}</span><span>%</span></p>
              </div>
            </div>
            <div class="hide-info top-line">
              <div class="detail-info1">
                <div class="detail-info1-item clearfix">
                  <p>收盘价 <span class="spj"  :class="[{'add':stockInfo.chgradio > 0},{'min':stockInfo.chgradio < 0}]">{{stockInfo.close_price}}</span></p>
                  <p>换手率 <span>{{stockInfo.dchratio}}%</span></p>
                </div>
                <div class="detail-info1-item clearfix">
                  <p>成交量 <span>{{stockInfo.cjl_value}}</span>{{stockInfo.cjl_unit}}</p>
                  <p>成交额 <span>{{stockInfo.cje_value}}</span>{{stockInfo.cje_unit}}</p>
                </div>
                <div class="rank-reason">
                  <p class="rank-reason-title">上榜理由</p>
                  <div class="rank-reason-info">
                    <p>{{stockInfo.ctypedes}}</p>
                  </div>
                </div>
                <div class="rank-block top-line">
                  <ul>
                    <li>
                      <p class="word">买入总计</p>
                      <p :class="stockInfo.mr_value > 0 ? 'add' : ''"><span class="num">{{stockInfo.mr_value}}</span>{{stockInfo.mr_unit}}</p>
                    </li>
                    <li>
                      <p class="word">卖出总计</p>
                      <p  :class="stockInfo.mc_value > 0 ? 'min' : ''"><span class="num">{{stockInfo.mc_value}}</span>{{stockInfo.mc_unit}}</p>
                    </li>
                    <li>
                      <p class="word">净额</p>
                      <p :class="[{add: stockInfo.je > 0},{min: stockInfo.je < 0}]"><span class="dje num">{{stockInfo.je_value}}</span>{{stockInfo.je_unit}}</p>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="detail-info2">
                <div class="detail-info2-head">
                  <p>买入前五营业部</p>
                  <p>买入/卖出</p>
                </div>
                <ul class="trans-info">
                  <li class="bt-line" v-for="(value,index) in yybInfo.slice(0, 5)" :key="value.id">
                    <div>
                      <p>{{value.short_name}}</p>
                      <ul class="tips" v-if="value.yz_name">
                        <li v-for="(svalue,index) in value.yz_name.split(',')">{{svalue}}</li>
                      </ul>
                    </div>
                    <div>
                      <p :class="value.mrje > 0 ? 'add' : ''"><span class="num mrj">{{value.mrje}}</span>万</p>
                      <p  :class="value.mcje > 0 ? 'min' : ''"><span class="num mcj">{{value.mcje}}</span>万</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="detail-info2">
                <div class="detail-info2-head">
                  <p>卖出前五营业部</p>
                  <p>买入/卖出</p>
                </div>
                <ul class="trans-info">
                  <li class="bt-line" v-for="(value,index) in yybInfo.slice(5, 10)" :key="value.id">
                    <div>
                      <p>{{value.short_name}}</p>
                      <ul class="tips" v-if="value.yz_name">
                        <li v-for="(svalue,index) in value.yz_name.split(',')">{{svalue}}</li>
                      </ul>
                    </div>
                    <div>
                      <p :class="value.mrje > 0 ? 'add' : ''"><span class="num mrj">{{value.mrje}}</span>万</p>
                      <p  :class="value.mcje > 0 ? 'min' : ''"><span class="num mcj">{{value.mcje}}</span>万</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="more_load">
        <img v-show="indexLoad" src="../../static/images/icon/loading.gif" />
        <span v-show="!indexLoad">已经是全部数据了</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        date: "",
        sname: "",
        scode: "",
        page: 1,
        pageSize: 10,
        count: "",
        dataList: [],
        listInxdex: 0,
        stockInfo: {
            dchratio: "",
            chgradio: "",
            close_price: "",
            cjl_value: "",
            cjl_unit: "",
            cje_value: "",
            cje_unit: "",
            ctypedes: "",
            mr_value: "",
            mr_unit: "",
            mcje: "",
            mc_value: "",
            mc_unit: "",
            je: "",
            je_value: "",
            je_unit: ""
        },
        yybInfo: [],
        indexLoad: true
      }
    },
    methods: {
      getStock() {
        this.sname = this.$store.state.sname
        this.scode = this.$store.state.scode
        this.getDetailDate()
        this.getDetailDateHide(this.date)
      },
      getDetailDate() {
        let _this = this
        let stockURL = this.url.stock_detail_date
        axios.get(stockURL, {
          params: {
            'code': _this.scode,
            'page': _this.page,
            'pageSize': _this.pageSize,
          }
        }).then(response => {
          let res = response.data.data.data
          _this.count = response.data.data.count
          _this.date = res[0].rq
          _this.dataList = _this.dataList.concat(res);
          // console.log(res);
        })
      },
      getDetailDateHide(date) {
        let _this = this
        let stockHideURL = _this.url.stock_detail_hide
        axios.get(stockHideURL, {
          params: {
            'code': _this.scode,
            date
          }
        }).then(response => {
          let res = (JSON.parse(response.data)).data
          let stockInfo = res.stock_info[0]
          _this.yybInfo = res.yyb_info
          _this.stockInfo.dchratio = stockInfo.dchratio.toFixed(2)
          _this.stockInfo.chgradio = stockInfo.chgradio
          _this.stockInfo.close_price = stockInfo.close_price
          _this.stockInfo.cjl_value = _this.utils.numberForStock(stockInfo.volume).value
          _this.stockInfo.cjl_unit = _this.utils.numberForStock(stockInfo.volume).unit
          _this.stockInfo.cje_value = _this.utils.numberFormat(stockInfo.turnover).value
          _this.stockInfo.cje_unit = _this.utils.numberFormat(stockInfo.turnover).unit
          _this.stockInfo.ctypedes = stockInfo.ctypedes
          _this.stockInfo.mr_value = _this.utils.numberFormat(stockInfo.bmoney).value
          _this.stockInfo.mr_unit = _this.utils.numberFormat(stockInfo.bmoney).unit
          _this.stockInfo.mc_value = _this.utils.numberFormat(stockInfo.smoney).value
          _this.stockInfo.mc_unit = _this.utils.numberFormat(stockInfo.smoney).unit
          _this.stockInfo.je = stockInfo.bmoney - stockInfo.smoney
          _this.stockInfo.je_value = _this.utils.numberFormat(_this.stockInfo.je).value
          _this.stockInfo.je_unit = _this.utils.numberFormat(_this.stockInfo.je).unit
        })
      },
      openLi(index, date) {
        let _this = this
        let rcHeight = $(".rank-column").height()
        let liHeight = $(".basic-info-block").height() * index
        let scrollTop = rcHeight + liHeight
        if (index == _this.listInxdex) {
          _this.listInxdex = -1
        } else {
          _this.listInxdex = index
          _this.date = date
          _this.getDetailDateHide(_this.date)
        }
        $("html, body").animate({
          scrollTop: scrollTop
        }, 500);
      },
      handleFun(){
        let _this = this;
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        //变量windowHeight是可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        //滚动条到底部的条件
        if (scrollTop + windowHeight == scrollHeight) {
          var length = $(".rank-list > .list-info").length;
          var page = parseInt(length / _this.pageSize);
          if (length < _this.count) {
            _this.page = page + 1
            _this.getDetailDate()
          } else if (length == _this.count) {
            _this.indexLoad = false
          }
        }
      }
    },
    created() {
      this.getStock()
    },
    mounted() {
      window.addEventListener("scroll",this.handleFun)
    },
    beforeDestroy(){
      window.removeEventListener("scroll",this.handleFun)
    }
  };
</script>

<style scoped>
</style>
