/* 阻止冒泡 */
window.stopBubble = function (e) {
	//如果提供了事件对象，则这是一个非IE浏览器
	if(e && e.stopPropagation) {
		//因此它支持W3C的stopPropagation()方法
		e.stopPropagation();
	} else {
		//否则，我们需要使用IE的方式来取消事件冒泡 
		window.event.cancelBubble = true;
	}
	return false; 
};
/* 获取url传值 */
(function($){
	$.getUrlParam = function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r!=null) return unescape(r[2]); return null;
	}
})(jQuery);
/* 点击延时 */
(function($){ 
	$.fn.downDelay = function(options){ 
		var defaults = { 
			downDuring: 300, 
			downEvent: function(){ 
				$.noop(); 
			}
		}; 
		var sets = $.extend(defaults,options || {}); 
		var downTimer; 
		return $(this).each(function(){ 
			$(this).mousedown(function(){ 
				downTimer = setTimeout(sets.downEvent, sets.downDuring); 
			}).mouseup(function(){ 
				clearTimeout(downTimer); 
			})
		}); 
	} 
})(jQuery); 

/* 主页事件控制 */
$(function () {
	/* tooltip 构建 */
	$('.needtooltip').tooltip();
	var animateTime = 300;
	/* 获取菜单参数 */
	var menuIndex = $.getUrlParam('menuIndex');
	var $body = $('body'),bodyWidth = $body.width(),bodyHeight = $body.height(),$menus = $('.indexMenu li'), $modules = $('.module_info li'),
			$rightArea = $('.area_right');
	/* 主页菜单点击后跳转效果 */
	var menuClickType = {
		'normal' : function () {
			var time = amend_top_bottom();
			setTimeout (function () {
				$body.removeClass().addClass('type_normal');
				$menus.css({
					'left':'0px'
					,'top' : '0px'
					,'height' : bodyHeight/7 + 'px'
				}); 
			}, time);
		}
		,'left' : function () {
			var time = amend_top_bottom();
			if($body.hasClass('type_left')){
				time = animateTime + 350;
				$body.removeClass();
				$menus.css({
					'left':'0px'
					,'top' : '0px'
					,'height' : bodyHeight/7 + 'px'
				});
			}
			setTimeout (function () {
				$body.removeClass().addClass('type_left');
				$menus.css({
					'left':'-'+ (bodyWidth - 90) +'px'
					,'top' : '0px'
					,'height' : bodyHeight/7 + 'px'
				});
			}, time);
		}
		,'right' : function () {
			var time = amend_top_bottom();
			if($body.hasClass('type_right')){
				time = animateTime;
				$body.removeClass();
			}
			setTimeout (function () {
				$body.removeClass().addClass('type_right' );
				$menus.css({
					'left':'0px'
					,'top' : '0px'
					,'height' : bodyHeight/7 + 'px'
				}); 
			}, time);
		}
		,'top' : function () {
			if($body.hasClass('type_bottom')){
				$body.addClass('type_top' ).addClass('type_top_end').removeClass('type_bottom').removeClass('type_bottom_end');
				$menus.css({
					'left':'0px' 
					,'top' : '43px'
				}); 
			}else {
				$body.removeClass().addClass('type_top_end' );
				$menus.css({
					'left':'0px'
					,'top' : '0px'
				}); 
				setTimeout(function () {
					$body.addClass('type_top' );
					$menus.css({
						'left':'0px' 
						,'top' : '43px'
					}); 
				} , animateTime);
			}
		}
		,'bottom' : function () {
			if($body.hasClass('type_top')) {
				$body.addClass('type_bottom' ).addClass('type_bottom_end').removeClass('type_top').removeClass('type_top_end');
				$menus.css({
					'left':'0px' 
					,'top' :  '-43px'
				}); 
			}else{
				$body.removeClass().addClass('type_bottom_end' );
				$menus.css({
					'left':'0px'
					,'top' :  '0px'
				}); 
				setTimeout(function () {
					$body.addClass('type_bottom' );
					$menus.css({
						'left':'0px' 
						,'top' : '-43px'
					}); 
				} , animateTime);
			}
		}
	}
	/* type_top type_bottom 修正 */
	function amend_top_bottom () {
		if($body.hasClass('type_top')){
			$menus.css({
				'left':'0px'
				,'top' : '0px'
			});
			return animateTime;
		}else if($body.hasClass('type_bottom')) {
			$menus.css({
				'left':'0px'
				,'top' : '0px'
			}); 
			return animateTime;
		}
		return 0;
	}
	/* 主页菜单与左侧main区域联动 */
	$menus.hover(function () {
		var $this = $(this),index = $this.index();
		$modules.removeClass('current');
		$modules.eq(index).addClass('current');
	} )
	/* 主页菜单点击动作 */
	.click(function () {
		var $this = $(this), type = $this.data('type'), target = $this.data('target')
			, $area = $('.area_'+ type),flag = $area.data('flag') ? $area.data('flag') : '';
		if(target && $area.find('.box_'+ target).length == 0) {
			$area.append('<div class="scroll-pane box box_'+ target +'"></div>');
			$area.find('.box_'+ target).load(target+ ".html",function () {
				$area.find('.box_'+ target).jScrollPane();
				$.initModule({target : target});
			});
			
		}
		if(target){
			
			//if((($body.hasClass('type_right') && type=='right' ) || ($body.hasClass('type_left') && type=='left' )) && flag != target)
			if(($body.hasClass('type_' + type)) && flag != target && type == 'right')
				setTimeout(function () {$area.data('flag',target).find('> * ').removeClass('active');$area.find('.box_'+ target).addClass('active');},animateTime);
			else {
				$area.data('flag',target).find('> * ').removeClass('active');
				$area.find('.box_'+ target).addClass('active');
			}
		}
		if($body.hasClass('type_'+ type) && flag == target) return;
		menuClickType[type]();
	});
	
	
	/* 浏览器变动时处理 */
	function resetWindow() {
		bodyWidth = $body.width();
		bodyHeight = $body.height();
	}
	resetWindow();
	window.onresize=function(){  
		resetWindow();  
	}  
	/* 常量传递 */
	$.extend({
		getValues : function () {
			return {
				bodyWidth : bodyWidth
				,bodyHeight : bodyHeight
				,animateTime : animateTime
			}
		}
	}); 
	if(menuIndex)
		$menus.eq(menuIndex).click();
	else
		$menus.eq(0).click();
})

