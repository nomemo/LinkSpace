var tabSpaceItems = []
var TabSpaceDBKey = "TabSpaceData";



//Load Html.
document.addEventListener('DOMContentLoaded', function() {

    //Data init.
    initTabSpaceData()

    //Button Functions.

    var createButton = document.getElementById("createNew");
    if (createButton) {
        createButton.addEventListener("click", createTabSpace);
    } else {
        console.log('createButton not found');
    };

    var clearButton = document.getElementById("clear");
    if (clearButton) {
        clearButton.addEventListener("click", clearAllTabSapce)
    } else {
        console.log('clearButton not found');
    }

    //Li Function && Test to use jQuery methods.
    // $(".todoList").on('click', "li", toggleTodo)
    $(".todoList").on('click', ".delete", function() {
        var index = $(this).closest('li').index()

        //http://stackoverflow.com/questions/5767325/remove-specific-element-from-an-array
        if (index > -1) {
            tabSpaceItems.splice(index, 1);
        }
        console.log('DELEL:' + tabSpaceItems.length);
        saveCurrentItemsToDB();
        $(this).closest('li').remove();
    });

    $(".todoList").on('click', ".load", function() {
        var index = $(this).closest('li').index()
        unfoldTabSpaceItem(index);
    })
});

var initTabSpaceData = function() {
    chrome.storage.local.get(null, function(item) {
        var datas = item[TabSpaceDBKey]
        if (datas instanceof Array) {
            tabSpaceItems = datas;
            console.log('TabSpaceItems Load From Database:' + tabSpaceItems.length);
            updateStats()
        } else {
            console.log('initTabSpaceData Failed, nothing in DB');
        }
    })
}

var clearAllTabSapce = function() {
    //use alert will close the extension.

    // var sureDelete = confirm("Are you sure to delete all?");
    // if (sureDelete) {
    // chrome.storage.local.clear()
    // updateStats()
    // }
    chrome.storage.local.clear()
    updateStats()

    //How to clean a array: http://stackoverflow.com/questions/1232040/empty-an-array-in-javascript
    tabSpaceItems = []

}

var createTabSpace = function() {
    getCurrentTabUrl(function(tabUrls) {
        // console.log("CreateTabSpace + " + tabUrls);
        // renderStatus(tabUrls.length)

        //Why would a JavaScript variable start with a dollar sign?
        //http://stackoverflow.com/questions/205853/why-would-a-javascript-variable-start-with-a-dollar-sign
        //jQuery对象与dom对象 http://www.cnblogs.com/zxjyuan/archive/2010/05/07/1729462.html
        var $input = $("#todoInput");
        if ($input.val().length) {

            $(".todoList").append(todoItem($input.val()));
            var userInput = $input.val();
            var tabSpaceItem = TabSpaceItem(userInput, tabUrls)
            $input.val("");

            saveNewTabSpaceItemToDB(tabSpaceItem)
            updateStats();

        } else {
            console.log('Not support empty name');
            //TODO: ADD Alert.
        }

    })
}

var unfoldTabSpaceItem = function(index) {
    console.log('unfoldTabSpaceItem' + index);
    if (index < 0 || index >= tabSpaceItems.length) {
        return;
    }

    var tabUrls = tabSpaceItems[index].tabUrls;
    // for (var i = tabUrls.length - 1; i >= 0; i--) {
    //     // console.log('Will open url + ', tabUrls[i]);        
    //     var oneTab = {
    //         url:tabUrls[i]
    //     }

    // chrome.tabs.create(oneTab, function(tab){

    // })

    chrome.windows.create({
        url: tabUrls
    }, function(returnWindow) {});
}

var getCurrentTabUrl = function(callback) {
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

var saveNewTabSpaceItemToDB = function(tabSpaceItem) {
    //http://stackoverflow.com/questions/27695709/chrome-storage-sync-set-variable-key
    tabSpaceItems.push(tabSpaceItem)
    saveCurrentItemsToDB()
}

var saveCurrentItemsToDB = function() {
    if (tabSpaceItems.length > 0) {
        var toDBData = {};
        toDBData[TabSpaceDBKey] = tabSpaceItems;
        chrome.storage.local.set(toDBData, function() {
            // Notify that we saved.
            console.log('Settings saved');
        });

    } else {
        clearAllTabSapce()
    }
}

// <li>
//      <span>Delete me in the first time.</span>
//      <a href="#" class="delete">delete</a>
//      <a href="#" class="load">load</a>
//  </li>

var todoItem = function(text) {
    var innerHtml = '<li><span>' + text + '</span>' + '<a href="#" class="delete">delete</a><a href="#" class="load">load</a>' + '</li>'
    return innerHtml;
};

function TabSpaceItem(userInput, tabUrls) {
    var saveTime = new Date();
    // var saveTimeString = saveTime.toString();
    this.saveTime = saveTime;

    var spaceItem = {
        userInput: userInput,
        tabUrls: tabUrls,
        saveTime: saveTime
    };
    return spaceItem;
}


var updateStats = function() {
    $(".todoList").empty();
    for (var i = tabSpaceItems.length - 1; i >= 0; i--) {
        var oneItem = tabSpaceItems[i];
        var showString = oneItem.userInput + " [" + oneItem.tabUrls.length + "]";
        var item = todoItem(showString)
        $(".todoList").append(item);
    };
    // $("#totalTodo").text(
    //     $(".todoList li").length
    // );
    // $("#remainTodo").text(
    //     $(".todoList li:not(.done)").length
    // );
    // if ($(".todoList li").length === 0) {
    //     $(".todoList").addClass("empty")
    // } else {
    //     $(".todoList").removeClass("empty")
    // }
};


//Original Todo Demo

// var toggleTodo = function() {

//     var $li = $(this);
//     $li.toggleClass("done");
//     $li.find('input[type="checkbox"]')
//         .attr("checked", $li.hasClass('done'));

//     updateStats();
// };

// var resetTodo = function() {

//     var sample = [{
//         done: false,
//         text: "Remember to buy milk."
//     }, {
//         done: true,
//         text: "Call Mom."
//     }, {
//         done: false,
//         text: "Call Dad."
//     }]

//     $(".todoList li").remove();
//     $.each(sample, function() {
//         $(".todoList").append(todoItem(this.text, this.done));
//     });
//     updateStats();

// };