/* 主页事件控制 */
$(function () {

	$('.needtooltip').tooltip();
	var animateTime = 300;
	
	var $body = $('body'),bodyWidth = $body.width(),bodyHeight = $body.height(),$menus = $('.indexMenu li'), $modules = $('.module_info li'),
			$rightArea = $('.area_right');
	/* 主页菜单点击后跳转效果 */
	var menuClickType = {
		'normal' : function () {
			$menus.css({
				'left':'0px'
				,'top' : '0px'
			}); 
		}
		,'left' : function () {
			$menus.css({
				'left':'-'+ (bodyWidth - 90) +'px'
				,'top' : '0px'
			});
		}
		,'right' : function () {
			$menus.css({
				'left':'0px'
				,'top' : '0px'
			}); 
		}
		,'top' : function () {
			$menus.css({
				'left':'0px'
				,'top' : '-100%'
			}); 
			setTimeout(function () {
				$body.addClass('type_top_end' );
				$menus.css({
					'left':'0px' 
					,'top' : (43 - bodyHeight) + 'px'
				}); 
			} , animateTime);
		}
		,'bottom' : function () {
			$menus.css({
				'left':'0px'
				,'top' : '100%'
			}); 
			setTimeout(function () {
				$body.addClass('type_bottom_end' );
				$menus.css({
					'left':'0px' 
					,'top' : (bodyHeight - 43) + 'px'
				}); 
			} , animateTime);
		}
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
		if(!$body.hasClass('type_'+ type)){
			if($body.hasClass('type_top_end')){
				$menus.css({
					'left':'0px'
					,'top' : '-100%'
				}); 
				setTimeout(function () {
					$body.removeClass('type_top_end');
					initMenu(type);
				} , animateTime);
			}else if ($body.hasClass('type_bottom_end')) {
				$menus.css({
					'left':'0px'
					,'top' : '100%'
				}); 
				setTimeout(function () {
					$body.removeClass('type_top_end');
					initMenu(type);
				} , animateTime);
			} else{
				initMenu(type);
			}
		}
	});
	
	/* 菜单变动前调整 */
	function initMenu(type) {
		$body.removeClass().addClass('type_' + type);
		menuClickType[type]();
	};
	
	
	/* 浏览器变动时处理 */
	function resetWindow() {
		bodyWidth = $body.width();
		bodyHeight = $body.height();
	}
	window.onresize=function(){  
		resetWindow();  
	}  
})