var mind = {
            "meta": {
                "name": "demo",
                "author": "hizzgdev@163.com",
                "version": "0.2",
            },
            "format": "node_array",
            "data": [{
                    "id": "root",
                    "isroot": true,
                    "topic": "jsMind"
                },

                {
                    "id": "sub1",
                    "parentid": "root",
                    "topic": "sub1",
                    "background-color": "#0000ff",
                    "editable": false
                },
                {
                    "id": "sub2",
                    "parentid": "sub1",
                    "topic": "sub2",
                    "background-color": "#0000ff",
                    "editable": true
                }
            ]
        };
        var options = {
            container: 'jsmind_container',
            editable: true,
            theme: 'primary'
        }
        var jm = jsMind.show(options, mind);

        function addNode(name, e) {
            var _node = jm.get_selected_node();
            if (!_node) {
                _node = jm.get_root();
            }
            if (jm.add_node(_node, name, name)) {
                $(e.target).remove()
            } else {
                alert('节点已存在')
            }
        }

        function touching(e) {
            e.preventDefault();
        }

        function move(e) {
            e.preventDefault();
            //检测是否在div内
            var x = e.changedTouches[0].pageX;
            var y = e.changedTouches[0].pageY;
            var jsmind_area = document.getElementById('jsmind_container');
            var divx1 = jsmind_area.offsetLeft;
            var divy1 = jsmind_area.offsetTop;
            var divx2 = jsmind_area.offsetLeft + jsmind_area.offsetWidth;
            var divy2 = jsmind_area.offsetTop + jsmind_area.offsetHeight;
            if (divx1 < x && x < divx2 && divy1 < y && y < divy2) {
                addNode(e.target.innerHTML, e);
            }
        }
        $(document.body).on('click', '.reset', function() {
            location.reload();
        })
        $(document.body).on('click', '.showdata', function() {
            console.log(jm.get_data('node_array'))
        })
