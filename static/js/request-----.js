//------------------------------------初始化------------------------------------
function indexInit(time) {
	// console.log('time', time)
	//获取市场行情数据
	var data = {
		'date': time
	}
	getMarket_hq(market_hq_url, data);

	//获取行情列表数据
	var data = {
		'type': 0,
		'page': 1,
		'pageSize': 15,
		'startDate': time,
		'sname': 'chgradio',
		'sort': 'desc',
	}
	getRankList(market_ranklist, data);
}

//------------------------------------请求市场行情数据------------------------------------
function getMarket_hq(url, data) {
	get({
		url: url,
		data: data,
		beforeSend: function() {
			$(".loading").show();
		},
		success: volid => {
			$(".loading").hide();
			// ------------------------------------获取数据------------------------------------

			var res = volid.data;

			// console.log(res)
			//------------------------------------涨停数------------------------------------

			var zht = res.zt_count;
			$("#zht").html(zht);
			//------------------------------------炸板数------------------------------------

			var zhb = res.zb_count;
			$("#zhb").html(zhb);
			//------------------------------------跌停数------------------------------------

			var dt = res.dt_count;
			$("#dt").html(dt);
			//------------------------------------涨跌比------------------------------------

			var fall_count = res.fall_count; //涨家数
			var rise_count = res.rise_count; //跌家数

			$("#zhdb").html(rise_count + "/" + fall_count );
			//------------------------------------市场人气------------------------------------
			console.log()
			if (rise_count > 3000) {
				$("#scrq").html("很好")
			} else if (rise_count > 2000) {
				$("#scrq").html("良好")
			} else {
				$("#scrq").html("较差")
			}

			//------------------------------------封板评分------------------------------------

			var zb_rate = res.zb_rate;

			var fbcgl = Number(zb_rate * 100).toFixed(2);

			$("#fbcgl").html(fbcgl + "%")
			//-------市场人气
			if (fbcgl > 70) {
				$("#fbpf").html("良好")
			} else if (fbcgl > 50) {
				$("#fbpf").html("一般")
			} else {
				$("#fbpf").html("较差")
			}

			//------------------------------------个股连板详情-----------------------------

			var lbxq_list = "";
			//转化数据类型
			var zt_data_stock = res.zt_data_stock;
			var zds_data = JSON.parse(zt_data_stock);
			// console.log("aaa",zds_data);
			// 删除数据中第一个
			var new_zds_data = zds_data.filter((val, index, zds_data) => {
				return index !== 0;
			})
			// console.log("bbb",new_zds_data);
			// 删除数据中空数组
			var finalzds_data = new_zds_data.filter(item => {
				return item.data.length > 0
			});
			// console.log("ccc",finalzds_data);
			// 循环li
			$.each(finalzds_data, function(i, items) {
				// console.log(finalzds_data)
				// 列表名称赋值
				let N = ["一进二", "二进三", "三进四", "四进五", "五进六", "六进七", "七进八", "八进九", "九进十"];
				lbxq_list +=
					`<li class="list-info" onclick="">
						<div class="main-info">
							<p>${N[items.type - 1]}<span class="hidelength">${items.data.length}/${items.count}</span></p>
						</div>
						<div class="hide-info">
							<div class="hide-info-title">
								<p>股票</p>
								<p>涨幅</p>
							</div>							
							<ul class="hide-info-item">`;
				$.each(items.data, function(i, sitems) {
					lbxq_list +=
						`<li class="hideLi">
									<div class="stock_info">
										<p>${sitems.sname}</p>
										<span>${sitems.scode}</span>
									</div>
									<p class="add">+${sitems.zdf.toFixed(2)}%</p>
								</li>`
				});
				lbxq_list += `</ul>
						</div>
					</li> `
			});
			$("#rankList").empty();
			$("#rankList").append(lbxq_list);
			var rankList = $("#rankList>li").length;
			// 无数据隐藏模块
			if (rankList == 0) {
				$("#stockInfo").hide()
			}
		}
	});
}



//------------------------------------请求榜单列表数据------------------------------------
function getRankList(url, data) {
	get({
		url: url,
		data: data,
		beforeSend: function() {
			$(".loading").show();
		},
		success: volid => {
			$(".loading").hide();
			//------------------------------------获取列表数据------------------------------------
			var res = volid.data;
			// console.log("000",res)
			//上榜股票只数
			var stockNum = volid.count
			$("#stockNum>p span").text(stockNum)
			//加载列表
			allList(res);
			//列表第一个打开
			// $(".rank-list .list-info:first").addClass("active").stop().slideDown();
		}
	})
}

