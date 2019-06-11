//按照年视图 还是 月视图 返回相应的配置
function calendarRenderConfig(type, month) {
    var year = new Date().getFullYear();
    var yearViewConfig, monthViewConfig; //两种类型的配置

    yearViewConfig = {
        header: {
            left: '  ',
            center: 'title',
            right: ''
        },
        defaultDate: setDefaultDay(year, '01'),
        lang: 'zh-cn',
        defaultView: 'year',
        yearColumns: 3,
        showNonCurrentDates: false,
        // dayClick: dateClickHandler
    };

    monthViewConfig = {
        header: {
            left: 'prev next , today',
            center: 'title, submit',
            right: ''
        },
        defaultDate: setDefaultDay(year, month),
        lang: 'zh-cn',
        defaultView: 'month',
        yearColumns: 3,
        // dayClick: dateClickHandler,
        buttonIcons: false, // show the prev/next text
        eventLimit: true, // allow "    more" link when too many events
        selectable: true,
        viewRender: function () {
            getInfo
            // setSatSunColor();
        }
    };

    return type === 'year' ? yearViewConfig : monthViewConfig;
}

//渲染年视图日历
function renderYearCalendar() {
    var year = new Date().getFullYear();
    (function renderCalendar() {
        $('#calendar').fullCalendar(calendarRenderConfig('year'));
        monthCalendarDataInit();
        clearNorCurrentMonth();
        $('.fc-right').html('<button  type="button" class="submit fc-next-button fc-button fc-state-default fc-corner-left fc-corner-right">提交   </button>'); //添加提交按钮
        $('.submit').on('click', submitHandler);
    })();
    // ThumbnailsClickHandler(year);
}

//渲染 用户点击之后的单个月的日历视图
function renderCalendarOneMonth(year, month) {

    $('#calendar').fullCalendar(calendarRenderConfig('month', month));
    monthCalendarDataInit(); //初始化月份日历需要的数据
    // setSatSunColor();
    $('.fc-right').html('<button  type="button" class="submit fc-next-button fc-button fc-state-default fc-corner-left fc-corner-right">提交   </button>'); //添加提交按钮
    $('.submit').on('click', submitHandler);
}

//把日期对象 转换为 ‘2019-05-31’ 的格式
function formatDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
}
//设置每个月第一天为默认的第一天
function setDefaultDay(year, month) {
    var defaultDay = '' + year + '-' + month + '-' + '01';
    return defaultDay;
}

//缩略图点击事件
function ThumbnailsClickHandler(year) {
    $('#calendar').delegate('.fc-year-monthly-td', 'click', function (ev) {
        var findTag = 'a[data-year="' + year + '"]';
        var month = $(this).find('.fc-year-monthly-name').children('a').attr('data-month');
        month = Number(month) + 1;
        $('#calendar').fullCalendar('destroy');
        renderCalendarOneMonth(year, month);
    });
}

//渲染用户点击出来的月份的 日历

//请求数据
function getInfo() {
    $.ajax({
        url: 'http://localhost:3000/getInfo',
        type: 'GET',
        data: window.userChoosedDays,
        success: function (res) {
            var data = res.userChoosedDates;
            window.userChoosedDays = res.userChoosedDates;
            for (var i in data) {
                var day = data[i];
                var dateStr = day.date;
                var findTag = `td[data-date='${dateStr}']`;
                console.log('findTag', findTag);
                var ele = $('.fc-day-grid').find(findTag).css("background-color", "rgba(188, 232, 241, 0.5)");
            }

        },
        err: function (err) {
            console.log('err', err)

        }
    });
}

//提交按钮的处理事件
function submitHandler() {
    let dataarr = ['2019-05-03', '2019-05-05', '2019-06-07', '2019-06-09'];
    let months = [4, 4, 5, 5];

    let monthEles = $('.fc-year-monthly-td');
    let findTag = 'td[data-date="' + dataarr[0] + '"]';
    let targetEle = $(monthEles[4]).find('td[data-date="2019-05-03"]');

    for (let i = 0; i < targetEle.length; i++) {
        if ($(targetEle[i]).hasClass('fc-day')) {
            console.log($(targetEle[i][0]));

            $($(targetEle[i])[0]).css('color', 'red');
        }

    }


    // console.log('targetEle', targetEle);



    // $('.fc-content-skeleton').each(function (index, ele) {
    //     console.log(ele);
    // });
    // find('.not-current-month');
}

//初始化数据
function monthCalendarDataInit() {
    window.userChoosedDays = [];
    getInfo();
}

// 点击每一天的的事件处理

function dateClickHandler(dateStr, ele) {

    // var infoele = $('.fc-day-grid').find(findTag);
    // console.log('ele::::', info);
    // if (ele.hasClass('fc-other-month')) {
    //     return false;

    // }

    // var dateStr = formatDate(info._d);
    // var findTag = `td[data-date='${dateStr}']`;
    var dayObj = {
        date: '',
        event: '',
        info: ''
    };
    //如果是已添加的状态就取消掉  ， 如果未勾选，那么就添加上
    var userChoosedDays = window.userChoosedDays;
    console.log("userChoosedDays:::", userChoosedDays)
    var keyArr = [];
    for (var i in userChoosedDays) {
        var item = userChoosedDays[i];
        keyArr.push(item.date);
    }

    if (keyArr.indexOf(dateStr) === -1) {
        dayObj.date = dateStr;
        userChoosedDays.push(dayObj);

        ele.addClass('user_choosed');
    } else {
        for (var i in userChoosedDays) {
            var day = userChoosedDays[i];
            if (day.date === dateStr) {
                userChoosedDays.splice(i, 1); // 删除
            }
        }
        ele.removeClass('user_choosed');
    }
}


//设置周六周日两栏的颜色
function setSatSunColor() {
    $('.fc-sat , .fc-sun').css({
        'background-color': '#F5F5F5',
        "border-color": "#dddddd"
    });
}


//清除一个月的日历内 不属于本月的那些天
function clearNorCurrentMonth() {
    $('.fc-other-month').text('').addClass("not-current-month");;

}


//修改有两个 今天高亮的问题
function setToday() {

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();

    var eles = $('.fc-year-view').find('.fc-year-monthly-td');
    var currentMonthElement = eles[month];
    let findTag = 'td[data-date="' + formatDate(date) + '"]';
    $(currentMonthElement).find(findTag).addClass('fc-today').css({
        'color': 'red',
        'font-size': '1.5em'
    });
    console.log(eles);

    $(this).find('.fc-year-monthly-name').children('a').attr('data-month')
    $('.fc-today').each(
        function (index, ele) {
            console.log(ele);

        }
    );

}