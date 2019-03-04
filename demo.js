var startBtn = document.getElementById('startBtn');
var content  = document.getElementById('content');
var bombNumBox = document.getElementById('bombNumBox');
var end = document.getElementById('end');
var endImg = document.getElementById('endImg'); 
var close = document.getElementById('close');
var score = document.getElementById('score');
var allBombNum;
var remainBombNum;
var block;
var allGrid = [];

bindEvent();
function bindEvent(){
	//点击start按钮出现游戏界面
	startBtn.onclick = function(){
		content.style.display = 'block';
		bombNumBox.style.display = 'block';
		init();
		startBtn.style.display = 'none';
	}
	content.oncontextmenu = function(){
		return false;
	}
	content.onmousedown = function(e){
		var event = e.target;
		if(e.which == 1){
			leftClick(event);
		}else if(e.which == 3){
			rightClick(event);
		}
	}
	close.onclick = function(){
		end.style.display = 'none';
		bombNumBox.style.display = 'none';
		content.style.display = 'none';
		content.innerHTML = '';
		startBtn.style.display = 'block';
	}
}

//生成格子和10个地雷
function init(){
	allBombNum = 10;
	remainBombNum = 10;
	score.innerHTML = remainBombNum;
	for (var i = 0; i < 10; i++) {
		for(var j = 0; j < 10; j++){
			var grid = document.createElement('div');
			grid.classList.add('block');
			grid.setAttribute('id',i + '-' + j);
			content.appendChild(grid);
			allGrid.push({item:0});
		}
	}
	block = document.getElementsByClassName('block');
	while (allBombNum) {
		var bombIndex = Math.floor(Math.random()*100);
		if(allGrid[bombIndex].item === 0){
			allGrid[bombIndex].item = 1;
			block[bombIndex].classList.add('isBomb');
			allBombNum --;
		}
	}
}

//左键点击事件
function leftClick(dom){
	if(dom.classList.contains('flag')){
		return;
	}
	var isBomb = document.getElementsByClassName('isBomb');
	//如果点到雷了
	if(dom && dom.classList.contains('isBomb')){
		for(var i = 0; i < isBomb.length; i++){
			isBomb[i].classList.add('show');
		}
		setTimeout(function(){
			end.style.display = 'block';
			endImg.style.backgroundImage = 'url(./images/explode.gif)';
		},1000)
	}else{	//没点到雷，插入它周围雷的个数
		var n = 0;
		var posArr = dom && dom.getAttribute('id').split('-');
		var posX = posArr && +posArr[0];
		var posY = posArr && +posArr[1];
		dom && dom.classList.add('num');
		for(var i = posX - 1; i <= posX + 1; i++){
			for(var j = posY - 1; j <= posY + 1; j++){
				var aroundBox = document.getElementById(i + '-' + j);
				if(aroundBox && aroundBox.classList.contains('isBomb')){
					n++;
				}
			}
		}
		dom && (dom.innerHTML = n);
		//它周围没有雷，扩散
		if(n == 0){
			for(var i = posX - 1; i <= posX + 1; i++){
				for(var j = posY - 1; j <= posY + 1; j++){
					var nearBox = document.getElementById(i + '-' + j);
					if(nearBox && nearBox.length != 0){
						if(!nearBox.classList.contains('cheaked')){
							nearBox.classList.add('cheaked');
							leftClick(nearBox);
						}
					}
				}
			}
		}
	}
}

//右键点击标记
function rightClick(dom){
	//如果点击数字
	if(dom.classList.contains('num')){
		return;
	}
	dom.classList.toggle('flag');
	if(dom.classList.contains('isBomb') && dom.classList.contains('flag')){
		remainBombNum --;
	}
	if(dom.classList.contains('isBomb') && !dom.classList.contains('flag')){
		remainBombNum ++;
	}
	score.innerHTML = remainBombNum;
	if(remainBombNum == 0){
		end.style.display = 'block';
		endImg.style.backgroundImage = 'url("./images/victory.png")';
	}
}