"use strict";
/*
app.js, main Angular application script
define your module and controllers here
*/

angular.module('CommentApp', ['ui.bootstrap'])
.config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = '5ACCDoszq0uGqk9CR5EBo8enmv0LOEA60Qz1I8CT'; //application id
    $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'utMAzQBzlXBtWG0aBQIPmkGap0we2qeqo9RXijWA';   //rest API key
    
})

.controller('CommentsController', function($scope, $http) {
    var commentsUrl = 'https://api.parse.com/1/classes/comments';
    //order comments in increasing order based on the number of votes
    $scope.order = '-votes';
    
    //refresh comments and reorder if number of votes is changed in a comment
    $scope.refreshComments = function() {
        //get all comments
        $scope.loading = true;
        $http.get(commentsUrl + '?order=-votes')
        .success(function(data) {
            $scope.comments = data.results;
        })
        .error(function(err) {
            console.log(err);
        })
        .finally(function() {
            $scope.loading = false;
        });
    };
    
    //call refreshComments() to get the initial set of comments on page load
    $scope.refreshComments();
    
    //initialize a new comment object on the scope for the new comment form and set initial votes to 0
    $scope.newComment = {votes: 0};
    
    //function to add new comments to the list
    $scope.addComment = function() {
        $scope.inserting = true;
        $http.post(commentsUrl, $scope.newComment)
        .success(function(responseData) {
            $scope.newComment.objectId = responseData.objectId;
            $scope.comments.push($scope.newComment);
            $scope.newComment = {};
            $scope.newComment = {votes: 0};
            console.log("it works");
            
        })
        
        .error(function(err) {
            console.log(err)
        })
        
        .finally(function () {
            $scope.inserting = false;
        });
    }; //addComment
    
    
    $scope.removeComment = function(comment) {
        $scope.loading = true;
        $http.delete(commentsUrl + '/' + comment.objectId, comment)
        .success(function(responseData) {
            console.log("deleted!");
        })
        
        .error(function(err) {
            console.log(err);
        })
        
        .finally(function () {
            $scope.refreshComments();
        });
    }; //removeComment
    
    //function that adds/removes a vote
    $scope.incrementVotes = function(comment, amount) {
        //initial voting starts at 0 if there are no votes
        if(comment.votes === 0) {
            console.log("zero");
            comment.votes = 0;
        }
        
        //if there are already existing votes
        if (!(comment.votes == 0 && amount < 0)) {
            var countData = { votes: { __op: "Increment", amount: amount} };
            $scope.updating = true;
            $http.put(commentsUrl + '/' + comment.objectId, countData)
            .success(function(responseData) {
                console.log(responseData);
                comment.votes = responseData.votes;
            })
            .error(function(err) {
                console.log(err);
            })
            .finally(function() {
                $scope.updating = false;
            });
            
        }
        
    }; //incrementVotes
    
});//controller
