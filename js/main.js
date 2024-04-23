const golButton = document.getElementById("gol-button");
golButton.addEventListener("click", () => {
    if(document.getElementById("gol")){
        document.getElementById("gol").remove();
    } else {
        const container = document.createElement("div");
        container.id = "gol"
        container.innerHTML = `
            <div class="controlbar">
                <img class="clickable" src="/img/x.svg" alt="close">
            </div>
            <iframe src="/GoL/index.html" frameborder="0" title="Game of Life" referrerpolicy="no-referrer"></iframe><br>
            <button class="button" onclick="document.querySelector('div#gol>iframe').contentWindow.location.reload();">
                Refresh
            </button>
        `
        document.querySelector('body > section').prepend(container);
        const close = document.querySelector("img.clickable");
        close.addEventListener("click", () => document.getElementById("gol").remove())
    }
});
/* 
const link = document.createElement("link");
link.href = "/css/dark.css";
link.type = "text/css";
link.rel = "stylesheet";
document.head.append(link); */