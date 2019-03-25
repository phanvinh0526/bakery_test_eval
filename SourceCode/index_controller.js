/*************************************************************************************
 * Bakery Test Eval @ Rubix
 * 
 * Author:  Vinh Phan  |  Updated by: 25/03/2019 | Version: 0.0.2
 * 
 * Description:
 *      Determind the cost and pack breakdown for each product, so that
 *      the shipping space each order shoul contain the minimal number of packs
 * 
 * Update History:
 *      Updated 14/03/2019 - Version 0.0.1 - Initial development
 *      Updated 25/03/2019 - Version 0.0.2 - Update Order inputs & Customize interfaces (Order & Result forms)
 * 
*************************************************************************************/

/***************************************************
 *             Global Variables
 **************************************************/
var iMap = new Map();
    iMap.set('VS5', 0);
    iMap.set('MB11', 0);
    iMap.set('CF', 0);
// var maxRows = 8; let maxCols = 4;
var RES = new Array();
var MSG = new Array();

/***************************************************
 *                 Functions
 **************************************************/
function deleteTableRow(oButton){
    document.getElementById("selected-table").deleteRow(oButton.parentNode.parentNode.rowIndex);
    
}

function prepare_output_table(arr_val, arr_id, arr_p){
    let str = '';
    let totalCost = 0;

    for(let i=0; i<arr_val.length; i++){
        if(arr_id[i] != 0){
            str += '<tr><th scope="row">'+arr_val[i]+'</th>';
            str += '<td>'+arr_p[i]+'</td>';
            str += '<td>'+arr_id[i]+'</td>';
            str += '<td>'+(arr_id[i] * arr_p[i]).toFixed(2)+'</td></tr>';
            totalCost += (arr_id[i] * arr_p[i]);
        }
    }
    // Add summary line
    str += '<tr><td colspan="3">Total Costs</td><td>$'+totalCost.toFixed(2)+'</td></tr>';
    return str;
}

function submit_order_func(){
    // Reset iMap variable
    iMap = reset_func(iMap, 0);
    // Process
    let tbl_rows = document.getElementById('selected-table').rows;
    for(let i=1; i<tbl_rows.length; i++){
        let iCode = tbl_rows[i].cells[1].innerHTML;
        if(iMap.get(iCode) != undefined){
            iMap.set(iCode, iMap.get(iCode) + Number(tbl_rows[i].cells[2].innerHTML));
        }else{
            console.log("Items: ",iCode," is not available in product list!");
        }
    }
    console.log(iMap);
}

function reset_func(v, va){
    for(let k of v.keys()){
        v.set(k, va);
    }
    return v;
}

function Confirm(title, msg, $true, $false, $link) { 
    let $content =  "<div class='dialog-ovelay'>" +
                    "<div class='dialog'><header>" +
                     " <h3> " + title + " </h3> " +
                     "<i class='fa fa-close'></i>" +
                 "</header>" +
                 "<div class='dialog-msg'>" +
                     " <p> " + msg + " </p> " +
                 "</div>" +
                 "<footer>" +
                     "<div class='controls'>" +
                         " <a class='btn btn-danger pagescroll doAction' href='"+$link+"'>" + $true + "</a> " +
                         " <a class='btn btn-default cancelAction'>" + $false + "</a> " +
                         "<div id='loader'></div>" +
                     "</div>" +
                 "</footer>" +
              "</div>" +
            "</div>";
    $('body').prepend($content);
    
}

function display_table_result(res, msg){
    let tbl = document.getElementById("table-result");
    // Reset result table
    let tbl_rows = tbl.rows.length;
    for(let i = 1; i < tbl_rows; i++){
        tbl.deleteRow(1);
    }
    document.getElementById("table-error").style.display = "none";

    // Insert results to table
    for(let i=0; i< res.length; i++){
        for(let j=0; j < res[i][0].length; j++){
            if(res[i][3][j] != 0){
                let row = tbl.insertRow(1);
                row.insertCell(0).innerHTML = res[i][0][j]; // Item
                row.insertCell(1).innerHTML = res[i][1][j]; // Code
                row.insertCell(2).innerHTML = res[i][2][j]; // Pack
                row.insertCell(3).innerHTML = res[i][3][j]; // Qty
                row.insertCell(4).innerHTML = res[i][4][j]; // Price
                row.insertCell(5).innerHTML = (res[i][4][j] * res[i][3][j]).toFixed(2); // Sub Total
            }
        }
    }

    // Display errors if applicable
    if(msg.length > 0){
        let str = '';
        for(let i=0; i<msg.length; i++){
            str += msg[i] + '<br/>';
        }
        document.getElementById("table-error").html = str;
        document.getElementById("table-error").style.display = "block";
    }
    
}


/*************************************************
*      Main Function / Events Handeling
**************************************************/
$(document).ready(function(){
    
    // Enable / Disable btn
    $("#select-btn-add").prop("disabled", true)
    $("#btn-submit-order").prop("disabled", true)

    // Catch change combobox
    $("#select-item").change(function(){
        if($("#select-item").find("option:selected").val() != -1){
            $("#select-btn-add").prop("disabled", false)
            $("#btn-submit-order").prop("disabled", false)
        }else{
            $("#select-btn-add").prop("disabled", true)
            $("#btn-submit-order").prop("disabled", true)
        }
    })

    // Catch select-btn-add "CLICK" event
    $("#select-btn-add").click(function(){
        let selectedItem = $("#select-item").find("option:selected"); 
        var selectedQty = $("#select-quantity");

        // Check not a number input
        if(!selectedQty.val()){
            console.log("Quantity input is not a numeric!");
            return;
        }

        // Insert a new row to selected table
        let selectedTbl = document.getElementById("selected-table");
        let tmpRow = selectedTbl.insertRow(1);
        tmpRow.insertCell(0).innerHTML = selectedItem.text();
        tmpRow.insertCell(1).innerHTML = selectedItem.val();
        tmpRow.insertCell(2).innerHTML = selectedQty.val();
        let tmpStr = '<button type="button" class="btn btn-danger" onclick="deleteTableRow(this)">';
            tmpStr += '<i class="fa fa-trash" aria-hidden="true"></i></button>';
        tmpRow.insertCell(3).innerHTML = tmpStr;

    });

    // Process form "submit order"
    $('#btn-submit-order').click(function () {
        // Confirm
        Confirm('Order Confirmation', 'Are you sure you want to make the order?', 'Yes', 'Cancel', "#result-section"); /*change*/
    
        // Event handle
        $('.doAction').click(function () {
            // FIRST: Submit order to "bakery_order_process.js" - Single Page App
            submit_order_func();
    
            // SECOND: Optimise the packs to minimize delivery costs
            RES = order_optimization(iMap, MSG);
    
            // THIRD: Display the results
            display_table_result(RES, MSG);
    
            $(this).parents('.dialog-ovelay').fadeOut(500, function () {
            $(this).remove();
            });
        });
        $('.cancelAction, .fa-close').click(function () {
            $(this).parents('.dialog-ovelay').fadeOut(500, function () {
            $(this).remove();
            });
        });
    });

});

