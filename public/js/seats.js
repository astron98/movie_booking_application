//let bs1;
//function onLoaderFunc(seats)
//{
////  $(".seatStructure *").prop("disabled", true);
//  $(".displayerBoxes *").prop("disabled", true);
//    bs1 = seats;
//    console.log("length of the returned array:",typeof(seats));
//    selectedSeats(seats);
//    //$("input:unchecked").prop("disabled",true);
//
//}
//
//function selectedSeats(seats)
//{
//    let i=0,n=seats.length;
//    for(i=0;i<n;i++)
//    {
//        //let val = $("table").find("input[value=" + seats[i].sid + "]")
//        //input[value=" + seats[i] + "]
//        $("input[value=" + seats[i].sid + "]").attr("checked",true);
//        $("input[value=" + seats[i].sid + "]").prop("disabled",true);
//    }
//}

function takeData()
{
//  if (( $("#Username").val().length == 0 ) || ( $("#Numseats").val().length == 0 ))
   if ( $("#Numseats").val().length <= 0)
  {
  	alert("Please Enter Number of Seats");
  }
  else
  {
//      input:unchecked
       //$("input:checkbox:not(:checked)").prop("disabled",false);
//    $(".inputForm *").prop("disabled", true);
    //$(".seatStructure *").prop("disabled", false);
    document.getElementById("notification").innerHTML = "<b style='margin-bottom:0px;background:white;color:green'>Please Select your Seats NOW!</b>";

  }
}
let seatDetails={};

function updateTextArea() {
  let price  = $('#seat-type option:selected').val();
  if ($("input:checked").length == ($("#Numseats").val()))
    {
      // $(".seatStructure *").prop("disabled", true);

//     var allNameVals = [];
     let allNumberVals = [];
     let allSeatsVals = [];

     //Storing in Array
//     allNameVals.push($("#Username").val());
     allNumberVals.push($("#Numseats").val());
     $('#seatsBlock :checked').each(function() {
       allSeatsVals.push($(this).val());
     });

     //Displaying
//     $('#nameDisplay').val(allNameVals);
     $('#NumberDisplay').val(allNumberVals);
     $('#seatsDisplay').val(allSeatsVals);
      seatDetails = {
      seats: allSeatsVals,
      seatType: ($('#seat-type option:selected').text()).includes("gold")? "gold" :"platinum",
      seatPrice: price
     };
     console.log(seatDetails);
     $.post('/seatDetails',{seatDetails:seatDetails});  //saving all the 'seatDetails' in the redis-session.
    }
  else
    {
      alert("Please select " + ($("#Numseats").val()) + " seats")
    }

  }


function myFunction() {
  alert($("input:checked").length);
}

/*
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
*/


//$(":checkbox").click(function() {
//  if ($("input:checked").length == ($("#Numseats").val())) {
//    $(":checkbox").prop('disabled', true);
//    $(':checked').prop('disabled', false);
//  }
//  else
//    {
////      $(":checkbox").prop('disabled', false);
//        selectedSeats(seats);
//    }
//});

function payments(){
    // e.preventDefault();
    window.location = "/payments";
}
