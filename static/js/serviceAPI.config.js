const BASEURL = 'http://mesh.api.123.com.cn/'
const URL = {
    get_lhb_days : BASEURL + 'stock/get_lhb_days',
    market_hq_url : BASEURL + 'stock/market_hq',
    market_ranklist : BASEURL + 'stock/lhb_detail',
    hotmoney_list : BASEURL + 'stock/get_hot_money_list',
    hotmoney_detail : BASEURL + 'stock/get_hot_money_detail',
    hotmoney_detail_page : BASEURL + 'stock/get_hot_money_detail_page',
    stock_detail_date : BASEURL + 'stock/get_lhb_detail_page',
    stock_detail_hide  : BASEURL + 'stock/lhb_stock_detail',
    search  : BASEURL + 'stock/lhb_search',
}

module.exports = URL