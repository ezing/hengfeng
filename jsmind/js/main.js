var options = {
    container: 'jsmind_container',
    editable: true,
    theme: 'primary'
}
var jm = jsMind.show(options);


function allowDrop(e) {
    e.preventDefault();
}

function drag(e) {
    var $e = $(e.target),
        _text = $e.text();
    if (_text && _text != '') {
        e.dataTransfer.setData("Text", _text);
        // $e.remove();
        // e.dataTransfer.setData("Text", _text);
        // ev.dataTransfer.setData("Text", $(ev.target).val());
    }
}

function end(e) {
    $(e.target).remove();
    // if ($('.nodes').children().length == 0) {
    //     $('.nodes').html('无');
    // }
}

function drop(e) {
    e.preventDefault();
    var name = e.dataTransfer.getData("Text");
    if (name) {
        addNode(name);
    }
}

function createNode(name) {
    // var root_node_html = '根节点（不可删除）：<button class="btn btn-default" contenteditable="true">' + name + '</button>';
    // var html = '<input class="btn btn-default" value="' + name + '"draggable="true" ondragstart="drag(event)" style="width:80px"/>';
    // if ($('.add-node').text() == '新建根节点') {
    //     jm.update_node('root', name);
    //     $('.root-node').html(root_node_html).show();
    //     $('.add-node').html('新建子节点');
    //     $('.del-node').removeClass('hide');
    // } else {
    // }
    if ($('.nodes').html().indexOf(name) != -1 || jm.get_node(name)) {
        alert('节点已存在');
        return;
    } else {

        var html = '<button class="btn btn-default" draggable="true" ondragstart="drag(event)" ondragend="end(event)">' + name + '</button>';
        // var $button = $(html);
        // $button.data('vm', vm);
        $('.nodes').append(html);
        $('.child-nodes').show();
    }
}

function addNode(name) {
    var _node = jm.get_selected_node(); // as parent of new node
    if (!_node) {
        _node = jm.get_root();
    }

    jm.add_node(_node, name, name);
}
$(document.body).on('click', '.add-node', function(e) {
    // var node_name = '';
    // if ($('.add-node').text() == '新建根节点') {
    //     node_name = prompt('请输入根节点名')
    // } else {
    // }
    $('.nodes > button').removeClass('node');
    var node_name = prompt('请输入节点名');
    if (node_name) {
        createNode(node_name);
    }
});

$(document.body).on('click', '.del-node', function(e) {
    var _node = jm.get_selected_node();
    if (!_node) {
        alert('请选择一个节点')
    } else if (_node == jm.get_root()) {
        alert('不能删除根节点')
    } else {
        jm.remove_node(_node);
    }
})

//使用背景按钮删除
// $(document.body).on('click', '.del-node', function() {
//     $('.nodes > button').toggleClass('node');
// });
//
// $(document.body).on('click', '.node', function(e) {
//     var $e = $(e.target), name = $e.text();
//     $e.remove();
//     if (jm.get_node(name)) {
//         jm.remove_node(name);
//     }
//     if ($('.nodes').children().length == 0) {
//         $('.child-nodes').hide();
//     }
// })
