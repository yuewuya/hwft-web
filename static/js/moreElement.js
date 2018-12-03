$(function () {
    $("#searchForm").append(
        '<p><span class="ccbtn ccSearchBtn" onclick="search()">查&nbsp;询</span>' +
        '<span class="ccbtn ccClearBtn" onclick="resetSearchForm() ">重&nbsp;置</span></p>'
    )
})

function resetSearchForm(){
    $("#searchForm").form("reset")
}
