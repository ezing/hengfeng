var urlPre = "http://w21.pdoca.com/WEBservice/HuDongKeTang/studentInfo.asmx/";
var list_item = [
    '<tr>',
    '    <td>%(rownum)</td>',
    '    <td>%(StudentRealName)</td>',
    '    <td>%(ExamRightCount)</td>',
    '    <td>%(WeiKeFinishCount)</td>',
    '    <td>%(DaTiShiChang)</td>',
    '    <td>%(RenWuFinishPercent_str)</td>',
    '</tr>'
].join('');

var userId = getParam('userID'); //学生
// var userId = 2227;
var tpId = getParam('tpID'); //课程
var subjectId = getParam('subjectID'); //学科

var defaultParam = {
    userID: userId,
    tpID: tpId,
    subjectID: subjectId,
    startTime: '',
    endTime: ''
}

var tList = [], sList = [];
var resChart = echarts.init(document.getElementById('result'));

var option1 = {
    xAxis: {
        data: ["认真（个人/平均）", "积极（个人/平均）", "效率（个人/平均）"],
        axisLine: {
            lineStyle: {
                color: '#cccccc'
            }
        },
        axisLabel: {
            textStyle: {
                color: '#666666',
                fontWeight: '400'
            }
        }
    },
    yAxis: {
        name: '单位/%',
        max: 100,
        nameTextStyle: {
            color: '#999999',
            fontSize: 12,
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
                fontWeight: '400'
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
                            fontSize: '10px'
                        },
                        position: 'top'
                    }
                }
            },
            barWidth: '10%',
            barGap: 0
        },
        {
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
                    opacity: 0.3,
                    label: {
                        show: true,
                        textStyle: {
                            color: '#999999',
                            fontSize: '10px'
                        },
                        position: 'top'
                    }
                }
            },
            barWidth: '10%'
        }
    ]
};
resChart.setOption(option1);

$.ajax({
    url: urlPre + 'getStudentLearningAnalysis_KeTangBiaoXian',
    data: defaultParam,
    type: 'POST',
    success: function(data) {
        var data = JSON.parse($(data).text());
        tList = [data.RenZhenAvg, data.JiJiAvg, data.XiaoLvAvg].map(function(obj) {
            return formateNum(obj);
        });
        sList = [data.RenZhenStudent, data.JiJiStudent, data.XiaoLvStudent].map(function(obj) {
            return formateNum(obj);
        });
        resChart.setOption({
            series: [{
                data: sList
            }, {
                data: tList
            }]
        })
    },
    error: function(e) {
        alert('出错啦');
    }
});

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
                fontSize: '12px'
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
        color: '#000'
    }

};
examChart.setOption(option2);

$.ajax({
    url: urlPre + 'getStudentLearningAnalysis_CeYan',
    data: defaultParam,
    type: 'GET',
    success: function(data) {
        var data = JSON.parse($(data).text());
        var list = [data.KeQianRightPercentStudent, data.KeZhongRightPercentStudent, data.KeHouRightPercentStudent, data.JiePingRightPercentStudent];
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
        alert('出错啦');
    }
})

$.ajax({
    url: urlPre + 'getStudentLearningAnalysis_RenWu',
    data: defaultParam,
    type: 'GET',
    success: function(data) {
        var data = JSON.parse($(data).text());
        data.RenWuFinishPercent_str = formateNum(data.RenWuFinishPercent)
        $('.user_list').html(list_item.jstpl_format(data));
    },
    error: function(e) {
        alert('出错啦');
    }
})

$(document.body).on('click', '.class-detail', function() {
    console.log(userId);
    location.href = './class-detail.html?userID=' + userId;
})

$(document.body).on('click', '.exam-detail', function() {
    location.href = './exam-detail.html?userID=' + userId;
})
