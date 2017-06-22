var config = {
    // note_list_item: [
    //     '<div class="panel panel-default">',
    //     '    <div class="panel-body">',
    //     '        <h6>%(bijiCJRQ)</h6>',
    //     '        <p style="float:left">',
    //     '            %(bijiContent)',
    //     '        </p>',
    //     '        <div class="pull-right">',
    //     '            <button type="button" class="btn btn-danger btn-xs delNoteBtn" style="float:left" data-note_id="%(bijiID)">',
    //     '                <span class="glyphicon glyphicon-trash"></span>',
    //     '            </button>',
    //     '        </div>',
    //     '    </div>',
    //     '</div>'
    // ].join(''),
    test_list_item: [
        '        <a class="test-content">',
        '        <button class="btn btn-green">练习</button>',
        '        <span style="margin-left: 10px">%(LianXiName)</span>',
        '        <span class="test-status">状态：%(lianXiResultType)</span>',
        '    </a>',
    ].join(''),
    urlPre: 'http://w21.youkext.com/WebService/HuDongKeTang/'
};

// var vid = M.util.getParam('VID');
// var userLoginName = M.util.getParam('userLoginName');
// var classId = M.util.getParam('CurClassID');
//VID=1423&userLoginName=as1&CurClassID=125
var vid = 1423;
var userLoginName = 'as1';
var classId = 125;
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
            alert('出错啦');
        }
    });
}

function renderWeikeDetail(data, player) {
    var res = JSON.parse(data).listData[0] || {};
    player.src(res.ResUrl.replace(/flv/,'mp4'));
    // $('.weike-title').html(res.ResName);
    // jwplayer('loading').setup({
    // autostart: true,
    // screencolor: '0x000000',
    // flashplayer: './js/player.swf',
    // file: res.ResUrl,
    // height: 380,
    // width: '100%',
    // events: {
    // onComplete: function() {
    //  	PageReloadBtnFun('../res/JYFXPJ/Video/2017_4_1/636266400737679915_2091.flv')
    // }
    // }
    // });
    // $('#video_src').attr('src', res.ResUrl);
    // $('.downloadUrl').attr('href', res.ResUrl);
    // console.log(res.ResUrl);
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
            // cb();
        }
    });
}

// function getNote(param) {
//     $.ajax({
//         url: config.urlPre + 'Before_In_AfterClass.asmx/GetWeiKeBiJiByVID',
//         data: param,
//         type: 'GET',
//         success: function(data) {
//             renderNote($(data).text());
//         }
//     });
// }
//
// function renderNote(data) {
//     var list = JSON.parse(data).listData || [], html = [];
//     $(list).each(function(index, item) {
//         html.push(config.list_item.jstpl_format(item));
//     });
//
//     $('.notesPanel').html(html.join(''));
// }
//
// function delNote(id) {
//     $.ajax({
//         url: config.urlPre + 'Before_In_AfterClass.asmx/DelWeiKeBiJiByBijiID',
//         data: {
//             bijiID: id
//         },
//         type: 'POST',
//         success: function() {
//             // alert('删除成功');
//             getNote(param);
//         }
//     });
// }
//
// function addNote(param) {
//     $.ajax({
//         url: config.urlPre + 'Before_In_AfterClass.asmx/AddWeiKeBiJi',
//         data: param,
//         type: 'POST',
//         success: function(data) {
//             if ($(data).text()) {
//                 getNote(param);
//             }
//         }
//     });
// }
//
//
// $(document.body).on('click', '.startPlayBtn', function() {
//     jwplayer().play();
// });
// $(document.body).on('click', '.replayBtn', function() {
//     location.reload();
// });
//
// $(document.body).on('click', '.voiceInputBtn', function() {
//     if ($("#voiceBtn").html() == "语音输入") {
//         $("#voiceBtn").html("停止语音输入");
//         wx.startRecord();
//     } else {
//         $("#voiceBtn").html("语音输入");
//
//
//         wx.stopRecord({
//             success: function(res) {
//                 varlocalId = res.localId;
//
//
//                 wx.translateVoice({
//                     localId: varlocalId, // 需要识别的音频的本地Id，由录音相关接口获得
//                     isShowProgressTips: 1, // 默认为1，显示进度提示
//                     success: function(res) {
//                         // alert(res.translateResult); // 语音识别的结果
//                         $("#txbBiJi").val(res.translateResult);
//                     }
//                 });
//
//             }
//         });
//     }
// });
//
// $(document.body).on('click', '.addNoteBtn', function() {
//     var vid = M.util.getParam('VID');
//     var userLoginName = M.util.getParam('userLoginName');
//     var note_content = $('.note-content').val();
//     var param = {
//         VID: vid,
//         userLoginName: userLoginName,
//         bijiContent: note_content
//     };
//     addNote(param);
// });
//
// $(document.body).on('click', '.delNoteBtn', function() {
//     var note_id = $(this).data('note_id')
//     delNote(note_id);
// });
function bindExerciseEvent(data) {
    $(document.body).on('click', '.yulanzuoye', function() {
        window.external.InterfaceForJS(data.LianXiType, data.LianXiID, data.LianXiName);
    })
}

$(document).ready(function() {

    var video_player = videojs('myplayer');

    if (vid) {
        getWeikeDetails(vid, video_player);
    }

    if (userLoginName && classId) {
        // getNote(param);

        var param = {
            VID: vid,
            userLoginName: userLoginName,
            CurClassID: classId
        }
        getExercise(param, function(data) {
            bindExerciseEvent(data);
        })

    }
});
