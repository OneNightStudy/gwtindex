$(window).load(function(){



    //nav
    $('.hd_serch dt a').click(function(){
        if( $(this).parents('.hd_serch').hasClass('on')){
            $(this).parents('.hd_serch').removeClass('on');
        }else{
            $(this).parents('.hd_serch').addClass('on');
        }
    });
    $('.hd_lang dt').click(function(){
        if( $(this).parents('.hd_lang').hasClass('on')){
            $(this).parents('.hd_lang').removeClass('on');
        }else{
            $(this).parents('.hd_lang').addClass('on');
        }
    });


    //phone leftsilde menu
    $('.phone_navbar dt i').click(function(){
        $(this).parents('.phone_navbar').find('dd').slideUp();
        $(this).parents('dt').siblings('dd').slideDown();

    });


    $('.phone_side>dt').click(function(){
        if($(this).hasClass('on')){
            $(this).removeClass('on');
            $(this).siblings('dd').removeClass('on');
            $('.phone_navbar').find('dd').hide();
            $('.last_zhezhao').hide();
            $('.leftnav').fadeIn();
        }else{
            $(this).addClass('on');
            $(this).siblings('dd').addClass('on');
            $('.last_zhezhao').show();
            if($(window).width()<769){
                $('.leftnav').fadeOut();
            }
        }
    });


    $('.last_zhezhao').click(function(){
        $('.phone_side>dt').removeClass('on');
        $('.phone_side>dt').siblings('dd').removeClass('on');
        $('.phone_navbar').find('dd').hide();
        $('.last_zhezhao').hide();
        $('.leftnav').fadeIn();
    });



    //客服  1020
    $('.contact_flex dt').click(function(){
        if($(this).parents('.contact_flex').hasClass('on')){
            $(this).parents('.contact_flex').removeClass('on');
        }else{
            $(this).parents('.contact_flex').addClass('on');
        }
    });


    //page3 tab
    //$('.page3_tab_hd li').click(function(){
    //    var x =$(this).index();
    //    if(x<=3){
    //          $(this).addClass('on').siblings('li').removeClass('on');
    //           $('.page3_tab_bd').find('li').eq(x).fadeIn(700).siblings('li').fadeOut(700);
    //    }
    //
    //});

    //1028
    ////服务网络--个数少于12个时隐藏HD
    //if($('.svg_scroll .bd li').length<10){
    //    $('.svg_scroll .bd li').parents('.svg_scroll').find('.hd').hide();
    //}

    //产品TAB

    $(' #pro_hd li').click(function(){
        var x = $(this).index();
        $(this).addClass('on').siblings('li').removeClass('on');
        $('#pro_bd').children('li').eq(x).fadeIn().siblings('li').fadeOut();

    });



    //地图

    $('.page7_ditu .pic li').click(function(){
        $(this).addClass('on').siblings('li').removeClass('on');

        var where = $(this).find('.where').html();
        $('.page7_ditu  .wz .where span').html(where);

        var name = $(this).find('.name').html();
        $('.page7_ditu  .wz .name span').html(name);

        var phone = $(this).find('.phone').html();
        $('.page7_ditu  .wz .phone span').html(phone);

        var fax = $(this).find('.fax').html();
        $('.page7_ditu  .wz .fax span').html(fax);

        var address = $(this).find('.address').html();
        $('.page7_ditu  .wz .address span').html(address);

    });


    //left nav

    //1019
    $('.leftnav dd .dt').click(function(){
        if($(this).parents('dd').hasClass('on')){
            $(this).parents('dd').removeClass('on').find('ul').slideUp();
        }else{
            $(this).parents('dd').addClass('on').find('ul').slideDown();
            $(this).parents('dd').siblings('dd').removeClass('on').find('ul').slideUp();;
        }

    });
    //1019

    $('.leftnav dt').click(function(){
        if($(window).width()<=768){
            if( $(this).parents('.leftnav').hasClass('on')){
                $(this).parents('.leftnav').removeClass('on');
            }else{
                $(this).parents('.leftnav').addClass('on');
            }
        }
    });

    //服务网络

    $('.svg_scroll .infoList li').click(function(){
            $('.svg_scroll').addClass('on')
            $(this).addClass('on').siblings('li').removeClass('on');
            $('.map_model').fadeIn();
            $(document).bind("click",function(e){
                var target = $(e.target);
                if(target.closest(('.svg_scroll')).length == 0){
                    $('.map_model').fadeOut();
                }
            });
            if($(window).width()<767){
                $('.netzhezhao').show().bind("click",function(e){
                   $(this).hide();
                    $('.map_model').fadeOut();
                });
            }
    });


    //1113
    $(".gotop").click(function() {
        $('body,html').animate({
            scrollTop : 0
        }, 200);
        return false;});

    $(window).scroll(function () {
        if($(window).scrollTop()>500){
            $(".gotop").addClass('on');
        }else{
            $(".gotop").removeClass('on');
        }
    });



    $('.hd_serch dt').click(function(){
        $(this).parents('.hd_serch').toggleClass('on');
        if($(this).parents('.hd_serch').hasClass('on')){
            $(document).bind("click",function(e){
                var target = $(e.target);
                if(target.closest(('.hd_serch')).length == 0){
                    $('.hd_serch').removeClass('on');
                }
            });
        }
    });




    //1113
    //宽高
    mysize();
    $(window).resize(function(){
        mysize();
    });


});



