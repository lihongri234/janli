(function(){
	window.requestAnimFrame = (function(){
	  return  function( callback ){
	            window.setTimeout(callback, 1000 / 25);
	          };
	})();
	//判断是否支持canvas
	var isCanvas=function(){
		try{
			document.createElement('canvas').getContext('2d');
			return true;
		}catch(e){  
            return false;
        }; 
	}();
	if(!isCanvas)
		return;

	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");
	var ww=document.body.offsetWidth,wh=document.body.offsetHeight;
	canvas.setAttribute("width", ww);
	canvas.setAttribute("height",wh);
	/*离屏canvas*/
	var oCanvas=document.createElement("canvas");
	var oContext=oCanvas.getContext("2d");
	oCanvas.width=ww;
	oCanvas.height=wh;

	var curPage;

	var randomControl={
		
		createSign:function(){
			return Math.random()>.5?-1:1;
		},
		createPoints:function(x1,y1,x2,y2,n){
			var p=[];
			for(var i=0;i<n;i++){
				p.push({x:x1+Math.random()*(x2-x1),y:y1+Math.random()*(y2-y1)})
			}
			return p;
		}
	}

	/*粒子*/
	var particleArr=[];
	var particleControl={
		//0为旋转,1为散发,2为3d散发
		way: 0,
		createParticle:function(){
			var p=[];
			for(var i=0;i<10;i++){
				for(var j=0;j<5;j++){
					p=randomControl.createPoints(-.5*ww+i*.1*ww,-.5*wh+j*.2*wh,-.5*ww+(i+1)*.1*ww,-.5*wh+(j+1)*.2*wh,6);
					for(var k=0;k<p.length;k++){
						if(p[k].x!=0&&p[k].y!=0){
							particleArr.push(new particleCreator(p[k]))
						}
							
					}
				}
			}
		}
	}

	function particleCreator(p){
		//点坐标
		this.point=p||{x:0,y:0};
		//半径
		this.rad=Math.random();
		if(Math.random()>.9)
			this.rad=2;
		//速度
		this.speed=Math.random()*1+.1;
		//透明度
		this.opc=Math.random()/2+.3;
		//距原点距离
		this.R=Math.sqrt(this.point.x*this.point.x+this.point.y*this.point.y);
		if(typeof this.nextFps!="function"){
			particleCreator.prototype.nextFps=function(){
				if(particleControl.way==1){
					//散发
					this.point.x=(Math.abs(this.point.x)+this.speed*(Math.abs(this.point.x)/(Math.abs(this.point.x)+Math.abs(this.point.y))))*(this.point.x/Math.abs(this.point.x));
					this.point.y=(Math.abs(this.point.y)+this.speed*(Math.abs(this.point.y)/(Math.abs(this.point.x)+Math.abs(this.point.y))))*(this.point.y/Math.abs(this.point.y));
					if(this.point.x<ww*-.5||this.point.x>ww*.5||this.point.y<wh*-.5||this.point.y>wh*.5){
						var m=Math.min(Math.abs(this.point.x),Math.abs(this.point.y))/40;
						this.point.x/=m;
						this.point.y/=m;
					}
				}else if(particleControl.way==0){
					//旋转
					var s=(this.R-Math.abs(this.point.x))/this.R*(this.speed+1+Math.random()*3);
					s=s<=.05?.05:s;
					s=s>=1?1:s;
					if(this.point.y>0){				
						if(this.point.x+s<=this.R)
						{
							this.point.x+=s;
							this.point.y=Math.sqrt(this.R*this.R-this.point.x*this.point.x)
						}else{
							this.point.x=this.R;
							this.point.y=0;
						}
					}else{
						if(this.point.x-s>=this.R*-1){
							this.point.x-=s;
							this.point.y=Math.sqrt(this.R*this.R-this.point.x*this.point.x)*-1;
						}else{
							this.point.y*=-1;
						}
					}
				}
			}
		}
		if(typeof this.draw!="function"){
			particleCreator.prototype.draw=function(context){
				context.save();
				context.globalAlpha=this.opc;
				context.translate(ww/2,wh/2);
				context.fillStyle="#fff";
				context.beginPath();
				context.arc(this.point.x,this.point.y,this.rad,0,Math.PI*2);
				context.fill();
				context.restore();
			}
		}
	}

	/*粒子 end*/
	
	var drawControl={
		drawParticle:function(){
			for(var i=0;i<particleArr.length;i++){
				particleArr[i].nextFps();
				particleArr[i].draw(oContext);		
			}
		}
	}

	var animate=function(){
		oContext.clearRect(0,0,ww,wh);
		switch(curPage){
			case 1:{
				//画粒子
				drawControl.drawParticle();
				break;
			}
		}
		context.clearRect(0,0,ww,wh);
		context.drawImage(oCanvas,0,0);
		requestAnimFrame(animate);	
	}	

	window.onresize=function(){
		ww=document.body.offsetWidth,wh=document.body.offsetHeight;
		canvas.setAttribute("width", ww);
		canvas.setAttribute("height",wh);
		oCanvas.width=ww;
		oCanvas.height=wh;
		particleArr=[];
		particleControl.createParticle();
	}

	window.cvsEffect=function(time,callback){
		
	}
	cvsEffect.start=function(){		
		requestAnimFrame(animate);
	};
	cvsEffect.one=function(){
		curPage=1;
		particleControl.way=0;
		particleArr=[];
		particleControl.createParticle();
	}
})()