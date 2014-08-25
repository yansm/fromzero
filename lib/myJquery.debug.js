/* 主页事件控制 */
$(function () {
	/* tooltip 构建 */
	$('.needtooltip').tooltip();
	var animateTime = 300;
	
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
			, $area = $('.area_'+ type);
		if(target && $area.find('.box_'+ target).length == 0) {
			$area.append('<div class="scroll-pane box box_'+ target +'"></div>');
			$area.find('.box_'+ target).load(target+ ".html",function () {
				$area.find('.box_'+ target).jScrollPane();
				$.initModule({target : target});
			});
			
		}
		if(target){
			$area.find('> * ').css('display','none');
			$area.find('.box_'+ target).css('display','block');
		}
		
		if($body.hasClass('type_'+ type)) return;
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
	$menus.eq(0).click();
})

/*  区域js加载 */
$(function () {
	var moduleMap = {
		'myInformation' : myInformation
		,'myPhotos' : myPhotos
	}

	$.extend({
		initModule : function (settings) {
			var target = settings.target;
			moduleMap[target]();
		}
	}); 
	
	/* myInformation js 加载 */
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
		buildPhotosList(datas);
		/* 相册查看方式 */
		var buildPhotosFn = {
			'normal' : buildPhotosNormal
			,'wall' : buildPhotosWall
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
				var item = photos[i], title = item.title,url = item.url,id = item.id;
				html.push('<div class="photo_area" data-index="'+ i +'"><div class="photo_box3" data-type="wall"><div class="photo_content"></div></div><div class="photo_box2" data-type="wall"><div class="photo_content"></div></div><div class="photo_box" data-type="normal"><div class="photo_content">');
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
	
});

