<template>
	<!-- 主体内容-->
	<div class="rank-main">
		<!-- 个股榜单 -->
		<div class="hotmoney-tab bt-line">
			<!-- Tab切换菜单 -->
			<ul class="list-tab">
				<li class="active" target="_self"><span>操作历史</span></li>
				<li target="_self"><span>游资介绍</span></li>
			</ul>
			<p id="allUp">全部收起</p>
		</div>
		<!-- Tab操作历史 -->
		<div id="history" class="hotmoney-history">
			<ul class="history-box"></ul>
			<div class="more_load"><span></span></div>
		</div>
		<!-- Tab游资介绍 -->
		<div id="introduce" class="hide"></div>
	</div>
</template>

<script>
    export default {
        name: 'hotmpney_detail',
        data(){
            return {

            }
        },
        created() {
          this.jq.hotmoneyDetailFix();
        },
    };
</script>

<style scoped>
</style>