//加载首页底部列表
function allList(res) {
	// console.log("666", res)
	//------------------------------------列表左侧------------------------------------
	var rankList_left = "";
	//------------------------------------列表右侧------------------------------------
	var rankList_right = "";
	$.each(res, function(i, items) {
		//------------------------------------左侧循环------------------------------------

		rankList_left +=
			`<tr class="lf_tr">
						<th>
							<div class="stock-name">
								<p>${items.sname}</p>
								<span>${items.scode}</span>
							</div>
							<ul class="stock-tips">`;
		//去除yz_name中的逗号			
		var yz_name_arr = new Array();
		var yz_name_str = items.yz_name;
		if (items.yz_name != null) {
			yz_name_arr = yz_name_str.split(',');
			var new_yz_name_arr=yz_name_arr.slice(0, 3);
			for (var i = 0; i < new_yz_name_arr.length; i++) {
				rankList_left += `
									<li>${new_yz_name_arr[i]}</li>`
			}
		}
		rankList_left += `</ul>
						</th>
					</tr>`

		//------------------------------------右侧循环------------------------------------		

		rankList_right += `<tr class="rt_tr">`;
		//涨幅数据
		rankList_right += `<td><span class="chgradio_value">${items.chgradio.toFixed(2)}</span>%</td>`;
		//净买入数据
		var jmr_value = numberFormat(items.jmmoney).value; //净买入数
		var jmr_unit = numberFormat(items.jmmoney).unit; //净买入单位
		rankList_right += `<td><span class="jmr_value">${jmr_value}</span><span>${jmr_unit}</span></td>`;
		//行业板块
		if (items.industry) {
			rankList_right +=
				`<td>${items.industry}</td>
				<tr>`;

		} else {
			rankList_right +=
				`<td>--</td>
					<tr>`;
		}

	});
	//列表左边输出
	$("#left_table2").empty();
	$("#left_table2").append(rankList_left);
	//列表右边边输出
	$("#right_table2").empty();
	$("#right_table2").append(rankList_right);
	//正负值添加颜色
	var str = '+';
	$(".chgradio_value").each(function() {
		if ($(this).text() > 0) {
			$(this).parent().addClass("add")
			//判断字符串中是否包含+
			if ($(this).text().indexOf(str) < 0) {
				$(this).prepend("+")
			}
		} else if ($(this).text() < 0) {
			$(this).parent().addClass("min")
		}
	});
	$(".jmr_value").each(function() {
		if ($(this).text() > 0) {
			$(this).parent().addClass("add")
			if ($(this).text().indexOf(str) < 0) {
				$(this).prepend("+")
			}
		} else if ($(this).text() < 0) {
			$(this).parent().addClass("min")
		}
	})
	//列表无数据
	if ($("#left_table2 tr").length == 0) {
		$(".content-null").show();
		$(".container-fluid").hide();
		$(".more_load").hide();
		$(".content-null p").text("目前暂无数据~");
	} else {
		$(".content-null").hide();
		$(".container-fluid").show();
		$(".more_load").show();
	}
}


////下拉加载列表
function more(time) {
	$(window).scroll(function() {
		var scrollTop = $(this).scrollTop(); //滚动条距离顶部的高度
		var scrollHeight = $(document).height(); //当前页面的总高度
		var windowHeight = $(this).height(); //当前可视的页面高度
		if (scrollTop + windowHeight >= scrollHeight) {
			var length = $("#left_table2 tr").length;
			// console.log("当前列表数量",length);
			var page = parseInt(length / pageSize);
			var pageSizes = pageSize;
			// console.log(page);
			var startDate = $('#getNewTime').val();
			var pages = page + 1
			if (!$("#own-stock").hasClass("active")) {
				if ($(".list-tab li").eq(0).hasClass("active")) {
					var type = 0;
					if ($(".increase").hasClass("down")) {
						var sname = 'chgradio'
						var sort = 'desc'
						//请求列表数据
						moreLoad(startDate, type, pages, pageSizes, sname, sort, length);
					} else if ($(".increase").hasClass("up")) {
						var sname = 'chgradio'
						var sort = 'asc'
						//请求列表数据
						moreLoad(startDate, type, pages, pageSizes, sname, sort, length);
					} else if ($(".bought").hasClass("down")) {
						var sname = 'jmmoney'
						var sort = 'desc'
						//请求列表数据
						moreLoad(startDate, type, pages, pageSizes, sname, sort, length);
						//请求列表数据
					} else if ($(".bought").hasClass("up")) {
						var sname = 'jmmoney'
						var sort = 'asc'
						//请求列表数据
						moreLoad(startDate, type, pages, pageSizes, sname, sort, length);
					}
				} else if ($(".list-tab li").eq(1).hasClass("active")) {
					var type = 1;
					if ($(".increase").hasClass("down")) {
						var sname = 'chgradio'
						var sort = 'desc'
						//请求列表数据
						moreLoad(startDate, type, pages, pageSizes, sname, sort, length);
					} else if ($(".increase").hasClass("up")) {
						var sname = 'chgradio'
						var sort = 'asc'
						//请求列表数据
						moreLoad(startDate, type, pages, pageSizes, sname, sort, length);
					} else if ($(".bought").hasClass("down")) {
						var sname = 'jmmoney'
						var sort = 'desc'
						//请求列表数据
						moreLoad(startDate, type, pages, pageSizes, sname, sort, length);
						//请求列表数据
					} else if ($(".bought").hasClass("up")) {
						var sname = 'jmmoney'
						var sort = 'asc'
						//请求列表数据
						moreLoad(startDate, type, pages, pageSizes, sname, sort, length);
					}
				}
			}
		}
	});
}


//------------------------------------下拉加载参数------------------------------------
function moreLoad(startDate, type, pages, pageSizes, sname, sort, length) {
	var data = {
		'type': type,
		'page': pages,
		'pageSize': pageSizes,
		'startDate': startDate,
		'sname': sname,
		'sort': sort
	}
	appendList(data, $("#left_table2 tr").length)
	// console.log(length);
}

