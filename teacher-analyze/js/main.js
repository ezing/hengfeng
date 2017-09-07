// var urlPre = "http://w21.pdoca.com/WEBservice/HuDongKeTang/teacherinfo.asmx/";
var urlPre = decodeURIComponent(getParam('urlName'));
var list_item = [
    '<tr>',
    '    <td>%(Sort_Id)</td>',
    '    <td>%(userRealName)</td>',
    '    <td>%(XiaoLv_RightCount)</td>',
    '    <td>%(WeiKeFinishCount)</td>',
    '    <td>%(DaTiShiChang)</td>',
    '    <td>%(RenWuFinishPercent_str)</td>',
    '</tr>'
].join('');

var classId = getParam('banJiID');
var tpId = getParam('tpID');
var subjectId = getParam('subjectID');
var defaultParam = {
    banJiID: classId,
    tpID: tpId,
    subjectID: subjectId,
    startTime: '',
    endTime: ''
}
var resChart = echarts.init(document.getElementById('result'));

var option1 = {
    xAxis: {
        data: ["认真（平均）", "积极（平均）", "效率（平均）"],
        axisLine: {
            lineStyle: {
                color: '#cccccc'
            }
        },
        axisLabel: {
            textStyle: {
                color: '#666666',
                fontSize: 16,
                fontWeight: '400'
            }
        }
    },
    yAxis: {
        name: '单位/%',
        max: 100,
        nameTextStyle: {
            color: '#999999',
            fontSize: 16,
            // fontFamily: 'NotoSansHans-Light'
        },
        axisLine: {
            lineStyle: {
                color: '#cccccc'
            }
        },
        axisLabel: {
            textStyle: {
                color: '#666666',
                fontWeight: '400',
                fontSize: 16
            }
        }
    },

    series: [{
        type: 'bar',
        data: [],
        itemStyle: {
            normal: {
                color: function(params) {
                    // build a color map as your need.
                    var colorList = [
                        '#00bda5', '#ff4526', '#ffc600'
                    ];
                    return colorList[params.dataIndex]
                },
                opacity: 0.5,
                label: {
                    show: true,
                    textStyle: {
                        color: '#999999',
                        fontSize: '14px'
                    },
                    position: 'top'
                }
            }
        },
        barWidth: '50%'
    }]
};
resChart.setOption(option1);

$.ajax({
    url: urlPre + 'getBanJiAvgLearningAnalysis_KeTangBiaoXian',
    data: defaultParam,
    type: 'POST',
    success: function(data) {
        if (!isJSON(data)) {
            data = JSON.parse($(data).text());
        } else {
            data = JSON.parse(data);
        }
        var list = [data.RenZhenAvg, data.JiJiAvg, data.XiaoLvAvg];
        var resList = list.map(function(obj) {
            return formateNum(obj);
        });
        resChart.setOption({
            series: [{
                data: resList
            }]
        })
    },
    error: function(e) {
        // alert('网络错误');
    }
})

var examChart = echarts.init(document.getElementById('exam'));
var option2 = {

    radar: [{
        name: {
            textStyle: {
                color: '#666666'
            }
        },
        indicator: [{
                text: '课前预习',
                max: 100
            },
            {
                text: '截屏测验',
                max: 100
            },
            {
                text: '课后作业',
                max: 100
            },
            {
                text: '随堂测验',
                max: 100
            }
        ],
        axisLabel: {
            show: true,
            showMinLabel: false,
            textStyle: {
                color: '#cccccc',
                fontSize: '14px'
            }
        },
        center: ['50%', '50%'],
        radius: 98
    }, ],
    series: [{
        type: 'radar',
        tooltip: {
            trigger: 'item'
        },
        itemStyle: {
            normal: {
                borderColor: '#00bda5',
                areaStyle: {
                    type: 'default',
                    color: '#00bda5',
                    opacity: 0.3
                },
                lineStyle: {
                    color: '#00bda5'
                }
            },
        },
        data: [{
            value: [],
        }]
    }],
    textStyle: {
        color: '#000',
        fontSize: 16
    }

};

examChart.setOption(option2);

$.ajax({
    url: urlPre + 'getBanJiAvgLearningAnalysis_CeYan',
    data: defaultParam,
    type: 'GET',
    success: function(data) {
        if (!isJSON(data)) {
            data = JSON.parse($(data).text());
        } else {
            data = JSON.parse(data);
        }
        var list = [data.KeQianRightPercentAvg, data.KeZhongRightPercentAvg, data.KeHouRightPercentAvg, data.JiePingRightPercentAvg];
        var resList = list.map(function(obj) {
            return formateNum(obj);
        });
        examChart.setOption({
            series: [{
                data: [{
                    value: resList
                }]
            }]
        })
    },
    error: function(e) {
        // alert('网络错误');
    }
})

$.ajax({
    url: urlPre + 'teacherGetStudentLearningAnalysis_RenWu',
    data: defaultParam,
    type: 'GET',
    success: function(data) {
        if (!isJSON(data)) {
            data = JSON.parse($(data).text());
        } else {
            data = JSON.parse(data);
        }
        var list = data.listData || [],
            html = [];
        $(list).each(function(index, item) {
            item.RenWuFinishPercent_str = formateNum(item.RenWuFinishPercent);
            html.push(list_item.jstpl_format(item));
        });
        $('.user_list').html(html.join(''));
    },
    error: function(e) {
        // alert('网络错误');
    }
})

$(document.body).on('click', '.class-detail', function() {
    location.href = './class-detail.html?banJiID=' + classId + '&urlPre=' + urlPre;
})

$(document.body).on('click', '.exam-detail', function() {
    location.href = './exam-detail.html?banJiID=' + classId + '&urlPre=' + urlPre;
})
