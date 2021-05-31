<template>
  <div>
    <!-- 搜索框 -->
    <div class="rank-head" :class="search ? 'focus' : ''">
      <div class="rank-search-content">
        <div class="rank-search">
          <div class="search-input">
            <span class="icon-search"></span>
            <input id="search" class="h5-search" type="text" :placeholder="Placeholder" @input="onSearch"
              @click="searchOpen" v-model="searchItem">
          </div>
          <span class="icon-close" v-if="!searchItem == ''" @click="closeX"></span>
        </div>
        <a class="search-cancel h5-search-cancel" @click="searchClose">取消</a>
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
            <li class="border" v-for="(value,index) in this.historyList" :key="index" @click="toHistoryDetail(value)"><a>{{value.split('/')[0]}}</a>
            </li>
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
  <div class="rank-main">
    <!-- Tab菜单 -->
    <ul class="rank-tab bt-line">
      <li @click.stop="toIndex"><span class="stock-rank">龙虎榜单</span><b @click.stop="toUnscramble"></b></li>
      <li class="active" @click.stop="toHotmoney"><span class="stock-hotmoney">游资大佬</span></li>
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
    </div>
    <!-- 卡片列表 -->
    <ul id="hotmony-indexCard" class="hotmoney-card-list">
      <li class="hotmoney-card" :class="lhbDate.listIndex == index ? 'active' : '' "
        v-for="(value,index) in lhbDate.hotmoneyList" :key="value.id" @click="readMore(index)">
        <div class="card-block">
          <p class="card-title">{{value.yz_name}}</p>
          <p class="card-title-tips" v-show="lhbDate.listIndex == index">{{value.yz_summary||"暂无简介"}}</p>
          <ul class="card-stock bt-line">
            <li v-for="(svalue,sindex) in JSON.parse(value.yz_scode_info)" :key="svalue.id">
              <div class="stock-name">
                <p>{{svalue.sname}}</p>
                <p class="num">{{svalue.scode}}</p>
              </div>
              <div class="stock-trade">
                <p class="je">净买</p>
                <p :class="[{add: svalue.je > 0},{min: svalue.je < 0}]"><span class="num"
                    v-if="svalue.je > 0">+</span><span class="num">{{parseInt(svalue.je).toFixed(2)}}</span>万</p>
              </div>
            </li>
          </ul>
        </div>
        <a class="detail-btn" @click="toHmDetail(value.yz_id)" javascript="void(0)"><span>查看详情</span></a>
      </li>
    </ul>

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
        searchNull: false,
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
          indexLoad: true,
          hotmoneyList: [],
          hotmoneyDate: {
            sname: "",
            scode: "",
            id: ""
          },
          listIndex: "-1"
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
      },
      Placeholder() {
        return this.search_table == 0 ?
          "输入股票名称/代码" :
          "输入游资大佬名称"
      },
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
        this.lhbDate.hotmoneyList = []
        this.lhbDate.indexLoad = true
        this.getHmData(this.dateString)
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
          this.lhbDate.hotmoneyList = []
          this.lhbDate.indexLoad = true
          this.getHmData(this.dateString)
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
          this.lhbDate.hotmoneyList = []
          this.lhbDate.indexLoad = true
          this.getHmData(this.dateString)
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
        axios.get(dateUrl, {
            params: {
              'type': 2,
            }
          }).then(response => { //先请求的a接口
            let res = response.data.data;
            _this.weekday = res
            _this.selDateTimes = _this.weekday[_this.weekday.length - 1]
            _this.firstDateTimes = res[0]
            _this.lastDateTimes = res[res.length - 1]
            _this.dateString = _this.selDateTimes
          })
          .then(response => {
            let date = _this.selDateTimes
            _this.lhbDate.indexLoad = true
            this.getHmData(date)
          })
          .catch(err => {
            console.log(err);
          })
      },
      getHmData(date) {
        let _this = this
        let hmURL = this.url.hotmoney_list
        axios.get(hmURL, {
          params: {
            date
          }
        }).then(response => {
          if (response.data.data.length !== 0) {
            let res = response.data.data
            console.log(res);
            //合并成一个新数组
            const newArr = _this.lhbDate.hotmoneyList.concat(res);
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
            _this.lhbDate.hotmoneyList = result
            _this.lhbDate.indexLoad = false
          }
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
      //跳转游资大佬详情
      toHmDetail(id) {
        let _this = this
        _this.indexLoad = true
        _this.$store.commit('saveHotmoney', id);
        // console.log(this.$store.state.sId);
        _this.$router.push({
          path: '/hotmoney_detail'
        })
      },
      //点击搜索记录
      toHistoryDetail(value) {
        switch (this.search_table) {
          case 0:
            this.toDetail(value.split('/')[0], value.split('/')[1])
            break
          case 1:
            this.toHmDetail(value.split('/')[1])
            break
          default:
            break
        }
      },
      //获取搜索记录
      getHistoryStock(type) {
        if (type == 0) {
          let historyIndexSearchStock = window.localStorage.getItem('historyIndexSearchStock')
          if (historyIndexSearchStock) {
            let res = historyIndexSearchStock.split('|');
            this.historyList = []
            this.historyList = res
          }
        } else if (type == 1) {
          let historyIndexSearchHm = window.localStorage.getItem('historyIndexSearchHm')
          if (historyIndexSearchHm) {
            let res = historyIndexSearchHm.split('|');
            this.historyList = []
            this.historyList = res
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
          this.toDetail(value.sname, value.scode)
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
          this.toHmDetail(value.id)
        }

      },
      //监听搜索框
      onSearch() {
        if (this.searchItem !== "") {
          this.searching(this.search_table, this.searchItem)
          // console.log(this.searchList);
        } else {
          this.searchList = []
          this.searchNull = false
          // console.log("没有值");
          this.getHistoryStock(this.search_table)
        }
      },
      //点击输入框X
      closeX() {
        this.searchItem = ""
        this.searchList = []
        this.searchNull = false
        this.getHistoryStock(this.search_table)
      },
      //跳转首页
      toIndex() {
        let _this = this
        _this.noDate = false
        _this.indexLoad = true
        _this.$router.push({
          path: '/index'
        })
      },
      //跳转游资大佬页
      toHotmoney() {
        let _this = this
        _this.noDate = false
        _this.indexLoad = true
        _this.$router.push({
          path: '/hotmoney'
        })
      },
      //跳转龙虎榜解读
      toUnscramble() {
        let _this = this
        _this.noDate = false
        _this.indexLoad = true
        _this.$router.push({
          path: '/unscramble'
        })
      },
      readMore(index) {
        if (this.lhbDate.listIndex == index) {
          this.lhbDate.listIndex = "-1"
        } else {
          this.lhbDate.listIndex = index
        }
      }
    },
    created() {
      this.getDate()
    },
    mounted() {

    }
  }
</script>

<style scoped>

</style>
