/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var fileEntryMain;
var logEnabled = true;
function debugLog(logStr)
{
        if(logEnabled)
        {
        console.log(logStr);
        }
}

var sessionObject = {

    emailAddress: "",
    tokenStr: "",
    databaseString : ""
}



var app = {

    satSlider: null,
    perfSlider: null,
    motivationSlider: null,
    moodSlider: null,
    userId: null,
    tokenStr: null,
    databaseString:null,
    pictureSource: null,
    destinationType: null,
    fileSystemObject: null,
    fileURLLink: null,
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },


    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady,
            false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'

    init: function()
    {
        var windowHeight = screen.height;
        $("#fixedMenuBottom").css("top",windowHeight-100);
        $("#fixedMenuBottom").css("left",0);
      
      
        try {
            app.pictureSource = navigator.camera.PictureSourceType;
            app.destinationType = navigator.camera.DestinationType;
        } catch (err) {
            //alert(err.message);
            debugLog(err);
        }
        
        $('#datePickerDOB').pickadate({
            selectMonths: true,
            selectYears: true
        })

        $('#datePickerStartDate').pickadate({
            selectMonths: true,
            selectYears: true
        })
        
         $("#userImgSelect").click(function () {
            app.getPhoto(app.pictureSource.PHOTOLIBRARY);
        });
        
        $("#btnLogin").click(function () {
            debugLog("Logging In");
            app.uppiddee_login();

        });
        

         $("#btnCreateProfile").click(function () {
            debugLog("Clicked Create Profile");
             
            var firstNameValue = $("#firstNameInput").val();
            var lastNameValue = $("#lastNameInput").val();
            var dobValue = $("#datePickerDOB").val();
            var genderValue = $('#genderDD').find(":selected").val();
            var teamValue = $('#teamDD').find(":selected").val();
            var startDateValue = $("#datePickerStartDate").val();
            var relationshipValue = $('#relationshipDD').find(":selected").val();
            var noOfChildrenValue = $("#noOfChildrenInput").val();
             
            app.uppiddee_createprofile(sessionObject.databaseString,firstNameValue,lastNameValue,dobValue,genderValue,teamValue,startDateValue,relationshipValue,noOfChildrenValue);

        });
        
        
        $("#btnSignUp").click(function () {
            var emailAddress = $("#emailInput").val();
            var passwordText = $("#passwordInput").val();
            var passwordTextConfirm = $("#passwordInputConfirm").val();
             
            if(passwordText == passwordTextConfirm)
            {
                var selectedDBID = $('#companiesDD').find(":selected").attr("databaseID");
                var selectedCompanyID = $('#companiesDD').find(":selected").attr("companyID");
                debugLog("Signup Clicked with IDs",selectedCompanyID,selectedDBID);

                //Make call to get the selected database string
                $.when(app.uppiddee_getDatabaseString(selectedDBID,selectedCompanyID)).done(function(dataReturned,status,jqXHRObj){

                debugLog(dataReturned);
                debugLog(status);
                debugLog(jqXHRObj);

                //Make call to get the authorization token 
                $.when(app.uppiddee_getToken(emailAddress,passwordText)).done(function(dataReturned,status,jqXHRObj){

                        //Make call to do the signup
                        $.when(app.uppiddee_signup(sessionObject.databaseString,emailAddress,passwordText)).done(function(dataReturned,status,jqXHRObj){

                        });
                    });

                 });
            }
        });

        $("#btnLogFeedback").click(function () {
            ////alert("button clicked");
            app.uppiddee_logfeedback();

        });

        $("#btnLogout").click(function () {
            ////alert("button clicked");
            $("#loginSection").show();
            $("#feedbackSection").hide();
            $("#btnLogin").html("Login");
            window.localStorage.removeItem("uppiddee_token");
        });

                var satValueChanged = function () {
            $("#satisfactionValue").html(app.satSlider.slider('getValue'));
        };
        var perfValueChanged = function () {
            $("#performanceValue").html(app.perfSliderSlider.slider('getValue'));
        };
        var motivationValueChanged = function () {
            $("#motivationValue").html(app.motivationSliderSlider.slider('getValue'));
        };
        var moodValueChanged = function () {
            $("#moodValue").html(app.moodSlider.slider('getValue'));
        };

        try {
            app.satSlider = $('#satisfactionSlider').slider({
                tooltip: 'hide'
            }).on('slide', satValueChanged);
            app.perfSlider = $('#peformanceSlider').slider({
                tooltip: 'hide'
            }).on('slide', perfValueChanged);
            app.motivationSlider = $('#motivationSlider').slider({
                tooltip: 'hide'
            }).on('slide', motivationValueChanged);
            app.moodSlider = $('#moodSlider').slider({
                tooltip: 'hide'
            }).on('slide', moodValueChanged);

            var interval;
            $(".sliderIconLeft").bind('touchstart mousedown', function () {

                //interval = setInterval(increaseLeftArrow, 100);

                debugLog("Doing left");

                var sliderID = $(this).parent().find("input").attr('id');

                if (sliderID == "satisfactionSlider") {
                    app.satSlider.slider('setValue', app.satSlider.slider('getValue') - 1);
                    $("#satisfactionValue").html(app.satSlider.slider('getValue'));
                } else if (sliderID == "peformanceSlider") {
                    app.perfSlider.slider('setValue', app.perfSlider.slider('getValue') - 1);
                    $("#performanceValue").html(app.perfSlider.slider('getValue'));
                } else if (sliderID == "motivationSlider") {
                    app.motivationSlider.slider('setValue', app.motivationSlider.slider('getValue') - 1);
                    $("#motivationValue").html(app.motivationSlider.slider('getValue'));
                } else if (sliderID == "moodSlider") {
                    app.moodSlider.slider('setValue', app.moodSlider.slider('getValue') - 1);
                    $("#moodValue").html(app.moodSlider.slider('getValue'));
                }
                if (mouseStillDown) {
                    setInterval("doSomething", 100);
                }
            });


            $(".sliderIconRight").bind('touchstart mousedown', function () {
                debugLog("Doing right");

                var sliderID = $(this).parent().find("input").attr('id');

                if (sliderID == "satisfactionSlider") {
                    app.satSlider.slider('setValue', app.satSlider.slider('getValue') + 1);
                    $("#satisfactionValue").html(app.satSlider.slider('getValue'));
                } else if (sliderID == "peformanceSlider") {
                    app.perfSlider.slider('setValue', app.perfSlider.slider('getValue') + 1);
                    $("#performanceValue").html(app.perfSlider.slider('getValue'));
                } else if (sliderID == "motivationSlider") {
                    app.motivationSlider.slider('setValue', app.motivationSlider.slider('getValue') + 1);
                    $("#motivationValue").html(app.motivationSlider.slider('getValue'));
                } else if (sliderID == "moodSlider") {
                    app.moodSlider.slider('setValue', app.moodSlider.slider('getValue') + 1);
                    $("#moodValue").html(app.moodSlider.slider('getValue'));
                }
            });

        } catch (err) {
            //alert(err.message);
        }



        var sessionData;
        if (window.localStorage.getItem("uppiddee_token") != null || window.localStorage.getItem("uppiddee_token") != undefined) {
            sessionData = JSON.parse(window.localStorage.getItem("uppiddee_token"));
            //app.uppiddee_verifyToken(sessionData.emailAddress, sessionData.tokenStr);
        } else {

            $("#loginSection").hide();

            $("#signupSection").show();

            $("#feedbackSection").hide();
        }
    },
    
    onDeviceReady: function () {

   
        app.uppiddee_getCompanies();

        app.receivedEvent('deviceready');

        app.init();


    },


    getSliderValue: function (sliderElement) {

    },

    uppiddee_createprofile: function (databaseString,firstNameValue,lastNameValue,dobValue,genderValue,teamValue,startDateValue,relationshipValue,noOfChildrenValue)
    {
        debugLog("Calling uppiddee_createprofile with databaseString == " + databaseString);
        var dataBody = {
            databaseString: databaseString,
            firstName: firstNameValue,
            lastName: lastNameValue,
            dateOfBirth: dobValue,
            gender: genderValue,
            team: teamValue,
            startDate: startDateValue,
            relationshipStatus:relationshipValue,
            childrenNumber:noOfChildrenValue
        };

        $("#btnCreateProfile").html("Creating your profile");

        $.support.cors = true;
        $.ajax({
            url: 'http://uppiddeeapi.azurewebsites.net/api/testCreateProfile',
            type: 'POST',
            crossDomain: true,
            headers: {
                "Authorization": "Bearer " + app.tokenStr
            },
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(dataBody),
            success: function (data) {
                debugLog("Created Profile ok");
            },
            error: function (request, error) {
               debugLog("Failed to create profile");
            }
        });
    },
    
    uppiddee_logfeedback: function () {
        var feedbackValues = {
            userID: app.userId.toString(),
            moodValue: app.moodSlider.slider('getValue').toString(),
            motivationValue: app.motivationSlider.slider('getValue').toString(),
            satisfactionValue: app.satSlider.slider('getValue').toString(),
            performanceValue: app.perfSlider.slider('getValue').toString()
        };

        $("#btnLogFeedback").html("Logging Feeback");
        $.ajax({
            url: 'http://uppiddeeapi.azurewebsites.net/api/testFeedback',
            type: 'POST',
            crossDomain: true,
            headers: {
                "Authorization": "Bearer " + app.tokenStr
            },
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(feedbackValues),
            success: function (data) {

                $("#btnLogFeedback").html("Feedback Logged");
            },
            error: function (request, error) {
                $("#btnLogFeedback").html("Failed");
            }
        });
    },

    uppiddee_verifyToken: function (emailAddress, tokenStr) {
        $.ajax({
            url: "http://uppiddeeapi.azurewebsites.net/api/test?email=" +
                emailAddress,
            type: 'GET',
            crossDomain: true,
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + tokenStr
            },
            success: function (data) {
                $("#loginSection").hide();
                $("#feedbackSection").show();

                $("#nameField").html(data[0].firstname +
                    " " + data[0].lastname);
                $("#userImg").attr("src", data[0].picURL);
                app.userId = data[0].userid;
                app.tokenStr = tokenStr;
            },
            error: function (request, error) {
                $("#loginSection").show();
                $("#feedbackSection").hide();
            }
        });
    },

    uppiddee_getuserprofiles: function (emailAddress, tokenStr) {
        $("#btnLogin").html("Logged In");
        //$("#deviceready").hide();
        //$("#mainDiv").show();
        $.ajax({
            url: "http://uppiddeeapi.azurewebsites.net/api/test?email=" +
                emailAddress,
            type: 'GET',
            crossDomain: true,
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + tokenStr
            },
            success: function (data) {
                $("#nameField").html(data[0].firstname +
                    " " + data[0].lastname);
                $("#userImg").attr("src", data[0].picURL);
                app.userId = data[0].userid;
            },
            error: function (request, error) {
                //alert("Get User Profile Failed");
            }
        });
    },

    uppiddee_getCompanies: function () {
        debugLog("Getting companies");
        $.ajax({
            url: "http://uppiddeeapi.azurewebsites.net/api/testGetCompanies",
            type: 'GET',
            crossDomain: true,
            headers: {
                "Accept": "application/json"
            },
            success: function (data) {
                debugLog(data);

                for (var i = 0; i < data.length; i++) {
                    $("#companiesDD").append("<option companyID='"+data[i].CompanyID+"' databaseID='"+data[i].DatabaseID+"'>" + data[i].CompanyName + "</option>"); //<option value="company1">LYIT</option>
                }
            },
            error: function (request, error) {
                //alert("Get Companies Failed");
            }
        });
    },

    uppiddee_checkToken: function () {

    },
    
    uppiddee_getToken: function(emailAddress,passwordText)
    {
        debugLog("Calling uppiddee_getToken");
        
        $.support.cors = true;
        return $.ajax({
            url: 'http://uppiddeeapi.azurewebsites.net/token',
            type: 'POST',
            crossDomain: true,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "grant_type=password&username=" +
                emailAddress + "&password=" + passwordText,
                success: function (data) {
                var tokenStr = data.access_token;
                app.tokenStr = data.access_token;

                sessionObject.emailAddress = emailAddress;
                sessionObject.tokenStr = tokenStr;
                window.localStorage.setItem("uppiddee_token", JSON.stringify(sessionObject));

                //app.uppiddee_getuserprofiles(emailAddress,
                //    tokenStr);
                //$("#loginSection").hide();
                //$("#feedbackSection").show();
                //app.navi.pushPage('page.html');
                    debugLog("Got the token");
                    
            },
            error: function (request, error) {
                //$("#btnLogin").html("Failed");
                //alert("Login Failed");
                debugLog("Failed to get Token");
              
            }
        });
    },
    
    uppiddee_getDatabaseString: function (databaseID, companyID) {

        
         debugLog("Clicked Sign Up with databaseID == " + databaseID + "and companyID == " + companyID);
            
        return $.ajax({
            url: "http://uppiddeeapi.azurewebsites.net/api/testGetDBString?databaseID=" +
                databaseID + "&" + "companyID="+companyID,
            type: 'GET',
            crossDomain: true,
            headers: {
                "Accept": "application/json"
            },
            success: function (data) {
                debugLog("uppiddee_getDatabaseString successful");
                sessionObject.databaseString = data[0].Description;
                debugLog("DB String ==" + sessionObject.databaseString);
                app.databaseString = data[0].Description;
                    
                $("#btnSignUp").html("Signing Up");
             
                
            },
            error: function (request, error) {
                debugLog("uppiddee_getDatabaseString failed");
        
            }
        });
    
 
    },
    
 
    uppiddee_signup: function (databaseString,emailAddress,passwordText)
    {
        debugLog("Calling uppiddee_signup with databaseString == " + databaseString);
           var dataBody = {
            databaseString: databaseString,
            emailAddress: emailAddress,
            passwordText: passwordText,

        };

        $("#btnSignUp").html("Signing Up");

        $.support.cors = true;
        $.ajax({
            url: 'http://uppiddeeapi.azurewebsites.net/api/testSignupUser',
            type: 'POST',
            crossDomain: true,
            headers: {
                "Authorization": "Bearer " + app.tokenStr
            },
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(dataBody),
            success: function (data) {
                debugLog("Signed up ok");
            },
            error: function (request, error) {
               debugLog("Failed to sign up");
            }
        });
    },
    
    uppiddee_login: function () {

        $("#btnLogin").html("Logging In");

        var emailAddress = $("#emailInput").val();
        var passwordText = $("#passwordInput").val();
        $.support.cors = true;
        $.ajax({
            url: 'http://uppiddeeapi.azurewebsites.net/token',
            type: 'POST',
            crossDomain: true,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "grant_type=password&username=" +
                emailAddress + "&password=" + passwordText,
            success: function (data) {
                var tokenStr = data.access_token;
                app.tokenStr = data.access_token;

                sessionObject.emailAddress = emailAddress;
                sessionObject.tokenStr = tokenStr;
                window.localStorage.setItem("uppiddee_token", JSON.stringify(sessionObject));

                app.uppiddee_getuserprofiles(emailAddress,
                    tokenStr);
                $("#loginSection").hide();
                $("#feedbackSection").show();
                //app.navi.pushPage('page.html');
            },
            error: function (request, error) {
                $("#btnLogin").html("Failed");
                //alert("Login Failed");
            }
        });
    },


    getPhoto: function (source) {
        navigator.camera.getPicture(app.onPhotoURISuccess, app.onFail, {
            quality: 50,
            destinationType: app.destinationType.NATIVE_URI,
            sourceType: source
        });

    },

    onPhotoURISuccess: function (imageURI) {
        //alert("Got image " + imageURI);
        fileUrl = imageURI;
        getFile();
        $('#userImgSelect').empty();
        $('#userImgSelect').append("<img src='" + imageURI + "'></img>");
        //largeImage.src = imageURI;

    },


    onFail: function (message) {
        //alert('Failed because: ' + message);
        debugLog(message);
    },


    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);

        debugLog('Received Event: ' + id);
    }
};

