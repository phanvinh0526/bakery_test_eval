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
 *      Updated 25/03/2019 - Version 0.0.2 - Update inappropriate inputs & attemp various test cases
 * 
*************************************************************************************/


 /* Global Variables */
var vs_val  = new Array();
var vs_id   = new Array();
var mb_val  = new Array();
var mb_id   = new Array();
var cf_val  = new Array();
var cf_id   = new Array();
var vs_p =  new Array();
var mb_p =  new Array();
var cf_p =  new Array();

 /* Initial Values Added */
vs_val.push(5); vs_id.push(0);
vs_val.push(3); vs_id.push(0);
mb_val.push(8); mb_id.push(0);
mb_val.push(5); mb_id.push(0);
mb_val.push(2); mb_id.push(0);
cf_val.push(9); cf_id.push(0);
cf_val.push(5); cf_id.push(0);
cf_val.push(3); cf_id.push(0);
vs_p.push(8.99); vs_p.push(6.99);
mb_p.push(24.95); mb_p.push(16.95); mb_p.push(9.95);
cf_p.push(16.99); cf_p.push(9.95); cf_p.push(5.95);
 
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
function recursive_alg(arr_val, arr_id, maxItems, cursor=0){
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
                recursive_alg(arr_val, arr_id, maxItems-arr_val[i], i);
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
// Testings
//----------------------------------
// recursive_alg(vs_val, vs_id, 10, 0);
// recursive_alg(mb_val, mb_id, 14, 0);
// recursive_alg(cf_val, cf_id, 13, 0);

//----------------------------------
// Prep-function
//----------------------------------
function reset_arr_id(arr, default_val){
    for(let i=0; i<arr.length; i++){
        arr[i] = default_val;
    }
    return arr;
}

function check_alg_error(arr_id){
    for(let i=0; i<arr_id.length; i++){
        if(arr_id[i] != 0){ return false; }
    }
    return true
}

function order_optimization(iMap, msg){
    // Reset parameters
    vs_id = reset_arr_id(vs_id, 0);
    mb_id = reset_arr_id(mb_id, 0);
    cf_id = reset_arr_id(cf_id, 0);
    msg = new Array();
    let res = new Array();

    // Optimise each item / run
    if(iMap.get('VS5')  != 0){ 
        recursive_alg(vs_val, vs_id, iMap.get('VS5'), 0); 
        let col = new Array(5);
        col[4] = vs_p;
        col[3] = vs_id;
        col[2] = vs_val;
        col[1] = Array(vs_id.length).fill("VS5");
        col[0] = Array(vs_id.length).fill("Vegemite Scroll");
        res.push(col);
        if(check_alg_error(vs_id)){
            msg.push('The number of Vegemite Scroll is not fit our available packs!');
        }
    }
    if(iMap.get('MB11') != 0){ 
        recursive_alg(mb_val, mb_id, iMap.get('MB11'), 0); 
        let col = new Array(5);
        col[4] = mb_p;
        col[3] = mb_id;
        col[2] = mb_val;
        col[1] = Array(mb_id.length).fill("MB11");
        col[0] = Array(mb_id.length).fill("Blueberry Muffin");
        res.push(col);
        if(check_alg_error(vs_id)){
            msg.push('The number of Blueberry Muffin is not fit our available packs!');
        }
    };
    if(iMap.get('CF')   != 0){ 
        recursive_alg(cf_val, cf_id, iMap.get('CF'), 0); 
        let col = new Array(5);
        col[4] = cf_p;
        col[3] = cf_id;
        col[2] = cf_val;
        col[1] = Array(cf_id.length).fill("CF");
        col[0] = Array(cf_id.length).fill("Croissant");
        res.push(col);
        if(check_alg_error(vs_id)){
            msg.push('The number of Croissant is not fit our available packs!');
        }
    };
    console.log(res);
    return res;
}