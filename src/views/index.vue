<template>
  <div>
    <!-- 搜索框 -->
    <div class="rank-head" :class="search ? 'focus' : ''">
      <div class="rank-search-content">
        <div class="rank-search">
          <div class="search-input">
            <span class="icon-search"></span>
            <input id="search" class="h5-search" type="text" placeholder="输入股票名称/代码" @input="onSearch"  @click="searchOpen" v-model="searchItem">
          </div>
          <span class="icon-close" v-if="!searchItem == ''" @click="closeX"></span>
        </div>
        <a class="search-cancel h5-search-cancel"  @click="searchClose">取消</a>
      </div>
    </div>
    <!-- 搜索弹窗 -->
    <div class="search-mask" v-show="search">
    	<!-- 搜索框占位 -->
    	<div class="search-block"></div>
    	<!-- 默认搜索显示 -->
    	<!-- 搜索类型 -->
    	<div class="search-type bt-line">
        <p class="search_menu" v-for="(value,index) in searchTab" :key="index"
          :class="search_table == index ? 'active' : '' " @click="searchTable(index)">{{value}}</span>
        </p>
    	</div>
    	<div class="defalut-search">
    		<!-- 历史搜索 -->
    		<div class="rank-column no-boder">
    			<div></div>
    			<p class="hot-title" v-show="JSON.stringify(this.historyList)!=='[]'&&searchItem == ''">历史搜索</p>
    			<ul class="hot-list clearfix" v-show="JSON.stringify(this.historyList)!=='[]'&&searchItem == ''">
            <li class="border" v-for="(value,index) in this.historyList" :key="index"><a>{{value.split('/')[0]}}</a></li>
          </ul>
    			<div class="content-null" v-show="JSON.stringify(this.historyList)=='[]'&&searchItem ==''">
    				<img src="../../static/images/content-null.png" />
    				<p>暂无搜索记录~</p>
    			</div>
    		</div>
    		<!-- 清空历史搜索 -->
    		<div class="bottom-btn border" v-show="JSON.stringify(this.historyList)!=='[]'&&searchItem == ''">
    			<a class="clear-btn" javascript="void(0)" @click="clearHistory">清空历史搜索</a>
    		</div>
    	</div>
    	<!-- 搜索列表 -->
    	<div class="mask-serach-list">
    		<ul id="search_list" class="search-list" v-show="JSON.stringify(this.searchList) !=='[]'&&!searchNull">
          <li class="bt-line" v-for="(value,index) in searchList" :key="value.index" @click="searchDetail(value)">
            <p v-show="search_table == 0">{{value.sname}}</p>
            <span v-show="search_table == 0">{{value.scode}}</span>
            <p v-show="search_table == 1">{{value.yz_name}}</p>
          </li>
        </ul>
    		<div class="content-null" v-show="searchNull">
    			<img src="../../static/images/content-null.png" />
    			<p>暂时没有找到您想搜索的内容~</p>
    		</div>
    	</div>
    </div>
    <!-- 主体 -->
    <div class="rank-main">
      <!-- Tab菜单 -->
      <ul class="rank-tab bt-line">
        <li class="active" @click.stop="toIndex"><span class="stock-rank">龙虎榜单</span><b @click.stop="toUnscramble"></b>
        </li>
        <li @click.stop="toHotmoney"><span class="stock-hotmoney">游资大佬</span></li>
      </ul>
      <!--龙虎榜单start -->
      <div class="rank-tab-item">
        <!-- 时间选择 -->
        <input type="hidden" id="getNewTime" v-model="dateString">
        <div class="time-picker" id="app-date">
          <span href="javascript:void(0);" @click="getDatePre" class="pre-day" :class="{'no_pre':noPre}">上一日</span>
          <div class="select_date">
            <p @click="openModal">
              <a-date-picker @change="onChange" v-model="selDateTimes" :locale="zhCN" :disabled-date="disabledDate" />
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
                <p>{{lhbDate.lbName[value.type - 1]}}<span
                    class="hidelength">{{value.data.length}}/{{value.count}}</span>
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
                  <tr class="lf_tr" v-for="(value,index) in lhbDate.all_rankList" :key="index"
                    @click="toDetail(value.sname,value.scode)">
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
                  <tr class="rt_tr" v-for="(value,index) in lhbDate.all_rankList" :key="index"
                    @click="toDetail(value.sname,value.scode)">
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
          <div class="content-null" v-if="noDate">
            <img src="../../static/images/content-null.png" />
            <p>目前暂无数据~</p>
          </div>
          <div class="more_load" v-if="!noDate">
            <img v-show="lhbDate.indexLoad" src="../../static/images/icon/loading.gif" />
            <span v-show="!lhbDate.indexLoad">已经是全部数据了</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
        noDate: false,
        search: false,
        searchNull:false,
        searchItem: "",
        searchList: [],
        historyList: [],
        searchTab: [
          '龙虎榜单',
          '游资大佬'
        ],
        search_table: 0,
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
        let dateUrl = this.url.get_lhb_days
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
        let hqURL = this.url.market_hq_url
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
        let mrURL = this.url.market_ranklist
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
          if (response.data.count !== 0) {
            let res = response.data.data
            _this.noDate = false
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
            let thisLi = $("#rankList .list-info");
            thisLi.removeClass("active");
            thisLi.children(".hide-info").stop(true, false).slideUp();
          } else {
            _this.noDate = true
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
        this.getMrData(this.dateString)
        this.lhbDate.all_rankList = this.lhbDate.all_rankList.sort(this.utils.compareDown("chgradio"))
        let timeHeight = $(".time-picker").height();
        let thisLi = $("#rankList .list-info");
        thisLi.removeClass("active");
        thisLi.children(".hide-info").stop(true, false).slideUp();
        setTimeout(function() {
          $('body,html').animate({
            scrollTop: $("#stockInfo").offset().top + timeHeight * 2
          }, 300);
        }, 300);
      },
      //跳转首页
      toIndex() {
        let _this = this
        _this.noDate = false
        _this.lhbDate.indexLoad = true
        _this.$router.push({
          path: '/index'
        })
      },

      //跳转游资大佬页
      toHotmoney() {
        let _this = this
        _this.noDate = false
        _this.lhbDate.indexLoad = true
        _this.$router.push({
          path: '/hotmoney'
        })
      },

      //跳转龙虎榜解读
      toUnscramble() {
        let _this = this
        _this.noDate = false
        _this.lhbDate.indexLoad = true
        _this.$router.push({
          path: '/unscramble'
        })
      },
      //跳转股票详情
      toDetail(sname, scode) {
        let _this = this
        _this.lhbDate.indexLoad = true
        let path = {
          sname,
          scode
        }
        _this.$store.commit('saveStock', path);
        _this.$router.push({
          path: '/stock_detail'
        })
      },
      //获取搜索记录
      getHistoryStock(type) {
        console.log(type);
        if (type == 0) {
          let historyIndexSearchStock = window.localStorage.getItem('historyIndexSearchStock')
          if (historyIndexSearchStock) {
          	let res = historyIndexSearchStock.split('|');
            this.historyList = []
          	this.historyList = res
            console.log("111");
            console.log(this.historyList,"股票");
          }
        } else if(type == 1) {
          let historyIndexSearchHm = window.localStorage.getItem('historyIndexSearchHm')
          if (historyIndexSearchHm) {
          	let res = historyIndexSearchHm.split('|');
            this.historyList = []
          	this.historyList = res
            console.log("222");
            console.log(this.historyList,"游资大佬");
          }
        }
      },
      //获取搜索数据
      searching(type, keyword) {
        let _this = this
        let scURL = this.url.search
        axios.get(scURL, {
          params: {
            type,
            keyword,
          }
        }).then(response => {
          if (response.data.data.count !== 0) {
            let res = response.data.data.data.slice(0, 6);
            _this.searchList = res
            _this.searchNull = false
            // console.log(res);
          } else {
            _this.searchNull = true
          }
        })
      },
      //清除历史记录
      clearHistory() {
        switch (this.search_table) {
          case 0:
            localStorage.removeItem('historyIndexSearchStock')
            break
          case 1:
            localStorage.removeItem('historyIndexSearchHm')
            break
          default:
            break
        }
        this.historyList = []
      },
      //切换搜索类型
      searchTable(index) {
        this.search_table = index
        this.searchItem = ""
        this.searchList = []
        this.historyList = []
        this.searchNull = false
        this.getHistoryStock(this.search_table)
      },
      //打开搜索页
      searchOpen() {
        this.search = true
        this.getHistoryStock(this.search_table)
      },
      //关闭搜索页
      searchClose() {
        this.search = false
        this.search_table = 0
        this.searchItem = ""
        this.searchList = []
        this.historyList = []
      },
      //点击搜索内容
      searchDetail(value) {
        if (this.search_table == 0) {
          let keyword = (value.sname + '/' + value.scode).replace("/^\s+|\s+$/g", "")
          let {
          	historyIndexSearchStock
          } = localStorage;
          if (historyIndexSearchStock === undefined) {
          	localStorage.historyIndexSearchStock = keyword;
          } else {
          	const onlyItem = historyIndexSearchStock.split('|').filter(e => e != keyword);
          	if (onlyItem.length > 0) {
          		historyIndexSearchStock = keyword + '|' + onlyItem.slice(0, 9).join('|');
          	}
          	localStorage.historyIndexSearchStock = historyIndexSearchStock;
          }
        } else if (this.search_table == 1) {
          let keyword = (value.yz_name + '/' + value.id).replace("/^\s+|\s+$/g", "")
          let {
          	historyIndexSearchHm
          } = localStorage;
          if (historyIndexSearchHm === undefined) {
          	localStorage.historyIndexSearchHm = keyword;
          } else {
          	const onlyItem = historyIndexSearchHm.split('|').filter(e => e != keyword);
          	if (onlyItem.length > 0) {
          		historyIndexSearchHm = keyword + '|' + onlyItem.slice(0, 9).join('|');
          	}
          	localStorage.historyIndexSearchHm = historyIndexSearchHm;
          }
        }

      },
      //监听搜索框
      onSearch() {
        if (this.searchItem !== "") {
          this.searching(this.search_table, this.searchItem)
          console.log(this.searchList);
        } else {
          this.searchList = []
          this.searchNull = false
          console.log("没有值");
        }
      },
      //点击输入框X
      closeX() {
        this.searchItem = ""
        this.searchList = []
        this.searchNull = false
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
          var length = $("#left_table2 tr").length;
          var page = parseInt(length / _this.lhbDate.indexPageSize);
          if (length < _this.lhbDate.stockNum) {
            _this.lhbDate.indexPage = page + 1
            _this.getMrData(_this.selDateTimes)
          } else if (length == _this.lhbDate.stockNum) {
            _this.lhbDate.indexLoad = false
          }
        }
        // 固定上榜股票头部
        var timeHeight = $(".time-picker").height();
        var toTop = $(window).scrollTop();
        var rankHead = $(".rank-stock").height();
        var allList = $("#allList").offset().top - toTop;
        var listNoFixed = rankHead + $(".left_div1").height() + timeHeight;
        if (allList < listNoFixed) {
          $("#left_div1").addClass("active");
          $("#right_div1").addClass("active");
        } else {
          $("#left_div1").removeClass("active");
          $("#right_div1").removeClass("active");
        };
      }
    },
    created() {
      this.getDate()
    },
    mounted() {
      this.ft.fixTable();
      window.addEventListener("scroll", this.handleFun)
    },
    beforeDestroy() {
      window.removeEventListener("scroll", this.handleFun)
    },
  }
</script>

<style scoped>

</style>
