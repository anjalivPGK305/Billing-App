var curTot = 0;
$(document).ready(function () {
  // By Default add a new row
  addRow();

  $('#invoiceBtn').hide();
  // Tabbing the discount value
  $('body').on('keydown', '.discount', function (e) {
    var code = e.which;
    if (code == 13 || code == 9) {
      // Attach new rows if the last price field is tabbed
      if ($(this).attr('data') == curTot) {
        addRow();
      }
    }
  });

  $('body').on('keyup', '.amount,.qnty,.discount', function (e) {
    loopIt();
  });
  $('body').on('change', '.ctax,.stax', function (e) {
    loopIt();
  });
});

function addRow() {
  curTot++;
  var xString = '<tr class="itemrow" id="trid_' + curTot + '" data="' + curTot + '"><td class="slnocls">' + curTot + '</td><td><div class="input-group"><input type="text" id="desc_' + curTot + '" name="item[' + curTot + '][description]" class="form-control" /><div class="input-group-append"><a class="btn btn-danger" id="removeBtn" onclick=removeRow(' + curTot + ')>Remove Item</a></div></div></td><td><input type="text" name="item[' + curTot + '][sac]" class="form-control" /></td><td><input type="text" name="item[' + curTot + '][amount]" id="amount_' + curTot + '" class="form-control amount" style="max-width:100px;"/></td><td><input id="qnty_' + curTot + '" type="number" name="item[' + curTot + '][qnty]" class="form-control qnty" style="max-width:100px;"/></td><td><input id="discount_' + curTot + '" type="text" name="item[' + curTot + '][discount]" class="form-control discount" data="' + curTot + '" style="max-width:60px;"/></td><td id="taxablevalue_' + curTot + '"></td></td><td><select id="cgstrate_' + curTot + '" class="cgstrate form-control ctax"><option selected value="0">0%</option><option value="1">1%</option><option value="5">5%</option><option value="10">10%</option></select></td> <td id="cgstamount_' + curTot + '"></td><td><select id="sgstrate_' + curTot + '" class="sgstrate form-control stax"><option selected value="0">0%</option><option vallue="1">1%</option><option value="5">5%</option><option value="10">10%</option></select></td><td id="sgstamount_' + curTot + '"></td><td id="total_' + curTot + '"></td></tr>';
  $("#tdata").append(xString);
  $("#desc_" + curTot).focus();
}

function removeRow(id) {
  if ($(".itemrow").length > 1) {
    $("#trid_" + id).fadeOut(200, function () {
      $("#trid_" + id).remove();
      loopIt();
    });

  }
  else {
    alert("Sorry!!! Atleast one item is required");
  }
}

function loopIt() {
  var serialno = 0;
  var grandtot = 0;
  var amountbeforetax = 0;

  var totalcgst = 0;
  var totalsgst = 0;


  $(".itemrow").each(function () {
    var tot = '';

    serialno++;

    var row = $(this);
    var dataid = row.attr('data');

    row.children('.slnocls').html(serialno);

    var quantity = row.find('.qnty').val();
    var amount = row.find('.amount').val();
    var discount = row.find('.discount').val();
    var cgstrate = parseFloat(row.find('.cgstrate').val());
    var sgstrate = parseFloat(row.find('.sgstrate').val());


    if (quantity != "" && amount != "") {
      tot = (parseFloat(quantity) * parseFloat(amount));
      if (discount != "") {
        tot = tot - parseFloat(discount);
      }

      // Taxable Amount
      $("#taxablevalue_" + dataid).html(tot.toFixed(2));

      // CGST Amount
      var cgstamount = (tot * cgstrate) / 100;
      $("#cgstamount_" + dataid).html(cgstamount.toFixed(2));

      // SGST Amount
      var sgstamount = (tot * sgstrate) / 100;
      $("#sgstamount_" + dataid).html(sgstamount.toFixed(2));

      // Item Total

      var itemtotal = tot + cgstamount + sgstamount;
      $("#total_" + dataid).html(itemtotal.toFixed(2));
      
      amountbeforetax += tot;
      totalcgst += cgstamount;
      totalsgst += sgstamount;
      grandtot += itemtotal;
    }

  });

  if (grandtot != 0) {
    $('#invoiceBtn').show();
  }
  else {
    $('#invoiceBtn').hide();
    $("#inwords").html('');
  }

  $("#amountbeforetax").html('$' + amountbeforetax.toFixed(2));
  $("#totalcgst").html('$' + totalcgst.toFixed(2));
  $("#totalsgst").html('$' + totalsgst.toFixed(2));
  $("#grandtotal").html('$' + grandtot.toFixed(2));


  // Total Tax
  var totaltax = totalcgst + totalsgst;
  $("#totaltax").html('$' + totaltax.toFixed(2));

}

function generateInvoice() {
  $('#invoiceBtn').hide();
  $('#removeBtn').hide();
  let file_name = new Date().getTime();
  const targetElement = document.getElementById('billContainer');
  html2pdf(targetElement, {
    margin: 10,
    filename: file_name,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
  });
  $('#removeBtn').show();
};
