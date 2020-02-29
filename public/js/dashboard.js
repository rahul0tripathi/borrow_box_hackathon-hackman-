const ENV_HOST =  'http://'+window.location.hostname+':3000'

$(document).ready(function () {
  $('.sidenav').sideNav('show');
  $('.modal').modal()
  const AUTH = JSON.parse(localStorage.getItem('auth_session'))
  /*var AUTH = {
    name: 'User_2',
    sid: 'asas'
  };*/
  function approveRequest(req_id){
    console.log(req_id)
    $('#approve_request').modal('open')
    $('#approve_id').text(req_id)
    $('#approve_req_btn').click(function(){
      $.ajax({
        type: "POST",
        url: ENV_HOST + '/api/users/' + AUTH.name + '/' + AUTH.sid + '/approve_request',
        data: {
          _request_id:req_id,
          _lended_till:$('#approved_till').val()
        },
        dataType: "json",
        success: function (result) {
          $('#approve_request').modal('close')
          Materialize.toast('succesfully added :)', 4000);
        }
      });
    })
  }
  function createRequest(obj_id) {

    $('#make_request').modal('open')
    $('#req_obj_id').text(obj_id)
    $('#make_final_req').click(function () {
      $.ajax({
        type: "POST",
        url: ENV_HOST + '/api/users/' + AUTH.name + '/' + AUTH.sid + '/make_a_request',
        data: {
          _prodname: obj_id,
          _ExpDate: $('#lend_till').val()
        },
        dataType: "json",
        success: function (result) {
          $('#make_request').modal('close')
          Materialize.toast('succesfully added :)', 4000);
        }
      });
    })
  }
  //USER INFO API
  $.ajax({
    url: ENV_HOST + '/api/users/' + AUTH.name + '/' + AUTH.sid + '/_user_info',
    type: "GET",
    contentType: 'application/json',
    success: function (result) {
      console.log(result)
      $("#usr_img").attr('src', result.U_profile_pic)
      $("#user_name").text(result.U_name)
      $("#u_id").text(result._id)
      $("#u_address").text('College : ' + result.U_address.U_college + ' Address : ' + result.U_address.U_street + ',' + result.U_address.U_city + ' Type :' + result.U_address.U_type)
      $('#acc_loader').fadeOut(500, function () {
        $('#acc_info').fadeIn(500)
      })
    }
  });
  $('#logout').click(function () {
    
    $.ajax({
      url: ENV_HOST + '/api/users/' + AUTH.name + '/' + AUTH.sid + '/logout',
      type: "GET",
      contentType: 'application/json',
      success: function (result) {
        localStorage.removeItem("auth_session")
        window.location.replace(ENV_HOST);
      }
      })
  })
  $.ajax({
    url: ENV_HOST + '/api/users/' + AUTH.name + '/' + AUTH.sid + '/_get_request_list',
    type: "GET",
    contentType: 'application/json',
    success: function (result) {
      console.log(result)
      if(result.length == 0){$('#req_list_disp').append('<h5 style="margin-top:20%;">Oops ! Nothing Found In Your Request List :(Refresh To Try Again</h5>')}
      else{result.forEach(element =>{
        $('#req_list_disp').append('<div class="col s12 m4"><div class="card " style="color:black"><div class="card-content "><span class="card-title">'+element.req_id+'</span><p><h6>Request By User : '+element.req_by_user+'</h6><h6>Requested Product Name: '+element.req_prod_name+'</h6><h6>Lend Till Date: '+element.req_prod_params.Expiry_date+'</h6></p><div class="btn btn-large search-btn approve_request_btn" req_id="' + element.req_id + '" vertical-align: middle;width:100px;">Approve</div><div class="btn btn-large search-btn delete_request_btn" req_id="' + element.req_id + '" style="vertical-align: middle;width:100px; margin-left:20px;">Delete</div></div></div> </div>')
      })
      $('.approve_request_btn').click(function(){
        approveRequest($(this).attr('req_id'))
       
      })
    }
    }
  });

  $.ajax({
    url: ENV_HOST + '/api/users/' + AUTH.name + '/' + AUTH.sid + '/_borrow_box',
    type: "GET",
    contentType: 'application/json',
    success: function (result) {
      var k = 0;
      $("#my_box_disp").html('')
      $("#my_box_disp").append('<div class="row">')
      result.forEach(element => {
        if (k == 4) {
          $("#my_box_disp").append('</div><div class="row">')
          k = 0;
        }

        $("#my_box_disp").append('<div class="col s12 m3"><div class="card"><div class="card-image"><center><img src="' + element.prod_img[0] + '" style="height:200px; width:300px;"></center><div class="card-content container"><p><h5>' + element.prod_name + '</h5><p>Description:' + element.prod_desc + '</p><br><p>Manufacturer:' + element.prod_man + '</p><br><p>Year Of Production:' + element.prod_yop + '</p><br><p>Rating:' + element.prod_rating + '</p><p></p></p></div></div></div>')
        k++;
      });
      $("#my_box_disp").append('</div>')
    }
  });
  $.ajax({
    type: "GET",
    dataType: "json",
    url: ENV_HOST + '/api/users/' + AUTH.name + '/' + AUTH.sid + '/_get_lend_list',
    success: function (result) {
      if(result.length == 0){$('#lend_box').append('<h5 style="margin-top:20%;">Oops ! Nothing Found In Your Lend Box :( Refresh To Try Again</h5>')}
      else{
      result.forEach(element=>{
         
        if(element.U_addr){
          console.log(element)
         $('#lend_box').append('<div class="col s12 m4"><div class="card " style="color:black"><div class="card-content "><span class="card-title">'+element._req.req_id+'</span><p><h6>Lender Info : '+element._req.req_prod_user+' College : ' + element.U_addr.U_college + ' Address : ' + element.U_addr.U_street + ',' + element.U_addr.U_city + ' Type :' + element.U_addr.U_type+'</h6><h6>Requested Product Name: '+element._req.req_prod_name+'</h6><h6>Valid Till : '+element.Exp_date+'</h6></p><div class="btn btn-large search-btn approve_request_btn" req_id="' + element.req_id + '" vertical-align: middle;width:100px;">Return</div><p>*Collect The Item Within 2 Days Of Allotment</p></div></div> </div>')
        }
      
      })
    
    }
  }
    })


  $('#search_btn').click(function () {
    var param = $('#search_box_data').val().split(' ').join('_')
    var category = $('#category_selector').val()
    console.log(param, category)
    $.ajax({
      type: "GET",
      dataType: "json",
      url: ENV_HOST + '/api/users/' + AUTH.name + '/' + AUTH.sid + '/' + param + '/' + category + '/' + 'search_inventory',
      success: function (result) {
        console.log(result)
        $("#user_search_results").html('')
if(result.length == 0){$("#user_search_results").html('<center><h5 style="margin-top:10%;">Oops ! No Search Result Found For '+param+' In '+category+' :( Try Another Keyword </h5></center>')}
       else{ var k = 0;
       
        $("#user_search_results").append('<div class="row">')
        result.forEach(element => {
          if (element.By_User == AUTH.name) {

          } else {
            if (k == 4) {
              $("#user_search_results").append('</div><div class="row">')
              k = 0;
            }
            $("#user_search_results").append('<div class="col s12 m3"><div class="card"><div class="card-image"><img src="' + element.prod_img[0] + '" style="height:200px; width:300px;"><div class="card-content"><p><h5>' + element.prod_name + '</h5><p>Description:' + element.prod_desc + '</p><br><p>Manufacturer:' + element.prod_man + '</p><br><p>Year Of Production:' + element.prod_yop + '</p><br><p>Rating:' + element.prod_rating + '</p><div class="btn btn-large search-btn request_btn" ref="' + element.prod_name + '" vertical-align: middle;width:150px;">Request</div></p></div></div></div>')
            k++;
          }

        })
        $("#user_search_results").append('</div>')
        $('.request_btn').click(function () {
          createRequest($(this).attr('ref'))

        })
      }
      }
    })
  });
  $("#new_prod_submit_btn").click(function () {
    var formData = new FormData();
    console.log($('#prod_image')[0].files[0])
    formData.append('prod_image', $('#prod_image')[0].files[0])
    formData.append('_prodname', $("#prod_name").val())
    formData.append('_desc', $('#prod_desc').val())
    formData.append('_category', $("#prod_category").val())
    formData.append('_rating', $('#prod_rating').val())
    formData.append('_manufacturer', $("#prod_man").val())
    formData.append('_yop', $("#prod_yop").val())

    $.ajax({
      type: "POST",
      url: ENV_HOST + '/api/users/' + AUTH.name + '/' + AUTH.sid + '/add_to_box',
      data: formData,
      contentType: false,
      processData: false,
      cache: false,
      success: function (result) {
        Materialize.toast('succesfully added :)', 4000);
      }
    });

  })
});