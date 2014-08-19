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
	
	$menus.eq(0).click();
})

/*  区域js加载 */
$(function () {
	var moduleMap = {
		'myInformation' : myInformation
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
	
});