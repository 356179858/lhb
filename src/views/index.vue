<template>
  <div class="rank-main">
    <!-- Tab菜单 -->
    <ul class="rank-tab bt-line">
      <li class="active"><span class="stock-rank">龙虎榜单</span><a
          href="http://m.123.com.cn/lhb/stock_rank_unscramble"></a></li>
      <li><span class="stock-hotmoney">游资大佬</span></li>
    </ul>
    <!--龙虎榜单start -->
    <div class="rank-tab-item">
      <!-- 时间选择 -->
      <input type="hidden" id="getNewTime" v-model="dateString">
      <div class="time-picker" id="app-date">
        <span href="javascript:void(0);" @click="getDatePre" class="pre-day" :class="{'no_pre':noPre}">上一日</span>
        <div class="select_date">
          <p @click="openModal">
            <a-date-picker @change="onChange"  v-model="selDateTimes" :locale="zhCN" :disabled-date="disabledDate" />
          </p>
          <span>{{ getWeek }}</span>
        </div>
        <div class="shade-date" v-show="shadeModel" @touchstart="closeModal" @touchmove="closeModal"
          @touchend="closeModal" @click="closeModal">
        </div>
        <span href="javascript:void(0);" @click="getDateNext" class="next-day" :class="{'no_next':noNext}">下一日</span>
      </div>

      <!-- 市场概况 -->
      <div id="marketInfo" class="rank-column">
        <p class="column-title">市场概况</p>
        <ul class="rank-ul">
          <li class="rank-li">
            <p>涨停</p>
            <p><span>{{lhbDate.zt_count}}</span>只</p>
          </li>
          <li class="rank-li">
            <p>炸板</p>
            <p><span>{{lhbDate.zb_count}}</span>只</p>
          </li>
          <li class="rank-li">
            <p>跌停</p>
            <p><span>{{lhbDate.dt_count}}</span>只</p>
          </li>
        </ul>
        <div class="rank-evaluate">
          <div class="rank-evaluate-item">
            <p>涨跌比：<span id="zhdb" class="num">{{lhbDate.rise_count}}/{{lhbDate.fall_count}}</span></p>
            <p>市场人气：<span id="scrq" class="evaluate">{{lhbDate.scrq}}</span></p>
          </div>
          <div class="rank-evaluate-item">
            <p>封板成功率：<span id="fbcgl" class="num">{{lhbDate.fbcgl}}%</span></p>
            <p>封板评分：<span id="fbpf" class="evaluate">{{lhbDate.fbpf}}</span></p>
          </div>
        </div>
      </div>
      <!-- 个股连板详情 -->
      <div id="stockInfo" class="rank-column">
        <p class="column-title">个股连板详情</p>
        <ul id="rankList" class="rank-list">
          <li class="list-info" v-for="(value,index) in lhbDate.lbxq" :key="value.id" @click="openNav(index)">
            <div class="main-info">
              <p>{{lhbDate.lbName[value.type - 1]}}<span class="hidelength">{{value.data.length}}/{{value.count}}</span>
              </p>
            </div>
            <div class="hide-info">
              <div class="hide-info-title">
                <p>股票</p>
                <p>涨幅</p>
              </div>
              <ul class="hide-info-item" v-for="(sValue,sIndex) in value.data" :key="sValue.id">
                <li class="hideLi">
                  <div class="stock_info">
                    <p>{{sValue.sname}}</p>
                    <span>{{sValue.scode}}</span>
                  </div>
                  <p class="add">+{{sValue.zdf.toFixed(2)}}%</p>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <!-- 个股榜单 -->
      <div class="rank-stock" id="rankStock">
        <!-- Tab切换菜单 -->
        <ul class="list-tab">
          <li v-for="(value,index) in lhbDate.listTab" :key="index"
            :class="lhbDate.rank_table == index ? 'active' : '' " @click="rankTable(index)">
            <span>{{value}}</span>
          </li>
        </ul>
      </div>
      <div id="allList" class="fz-table" ref="chatListWrapper">
        <div class="container-fluid">
          <div id="left_div">
            <div id="left_div1">
              <table id="left_table1" class="table table-bordered">
                <tr>
                  <th id="stockNum">
                    <p v-show="lhbDate.rank_stockNum">上榜股票（
                      <span>{{lhbDate.stockNum}}</span>只）
                    </p>
                    <a v-show="!lhbDate.rank_stockNum" @click="cancelSort">取消排序</a>
                  </th>
                </tr>
              </table>
            </div>
            <div id="left_div2">
              <table id="left_table2" class="table table-bordered">
                <tr class="lf_tr" v-for="(value,index) in lhbDate.all_rankList" :key="index">
                  <th>
                    <div class="stock-name">
                      <p>{{value.sname}}</p>
                      <span>{{value.scode}}</span>
                      <span></span>
                    </div>
                    <ul class="stock-tips" id="stockTips" v-if="value.yz_name">
                      <li v-for="(sValue,sIndex) in value.yz_name.split(',').slice(0, 3)" :key="sIndex">
                        {{sValue}}
                      </li>
                    </ul>
                  </th>
                </tr>
              </table>
            </div>
          </div>
          <div id="right_div">
            <div id="right_div1">
              <div id="right_divx">
                <table id="right_table1" class="table table-bordered">
                  <tr>
                    <th class="increase"
                      :class="{ down: lhbDate.zf_down&&lhbDate.zf_sort&&!lhbDate.jmr_sort, 'up': !lhbDate.zf_down&&lhbDate.zf_sort&&!lhbDate.jmr_sort}"
                      @click="zfSort">涨幅</th>
                    <th class="bought"
                      :class="{ down: lhbDate.jmr_down&&lhbDate.jmr_sort&&!lhbDate.zf_sort, 'up': !lhbDate.jmr_down&&lhbDate.jmr_sort&&!lhbDate.zf_sort}"
                      @click="jmrSort">净买入</th>
                    <th>行业板块</th>
                  </tr>
                </table>
              </div>
            </div>
            <div id="right_div2">
              <table id="right_table2" class="table table-bordered">
                <tr class="rt_tr" v-for="(value,index) in lhbDate.all_rankList" :key="index">
                  <td :class="[{add: value.chgradio > 0},{min: value.chgradio < 0}]"><span
                      v-if="value.chgradio > 0">+</span>{{value.chgradio.toFixed(2)}}</span>%</td>
                  <td :class="[{add: value.jmmoney > 0},{min: value.jmmoney < 0}]"><span
                      v-if="value.jmmoney > 0">+</span><span
                      class="jmr_value">{{utils.numberFormat(value.jmmoney).value}}{{utils.numberFormat(value.jmmoney).unit}}</span>
                  </td>
                  <td>{{value.industry || "--"}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="content-null">
          <img src="images/icon/content-null.png" />
          <p>目前暂无数据~</p>
        </div>
        <div class="more_load">
          <img v-show="lhbDate.indexLoad" src="../../static/images/icon/loading.gif" />
          <span v-show="!lhbDate.indexLoad">已经是全部数据了</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import url from '../serviceAPI.config.js'
  import moment from 'moment';
  export default {
    data() {
      const zhCN = {
        "lang": {
          "placeholder": "选择时间",
          "rangePlaceholder": ["Start date", "End date"],
          "today": "今天",
          "now": "Now",
          "backToToday": "Back to today",
          "ok": "确定",
          "clear": "清除",
          "month": "月",
          "year": "年",
          "timeSelect": "Select time",
          "dateSelect": "Select date",
          "monthSelect": "Choose a month",
          "yearSelect": "Choose a year",
          "decadeSelect": "Choose a decade",
          "yearFormat": "YYYY",
          "dateFormat": "M/D/YYYY",
          "dayFormat": "D",
          "dateTimeFormat": "M/D/YYYY HH:mm:ss",
          "monthFormat": "M",
          "monthBeforeYear": false,
          "previousMonth": "Previous month (PageUp)",
          "nextMonth": "Next month (PageDown)",
          "previousYear": "Last year (Control + left)",
          "nextYear": "Next year (Control + right)",
          "previousDecade": "Last decade",
          "nextDecade": "Next decade",
          "previousCentury": "Last century",
          "nextCentury": "Next century"
        }
      }
      return {
        zhCN,
        preLength: 0,
        nextLength: 0,
        shadeModel: false,
        pickerOptions: '',
        firstDateTimes: '',
        lastDateTimes: '',
        selDateTimes: '',
        dateString: '',
        selectDateArr: '',
        nowDate: [],
        weekday: [], // 可选日期配置
        dateFormat: 'YYYY/MM/DD',
        noPre: false,
        noNext: true,
        lhbDate: {
          indexPage: "1",
          indexPageSize: "15",
          date: "",
          zt_count: "",
          zb_count: "",
          dt_count: "",
          fall_count: "",
          rise_count: "",
          fbcgl: "",
          fbpf: "",
          scrq: "",
          lbxq: [],
          lbName: ['一进二', '二进三', '三进四', '四进五', '五进六', '六进七', '七进八', '八进九', '九进十'],
          lbxqShow: false,
          stockNum: "",
          all_rankList: [],
          yz_rankList: [],
          stockTips: [],
          yz_name: [],
          jmr_value: "",
          jmr_unit: "",
          zf_sort: true,
          jmr_sort: false,
          zf_down: true,
          jmr_down: false,
          rank_stockNum: true,
          rank_table: 0,
          listTab: [
            '总榜',
            '游资榜'
          ],
          sname: "chgradio",
          sort: "desc",
          indexLoad: true
        }
      }
    },
    computed: {
      disableDays() {
        let days = []
        days = [...this.weekday]
        days.map(elem => {
          days.push(moment(elem).valueOf())
        })
        return days
      },
      isDisable() {
        return this.disableDays.includes(moment(this.selDateTimes).valueOf())
      },
      getWeek() {
        var dateArray = this.dateString.split("-");
        var date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
        return "周" + "日一二三四五六".charAt(date.getDay());
      }
    },
    methods: {
      closeModal() {
        event.preventDefault();
        this.shadeModel = false
        document.body.classList.remove('overflow-hidden');
        document.removeEventListener('touchmove', this.touchStart, {
          passive: false
        });
        document.body.style.overflow = 'scroll';
      },
      openModal() {
        event.preventDefault();
        this.shadeModel = true
        document.body.classList.add('overflow-hidden');
        document.body.style.overflow = 'hidden';
        document.addEventListener('touchmove', this.touchStart, {
          passive: false
        }); //一般第三个参数可直接填false,true ->
      },
      onChange(date, dateString) {
        this.closeModal();
        this.dateString = dateString;
        // console.log(date, dateString);
        var firstDateTimes = this.firstDateTimes
        var lastDateTimes = this.lastDateTimes
        switch (this.dateString) {
          case firstDateTimes:
            this.noPre = true
            this.noNext = false
            break
          case lastDateTimes:
            this.noNext = true
            this.noPre = false
            break
          default:
            this.noNext = false
            this.noPre = false
            break
        }
        this.getHqData(this.dateString)
        this.lhbDate.rank_table = 0
        this.lhbDate.indexPage = "1"
        this.lhbDate.all_rankList = []
        this.lhbDate.rank_stockNum = true
        this.lhbDate.zf_sort = true
        this.lhbDate.jmr_sort = false
        this.lhbDate.zf_down = true
        this.lhbDate.jmr_down = false
        this.lhbDate.sname = "chgradio"
        this.lhbDate.sort = "desc"
        this.lhbDate.indexLoad = true
        this.getMrData(this.dateString)
      },
      disabledDate(current) {
        return !this.disableDays.includes(current.valueOf())
      },
      getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        let _nowDate = []
        _nowDate.push(currentdate)
        this.nowDate = _nowDate
        return currentdate;
      },
      getDatePre() {
        if (moment(this.selDateTimes).valueOf() > moment(this.weekday[0]).valueOf()) {
          let odata = new Date(
            new Date(this.selDateTimes).getTime() - 24 * 60 * 60 * 1000
          ); //计算当前日期 -1
          this.selDateTimes = this.convertToDate(odata); //格式化日期并赋值
          this.dateString = this.selDateTimes
          this.noNext = false
          var firstDateTimes = this.firstDateTimes
          switch (this.dateString) {
            case firstDateTimes:
              this.noPre = true
              this.noNext = false
              break
            default:
              this.noNext = false
              this.noPre = false
              break
          }
          this.getHqData(this.dateString)
          this.lhbDate.rank_table = 0
          this.lhbDate.indexPage = "1"
          this.lhbDate.all_rankList = []
          this.lhbDate.rank_stockNum = true
          this.lhbDate.zf_sort = true
          this.lhbDate.jmr_sort = false
          this.lhbDate.zf_down = true
          this.lhbDate.jmr_down = false
          this.lhbDate.sname = "chgradio"
          this.lhbDate.sort = "desc"
          this.lhbDate.indexLoad = true
          this.getMrData(this.dateString)
        } else {
          this.utils.toast('没有更多数据了');
          this.noPre = true
        }
        if (!this.isDisable) {
          this.getDatePre()
        }
      },
      getDateNext() {
        if (moment(this.selDateTimes).valueOf() < moment(this.weekday[this.weekday.length - 1])
          .valueOf()) {
          let odata = new Date(
            new Date(this.selDateTimes).getTime() + 24 * 60 * 60 * 1000
          ); //计算当前日期 +1
          this.selDateTimes = this.convertToDate(odata); //格式化日期并赋值
          this.dateString = this.selDateTimes
          this.noPre = false
          var lastDateTimes = this.lastDateTimes
          switch (this.dateString) {
            case lastDateTimes:
              this.noNext = true
              this.noPre = false
              break
            default:
              this.noNext = false
              this.noPre = false
              break
          }
          this.getHqData(this.dateString)
          this.lhbDate.rank_table = 0
          this.lhbDate.indexPage = "1"
          this.lhbDate.all_rankList = []
          this.lhbDate.rank_stockNum = true
          this.lhbDate.zf_sort = true
          this.lhbDate.jmr_sort = false
          this.lhbDate.zf_down = true
          this.lhbDate.jmr_down = false
          this.lhbDate.sname = "chgradio"
          this.lhbDate.sort = "desc"
          this.lhbDate.indexLoad = true
          this.getMrData(this.dateString)
        } else {
          this.utils.toast('当前是最新数据');
          this.noNext = true
        }
        if (!this.isDisable) {
          this.getDateNext()
        }
      },
      convertToDate(date) {
        var date = new Date(date);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        m = m < 10 ? "0" + m : m; //月小于10，加0
        d = d < 10 ? "0" + d : d; //day小于10，加0
        return y + "-" + m + "-" + d;
      },
      getDate() { // axios
        let _this = this
        let dateUrl = url.get_lhb_days
        axios.get(dateUrl).then(response => { //先请求的a接口
            let res = response.data.data;
            _this.weekday = res
            _this.selDateTimes = _this.weekday[_this.weekday.length - 1]
            _this.firstDateTimes = res[0]
            _this.lastDateTimes = res[res.length - 1]
            _this.dateString = _this.selDateTimes
          })
          .then(response => {
            let date = _this.selDateTimes
            this.getHqData(date)
            this.getMrData(date)
          })
          .catch(err => {
            console.log(err);
          })
      },
      getHqData(date) {
        let _this = this
        let hqURL = url.market_hq_url
        axios.get(hqURL, {
          params: {
            date: date
          }
        }).then(response => {
          if (response.data.data.length !== 0) {
            let res = response.data.data
            _this.lhbDate.zt_count = res.zt_count
            _this.lhbDate.zb_count = res.zb_count
            _this.lhbDate.dt_count = res.dt_count
            _this.lhbDate.rise_count = res.rise_count
            _this.lhbDate.fall_count = res.fall_count
            _this.lhbDate.fbcgl = Number(res.zb_rate * 100).toFixed(2);
            if (_this.lhbDate.fbcgl > 70) {
              _this.lhbDate.fbpf = "良好"
            } else if (_this.lhbDate.fbcgl > 50) {
              _this.lhbDate.fbpf = "一般"
            } else {
              _this.lhbDate.fbpf = "较差"
            }
            if (_this.lhbDate.rise_count > 3000) {
              _this.lhbDate.scrq = "很好"
            } else if (_this.lhbDate.rise_count > 2000) {
              _this.lhbDate.scrq = "良好"
            } else {
              _this.lhbDate.scrq = "较差"
            }
            let zds_data = JSON.parse(res.zt_data_stock);
            // 删除数据中第一个
            let new_zds_data = zds_data.filter((val, index, zds_data) => {
              return index !== 0;
            })
            // 删除数据中空数组
            let finalzds_data = new_zds_data.filter(item => {
              return item.data.length > 0
            });
            _this.lhbDate.lbxq = finalzds_data
          }
        })
      },
      getMrData(date) {
        let _this = this
        let mrURL = url.market_ranklist
        let index = _this.lhbDate.rank_table
        axios.get(mrURL, {
          params: {
            'type': index,
            'page': this.lhbDate.indexPage,
            'pageSize': this.lhbDate.indexPageSize,
            'startDate': this.dateString,
            'sname': this.lhbDate.sname,
            'sort': this.lhbDate.sort,
          }
        }).then(response => {
          if (response.data.data.length !== 0) {
            let res = response.data.data
            _this.lhbDate.stockNum = response.data.count
            _this.lhbDate.jmr_value = this.utils.numberFormat(res.jmmoney).value
            _this.lhbDate.jmr_unit = this.utils.numberFormat(res.jmmoney).unit
            //合并成一个新数组
            const newArr = _this.lhbDate.all_rankList.concat(res);
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
            _this.lhbDate.all_rankList = result
            // console.log(_this.lhbDate.all_rankList);
            let thisLi = $("#rankList .list-info");
            thisLi.removeClass("active");
            thisLi.children(".hide-info").stop(true, false).slideUp();
          }
        })
      },
      openNav(index) {
        let timeHeight = $(".time-picker").height();
        let thisLi = $("#rankList .list-info").eq(index);
        // 固定到顶部
        if (!thisLi.hasClass("active")) {
          thisLi.addClass("active").siblings().removeClass("active");
          thisLi.children(".hide-info").stop(true, false).slideDown();
          thisLi.siblings().children(".hide-info").stop(true, false).slideUp();
          $('body,html').animate({
            scrollTop: $("#stockInfo").offset().top - timeHeight * 2
          }, 500);
        } else {
          thisLi.removeClass("active");
          thisLi.children(".hide-info").stop(true, false).slideUp();
        }
      },
      zfSort() {
        let index = this.lhbDate.rank_table
        this.lhbDate.rank_stockNum = !this.lhbDate.rank_stockNum
        this.lhbDate.jmr_sort = false
        if (this.lhbDate.zf_sort) {
          this.lhbDate.zf_down = !this.lhbDate.zf_down
        } else {
          this.lhbDate.zf_sort = true
          this.lhbDate.zf_down = true
        }
        this.lhbDate.sname = "chgradio"
        this.lhbDate.sort = this.lhbDate.zf_down ? "desc" : "asc"
        if (this.lhbDate.zf_down && this.lhbDate.zf_sort) {
          this.lhbDate.all_rankList = this.lhbDate.all_rankList.sort(this.utils.compareDown("chgradio"))
        } else if (!this.lhbDate.zf_down && this.lhbDate.zf_sort) {
          this.lhbDate.all_rankList = this.lhbDate.all_rankList.sort(this.utils.compareUp("chgradio"))
        }
      },
      jmrSort() {
        let index = this.lhbDate.rank_table
        this.lhbDate.rank_stockNum = false
        this.lhbDate.zf_sort = false
        if (this.lhbDate.jmr_sort) {
          this.lhbDate.jmr_down = !this.lhbDate.jmr_down
        } else {
          this.lhbDate.jmr_sort = true
          this.lhbDate.jmr_down = true
        }
        this.lhbDate.sname = "jmmoney"
        this.lhbDate.sort = this.lhbDate.jmr_down ? "desc" : "asc"
        if (this.lhbDate.jmr_down && this.lhbDate.jmr_sort) {
          this.lhbDate.all_rankList = this.lhbDate.all_rankList.sort(this.utils.compareDown("jmmoney"))
        } else if (!this.lhbDate.jmr_down && this.lhbDate.jmr_sort) {
          this.lhbDate.yz_rankList = this.lhbDate.all_rankList.sort(this.utils.compareUp("jmmoney"))
        }
      },
      cancelSort() {
        let index = this.lhbDate.rank_table
        this.lhbDate.rank_stockNum = true
        this.lhbDate.zf_sort = true
        this.lhbDate.jmr_sort = false
        this.lhbDate.zf_down = true
        this.lhbDate.jmr_down = false
        this.lhbDate.sname = "chgradio"
        this.lhbDate.sort = "desc"
        this.lhbDate.all_rankList = this.lhbDate.all_rankList.sort(this.utils.compareDown("chgradio"))
      },
      rankTable(index) {
        this.lhbDate.all_rankList = []
        this.lhbDate.rank_table = index
        this.lhbDate.rank_stockNum = true
        this.lhbDate.jmr_sort = false
        this.lhbDate.zf_sort = true
        this.lhbDate.zf_down = true
        this.lhbDate.jmr_down = false
        this.lhbDate.indexPage = "1"
        this.lhbDate.indexLoad = true
        this.lhbDate.sname = "chgradio"
        this.lhbDate.sort = "desc"
        console.log(this.lhbDate.sort);
        this.getMrData(this.dateString)
        this.lhbDate.all_rankList = this.lhbDate.all_rankList.sort(this.utils.compareDown("chgradio"))
        let timeHeight = $(".time-picker").height();
        let thisLi = $("#rankList .list-info");
        thisLi.removeClass("active");
        thisLi.children(".hide-info").stop(true, false).slideUp();
        setTimeout(function () {
          $('body,html').animate({
            scrollTop: $("#stockInfo").offset().top + timeHeight * 2
          }, 300);
        }, 300);
      },
    },
    created() {
      this.getDate()
      this.jq.indexFix();
    },
    mounted() {
      this.ft.fixTable();
      let _this = this;
      window.onscroll = function() {
        //变量scrollTop是滚动条滚动时，距离顶部的距离
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        //变量windowHeight是可视区的高度
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //变量scrollHeight是滚动条的总高度
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        //滚动条到底部的条件
        if (scrollTop + windowHeight == scrollHeight) {
          var length = $("#left_table2 tr").length;
          var page = parseInt(length / _this.lhbDate.indexPageSize);
          if (length < _this.lhbDate.stockNum) {
            _this.lhbDate.indexPage = page + 1
            _this.getMrData(_this.selDateTimes)
          } else if (length = _this.lhbDate.stockNum) {
            _this.lhbDate.indexLoad = false
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
