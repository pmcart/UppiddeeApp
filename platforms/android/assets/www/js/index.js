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
var uiSwitchEnabled = true;
var removeExistingToken = false;
var removeExistingActivation = false;
var sessionData;
var activationData;

function debugLog(logStr) {
    if (logEnabled) {
        console.log(logStr);
    }
}

var sessionObject = {

    emailAddress: "",
    userID: "",
    tokenStr: "",
    databaseString: "",
    userPicUrl: "",
    companyID: "",
    firstname: "",
    lastname: ""
}

var activationObject = {
    emailAddress: "",
    databaseName: ""

}
var metricGroup1Count = 0;
var metricGroup2Count = 0;
var metricGroup3Count = 0;
var metricGroup4Count = 0;
var metricGroupToLoad = 1;
var currentPage = 1;
var currentMetricGroup = 1;
var selectedView = 1;

var app = {

    sliders: [],
    satSlider: null,
    perfSlider: null,
    motivationSlider: null,
    moodSlider: null,
    userId: null,
    tokenStr: null,
    databaseString: null,
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

    init: function () {

        //526088034082

        var push = PushNotification.init({
            "android": {
                "senderID": "526088034082"
            },
            "ios": {
                "alert": "true",
                "badge": "true",
                "sound": "true"
            },
            "windows": {}
        });

        push.on('registration', function (data) {
            debugLog("Hello");
            debugLog(data)
        });

        push.on('notification', function (data) {
            alert("New Push");
        });

        push.on('error', function (e) {
            debugLog(e);
            // e.message
        });
        /*  intercom.registerIdentifiedUser({
            email: "patrickmcart@gmail.com"
        });
        intercom.registerForPush('526088034082');
*/


        var windowHeight = screen.height;
        $("#fixedMenuBottom").css("top", windowHeight - 100);
        $("#fixedMenuBottom").css("left", 0);
        $("#fixedMenuBottom").css("display", "block");

        try {
            app.pictureSource = navigator.camera.PictureSourceType;
            app.destinationType = navigator.camera.DestinationType;
        } catch (err) {
            //alert(err.message);
            debugLog(err);
        }

        $('#datePickerDOB').pickadate({
            selectMonths: true,
            selectYears: true,
            format: 'dd/mm/yyyy',
            min: new Date(1910, 10, 10),
            max: true,
            selectYears: 80
        })


        $("#userImgSelect").click(function () {
            app.getPhoto(app.pictureSource.PHOTOLIBRARY);
        });

        $("#btnAwareness").click(function () {
            selectedView = 2;
            $(this).addClass("active");
            $("#btnFeedback").removeClass("active");

            $("#reportDivContainer").show();
            $(".reportDivSection").hide();
            $("#reportDiv" + metricGroupToLoad).show();
            $("#reportDisplayDiv").hide();
            $("#feedbackDiv").hide();


        });
        $("#btnFeedback").click(function () {
            selectedView = 1;
            $(this).addClass("active");
            $("#btnAwareness").removeClass("active");
            $("#reportDivContainer").hide();
            $("#feedbackDiv").show();
            $(".sliderDiv").hide();

            $("#sliderDiv" + metricGroupToLoad).show();
            $("#sliderDiv" + metricGroupToLoad).find(".subDiv1").hide();
            $("#sliderDiv" + metricGroupToLoad).find(".subDiv2").hide();
            $("#sliderDiv" + metricGroupToLoad).find(".subDiv3").hide();
            $("#sliderDiv" + metricGroupToLoad).find(".subDiv4").hide();
            $("#sliderDiv" + metricGroupToLoad).find(".subDiv" + currentPage).show();
            displayArrows(metricGroupToLoad);
        });

        $("#btnSignupLogin").click(function () {
            app.switchView("signupSection", "loginSection");
        });
        $("#btnLoginSignup").click(function () {
            app.switchView("loginSection", "signupSection");
        });

        $("#btnLogin").click(function () {
            debugLog("Logging In");


            var emailAddress = $("#emailInputLogin").val();
            var passwordText = $("#passwordInputLogin").val();

            var selectedDBID = $('#companiesDDLogin').find(":selected").attr("databaseID");
            var selectedCompanyID = $('#companiesDDLogin').find(":selected").attr("companyID");
            var selectedCompanyName = $('#companiesDDLogin').find(":selected").text();


            if (emailAddress != "" && passwordText != "") {
                $('.loading-mask').removeClass('stop-loading');



                debugLog("Login Clicked with IDs", selectedCompanyID, selectedDBID);

                //Make call to get the selected database string
                $.when(app.uppiddee_getDatabaseString(selectedDBID, selectedCompanyID, selectedCompanyName)).done(function (dataReturned, status, jqXHRObj) {

                    debugLog(dataReturned);
                    debugLog(status);
                    debugLog(jqXHRObj);

                    //Make call to get the authorization token 
                    $.when(app.uppiddee_getToken(emailAddress, passwordText)).done(function (dataReturned, status, jqXHRObj) {

                        //Make call to do the signup
                        $.when(app.uppiddee_login(sessionObject.databaseString, emailAddress, passwordText)).done(function (dataReturned, status, jqXHRObj) {

                            $.when(app.uppiddee_getuserprofiles(emailAddress, sessionObject.databaseString)).done(function (dataReturned, status, jqXHRObj) {

                                debugLog("Calling getmetics with sessionobject.userID == " + sessionObject.userID);

                                $.when(app.uppiddee_getMetrics(sessionObject.userID, sessionObject.databaseString)).done(function (dataReturned, status, jqXHRObj) {
                                    $('.loading-mask').addClass('stop-loading');
                                    app.uppiddee_intercomInit(sessionObject.firstname + " " + sessionObject.lastname, sessionObject.emailAddress);
                                }).fail(function (jqXHR, textStatus) {
                                    alert("Sorry there was a problem attempting to log you in.");
                                    $('.loading-mask').addClass('stop-loading');
                                });

                            }).fail(function (jqXHR, textStatus) {
                                alert("Sorry there was a problem attempting to log you in.");
                                $('.loading-mask').addClass('stop-loading');
                            });

                        }).fail(function (jqXHR, textStatus) {
                            alert("Sorry there was a problem attempting to log you in.");
                            $('.loading-mask').addClass('stop-loading');
                        });
                    }).fail(function (jqXHR, textStatus) {
                        alert("Sorry there was a problem attempting to log you in.");
                        $('.loading-mask').addClass('stop-loading');
                    });
                }).fail(function (jqXHR, textStatus) {
                    alert("Sorry there was a problem attempting to log you in.");
                    $('.loading-mask').addClass('stop-loading');
                });
            } else {
                alert("Please enter a valid username and password.");
            }

        });

        var displayArrows = function (metricGroupToLoad) {
            var metricCount = 0;

            if (metricGroupToLoad == 1) {
                metricCount = metricGroup1Count;
            } else if (metricGroupToLoad == 2) {
                metricCount = metricGroup2Count;
            } else if (metricGroupToLoad == 3) {
                metricCount = metricGroup3Count;
            } else if (metricGroupToLoad == 4) {
                metricCount = metricGroup4Count;
            }

            if (currentPage == 1) {
                if (metricCount <= 4) {
                    $("#pageControlNext").hide();

                }

                if (metricCount > 4) {
                    $("#pageControlNext").show();
                }
                $("#pageControlPrevious").hide();
            }
            if (currentPage == 2) {
                if (metricCount <= 8) {
                    $("#pageControlNext").hide();

                }

                if (metricCount > 8) {
                    $("#pageControlNext").show();
                }
                $("#pageControlPrevious").show();
            }
            if (currentPage == 3) {
                if (metricCount <= 12) {
                    $("#pageControlNext").hide();
                }

                if (metricCount > 12) {
                    $("#pageControlNext").show();
                }
                $("#pageControlPrevious").show();
            }
            if (currentPage == 4) {

                $("#pageControlNext").hide();

                $("#pageControlPrevious").show();
            }

        }



        $("#pageControlNext").click(function (event) {


            if ($("#sliderDiv" + metricGroupToLoad).find(".subDiv" + currentPage).is(':visible')) {
                $("#sliderDiv" + metricGroupToLoad).find(".subDiv" + currentPage).hide();

                currentPage++;
                $("#sliderDiv" + metricGroupToLoad).find(".subDiv" + currentPage).show();
                displayArrows(metricGroupToLoad);

            }

        });

        $("#pageControlPrevious").click(function (event) {
            if ($("#sliderDiv" + metricGroupToLoad).find(".subDiv" + currentPage).is(':visible')) {
                $("#sliderDiv" + metricGroupToLoad).find(".subDiv" + currentPage).hide();

                currentPage--;
                $("#sliderDiv" + metricGroupToLoad).find(".subDiv" + currentPage).show();
                displayArrows(metricGroupToLoad);
            }
        });

        $(".btnLoadSliders").click(function (event) {

            $(".btnLoadSliders").removeClass("active");
            $(this).addClass("active");

            currentPage = 1;

            metricGroupToLoad = $(this).attr("value");

            currentMetricGroup = metricGroupToLoad;

            if (selectedView == 1) {
                $(".sliderDiv").hide();

                $("#sliderDiv" + metricGroupToLoad).show();
                $("#sliderDiv" + metricGroupToLoad).find(".subDiv1").hide();
                $("#sliderDiv" + metricGroupToLoad).find(".subDiv2").hide();
                $("#sliderDiv" + metricGroupToLoad).find(".subDiv3").hide();
                $("#sliderDiv" + metricGroupToLoad).find(".subDiv4").hide();
                $("#sliderDiv" + metricGroupToLoad).find(".subDiv" + currentPage).show();

                displayArrows(metricGroupToLoad);
            } else {
                $(".reportDivSection").hide();


                $("#reportDiv" + metricGroupToLoad).show();
            }


        });





        $("#btnCreateProfile").click(function () {
            debugLog("Clicked Create Profile");

            var firstNameValue = $("#firstNameInput").val();
            var lastNameValue = $("#lastNameInput").val();
            var dobValue = $("#datePickerDOB").val();
            var genderValue = $('#genderDD').find(":selected").val();
            var teamValue = $('#teamDD').find(":selected").val();

            //debugLog(firstNameValue + " " + lastNameValue + " " + dobValue + " " + genderValue + " " + teamValue);
            debugLog("Company ID is " + sessionObject.companyID);
            /*   var startDateValue = $("#datePickerStartDate").val();
               var relationshipValue = $('#relationshipDD').find(":selected").val();
               var noOfChildrenValue = $("#noOfChildrenInput").val();*/

            app.uppiddee_createprofile(sessionObject.databaseString, sessionObject.emailAddress, sessionObject.userID, sessionObject.companyID, firstNameValue, lastNameValue, dobValue, genderValue, teamValue, sessionObject.userPicUrl);

        });


        $("#btnSignUp").click(function () {
            var emailAddress = $("#emailInput").val();
            var passwordText = $("#passwordInput").val();
            var passwordTextConfirm = $("#passwordInputConfirm").val();

            if (emailAddress != "" && passwordText != "" && passwordTextConfirm != "") {
                if (passwordText == passwordTextConfirm) {
                    var selectedDBID = $('#companiesDD').find(":selected").attr("databaseID");
                    var selectedCompanyID = $('#companiesDD').find(":selected").attr("companyID");
                    var selectedCompanyName = $('#companiesDD').find(":selected").text();
                    $('.loading-mask').removeClass('stop-loading');

                    debugLog("Signup Clicked with IDs", selectedCompanyID, selectedDBID);

                    //Make call to get the selected database string
                    $.when(app.uppiddee_getDatabaseString(selectedDBID, selectedCompanyID, selectedCompanyName)).done(function (dataReturned, status, jqXHRObj) {

                        debugLog(dataReturned);
                        debugLog(status);
                        debugLog(jqXHRObj);



                        //Make call to get the authorization token 
                        $.when(app.uppiddee_getToken(emailAddress, passwordText)).done(function (dataReturned, status, jqXHRObj) {

                            //Make call to do the signup
                            $.when(app.uppiddee_signup(sessionObject.databaseString, emailAddress, passwordText)).done(function (dataReturned, status, jqXHRObj) {
                                $.when(app.uppiddee_getMetrics(sessionObject.userID, sessionObject.databaseString)).done(function (dataReturned, status, jqXHRObj) {
                                    $('.loading-mask').addClass('stop-loading');

                                    $.when(app.uppiddee_getuserprofiles(sessionObject.userID, sessionObject.databaseString)).done(function (dataReturned, status, jqXHRObj) {
                                        $('.loading-mask').addClass('stop-loading');
                                        app.uppiddee_intercomInit(sessionObject.firstname + " " + sessionObject.lastname, sessionObject.emailAddress);
                                    }).fail(function (jqXHR, textStatus) {
                                        alert("Sorry there was a problem attempting to sign you up.");
                                        $("#btnSignUp").html("Sign up");
                                        $('.loading-mask').addClass('stop-loading');
                                    });


                                }).fail(function (jqXHR, textStatus) {
                                    alert("Sorry there was a problem attempting to sign you up.");
                                    $("#btnSignUp").html("Sign up");
                                    $('.loading-mask').addClass('stop-loading');
                                });
                            }).fail(function (jqXHR, textStatus) {
                                alert("Sorry there was a problem attempting to sign you up.");
                                $("#btnSignUp").html("Sign up");
                                $('.loading-mask').addClass('stop-loading');
                            });
                        }).fail(function (jqXHR, textStatus) {
                            alert("Sorry there was a problem attempting to sign you up.");
                            $("#btnSignUp").html("Sign up");
                            $('.loading-mask').addClass('stop-loading');
                        });

                    }).fail(function (jqXHR, textStatus) {
                        alert("Sorry there was a problem attempting to sign you up.");
                        $("#btnSignUp").html("Sign up");
                        $('.loading-mask').addClass('stop-loading');
                    });
                } else {
                    alert("Your passwords do not match. Please ensure they match.");
                    $("#btnSignUp").html("Sign up");
                    $('.loading-mask').addClass('stop-loading');
                }
            } else {
                alert("Please ensure you've filled in all the available fields");
            }
        });

        $("#btnLogFeedback").click(function () {
            ////alert("button clicked");
            app.uppiddee_logfeedback();

        });

        $("#btnLogout").click(function () {
            ////alert("button clicked");
            window.localStorage.removeItem("uppiddee_token");
            navigator.app.exitApp();

        });


        $("#btnBack").click(function () {
            ////alert("button clicked");
            $(".reportDivSection").hide();

            $("#reportDiv" + metricGroupToLoad).show();

        });



        if (removeExistingToken) {
            window.localStorage.removeItem("uppiddee_token");
        }

        if (removeExistingActivation) {
            window.localStorage.removeItem("uppiddee_previousactivation");
        }

        if (window.localStorage.getItem("uppiddee_token") != null || window.localStorage.getItem("uppiddee_token") != undefined) {
            sessionData = JSON.parse(window.localStorage.getItem("uppiddee_token"));
            sessionObject = sessionData;
            app.uppiddee_verifyToken(sessionData.emailAddress, sessionData.tokenStr, sessionData.databaseString);

        } else {


            if (window.localStorage.getItem("uppiddee_previousactivation") != null || window.localStorage.getItem("uppiddee_previousactivation") != undefined) {
                app.switchView("loginSection", "loginSection");
                activationData = JSON.parse(window.localStorage.getItem("uppiddee_previousactivation"));

                $("#emailInputLogin").val(activationData.emailAddress);

                //$("#companiesDDLogin option:contains(" + activationData.databaseName + ")").prop('selected', 'selected');


            } else {
                app.switchView("signupSection", "signupSection");
            }


        }
    },


    uppiddee_verifyToken: function (emailAddress, tokenStr, databaseString) {
        debugLog("Calling uppiddee_verifyToken");


        $.ajax({
            url: "http://uppiddeeapi.azurewebsites.net/api/test?emailAddress=" +
                emailAddress + "&" + "databaseString=" + databaseString,
            type: 'GET',
            crossDomain: true,
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + tokenStr
            },

            success: function (data) {
                //$("#nameField").html(data[0].firstname + " " + data[0].lastname);
                //$("#userImg").attr("src", data[0].picURL);
                //app.userId = data[0].userid;
                //app.tokenStr = tokenStr;
                debugLog("Token verified");
                debugLog(data);
                sessionObject.tokenStr = tokenStr;
                if (data[0] != null && data[0] != undefined) {


                    if (data[0].userid != null) {
                        sessionObject.userID = data[0].userid;
                        sessionObject.databaseString = databaseString;

                        app.uppiddee_getuserprofiles(sessionObject.emailAddress, sessionObject.databaseString);

                        if (data[0].firstname != null) {
                            app.uppiddee_getMetrics(sessionObject.userID, sessionObject.databaseString);
                            app.switchView("signupSection", "feedbackSection");
                        } else {
                            app.uppiddee_getDepartments(sessionObject.databaseString);
                            app.switchView("signupSection", "userProfileSection");
                        }

                        app.uppiddee_intercomInit(sessionObject.firstname + " " + sessionObject.lastname, sessionObject.emailAddress);

                    }
                }

            },
            error: function (request, error) {
                debugLog("No Token verified");
                app.switchView("signupSection", "signupSection");
            }
        });
    },

    onDeviceReady: function () {


        app.uppiddee_getCompanies();

        app.receivedEvent('deviceready');

        app.init();


    },

    switchView: function (viewFrom, viewTo) {
        if (uiSwitchEnabled) {
            $("#" + viewFrom).hide();
            $("#" + viewTo).show();
        }
    },

    createReports: function (metrics) {
        
        var currentMetric = "";
        var currentMetricGroup = 0;
        var metricGroupCount =0;
        
  
 
        
        for (var i = 0; i < metrics.length; i++) {
            var obj = metrics[i];

            var metricGroup = obj.MetricGroup;
            var metricGroupID = obj.GroupID;

            var originalVal;

            var idValue = obj.ID;
            var sliderTextValue = obj.Metric;

            var template;

           if(currentMetricGroup != metricGroupID)
            {
                metricGroupCount++;
                
            }

            if (metricGroupCount == "1") {
                if (metricGroup1Count <= 4) {
                    template = Handlebars.templates['reportSquare'];
                } else if (metricGroup1Count > 4 && metricGroup1Count <= 8) {
                    template = Handlebars.templates['reportMedium'];
                } else if (metricGroup1Count > 8 && metricGroup1Count <= 12) {
                    template = Handlebars.templates['reportSmall'];
                } else if (metricGroup1Count > 12 && metricGroup1Count <= 16) {
                    template = Handlebars.templates['reportSmall'];
                }
                var context = {
                    ID: idValue,
                    reportTitle: sliderTextValue
                };
                var htmlBlock = template(context);

                $("#reportDiv1").prepend(htmlBlock.trim());
            }
            if (metricGroupCount == "2") {
                if (metricGroup2Count <= 4) {
                    template = Handlebars.templates['reportSquare'];
                } else if (metricGroup2Count > 4 && metricGroup2Count <= 8) {
                    template = Handlebars.templates['reportMedium'];
                } else if (metricGroup2Count > 8 && metricGroup2Count <= 12) {
                    template = Handlebars.templates['reportSmall'];
                } else if (metricGroup2Count > 12 && metricGroup2Count <= 16) {
                    template = Handlebars.templates['reportSmall'];
                }
                var context = {
                    ID: idValue,
                    reportTitle: sliderTextValue
                };
                var htmlBlock = template(context);

                $("#reportDiv2").prepend(htmlBlock.trim());
            }
            if (metricGroupCount == "3") {
                if (metricGroup3Count <= 4) {
                    template = Handlebars.templates['reportSquare'];
                } else if (metricGroup3Count > 4 && metricGroup3Count <= 8) {
                    template = Handlebars.templates['reportMedium'];
                } else if (metricGroup3Count > 8 && metricGroup3Count <= 12) {
                    template = Handlebars.templates['reportSmall'];
                } else if (metricGroup3Count > 12 && metricGroup3Count <= 16) {
                    template = Handlebars.templates['reportSmall'];
                }
                var context = {
                    ID: idValue,
                    reportTitle: sliderTextValue
                };
                var htmlBlock = template(context);

                $("#reportDiv3").prepend(htmlBlock.trim());
            }
            if (metricGroupCount == "4") {
                if (metricGroup4Count <= 4) {
                    template = Handlebars.templates['reportSquare'];
                } else if (metricGroup4Count > 4 && metricGroup4Count <= 8) {
                    template = Handlebars.templates['reportMedium'];
                } else if (metricGroup4Count > 8 && metricGroup4Count <= 12) {
                    template = Handlebars.templates['reportSmall'];
                } else if (metricGroup4Count > 12 && metricGroup4Count <= 16) {
                    template = Handlebars.templates['reportSmall'];
                }
                var context = {
                    ID: idValue,
                    reportTitle: sliderTextValue
                };
                var htmlBlock = template(context);

                $("#reportDiv4").prepend(htmlBlock.trim());
            }
            
            currentMetricGroup = metricGroupID;

            $("#reportMetric" + idValue).click(function () {
                debugLog("Clicked report square");
                var thisID = $(this).attr("id");

                thisID = thisID.replace("reportMetric", "");

                var thisText = $(this).find(".reportSquareTitle").html();
                app.uppiddee_getReport(thisID, sessionObject.databaseString, sessionObject.userID, thisText);


            });


        }
    },

    createReport: function (reportData, reportTitle) {

        $(".reportDivSection").hide();
        $("#reportDisplayDiv").show();
        $("#reportDisplayList").empty();
        debugLog(reportData);
        $("#reportTitle").html(reportTitle)
        for (var i = 0; i < reportData.length; i++) {

            var obj = reportData[i];

            $("#reportDisplayList").prepend("<p style='float:left; width:50%; margin-left:10px;'>" + obj.Created + "</p><p style='float:left;'>" + obj.Value + "</p>")

        }
    },

    createSliders: function (metrics) {

        var currentMetric = "";
        var currentMetricGroup = 0;
        var metricGroupCount =0;
        
        for (var i = 0; i < metrics.length; i++) {
            var obj = metrics[i];

            var metricGroup = obj.MetricGroup;
            var metricGroupID = obj.GroupID;
           
            var originalVal;

            var idValue = obj.ID;
            var sliderTextValue = obj.Metric;

            var template = Handlebars.templates['feedbackSlider'];
            var context = {
                ID: idValue,
                sliderText: sliderTextValue
            };
            var htmlBlock = template(context);
            
            if(currentMetricGroup != metricGroupID)
            {
                metricGroupCount++;
                
            }
            if (metricGroupCount == "1") {

                if (metricGroup1Count < 4) {
                    $("#sliderDiv1").find(".subDiv1").prepend(htmlBlock.trim());
                }

                if (metricGroup1Count >= 4 && metricGroup1Count < 8) {
                    $("#sliderDiv1").find(".subDiv2").prepend(htmlBlock.trim());
                }

                if (metricGroup1Count >= 8 && metricGroup1Count < 12) {
                    $("#sliderDiv1").find(".subDiv3").prepend(htmlBlock.trim());
                }

                if (metricGroup1Count >= 12 && metricGroup1Count < 16) {
                    $("#sliderDiv1").find(".subDiv4").prepend(htmlBlock.trim());
                }

                metricGroup1Count++;
            }
            if (metricGroupCount == "2") {
                if (metricGroup2Count < 4) {
                    $("#sliderDiv2").find(".subDiv1").prepend(htmlBlock.trim());
                }

                if (metricGroup2Count >= 4 && metricGroup2Count < 8) {
                    $("#sliderDiv2").find(".subDiv2").prepend(htmlBlock.trim());
                    1
                }

                if (metricGroup2Count >= 8 && metricGroup2Count < 12) {
                    $("#sliderDiv2").find(".subDiv3").prepend(htmlBlock.trim());
                }

                if (metricGroup2Count >= 12 && metricGroup2Count < 16) {
                    $("#sliderDiv2").find(".subDiv4").prepend(htmlBlock.trim());
                }
                metricGroup2Count++;
            }
            if (metricGroupCount == "3") {
                if (metricGroup3Count < 4) {
                    $("#sliderDiv3").find(".subDiv1").prepend(htmlBlock.trim());
                }

                if (metricGroup3Count >= 4 && metricGroup3Count < 8) {
                    $("#sliderDiv3").find(".subDiv2").prepend(htmlBlock.trim());
                }

                if (metricGroup3Count >= 8 && metricGroup3Count < 12) {
                    $("#sliderDiv3").find(".subDiv3").prepend(htmlBlock.trim());
                }

                if (metricGroup3Count >= 12 && metricGroup3Count < 16) {
                    $("#sliderDiv3").find(".subDiv4").prepend(htmlBlock.trim());
                }
                metricGroup3Count++;
            }
            if (metricGroupCount == "4") {
                if (metricGroup4Count < 4) {
                    $("#sliderDiv4").find(".subDiv1").prepend(htmlBlock.trim());
                }

                if (metricGroup4Count >= 4 && metricGroup4Count < 8) {
                    $("#sliderDiv4").find(".subDiv2").prepend(htmlBlock.trim());
                }

                if (metricGroup4Count >= 8 && metricGroup4Count < 12) {
                    $("#sliderDiv4").find(".subDiv3").prepend(htmlBlock.trim());
                }

                if (metricGroup4Count >= 12 && metricGroup4Count < 16) {
                    $("#sliderDiv4").find(".subDiv4").prepend(htmlBlock.trim());
                }
                metricGroup4Count++;
            }
            
            currentMetricGroup = metricGroupID;
            //$(htmlBlock.trim()).prependTo(api.getContentPane()).hide().fadeIn(1000);
            //setTimeout(function () {

            var sliderValueChanged = function (ev) {
                //$("#moodValue").html(app.moodSlider.slider('getValue'));
                //debugLog(ev);
                var newValue = $("#" + ev.target.id).data('slider').getValue();
                debugLog(newValue);
                $("#sliderContainer" + ev.target.id.replace("slider", "")).find(".sliderValue").html(newValue);
            };

            $('#slider' + idValue).slider({
                tooltip: 'hide'
            }).on('change', sliderValueChanged);

            try {


                var interval;
                $(".sliderIconLeft").bind('touchstart mousedown', function () {

                    //interval = setInterval(increaseLeftArrow, 100);

                    debugLog("Doing left");

                    var sliderID = $(this).parent().find("input").attr('id');

                    $("#" + sliderID).slider('setValue', $("#" + sliderID).slider('getValue') - 1);
                    $("#sliderContainer" + sliderID.replace("slider", "")).find(".sliderValue").html($("#" + sliderID).slider('getValue'));

                    if (mouseStillDown) {
                        setInterval("doSomething", 100);
                    }
                });


                $(".sliderIconRight").bind('touchstart mousedown', function () {
                    debugLog("Doing right");

                    var sliderID = $(this).parent().find("input").attr('id');

                    $("#" + sliderID).slider('setValue', $("#" + sliderID).slider('getValue') + 1);
                    $("#sliderContainer" + sliderID.replace("slider", "")).find(".sliderValue").html($("#" + sliderID).slider('getValue'));

                    if (mouseStillDown) {
                        setInterval("doSomething", 100);
                    }
                });

            } catch (err) {
                //alert(err.message);
            }

        }


    },

    getSliderValue: function (sliderElement) {

    },

    uppiddee_createprofile: function (databaseString, emailAddress, userId, companyID, firstNameValue, lastNameValue, dobValue, genderValue, teamValue, picURL) {
        debugLog("Calling uppiddee_createprofile with databaseString == " + databaseString);
        var dataBody = {
            databaseString: databaseString,
            emailAddress: emailAddress,
            userId: userId,
            companyID: companyID,
            firstName: firstNameValue,
            lastName: lastNameValue,
            dateOfBirth: dobValue,
            gender: genderValue,
            team: teamValue,
            picURL: picURL
        };

        $("#btnCreateProfile").html("Creating your profile");

        $.support.cors = true;
        $.ajax({
            url: 'http://uppiddeeapi.azurewebsites.net/api/testCreateProfile',
            type: 'POST',
            crossDomain: true,
            headers: {
                "Authorization": "Bearer " + sessionObject.tokenStr
            },
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(dataBody),
            success: function (data) {
                debugLog("Created Profile ok");
                app.switchView("userProfileSection", "feedbackSection");
                $.when(app.uppiddee_getMetrics(sessionObject.userID, sessionObject.databaseString)).done(function (dataReturned, status, jqXHRObj) {

                }).fail(function (jqXHR, textStatus) {

                });
            },
            error: function (request, error) {
                debugLog("Failed to create profile");
            }
        });
    },

    uppiddee_getMetrics: function (userID, databaseString) {
        debugLog("Getting metrics");
        return $.ajax({
            url: "http://uppiddeeapi.azurewebsites.net/api/testGetMetrics?userID=" +
                userID + "&" + "databaseString=" + databaseString,
            type: 'GET',
            crossDomain: true,
            headers: {
                "Authorization": "Bearer " + sessionObject.tokenStr
            },
            success: function (data) {
                debugLog(data);
                app.createSliders(data);
                app.createReports(data);
                $("#btnLogFeedback").show();
            },
            error: function (request, error) {
                //alert("Get Companies Failed");
            }
        });
    },

    uppiddee_getReport: function (metricID, databaseString, userID, metricText) {
        debugLog("Getting metric by id --- " + metricID);
        return $.ajax({
            url: "http://uppiddeeapi.azurewebsites.net/api/testGetReport?userID=" +
                userID + "&" + "metricID=" + metricID + "&" + "databaseString=" + databaseString,
            type: 'GET',
            crossDomain: true,
            headers: {
                "Authorization": "Bearer " + sessionObject.tokenStr
            },
            success: function (data) {
                debugLog(data);
                app.createReport(data, metricText);
            },
            error: function (request, error) {
                //alert("Get Companies Failed");
            }
        });
    },

    uppiddee_logfeedback: function () {

        /*    var sc = [{
                "ID": "5",
                "Patient_ID": "271655b8-c64d-4061-86fc-0d990935316a",
                "Table_ID": "Allergy_Trns",
                "Checksum": "-475090533",
                "LastModified": "2015-01-22T20:08:52.013"
          },
            {
                "ID": "5",
                "Patient_ID": "271655b8-c64d-4061-86fc-0d990935316a",
                "Table_ID": "Allergy_Trns",
                "Checksum": "-475090533",
                "LastModified": "2015-01-22T20:08:52.013"
          },
            {
                "ID": "5",
                "Patient_ID": "271655b8-c64d-4061-86fc-0d990935316a",
                "Table_ID": "Allergy_Trns",
                "Checksum": "-475090533",
                "LastModified": "2015-01-22T20:08:52.013"
          }];
*/
        var feedbackArray = [];


        $("#sliderDiv" + currentMetricGroup).find(".sliderInput").each(function (i, obj) {

            var sliderValue = $(this).attr("data-value");
            var metricID = $(this).attr('id').replace("slider", "");
            debugLog(sliderValue + " --- " + metricID);

            var feedbackObj = {
                userID: sessionObject.userID.toString(),
                databaseString: sessionObject.databaseString,
                value: sliderValue,
                metricID: metricID
            }

            feedbackArray.push(feedbackObj);
        });



        /* var feedbackValues = {
     userID: sessionObject.userID.toString(),
     moodValue: app.moodSlider.slider('getValue').toString(),
     motivationValue: app.motivationSlider.slider('getValue').toString(),
     satisfactionValue: app.satSlider.slider('getValue').toString(),
     performanceValue: app.perfSlider.slider('getValue').toString()
 };*/

        $("#btnLogFeedback").html("Logging Feeback");
        $.ajax({
            url: 'http://uppiddeeapi.azurewebsites.net/api/testFeedback',
            type: 'POST',
            crossDomain: true,
            headers: {
                "Authorization": "Bearer " + sessionObject.tokenStr
            },
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(feedbackArray),
            success: function (data) {

                $("#btnLogFeedback").html("Submit Feedback");
                alert("Thanks for submitting feedback");
            },
            error: function (request, error) {
                alert("Sorry there was a problem submitting feedback!");
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
                    $("#companiesDD").append("<option companyID='" + data[i].CompanyID + "' databaseID='" + data[i].DatabaseID + "'>" + data[i].CompanyName + "</option>");
                    $("#companiesDDLogin").append("<option companyID='" + data[i].CompanyID + "' databaseID='" + data[i].DatabaseID + "'>" + data[i].CompanyName + "</option>"); //<option value="company1">LYIT</option>
                }

                $("#companiesDDLogin option").each(function () {



                    if (activationData != null && activationData != undefined) {
                        if ($(this).text() == activationData.databaseName) {

                            $(this).attr('selected', 'selected');
                        }
                    }
                });

            },
            error: function (request, error) {
                //alert("Get Companies Failed");
            }
        });
    },

    uppiddee_getDepartments: function (databaseString) {
        debugLog("Getting departments");
        $.ajax({
            url: "http://uppiddeeapi.azurewebsites.net/api/testGetDepartments?databaseString=" +
                databaseString,
            type: 'GET',
            crossDomain: true,
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + sessionObject.tokenStr
            },
            success: function (data) {
                debugLog(data);

                for (var i = 0; i < data.length; i++) {
                    $("#teamDD").append("<option companyID='" + data[i].CompanyID + "' value='" + data[i].ID + "'>" + data[i].Description + "</option>"); //<option value="company1">LYIT</option>
                }
            },
            error: function (request, error) {
                //alert("Get Companies Failed");
            }
        });
    },

    uppiddee_checkToken: function () {

    },

    uppiddee_getToken: function (emailAddress, passwordText) {
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

                sessionObject.emailAddress = emailAddress;
                activationObject.emailAddress = emailAddress;

                sessionObject.tokenStr = tokenStr;


                app.uppiddee_getDepartments(sessionObject.databaseString);
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

    uppiddee_getDatabaseString: function (databaseID, companyID, companyName) {


        debugLog("Clicked Sign Up with databaseID == " + databaseID + "and companyID == " + companyID);

        return $.ajax({
            url: "http://uppiddeeapi.azurewebsites.net/api/testGetDBString?databaseID=" +
                databaseID + "&" + "companyID=" + companyID,
            type: 'GET',
            crossDomain: true,
            headers: {
                "Accept": "application/json"
            },
            success: function (data) {
                debugLog("uppiddee_getDatabaseString successful");
                sessionObject.databaseString = data[0].Description;
                activationObject.databaseName = companyName;

                debugLog("DB String ==" + sessionObject.databaseString);
                app.databaseString = data[0].Description;

                $("#btnSignUp").html("Signing Up");


            },
            error: function (request, error) {
                debugLog("uppiddee_getDatabaseString failed");

            }
        });


    },

    uppiddee_intercomInit: function (nameValue, emailValue) {


        window.Intercom('boot', {
            app_id: "u1rbttyx",
            name: nameValue, // Full name
            email: emailValue, // Email address
            created_at: Math.round((new Date()).getTime() / 1000), // Signup date as a Unix timestamp
            widget: {
                activator: '#IntercomDefaultWidget'
            }
        });


    },

    uppiddee_signup: function (databaseString, emailAddress, passwordText) {
        debugLog("Calling uppiddee_signup with databaseString == " + databaseString);
        var dataBody = {
            databaseString: databaseString,
            emailAddress: emailAddress,
            passwordText: passwordText,

        };

        $("#btnSignUp").html("Signing Up");

        $.support.cors = true;
        return $.ajax({
            url: 'http://uppiddeeapi.azurewebsites.net/api/testSignupUser',
            type: 'POST',
            crossDomain: true,
            headers: {
                "Authorization": "Bearer " + sessionObject.tokenStr
            },
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(dataBody),
            success: function (data) {
                debugLog("Signed up ok");
                app.switchView("signupSection", "userProfileSection");
                sessionObject.userID = data[0].UserID;
                sessionObject.companyID = data[0].CompanyID;
                window.localStorage.setItem("uppiddee_previousactivation", JSON.stringify(activationObject));
                window.localStorage.setItem("uppiddee_token", JSON.stringify(sessionObject));
            },
            error: function (request, error) {
                debugLog("Failed to sign up");
            }
        });
    },

    uppiddee_login: function (databaseString, emailAddress, passwordText) {

        $("#btnLogin").html("Logging In");
        //debugLog("Calling uppiddee_signup with databaseString == " + databaseString);
        var dataBody = {
            databaseString: databaseString,
            emailAddress: emailAddress,
            passwordText: passwordText,

        };

        $.support.cors = true;
        return $.ajax({
            url: 'http://uppiddeeapi.azurewebsites.net/api/testVerifyUser',
            type: 'POST',
            crossDomain: true,
            headers: {
                "Authorization": "Bearer " + sessionObject.tokenStr
            },
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(dataBody),
            success: function (data) {
                debugLog("Logged in ok");
                app.switchView("loginSection", "feedbackSection");
                window.localStorage.setItem("uppiddee_previousactivation", JSON.stringify(activationObject));
            },
            error: function (request, error) {
                debugLog("Failed to login");
                alert("Sorry. We've encountered an error trying to log you in. Please check your username and password are correct.");
            }
        });
    },

    uppiddee_getuserprofiles: function (emailAddress, databaseString) {

        return $.ajax({
            url: "http://uppiddeeapi.azurewebsites.net/api/testGetUserProfile?emailAddress=" +
                emailAddress + "&" + "databaseString=" + databaseString,
            type: 'GET',
            crossDomain: true,
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + sessionObject.tokenStr
            },
            success: function (data) {
                //$("#nameField").html(data[0].firstname +
                //    " " + data[0].lastname);
                //$("#userImg").attr("src", data[0].picURL);

                sessionObject.userID = data[0].userid;
                sessionObject.companyID = data[0].CompanyID;
                sessionObject.firstname = data[0].firstname;
                sessionObject.lastname = data[0].lastname;
                debugLog("Just called getuserprofiles and userid == " + sessionObject.userID);
                window.localStorage.setItem("uppiddee_token", JSON.stringify(sessionObject));

                //

            },
            error: function (request, error) {
                //alert("Get User Profile Failed");
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
        //$('#userImgSelect').append("<img src='" + imageURI + "'></img>");
        $('#userImgSelect').css('background-image', 'url(' + imageURI + ')');
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
document.addEventListener("backbutton", handleBackButton, false);

function handleBackButton() {
    console.log("Back Button Pressed!");
    navigator.app.exitApp();
}

var maxBlockSize = 256 * 1024; //Each file will be split in 256 KB.
var numberOfBlocks = 1;
var selectedFile = null;
var currentFilePointer = 0;
var totalBytesRemaining = 0;
var blockIds = new Array();
var blockIdPrefix = "block-";
var submitUri = null;
var bytesUploaded = 0;
var fileUrl = "";
var newUri;

$(document).ready(function () {


    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        //alert('The File APIs are not fully supported in this browser.');
    }
});

function getFile() {
    window.FilePath.resolveNativePath(fileUrl, successNative, fail);
    debugLog(fileUrl);
}

function successNative(path) {
    ////alert(path);
    window.resolveLocalFileSystemURL("file://" + path, onResolveSuccess, fail);
    //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    fileUrl = path;
    debugLog("Path is " + path);

    newUri = "file://" + path;
    debugLog("file://" + path);

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

        var filePathURI = newUri.substr(newUri.lastIndexOf('/') + 1);
        filePathURI = filePathURI.substring(0, filePathURI.lastIndexOf(".")) + Date.now() + filePathURI.substring(filePathURI.lastIndexOf("."));

        submitUri = baseUrl.substring(0, indexOfQueryStart) + '/' + filePathURI + baseUrl.substring(indexOfQueryStart);
        xhr.open("PUT", submitUri);
        xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
        xhr.setRequestHeader('x-ms-blob-content-type', 'image/jpeg');
        xhr.send(requestData);

        sessionObject.userPicUrl = "https://uppiddeeimages.blob.core.windows.net/pics/" + filePathURI;
        debugLog("User pic url is " + sessionObject.userPicUrl);

    }
}

function resolveSuccess(fileEntry) {
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";

    options.chunkedMode = false;
    options.params = {

    }

    options.headers = {
        'x-ms-blob-type': 'BlockBlob'
    };


    var ft = new FileTransfer();
    var baseUrl = "https://uppiddeeimages.blob.core.windows.net/pics?sr=c&sv=2015-02-21&st=2016-01-13T14%3A50%3A10Z&se=2050-01-13T15%3A50%3A00Z&sp=rwdl&sig=uVfkcOrF9v052KZeBRtCbozZC8AVWYY2XNQqIhoq264%3D";
    var indexOfQueryStart = baseUrl.indexOf("?");
    submitUri = baseUrl.substring(0, indexOfQueryStart) + '/' + options.fileName + baseUrl.substring(indexOfQueryStart);
    //alert(imageURI);
    ft.upload(fileEntry.toURL(), encodeURI(submitUri), win, fail, options);
}

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
    submitUri = baseUrl.substring(0, indexOfQueryStart) + '/' + selectedFile.name + baseUrl.substring(indexOfQueryStart);
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


var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('.w-container').outerHeight();

$(window).scroll(function (event) {
    didScroll = true;
});

setInterval(function () {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 50);

function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if (Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight) {
        // Scroll Down
        $('.w-container').hide();
    } else {
        // Scroll Up
        if (st + $(window).height() < $(document).height()) {
            $('.w-container').show();
        }
    }

    lastScrollTop = st;
}