//------------------------------------下拉加载追加输出列表------------------------------------
function appendList(data, list_length) {
	get({
		url: "stock/lhb_detail",
		data: data,
		beforeSend: "",
		success: volid => {
			var res = volid.data;
			// console.log(res);
			var stockNum = volid.count;
			var this_length = list_length;
			// console.log(this_length)
			if (this_length < stockNum) {
				//------------------------------------列表左侧------------------------------------
				var rankList_left = "";
				//------------------------------------列表右侧------------------------------------
				var rankList_right = "";
				$.each(res, function(i, items) {
					//------------------------------------左侧循环------------------------------------
					rankList_left +=
						`<tr class="lf_tr">
							<th>
								<div class="stock-name">
									<p>${items.sname}</p>
									<span>${items.scode}</span>
								</div>
								<ul class="stock-tips">`;
					//去除yz_name中的逗号			
					var yz_name_arr = new Array();
					var yz_name_str = items.yz_name;
					if (items.yz_name != null) {
						yz_name_arr = yz_name_str.split(',');
						var new_yz_name_arr=yz_name_arr.slice(0, 3);
						for (var i = 0; i < new_yz_name_arr.length; i++) {
							rankList_left += `
												<li>${new_yz_name_arr[i]}</li>`
						}
					}
					rankList_left += `</ul>
							</th>
						</tr>`

					//------------------------------------右侧循环------------------------------------		

					rankList_right += `<tr class="rt_tr">`;
					//涨幅数据
					rankList_right += `<td><span class="chgradio_value">${items.chgradio.toFixed(2)}</span>%</td>`;
					//净买入数据
					var jmr_value = numberFormat(items.jmmoney).value; //净买入数
					var jmr_unit = numberFormat(items.jmmoney).unit; //净买入单位
					rankList_right += `<td><span class="jmr_value">${jmr_value}</span><span>${jmr_unit}</span></td>`;
					//行业板块
					if (items.industry) {
						rankList_right +=
							`<td>${items.industry}</td>
							<tr>`;
					} else {
						rankList_right +=
							`<td>--</td>
							<tr>`;

					}
				});
				//列表左边输出				
				$("#left_table2").append(rankList_left);
				//列表右边边输出				
				$("#right_table2").append(rankList_right);
				//正负值添加颜色
				var str = '+';
				$(".chgradio_value").each(function() {
					if ($(this).text() > 0) {
						$(this).parent().addClass("add")
						//判断字符串中是否包含+
						if ($(this).text().indexOf(str) < 0) {
							$(this).prepend("+")
						}
					} else if ($(this).text() < 0) {
						$(this).parent().addClass("min")
					}
				});
				$(".jmr_value").each(function() {
					if ($(this).text() > 0) {
						$(this).parent().addClass("add")
						if ($(this).text().indexOf(str) < 0) {
							$(this).prepend("+")
						}
					} else if ($(this).text() < 0) {
						$(this).parent().addClass("min")
					} else if ($(this).text() == 0) {
						$(this).siblings().html("万");
					}
				})
				$(".more_load").find("span").html("");
			} else {
				$(".more_load").find("span").html("已经是全部数据了");
			}
		}
	})
}


//------------------------------------请求股票详情列表------------------------------------
function stockDetail(url, data) {
	getDetailDate(url, data)
}

//------------------------------------请求股票详情日期------------------------------------
function getDetailDate(date_url, date_data) {
	// console.log(date_url, date_data);
	var page_url = date_url.detail_page_url
	var code = date_data.scode;
	var page = date_data.page;
	var pageSize = date_data.pageSize;
	get({
		url: page_url,
		data: {
			'code': code,
			'page': page,
			'pageSize': pageSize,
		},
		beforeSend: "",
		success: volid => {
			//------------------------------------获取日期数据------------------------------------
			var res = volid.data.data;
			// console.log(volid);
			$.each(res, function(i, items) {
				var detail_code = items.scode
				var detail_date = items.rq
				var detail_data = {
					'code': detail_code,
					'date': detail_date
				}
				var jmmoney = items.jmmoney;
				var chgradio = items.chgradio;
				var jmr_value = numberFormat(jmmoney).value; //净买入数
				var jmr_unit = numberFormat(jmmoney).unit; //净买入单位
				var stock_detail_list = "";
				stock_detail_list +=
					`
				<li class="list-info bt-line">
					<!-- 基本信息 -->
					<div class="basic-info clearfix">
						<div class="basic-info-block clearfix">
							<p class="time fl">${detail_data.date}</p>
							<div class="change fr">							
								<p>净额&nbsp;<span class="je">${jmr_value}</span><span>${jmr_unit}</span></p>
								&nbsp;&nbsp;
								<p><span class="zdf">${chgradio.toFixed(2)}</span><span>%</span></p>								
							</div>
						</div>
					</div>
				</li>
				`
				$(".rank-list").append(stock_detail_list);
			})
			$(".rank-list>li").eq(0).children(".hide-info").show(); // 第一个默认打开
			$(".rank-list>li").eq(0).addClass("active") // 打开箭头向下
		}
	})
}