/*  区域js加载 */
$(function () {
	var moduleMap = {
		'myInformation' : myInformation
		,'myPhotos' : myPhotos
		,'myArticle' : myArticle
		,'myRecode' : myRecode
		,'myWork' : myWork
		,'myGame' : myGame
	}

	$.extend({
		initModule : function (settings) {
			var target = settings.target;
			moduleMap[target]();
		}
	}); 
	
	/* 我的信息 js 加载 */
	function myInformation() {
		
		$('.needtooltip').tooltip();
		var datas = data_myInformation,$myInformation = $('.box_myInformation'),$panels = $myInformation.find('.panel'),$checkBoxs = $myInformation.find('.append_menu input');
		
		/* 绑定我的信息 */
		var $inputs = $myInformation.find('.info_area'),length = $inputs.length;
		$inputs.each(function (i,e) {
			var $this = $(this),value = $this.data('infovalue');
			$this.html(datas[value]);
			if( i == length -1) {
				$myInformation.jScrollPane()
				toHeight();
			};
		});
		
		
		/* 添加部分点击事件 （小彩蛋）*/
		$checkBoxs.change(function () {
			var $this = $(this), target = $this.data('target'), check = $this.is(':checked'),$item = $('#'+ target),distype = $item.data('distype');
			if(check)
				$item.removeClass('distype_'+ distype + '_animate');
			else
				$item.addClass('distype_'+ distype).addClass('distype_'+ distype + '_animate');
			
		});
		$panels.each(function () {
			var $this = $(this), $close = $this.find('.close'), id = $this.attr('id');
			$close.click(function () {
				$myInformation.find('.append_menu input[data-target="'+ id +'"]').click();
			})
		});
		
		/* 给各个区域赋高 （用于动画效果用） */
		function toHeight () {
			$panels.each(function () {
				var $this = $(this),height = $this.height();
				$this.css('height', height + 'px');
			});
		}
	}
	
	/* 我的相册 js 加载 */
	function myPhotos() {
		$('.needtooltip').tooltip();
		var bodyWidth = $.getValues().bodyWidth,bodyHeight = $.getValues().bodyHeight,animateTime = $.getValues().animateTime;
		var $myPhotos = $('.box_myPhotos'),datas = data_myPhotos,$albumBox = $('.album_box'),$photosArea = $('.photos_area'),$albumToolbar = $('.album_toolbar');
		$('#myPhoto_adjust').click(function () {
			$myPhotos.toggleClass('neight_style');
		});
		/* 查看方式初始化 */
		var photoType = { 
			'wall' : '<img src="./images/wall.png"/><aside>照片墙</aside>'  
			,'mac_wall' : '<img src="./images/wall.png"/><aside>照片墙</aside>'  
			,'mark' : '<img src="./images/mark.png"/><aside>书签夹</aside>'  
		}
		buildPhotosList(datas);
	
		/* 相册查看方式 */
		var buildPhotosFn = {
			'normal' : buildPhotosNormal
			,'wall' : buildPhotosWall
			,'mark' : buildPhotosMark
		}
		/* normal查看方式构建 */
		function buildPhotosNormal (index) {
			var $album = $('.album_normal'),$photosList = $album.find('.photos_list'),data = datas[index],rows = data['photos'],length = rows.length,url = data['url'],html = [],albumList = []
				,$albumList = $('.album_list'),$leftArea = $album.find('.left_area'),albumWidth = $albumList.width(),albumHeight = $albumList.height();
				
			$photosList.html('').removeAttr('style');
			for(var i = 0; i < length; i ++) {
				var item = rows[i],text = item['text'],title = item['title'],description = item['description'];
				html.push('<li class="rel"><img src="'+ url + text +'" ><aside class="abs tc">'+ title +'</aside></li>');
				albumList.push({imgUrl : url + text,description : description});
			}
			$photosList.html(html.join(''));
			$leftArea.jScrollPane();
			var scrollApi = $leftArea.data('jsp');
			$albumList.buildPhotos({
				imgMap : albumList,
				automatic : 0,
				animateStyle : 'move',
				hasToolbar : false,
				hasDescription : true,
				photoWidth : $albumList.width(),
				photoHeight : $albumList.height(),
				clickExEvent : function (index) {
					photoActived(index);
				}
			});
			$photosList.find('> li').click(function () {
				var $this = $(this),index = $this.index();
				photoActived(index)
				$albumList.toPage({num : index});
			});
			function photoActived(index) {
				var item = $photosList.find('> li');
				item.removeClass('actived');
				item.eq(index).addClass('actived')
				scrollApi.scrollToElement(item.eq(index),true,true);
			}
			$albumList.find('img').draggable({ stop : function (event,ui) {
				var $this = ui.helper,top = ui.offset.top,left = ui.offset.left,width = $this.width(),height = $this.height();
				if(top > 0){
					$this.animate({'top':'0px'},{queue:false,duration :300});
				}else if (top < albumHeight - height){
					$this.animate({'top': (albumHeight - height) + 'px'},{queue:false,duration :300});
				}
			} });
			$photosList.find('>li').get(0).click();
		}
		/* wall查看方式 */
		function buildPhotosWall (index) {
			var $albumWall = $('.album_wall_area'),lis = $albumWall.find('li> div'),data = datas[index],rows = data['photos'],length = rows.length,url = data['url'],wallWidth = $albumWall.width(),wallHeight = $albumWall.height()/3
				,widthfFlag = [true,true,true];
			lis.empty();
			var randArray = getRondArray(length);
			while(widthfFlag[0] || widthfFlag[1] || widthfFlag[2]) {
				var widths = [],flag = 0;
				widths.push(lis.eq(0).width());
				widths.push(lis.eq(1).width());
				widths.push(lis.eq(2).width());
				for(var i = 0,l = widths.length; i < l; i ++ ){
					if(widths[i] < widths[flag]) flag = i;
				}
				if(randArray.length == 0) randArray = getRondArray(length);
				var item = lis.eq(flag), indexFlag = randArray[ randArray.length - 1 ],imgItem = rows[indexFlag],img_text = imgItem['text'],img_width = imgItem['width'],img_height = imgItem['height'],title = imgItem['title'];
				randArray.pop();
				item.append('<div class="img_box rel" style="width: '+ img_width/img_height*wallHeight +'px"><img src="'+ url + img_text +'" /><aside class="abs tc">'+title+'</aside></div>');
				
				widthfFlag[flag] = item.width() < wallWidth;
			}
			
			function getRondArray (count) {
				var array = [];
				for(var i = 0; i < count; i ++){
					array.push(i);
				}
				for(var i = 0; i < count; i ++){
					var randNum =  parseInt(Math.random()*(count - i)); 
					array.push(array[randNum]);
					array.splice(randNum, 1);
				}
				return array;
			} 
		}
		/* mark 查看方式 */
		function buildPhotosMark (index) {
			var $albumWall = $('.album_mark');
			$albumWall.html('<div id="wrapper"><div id="carousel"></div></div><div id="donate-spacer"></div>');
			var $carousel = $('#carousel'),data = datas[index],rows = data['photos'],length = rows.length,url = data['url'],wallWidth = $albumWall.width(),wallHeight = $albumWall.height(),html = [];
			for(var i = 0; i < length; i ++) {
				var item = rows[i],text = item['text'],title = item['title'],description = item['description'];
				html.push('<div><img src="'+ url + text +'" alt="'+ title +'" width="'+ (wallWidth-400) +'" height="'+ wallHeight +'" /></div>');
			}
			
			$carousel.removeAttr('style').html(html.join('')).find('>div').css('margin-right',500-wallWidth + 'px');;
			$carousel.carouFredSel({
				width: wallWidth,
				height: wallHeight,
				align: false,
				padding: [0, 950, 0, 0],
				items: {
					width: 100,
					height: wallHeight,
					visible: 5,
					minimum: 1
				},
				scroll: {
					items: 1,
					duration: 750, 
					onBefore: function( data ) {
						data.items.old.add( data.items.visible ).find( 'span' ).stop().slideUp();
					},
					onAfter: function( data ) {
						data.items.visible.last().find( 'span' ).stop().slideDown();
					}
				},
				auto: false,
				onCreate: function() {
					$(this).children().each(function() {
						$(this).append( '<span>' + $('img', this).attr( 'alt' ) + '</span>' );
						$(this).find( 'span' ).hide();
					});
				}
			});
			$carousel.children().click(function() {
				$carousel.trigger( 'slideTo', [this, -4, 'prev'] );
			});
		}
		/* 相册关闭动态 */
		$albumBox.find('div.toolbar .close').click(function () {
			var item = $photosArea.find('div.current');
			$albumBox.removeAttr("style");
			setTimeout(function () {
				item.removeClass('current').removeAttr("style");
				$myPhotos.removeClass('box_myPhotos_actived');
			} , animateTime);
		})
		/* normal放大缩小操作 */
		$albumToolbar.find('.glyphicon-zoom-in').click(function () {
			var $albumList = $('.album_list'),index = $albumList.data('index'),$item = $albumList.find('div.photo_item li[data-index="'+ index +'"] img');
			$item.height($item.height() * 1.1);
		});
		$albumToolbar.find('.glyphicon-zoom-out').click(function () {
			var $albumList = $('.album_list'),index = $albumList.data('index'),$item = $albumList.find('div.photo_item li[data-index="'+ index +'"]'),$img = $item.find('img'),height = $img.height()/1.1;
			if(height < $item.height()) 
				$img.height('100%');
			else
				$img.height(height);
		});
		
		/* 构建相册集 */
		function buildPhotosList (_photos) {
			var photos = _photos, length = photos.length,html = [],$photosArea = $('.photos_area');
		
			for(var i = 0; i < length; i ++ ) {
				var item = photos[i], title = item.title,url = item.url,id = item.id,type = item.type;
				html.push('<div class="photo_area" data-index="'+ i +'"><div class="photo_box3" data-type="'+ type[1] +'"><div class="photo_content tc">'+ photoType[type[1]] +'</div></div>');
				html.push('<div class="photo_box2" data-type="'+ type[0] +'"><div class="photo_content tc">'+ photoType[type[0]] +'</div></div><div class="photo_box" data-type="normal"><div class="photo_content tc">');
				html.push('<img src="'+ url +'index.jpg" />');
				html.push('<aside>'+ title +'</aside>');
				html.push('</div></div></div>');
			}
			$photosArea.append(html.join(''));
			$photosArea.find('.photo_area > div').click(function () {
				getPhotoFream($(this));
			});
		}
		/* 打开相册动态 */
		function getPhotoFream (_this) {
			var $this = _this,offset = $this.parent().offset(),left = offset.left,top = offset.top,type = $this.data('type'),id = $this.parent().data('index');
			if($this.hasClass('current')) return;
			$this.addClass('current').css({
				'width' : bodyHeight - 80 + 'px' 
				,'height' : bodyWidth- 40 + 'px'
				,'top' : 60 - top  + 'px'
				,'left' :  bodyWidth - left - 20 + 'px'
			});
			$albumBox.find('.content_area').css('width',bodyWidth - 291 + 'px')
			$albumBox.find('.album').removeClass('current');
			$albumBox.find('.album_' + type).addClass('current');
			$myPhotos.addClass('box_myPhotos_actived');
			buildPhotosFn[type](id);
			setTimeout(function () {
				$albumBox.css('opacity','1');
			} , animateTime*2);
		}
	}
	
	/* 我的随笔 js 加载 */
	function myArticle () {
		var bodyWidth = $.getValues().bodyWidth,bodyHeight = $.getValues().bodyHeight,animateTime = $.getValues().animateTime;
		var datas = data_myArticle,$myArticle = $('.box_myArticle'),$content = $myArticle.find('div.content'), moduleHeight = $myArticle.height(),moduleWidth = $myArticle.width(),$btns = $myArticle.find('div.article_menu_box'),$walls = $myArticle.find('.wall_paper')
			,$mainArea = $myArticle.find('.article_main_area'), $mainEssay = $('.main_area_essay'), $mainPhrase = $('.main_area_phrase'),$mainNovel = $('.main_area_novel');
		$content.height(moduleHeight);
		/* 导航按钮点击事件 */
		$content.click(function (e) {
			var $essayItem = $mainEssay.find('.active'),$phraseItem = $mainPhrase.find('.active'),$novelItem = $mainNovel.find('.active');
			if($essayItem.length > 0){
				$essayItem.removeClass('active');
				$essayItem.parent().css('margin-top','0px');
			}
			$phraseItem.closePhrase();
			$novelItem.closeNovel();
			//stopBubble(e);
		})
		$btns.click(function (e) {
			var $this = $(this),target = $this.data('target'),index = $this.index();
			$walls.find('>div').removeClass('current');
			$walls.find('.wall_paper_' + target).addClass('current');
			$mainArea.css('margin-top', 0 - moduleHeight*index + 'px');
			//stopBubble(e);
		});
		/*essay 数据构建 */
		(function () {
			var datas_essay = datas['essay'],length_essay = datas_essay.length,html_essay = [],$previous = $mainEssay.find('div.previous_essay'),$next = $mainEssay.find('div.next_essay');
			var count_essay = Math.floor((moduleHeight-100)/80);
			
			for(var i = 0, length = Math.ceil(length_essay/count_essay); i < length; i ++){
				if(i == 0)
					html_essay.push('<ul class="essay_list current">');
				else
					html_essay.push('<ul class="essay_list">');
				for(var j = count_essay*i , j_length = count_essay*(i+1) > length_essay ? length_essay : count_essay*(i+1); j < j_length; j++){
					var item = datas_essay[j], title = item.title, date = item.date, content = item.content;
					html_essay.push('<li class="essay_item rel" data-index="'+ j +'"><div class="essay_title">'+ title +' <aside>'+ date +'</aside></div><div class="scroll-pane ovh"><div class="essay_content "><p>'+ content.join('</p><p>')+ '</p></div></div></li>');
				}
				html_essay.push('</ul>');
			}
			$mainEssay.append(html_essay.join(''));
			$mainEssay.find('.essay_item').click(function (e) {
				stopBubble(e);
			})
			$mainEssay.find('.essay_title ').click(function (e) {
				var $this = $(this), $parent = $this.parent(), $content = $this.next(), $list = $parent.parent(),$active = $mainEssay.find('.active'),top = $this.offset().top,index = $parent.data('index'),
				data = datas_essay[index],content = data.content;
				if($active.length == 0){
					$parent.addClass('active');
					$list.css('margin-top',32 - top + 'px');
					setTimeout(function() {
						$content.jScrollPane();		
					} , animateTime);
					
				}else {
					$active.removeClass('active');
					$list.css('margin-top','0px');
				}
				stopBubble(e);
			});
			$previous.click(function () {
				var $this = $mainEssay.find('>.current') , $pre = $this.prev();
				$this.removeClass('current');
				if($pre.length > 0 && $pre.hasClass('essay_list')){
					$pre.addClass('current'); 
				}else{
					$mainEssay.find('.essay_list:last-child').addClass('current');
				}
			}); 
			$next.click(function () {
				var $this = $mainEssay.find('>.current') , $pre = $this.next();
				$this.removeClass('current');
				if($pre.length > 0 && $pre.hasClass('essay_list')){
					$pre.addClass('current');
				}else{
					$mainEssay.find('.essay_list').first().addClass('current');
				}
			}); 
		})();
		/*phrase 数据构建 */
		(function () {
			var datas_phrase = datas['phrase'],length_phrase = datas_phrase.length,html_phrase = ['<ul class="phrase_list">'];
			for(var i = 0; i < length_phrase; i++){
				var item = datas_phrase[i], title = item.title, date = item.date, content = item.content;
				html_phrase.push('<li class="phrase_box"><div class="phrase_item phrase_page0'+ (i%4 + 1) +'" data-index="'+ i +'"><h3>'+ title +'</h3><div class="scroll-pane ovh"><div class="phrase_content"><p>'+ content.join('</p><p>')+ '</p></div></div></div></li>');
			}
			html_phrase.push('</ul>');
			$mainPhrase.append(html_phrase.join(''));
			var $phraseItems = $mainPhrase.find('div.phrase_item h3');
			$phraseItems.click(function (e) {
				var $this = $(this),$content = $this.next(),$item = $this.parent(),index = $item.data('index');
				if($item.hasClass('active')){
					$item.closePhrase();
				}else{
					$item.addClass('active').css({'top' : 0 - index*140 - 32 + 'px', 'z-index' : '1'});
					setTimeout(function () {
						$item.css('height' , moduleHeight + 'px');
							setTimeout(function() {
								$content.jScrollPane();		
							} , animateTime);
					} , animateTime);
					
				}
				stopBubble(e);
			});
			 $mainPhrase.find('div.phrase_item').click(function (e) {
				stopBubble(e);
			 });
			$.fn.closePhrase = function () {
				var $item = $(this);
				$item.removeClass('active').css('height','');
				setTimeout(function () {
					$item.removeAttr('style');
				} , animateTime);
			} 
		})();
		
		/*novel 数据构建 */
		(function () {
			var datas_novel = datas['novel'],length_novel = datas_novel.length,html_novel = ['<ul class="novel_list">'],content_flag =Math.ceil( (moduleHeight-160)/18);
			for(var i = 0; i < length_novel; i++){
				var item = datas_novel[i], title = item.title, date = item.date, content = item.content, length_content = content.length;
				/*竖排排版*
				for(var j = 0; j < length_content; j++){
					var c_item = content[j],c_length = c_item.length,c_content = ['<article class="fix l">'];
					for(var k = 0; k < c_length/content_flag ; k ++){
						c_content.push('<p>'+ c_item.substring(k*content_flag , (k+1)*content_flag) +'</p>');
					}
					c_content.push('</article>');
					content[j] = c_content.join('');
				}
				html_novel.push('<li class="novel_box rel l"><div class="novel_area"><div class="novel_item"><h3 class="l">'+ title +'</h3><div class="novel_content fix">'+ content.join('') +'</div></div></div></li>');
				/*竖排排版*/
				/*横排排版*/
				html_novel.push('<li class="novel_box rel l"><div class="novel_area"><div class="novel_item"><h3 class="l">'+ title +'</h3><div class="novel_content fix scroll-pane"><p>'+ content.join('</p><p>')+ '</p></div></div></div></li>');
				/*横排排版*/
			}
			html_novel.push('</ul>');
			$mainNovel.append(html_novel.join(''));
			
			var $novelItems = $mainNovel.find('div.novel_area h3');
			$novelItems.click(function (e) {
				var $this = $(this), $item = $this.parent(), $area = $item.parent(),offset = $area.offset();
				if($area.hasClass('active')){
					$area.closeNovel();
				}else{
					$area.addClass('active').css({'left': 16-offset.left + 'px','z-index':'1'});
					setTimeout(function () {
						$area.css('width',moduleWidth - 32 + 'px');
						/*横排排版*/
						setTimeout(function() {
							$area.find('.novel_content').jScrollPane();		
						} , animateTime);
						/*横排排版*/
					} , animateTime);
				}
				stopBubble(e);
			});
			$mainNovel.find('div.novel_area').click(function (e) {
				stopBubble(e);
			});
			$.fn.closeNovel = function () {
				var $item = $(this);
				$item.css('width','');
				setTimeout(function () {
					$item.removeClass('active').removeAttr('style');
				} , animateTime);
			} 
		})();
	}
	
	/* 我的临摹 js 加载 */
	function myRecode() {
		var bodyWidth = $.getValues().bodyWidth,bodyHeight = $.getValues().bodyHeight,animateTime = $.getValues().animateTime;
		var  $myRecode = $('.box_myRecode'),$content = $myRecode.find('div.content'), datas = data_myRecode,html = [];
		
		for(var i = 0, length = datas.length; i < length; i++){
			var item = datas[i],title = item.title, imgurl = item.imgurl,info = item.info;
			html.push('<div class="recode_area l rel">'); 
			html.push('<div class="recode_box info_box abs"><div class="recode_img ovh"><h3 class="tc">'+ title +'</h3><p>'+ info +'</p></div><button type="button" class="btn btn-default" data-type="code">返回</button></div>');
			html.push('<div class="recode_box code_box abs"><div class="recode_img ovh"><img src="'+ imgurl +'"></div><button type="button" class="btn btn-default" data-type="info">简介</button>');
			html.push('<button type="button" class="btn btn-default" data-type="target" data-flag="codeurl">查看源码</button><button type="button" class="btn btn-default" data-type="target" data-flag="baseurl">对比原网站</button><button type="button" class="btn btn-default" data-type="target" data-flag="url">打开</button></div></div>');
		}
		$content.html(html.join(''));
		$content.find('div.recode_area button').click(function () {
			var $this = $(this), $area = $this.parent().parent(), type = $this.data('type'),index = $area.index(),flag = $this.data('flag')
				,$infoBox = $area.find('> .info_box'), $codeBox = $area.find('> .code_box');
			switch (type) {
				case 'info' :
					$area.addClass('recode_area_info');
					setTimeout(function () {
						$infoBox.css('display','block');
						$codeBox.css('display','none');
					},animateTime/2);
					break;
				case 'code' :
					$area.removeClass('recode_area_info');
					setTimeout(function () {
						$codeBox.css('display','block');
						$infoBox.css('display','none'); 
					},animateTime/2);
					break;	
				case 'target' :
					window.open(datas[index][flag]);
					break;
			}		
		});
	}
	
	/* 我的工作 js 加载 */
	function myWork () {
		var bodyWidth = $.getValues().bodyWidth,bodyHeight = $.getValues().bodyHeight,animateTime = $.getValues().animateTime;
		var  $myWork = $('.box_myWork'),$content = $myWork.find('div.content'),$workContent = $myWork.find('div.work_content'), datas = data_myWork,html = [], startTime = 2013, endTime = (new Date()).getFullYear(), timeLine_html = [];
		for( var i = startTime; i <= endTime; i ++){
			timeLine_html.push('<div class="work_item"><div class="year_flag rel">'+ i +'<span class="glyphicon glyphicon-time abs"></span></div></div>');
			for(var j = 1; j <= 12 ; j ++){
				timeLine_html.push('<div class="work_item" data-flag="'+ i + '-' + j +'"><div class="mouth_flag rel">'+ j +'月<span class="abs"></span></div><div class="work_box"></div></div>');
			}
		}
		$workContent.html(timeLine_html.join(''));
		for(var i = 0,length = datas.length; i < length; i ++){
			var item = datas[i], timeFlag = item.timeFlag,  type = item.type, content = item.content,$box = $workContent.find('div.work_item[data-flag="'+ timeFlag +'"]');
			switch(type){
				case 'text' : 
				(function (item) {
					var content = item.content,$span = $box.find('div.mouth_flag >span');
					$box.find('.work_box').append('<p>'+ content +'</p>');
					var length = $box.find('.work_box >*').length;
					$span.addClass('current');
					if(length >1)
						$span.html('<em>'+length+'</em>');
				})(item);
				break;
				case 'area' : 
				(function (item) {
					var content = item.content,title = item.title,$span = $box.find('div.mouth_flag >span');
					$box.find('.work_box').append('<div class="work_area rel fix"><div class="panel-heading">'+ title +'</div>'+ content +'</div>');
					var length = $box.find('.work_box >*').length;
					$span.addClass('current');
					if(length >1)
						$span.html('<em>'+length+'</em>');
				})(item);
				break;
			}
		}
		$myWork.jScrollPane();
		setTimeout(function () {$myWork.jScrollPane();} , 1000);
	}	

	/* 我的游戏 js 加载 */
	function myGame() {
		var bodyWidth = $.getValues().bodyWidth,bodyHeight = $.getValues().bodyHeight,animateTime = $.getValues().animateTime;
		var  $myGame = $('.box_myGame'),$content = $myGame.find('div.content'),moduleHeight = $myGame.height(),moduleWidth = $myGame.width(),$gameAreas = $content.find('div.game_area');
		$content.height(moduleHeight);
		$gameAreas.downDelay({
			downDuring : 433,
			downEvent : downEvent
		}).draggable({
			addClasses: false 
			,cancel: ".endraggable"
		});
		
		function downEvent() {
			$content.removeClass('endraggable');
		}
	}
});

