/* 主页事件控制 */
$(function () {

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
				}); 
			}, time);
		}
		,'top' : function () {
			if($body.hasClass('type_bottom')){
				$body.addClass('type_top' ).removeClass('type_bottom');
				$menus.css({
					'left':'0px' 
					,'top' : (43 - bodyHeight) + 'px'
				}); 
			}else {
				$body.removeClass().addClass('type_bottom_end' );
				$menus.css({
					'left':'0px'
					,'top' : '-100%'
				}); 
				setTimeout(function () {
					$body.addClass('type_top' );
					$menus.css({
						'left':'0px' 
						,'top' : (43 - bodyHeight) + 'px'
					}); 
				} , animateTime);
			}
		}
		,'bottom' : function () {
			if($body.hasClass('type_top')) {
				$body.addClass('type_bottom' ).removeClass('type_top');
				$menus.css({
					'left':'0px' 
					,'top' : (bodyHeight - 43) + 'px'
				}); 
			}else{
				$body.removeClass().addClass('type_bottom_end' );
				$menus.css({
					'left':'0px'
					,'top' : '100%'
				}); 
				setTimeout(function () {
					$body.addClass('type_bottom' );
					$menus.css({
						'left':'0px' 
						,'top' : (bodyHeight - 43) + 'px'
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
				,'top' : '-100%'
			});
			return animateTime;
		}else if($body.hasClass('type_bottom')) {
			$menus.css({
				'left':'0px'
				,'top' : '100%'
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
		var $this = $(this), type = $this.attr('data-type');
		if($body.hasClass('type_'+ type)) return;
		menuClickType[type]();
	});
	
	
	/* 浏览器变动时处理 */
	function resetWindow() {
		bodyWidth = $body.width();
		bodyHeight = $body.height();
	}
	window.onresize=function(){  
		resetWindow();  
	}  
})