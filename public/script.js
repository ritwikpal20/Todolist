//Changing time every one minute
setInterval(() => {
    var currentDate = new Date();
    //retreiving Month,day, year
    const longEnUSFormatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const dmy = longEnUSFormatter.format(currentDate);

    //retreiving time
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    $(".divTime").text(dmy + " , " + strTime);
}, 1000);
$(".btnDelete").click((event) => {
    if ($("input[type=checkbox]:checked").length <= 0) {
        var x = event.clientX; // Get the horizontal coordinate
        var y = event.clientY; // Get the vertical coordinate
        $(".dialog").remove();
        $(".divTodolistAddNewItem").append(
            "<p class='dialog' data-click='yes'>"
        );
        $(".dialog").css({ top: y + "px", left: x + "px", position: "fixed" });
        $(".dialog").text("Please select some items to delete");
    } else {
        let itemsToBeDeleted = [...$("input[type=checkbox]:checked")];
        let idsToDelete = [];
        itemsToBeDeleted.forEach((e) => {
            id = $(e).attr("id").split("-")[1];
            idsToDelete.push(id);
        });
        $.post(
            `${$(".divListName").data("listname")}/delete`,
            { idsToDelete },
            () => {
                itemsToBeDeleted = itemsToBeDeleted.map((e) => {
                    return $(e).parent();
                });
                itemsToBeDeleted.forEach((e) => {
                    $(e).remove();
                });
            }
        );
    }
});
$(".btnAddNewItem").click((event) => {
    // $(".dialog").remove();
    if ($(".inpNewItem").val() == "") {
        var x = event.clientX; // Get the horizontal coordinate
        var y = event.clientY; // Get the vertical coordinate
        $(".divTodolistAddNewItem").append(
            "<p class='dialog' data-click='yes'>"
        );
        $(".dialog").css({ top: y + "px", left: x + "px", position: "fixed" });
        $(".dialog").text("Please write some content");
    } else {
        $("#formAddItem").submit();
    }
});
//the mouseleave event was getting triggered even on mouseclick event . therefore added a data attribute to check when the click event was happening
$(".btnDelete").on("mouseleave", (event) => {
    if ($(".dialog").data("click") == "yes") {
        $(".dialog").data("click", "no");
    } else $(".dialog").remove();
});
$(".btnAddNewItem").on("mouseleave", (event) => {
    if ($(".dialog").data("click") == "yes") {
        $(".dialog").data("click", "no");
    } else $(".dialog").remove();
});

//for mobile devices
document.onpointerdown = (event) => {
    if ($(".dialog").data("click") == "yes") {
        $(".dialog").data("click", "no");
    } else $(".dialog").remove();
};
document.onpointerdown = (event) => {
    if ($(".dialog").data("click") == "yes") {
        $(".dialog").data("click", "no");
    } else $(".dialog").remove();
};

$(".inpNewItem").on("keydown", (e) => {
    if ($(".inpNewItem").val() != "") {
        if (e.which == 13) $("form").submit();
    } else {
        if (e.which == 13) {
            e.preventDefault();
            return false;
        }
    }
});

$(".divTodolistItem input").click((event) => {
    let itemToBeChecked = $(event.target);
    let idArray = [...itemToBeChecked.attr("id")];
    let idToBeChecked = idArray.slice(5, idArray.length).join("");
    if (itemToBeChecked.is(":checked")) {
        $.post(
            `${$(".divListName").data("listname")}/check`,
            { idToBeChecked },
            () => {
                $(itemToBeChecked.next().children()).addClass("checked");
            }
        );
    } else {
        $.post(
            `${$(".divListName").data("listname")}/uncheck`,
            { idToBeChecked },
            () => {
                $(itemToBeChecked.next().children()).removeClass("checked");
            }
        );
    }
});

//change item position using mouse
$(".divTodolistItems").sortable({
    axis: "y",
    update: function (event, ui) {
        var data = $(this).sortable("serialize");

        $.post(
            "/home/item/sort",
            { data, listName: `${$(".divListName").data("listname")}` },
            (data) => {}
        );
    },
});

//sort list using up down buttons
$(".upBtn").click((event) => {
    current = $(event.target).parent().parent().parent();
    if (current.prev()[0]) {
        prev = current.prev();
        prev.before(current);

        data = [];
        items = [...$(".divTodolistItem")];
        items.forEach((elem) => {
            data.push($(elem).attr("id"));
        });
        data = data.map((elem) => {
            return elem.replace("-", "[]=");
        });
        data = data.join("&");

        $.post(
            "/home/item/sort",
            { data, listName: `${$(".divListName").data("listname")}` },
            (data) => {}
        );
    }
});
$(".downBtn").click((event) => {
    current = $(event.target).parent().parent().parent();
    if (current.next()[0]) {
        next = current.next();
        next.after(current);

        data = [];
        items = [...$(".divTodolistItem")];
        items.forEach((elem) => {
            data.push($(elem).attr("id"));
        });
        data = data.map((elem) => {
            return elem.replace("-", "[]=");
        });
        data = data.join("&");

        $.post(
            "/home/item/sort",
            { data, listName: `${$(".divListName").data("listname")}` },
            (data) => {}
        );
    }
});
