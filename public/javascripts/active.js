// get all links


var links = document.querySelectorAll("a");

// check if the href is the same as the current url

for (let link of links) {
    link.classList.remove("active");
    if (link.href == window.location.href) {
        link.classList.add("active");
    }
}