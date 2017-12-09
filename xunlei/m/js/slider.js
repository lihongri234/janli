/*author:chenlijian*/
(function(){
	function trim(str){ //删除左右两端的空格
　　    return str.replace(/(^\s*)|(\s*$)/g, "");
　　}
	mySlider=function(id,config){
		//每个子页的class
		config.child=config.child||"slider";
		//当前页的class
		config.endClass=config.endClass||"slider_end";
		//换页时间
		config.interval=config.interval||300;
		//换页停顿时间,一个数组或一个数字
		config.stopTime=config.stopTime||200;
		//1表示纵向，0表示横向，默认纵向
		config.direction=config.direction==null?1:config.direction;
		//分别表示前一页、当前页、下一页的状态
		config.mode=config.mode||{transform:["scale(0)","translate(0,0) scale(1)","translate(0,100%) scale(1)"]};
		//换页时是否前一页动画结束再到后一页动画开始，默认否
		config.turn=config.turn==null?0:config.turn;
		//开始换页时触发的函数，提供两个参数idx和pages
		config.startCallback=config.startCallback||"";
		//刚换完页之后触发的函数，提供两个参数idx和pages
		config.callback_1=config.callback_1||"";
		//换完页之后可以换下一页时触发的函数，提供两个参数idx和pages
		config.callback_2=config.callback_2||"";
		var TYPE_PREV=0,
			TYPE_CUR=1,
			TYPE_NEXT=2;
		var target 	=document.getElementById(id),
		  	pages   =target.getElementsByClassName(config.child);
		var isInit=true;
		var init={
			//总页数
			len: 		pages.length,
			//当前页idx
			curPage: 	0,
			//当前是否可以换页
			isCanChange:true,
			//窗口大小是否改变
			isResize: 	false,
			//计时器
			timer: 		null,
			//拖动有效距离
			distance: 	10
		};
		var setStyle=function(style,type){
    		for(var k in config.mode){
    			if(k.toLowerCase().indexOf("transform")!=-1){
    				style.webkitTransform =
		    		style.msTransform =
		    		style.MozTransform =
		    		style.OTransform = config.mode.transform[type];
    			}else if(k.toLowerCase().indexOf("animation")!=-1){
    				if(!isInit)
	    				style.webkitAnimation =
			    		style.animation = config.mode.animation[type];
    			}else
    				style[k]=config.mode[k][type];
    		}
		}
		//初始化
		var sInit=function(){
			for(var i=0;i<init.len;i++){
				var style=pages[i].style;
				if(i!=0)
					setStyle(style,2);
				else
					setStyle(style,1);
			}
			isInit=false;
		};
		sInit();
		//定义状态的函数
		var transition=function(dom,type,time) {
		    var style = dom && dom.style;
		    if (!style) return;
		    style.webkitTransitionDuration =
    		style.MozTransitionDuration =
    		style.msTransitionDuration =
    		style.OTransitionDuration =
    		style.transitionDuration = time + 'ms';
    		setStyle(style,type);
		};
		var addTransitionEnd=function(element,fun){
			element.addEventListener('webkitTransitionEnd', fun, false);
      		element.addEventListener('msTransitionEnd', fun, false);
     		element.addEventListener('oTransitionEnd', fun, false);
      		element.addEventListener('otransitionend', fun, false);
      		element.addEventListener('transitionend', fun, false);
		};
		var removeTransitionEnd=function(element,fun){
			element.removeEventListener('webkitTransitionEnd', fun, false);
        	element.removeEventListener('msTransitionEnd', fun, false);
        	element.removeEventListener('oTransitionEnd', fun, false);
        	element.removeEventListener('otransitionend', fun, false);
        	element.removeEventListener('transitionend', fun, false);
		};
		//定义换页完成后执行的函数
		var changeDone=function(idx){
			var t=0;
			if(pages[init.curPage]&&pages[idx]){
				pages[init.curPage].className=trim(pages[init.curPage].className.replace(config.endClass,""));
				pages[idx].className=pages[idx].className+" "+config.endClass;
				if(typeof(config.stopTime)=="object")
					t=config.stopTime[idx]||200;
				else
					t=config.stopTime;
			}
			if(typeof(config.callback_1)=="function")
				config.callback_1(idx,pages);	
			setTimeout(function(){
				init.curPage=idx,init.isCanChange=true;
				if(typeof(config.callback_2)=="function")
					config.callback_2(idx,pages);
			},t);
		};
		//换页函数
		var changePage=function(idx){
			if(!init.isCanChange) return;
			init.isCanChange=false;
			if(typeof(config.startCallback)=="function")
				config.startCallback(idx,pages);
			var t;
			if(idx<init.curPage)
				t=TYPE_NEXT;
			else
				t=TYPE_PREV;
			if(config.turn){
				transition(pages[init.curPage],t,config.interval/2);
				setTimeout(function(){
					transition(pages[idx],TYPE_CUR,config.interval/2);
		    		addTransitionEnd(pages[idx],function(event){
						changeDone(idx);
						removeTransitionEnd(pages[idx],arguments.callee);
					});
				},config.interval/2);
			}else{
				transition(pages[idx],TYPE_CUR,config.interval),
				transition(pages[init.curPage],t,config.interval);
				addTransitionEnd(pages[idx],function(event){
					changeDone(idx);
					removeTransitionEnd(pages[idx],arguments.callee);
				});
			}
			
		};
		//事件函数
		var touchControler={
			mouseP:null,
			moveP:null,
			isMove:false,
			touchStart:function(event){
				event.preventDefault();
				if(init.isCanChange){
					touchControler.mouseP=config.direction?event.touches[0].pageY:event.touches[0].pageX;
					document.addEventListener("touchmove",touchControler.touchMove, false);
					document.addEventListener("touchend",touchControler.touchEnd, false);
				}
			},
			touchMove:function(event){
				if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
				if(init.isCanChange){
					touchControler.moveP=config.direction?event.touches[0].pageY:event.touches[0].pageX;
					if(Math.abs(touchControler.moveP-touchControler.mouseP)>init.distance||touchControler.isMove){
						touchControler.isMove=true;
					}				
				}
			},
			touchEnd:function(event){
				if(init.isCanChange){
					var dd=touchControler.moveP-touchControler.mouseP
					if(touchControler.isMove){
						touchControler.isMove=false;
						if(touchControler.moveP!=touchControler.mouseP){
							var d=touchControler.moveP<touchControler.mouseP?1:-1;
							var idx=d==1?init.curPage+1:init.curPage-1;
							if(idx>=0&&idx<init.len)
								changePage(idx);
						}
					}
					document.removeEventListener('touchmove',touchControler.touchMove, false);
	      			document.removeEventListener('touchend',touchControler.touchEnd, false);
				}		
			}
		};
		document.addEventListener("touchstart",touchControler.touchStart, false);
		var stop=function(){
			init.isCanChange=false;
		};
		var reStart=function(){
			init.isCanChange=true;
		};
		var links=document.getElementsByTagName("a");
		for(var i=0;i<links.length;i++){
			links[i].addEventListener("touchstart",function(event){
				event.stopPropagation();
			}, false);
		}
		return {
			stop: 			stop,
			reStart: 		reStart
		};
	};	
})();
