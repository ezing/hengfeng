var config = {
    weike_item: [
        '<div class="weike-item">',
        '    <div class="thumb-container">',
        '        <a href="#" class="video-href" data-url="%(SPUrl_str)" data-title="%(SPMC)"></a>',
        '        <i class="bg"></i>',
        '        <img src="%(SLTUrl)" alt="" style="height:135px">',
        '        <span class="video-time">%(ShiChang)</span>',
        '    </div>',
        '    <h5 class="weike-title">%(SPMC)</h5>',
        '</div>'
    ].join(''),
    url: 'http://w21.pdoca.com/WEBservice/HuDongKeTang/Before_In_AfterClass.asmx/GetWeiKeList'
};

var defaultParam = {
    subjectID: '',
    gradeID: 1,
    pageIndex: 1,
    pageSize: 15,
    searchText: ''
}
var paramCache = null;

function getWeikeList(param, cb) {
    paramCache = param;
    $.ajax({
        url: config.url,
        data: paramCache,
        type: 'POST',
        success: function(data) {
            renderWeikeList($(data).text());
            if (typeof cb === 'function') {
                cb();
            }
        },
        error: function(e) {
            alert('出错啦');
        }
    });
}

function renderWeikeList(data) {
    var data = JSON.parse(data);
    var list = data.listData || [],
        html = [];
    $(list).each(function(index, item) {
        item.SPUrl_str = item.SPUrl.replace(/flv/, 'mp4');
        html.push(config.weike_item.jstpl_format(item));
    });
    $('.video-container').html(html.join(''));
    var pageTotal = Math.ceil(data.Total / defaultParam.pageSize), pageIndex = data.pageIndex;
    if (pageTotal === 1) {
        $('.back_btn').css('background', 'url(./css/img/back.png) no-repeat center').attr('disabled', 'disabled');
        $('.forward_btn').css('background', 'url(./css/img/forward.png) no-repeat center').attr('disabled', 'disabled');
    } else {
        if (pageIndex != 1) {
            $('.back_btn').css('background', 'url(./css/img/back1.png) no-repeat center').removeAttr('disabled');
        }
        if (pageIndex != pageTotal) {
            $('.forward_btn').css('background', 'url(./css/img/forward1.png) no-repeat center').removeAttr('disabled');
        }
    }
    $('.cur-page').html(pageIndex);
    $('.page-total').html(pageTotal);
}

function changeArrow(pageIndex) {
    var pageTotal = $('.page-total').text();

    if (pageIndex == pageTotal) {
        $('.forward_btn').css('background', 'url(./css/img/forward.png) no-repeat center').attr('disabled', 'disabled');
    } else {
        $('.forward_btn').css('background', 'url(./css/img/forward1.png) no-repeat center').removeAttr('disabled');
    }

    if (pageIndex === 1) {
        $('.back_btn').css('background', 'url(./css/img/back.png) no-repeat center').attr('disabled', 'disabled');
    } else {
        $('.back_btn').css('background', 'url(./css/img/back1.png) no-repeat center').removeAttr('disabled');
    }
}

$(document.body).on('click', '.subject-btn', function() {
    $('.subjects > ul').toggle();
});

$(document.body).on('click', '.subjects ul > li', function(e) {
    var $e = $(e.target);
    // $('.subject-slt').attr('data-sid', $e.data('type')).html($(e.target).text());
    $('.subject-slt').html($e.text());
    $('.subjects > ul').toggle();
    var subjectID = $e.data('type');
    paramCache.subjectID = subjectID;
    paramCache.pageIndex = 1;
    paramCache.searchText = '';
    getWeikeList(paramCache);
});

$(document.body).on('click', '.forward_btn', function() {
    var pageIndex = parseInt($('.cur-page').text()) + 1;
    paramCache.pageIndex = pageIndex;
    getWeikeList(paramCache, changeArrow(pageIndex));
});

$(document.body).on('click', '.back_btn', function() {
    var pageIndex = parseInt($('.cur-page').text()) - 1;
    paramCache.pageIndex = pageIndex;
    getWeikeList(paramCache, changeArrow(pageIndex));
});

$(document.body).on('click', '.go-search', function() {
    // var subjectID = $('.subject-slt').attr('data-sid') || '';
    // var _param = defaultParam;
    // _param.subjectID = subjectID;
    var searchText = $.trim($('.search-input').val()) || '';
    paramCache.searchText = searchText;
    paramCache.pageIndex = 1;
    getWeikeList(paramCache);
})

$(document.body).on('click', '.video-href', function(e) {
    var $e = $(e.target);
    $('.modal-title').html($e.data('title'));
    var player = videojs('modal-video');
    player.src($e.data('url'));
    $('.modal').modal('toggle');
    //fix modal size
    player.on('loadeddata', function() {
        var currentWidth = $('#modal-video').width();
        if (currentWidth >= 630) {
            $('.modal-dialog').removeClass('modal-md').addClass('modal-lg');
        } else {
            $('.modal-dialog').removeClass('modal-lg').addClass('modal-md')
        }
    })
})

$('.modal').on('hidden.bs.modal', function (e) {
  var player = videojs('modal-video');
  player.pause();
})

$(document).ready(function() {
    getWeikeList(defaultParam);
});
