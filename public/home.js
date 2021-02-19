$(".aDelete").click((event) => {
    listId = $(event.target).data("listid");
    $(".yesDelete").click(() => {
        $.post("/home/delete", { listId }, (data) => {
            $(event.target).parent().parent().remove();
        });
    });
});
