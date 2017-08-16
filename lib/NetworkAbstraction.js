"use strict";

var https = require("https");
var url = require("url");
var request = require("request");

function NetworkAbstraction(apiKey, domain) {
    this._hostname = domain;
    this._apiVersion = 'v1';
    this._apiKey = apiKey;
}

NetworkAbstraction.prototype.get = function(what, query, followLink, callback) {
    this._sendHttpReqNoBody("GET", this._constructURL(what), query, followLink, callback);
};

NetworkAbstraction.prototype.post = function(where, what, query, callback) {
    this._sendHttpReq("POST", this._constructURL(where), what, query, callback);
};

NetworkAbstraction.prototype.put = function(where, what, query, callback) {
    this._sendHttpReq("PUT", this._constructURL(where), what, query, callback);
};

NetworkAbstraction.prototype.delete = function(where, query, callback) {
    this._sendHttpReqNoBody("DELETE", this._constructURL(where), query, callback);
};

// POST and PUT requests are mostly identical.
NetworkAbstraction.prototype._sendHttpReq = function(method, where, what, query, callback) {
    var opts = {};
    if(what == undefined) opts.body = "";
    else opts.body = JSON.stringify(what);
    opts.headers = {};
    opts.headers['Content-Length'] = opts.body.length;
    opts.headers['Content-Type'] = "application/json";
    opts.headers['Authorization'] = "SSWS " + this._apiKey;
    opts.method = method;
    opts.uri = url.parse(where);
    if(query != null) opts.qs = query;
    var _this = this;
    request(opts, function(error, clientResp, resp) { _this._handleResponse(error, false, clientResp, resp, callback) });
};

/*
*   Old version did not have followLink flag, so to support backwards compatibility
*   we check if followLink is a function
*   if so, the caller is expecting the old version of this function,
*   if followLink is a boolean, caller is expecting new version
*
*   *NOTE* all this is only relevant to Listing functions, nothing else uses filters
*/
NetworkAbstraction.prototype._sendHttpReqNoBody = function(method, where, query, followLink, callback) {
    var opts = {};
    //check if followLink is a function, if so do backwards compatable support
    //if not, proceed normally
    if(typeof followLink == 'function')
    {
        //set nonexistant callback to followLink
        callback = followLink;
        //default followLink flag to true
        followLink = true;
    }
    if(query != null) opts.qs = query;
    opts.headers = {};
    opts.headers['Authorization'] = "SSWS " + this._apiKey;
    opts.method = method;
    opts.uri = url.parse(where);
    var _this = this;
    request(opts, function(error, clientResp, resp) { _this._handleResponse(error, followLink, clientResp, resp, callback) });
};

NetworkAbstraction.prototype._handleResponse = function(error, followLink, clientResp, resp, callback) {
    //console.log(require('util').inspect(clientResp, {depth:null}));
    if(callback == undefined) return;
    if(error) {
        callback({error: error, success: false});
    } else {
        var jsonResp;
        if(clientResp.statusCode == 200) {
            try {
                jsonResp = JSON.parse(resp);
            } catch(err) {
                callback({success: false, paged: false, error: "Returned JSON is invalid", resp: resp});
            }
            var outObj = {success: true, paged: false};
            if (jsonResp.obj != undefined) outObj.resp = jsonResp.obj;
            else outObj.resp = jsonResp;
            if (clientResp.headers.link != undefined) {
                // Follow Pagination links
                outObj.paged = true;
                outObj.pageEnd = true;
                var links = clientResp.headers.link.split(",");
                for(var i in links) {
                    var link = links[i];
                    var bits = link.split(";");
                    if (bits[1] == " rel=\"next\"") {
                        var finalLink = bits[0].substr(2, bits[0].length - 3);
                        outObj.pageEnd = false;
                        if(!followLink)
                        {
                            outObj.next = finalLink;
                            break;
                        }
                        else {
                            this._sendHttpReqNoBody("GET", finalLink, null, callback);
                        }
                    }
                }
            }
            callback(outObj);
        } else if(clientResp.statusCode == 204) {
            callback({success: true, paged: false});
        } else if(clientResp.statusCode == 401) {
            try {
                resp = JSON.parse(resp);
            } catch (err) {
                // no-op
            }
            callback({success: false, paged: false, error: "Unauthorized", resp: resp});
        } else {
            callback({success: false, paged: false, error: "Received HTTP Status code: " + clientResp.statusCode, resp: resp})
        }
    }
};

NetworkAbstraction.prototype._constructURL = function (what) {
    return "https://" + this._hostname + "/api/" + this._apiVersion + "/" + what;
};

module.exports = NetworkAbstraction;
