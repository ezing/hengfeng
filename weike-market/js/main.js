var config = {
    weike_item: [
        '<div class="weike-item">',
        '    <div class="thumb-container">',
        '        <a href="#" class="video-href" data-url="%(SPUrl_str)" data-title="%(SPMC)"></a>',
        '        <i class="bg"></i>',
        '        <img src="%(SLTUrl)" alt="">',
        '        <span class="video-time">%(ShiChang)</span>',
        '    </div>',
        '    <h4 class="weike-title" style="margin-left:10px">%(SPMC)</h4>',
        '</div>'
    ].join(''),
    subject_item: [
        '<li data-type="%(ID)">%(Name)</li>'
    ].join(''),
    // url: 'http://w21.pdoca.com/WEBservice/HuDongKeTang/Before_In_AfterClass.asmx/GetWeiKeList'
};

var defaultParam = {
    subjectID: '',
    // gradeID: 3,
    pageIndex: 1,
    pageSize: 15,
    searchText: ''
}

defaultParam.gradeID = window.external.getGradeID();
var paramCache = null, _subjects = [], _url = decodeURIComponent(M.util.getParam('urlName'));

function getWeikeList(param, cb) {
    paramCache = param;
    $.ajax({
        url: _url,
        // url: config.url,
        data: paramCache,
        type: 'POST',
        success: function(data) {
            renderWeikeList(data);
            if (typeof cb === 'function') {
                cb();
            }
        },
        error: function(e) {
            // alert(JSON.stringify(e))
        }
    });
}

function renderWeikeList(data) {
    if (!M.util.isJSON(data)) {
        data = JSON.parse($(data).text());
    } else {
        data = JSON.parse(data);
    }
    var list = data.listData || [],
        html = [];
    $(list).each(function(index, item) {
        item.SPUrl_str = item.SPUrl.replace(/flv/, 'mp4');
        html.push(config.weike_item.jstpl_format(item));
    });
    // $('.thumb-container img').css('height', 'auto');
    $('.video-container').html(html.join('')).show();
    var pageTotal = Math.ceil(data.Total / defaultParam.pageSize),
        pageIndex = data.pageIndex;
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
    $('.subject-slt').html($e.text());
    $('.subjects > ul').toggle();
    $('.search-input').val('');
    $('.back_btn').css('background', 'url(./css/img/back.png) no-repeat center').attr('disabled', 'disabled');
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

$(document.body).on('focus', '#search', function() {
    window.external.OpenKeyBoard('search');
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

$(document.body).on('click', '.go-back', function() {
    pauseVideo();
    $('.video-play-panel').hide();
    $('.search-bar').show();
    getWeikeList(defaultParam);
})

$(document.body).on('click', '.video-href', function(e) {
    var $e = $(e.target);
    $('.video-container').hide();
    $('.search-bar').hide();
    $('#title').html($e.data('title'));
    jwplayer('loading').setup({
        autostart: true,
        screencolor: '0xFFFFFF',
        flashplayer: './js/player.swf',
        file: $e.data('url'),
        height: 500,
        width: 800,
        stretching: "fill",
        // skin: {
        //     "url": "./css/jw-skin.css",
        //     "name": "myskin"
        // }
    });
    $('.video-play-panel').show();
    // var str = '<video class="video-js vjs-default-skin" controls data-setup="{ html5 : { nativeControlsForTouch : true }, controlBar: { volumePanel: {inline: false } } }" id="modal-video" autoplay src="' + $e.data('url') + '" poster=""></video>';
    // bootbox.dialog({
    //     title: $e.data('title'),
    //     message: str,
    // });
    // $('.modal-title').html($e.data('title'));
    // var player = videojs('modal-video');
    // player.src($e.data('url'));
    // $('.modal').modal('toggle');
    // //fix modal size
    // player.on('loadeddata', function() {
    //     var screen_width = screen.width;
    //     var currentWidth = $('#modal-video').width();
    //     var $video_container = $('.modal-video-dimensions');
    //     if (screen_width < 1800) {
    //         if (630 <= currentWidth) {
    //             $('.modal-dialog').removeClass('modal-md').addClass('modal-lg');
    //             if (currentWidth > 820) {
    //                 $video_container.css({
    //                     'width': '820px',
    //                     'height': '462px'
    //                     // 'width': 1.5*currentWidth,
    //                     // 'height': 1.5*($('#modal-video').height())
    //                 })
    //             }
    //         } else {
    //             $('.modal-dialog').removeClass('modal-lg').addClass('modal-md')
    //         }
    //     } else {
    //         // if (currentWidth > 630) {
    //             $('.modal-dialog').removeClass('modal-lg modal-md').addClass('modal-xl')
    //             $video_container.css({
    //                 'width': '1000px',
    //                 'height': '560px'
    //             })
    //         // }
    //     }
    // })
})

function pauseVideo() {
    // var player = videojs('modal-video');
    // player.pause();
    jwplayer().pause(true)
}

$(document).ready(function() {
    _subjects = decodeURIComponent(M.util.getParam('subjects'));
    var html = [],
        list = [], $ul = $('.subjects ul');
    if (_subjects.length) {
        list = JSON.parse(_subjects);
    } else {
        list = [{
            ID: '',
            Name: "全部"
        }, {
            ID: 1,
            Name: "语文"
        },{
            ID: 2,
            Name: "数学"
        }, {
            ID: 3,
            Name: "英语"
        }]
    }
    $(list).each(function(index, item) {
        html.push(config.subject_item.jstpl_format(item));
    });
    $ul.html(html.join(''));
    var height = $('.subjects ul li').css('height');
    $ul.css('top', '-' + parseInt(height)*list.length +'px');
    getWeikeList(defaultParam);
});
