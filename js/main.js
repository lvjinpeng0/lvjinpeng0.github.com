//ready事件	
function addReady(fn){
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded',fn,false);
	}else{
		document.attachEvent('onreadystatechange',function(){
			if(document.readyState == 'complete'){
				fn();
			}	
		});	
	}
}
//取随机数
function rnd(n,m){
	return Math.floor(Math.random()*(m-n)+n);
}
//解绑事件
function removeEvent(obj,sEv,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(sEv,fn,false);
	}else{
		obj.detachEvent('on'+sEv,fn);
	}
}
//绑定事件
function addEvent(obj,sEv,fn){
	if(obj.addEventListener){
	   obj.addEventListener(sEv,fn,false);
	}else if(obj.attachEvent){
	   obj.attachEvent('on' + sEv, function() {
		  fn.call(obj);
	   });
	}else{
	   obj['on' + sEv] = fn;
	}
}	
//设置样式
function setC3Style(obj,name,value){
	obj.style['Webkit'+name.charAt(0).toUpperCase()+name.substring(1)] = value;
	obj.style['Moz'+name.charAt(0).toUpperCase()+name.substring(1)] = value; 
	obj.style['ms'+name.charAt(0).toUpperCase()+name.substring(1)] = value; 
	obj.style['O'+name.charAt(0).toUpperCase()+name.substring(1)] = value; 
	obj.style[name] = value; 
}

//滚轮事件
function addWheel(obj,fn){
	function fnWheel(ev){
		var oEvent = ev||event;
		var down = false;
		//2判断滚轮方向
		if(oEvent.wheelDelta){
			//下
			if(oEvent.wheelDelta<0){
				down = true;
			}else{
				down = false;
			}
					
		}else{
			//下
			if(oEvent.detail>0){
				down = true;
			}else{
				down = false;
			}
		}
		//3根据方向down干事儿
		fn(down);
		return false;
	}
	//1.滚轮事件兼容
	obj.onmousewheel = fnWheel;//IE chrome
	obj.addEventListener&&obj.addEventListener('DOMMouseScroll',fnWheel,false);//FF
}

var aSec = document.querySelectorAll('.section');
var aCoverImg = document.querySelectorAll('.section .coverImage');
var iNow = 0;
var bOk = false;
var oFullPage = document.getElementById('fullPage');
var aNavList = document.querySelectorAll('.nav li');
var oTop = document.querySelector('.top');

//左上角导航菜单
var aNavListLen = aNavList.length;
for(var i = 0;i<aNavListLen;i++){
	(function(index){
		addEvent(aNavList[i],'click',function(){
			if(bOk)return;
			bOk = true;
			iNow = index*2;
			conMove(iNow);
		});
	})(i);
}
//右上角回到顶部
addEvent(oTop,'click',function(){
	if(bOk)return;
	bOk = true;
	iNow = 0;
	conMove(iNow);
});	
//主页面动画
aCoverImg[iNow/2].classList.add('state-in');

//分页加高度
var aSecLen = aSec.length;
for(var i = 0;i<aSecLen;i++){
	aSec[i].style.height = document.documentElement.clientHeight+'px';	
}

//改变窗口大小时页面自适应
addEvent(window,'resize',function(){
	for(var i = 0;i<aSecLen;i++){
		aSec[i].style.height = document.documentElement.clientHeight+'px';	
		setC3Style(oFullPage,'transform','translate(0,'+(-document.documentElement.clientHeight*iNow)+'px)')
	}
})

//滑轮滚动事件
addWheel(document,function(down){
	if(bOk)return;
	bOk = true;
	if(down){
		iNow++;
		if(iNow == aSec.length){
			iNow = aSec.length-1;	
			bOk = false;
		}
	}else{
		iNow--;
		if(iNow == -1){
			iNow = 0;	
			bOk = false;
		}
	}	
	conMove(iNow);
});

//页面滑动 函数定义
function conMove(iNow){
	setC3Style(oFullPage,'transform','translate(0,'+(-document.documentElement.clientHeight*iNow)+'px)')
	function tranEnd(){
		oFullPage.removeEventListener('transitionend',tranEnd,false);
		aCoverImg[Math.floor(iNow/2)].classList.add('state-in');
		bOk = false;
	}
	oFullPage.addEventListener('transitionend',tranEnd,false);
}
