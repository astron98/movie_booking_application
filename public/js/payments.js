// frontend-javascript/jquery for payment.html/payment.ejs

// import {promocode,cards} from './views/payments.ejs';

$(document).ready(function(){
	if($("input[name='payment']:checked").val()!="cards")
    {
        $('#cardOptions').hide();
        $('#partialBill1').hide();
    }
	$('input[type="radio"]').on("change",function(){
       let  paymentOption = $("input[name='payment']:checked").val();

       if(paymentOption!="cards"){
            $('#cardOptions').hide();
            $('#partialBill1').hide();
       }
       else{
            $('#cardOptions').show();
            $('#partialBill1').show();
       }
    });



});