//document.addEventListener("deviceready",onDeviceReady,false);

/*http://gauravmantri.com/2013/02/16/uploading-large-files-in-windows-azure-blob-storage-using-shared-access-signature-html-and-javascript/*/


var maxBlockSize = 256 * 1024; //Each file will be split in 256 KB.
var numberOfBlocks = 1;
var selectedFile = null;
var currentFilePointer = 0;
var totalBytesRemaining = 0;
var blockIds = new Array();
var blockIdPrefix = "block-";
var submitUri = null;
var bytesUploaded = 0;

$(document).ready(function () {


    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        //alert('The File APIs are not fully supported in this browser.');
    }
});


var fileUrl = "";

function getFile() {
    window.FilePath.resolveNativePath(fileUrl, successNative, fail);
    debugLog(fileUrl);
}


var newUri;
function successNative(path) {
    ////alert(path);
    window.resolveLocalFileSystemURL("file://"+path, onResolveSuccess, fail);
    //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    fileUrl = path;
    debugLog("Path is " + path);
    
    newUri = "file://"+path;
    debugLog("file://"+path);
    
}

function onResolveSuccess(fileEntry) {

    fileEntry.file(successFile, fail);
    //debugLog("Just called resolveLocalFileSystemURL")
    //debugLog(fileEntry);

}

