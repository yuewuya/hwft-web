﻿(function ($) {
    $.learuntab = {
        requestFullScreen: function () {
            let de = document.documentElement;
            if (de.requestFullscreen) {
                de.requestFullscreen();
            } else if (de.mozRequestFullScreen) {
                de.mozRequestFullScreen();
            } else if (de.webkitRequestFullScreen) {
                de.webkitRequestFullScreen();
            }
        },
        exitFullscreen: function () {
            let de = document;
            if (de.exitFullscreen) {
                de.exitFullscreen();
            } else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            }
        },
        refreshTab: function () {
            let currentId = $('.page-tabs-content').find('.active').attr('data-id');
            let target = $('.LRADMS_iframe[data-id="' + currentId + '"]');
            let url = target.attr('src');
            //$.loading(true);
            target.attr('src', url).load(function () {
                //$.loading(false);
            });
        },
        activeTab: function () {
            let currentId = $(this).data('id');
            if (!$(this).hasClass('active')) {
                $('.mainContent .LRADMS_iframe').each(function () {
                    if ($(this).data('id') == currentId) {
                        $(this).show().siblings('.LRADMS_iframe').hide();
                        return false;
                    }
                });
                $(this).addClass('active').siblings('.menuTab').removeClass('active');
                $.learuntab.scrollToTab(this);
            }
        },
        closeOtherTabs: function () {
            $('.page-tabs-content').children("[data-id]").find('.fa-remove').parents('a').not(".active").each(function () {
                $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').remove();
                $(this).remove();
            });
            $('.page-tabs-content').css("margin-left", "0");
        },
        closeTab: function () {
            let closeTabId = $(this).parents('.menuTab').data('id');
            let currentWidth = $(this).parents('.menuTab').width();
            if ($(this).parents('.menuTab').hasClass('active')) {
                if ($(this).parents('.menuTab').next('.menuTab').size()) {
                    let activeId = $(this).parents('.menuTab').next('.menuTab:eq(0)').data('id');
                    $(this).parents('.menuTab').next('.menuTab:eq(0)').addClass('active');

                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == activeId) {
                            $(this).show().siblings('.LRADMS_iframe').hide();
                            return false;
                        }
                    });
                    let marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
                    if (marginLeftVal < 0) {
                        $('.page-tabs-content').animate({
                            marginLeft: (marginLeftVal + currentWidth) + 'px'
                        }, "fast");
                    }
                    $(this).parents('.menuTab').remove();
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                }
                if ($(this).parents('.menuTab').prev('.menuTab').size()) {
                    let activeId = $(this).parents('.menuTab').prev('.menuTab:last').data('id');
                    $(this).parents('.menuTab').prev('.menuTab:last').addClass('active');
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == activeId) {
                            $(this).show().siblings('.LRADMS_iframe').hide();
                            return false;
                        }
                    });
                    $(this).parents('.menuTab').remove();
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                }
            }
            else {
                $(this).parents('.menuTab').remove();
                $('.mainContent .LRADMS_iframe').each(function () {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });
                $.learuntab.scrollToTab($('.menuTab.active'));
            }
            return false;
        },
        addTab: function () {
            $(".navbar-custom-menu>ul>li.open").removeClass("open");
            let dataId = $(this).attr('data-id');
            if (dataId != "") {
                //top.$.cookie('nfine_currentmoduleid', dataId, { path: "/" });
            }
            let dataUrl = $(this).attr('href');
            let menuName = $.trim($(this).text());
            let flag = true;
            if (dataUrl == undefined || $.trim(dataUrl).length == 0) {
                return false;
            }
            $('.menuTab').each(function () {
                if ($(this).data('id') == dataUrl) {
                    if (!$(this).hasClass('active')) {
                        $(this).addClass('active').siblings('.menuTab').removeClass('active');
                        $.learuntab.scrollToTab(this);
                        $('.mainContent .LRADMS_iframe').each(function () {
                            if ($(this).data('id') == dataUrl) {
                                $(this).show().siblings('.LRADMS_iframe').hide();
                                return false;
                            }
                        });
                    }
                    flag = false;
                    return false;
                }
            });
            if (flag) {
                let str = '<a href="javascript:;" class="active menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-remove"></i></a>';
                $('.menuTab').removeClass('active');
                let str1 = '<iframe class="LRADMS_iframe" id="iframe' + dataId + '" name="iframe' + dataId + '"  width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
                $('.mainContent').find('iframe.LRADMS_iframe').hide();
                $('.mainContent').append(str1);
                //$.loading(true);
                $('.mainContent iframe:visible').load(function () {
                    //$.loading(false);
                });
                $('.menuTabs .page-tabs-content').append(str);
                $.learuntab.scrollToTab($('.menuTab.active'));
            }
            return false;
        },
        scrollTabRight: function () {
            let marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
            let tabOuterWidth = $.learuntab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            let visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            let scrollVal = 0;
            if ($(".page-tabs-content").width() < visibleWidth) {
                return false;
            } else {
                let tabElement = $(".menuTab:first");
                let offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                scrollVal = $.learuntab.calSumWidth($(tabElement).prevAll());
                if (scrollVal > 0) {
                    $('.page-tabs-content').animate({
                        marginLeft: 0 - scrollVal + 'px'
                    }, "fast");
                }
            }
        },
        scrollTabLeft: function () {
            let marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
            let tabOuterWidth = $.learuntab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            let visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            let scrollVal = 0;
            if ($(".page-tabs-content").width() < visibleWidth) {
                return false;
            } else {
                let tabElement = $(".menuTab:first");
                let offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                offsetVal = 0;
                if ($.learuntab.calSumWidth($(tabElement).prevAll()) > visibleWidth) {
                    while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                        offsetVal += $(tabElement).outerWidth(true);
                        tabElement = $(tabElement).prev();
                    }
                    scrollVal = $.learuntab.calSumWidth($(tabElement).prevAll());
                }
            }
            $('.page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        },
        scrollToTab: function (element) {
            let marginLeftVal = $.learuntab.calSumWidth($(element).prevAll()),
                marginRightVal = $.learuntab.calSumWidth($(element).nextAll());
            let tabOuterWidth = $.learuntab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            let visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            let scrollVal = 0;
            if ($(".page-tabs-content").outerWidth() < visibleWidth) {
                scrollVal = 0;
            } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
                if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
                    scrollVal = marginLeftVal;
                    let tabElement = element;
                    while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
                        scrollVal -= $(tabElement).prev().outerWidth();
                        tabElement = $(tabElement).prev();
                    }
                }
            } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
                scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
            }
            $('.page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        },
        calSumWidth: function (element) {
            let width = 0;
            $(element).each(function () {
                width += $(this).outerWidth(true);
            });
            return width;
        },
        init: function () {
            $('.menuItem').on('click', $.learuntab.addTab);
            $('.menuTabs').on('click', '.menuTab i', $.learuntab.closeTab);
            $('.menuTabs').on('click', '.menuTab', $.learuntab.activeTab);
            $('.tabLeft').on('click', $.learuntab.scrollTabLeft);
            $('.tabRight').on('click', $.learuntab.scrollTabRight);
            $('.tabReload').on('click', $.learuntab.refreshTab);
            $('.tabCloseCurrent').on('click', function () {
                $('.page-tabs-content').find('.active i').trigger("click");
            });
            $('.tabCloseAll').on('click', function () {
                $('.page-tabs-content').children("[data-id]").find('.fa-remove').each(function () {
                    $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').remove();
                    $(this).parents('a').remove();
                });
                $('.page-tabs-content').children("[data-id]:first").each(function () {
                    $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').show();
                    $(this).addClass("active");
                });
                $('.page-tabs-content').css("margin-left", "0");
            });
            $('.tabCloseOther').on('click', $.learuntab.closeOtherTabs);
            $('.fullscreen').on('click', function () {
                if (!$(this).attr('fullscreen')) {
                    $(this).attr('fullscreen', 'true');
                    $.learuntab.requestFullScreen();
                } else {
                    $(this).removeAttr('fullscreen')
                    $.learuntab.exitFullscreen();
                }
            });
        }
    };
    $.learunindex = {
        load: function () {
            $("body").removeClass("hold-transition")
            $("#content-wrapper").find('.mainContent').height($(window).height() - 100);
            $(window).resize(function (e) {
                $("#content-wrapper").find('.mainContent').height($(window).height() - 100);
            });
            $(".sidebar-toggle").click(function () {
                if (!$("body").hasClass("sidebar-collapse")) {
                    $("body").addClass("sidebar-collapse");
                } else {
                    $("body").removeClass("sidebar-collapse");
                }
            })
            $(window).load(function () {
                window.setTimeout(function () {
                    $('#ajax-loader').fadeOut();
                }, 300);
            });
        },
        jsonWhere: function (data, action) {
            if (action == null) return;
            let reval = new Array();
            $(data).each(function (i, v) {
                if (action(v)) {
                    reval.push(v);
                }
            })
            return reval;
        },
        loadMenu: function (data) {
            let _html = "";
            $.each(data, function (i) {
                let row = data[i];
                if (row.parentId == "0") {
                    if (i == 0) {
                        _html += '<li class="treeview active">';
                    } else {
                        _html += '<li class="treeview">';
                    }
                    _html += '<a href="#">'
                    _html += '<i class="' + row.icon + '"></i><span>' + row.fullName + '</span><i class="fa fa-angle-left pull-right"></i>'
                    _html += '</a>'
                    let childNodes = $.learunindex.jsonWhere(data, function (v) {
                        return v.parentId == row.moduleId
                    });
                    if (childNodes.length > 0) {
                        _html += '<ul class="treeview-menu">';
                        $.each(childNodes, function (i) {
                            let subrow = childNodes[i];
                            let subchildNodes = $.learunindex.jsonWhere(data, function (v) {
                                return v.parentId == subrow.moduleId
                            });
                            _html += '<li>';
                            if (subchildNodes.length > 0) {
                                _html += '<a href="#"><i class="' + subrow.icon + '"></i>' + subrow.fullName + '';
                                _html += '<i class="fa fa-angle-left pull-right"></i></a>';
                                _html += '<ul class="treeview-menu">';
                                $.each(subchildNodes, function (i) {
                                    let subchildNodesrow = subchildNodes[i];
                                    _html += '<li><a class="menuItem" data-id="' + subrow.moduleId + '" href="' + subrow.urlAddress + '"><i class="' + subchildNodesrow.icon + '"></i>' + subchildNodesrow.fullName + '</a></li>';
                                });
                                _html += '</ul>';

                            } else {
                                _html += '<a class="menuItem" data-id="' + subrow.moduleId + '" href="' + subrow.urlAddress + '"><i class="' + subrow.icon + '"></i>' + subrow.fullName + '</a>';
                            }
                            _html += '</li>';
                        });
                        _html += '</ul>';
                    }
                    _html += '</li>'
                }
            });
            $("#sidebar-menu").append(_html);
            $("#sidebar-menu li a").click(function () {
                let d = $(this), e = d.next();
                if (e.is(".treeview-menu") && e.is(":visible")) {
                    e.slideUp(500, function () {
                        e.removeClass("menu-open")
                    }),
                        e.parent("li").removeClass("active")
                } else if (e.is(".treeview-menu") && !e.is(":visible")) {
                    let f = d.parents("ul").first(),
                        g = f.find("ul:visible").slideUp(500);
                    g.removeClass("menu-open");
                    let h = d.parent("li");
                    e.slideDown(500, function () {
                        e.addClass("menu-open"),
                            f.find("li.active").removeClass("active"),
                            h.addClass("active");

                        let _height1 = $(window).height() - $("#sidebar-menu >li.active").position().top - 41;
                        let _height2 = $("#sidebar-menu li > ul.menu-open").height() + 10
                        if (_height2 > _height1) {
                            $("#sidebar-menu >li > ul.menu-open").css({
                                overflow: "auto",
                                height: _height1
                            })
                        }
                    })
                }
                e.is(".treeview-menu");
            });
        }
    };

    /**
     * 初始化 获取用户菜单
     */
    $(function () {
        $.ajax({
            type: 'POST',
            url: getRootPath() + '/sys/menu/UserList',
            data: null,
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                "token": localStorage.getItem("token")
            },
            success: function (result) {
                window.permissions = result.permissions;
                window.setTimeout(function () {
                    $('#ajax-loader').fadeOut();
                }, 300);
                $.learunindex.load();
                //$.learunindex.loadMenu(JSON.parse(result.menuList));
                $.learunindex.loadMenu(result.menuList);
                $.learuntab.init();
                getUserInfo();
            }
        });
        ajaxGetInvoke('/sys/user/info', null, function (data) {
            setCookie("userInfo", JSON.stringify(data.user));
            let token = localStorage.getItem("token");
            if (token == null) {
                window.location.href = getRootPath() + "/login.html";
            } else {
                let name = data.user.username;
                $("#userName").text(name);
                $("#userName2").text(name);
            }
        });
        $.ajax({
            type: 'POST',
            url: getRootPath() + '/sys/menu/topMenu',
            data: null,
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                "token": localStorage.getItem("token")
            },
            success: function (result) {
                let list = JSON.parse(result.topList);
                let innerText = '';
                for (let i = 0; i < list.length; i++) {
                    innerText = innerText + '<li><a class="menuItem" data-id="userInfo" href="' + list[i].urlAddress + '"><img src="' + list[i].icon + '" title="' + list[i].fullName + '"/><h2>' + list[i].fullName + '</h2></a></li>'
                }
                $("#innerTopHtml").html(innerText);
            }
        });
    });
})(jQuery);