const ENV_HOST = window.location.href.substring(0, window.location.href.length - 1);
$.get(ENV_HOST+'/api/home/get_latest', function (data, status) {
	console.log(data)

	})
$(document).ready(function(){
	$('#do_a_search').click(function () {
		var _param = $('#search_input').val()
		var _category = $('#category').val()
		$.ajax({
			type: "GET",
			dataType: "json",
			url: ENV_HOST + '/api/inventory/borrow/' + _param + '/' + _category ,
			success: function (result) {
				$('#search_disp').html('')
			  result.forEach(element => {
				  $('#search_disp').append('<tr><td>'+element.prod_name+'</td><td>'+element.prod_category+'</td><td>'+element.prod_rating+'</td></tr>')
			  });
			  $('#search_result').modal('open')
			}
			})	  
	})
    $('.modal').modal();
    $('#login_btn').click(function () {
    	if(! localStorage.getItem("auth_session")){
    		$('#authpage').modal('open')
    	}
    	else{
    		window.location.replace(ENV_HOST+'/dashboard');
    	}
	})
	
    $('#login_btn_').click(function () {
    	var uname = $('#auth_user_name').val()
    	var pass = $('#auth_pass_name').val()
    	if(uname != '' && pass !=''){
    		$.ajax({
          url: ENV_HOST+'/api/auth/login',
          type: "POST",
          data: JSON.stringify({U_name: uname, U_pass:pass }),
          dataType : 'json',
          contentType: 'application/json',
          success: function(result) {
 	     if(result.data == null) {Materialize.toast(result.err, 4000);console.log(result)}
 	     else{
 	     	localStorage.setItem('auth_session',JSON.stringify(result.data))
 	     	window.location.replace(ENV_HOST+'/dashboard');
 	     }
          }
});      
    	}
	})
	$("#search-trigger").click(function(){
		console.log($('#search-upload-img')[0].files[0])
		var formData = new FormData();
    formData.append('prod_image', $('#search-upload-img')[0].files[0])
    $.ajax({
      type: "POST",
      url: ENV_HOST + '/searchUpload',
      data: formData,
      contentType: false,
      processData: false,
      cache: false,
      success: function (result) {
		 
	  $('#abcd').attr('src',ENV_HOST+'/'+result['path'])
	  var img = document.getElementById('abcd');
	  $("#rainbow-progress-bar").fadeIn(100)
	  $('body').addClass('opClass');
	  console.log(img)
	  cocoSsd.load().then(model => {
		    // detect objects in the image.
		    model.detect(img).then(predictions => {
			  
			  if(predictions.length>0){
				  console.log(predictions)
				var search = predictions[0].class
				  $.ajax({
				  
				type: "GET",
				dataType: "json",
				url: ENV_HOST + '/api/inventory/borrow/' + search + '/all',
				success: function (result) {
					$('#search_disp').html('')
				  result.forEach(element => {
					$("#rainbow-progress-bar").fadeOut(100)
					$('body').removeClass('opClass');
					  $('#search_disp').append('<tr><td>'+element.prod_name+'</td><td>'+element.prod_category+'</td><td>'+element.prod_rating+'</td></tr>')
				  });
				  $('#search_result').modal('open')
				}
				})	}
			  else{
				$("#rainbow-progress-bar").fadeOut(100)
				$('body').removeClass('opClass');
				Materialize.toast(`Couldn't Recogonize The Product`, 4000);
			  }
			 
		    });
		  });
      }
    });
	})
  });
        