function successFile(file) {
    //debugLog(file);
    //handleFileSelect(file);
            var readerFile = new FileReader();
            readerFile.onloadend = readCompleted;
            //readerFile.onerror = fail;

            // Read the captured file into a byte array.
            // This function is not currently supported on Windows Phone.
            readerFile.readAsArrayBuffer(file);
   
}

function fail(evt) {
    //alert(evt);
    debugLog(evt);
}

var readCompleted = function (evt) {
    if (evt.target.readyState == FileReader.DONE) {

        // The binary data is the result.
        var requestData = evt.target.result;

        // Build the request URI with the SAS, which gives us permissions to upload.

        var xhr = new XMLHttpRequest();
        //xhr.onerror = fail;
        //xhr.onloadend = uploadCompleted;
         var baseUrl = "https://uppiddeeimages.blob.core.windows.net/pics?sr=c&sv=2015-02-21&st=2016-01-13T14%3A50%3A10Z&se=2050-01-13T15%3A50%3A00Z&sp=rwdl&sig=uVfkcOrF9v052KZeBRtCbozZC8AVWYY2XNQqIhoq264%3D";
          var indexOfQueryStart = baseUrl.indexOf("?");
          submitUri = baseUrl.substring(0, indexOfQueryStart) + '/' + newUri.substr(newUri.lastIndexOf('/')+1) + baseUrl.substring(indexOfQueryStart);
              xhr.open("PUT", submitUri);
        xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
        xhr.setRequestHeader('x-ms-blob-content-type', 'image/jpeg');
        xhr.send(requestData);
    }
}

