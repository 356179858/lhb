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
          :key="value.index" @click="openLi(index)">
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
                  <p>收盘价 <span class="spj add">56.99</span></p>
                  <p>换手率 <span>73.97%</span></p>
                </div>
                <div class="detail-info1-item clearfix">
                  <p>成交量 <span>45.86</span>万手</p>
                  <p>成交额 <span>24.47</span>亿元</p>
                </div>
                <div class="rank-reason">
                  <p class="rank-reason-title">上榜理由</p>
                  <div class="rank-reason-info">
                    <p>日换手率达到20%的前5只证券</p>
                  </div>
                </div>
                <div class="rank-block top-line">
                  <ul>
                    <li>
                      <p class="word">买入总计</p>
                      <p class="add"><span class="num">2.21</span>亿</p>
                    </li>
                    <li>
                      <p class="word">卖出总计</p>
                      <p class="min"><span class="num">2.23</span>亿</p>
                    </li>
                    <li>
                      <p class="word">净额</p>
                      <p class="min"><span class="dje num">-185.06</span>万</p>
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
                  <li class="bt-line">
                    <div>
                      <p>机构专用</p>
                      <ul class="tips"></ul>
                    </div>
                    <div>
                      <p class="add"><span class="num mrj">5418.09</span>万</p>
                      <p class="min"><span class="num mcj">4147.64</span>万</p>
                    </div>
                  </li>
                  <li class="bt-line">
                    <div>
                      <p>东方财富证券拉萨团结路第二</p>
                      <ul class="tips">
                        <li>散户大本营</li>
                      </ul>
                    </div>
                    <div>
                      <p class="add"><span class="num mrj">3892.24</span>万</p>
                      <p class="min"><span class="num mcj">2927.88</span>万</p>
                    </div>
                  </li>
                  <li class="bt-line">
                    <div>
                      <p>机构专用</p>
                      <ul class="tips"></ul>
                    </div>
                    <div>
                      <p class="add"><span class="num mrj">3412.89</span>万</p>
                      <p class="min"><span class="num mcj">2451.11</span>万</p>
                    </div>
                  </li>
                  <li class="bt-line">
                    <div>
                      <p>机构专用</p>
                      <ul class="tips"></ul>
                    </div>
                    <div>
                      <p class="add"><span class="num mrj">3367.86</span>万</p>
                      <p class="min"><span class="num mcj">3033.16</span>万</p>
                    </div>
                  </li>
                  <li class="bt-line">
                    <div>
                      <p>招商证券交易单元</p>
                      <ul class="tips"></ul>
                    </div>
                    <div>
                      <p class="add"><span class="num mrj">3172.19</span>万</p>
                      <p class="min"><span class="num mcj">1904.52</span>万</p>
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
                  <li class="bt-line">
                    <div>
                      <p>中国中金财富证券北京宋庄路</p>
                      <ul class="tips"></ul>
                    </div>
                    <div>
                      <p class="add"><span class="num mrj">2825.54</span>万</p>
                      <p class="min"><span class="num mcj">4859.6</span>万</p>
                    </div>
                  </li>
                  <li class="bt-line">
                    <div>
                      <p>机构专用</p>
                      <ul class="tips"></ul>
                    </div>
                    <div>
                      <p class="add"><span class="num mrj">5418.09</span>万</p>
                      <p class="min"><span class="num mcj">4147.64</span>万</p>
                    </div>
                  </li>
                  <li class="bt-line">
                    <div>
                      <p>机构专用</p>
                      <ul class="tips"></ul>
                    </div>
                    <div>
                      <p class="add"><span class="num mrj">3367.86</span>万</p>
                      <p class="min"><span class="num mcj">3033.16</span>万</p>
                    </div>
                  </li>
                  <li class="bt-line">
                    <div>
                      <p>华福证券泉州田安路</p>
                      <ul class="tips"></ul>
                    </div>
                    <div>
                      <p class="add"><span class="num mrj">19.68</span>万</p>
                      <p class="min"><span class="num mcj">2969.64</span>万</p>
                    </div>
                  </li>
                  <li class="bt-line">
                    <div>
                      <p>东方财富证券拉萨团结路第二</p>
                      <ul class="tips">
                        <li>散户大本营</li>
                      </ul>
                    </div>
                    <div>
                      <p class="add"><span class="num mrj">3892.24</span>万</p>
                      <p class="min"><span class="num mcj">2927.88</span>万</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        sname: "",
        scode: "",
        page: 1,
        pageSize: 10,
        count: "",
        dataList: [],
        listInxdex: 0
      }
    },
    methods: {
      getStock() {
        this.sname = this.$store.state.sname
        this.scode = this.$store.state.scode
        this.getDetailDate()
      },
      getDetailDate() {
        let _this = this
        let stockURL = this.url.hotmoney_stock_page
        axios.get(stockURL, {
          params: {
            'code': _this.scode,
            'page': _this.page,
            'pageSize': _this.pageSize,
          }
        }).then(response => {
          let res = response.data.data.data
          _this.count = response.data.data.count
          console.log(res);
          _this.dataList = res
        })
      },
      openLi(index) {
        let rcHeight = $(".rank-column").height()
        let liHeight = $(".basic-info-block").height() * index
        let scrollTop = rcHeight + liHeight
        if (index == this.listInxdex) {
          this.listInxdex = -1
        } else {
          this.listInxdex = index
        }
        $("html, body").animate({scrollTop:scrollTop}, 500);
      }
    },
    created() {
      this.getStock()
    },
    mounted() {

    },
    beforeDestroy() {

    },
  };
</script>

<style scoped>
</style>
