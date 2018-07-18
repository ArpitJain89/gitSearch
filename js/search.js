"use strict";
// Disable caching of AJAX responses. This is mainly for IE support. Other browsers don't require this explicitly, as they don't cache automatically.
$.ajaxSetup({
    cache: false
});

// Function to sort user with respect to the type(Name OR Rank).
function sortUser(type) {
    var usersList = $("div.user");
    if (type == "sortByNameAZ") {

        var alphabeticallyOrderedDivs = usersList.sort(function (a, b) {
            return $(a).find("h3").text() > $(b).find("h3").text();
        });

    } else if (type == "sortByNameZA") {

        var alphabeticallyOrderedDivs = usersList.sort(function (a, b) {
            return $(a).find("h3").text() < $(b).find("h3").text();
        });

    } else if (type == "sortByRankAsc") {

        var alphabeticallyOrderedDivs = usersList.sort(function (a, b) {
            return parseInt($(a).find(".userContent p .score").text()) > parseInt($(b).find(".userContent p .score").text());
        });

    } else if (type == "sortByRankDesc") {
        var alphabeticallyOrderedDivs = usersList.sort(function (a, b) {
            return parseInt($(a).find(".userContent p .score").text()) < parseInt($(b).find(".userContent p .score").text());
        });
    }
    $("#gitUsersList").html(alphabeticallyOrderedDivs);
}

// Function to get user list.
function getUsersList() {
    var userName = $("#userName").val();
    var url = "https://api.github.com/search/users?q=" + userName;
    $.ajax({
        url: url,
        type: 'GET',
        success: function (response) {
            var users = response.items;
            var userCount = users.length;
            var html = "";

            $("#userCount").html("Total Result : " + userCount);
            $("#page-selection").html("");
            for (var i = 0; i < 5 && i < userCount; i++) {
                var userId = users[i].id;
                var UserImage = users[i].avatar_url;
                var userFullName = users[i].login;
                var userProfileId = users[i].html_url;
                var userRepoUrl = users[i].repos_url;
                var userScore = Math.round(users[i].score);
                html += '<div class="user" id="' + userId + '"><div class="userDisplay"><div class="userPhoto"><img src="' + UserImage + '" alt="Avatar"></div><div class="userInfo"><div class="userName"><h3>' + userFullName + '</h3></div><div class="userId"><label>Profile Id :- </label>' + userProfileId + '</div><div class="userContent"><p><label>User Score :- </label><label class="score">' + userScore + '</label></p><p><label>Followers Count :- </label>0</p></div></div><div class="detailsButton"><button data-toggle="collapse" data-target="#git_' + userId + '" data-url="' + userRepoUrl + '" onclick="getUserDetails(this);">Details</button></div></div><div id="userDetails"><div id="git_' + userId + '" class="collapse"></div></div></div>';

            }
            $("#gitUsersList").html(html);
            if (userCount > 5) {
                $('#page-selection').bootpag({
                    total: Math.ceil(userCount / 5),
                    page: 1,
                    maxVisible: 10
                }).on("page", function (event, num) {
                    var startNumber = 0;
                    var html = "";
                    if (num > 1) {
                        startNumber = num * 5 - 5;
                    }

                    for (var i = startNumber, j = 1; j < 5 && i < users.length; i++ , j++) {
                        var userId = users[i].id;
                        var UserImage = users[i].avatar_url;
                        var userFullName = users[i].login;
                        var userProfileId = users[i].html_url;
                        var userRepoUrl = users[i].repos_url;
                        var userScore = users[i].score;
                        html += '<div class="user" id="' + userId + '"><div class="userDisplay"><div class="userPhoto"><img src="' + UserImage + '" alt="Avatar"></div><div class="userInfo"><div class="userName"><h3>' + userFullName + '</h3></div><div class="userId"><label>Profile Id :- </label>' + userProfileId + '</div><div class="userContent"><p><label>User Score :- </label><label class="score">' + userScore + '</label></p><p><label>Followers Count :- </label>0</p></div></div><div class="detailsButton"><button data-toggle="collapse" data-target="#git_' + userId + '" data-url="' + userRepoUrl + '" onclick="getUserDetails(this);">Details</button></div></div><div id="userDetails"><div id="git_' + userId + '" class="collapse"></div></div></div>';

                    }
                    $("#gitUsersList").html(html);
                });
            } else {
                $('#page-selection').html('');
            }



        },
        error: function (xhr, textStatus, errorThrown) {
            var reason = xhr.responseText;
            var code = xhr.status;
        }
    });
}

//Function to get user details.
function getUserDetails(data) {
    var url = data.getAttribute('data-url');
    var target = data.getAttribute('data-target');
    var html = '<li class="green"><p id="dataLabel">Repository Name</p><p id="dataValue">Language</p></li>';
    $.ajax({
        url: url,
        type: 'GET',
        success: function (response) {
            if (response.length > 0) {
                response.forEach(element => {
                    var dataLabel = element.name;
                    var dataValue = element.language;
                    html += '<li><p id="dataLabel">' + dataLabel + '</p><p id="dataValue">' + dataValue + '</p></li>';
                });
                $(target).html('<ul>' + html + '</ul>');
            } else {
                $(target).html('<div class="info"><h4>No Repository Available</h4></div>');
            }

        },
        error: function (xhr, textStatus, errorThrown) {
            var reason = xhr.responseText;
            var code = xhr.status;
            $(target).html('<div class="info"><h4>No Repository Available</h4></div>');//This is temparory written for handel two demo user.
        }
    });
}