//------------------------------------根据日期显示对应隐藏详情------------------------------------
function getDetailHideData(url, date, index) {
	get({
		url,
		data: {
			'code': data.scode,
			'date': date,
		},
		beforeSend: "",
		success: volid => {
			var res = (JSON.parse(volid)).data;
			// console.log(res);
			var stockInfo = res.stock_info[0];
			var yybInfo = res.yyb_info;
			var stock_detail_hide = "";
			var cjl = stockInfo.volume;
			var cjl_value = numberForStock(cjl).value; //成交量
			var cjl_unit = numberForStock(cjl).unit; //成交量单位
			var mrje = stockInfo.bmoney
			var mr_value = numberFormat(mrje).value; //买入数
			var mr_unit = numberFormat(mrje).unit; //买入单位
			var mcje = stockInfo.smoney;
			var mc_value = numberFormat(mcje).value; //卖出数
			var mc_unit = numberFormat(mcje).unit; //卖出单位
			var je = mrje - mcje; //净额
			var je_value = numberFormat(je).value; //净额
			var je_unit = numberFormat(je).unit; //净额单位
			var cje = stockInfo.turnover;
			var cje_value = numberFormat(cje).value; //成交额
			var cje_unit = numberFormat(cje).unit; //成交额单位			
			stock_detail_hide +=
				`<div class="hide-info top-line">
					<div class="detail-info1">
						<div class="detail-info1-item clearfix">`;
			// console.log(stockInfo.chgradio);
			if (stockInfo.chgradio > 0) {
				stock_detail_hide += `<p>收盘价 <span class="spj add">${stockInfo.close_price}</span></p>`
			} else if (stockInfo.chgradio < 0) {
				stock_detail_hide += `<p>收盘价 <span class="spj min">${stockInfo.close_price}</span></p>`
			} else
			if (stockInfo.chgradio == 0) {
				stock_detail_hide += `<p>收盘价 <span class="spj">${stockInfo.close_price}</span></p>`
			};
			stock_detail_hide +=
				`<p>换手率 <span>${stockInfo.dchratio.toFixed(2)}%</span></p>
						</div>
						<div class="detail-info1-item clearfix">
							<p>成交量 <span>${cjl_value}</span>${cjl_unit}</p>
							<p>成交额 <span>${cje_value}</span>${cje_unit}元</p>
						</div>
						<div class="rank-reason">
							<p class="rank-reason-title">上榜理由</p>
							<div class="rank-reason-info">
								<p>${stockInfo.ctypedes}</p>
							</div>
						</div>
						<div class="rank-block top-line">
							<ul>
								<li>
									<p class="word">买入总计</p>`;
									if(mr_value > 0) {
										stock_detail_hide += `<p class="add"><span class="num">${mr_value}</span>${mr_unit}</p>`
									} else {
										stock_detail_hide += `<p><span class="num">${mr_value}</span>万</p>`
									};		
		   stock_detail_hide +=`</li>
								<li>
									<p class="word">卖出总计</p>`;
									if(mc_value > 0) {
										stock_detail_hide += `<p class="min"><span class="num">${mc_value}</span>${mc_unit}</p>`
									} else {
										stock_detail_hide += `<p><span class="num">${mr_value}</span>万</p>`
									};	
									
			stock_detail_hide +=`</li>
								<li>
									<p class="word">净额</p>
									<p><span class="dje num">${je_value}</span>${je_unit}</p>
								</li>
							</ul>
						</div>
					</div>`;
			stock_detail_hide +=
				`<div class="detail-info2">
						<div class="detail-info2-head">
							<p>买入前五营业部</p>
							<p>买入/卖出</p>
						</div>
						<ul class="trans-info">`
			var mr_yyb = yybInfo.slice(0, 5);
			console.log("mr_yyb", mr_yyb)
			$.each(mr_yyb, function(i, items) {

				stock_detail_hide +=
					`<li class="bt-line">
									<div>
										<p>${items.short_name}</p>
										<ul class="tips">`
				//去除tips中的逗号				
				var tips_yz_name = items.yz_name;
				var tips_yyb_bq = items.yyb_bq;
				if (tips_yz_name) {
					var yz_name_str = tips_yz_name.split(',')
					// console.log("游资名称",yz_name_str)
				}
				if (tips_yyb_bq) {
					var yyb_bq_str = tips_yyb_bq.split(',')
					// console.log("游资标签",yyb_bq_str)
				}
				if (tips_yz_name && tips_yyb_bq) {
					var tips = yz_name_str.concat(yyb_bq_str)
					// console.log("名称+标签",tips)
				} else if (!tips_yz_name && tips_yyb_bq) {
					var tips = yyb_bq_str
					// console.log("名称+标签",tips)
				} else if (tips_yz_name && !tips_yyb_bq) {
					var tips = yz_name_str
					// console.log("名称+标签",tips)
				}
				let real_tips = [];
				if (tips) {
					tips.forEach(item => {
						if (item) {
							real_tips.push(item)
						}
					})
					for (var i = 0; i < real_tips.length; i++) {
						stock_detail_hide += `<li>${tips[i]}</li>`
					}
				};
				stock_detail_hide +=
					`</ul>
									</div>
									<div>
										<p><span class="num mrj">${items.mrje}</span>万</p>
										<p><span class="num mcj">${items.mcje}</span>万</p>
									</div>
								</li>`
			});

			stock_detail_hide += `</ul>
						</div>`

			stock_detail_hide +=
				`<div class="detail-info2">
						<div class="detail-info2-head">
							<p>卖出前五营业部</p>
							<p>买入/卖出</p>
						</div>
						<ul class="trans-info">`;
			var mc_yyb = yybInfo.slice(5, 10);
			$.each(mc_yyb, function(i, items) {
				// console.log(items)	
				stock_detail_hide +=
					`<li class="bt-line">
									<div>
										<p>${items.short_name}</p>
										<ul class="tips">`
				//去除tips中的逗号
				var tips_yz_name = items.yz_name;
				var tips_yyb_bq = items.yyb_bq;
				if (tips_yz_name) {
					var yz_name_str = tips_yz_name.split(',')
					// console.log("游资名称",yz_name_str)
				}
				if (tips_yyb_bq) {
					var yyb_bq_str = tips_yyb_bq.split(',')
					// console.log("游资标签",yyb_bq_str)
				}
				if (tips_yz_name && tips_yyb_bq) {
					var tips = yz_name_str.concat(yyb_bq_str)
					// console.log("名称+标签",tips)
				} else if (!tips_yz_name && tips_yyb_bq) {
					var tips = yyb_bq_str
					// console.log("名称+标签",tips)
				} else if (tips_yz_name && !tips_yyb_bq) {
					var tips = yz_name_str
					// console.log("名称+标签",tips)
				}
				let real_tips = [];
				if (tips) {
					tips.forEach(item => {
						if (item) {
							real_tips.push(item)
						}
					})
					for (var i = 0; i < real_tips.length; i++) {
						stock_detail_hide += `<li>${tips[i]}</li>`
					}
				};
				stock_detail_hide +=
					`</ul>
									</div>
									<div>
										<p><span class="num mrj">${items.mrje}</span>万</p>
										<p><span class="num mcj">${items.mcje}</span>万</p>
									</div>
								</li>`;
			});
			stock_detail_hide += `</ul>
					</div>
				</div>`;
			$(".rank-list>li").find(".hide-info").remove();
			$(".rank-list>li").eq(index).children(".basic-info").after(stock_detail_hide);
			//正负值添加颜色
			$(".change .je").each(function() {
				if ($(this).text() > 0) {
					$(this).parent().addClass("add")
				} else if ($(this).text() < 0) {
					$(this).parent().addClass("min")
				}
			});
			$(".basic-info .zdf").each(function() {
				if ($(this).text() > 0) {
					$(this).parent().addClass("add")
					$(this).prepend("涨幅+")
				} else if ($(this).text() < 0) {
					$(this).parent().addClass("min")
					$(this).prepend("跌幅")
				}
			});

			$(".mrj").each(function() {
				if ($(this).text() > 0) {
					$(this).parent().addClass("add")
				}
			});
			$(".mcj").each(function() {
				if ($(this).text() > 0) {
					$(this).parent().addClass("min")
				}
			});
			$(".dje").each(function() {
				if ($(this).text() > 0) {
					$(this).parent().addClass("add")
				} else if ($(this).text() < 0) {
					$(this).parent().addClass("min")
				} else if ($(this).text() == 0) {
					$(this).after("万")
				}
			});


		}
	})
}
////////////////////////////////////////////////////////////////////////////////////////////
//加载首页我的组选股底部列表
function getOwnList(uuid, date, index, sname, sort) {
	$.ajax({
		url: "http://m.123.com.cn/app/zhi/myselfstock?uuid=" + uuid,
		type: "get",
		data: {
			// scode,
		},
		success: function(res) {
			console.log("我的自选股", res)
			var type = index;
			var codes = res.sotcklist.toString();
			var data = {
				'startDate': date,
				'type': type,
				'scodes': codes,
				'page': 1,
				'pageSize': 15,
				'startDate': date,
				'sname': sname,
				'sort': sort,
			};
			$("#left_table2").empty();
			$("#right_table2").empty();
			//获取自选股列表
			ownList(data);
		}
	});
}

