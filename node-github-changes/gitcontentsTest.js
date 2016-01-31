/*
 * Copyright 2012 Cloud9 IDE, Inc.
 *
 * This product includes software developed by
 * Cloud9 IDE, Inc (http://c9.io).
 *
 * Author: Mike de Boer <info@mikedeboer.nl>
 */

"use strict";

var Assert = require("assert");
var Client = require("./../../index");

var path = "test-input7.txt";

describe("[gitcontents]", function() {
    var client;
    var token = "c286e38330e15246a640c2cf32a45ea45d93b2ba";

    beforeEach(function() {
        client = new Client({
            version: "4.0.0"
        });
        client.authenticate({
    	    type: "basic",
    	    username: "southbite",
    	    password: "FilipBallFlow01"
    	});
    });

    /*
    it("should successfully execute GET /repos/:user/:repo/contents/:path (getReadMe)",  function(next) {
        client.gitcontents.getReadMe(
            {
                user: "southbite",
                repo: "fire-grate-test-repo"
            },
            function(err, res) {
                Assert.equal(err, null);
                console.log(res);
                // other assertions go here
                next();
            }
        );
    });

    */
    
    it("should successfully execute PUT /repos/:user/:repo/contents/:path (createFile)",  function(next) {
    	
    	this.timeout(20000);
    	
        client.gitcontents.createFile(
            {
            	user: "southbite",
                repo: "fire-grate-test-repo",
                path: path,
                message: "Test input",
                content: new Buffer("Some test content").toString('base64')
            },
            function(err, res) {
            	//console.log(res);
                Assert.equal(err, null);
                // other assertions go here
                next();
            }
        );
    });

    var updateSha = null;
    
    it("should successfully execute GET /repos/:user/:repo/contents/:path (getContents)",  function(next) {
    	
    	this.timeout(20000);
    	
        client.gitcontents.getContents(
            {
            	user: "southbite",
                repo: "fire-grate-test-repo",
                path: path
            },
            function(err, res) {
            	//console.log(res);
                Assert.equal(err, null);
                
                updateSha = res.sha;
                
                // other assertions go here
                next();
            }
        );
    });
    
    var updatedSha = null;

    it("should successfully execute PUT /repos/:user/:repo/contents/:path (updateFile)",  function(next) {
    	
    	this.timeout(20000);
    	
        client.gitcontents.updateFile(
            {
            	user: "southbite",
                repo: "fire-grate-test-repo",
                path: path,
                message: "Test input update",
                content: new Buffer("Some test content edited").toString('base64'),
                sha: updateSha
            },
            function(err, res) {
            	
            	console.log(res);
            	updatedSha = res.content.sha;
            	
                Assert.equal(err, null);
                // other assertions go here
                next();
            }
        );
    });
     
    
    it("should successfully execute DELETE /repos/:user/:repo/contents/:path (deleteFile)",  function(next) {
    	
    	this.timeout(20000);
    	
        client.gitcontents.deleteFile(
            {
            	user: "southbite",
                repo: "fire-grate-test-repo",
                path: path,
                message: "Test input delete",
                sha: updatedSha
            },
            function(err, res) {
                Assert.equal(err, null);
                // other assertions go here
                next();
            }
        );
    });

});