function resolveSuccess(fileEntry)
{
      var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = fileUrl.substr(fileUrl.lastIndexOf('/')+1);
        options.mimeType = "image/jpeg";
   
        options.chunkedMode = false;
        options.params = {
      
        }
          
        options.headers = {'x-ms-blob-type': 'BlockBlob' };

 
        var ft = new FileTransfer();
        var baseUrl = "https://uppiddeeimages.blob.core.windows.net/pics?sr=c&sv=2015-02-21&st=2016-01-13T14%3A50%3A10Z&se=2050-01-13T15%3A50%3A00Z&sp=rwdl&sig=uVfkcOrF9v052KZeBRtCbozZC8AVWYY2XNQqIhoq264%3D";
        var indexOfQueryStart = baseUrl.indexOf("?");
        submitUri = baseUrl.substring(0, indexOfQueryStart) + '/' + options.fileName + baseUrl.substring(indexOfQueryStart);
        //alert(imageURI);
        ft.upload(fileEntry.toURL(), encodeURI(submitUri), win, fail, options);
}


//Read the file and find out how many blocks we would need to split it.
function handleFileSelect(file) {
    //alert("Calling handleFileSelect " + fileEntry.fullPath + " " + fileEntry.name + " " + file.size + " " + file.type);
    maxBlockSize = 256 * 1024;
    currentFilePointer = 0;
    totalBytesRemaining = 0;

    selectedFile = file;

    var fileSize = selectedFile.size;

    if (fileSize < maxBlockSize) {
        maxBlockSize = fileSize;
        debugLog("max block size = " + maxBlockSize);
    }
    totalBytesRemaining = fileSize;
    debugLog("TotalBytesRemaining === " + totalBytesRemaining);
    if (fileSize % maxBlockSize == 0) {
        numberOfBlocks = fileSize / maxBlockSize;
    } else {
        numberOfBlocks = parseInt(fileSize / maxBlockSize, 10) + 1;
    }
    debugLog("total blocks = " + numberOfBlocks);
    var baseUrl = "https://uppiddeeimages.blob.core.windows.net/pics?sr=c&sv=2015-02-21&st=2016-01-13T14%3A50%3A10Z&se=2050-01-13T15%3A50%3A00Z&sp=rwdl&sig=uVfkcOrF9v052KZeBRtCbozZC8AVWYY2XNQqIhoq264%3D";
    var indexOfQueryStart = baseUrl.indexOf("?");
    submitUri = baseUrl.substring(0, indexOfQueryStart) + '/' + selectedFile.name  + baseUrl.substring(indexOfQueryStart);
    debugLog(submitUri);
    ////alert(submitUri);
    
    uploadFileInBlocks();
}

