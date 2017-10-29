var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
var partyDetailArray = null;
var selectPersonDetail;
var itemDetailArray = null;
var profileDataArray = null;
var selectItemDetail;
var totalSaleAmount = parseInt(0);

angular.module('app.controllers', [])
  
.controller('menuCtrl', ['$scope', '$stateParams', '$state' , // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state) {

    profileDataArray = getProfileData();
    setTimeout(function(){$scope.profileName = profileDataArray[0]['businessName'].toUpperCase();},100);

}])
   
.controller('dashboardCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    // profileDataArray = getProfileData();
    db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS allParties (name, phoneno, gstno, address, emailid)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS allItems (itemname, itemcode, itemhsn, itemsaleprice, itempurchaseprice, itemgsttax)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS profileData (profilename, businessname, profilegstno, profileaddress, profilephoneno)');
    });

}])
   
.controller('addPartyCtrl', ['$scope', '$stateParams',
// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    $scope.addParty=function(party){
        db.transaction(function (tx) {
             tx.executeSql('INSERT INTO allParties (name, phoneno, gstno, address, emailid) VALUES ("'+toTitleCase(party.name)+'","'+party.phone+'","'+party.gst+'","'+toTitleCase(party.address)+'","'+party.emailid+'")');
        });
        partyDetailArray = getDbData();
        window.plugins.toast.show('Party Added Successfully!', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
        document.getElementById("addPartyForm").reset();
        setTimeout(getAllParties,200);
    }
}])
      
.controller('transactionCtrl', ['$scope', '$stateParams','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicPopup) {

    //////////////////////Getting PartyNames//////////////////////////////

    $scope.partyName = 'Select Party Name';
    
    partyDetailArray = getDbData();     //In transaction page variable used.

    itemDetailArray = getDbItemData();

    $scope.getPartyNames=function(){

        partyNameOption = '<option value="Select Party Name">Select Party Name</option>';

        for(var i=0;i<partyDetailArray.length;i++){
            partyNameOption += '<option id="'+partyDetailArray[i]["gstno"]+'">'+partyDetailArray[i]["name"]+'</option>';
        }

        var myPopup = $ionicPopup.show({
            template: '<select id="selectPartyName" class="selectPartyName">'+partyNameOption+'</select><br><br><br><div id="setPartyDetail"></div>',
            title: 'Select Party',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        selectPersonDetail = [];
                        var id = $('.selectPartyName option:selected').attr('id');
                        for(var i=0;i<partyDetailArray.length;i++){
                            if(partyDetailArray[i]['gstno'] == id){
                                selectPersonDetail = partyDetailArray[i];
                            }
                        }
                        $scope.partyName = document.getElementById("selectPartyName").value;
                    }
                }
            ]
        });

        setTimeout( function(){ 
            $(".selectPartyName").select2();
            $('.selectPartyName').change(function(){
                var id=($(this).find('option:selected').attr('id'));
                selectPersonDetail = [];
                for(var i=0;i<partyDetailArray.length;i++){
                    if(partyDetailArray[i]['gstno'] == id){
                        selectPersonDetail = partyDetailArray[i];
                        var setPartyDetail = "Mobile Number : "+selectPersonDetail.phoneno;
                        setPartyDetail += "<br>GST No. : "+selectPersonDetail.gstno;
                        if(selectPersonDetail.address != 'undefined' && selectPersonDetail.emailid != 'undefined'){
                            setPartyDetail += "<br>Address : "+selectPersonDetail.address;
                            setPartyDetail += "<br>Email Id : "+selectPersonDetail.emailid;
                        }
                        document.getElementById("setPartyDetail").innerHTML = setPartyDetail;
                    }
                }
            });
        }  , 10 );
    }

    //////////////////////Getting ItemNames//////////////////////////////

    $scope.itemName = 'Select Items';

    $scope.getItems=function(){
        itemOption = '';

        for(var i=0;i<itemDetailArray.length;i++){
            itemOption += '<option id="'+itemDetailArray[i]["hsn"]+'">'+itemDetailArray[i]["name"]+'</option>';
        }

        var myPopup = $ionicPopup.show({
            template: '<select id="selectedItem" multiple="multiple">'+itemOption+'</select><div id="setSelectItem"></div>',
            title: 'Enter Item Details',
            scope: $scope,
            buttons: [
            { text: 'Cancel' },
            {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    var selectedItemNames = '';
                    var selectedItems=[];
                    $('#selectedItem option:selected').each(function() {
                        selectedItemNames += $(this).val() + ", ";
                        selectedItems.push($(this).attr('id'));
                    });
                    $scope.itemName = selectedItemNames;
                    selectItemDetail = [];
                    for(var i=0;i<selectedItems.length;i++){
                        for(var j=0;j<itemDetailArray.length;j++){
                            if(itemDetailArray[j]['hsn'] == selectedItems[i]){
                                selectItemDetail.push(itemDetailArray[j]);
                                console.log(selectItemDetail)
                            }
                        }
                    }
                    totalSaleAmount += calcTotalAmount()
                    document.getElementById("calcTotalAmount").value = "Only "+totalSaleAmount+ " Rs";
                }
            }
            ]
        });
        
        setTimeout( function(){ 
            $("#selectedItem").select2();
            $('#selectedItem').change(function(){
                var selectedItems=[];
                $('#selectedItem option:selected').each(function() {
                    selectedItems.push($(this).attr('id'));
                });
                var setItemDetail = '<table id="selectItemTable"><tr><th>Item Name</th><th>Quantity</th></tr>';
                selectItemDetail = [];
                for(var i=0;i<selectedItems.length;i++){
                    for(var j=0;j<itemDetailArray.length;j++){
                        if(itemDetailArray[j]['hsn'] == selectedItems[i]){
                            selectItemDetail.push(itemDetailArray[j]);
                            console.log(selectItemDetail)
                            setItemDetail += "<tr><td>"+selectItemDetail[i]['name']+'</td><td><input class="setItemQty" type="number" id="'+selectItemDetail[i]['hsn']+'qty"</td></tr>';
                        }
                    }
                }
                setItemDetail += "</table>"
                document.getElementById("setSelectItem").innerHTML = setItemDetail;
            });
        }  , 10 );
    }
    

}])
   
