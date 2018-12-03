$(function () {
    getMenuList();
    getUserInfo();
});

/**
 * 获取用户菜单
 */
function getMenuList() {
    $.ajax({
        type: 'POST',
        url: getRootPath() + '/sys/menu/user',
        data: null,
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            "token": localStorage.getItem("token")
        },
        success: function (result) {
            window.permissions = result.permissions;
            let list = result.menuList;
            let text = '';
            for (let i = 0; i < list.length; i++) {
                let sonText = list[i].list;
                let str = '';
                for (let j = 0; j < sonText.length; j++) {
                    if(sonText[j].isChildrenMenu != 1){
                        str = str + '<li><cite></cite><a href="' + sonText[j].url + '" target="rightFrame">' + sonText[j].name + '</a><i></i></li>';
                    }
                }
                text = text + '<dd>' +
                    '<div class="title"><span><img src="assembly/images/' + list[i].icon + '"/></span>' + list[i].name + '</div>' +
                    '<ul class="menuson">' +
                    str +
                    '</ul>' +
                    '</dd>';
            }
            $("#innerHtml").html(text);
            action();
        }
    });
}

function action() {
    $(".menuson li").click(function () {
        $(".menuson li.active").removeClass("active");
        $(this).addClass("active");
    });

    $('.title').click(function () {
        let $ul = $(this).next('ul');
        $('dd').find('ul').slideUp();
        if ($ul.is(':visible')) {
            $(this).next('ul').slideUp();
        } else {
            $(this).next('ul').slideDown();
        }
    });
}

function getUserInfo() {
    ajaxGetInvoke('/sys/user/info', null, function (data) {
        setCookie("userInfo", JSON.stringify(data.user));
    });
}