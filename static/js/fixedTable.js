export default {
  fixTable() {
    var left_div2 = document.getElementById("left_div2");
    var right_div1 = document.getElementById("right_div1");
    var right_div2 = document.getElementById("right_div2");
    right_div2.onscroll = function() {
      var right_div2_top = this.scrollTop;
      var right_div2_left = this.scrollLeft;
      document.getElementById("left_div2").scrollTop = right_div2_top;
      document.getElementById("right_div1").scrollLeft = right_div2_left;
      if (right_div2_left > 0) {
        left_div2.classList.add("onScroll")
      };
      if (right_div2_left < 5) {
        left_div2.classList.remove("onScroll")
      };
      if (right_div2_left > 10) {
        right_div1.classList.add("scrolled")
      };
      if (right_div2_left < 10) {
        right_div1.classList.remove("scrolled")
      }
    }
    //设置右边div宽度
    var leftWidth = document.getElementById("left_div").clientWidth;
    var clientWidth = document.documentElement.clientWidth;
    var rightWidth = clientWidth - leftWidth;
    document.getElementById("right_div").style.width = rightWidth;
  }

}
