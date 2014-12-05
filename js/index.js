/**
 * Created by jinxlc on 14-11-7.
 */
require.config({
    baseUrl: "js/lib/",
    paths: {
        jquery: 'jquery-2.1.1'
    }
});
require(['jquery'], function($) {
    $(document).ready(function(){
        $("#reader-page-wrap").height($(document).height());
        $("#txt-reader-wrap-1").find("span").hover(function() {
           // window.getSelection
           // var hang = $(this).parent().prevAll().length + 1;
           // var lie = $(this).prevAll().length + 1;
           // console.log("第" + hang + "行，第" + lie + "列");
        });
        $('#reader-page-wrap').mousedown(function(e){
            if( e.which == 1){//鼠标左键
                //pointX = e.pageX;
                //pointY = e.pageY;
                //console.log("x:"+pointX+"  "+"y:"+pointY);
            }else if(e.which == 3){//鼠标右键
            }
        });
        $('#reader-page-wrap').mouseup(function(e){
            if( e.which == 1){//鼠标左键
                if(window.getSelection().isCollapsed == false){//有选择内容
                    placeUnderline();
                }
            }else if(e.which == 3){//鼠标右键
            }
        });
    });
    //绘制盖在选中文字上的span
    var placeUnderline =function(){
        if(window.getSelection().isCollapsed == false){//有选择内容
            //取得选择的起点和终点
            var anchorNode = window.getSelection().anchorNode.parentNode;//起点
            var anchorOffse = window.getSelection().anchorOffset;//起点偏移量
            var focusNode = window.getSelection().focusNode.parentNode;//结束点节点
            var focusOffset = window.getSelection().focusOffset;//结束点偏移量
            //计算出第一个和最后一个字符的相对父元素（在段落中）的偏移位置
            var firstCharacterOffset;
            var lastCharacterOffset;
            var anchorSpanOffset = parseInt($(anchorNode).attr("data-paragraph-offset"));
            var focusSpanOffset = parseInt($(focusNode).attr("data-paragraph-offset"));
            if(anchorSpanOffset < focusSpanOffset){//正着选的
                firstCharacterOffset=anchorSpanOffset + anchorOffse;
                lastCharacterOffset=focusSpanOffset + focusOffset;
            }else if(anchorSpanOffset == focusSpanOffset){//选了同一个span
                if(anchorOffse < focusOffset){ //正着选的
                    firstCharacterOffset=anchorSpanOffset + anchorOffse;
                    lastCharacterOffset=focusSpanOffset + focusOffset;
                }else if(anchorOffse == focusOffset){ //没选

                }else if(anchorOffse > focusOffset){ //倒着选的
                    firstCharacterOffset = focusSpanOffset + focusOffset;
                    lastCharacterOffset = anchorSpanOffset + anchorOffse;
                }
            }else if (anchorSpanOffset > focusSpanOffset){//倒着选的
                firstCharacterOffset = focusSpanOffset + focusOffset;
                lastCharacterOffset = anchorSpanOffset + anchorOffse;
            }
            //
			var list = getUnderLineBlock(firstCharacterOffset,lastCharacterOffset);
            drawUnderLineBlock(list);
            //
            //$(anchorNode).offset().top;
            //$(anchorNode).offset().left;
            //$(anchorNode).position().top;
            //$(anchorNode).position().left;
        }
    };
	var PAGE_WIDTH = 648;
    var FOND_SIZE = 18;
    var CHAR_COUNT = PAGE_WIDTH/FOND_SIZE; //一行多少个字符
    var INDENT = 2;//缩进
    var LINE_HEIGHT = 2;//line-height
	//盖在文字上的span
    function Block(){
		this.batch = "";
		this.row = 0;//第几行，以字符为单位
		this.columnStart = 0;//从第几个字符开始
		this.columnEnd = 0;//结束位置
        this.top = 0;//像素
        this.left = 0;
        this.width = 0;
        this.height = 0;
        this.color = "#FFFFFF";
        this.count = 0;//字符数
    };
    /**
     * 得到要绘制的span
     * @param firstCharacterOffset
     * @param lastCharacterOffset
     */
    function getUnderLineBlock(firstCharacterOffset,lastCharacterOffset){
		var batch = firstCharacterOffset + "_" + lastCharacterOffset;
        var list = new Array();
		var firstRow = parseInt( (firstCharacterOffset+INDENT) / CHAR_COUNT );//第几行
		var lastRow = parseInt( (lastCharacterOffset+INDENT) / CHAR_COUNT );
		for(var i = firstCharacterOffset+INDENT; i < lastCharacterOffset+INDENT; ){
				var node = new Block();
				node.batch = batch;//@
				var row = parseInt(i / CHAR_COUNT);//第几行
				node.row = row * LINE_HEIGHT;//@
				var columnStart = i % CHAR_COUNT;//第几列
				node.columnStart = columnStart;//@
				if(i + CHAR_COUNT-columnStart <= lastCharacterOffset+INDENT){//预读到本行最后一个未结束或刚好结束
					node.count = CHAR_COUNT-columnStart;//@
					i = i + CHAR_COUNT-columnStart;
					node.columnEnd =  CHAR_COUNT;//@ 直接置为最后一个
				}else {//不到本行最后一个已经结束
					node.count = lastCharacterOffset+INDENT-i;//@
					i = lastCharacterOffset+INDENT;//直接指向结束
					node.columnEnd = i % CHAR_COUNT;//@
				}
				//
				node.top = node.row * FOND_SIZE;//@
				node.left = node.columnStart * FOND_SIZE;//@
				//this.righ = this.columnEnd * FOND_SIZE;
				node.width = (node.columnEnd - node.columnStart) * FOND_SIZE;//@
				node.height = FOND_SIZE;//@
				//
				list.push(node);
		}
        return list;
    };
    //
    function drawUnderLineBlock(list){
        for(var i in list){
            var node=list[i];
            var span=document.createElement("span");
            span.clss="note-mark";
            span.batch = node.batch;
            span.style.top = node.top + "px";
            span.style.left = node.left + "px";
            span.style.width = node.width + "px";
            span.style.height = node.height + "px";
            span.style.color = "red";
            span.style.display="inline";
            span.innerHTML="ddd";
            $("#stream-underline-block").append(span)
        }
    }
    $(window).resize(function () {          //当浏览器大小变化时;
        $("#reader-page-wrap").height($(document).height());
    });
});
