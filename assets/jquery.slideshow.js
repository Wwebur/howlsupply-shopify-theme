(function($) {
	/****** 参数说明 *******
	events[string]  -- 触发事件，默认clik
	type[string]    -- 轮播类型（x：水平轮播，y：垂直轮播，fade：渐隐）
	start[number]   -- 开始位置
	speed[number]   -- 轮播切换速度
	time[number]    -- 轮播间隔时间
	auto[boolean]   -- 是否自动播放（true：是，false：否）
	btn[boolean]    -- 是否显示按钮
	plus[boolean]   -- 是否显示下一页按钮
	minus[boolean]  -- 是否显示上一页按钮
	************************/
	$.fn.slideShow = function(settings) {
		if(!this.length) {
			return;
		}
		settings = $.extend({events: "click",type: "x",start: 0,speed: 800,time: 2000,auto: true,btn: true,plus: false,minus: false},settings);
		var obj = this;
		var slide = {};
		var _html;
		slide.box = obj.find(".box");
		slide.list = slide.box.find(".list");
		slide.arr = slide.list.find("li");
		slide.sum = slide.arr.length;
		slide.btn = obj.find(".btn");
		slide.btn_arr = slide.btn.find("li");
		slide.plus = obj.find(".plus");
		slide.minus = obj.find(".minus");
		slide.w = slide.box.width();
		slide.h = slide.box.height();
		slide.s = 0;

		if(slide.sum <=1 ) {
			return;
		}

		slide.on = function() {
			if(!settings.auto) {
				return;
			}
			slide.off();
			slide.run = setTimeout(function() {slide.goto()},settings.time);
		}
			
		slide.off = function(){
			if(typeof(slide.run)!=="undefined"){
				clearTimeout(slide.run);
			}
		}
			
		slide.clear = function() {
			if(slide.btn.length) {
				slide.btn.remove();
			}
			if(slide.plus.length) {
				slide.plus.remove();
			}
			if(slide.minus.length) {
				slide.minus.remove();
			}
			slide.off();
		}

		slide.checkBtn = function(n) {
			if( slide.btn.length ) {
				slide.btn_arr.removeClass("selected");
				slide.btn_arr.eq(n).addClass("selected");
			}
		}
			
		slide.goto = function(n) {

			slide.off();
			if(n === undefined) {
				var n = slide.s+1;
			} else if( n == slide.s) {
				slide.checkBtn(n);
				slide.on();
				return;
			}

			if( n > slide.sum ) { n = 0; }
			if( n < 0 ) { n = slide.sum-1; }
			slide.checkBtn(n);
			switch(settings.type){
				case "x":
					slide.box.stop(true,false).animate({"scrollLeft":(slide.w*n)},settings.speed);
					
					if(n >= slide.sum){
						slide.arr.eq(0).css({"left":slide.w*n});
						slide.checkBtn(0);
						n=0;
						slide.box.queue(function(){
							slide.box.scrollLeft(0);
							$(this).dequeue();
						});
					}
					
					slide.box.queue(function(){
						slide.arr.eq(0).css({"left":""});
						$(this).dequeue();
					});
					break;

				case "y":
					slide.box.stop(true,false).animate({"scrollTop":(slide.h*n)},settings.speed);
					if(n == slide.sum){
						slide.arr.eq(0).css({"top":slide.h*n});
						slide.checkBtn(0);
						n=0;
						slide.box.queue(function(){
							slide.box.scrollTop(0);$(this).dequeue();
						});
					}
					slide.box.queue(function(){
						slide.arr.eq(0).css({"top":""});
						$(this).dequeue();
					});
					break;

				case "fade":
					if(n == slide.sum){
						slide.checkBtn(0);
						n=0;
					}
					slide.arr.css({"display":"none","position":"relative","zIndex":""});
					slide.arr.eq(slide.s).css({"display":"","position":"absolute","zIndex":1});
					slide.arr.eq(n).css({"display":"none","position":"absolute","top":0,"left":0,"zIndex":2}).fadeIn(settings.speed);
					break;

				case "toggle":
					if(n==slide.sum) {
						slide.checkBtn(0);
						n=0;
					}
					slide.arr.hide();
					slide.arr.eq(n).show();
					break;
			};
			
			slide.s = n;
			slide.box.queue(function() {
				slide.on();
				$(this).dequeue();
			});
		}
		
		if(settings.btn && !slide.btn.length) {

			_html="";
			for(var i=1;i<=slide.sum;i++) {
				_html+="<li class='b_"+i+"'>"+i+"</li>";
			}
			slide.btn=$("<ul></ul>",{"class":"btn","html":_html}).appendTo(obj);
			slide.btn_arr=slide.btn.find("li");

			slide.btn_arr.bind(settings.events,function(){
				slide.goto(slide.btn_arr.index($(this)));});
			
		}
		
		if(settings.plus&&!slide.plus.length) {
			slide.plus=$("<div></div>",{"class":"plus"}).html('Next').appendTo(obj);
			slide.plus.bind(settings.events,function(){slide.goto()});
		}
		
		if(settings.minus&&!slide.minus.length) {
			slide.minus=$("<div></div>",{"class":"minus"}).html('Prev').appendTo(obj);
			slide.minus.bind(settings.events,function(){
				slide.goto(slide.s-1)});
		}
		
		slide.box.hover(function(){
			slide.off();
		},function(){
			slide.on();
		});

		slide.goto(settings.start);
	}
})(jQuery);