//获取自选股列表
function ownList(data) {
	$.ajax({
		url: "http://mesh.api.123.com.cn/stock/lhb_detail",
		type: "get",
		data,
		success: function(volid) {
			console.log("我的自选股", volid)
			//------------------------------------获取列表数据------------------------------------
			var res = volid.data;
			//上榜股票只数
			var stockNum = volid.count
			$("#stockNum>p span").text(stockNum)
			//加载列表
			if ($("#left_table2").length > 0) {
				ownRankList(res);
			} else {
				$(".content-null").show();
				$(".container-fluid").hide();
				$(".more_load").hide();
				$(".content-null p").text("榜单中暂无您的自选股~");
			}
		}
	});
}

//加载首页底部列表
function ownRankList(res) {
	console.log("666", res)
	//------------------------------------列表左侧------------------------------------
	var rankList_left = "";
	//------------------------------------列表右侧------------------------------------
	var rankList_right = "";
	$.each(res, function(i, items) {
		//------------------------------------左侧循环------------------------------------

		rankList_left +=
			`<tr class="lf_tr">
						<th>
							<div class="stock-name">
								<p>${items.sname}</p>
								<span>${items.scode}</span>
							</div>
							<ul class="stock-tips">`;
		//去除yz_name中的逗号			
		var yz_name_arr = new Array();
		var yz_name_str = items.yz_name;
		if (items.yz_name != null) {
			yz_name_arr = yz_name_str.split(',');
			for (var i = 0; i < yz_name_arr.length; i++) {
				rankList_left += `
									<li>${yz_name_arr[i]}</li>`
			}
		}
		rankList_left += `</ul>
						</th>
					</tr>`

		//------------------------------------右侧循环------------------------------------		

		rankList_right += `<tr class="rt_tr">`;
		//涨幅数据
		rankList_right += `<td><span class="chgradio_value">${items.chgradio.toFixed(2)}</span>%</td>`;
		//净买入数据
		var jmr_value = numberFormat(items.jmmoney).value; //净买入数
		var jmr_unit = numberFormat(items.jmmoney).unit; //净买入单位
		rankList_right += `<td><span class="jmr_value">${jmr_value}</span><span>${jmr_unit}</span></td>`;
		//行业板块
		if (items.industry == "null") {
			rankList_right +=
				`<td>--</td>
					<tr>`;
		} else {
			rankList_right +=
				`<td>${items.industry}</td>
					<tr>`;
		}
	});
	//列表左边输出
	$("#left_table2").empty();
	$("#left_table2").append(rankList_left);
	//列表右边边输出
	$("#right_table2").empty();
	$("#right_table2").append(rankList_right);
	//正负值添加颜色
	var str = '+';
	$(".chgradio_value").each(function() {
		if ($(this).text() > 0) {
			$(this).parent().addClass("add")
			//判断字符串中是否包含+
			if ($(this).text().indexOf(str) < 0) {
				$(this).prepend("+")
			}
		} else if ($(this).text() < 0) {
			$(this).parent().addClass("min")
		}
	});
	$(".jmr_value").each(function() {
		if ($(this).text() > 0) {
			$(this).parent().addClass("add")
			if ($(this).text().indexOf(str) < 0) {
				$(this).prepend("+")
			}
		} else if ($(this).text() < 0) {
			$(this).parent().addClass("min")
		} else if ($(this).text() == 0) {
			$(this).siblings().html("万");
		}
	})
	//列表无数据
	if ($("#left_table2 tr").length == 0) {
		$(".content-null").show();
		$(".container-fluid").hide();
		$(".more_load").hide();
		$(".content-null p").text("榜单中暂无您的自选股~");
	} else {
		$(".content-null").hide();
		$(".container-fluid").show();
		$(".more_load").show();
	}
}


















