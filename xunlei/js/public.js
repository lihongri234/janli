(function(){
    var $wrap=$("#wrap"),
        $pages=$("#product_list").find(".product_box"),
        $controlBox=$("#control_box"),
        $productBtns=$("#product_btns"),
        $controls=$controlBox.find("a"),
        $icLine=$("#ic_line"),
        $listTops=$("#list_top").find("li"),
        $hNav=$("#h_nav"),
        $hNavli=$hNav.find("li"),
        $hSubnav=$("#h_subnav"),
        $hSubDD=$hSubnav.find("dd"),
        $hBdot=$("#h_bdot"),
        $hSdot=$("#h_sdot"),
        $footer=$("#footer"),
        $bgs=$pages.find(".bg_box img"),
        $mainBoxs=$pages.find(".main_box"),
        $moreNav=$("#more_nav"),
        $rptBg=$("#rpt_bg");
    var data={
        pLength:$pages.length,
        curP:-1,
        isCan:true,
        isOnbtn:false,
        fColor:[2,2,1,1,1],
        dur: 5000,
        cNum:0
    };
    var aDD=$controls.eq(0).width()+parseInt($controls.eq(0).css("margin-right").slice(0,-2))*2;
    var cId;
    var isCss3=function(){
      var style=document.createElement("div").style;
        for(var k in style){
          if(k.toLowerCase().indexOf("animation")>=0){
            return true;
          }
         }
         return false;
    }();
    var isIE6=navigator.userAgent.indexOf("MSIE 6.0") > 0;

    //画布
    if(isCss3){
      cvsEffect.start();
      cvsEffect.one();
    }
    //页面自缩放
    var resize=function(){
      var w=$(window).width(),
          h=$(window).height();
      $wrap.height(h);
      $moreNav.height(h);
      if(w/h<1920/1080){
        $bgs.height(h).css({width:"auto",margin:-.5*h+"px 0 0 "+-.5*1920/1080*h+"px"});
      }else{
        $bgs.width(w).css({height:"auto",margin:-.5*w*1080/1920+"px 0 0 "+-.5*w+"px"});
      }
      var imgH=$bgs.height();
      $mainBoxs.height(imgH).css("margin-top",-.5*imgH+"px");
      var cls;
      if(isCss3){
        document.getElementById("wrap").className="wrap big_view xbig css3";
        switch(true){
          case w>=1920:{cls="";break;}
          case w<1920&&w>=1680:{cls="small9";break;}
          case w<1680&&w>=1600:{cls="small8";break;}
          case w<1600&&w>=1536:{cls="small7";break;}
          case w<1536&&w>=1440:{cls="small6";break;}
          case w<1440&&w>=1366:{cls="small5";break;}
          case w<1366&&w>=1280:{cls="small4";break;}
          case w<1280&&w>=1024:{cls="small3";break;}
          case w<1024:{cls="small2";break;}
        }
        for(var i=0;i<data.pLength;i++){
          $pages.eq(i).find(".content").attr("class","content "+cls);
        }

        $productBtns.find(".content").attr("class","content "+cls);
      }else{
        switch(true){
          case w>=1600:{cls="big_view";break;}
          case w<1600&&w>=1440:{cls="mid_view";break;}
          case w<1440:{cls="small_view";break;}
        }
        var ws=$wrap[0].className;
        if(isIE6&&(ws.indexOf("big")!=-1||ws.indexOf("mid")!=-1||ws.indexOf("small")!=-1)&&ws.indexOf(cls)==-1)
          location.reload();
        wrap.className="wrap "+cls;
      }  
      aDD=$controls.eq(0).width()+parseInt($controls.eq(0).css("margin-right").slice(0,-2))*2;   
    };
    $(window).resize(resize);
    resize();
    
    //轮播
    var pageChange=function(idx){
      if(data.isOnbtn)
        return;
      if(idx>=-1&&idx<data.pLength&&idx!=data.curP&&data.isCan){  
        data.isCan=false; 
        data.cNum++; 
        clearInterval(cId); 
        idx=idx==-1?data.pLength-1:idx;     
        $controls.removeClass("cur").eq(idx).addClass("cur");
        $pages.eq(data.curP).css({zIndex:0});
        $icLine.css({left:aDD*idx});
        // $footer.attr("class","footer f_color"+data.fColor[idx]);
        if(idx==0)
          data.dur=5000;
        else
          data.dur=3500;
        $pages.eq(idx).addClass("show").css({opacity:0,zIndex:1}).animate({opacity:1},400,function(){
          $pages.eq(data.curP).removeClass("show");
          $(this).addClass("show");
          data.isCan=true;
          data.curP=idx; 
          data.cNum--; 
          if(data.cNum==0){
            cId=setInterval(function(){
              pageChange((data.curP+1)%data.pLength);
            },data.dur);   
          }  
        });
      }
    }
    pageChange(0)
    $controls.on("mouseenter",function(){
      data.isCan=true;
      pageChange($controls.index(this));
      $icLine.css({left:aDD*$controls.index(this)});
      data.isOnbtn=true;
    });
    $controls.on("mouseleave",function(){
      data.isOnbtn=false;
    });

    //底部操作
    var isBottom=false;
    var bAni;
    var bottomHide=function(){
      if(isBottom){
        isBottom=false;
        if(bAni)
          clearTimeout(bAni),bAni=null;
        $footer.removeClass("show");
        $productBtns.removeClass("show");
        $rptBg.removeClass("show");
      }    
    }
    var bottomShow=function(){
      if(!isBottom){
        isBottom=true;
        $footer.addClass("show");
        $productBtns.addClass("show");
        $rptBg.addClass("show");
        if(bAni)
          clearTimeout(bAni);
        bAni=setTimeout(bottomHide,2000);
      }
    }
    $footer.on("mouseenter",function(){
      if(bAni)
        clearTimeout(bAni),bAni=null;
    });
    $footer.on("mouseleave",function(){
      if(bAni)
        clearTimeout(bAni);
      bAni=setTimeout(bottomHide,2000);
    });
    $(document).on("mousewheel DOMMouseScroll",function(event){
      var sd=event.originalEvent.wheelDelta||event.originalEvent.detail*-1;
      if(sd>0){
        bottomHide();
      }
      else{
        bottomShow();                         
      }
    });


    //导航事件
    $("#nav_more").on("mouseenter",function(){
      $moreNav.addClass("show");
    });
    $moreNav.on("mouseleave",function(){
      $moreNav.removeClass("show");
      $hBdot.css({left:-9999,top:106});
    })
    $hNavli.on("mouseenter",function(){
      $hBdot.css({left:18,top:106+$hNavli.index(this)*69});
    });
    $hNav.on("mouseleave",function(){
      $hBdot.css({left:-9999});
    });
    $hSubnav.find("dt").on("mouseenter",function(){
      $hBdot.css({left:18});
      $hSdot.css({left:-9999});
    });
    $hSubDD.on("mouseenter",function(){
      $hSdot.css({left:18,top:53+$hSubDD.index(this)*44});
      $hBdot.css({left:-9999});
    });
    $hSubnav.on("mouseleave",function(){
      $hSdot.css({left:-9999});
    });    
  })();
//////////////////////////////////////////////////////////////////////////////
  function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r !=null) return unescape(r[2]); return ''; 
 } 
  var browser = {
    versions: function() {
    var u = navigator.userAgent, app = navigator.appVersion;
    return {//移动终端浏览器版本信息
    trident: u.indexOf('Trident') > -1, //IE内核
    presto: u.indexOf('Presto') > -1, //opera内核
    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, //是否iPad
    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    if(getQueryString('nojump') == 1){

    }else{
      if (browser.versions.android || browser.versions.ios) {
        if(!browser.versions.iPad){
        window.location.href = 'm/index.html';
        }

    }
  }