// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

tabs = {};
tabIds = [];
tabUrls = []

document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById("SaveNew");
    if (button) {
        button.addEventListener("click", clickSave);
    } else {
        console.log('Button not found');
    }
});



function clickSave() {
    getCurrentTabUrl(function(tabUrls) {
        console.log(tabUrls);
        // renderStatus(tabUrls.length)
        saveTab(tabUrls)
    })
}


function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true
    }
    tabUrls = []
    chrome.tabs.query({
        currentWindow: true
    }, function(result) {
        for (var i = 0; i < result.length; i++) {
            var tab = result[i];
            // console.log(tab.url);
            tabUrls.push(tab.url);
        }
        callback(tabUrls)
    })
}

function saveTab(tabUrls) {

    if (tabUrls.length == 0) {
        return;
    }
    var saveTime = new Date();
    chrome.storage.sync.set({
        saveTime: tabUrls
    }, function() {
        // Notify that we saved.
        console.log('Settings saved');

        var x = document.createElement("li");
        var t = document.createTextNode(saveTime);
        x.appendChild(t);
        document.getElementById("SaveTabSpace").appendChild(x);

    });
}

function loadSaveTabs() {   
    chrome.storage.
}