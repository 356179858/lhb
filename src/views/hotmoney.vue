<template>
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
        <a class="detail-btn" @click="toDetail(value.yz_id)" javascript="void(0)"><span>查看详情</span></a>
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
      //修改vuex
      toDetail(id) {
        let _this = this
        _this.indexLoad = true
        _this.$store.commit('saveHotmoney', id);
        console.log(this.$store.state.sId);
        _this.$router.push({
          path: '/hotmoney_detail'
        })
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