/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//------------------------------------请求游资大佬数据------------------------------------
function hotmoneyInit(url, datas) {
	// console.log(datas.date);
	get({
		url: url,
		beforeSend: function() {
			$(".loading").show();
		},
		data: {
			"date": datas.date
		},
		success: volid => {
			$(".loading").hide();
			//------------------------------------获取列表数据------------------------------------
			var res = volid.data;
			// console.log(volid);
			// console.log("yy",res);
			var hotmoney_list = "";
			$.each(res, function(i, items) {
				//------------------------------------列表循环------------------------------------
				var yybInfo = JSON.parse(items.yz_scode_info);
				// console.log(yybInfo);
				hotmoney_list +=
					`
				<li class="hotmoney-card">
						<div class="card-block">
							<p class="card-title">${items.yz_name}</p>`
				if (items.yz_summary.length > 0) {
					hotmoney_list += `<p class="card-title-tips">${items.yz_summary}</p>`;
				} else {
					hotmoney_list += `<p class="card-title-tips">暂无简介</p>`;
				};
				hotmoney_list += `<ul class="card-stock bt-line">`;
				$.each(yybInfo, function(i, sitems) {
					var je = Number(sitems.je)
					var fje = je.toFixed(2)
					hotmoney_list +=
						`
								<li>
									<div class="stock-name">
										<p>${sitems.sname}</p>
										<p class="num">${sitems.scode}</p>
									</div>
									<div class="stock-trade">
										<p class="je">净买</p>
										<p><span class="num">${fje}</span>万</p>
									</div>
								</li>`
				})

				hotmoney_list +=
					`</ul>	
						</div>						
						<a class="detail-btn" data-yz-id="${items.yz_id}" data-yz-name="${items.yz_name}" javascript="void(0)"><span>查看详情</span></a>
					</li>`
			})
			//输出列表
			$(".hotmoney-card-list").empty();
			$(".hotmoney-card-list").append(hotmoney_list);
			//金额颜色
			$(".stock-trade .num").each(function() {
				if ($(this).text() > 0) {
					$(this).parent().siblings().text("净买");
					$(this).prepend("+");
					$(this).parent().addClass("add")
				} else if ($(this).text() < 0) {
					$(this).parent().siblings().text("净卖")
					$(this).parent().addClass("min")
				}
			})
		}
	})
}

//------------------------------------请求游资大佬介绍数据------------------------------------
function hotmoneyInfoInit(url, data) {
	get({
		url: url,
		data: {
			"id": data.id
		},
		beforeSend: "",
		success: volid => {
			// console.log(volid);
			var yz_info = volid.data.yz_info
			var yyb_info = volid.data.yyb_info
			var introduce = ""
			introduce +=
				`
			<div class="rank-column">
				<div class="detail-introduce">
					<p class="name">${yz_info.yz_name}</p>
					<p>${yz_info.yz_summary}</p>
				</div>					
			</div>
			<div class="rank-column">
				<div class="detail-introduce">
					<p class="name">专用营业部(${yyb_info.length}个)</p>
					<ul>`;
			$.each(yyb_info, function(i, items) {
				// console.log(items)
				introduce += `<li>${items.yz_yyb}</li> `;
			});
			introduce += `</ul>
				</div>	
			</div>`;

			$("#introduce").append(introduce);
		},
	})
}


//------------------------------------请求游资大佬数据------------------------------------
function hotmoneyDetailInit(url, data) {
	get({
		url: url,
		data,
		beforeSend: "",
		success: volid => {
			//------------------------------------获取数据------------------------------------
			var res = volid.data.data;
			var count = volid.data.count;
			// console.log(res);
			$.each(res, function(i, items) {
				var yz_scode_info = JSON.parse(items.yz_scode_info);
				var hotmoney_card = ""
				hotmoney_card += `			
				<li>
					<div class="date">
						<p class="time">${items.date}</p>`

				hotmoney_card += `<p class="count">&nbsp;(共<span>${yz_scode_info.length }</span>只)</p>`

				hotmoney_card += `</div>
					<!-- 卡片列表 -->
					<ul class="hotmoney-card-list hotmony-card-show">`;
				$.each(yz_scode_info, function(i, sitems) {
					// console.log(sitems);
					var mrje = Number(sitems.mrje).toFixed(2)
					// var mr_value = numberFormat(mrje).value; //买入数
					// var mr_unit = numberFormat(mrje).unit; //买入单位
					var mcje = Number(sitems.mcje).toFixed(2)
					// var mc_value = numberFormat(mcje).value; //卖出数
					// var mc_unit = numberFormat(mcje).unit; //卖出单位
					var je = Number(sitems.je).toFixed(2) //净额
					// var je_value = numberFormat(je).value; //净额
					// var je_unit = numberFormat(je).unit; //净额单位
					hotmoney_card +=
						`
						<li class="hotmoney-card">
							<div class="card-block">
								<p class="card-title"><span class="sname">${sitems.sname}</span><span class="scode">${sitems.scode}</span></p>
								<ul class="card-history">
									<li class="bt-line">
										<p>买入总计</p>`;
										if(mrje > 0) {
										hotmoney_card +=`<p class="add"><span class="num">${mrje}</span>万</p>`	
										} else if(mrje == 0) {
										hotmoney_card +=`<p><span class="num">${mrje}</span>万</p>`	
										} ;
										
					hotmoney_card +=`</li>
									<li class="bt-line">
										<p>卖出总计</p>`;
										if(mcje > 0) {
										hotmoney_card +=`<p class="min"><span class="num">${mcje}</span>万</p>`		
										}  else if(mcje == 0) {
										hotmoney_card +=`<p><span class="num">${mcje}</span>万</p>`	
										} ;					
					hotmoney_card +=`</li>
									<li class="bt-line">
										<p>净额</p>`;
					if (je > 0) {
						hotmoney_card += `<p class="cdje add"><span class="num">+${je}</span>万</p>`
					} else if (je < 0) {
						hotmoney_card += `<p class="cdje min"><span class="num">${je}</span>万</p>`
					} else if (je == 0) {
						hotmoney_card += `<p class="cdje"><span class="num">${je}</span>万</p>`
					};

					hotmoney_card += `</li>
									<li class="bt-line">
										<p>方向</p>`;
					if (je > 0) {
						if (je / mrje >= 0.4) {
							hotmoney_card += `<p>买入</p>`
						} else {
							hotmoney_card += `<p>做T</p>`
						}
					} else if (je < 0) {
						if (Math.abs(je / mcje) >= 0.4) {
							hotmoney_card += `<p>卖出</p>`
						} else {
							hotmoney_card += `<p>做T</p>`
						}
					} else if (je == 0) {
						hotmoney_card += `<p>做T</p>`
					}


					hotmoney_card +=
						`</li>								
								</ul>
								<div class="card-bottom-tips">
									<ul class="yyb_trade  bt-line">`;
					$.each(sitems.yyb_info, function(i, ssitems) {
						// console.log(ssitems);
						hotmoney_card +=
							`<li>
										<p class="tips-title">${ssitems.yyb_name}</p>
										<div class="tips-trade">`;
										if(ssitems.mrje > 0) {
										hotmoney_card +=`<p>买入 <span class="num add">+${Number(ssitems.mrje).toFixed(2)}万</span></p>`	
										} else if(ssitems.mrje == 0) {
										hotmoney_card +=`<p>买入 <span class="num">${Number(ssitems.mrje).toFixed(2)}万</span></p>`	
										} ;
										if(ssitems.mcje > 0) {
										hotmoney_card +=`<p>卖出 <span class="num min">-${Number(ssitems.mcje).toFixed(2)}万</span></p>`	
										} else if(ssitems.mcje == 0) {
										hotmoney_card +=`<p>卖出 <span class="num">${Number(ssitems.mcje).toFixed(2)}万</span></p>`	
										} ;																				
						hotmoney_card +=`</div>
										</li>`;
					});

					hotmoney_card +=
						`</ul>
								</div>
							</div>
							<a class="detail-btn" javascript="void(0)"><span>查看详情</span></a>
						</li>`;

				});
				hotmoney_card += `</ul>
				</li>`;
				$(".history-box").append(hotmoney_card);
			});

		},
	})
}


