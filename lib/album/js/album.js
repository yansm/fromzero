/* 相框 */
(function ($,window,undefined) {
	$.fn.buildPhotos = function (settings) {
		/* 初始化数据 */
		var creatPhotos = function (elem) {
			var imgMap = settings.imgMap
				,photoWidth = settings.photoWidth
				,photoHeight = settings.photoHeight
				,displayNum = settings.displayNum
				,animateStyle = settings.animateStyle
				,photoCount = imgMap.length
				,automatic = settings.automatic
				,hasDescription = settings.hasDescription
				,hasArrow = settings.hasArrow
				,animateSpeed = settings.animateSpeed
				,clickExEvent = settings.clickExEvent ||$.noop
				,paddingRight = settings.paddingRight
				,paddingBottom = settings.paddingBottom;
			var html = [];
			html.push('<div class="photo_box rel"><div class="photo_area"><div class="photo_item"><ul class="rel fix">');
			$.each(imgMap,function (i,node) {
				html.push( '<li class="rel" data-index="'+ i +'" ><div class="img_box rel"><img src="'+ node.imgUrl +'"></div>');
				if(hasDescription && node.description ){
					html.push( '<div class="description abs ">'+ node.description +'</div>');
				}
				html.push( '</li>');
			} );
			html.push( '</ul></div></div>');
			if(hasArrow) html.push('<a class="prev"><span></span></a><a class="next"><span></span></a>');
			html.push( '<div class="photo_toolbar">');
			for ( var i = 0;i < photoCount;i++){
				html.push( '<a data-index="'+ i +'"  class="'+ (i==0?'current':'') +'"></a>');
			}
			html.push( '</div>');
			html.push( '</div>');
			
			elem.html(html.join(" "));
			
			/* 样式调整 */
			if(!settings.hasToolbar) elem.find('.photo_toolbar').hide();
			elem.find('.photo_box').css({'width':photoWidth + 'px','height':(photoHeight)  + 'px'});
			elem.find('li').css({'width':(photoWidth)/displayNum + 'px','height':(photoHeight) + 'px','padding-right':paddingRight,'padding-bottom':paddingBottom});
			elem.find('.img_box').css({'width':'100%','height':'100%'});
			elem.find('img').css({'height':'100%'});
			elem.find('.photo_item').css('width','999999px');
			
			/* fade方式展现 */
			var animateFade = function () {
				var lis = elem.find('li');
				lis.css({
					'position' : 'absolute',
					'left' : '0px',
					'right' : '0px',
					'display' : 'none'
				});
				lis.eq(0).fadeIn();
				
			}
			/* move方式展现 */
			var animateMove = function () {
				var ul = elem.find('ul'),li = ul.find('li[data-index="0"]').clone();
				li.attr('data-index',photoCount)
				ul.css({
					'position' : 'absolute',
					'left' : '0',
					'top' : '0'
				}).append(li);
				ul.find('li').css({
					'float' : 'left'
				});
			}
			var animateMap = {
				'fade' : animateFade,
				'move' : animateMove
			};
			
			/* fade 点击事件 */
			var clickFade = function (index) {
				elem.find('li').fadeOut(animateSpeed);
				elem.find('li[data-index="'+ index +'"]').fadeIn(animateSpeed);
			};
			/* move 点击事件 */
			var clickMove = function (index,flag) {
				var $ul = elem.find('ul'),photoWidth = $ul.find('li[data-index="0"]').width(),
					leftNum = index * photoWidth/displayNum;
				if(flag == 0 - photoCount + 1){
					leftNum = photoCount * photoWidth/displayNum;
					$ul.animate({
						'left' : '-' + leftNum + 'px'
					},animateSpeed).animate({
						'left' : '0px'
					},0);
					return;
				}
				if(flag == photoCount -1){
					$ul.animate({
						'left' : '-'  + photoCount * photoWidth/displayNum + 'px'
					},0).animate({
						'left' : '-' + leftNum + 'px'
					},animateSpeed);
					return;
				}
				
				$ul.animate({
					'left' : '-' + leftNum + 'px'
				},animateSpeed);
			};
			var clickMap = {
				'fade' : clickFade,
				'move' : clickMove
			};
			
			var changeClick = function (flag) {
				var index = elem.find('.photo_toolbar .current').attr('data-index');
				if(flag>0)
					var index = Number(index) + Number(flag) >= photoCount?0:Number(index) + Number(flag);
				if(flag<0)
					var index = Number(index) + Number(flag) < 0?photoCount-1:Number(index) + Number(flag);
				elem.find('.photo_toolbar a[data-index="'+ index +'"]').click();
				clickExEvent(index);
			}
			/* 工具栏动态 */
			var toolbarBaseFn = function () {
				elem.find('.photo_toolbar a').each(function () {
					var $this = $(this);
					$this.click(function () {
						if($this.hasClass('current'))return;
						var index = $this.attr('data-index'), lastIndex = elem.find('.photo_toolbar .current').attr('data-index');
						elem.find('.photo_toolbar a').removeClass('current');
						$this.addClass('current'); 
						clickMap[animateStyle](index,index - lastIndex);
					})
				});
			}
			/* 选择展现方式 */
			var animateFn = animateMap[animateStyle];
			animateFn();
			/* 工具栏动态 */
			toolbarBaseFn();
			/* 左右剪头动态 */
			elem.find('.next').click(function () {
				changeClick(1);			
			});
			elem.find('.prev').click(function () {
				changeClick(-1);
			});
			/* 是否自动播放 */
			var intervalFn = function () {
				changeClick(1)
			}	
;			if(automatic > 0){
				setInterval(intervalFn, automatic)
			}
		}
		
		settings = $.extend({}, $.fn.buildPhotos.defaults, settings);
	
		return this.each(function () {
			var $this = $(this);
			creatPhotos($this);
		});
	};
	/* 默认数据 */
	$.fn.buildPhotos.defaults = {
		photoWidth : 516,
		photoHeight : 346,
		hasToolbar : true,
		hasArrow : true,
		hasDescription : false,
		hasTitle : false,
		hasFlag : false,
		animateStyle : 'fade',
		displayNum : 1,
		automatic :  5000,
		paddingBottom : 0,
		paddingRight : 0,
		animateSpeed : 500
	}; 
	/* 外部接口 */
	$.fn.toPage = function (opts){
		var elem = this
			,num = opts.num;
		elem.find('.photo_toolbar a[data-index="'+ num +'"]').click();
	}
}) (jQuery,this);