.controller('itemsCtrl', ['$scope', '$stateParams', '$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicPopup) {

    itemDetailArray = getDbItemData();

    setTimeout(getAllItems,100);

    editItem=function(){

        var editItemId = ($(".editItem").attr('id'));

        var editItemDetail;

        for(var i=0;i<itemDetailArray.length;i++){
            if(itemDetailArray[i]['hsn'] == editItemId){
                editItemDetail=itemDetailArray[i];
            }
        }
        
        var myPopup = $ionicPopup.show({
            template: `<label class="item item-input">
        <span class="input-label">Item Name*</span>
        <input id="editItemName" type="text" placeholder="Item Name" value="`+editItemDetail.name+`"required>
      </label>
      <label class="item item-input">
        <span class="input-label">Item Code / Barcode*</span>
        <input id="editItemCode" type="text" placeholder="Item Code / Barcode" value="`+editItemDetail.itemCode+`" required>
      </label>
      <label class="item item-input">
        <span class="input-label">HSN/SAC Code*</span>
        <input id="editItemHsn" type="text" placeholder="HSN/SAC Code" value="`+editItemDetail.hsn+`" required>
      </label>
      <label class="item item-input">
        <span class="input-label">Sale Price (In INR)*</span>
        <input id="editItemSalePrice" type="number" placeholder="Sale Price (In INR)" value="`+editItemDetail.salePrice+`" required>
      </label>
      <label class="item item-input">
        <span class="input-label">Purchase Price (In INR)*</span>
        <input id="editItemPurchasePrice" type="number" placeholder="Purchase Price (In INR)" value="`+editItemDetail.purchasePrice+`" required>
      </label>
      <label class="item item-select">
        <span class="input-label">Tax (GST)*</span>
        <select id="editItemGstTax" required>
          <option value="0">GST@0%</option>
          <option value="0.25">GST@0.25%</option>
          <option value="3">GST@3%</option>
          <option value="5">GST@5%</option>
          <option value="12">GST@12%</option>
          <option value="18">GST@18%</option>
          <option value="28">GST@28%</option>
        </select>
      </label>`,
            title: 'Edit Item',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        var editedItem = {
                            name:document.getElementById("editItemName").value,
                            itemCode:document.getElementById("editItemCode").value,
                            hsn:document.getElementById("editItemHsn").value,
                            salePrice:document.getElementById("editItemSalePrice").value,
                            purchasePrice:document.getElementById("editItemPurchasePrice").value,
                            gstTax:document.getElementById("editItemGstTax").value
                        }
                        db.transaction(function (tx) {
                            var query = 'UPDATE allItems set itemname=?,itemcode=?,itemhsn=?,itemsaleprice=?'+
                                ',itempurchaseprice=?,itemgsttax=? WHERE itemhsn=?;';
                            tx.executeSql(query,[toTitleCase(editedItem.name),editedItem.itemCode,editedItem.hsn,editedItem.salePrice
                                ,editedItem.purchasePrice,editedItem.gstTax,editItemId]);
                        });
                        itemDetailArray = getDbItemData();
                        setTimeout(getAllItems,200);
                    }
                }
            ]
        });
    }

}])
   