//下拉加载游资大佬详情列表
function more_hotmoney_detail(url, hotmoneyData) {
	$(window).scroll(function() {
		var scrollTop = $(this).scrollTop(); //滚动条距离顶部的高度
		var scrollHeight = $(document).height(); //当前页面的总高度
		var windowHeight = $(this).height(); //当前可视的页面高度		
		if (scrollTop + windowHeight >= scrollHeight) {
			var length = $(".history-box > li").length;
			var page = parseInt(length / hotmoneyData.pageSize);
			var pages = page + 1
			// console.log(page);
			// console.log(length);
			get({
				url: url,
				beforeSend: "",
				data: {
					"id": hotmoneyData.id,
					"page": pages,
					"pageSize": hotmoneyData.pageSize,
				},
				beforeSend: "",
				success: volid => {
					var res = volid.data.data;
					var count = volid.data.count;
					// console.log(res)
					if (length < count) {
						$.each(res, function(i, items) {
							var yz_scode_info = JSON.parse(items.yz_scode_info);
							var hotmoney_card = ""
							hotmoney_card += `			
							<li>
								<div class="date">
									<p class="time">${items.date}</p>`

							hotmoney_card += `<p class="count">&nbsp;(共<span>${yz_scode_info.length }</span>只)</p>`

							hotmoney_card += `</div>
								<!-- 卡片列表 -->
								<ul class="hotmoney-card-list hotmony-card-show">`;
							$.each(yz_scode_info, function(i, sitems) {
								// console.log(sitems);
								var mrje = Number(sitems.mrje).toFixed(2)
								// var mr_value = numberFormat(mrje).value; //买入数
								// var mr_unit = numberFormat(mrje).unit; //买入单位
								var mcje = Number(sitems.mcje).toFixed(2)
								// var mc_value = numberFormat(mcje).value; //卖出数
								// var mc_unit = numberFormat(mcje).unit; //卖出单位
								var je = Number(sitems.je).toFixed(2) //净额
								// var je_value = numberFormat(je).value; //净额
								// var je_unit = numberFormat(je).unit; //净额单位
								hotmoney_card +=
									`
									<li class="hotmoney-card">
										<div class="card-block">
											<p class="card-title"><span class="sname">${sitems.sname}</span><span class="scode">${sitems.scode}</span></p>
											<ul class="card-history">
												<li class="bt-line">
													<p>买入总计</p>`;
													if(mrje > 0) {
													hotmoney_card +=`<p class="add"><span class="num">${mrje}</span>万</p>`	
													} else if(mrje == 0) {
													hotmoney_card +=`<p><span class="num">${mrje}</span>万</p>`	
													} ;
													
								hotmoney_card +=`</li>
												<li class="bt-line">
													<p>卖出总计</p>`;
													if(mcje > 0) {
													hotmoney_card +=`<p class="min"><span class="num">${mcje}</span>万</p>`		
													}  else if(mcje == 0) {
													hotmoney_card +=`<p><span class="num">${mcje}</span>万</p>`	
													} ;					
								hotmoney_card +=`</li>
												<li class="bt-line">
													<p>净额</p>`;
								if (je > 0) {
									hotmoney_card += `<p class="cdje add"><span class="num">+${je}</span>万</p>`
								} else if (je < 0) {
									hotmoney_card += `<p class="cdje min"><span class="num">${je}</span>万</p>`
								} else if (je == 0) {
									hotmoney_card += `<p class="cdje"><span class="num">${je}</span>万</p>`
								};

								hotmoney_card += `</li>
												<li>
													<p>方向</p>`;
								if (je > 0) {
									if (je / mrje >= 0.4) {
										hotmoney_card += `<p>买入</p>`
									} else {
										hotmoney_card += `<p>做T</p>`
									}
								} else if (je < 0) {
									if (Math.abs(je / mcje) >= 0.4) {
										hotmoney_card += `<p>卖出</p>`
									} else {
										hotmoney_card += `<p>做T</p>`
									}
								} else if (je == 0) {
									hotmoney_card += `<p>做T</p>`
								}


								hotmoney_card +=
									`</li>								
											</ul>
											<div class="card-bottom-tips">
												<ul class="yyb_trade  bt-line">`;
								$.each(sitems.yyb_info, function(i, ssitems) {
									// console.log(ssitems);
									hotmoney_card +=
										`<li>
													<p class="tips-title">${ssitems.yyb_name}</p>
													<div class="tips-trade">`;
													if(ssitems.mrje > 0) {
													hotmoney_card +=`<p>买入 <span class="num add">+${Number(ssitems.mrje).toFixed(2)}万</span></p>`	
													} else if(ssitems.mrje == 0) {
													hotmoney_card +=`<p>买入 <span class="num">${Number(ssitems.mrje).toFixed(2)}万</span></p>`	
													} ;
													if(ssitems.mcje > 0) {
													hotmoney_card +=`<p>卖出 <span class="num min">-${Number(ssitems.mcje).toFixed(2)}万</span></p>`	
													} else if(ssitems.mcje == 0) {
													hotmoney_card +=`<p>卖出 <span class="num">${Number(ssitems.mcje).toFixed(2)}万</span></p>`	
													} ;																				
									hotmoney_card +=`</div>
													</li>`;
								});

								hotmoney_card +=
									`</ul>
											</div>
										</div>
										<a class="detail-btn" javascript="void(0)"><span>查看详情</span></a>
									</li>`;

							});
							hotmoney_card += `</ul>
							</li>`;
							$(".history-box").append(hotmoney_card);
						});
					} else {
						$("#history .more_load span").empty();
						$("#history .more_load span").html("没有更多数据了")
					}
				}
			})
		};
	})
}

