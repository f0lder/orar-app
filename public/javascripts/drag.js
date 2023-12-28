
var el = document.getElementById('list1');
var sortable1 = Sortable.create(el, {
    group: 'shared',
    animation: 150,
});
var sortable2 = Sortable.create(document.getElementById('list2'), {
    group: 'shared',
    animation: 150,
});