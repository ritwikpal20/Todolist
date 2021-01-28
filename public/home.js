$(".aDelete").click((event) => {
    listId = $(event.target).data("listid");
    $.post("/home/delete", { listId }, (data) => {
        $(event.target).parent().parent().remove();
    });
});
