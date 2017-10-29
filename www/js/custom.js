function getDbData(){
    var partyArray = [];
    db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM allParties', [], function (db, results) {
            var len = results.rows.length, i;
            for (i = 0; i < len; i++) {
                var partyArrayInside = [];
                partyArrayInside.push({name:results.rows.item(i).name,
                    phoneno:results.rows.item(i).phoneno,
                    gstno:results.rows.item(i).gstno,
                    address:results.rows.item(i).address,
                    emailid:results.rows.item(i).emailid});
                partyArray.push(partyArrayInside[0]);
            } 
        });
    });
    return partyArray;
}
function getDbItemData(){
    var itemArray = [];
    db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM allItems', [], function (db, results) {
            var len = results.rows.length, i;
            for (i = 0; i < len; i++) {
                var itemArrayInside = [];
                itemArrayInside.push({name:results.rows.item(i).itemname,
                    itemCode:results.rows.item(i).itemcode,
                    hsn:results.rows.item(i).itemhsn,
                    salePrice:results.rows.item(i).itemsaleprice,
                    purchasePrice:results.rows.item(i).itempurchaseprice,
                    gstTax:results.rows.item(i).itemgsttax});
                itemArray.push(itemArrayInside[0]);
            } 
        });
    });
    return itemArray;
}
function getProfileData(){
    var profileArray = [];
    db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM profileData', [], function (db, results) {
            var len = results.rows.length, i;
            for (i = 0; i < len; i++) {
                var profileArrayInside = [];
                profileArrayInside.push({profileName:results.rows.item(i).profilename,
                    businessName:results.rows.item(i).businessname,
                    gstNo:results.rows.item(i).profilegstno,
                    address:results.rows.item(i).profileaddress,
                    phoneNo:results.rows.item(i).profilephoneno});
                profileArray.push(profileArrayInside[0]);
            } 
        });
    });
    return profileArray;
}
function getAllParties(){
    var data = '';
    for(var i=0;i<partyDetailArray.length;i++){
        data += '<ion-item id="'+partyDetailArray[i]['gstno']+
        '" class="item-icon-right item editParty" onclick="editParty()">'+partyDetailArray[i]['name']+
        '<i class="icon ion-edit"></i></ion-item>';
    }
    $("#allParties-list2").html(data);
}
function getAllItems(){
    var data = '';
    for(var i=0;i<itemDetailArray.length;i++){
        data += '<ion-item id="'+itemDetailArray[i]['hsn']+
        '" class="item-icon-right item editItem" onclick="editItem()">'+itemDetailArray[i]['name']+
        '<i class="icon ion-edit"></i></ion-item>';
    }
    $("#allItemslist").html(data);
}
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
function calcTotalAmount(){
    var totalAmount = parseInt(0);
    for(var i=0;i<selectItemDetail.length;i++){
        var qty = parseInt(document.getElementById(selectItemDetail[i]['hsn']+"qty").value);
        console.log(qty)
        totalAmount += parseInt(selectItemDetail[i]['salePrice']) * qty;
    }
    return totalAmount;
}