function mysize(){
    var winW=$(window).width();
    var winH=$(window).height();

    $('#slideBox,#slideBox .bd li').height(winH);

    //var page2size=1342/726;
    //if($(window).width()>=1333){
    //    $('.ind_page2').height(1333/page2size);
    //}else{
    //    $('.ind_page2').height(winW*0.8/page2size);
    //}

    //if(winW<768){
    //    $('.page3_tab_bd_con').height();
    //}



    var dtW=$('.page5_dl dt').width();
    var ddW=$('.page5_dl dd').width();
    var ddlength=$('.page5_dl dd').length;

    //历程
    if(winW>=500){
        $('.section_page5 #scroller').width(ddW*ddlength+300); //300不知道什么鬼，总是少300px;
    }else{
        $('.section_page5 #scroller').width(+ddW*ddlength+150);
    }


    /*102434*/
    //$('.page5_dl .ddbottom ,.page5_dl .ddtop').each(function(){
    //    if($(this).find('img').length==0){
    //        $(this).find('.p1,.p2').css('padding-left',10);
    //    }
    //});
    /*102434*/



    //内页二级

    var nwW = 0;
    $('.ny_nav #wrapper li').each(function(){
        var x =$(this).outerWidth(true);
        nwW = nwW+x;
        return nwW;
    });

    $('.ny_nav #scroller').width(nwW+winW*0.06);


    //周边
    //1012
    var per_liW =$('.perimeter .bd li').outerWidth();
    var per_liL =$('.perimeter .bd li').length;
    if(winW<767){
        $('.perimeter .bd .tempWrap').width(135*per_liL);
    }else{
        $('.perimeter .bd .tempWrap').width((130));
    }
    //1012

    //人在
    $('.inseewo li .wz').each(function(){
        $(this).css('min-height',$(this).siblings('img').height());
        //1113
        if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/8./i)=="8."){
            $(this).css('min-height',$(this).siblings('img').height()-parseInt($(this).css('padding-top'))*2);
        }


    });



    //1113
    //$('.ny_main').css('min-height',winH-$('header').outerHeight()-$('footer').outerHeight()-$('.ny_nav').outerHeight());




    //1019

    //$('.pc_nav li').each(function(){
    //    var x =$(this)[0].offsetLeft;
    //    if($(this).find('.erji_dl').length<=1){
    //        $(this).find('.erji').css('text-align','left')
    //            .find('.erji_dl').css('margin-left',x+30);
    //    }
    //});

   //
   //
   //if(winW>500){
   //    var dl_max = new Array();
   //    $('.tedian .tddian_dl').each(function(){
   //        var h = $(this).innerHeight();
   //        dl_max = h > dl_max ? h : dl_max;
   //    }).height(dl_max);
   //}

    $('.qaq li').each(function(){
        var x = $(this).index();
        $(this).find('.p3').find('i').html(x+1);
    });


    //1020

    if(winH<430){
        $('.contact_flex').addClass('minh430')
    }else{

        $('.contact_flex').removeClass('minh430')
    }


    //102434



}






function diclick(){
	$('.svg_scroll .infoList li').click(function(){
            $('.svg_scroll').addClass('on')
            $(this).addClass('on').siblings('li').removeClass('on');
            $('.map_model').fadeIn();
            $(document).bind("click",function(e){
                var target = $(e.target);
                if(target.closest(('.svg_scroll')).length == 0){
                    $('.map_model').fadeOut();
                }
            });
    });
}