//获取搜索结果
function searchList(type, keyword) {
	get({
		url: "stock/lhb_search",
		beforeSend: "",
		data: {
			type,
			keyword,
		},
		beforeSend: "",
		success: volid => {
			var res = (volid.data.data).slice(0, 6);
			// console.log(res);
			if (type == 0) {
				if (res.length !== 0) {
					$(".mask-serach-list .content-null").hide();
					$.each(res, function(i, items) {
						// console.log(items);
						var search_list = "";
						search_list +=
							`<li class="bt-line">
							<p>${items.sname}</p>
							<span>${items.scode}</span>
						</li>`;
						$("#search_list").append(search_list);
					})
				} else {
					// console.log("sss")
					$(".mask-serach-list .content-null").show();
				}
			} else if (type == 1) {
				if (res.length !== 0) {
					// console.log("aaa")
					$(".mask-serach-list .content-null").hide();
					$.each(res, function(i, items) {
						// console.log(items);
						var search_list = "";
						search_list +=
							`<li class="bt-line" data-code="${items.id}">
							<p>${items.yz_name}</p>
						</li>`;
						$("#search_list").append(search_list);
					})
				} else {
					// console.log("sss")
					$(".mask-serach-list .content-null").show();
				}
			}
		},
	})
}

// 显示历史记录
function searchHistory(res, type) {
	if (type == 0) {
		$.each(res, function(i, items) {
			// console.log(items);
			var item = items.split('/');
			var hotlist = ""
			hotlist += `<li class="border"><a data-code="${item[1]}">${item[0]}</a></li>`
			// $(".hot-list li").remove();
			$(".hot-list").append(hotlist);
		})
	} else if (type == 1) {
		$.each(res, function(i, items) {
			// console.log(items);
			var item = items.split('/');
			var hotlist = ""
			hotlist += `<li class="border"><a data-code="${item[1]}">${item[0]}</a></li>`
			// $(".hot-list li").remove();
			$(".hot-list").append(hotlist);
		})
	}
}

// 获取有龙虎榜的日期
function getDates(date) {
	$.get("http://mesh.api.123.com.cn/stock/get_lhb_days", function(data, status) {
		var res = data.data
		if (date == res[0]) {
			$(".pre-day").addClass("no_pre");
			$(".next-day").removeClass("no_next");
			// console.log("第一天")
		} else if (date == res[res.length - 1]) {
			$(".pre-day").removeClass("no_pre");
			$(".next-day").addClass("no_next");
			// console.log("最后一天")
		} else {
			$(".pre-day").removeClass("no_pre");
			$(".next-day").removeClass("no_next");
		}
	});
}

// 判断是否为自选股
function checkStock(scode, sname, uuid) {
	// console.log(scode);
	$.ajax({
		url: "http://m.123.com.cn/app/zhi/checkStock?UUID=" + uuid,
		type: "get",
		data: {
			'stockcode': scode,
		},
		success: function(res) {
			// var sss = JSON.stringfity(res);
			// console.log(res.my)
			// console.log(res.my)
			if (res.code == 100) {
				if (res.my !== 0) {
					$(".stock-btn").addClass("active")
					$(".stock-btn").text("删除自选")
				}
			}
		}

	});
}

// 加入自选股
function addStock(sname, scode, uuid) {
	// console.log(scode);
	$.ajax({
		url: "http://m.123.com.cn/app/zhi/addStock?UUID=" + uuid,
		type: "post",
		data: {
			"stockname": sname,
			"stockcode": scode
		},
		success: function(res) {
			// var sss = JSON.stringfity(res);
			console.log(res)
		}

	});
}

// 删除自选股
function delStock(sname, scode, uuid) {
	// console.log(scode);
	$.ajax({
		url: "http://m.123.com.cn/app/zhi/delStock?UUID=" + uuid,
		type: "post",
		data: {
			"stockname": sname,
			"stockcode": scode
		},
		success: function(res) {
			// var sss = JSON.stringfity(res);
			console.log(res)
		}

	});
}
