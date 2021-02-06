
$(document).ready(function() {
      //jquery code here
let s = $("#city-button");
    let val = s.val();
    console.log("the selected value: "+val);
    $.get("/city",function(data){
//        data = JSON.parse(data);
        console.log(i,"->",data);
        for (var i=0;i<data.length-1;i++) {
            console.log(data[i].city);
        $('#city-button').append(new Option(data[i].city, data[i].city));
        }
        $('#city-button').val(data[data.length-1]); //setting the 'city value' to the one present in our current session.
    });

    // let seat = /seat-booking\/[\d]+-[\d]+/;
   //  $("#+regex('seat-booking\/[\d]+-[\d]+')").on("click",function(e){
   //      if(s.val().length<=0){
   //          return false;
   //          // $(seat).prop( "disabled", true );
   //      } else {
   //          return true;
   //          // $(seat).prop( "disabled", false );
   //      }
   // });

   // if(s.val().length<=0){
   //          // return false;
   //          $("#seat-booking-time:a").prop( "disabled", true );
   //      } else {
   //          // return true;
   //          $("#seat-booking-time:a").prop( "disabled", false );
   //      }

});

$("#city-button").on('change', function() {
    if(this.value!=""){
        updateCity(this.value);
        async function updateCity(city){
//        window.alert(this.value );
        await $.post("/changeCity",{city: city});

        $('#city-button').val(city);
        //location.reload(true);
        }

    }
});
