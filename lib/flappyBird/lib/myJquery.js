+function ($) {
	$.fn.buildFlappyBird = function (settings) {
		new flappyBird(settings);
	}
	var flappyBird = function (settings) {	
		this.start();
	}
	flappyBird.settings = {	
		state : false,
		ifStart : false,
		isStop : false,
		isEnd : false,
		topHeight : 50,
		bottomHeight : 460,
		moveEvent : $.noop
	}
	flappyBird.DEFAULT = {
		state : false,
		ifStart : false,
		isStop : false,
		isEnd : false
	}
	flappyBird.prototype.start = function () {
		var _this = this;
		$(document).keydown(function(event){ 
			var keyCode = event.keyCode;
			switch(keyCode){	
				case 38 : 
					_this.keyUp();
					break;
				case 32 :	
					if(!_this.getSettings().ifStart) return;
					if(!_this.getSettings().isStop) _this.stopGame();
					else _this.restartGame();
					break;
				case 13 :
					if(_this.getSettings().isEnd) _this.resetGame();
					break;
			};
		});
	}
	flappyBird.prototype.keyUp = function () {
		if(!this.getSettings().ifStart){
			this.getSettings().ifStart = true;
			this.setState(true);
			this.movePipe();
			this.getWelcome().fadeOut();
		}
		if(!this.getState())return;
		clearInterval(i);
		aa();
	}
	flappyBird.prototype.getBird = function () {
		return $('#flappy_bird');
	}
	flappyBird.prototype.getSettings = function () {
		return flappyBird.settings;
	}
	flappyBird.prototype.getPipe = function () {
		return $('.flappy_pipe_box');
	}
	flappyBird.prototype.getState = function () {
		return this.getSettings().state;
	}
	flappyBird.prototype.getIndex = function () {
		return Number($('#index_area').html());
	}
	flappyBird.prototype.setIndex = function (index) {
		return $('#index_area').html(index);
	}
	flappyBird.prototype.setState = function (state) {
		this.getSettings().state = state;
	}
	flappyBird.prototype.getWelcome = function () {
		return $('.welcome_info');
	}
	flappyBird.prototype.getResult = function () {
		return $('.result_info');
	}
	flappyBird.prototype.setResult = function (result) {
		this.getResult().find('.score').html(result);
	}
	flappyBird.prototype.addPipe = function (left) {
		var height = parseInt(Math.random()*320) + 40,$pipeBox = this.getPipe();
		var html = '<div class="flappy_pipe" data-left="'+ (250 - left) +'" data-height="'+ height +'" style="height:'+ height +'px;left:' + (0 - left + 400) + 'px;"></div>';
		$pipeBox.append(html);
	}
	flappyBird.prototype.checkCollision = function (leftFlag) {
		var $pipe = $('.flappy_pipe[data-left="'+ (leftFlag) +'"]'),height = Number($pipe.attr('data-height')),$bird = this.getBird(),birdTop = $bird.offset().top;
		if(birdTop < height || birdTop > height + 80) this.endGame();
	}
	flappyBird.prototype.movePipe = function () {
		var _this = this,leftFlag = 99999;
		this.getSettings().moveEvent = setInterval(function () {
			var $pipeBox = _this.getPipe(),state = _this.getState(),left = Number($pipeBox.css('left').replace('px', '')) - 5,$pipeCurrent = $('.flappy_pipe[data-left="'+ (0 - left) +'"]');
			if(state){
				$pipeBox.css({left : left + 'px'});
				if(left < -200 && left%200 == 0) _this.addPipe(left);                                                           //add管子
				if((left + 120) < -400 && (left + 120)%200 == 0) _this.setIndex(_this.getIndex() + 1);			//计数器event
				if($pipeCurrent.length > 0) leftFlag = 0 - left;																		//判断管子是否经过bird				
				if(0 - left > leftFlag && 0 - left < leftFlag + 87) _this.checkCollision(leftFlag);						//经过event
			}
		},25);
	}
	flappyBird.prototype.stopGame = function () {
		this.setState(false);
		this.getSettings().isStop = true;
		clearInterval(i);
	}
	flappyBird.prototype.restartGame = function () {
		this.setState(true);
		this.getSettings().isStop = false;
		aa(v);
	}
	flappyBird.prototype.endGame = function () {
		this.setState(false);
		this.setResult(this.getIndex());
		this.getResult().fadeIn();
		this.getSettings().isEnd = true;
		clearInterval(this.getSettings().moveEvent);
	}
	flappyBird.prototype.resetGame = function () {
		flappyBird.settings = $.extend({}, flappyBird.settings, flappyBird.DEFAULT);
		var $pipe = this.getPipe(),$bird = this.getBird(),$welcome = this.getWelcome(),$result = this.getResult();
		$pipe.html("").css('left','0px');
		$bird.css('top','230px');
		$welcome.fadeIn();
		$result.fadeOut();
		clearInterval(i);
		this.setIndex(0);
		this.start();
	}
	var v = -10,i = $.noop; 
    function aa(speed) {	
		v=  speed || - 9;
        i = setInterval(function () {bb();}, 25);  
    }  
    function bb() {  
        var $bird= $('#flappy_bird');
        var top =  $bird.offset().top , b = top + v;  
		$bird.css( {'top' : b + 'px'} );  
        if (top < 460) {  
            v += 0.9;  
        } else {  
			v = 0;
            $bird.css( {'top' : '460px'} );  
			flappyBird.prototype.endGame();
        }  
		
    }  
} (jQuery);

$(function () {
	$(window).buildFlappyBird();
});