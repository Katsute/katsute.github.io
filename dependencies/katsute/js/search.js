//---
//layout: compress
//---
//{% capture newline %}
//{% endcapture %}
//window.pages = {
//    {% include data/pages.liquid %}
//};

const searchIndex = lunr(function() {
    this.ref("id");
    this.field("title", { boost: 10 });
    this.field("content");
    for (let key in window.pages) {
        this.add({
            "id"     : key,
            "title"  : pages[key].title,
            "content": pages[key].content
        });
    }
});

const noResults = "no results";

document.addEventListener("DOMContentLoaded", function(){
    let q;

    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++){
        const pair = vars[i].split("=");
        if (pair[0] === 'q')
            q = decodeURIComponent(pair[1].replace(/\+/g, "%20"));
    }

    document.getElementById("search").value = q;

    const results = searchIndex.search(q);
    const resultPages = results.map(function(m){ return pages[m.ref];});

    const regexp = new RegExp(q.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gmi');

    let resultsString = "";
    resultPages.forEach(function(r){
        let result =
            r.content.length > 300
            ? r.content.substring(0, 300) + " …"
            : r.content;
        resultsString += "<li class='border-bottom px-2 py-3 search-item'>";
        resultsString += "<a href='" + r.path +"'>";
        resultsString += r.crumb;
        resultsString += "<h5 class='my-1 text-body'>" + r.title.replace(regxp, function(str){return '<mark class="text-primary">' + str + '</mark>';}) + "</h5>";
        resultsString += "<p class='text-body mb-0'>";
        resultsString += result.replace(regexp, function(str){return '<mark>' + str + '</mark>';});
        resultsString += "</p>";
        resultsString += "</a>";
        resultsString += "</li>";
    });

    document.getElementById("results").innerHTML = resultsString === "" ? noResults : resultsString;
});