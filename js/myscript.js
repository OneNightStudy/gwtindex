// Create By TuJia @2014
//ThinkPHP的异步表单提交
/**
    *参数 theForm:表单的id   url:提交的目标地址     result:用于提示的标签的id       callback:回调函数（选填）
    *返回 info:信息          status:状态            url:跳转地址 （这三个东东是ThinkPHP的success和error的返回）
*/
//2015/06/17更新（上传图片）
function mySubmit(theForm,url,result){
    function default_callback(res){
        // result.html(res.info);
		alert(res.info);
        if(res.status=='1'){
            if(res.url!=''){
                location.href = res.url;
            }else{
                window.setTimeout(function(){
                    result.html('');
                    document.getElementById(theForm).reset();
                },2000);
            }
        }
    }

    var callback = arguments[3] || default_callback;
    
    var result = $('#'+result);
    result.html('loading...');

    var formdata = null;
    try{
        formdata = new FormData();
    }catch(ex){}

    var filedata = $('#'+theForm+' input[type="file"]');

    if(filedata.length>0 && !formdata){
       alert('你的浏览器版本太低，请升级浏览器或使用其他浏览器（例如：chrome浏览器）！');
       return false;
	   // return true;
    }

    filedata.each(function(){
        var _this = this;
        var file = _this.files[0];
        formdata.append(_this.name,file);
    });

    if(!formdata){
        formdata = $('#'+theForm).serialize();
    }else{
        var data = $('#'+theForm).serializeArray();

        for(var i=0,len=data.length; i<len; i++){
            formdata.append(data[i]['name'], data[i]['value']);
        }
    }

    $.ajax({
        url:url,
        type:'post',
        data:formdata,
        processData:false,
        contentType:false,
        dataType:'json',
        success:callback
    });

    return false;
}