var reader = new FileReader();

reader.onloadend = function (evt) {
    //alert("In reader.onloadend");
    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        var uri = submitUri + '&comp=block&blockid=' + blockIds[blockIds.length - 1];
        var requestData = new Uint8Array(evt.target.result);
        $.ajax({
            url: uri,
            type: "PUT",
            data: requestData,
            processData: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
               
            },
            success: function (data, status) {
                debugLog(data);
                debugLog(status);
                bytesUploaded += requestData.length;
                var percentComplete = ((parseFloat(bytesUploaded) / parseFloat(selectedFile.size)) * 100).toFixed(2);
                //$("#fileUploadProgress").text(percentComplete + " %");
                debugLog(percentComplete + " %");
                uploadFileInBlocks();
            },
            error: function (xhr, desc, err) {
                debugLog(desc);
                debugLog(err);
            }
        });
    }
};
function uploadFileInBlocks() {

    if (totalBytesRemaining > 0) {
        //alert("In uploadfileinblocks 1");
        debugLog("current file pointer = " + currentFilePointer + " bytes read = " + maxBlockSize);
        var fileContent = selectedFile.slice(currentFilePointer, currentFilePointer + maxBlockSize);
          var blob = new Blob([fileContent], {type : 'image/jpeg'});
        debugLog(fileContent);
        var blockId = blockIdPrefix + pad(blockIds.length, 6);
        debugLog("block id = " + blockId);
        blockIds.push(btoa(blockId));
        reader.readAsArrayBuffer(blob);
        currentFilePointer += maxBlockSize;
        totalBytesRemaining -= maxBlockSize;
        if (totalBytesRemaining < maxBlockSize) {
            maxBlockSize = totalBytesRemaining;
        }
    } else {
        //alert("In uploadfileinblocks 2");
        commitBlockList();
    }
}

function commitBlockList() {
    //alert("In commitBlockList");
    var uri = submitUri + '&comp=blocklist';
    debugLog(uri);
    var requestBody = '<?xml version="1.0" encoding="utf-8"?><BlockList>';
    for (var i = 0; i < blockIds.length; i++) {
        requestBody += '<Latest>' + blockIds[i] + '</Latest>';
    }
    requestBody += '</BlockList>';
    debugLog(requestBody);
    $.ajax({
        url: uri,
        type: "PUT",
        data: requestBody,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('x-ms-blob-content-type', selectedFile.type);
           
        },
        success: function (data, status) {
            debugLog(data);
            debugLog(status);
        },
        error: function (xhr, desc, err) {
            debugLog(desc);
            debugLog(err);
        }
    });

}

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}