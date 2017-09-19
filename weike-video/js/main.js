var config = {
    test_list_item: [
        '        <a class="test-content" data-type=%(LianXiType) data-id=%(LianXiID) data-name=%(LianXiName)>',
        '        <button class="btn btn-green">练习</button>',
        '        <span style="margin-left: 10px">%(LianXiName)</span>',
        '        <span class="test-status">状态：%(lianXiResultType)</span>',
        '    </a>',
    ].join(''),
    urlPre: 'http://w21.youkext.com/WebService/HuDongKeTang/'
};

// var vid = 1423;
// var userLoginName = 'as1';
// var classId = 125;

var vid = window.external.getVID();
var userLoginName = window.external.getLoginName();
var classId = window.external.getClassID();

function getWeikeDetails(id, player) {
    $.ajax({
        url: config.urlPre + 'Before_In_AfterClass.asmx/GetWeiKeInfoByVID',
        data: {
            VID: id
        },
        type: 'GET',
        success: function(data) {
            renderWeikeDetail($(data).text(), player);
        },
        error: function(e) {
            alert('网络错误');
        }
    });
}

function renderWeikeDetail(data, player) {
    var res = JSON.parse(data).listData[0] || {};
    player.src(res.ResUrl.replace(/flv/, 'mp4'));
    // $('.weike-title').html(res.ResName);
}

function getExercise(param, cb) {
    $.ajax({
        url: config.urlPre + 'learningExercises.asmx/GetWeiKeExamByVID',
        data: param,
        type: 'GET',
        success: function(data) {
            var data = $(data).text();
            var list = JSON.parse(data).listData || [],
                html = [];
            $(list).each(function(index, item) {
                html.push(config.test_list_item.jstpl_format(item));
            });
            $('.test-panel').html(html.join(''));
            cb();
        }
    });
}

function bindExerciseEvent() {
    $(document.body).on('click', '.test-panel', function(e) {
        var $e = $(e.target);
        if ($e.data('type') !== undefined) {
            window.external.exam($e.data('type'),$e.data('id'), $e.data('name'));
        } else {
            $e = $($(e.target).parent());
            window.external.exam($e.data('type'),$e.data('id'), $e.data('name'));
        }
    })
}

$(document).ready(function() {

    var video_player = videojs('myplayer');

    if (vid) {
        getWeikeDetails(vid, video_player);
    }

    if (userLoginName && classId) {

        var param = {
            VID: vid,
            userLoginName: userLoginName,
            CurClassID: classId
        }
        getExercise(param,bindExerciseEvent)

    }
});
