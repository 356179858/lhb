<template>
  <!-- 主体内容-->
  <div class="rank-main">
    <!-- 个股榜单 -->
    <div class="hotmoney-tab bt-line">
      <!-- Tab切换菜单 -->
      <ul class="list-tab">
        <li :class="tableIndex == index ? 'active' : ''" v-for="(value,index) in tableName" :key="value.index"
          @click="detailTable(index)">
          <span>{{value}}</span>
        </li>
      </ul>
      <p id="allUp" :class="isShow ? 'active' : ''" v-show="tableIndex == '0'" @click="allHide">全部收起</p>
    </div>
    <!-- Tab操作历史 -->
    <div id="history" class="hotmoney-history" v-show="tableIndex == '0'">
      <ul class="history-box">
        <li v-for="(value,index) in detailList" :key="value.id">
          <div class="date">
            <p class="time">{{value.date}}</p>
            <p class="count">&nbsp;(共<span>{{JSON.parse(value.yz_scode_info).length}}</span>只)</p>
          </div>
          <ul class="hotmoney-card-list hotmony-card-show">
            <li class="hotmoney-card" :class="card_index == sindex&&list_index == index ? 'active' : ''"
              v-for="(svalue,sindex) in JSON.parse(value.yz_scode_info)" :key="svalue.id"
              @click.stop="openTips(index,sindex)">
              <div class="card-block">
                <p class="card-title"><span class="sname">{{svalue.sname}}</span><span
                    class="scode">{{svalue.scode}}</span></p>
                <ul class="card-history">
                  <li class="bt-line">
                    <p>买入总计</p>
                    <p :class="{'add':svalue.mrje > 0}"><span class="num">{{Number(svalue.mrje).toFixed(2)}}</span>万</p>
                  </li>
                  <li class="bt-line">
                    <p>卖出总计</p>
                    <p :class="{'min':svalue.mcje > 0}"><span class="num">{{Number(svalue.mcje).toFixed(2)}}</span>万</p>
                  </li>
                  <li class="bt-line">
                    <p>净额</p>
                    <p class="cdje" :class="[{'add':svalue.je > 0},{'min':svalue.je < 0}]"><span class="num"
                        v-show="svalue.je > 0">+</span><span class="num">{{Number(svalue.je).toFixed(2)}}</span>万</p>
                  </li>
                  <li class="bt-line">
                    <p>方向</p>
                    <div v-if="Number(svalue.je) > 0">
                      <p v-if="Number(svalue.je)/Number(svalue.mrje) >= 0.4">买入</p>
                      <p v-else-if="Number(svalue.je)/Number(svalue.mrje) < 0.4">做T</p>
                    </div>
                    <div v-if="Number(svalue.je) < 0">
                      <p v-if="Math.abs(Number(svalue.je)/Number(svalue.mcje)) >= 0.4">卖出</p>
                      <p v-else-if="Math.abs(Number(svalue.je)/Number(svalue.mcje)) < 0.4">做T</p>
                    </div>
                    <p v-else-if="Number(svalue.je)== 0">做T</p>
                  </li>
                </ul>
                <div class="card-bottom-tips" :class="card_index == sindex&&list_index == index ? 'show' : ''">
                  <ul class="yyb_trade  bt-line">
                    <li v-for="(ssvalue,ssindex) in svalue.yyb_info" :key="ssvalue.id">
                      <p class="tips-title">{{ssvalue.yyb_name}}</p>
                      <div class="tips-trade">
                        <p>买入 <span class="num"
                            :class="ssvalue.mrje > 0 ? 'add' : ''">{{Number(ssvalue.mrje).toFixed(2)}}万</span></p>
                        <p>卖出 <span class="num"
                            :class="ssvalue.mcje > 0 ? 'min' : ''">{{Number(ssvalue.mcje).toFixed(2)}}万</span></p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <a class="detail-btn" javascript="void(0)" @click.stop="checkDetail(svalue.sname,svalue.scode)"><span>查看详情</span></a>
            </li>
          </ul>
        </li>
      </ul>
      <div class="more_load">
        <img v-show="indexLoad" src="../../static/images/icon/loading.gif" />
        <span v-show="!indexLoad">已经是全部数据了</span>
      </div>
    </div>
    <!-- Tab游资介绍 -->
    <div id="introduce" v-show="tableIndex == '1'">
      <div class="rank-column">
        <div class="detail-introduce">
          <p class="name">{{yz_name}}</p>
          <p>{{yz_summary}}</p>
        </div>
      </div>
      <div class="rank-column">
        <div class="detail-introduce">
          <p class="name">专用营业部({{yyb_length}}个)</p>
          <ul>
            <li v-for="(value,index) in detailInfo.yyb_info" :key="value.index">{{value.yz_yyb}}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        page: "1",
        pageSize: "5",
        detailList: [],
        detailInfo: [],
        tableIndex: "0",
        count: "",
        tableName: [
          "操作历史",
          "游资介绍"
        ],
        yz_name: "",
        yz_summary: "",
        yyb_length: "",
        card_index: "-1",
        list_index: "-1",
        isShow: false,
        indexLoad: true
      }
    },
    methods: {
      getHmDetail() {
        this.getdetail()
        this.getInfo()
      },
      getdetail() {
        let _this = this
        let hdpURL = _this.url.hotmoney_detail_page
        let id = _this.$store.state.sId
        axios.get(hdpURL, {
          params: {
            id,
            page: _this.page,
            pageSize: _this.pageSize,
          }
        }).then(response => {
          let res = response.data.data.data
          let count = response.data.data.count
          _this.count = count

          //合并成一个新数组
          const newArr = _this.detailList.concat(res);
          //用于id判断重复
          const temp = {}
          //最后的新数组
          const result = []
          // 遍历item.id去重
          newArr.map((item, index) => {
            if (!temp[item.id]) {
              result.push(item);
              temp[item.id] = true
            }
          })
          _this.detailList = result
        })
      },
      getInfo() {
        let _this = this
        let hdURL = this.url.hotmoney_detail
        let id = this.$store.state.sId
        axios.get(hdURL, {
          params: {
            id
          }
        }).then(response => {
          let res = response.data.data
          _this.detailInfo = res
          _this.yz_name = res.yz_info.yz_name
          _this.yz_summary = res.yz_info.yz_summary
          _this.yyb_length = res.yyb_info.length
        })
      },
      detailTable(index) {
        this.tableIndex = index
      },
      openTips(index, sindex) {
        if (this.list_index == index && this.card_index == sindex) {
          this.list_index = "-1"
          this.card_index = "-1"
          this.isShow = false
        } else {
          this.list_index = index
          this.card_index = sindex
          this.isShow = true
        }
      },
      allHide() {
        this.list_index = "-1"
        this.card_index = "-1"
        this.isShow = false
      },
      checkDetail(sname,scode) {
        let _this = this
        _this.indexLoad = true
        let path = {
          sname,
          scode
        }
        _this.$store.commit('saveStock', path);
        _this.$router.push({
          path: '/stock_detail'
        })
      },
      handleFun() {
        let _this = this;
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        //变量windowHeight是可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        //滚动条到底部的条件
        if (scrollTop + windowHeight == scrollHeight) {
          var length = $(".history-box > li").length;
          var page = parseInt(length / _this.pageSize);
          if (length < _this.count) {
            _this.page = page + 1
            _this.getdetail()
          } else if (length == _this.count) {
            _this.indexLoad = false
          }
        }
      }
    },
    created() {
      this.getHmDetail()
    },
    mounted() {
      window.addEventListener("scroll",this.handleFun)
    },
    beforeDestroy(){
      window.removeEventListener("scroll",this.handleFun)
    },
  };
</script>

<style scoped>
</style>
