var config = {
    list_item: [
        '<div class="panel panel-default">',
        '    <div class="panel-body">',
        '        <h6>%(bijiCJRQ)</h6>',
        '        <p style="float:left">',
        '            %(bijiContent)',
        '        </p>',
        '        <div class="pull-right">',
        '            <button type="button" class="btn btn-danger btn-xs delNoteBtn" style="float:left" data-note_id="%(bijiID)">',
        '                <span class="glyphicon glyphicon-trash"></span>',
        '            </button>',
        '        </div>',
        '    </div>',
        '</div>'
    ].join(''),
    urlPre: 'http://w21.youkext.com/WebService/HuDongKeTang/'
};

var vid = M.util.getParam('VID');
var userLoginName = M.util.getParam('userLoginName');
var classId = M.util.getParam('classId');
var param = {
    VID: vid,
    userLoginName: userLoginName
}

function getWeikeDetails(id) {
    $.ajax({
        url: config.urlPre + 'Before_In_AfterClass.asmx/GetWeiKeInfoByVID',
        data: {
            VID: id
        },
        type: 'GET',
        success: function(data) {
            renderWeikeDetail($(data).text());
        },
        error: function(e) {
            alert('出错啦');
        }
    });
}

function renderWeikeDetail(data) {
    var res = JSON.parse(data).listData[0] || {};
    $('.weike-title').html(res.ResName);
    jwplayer('loading').setup({
        // autostart: true,
        screencolor: '0x000000',
        flashplayer: './js/player.swf',
        file: res.ResUrl,
        height: 380,
        width: '100%',
        events: {
            // onComplete: function() {
            //  	PageReloadBtnFun('../res/JYFXPJ/Video/2017_4_1/636266400737679915_2091.flv')
            // }
        }
    });
    $('.downloadUrl').attr('href', res.ResUrl);
}

function getExercise(param, cb) {
    $.ajax({
        url: config.urlPre + 'learningExercises.asmx/GetWeiKeExamByVID',
        data: param,
        type: 'GET',
        success: function(data) {
            var res = data || {};
            cb(res);
        }
    });
}

function getNote(param) {
    $.ajax({
        url: config.urlPre + 'Before_In_AfterClass.asmx/GetWeiKeBiJiByVID',
        data: param,
        type: 'GET',
        success: function(data) {
            renderNote($(data).text());
        }
    });
}

function renderNote(data) {
    var list = JSON.parse(data).listData || [], html = [];
    $(list).each(function(index, item) {
        html.push(config.list_item.jstpl_format(item));
    });

    $('.notesPanel').html(html.join(''));
}

function delNote(id) {
    $.ajax({
        url: config.urlPre + 'Before_In_AfterClass.asmx/DelWeiKeBiJiByBijiID',
        data: {
            bijiID: id
        },
        type: 'POST',
        success: function() {
            // alert('删除成功');
            getNote(param);
        }
    });
}

function addNote(param) {
    $.ajax({
        url: config.urlPre + 'Before_In_AfterClass.asmx/AddWeiKeBiJi',
        data: param,
        type: 'POST',
        success: function(data) {
            if ($(data).text()) {
                getNote(param);
            }
        }
    });
}

function bindExerciseEvent(data) {
    $(document.body).on('click', '.yulanzuoye', function() {
        window.external.InterfaceForJS(data.LianXiType, data.LianXiID, data.LianXiName);
    })
}

$(document.body).on('click', '.startPlayBtn', function() {
    jwplayer().play();
});
$(document.body).on('click', '.replayBtn', function() {
    location.reload();
});

$(document.body).on('click', '.voiceInputBtn', function() {
    if ($("#voiceBtn").html() == "语音输入") {
        $("#voiceBtn").html("停止语音输入");
        wx.startRecord();
    } else {
        $("#voiceBtn").html("语音输入");


        wx.stopRecord({
            success: function(res) {
                varlocalId = res.localId;


                wx.translateVoice({
                    localId: varlocalId, // 需要识别的音频的本地Id，由录音相关接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function(res) {
                        // alert(res.translateResult); // 语音识别的结果
                        $("#txbBiJi").val(res.translateResult);
                    }
                });

            }
        });
    }
});

$(document.body).on('click', '.addNoteBtn', function() {
    var vid = M.util.getParam('VID');
    var userLoginName = M.util.getParam('userLoginName');
    var note_content = $('.note-content').val();
    var param = {
        VID: vid,
        userLoginName: userLoginName,
        bijiContent: note_content
    };
    addNote(param);
});

$(document.body).on('click', '.delNoteBtn', function() {
    var note_id = $(this).data('note_id')
    delNote(note_id);
});

$(document).ready(function() {

    if (vid) {
        getWeikeDetails(vid);
    }

    if (userLoginName) {
        getNote(param);
        if (classId) {
            var _param = param;
            _param.CurClassID = classId;
            getExercise(_param, function(data) {
                bindExerciseEvent(data);
            })
        }
    }
});
