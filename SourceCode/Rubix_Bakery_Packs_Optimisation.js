/*************************************************************************************
 * Bakery Test Eval @ Rubix
 * 
 * Author:  Vinh Phan  |  Updated by: 14/03/2019 | Version: 0.0.1
 * 
 * Description:
 *      Determind the cost and pack breakdown for each product, so that
 *      the shipping space each order shoul contain the minimal number of packs
 * 
 * Update History:
 *      Version 0.0.1 - Initial development
 * 
*************************************************************************************/

 /* Global Variables */
var vs_val  = new Array();
var vs_id   = new Array();
var mb_val  = new Array();
var mb_id   = new Array();
var cf_val  = new Array();
var cf_id   = new Array();
 
/* Initial Values Added */
vs_val.push(5); vs_id.push(0);
vs_val.push(3); vs_id.push(0);
mb_val.push(8); mb_id.push(0);
mb_val.push(5); mb_id.push(0);
mb_val.push(2); mb_id.push(0);
cf_val.push(9); cf_id.push(0);
cf_val.push(5); cf_id.push(0);
cf_val.push(3); cf_id.push(0);


/*******************************************
    Recursive func to find minimal packs
Input:
    @arr_val: pack types of the product
    @arr_id:  number of packs (default: 0)
    @maxItems: number of items requires packing
    @cursor:  internal parameter (default: 0)

Output:
    @arr_id: number of packs to pack items

*******************************************/
function recursive_packs(arr_val, arr_id, maxItems, cursor=0){
    let idx = -1, indicator = false, terminated = false;
    if(cursor == arr_id.length){
        return;
    }
    else{
        for(let i=cursor; i < arr_id.length; i++){
            indicator = false;
            if(arr_val[i] <= maxItems){
                indicator = true;
            }
            if(indicator == true){
                recursive_packs(arr_val, arr_id, maxItems-arr_val[i], i);
                idx = i;
            }
            // BEGIN: Check termination
            if(idx != -1){
                let tmp = 0;
                for(let x=0; x < arr_id.length; x++){
                    tmp += arr_val[x] * arr_id[x];
                }
                if((tmp + arr_val[idx]) == maxItems){
                    terminated = true;
                    break;
                }
            }
            // END: Check termination
        }
        if(idx != -1 && terminated == true){
            arr_id[idx] += 1;
        }
    }
} 

//----------------------------------
// Find minimal packs
//----------------------------------
recursive_packs(vs_val, vs_id, 10, 0);
recursive_packs(mb_val, mb_id, 14, 0);
recursive_packs(cf_val, cf_id, 13, 0);

// console.log(vs_id);
// console.log(mb_id);
// console.log(cf_id);
 
 
 
/***********************************************************
    Code processing / controlling homepage
    1.  Navigation
    2.  Pre-processing samples

***********************************************************/

// Define cost / pack / product
var vs_p =  new Array();
var mb_p =  new Array();
var cf_p =  new Array();
vs_p.push(8.99); vs_p.push(6.99);
mb_p.push(24.95); mb_p.push(16.95); mb_p.push(9.95);
cf_p.push(16.99); cf_p.push(9.95); cf_p.push(5.95);


$(document).ready(function(){

    $('#data-vs').on("click", function(){
        $('#table-render').hide();
        let str = prepare_output_table(vs_val, vs_id, vs_p);
        $("#table-replacement").html(str);
        $('#table-render').show("medium");
    });
    $('#data-mb').on("click", function(){
        $('#table-render').hide();
        let str = prepare_output_table(mb_val, mb_id, mb_p);
        $("#table-replacement").html(str);
        $('#table-render').show("medium");
    });
    $('#data-cf').on("click", function(){
        $('#table-render').hide();
        let str = prepare_output_table(cf_val, cf_id, cf_p);
        $("#table-replacement").html(str);
        $('#table-render').show("medium");
    });

});

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

