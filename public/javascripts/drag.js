
var el = document.getElementById('list1');
var sortable1 = Sortable.create(el, {
    group:{
        name: 'shared',
        pull: 'clone',
    },
    animation: 150,
    sort: false,
});


// var sortable3 = Sortable.create(document.getElementById('list3'), {
//     group: {
//         name: 'shared',
//         pull: true,
//     },
//     animation: 150,
//     onAdd: function (evt) {
//         if(evt.to.children.length > 1){
//             evt.item.remove();
//         }
//     },
//     onRemove: function (evt) {    
//         evt.item.remove();
//      }
// });

var elements = document.getElementsByClassName('sortable');

for (var i = 0; i < elements.length; i++) {
    new Sortable(elements[i], {
        group: {
            name: 'shared',
            pull: true,
        },
        animation: 150,
        onAdd: function (evt) {
            if(evt.to.children.length > 1){
                evt.item.remove();
            }
        },
    });
}