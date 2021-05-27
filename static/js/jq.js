export default {
  indexFix() {
    $(window).on('scroll', function() {
      var toTop = $(window).scrollTop();
      var timeHeight = $(".time-picker").height();
      var timeFixHeight = $(".time-picker").offset().top - toTop;
      var marketInfoHeight = $("#marketInfo").offset().top - toTop;
      var rankTopHead = $(".rank-stock").offset().top - toTop;
      var rankHead = $(".rank-stock").height();
      var listNoFixed = rankHead + $(".left_div1").height() + timeHeight;
      var allList = $("#allList").offset().top - toTop;
      var fixHeight = timeHeight + rankHead
      // console.log(rankTopHead);
      // console.log(allList);
      // console.log(allList);
      // 固定上榜股票头部
      if (allList < listNoFixed) {
        $("#left_div1").addClass("active");
        $("#right_div1").addClass("active");
      } else {
        $("#left_div1").removeClass("active");
        $("#right_div1").removeClass("active");
      };
    });
  },
  hotmoneyDetailFix() {
    $(window).on('scroll', function() {
      var toTop = $(window).scrollTop();
      // 固定上榜股票头部
      if (toTop > 10) {
        $('.hotmoney-tab').addClass('on');
      } else {
        $('.hotmoney-tab').removeClass('on');
      };
    });
  }

}