.controller('taxListCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('allPartiesCtrl', ['$scope', '$stateParams', '$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicPopup) {

    partyDetailArray = getDbData();

    setTimeout(getAllParties,100);

    editParty=function(){

        var editPartyId = ($(".editParty").attr('id'));

        var editPartyDetail;

        for(var i=0;i<partyDetailArray.length;i++){
            if(partyDetailArray[i]['gstno'] == editPartyId){
                editPartyDetail=partyDetailArray[i];
            }
        }
        
        var myPopup = $ionicPopup.show({
            template: `<label class="item item-input">
        <span class="input-label">Name*</span>
        <input id="editName" type="text" placeholder="Name*" value="`+editPartyDetail.name+`"required>
      </label>
      <label class="item item-input">
        <span class="input-label">Phone Number (10 Digits)*</span>
        <input id="editPhone" type="number" placeholder="Phone Number (10 Digits)*" ng-minlength="10" ng-maxlength="10" maxlength="10" value="`+editPartyDetail.phoneno+`" required>
      </label>
      <label class="item item-input">
        <span class="input-label">GSTIN Number*</span>
        <input id="editGst" type="text" placeholder="GSTIN Number*" value="`+editPartyDetail.gstno+`" required>
      </label>
      <label class="item item-input">
        <span class="input-label">Address (Optional)</span>
        <input id="editAddress" type="text" placeholder="Address (Optional)" value="`+editPartyDetail.address+`">
      </label>
      <label class="item item-input">
        <span class="input-label">Email Id (Optional)</span>
        <input id="editEmail" type="email" placeholder="Email Id (Optional)" value="`+editPartyDetail.emailid+`">
      </label>`,
            title: 'Select Party',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
                        var editedParty = {
                            name:document.getElementById("editName").value,
                            phoneno:document.getElementById("editPhone").value,
                            gstno:document.getElementById("editGst").value,
                            address:document.getElementById("editAddress").value,
                            emailid:document.getElementById("editEmail").value
                        }
                        db.transaction(function (tx) {
                            var query = 'UPDATE allParties set name=?,phoneno=?,gstno=?,address=?'+
                                ',emailid=? WHERE gstno=?;';
                            tx.executeSql(query,[toTitleCase(editedParty.name),editedParty.phoneno,editedParty.gstno,toTitleCase(editedParty.address)
                                ,editedParty.emailid,editPartyId]);
                        });
                        partyDetailArray = getDbData();
                        setTimeout(getAllParties,200);
                    }
                }
            ]
        });
    }

}])
   
.controller('settingsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('addItemCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    db = openDatabase('mydb', '1.0', 'Test DB', 10 * 1024 * 1024);

    $scope.addItem=function(item){
        db.transaction(function (tx) {
             tx.executeSql('INSERT INTO allItems (itemname, itemcode, itemhsn, itemsaleprice, itempurchaseprice, itemgsttax) VALUES ("'+toTitleCase(item.name)+'","'+item.itemCode+'","'+item.hsn+'","'+item.salePrice+'","'+item.purchasePrice+'","'+item.gstTax+'")');
        });
        window.plugins.toast.show('Item Added Successfully!', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
        document.getElementById("addItem-form3").reset();
        itemDetailArray = getDbItemData();
        setTimeout(getAllItems,200);
    }

}])
   
.controller('profileCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {

    profileDataArray = getProfileData();
    
    setTimeout(function(){
        if(profileDataArray.length == 1){
            document.getElementById("profileName").value = profileDataArray[0]['profileName'];
            document.getElementById("profileBusinessName").value = profileDataArray[0]['businessName'];
            document.getElementById("profileGstNo").value = profileDataArray[0]['gstNo'];
            document.getElementById("profileAddress").value = profileDataArray[0]['address'];
            document.getElementById("profilePhoneNo").value = profileDataArray[0]['phoneNo'];
        }
    },200);

    $scope.saveProfile=function(profile){
        if(profileDataArray.length == 0){
            console.log("under 0")
            db.transaction(function (tx) {
                tx.executeSql('INSERT INTO profileData (profilename, businessname, profilegstno, profileaddress, profilephoneno) VALUES ("'+toTitleCase(profile.profileName)+'","'+toTitleCase(profile.businessName)+'","'+profile.gstNo+'","'+toTitleCase(profile.address)+'","'+profile.phoneNo+'")');
            });
            window.plugins.toast.show('Profile Saved Successfully!', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
        }else{
            db.transaction(function (tx) {
                var query = 'UPDATE profileData set profilename=?,businessname=?,profilegstno=?,profileaddress=?'+
                    ',profilephoneno=? WHERE rowid=?';
                tx.executeSql(query,[toTitleCase(profile.profileName),toTitleCase(profile.businessName),profile.gstNo,toTitleCase(profile.address)
                    ,profile.phoneNo,1]);
            });
            window.plugins.toast.show('Profile Updated Successfully!', 'long', 'center', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
        }
    }

}])