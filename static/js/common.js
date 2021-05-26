export default {
  /**
   * 全局toast提示调用方法
   * @param  {[string]} text [提示内容]
   * @return null
   */
  toast(toast) {
    var str = '<div class="toast"><span></span></div>';
    if ($(".toast").length == 0) {
      $("body").append(str);
      $(".toast").fadeIn().find("span").html(toast);
      setTimeout(function() {
        $(".toast").fadeOut();
        $(".toast").remove();
      }, 2000)
    }
  },
  //数字转换
  numberFormat(value) {
    var param = {};
    var k = 10000,
      sizes = ['', '万', '亿', '万亿'],
      i;

    if (value >= 0) {
      if (value < k) {
        param.value = value
        param.unit = ''
      } else {
        i = Math.floor(Math.log(value) / Math.log(k));

        param.value = ((value / Math.pow(k, i))).toFixed(2);
        param.unit = sizes[i];
      }
      return param;
    } else {
      var Mvalue = Math.abs(value);
      if (Mvalue < k) {
        param.value = -Mvalue
        param.unit = ''
      } else {
        i = Math.floor(Math.log(Mvalue) / Math.log(k));

        param.value = -((Mvalue / Math.pow(k, i))).toFixed(2);
        param.unit = sizes[i];
      }
      return param;
    }
  },

  //股票手数转换
  numberForStock(svalue) {
    value = svalue / 100
    var param = {};
    var k = 10000,
      sizes = ['手', '万手', '亿手', '万亿手'],
      i;
    if (value < k) {
      param.value = value
      param.unit = '手'
    } else {
      i = Math.floor(Math.log(value) / Math.log(k));

      param.value = ((value / Math.pow(k, i))).toFixed(2);
      param.unit = sizes[i];
    }
    return param;
  },


  //数组升序排列
  compareUp(property) {
    return function(a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },

  //数组降序排列
  compareDown(property) {
    return function(a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    }
  },

  //数组去重
  unique(arr) {
    const res = new Set(arr)
    return [...res]
  }

}
