+function ($) {
	$.fn.buildSnake = function (settings) {
		new snake(settings);
	};
	var snake = function (settings) {
		var temp = '<ul class="snake_box rel"><li class="last" data-arrow="right" style="top:250px;left:10px;"></li><li data-arrow="right" style="top:250px;left:20px;"></li><li class="head" data-arrow="right" style="top:250px;left:30px;"></li></ul>';
		$('body').html(temp);
		this.init();
	};
	snake.settings = {
		speed :100,
		interval : $.noop
	};
	snake.prototype.getSettings = function () {
		return snake.settings;
	};
	snake.prototype.setSpeed = function (speed) {
		this.getSettings().speed = speed;
		$('.snake_box').attr('data-speed',speed);
	}
	snake.prototype.getSpeed = function () {
		return this.getSettings().speed;
	}
	snake.prototype.setInterval = function (interval) {
		this.getSettings().interval = interval;
	}
	snake.prototype.getInterval = function () {
		return this.getSettings().interval;
	}
	
	snake.prototype.ifDead = function (item) {
		var $this = item,top = Number($this.css('top').replace('px','')),left = Number($this.css('left').replace('px','')),$li = this.getBox().find('li[data-add = "'+ top + '_' + left +'"]');
		if(top <= -10 || top >= 500) return true;
		if(left <= -10 || left >= 800) return true;
		if($li.length > 0 && !$li.eq(0).hasClass('head')) return true;
		return false;
	};
	snake.prototype.endGame = function () {
		clearInterval(this.getInterval());
	};
	snake.prototype.getBox = function () {
		return $('.snake_box');
	}
	snake.prototype.getHead = function () {
		return $('.snake_box .head');
	}
	snake.prototype.getApple = function () {
		return $('.snake_box .apple');
	}
	snake.prototype.getLast = function () {
		return $('.snake_box .last');
	}
	snake.prototype.addApple = function () {
		for(;;){
			var left = parseInt(Math.random()*79) * 10;
			var top = parseInt(Math.random()*49) * 10;
			if(this.getBox().find('li[data-add = "'+ top + '_' + left +'"]').length < 1 ){
				
				var dom = '<li class="apple" data-arrow="right" style="top:'+ top +'px;left:'+ left +'px;">';
				this.getBox().prepend(dom);
				return;
			}
		}
	}
	snake.prototype.eatApple = function () {
		var $head = this.getHead(),$apple = this.getApple(),
			hTop = Number($head.css('top').replace('px','')),hLeft = Number($head.css('left').replace('px','')),hArrow = $head.attr('data-arrow'),
			aTop = Number($apple.css('top').replace('px','')),aLeft = Number($apple.css('left').replace('px',''));
		
		if(hLeft == aLeft && hTop == aTop){
			var $lastChild = this.getLast(),lTop = Number($lastChild.css('top').replace('px','')),lLeft = Number($lastChild.css('left').replace('px','')),lArrow = $lastChild.attr('data-arrow');
			$lastChild.removeClass('last');
			$apple.removeClass('apple').addClass('last').addClass('eat_flag').attr('data-arrow' , lArrow).css({top:lTop,left:lLeft});
			this.addApple();
		}else{
			
		}
		
	}
	snake.prototype.monitor = function () {
		this.eatApple();
		var $ul = this.getBox(), $lis = $ul.find('li'),speed = $ul.attr('data-speed'),$head = this.getHead();
		$lis.each(function () {
			var $this = $(this),arrow = $this.attr('data-arrow'),top = Number($this.css('top').replace('px','')),left = Number($this.css('left').replace('px',''));
			if($this.hasClass('apple'))return;
			if($this.hasClass('eat_flag')){
				$this.removeClass('eat_flag');
				return;
			}
			switch(arrow){
				case 'right' : 
					left += 10;
					break;
				case 'left' : 
					left -= 10;
					break;
				case 'top' : 
					top -= 10;
					break;
				case 'bottom' : 
					top += 10;
					break;
			};
			if(!$this.hasClass('head')) $this.attr('data-arrow',$this.next().attr('data-arrow'));
			$this.attr("data-add", top + "_" + left).animate({top: top + 'px',left : left + 'px'}, {queue:false,duration : 0} );
		});
		$head.removeClass('keydown_flag');
		if(this.ifDead( $ul.find('li.head') ) )  this.endGame();
	};
	snake.prototype.init = function () {
		this.setSpeed(this.getSpeed());
		this.addApple();
		$(document).keydown(function(event){ 
			var keyCode = event.keyCode,$head = $('.snake_box .head'),arrow = $head.attr('data-arrow');
			if($head.hasClass('keydown_flag'))return;
			switch(keyCode){
				case 40 : 
					if(arrow != 'top' && arrow != 'bottom')
						$head.attr('data-arrow','bottom').addClass('keydown_flag');;
					break;
				case 37 : 
					if(arrow != 'right' && arrow != 'left')
						$head.attr('data-arrow','left').addClass('keydown_flag');;
					break;
				case 38 : 
					if(arrow != 'bottom' && arrow != 'top')
						$head.attr('data-arrow','top').addClass('keydown_flag');;
					break;
				case 39 : 
					if(arrow != 'left' && arrow != 'right')
						$head.attr('data-arrow','right').addClass('keydown_flag');;
					break;
			};
		}); 
		var interval = setInterval(function(){snake.prototype.monitor();}, this.getSpeed());
		this.setInterval(interval);
	};
} (jQuery); 