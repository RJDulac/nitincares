//slider
var i = 0;
var images = ["img/nitin1.jpg", "img/nitin2.jpg"];
var time = 4500;

//change image
function changeImg() {
  document.slide.src = images[i];
  if (i < images.length - 1) {
    i++;
  } else {
    i = 0;
  }
  setTimeout("changeImg()", time);
}
window.onload = changeImg;

//pdf viewer --transpiled to es5
var url = "../pdf/article.pdf";
var pdfDoc = null,
  pageNum = 1,
  pageIsRender = false,
  pageNumIsPending = null;
var scale = 1.5,
  canvas = document.getElementById("pdf-render"),
  ctx = canvas.getContext("2d"); //render page

var renderPage = function renderPage(num) {
  pageIsRender = true; //get page

  pdfDoc.getPage(num).then(function(page) {
    //set scale
    var viewport = page.getViewport({
      scale: scale
    });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    var renderCtx = {
      canvasContext: ctx,
      viewport: viewport
    };
    page.render(renderCtx).promise.then(function() {
      pageIsRendering = false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    }); //output current page

    document.getElementById("page-num").textContent = num;
  });
}; // check for pages rendering

var queueRenderPage = function queueRenderPage(num) {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
}; //show previous page

var showPrevPage = function showPrevPage() {
  if (pageNum <= 1) {
    return;
  }

  pageNum--;
  queueRenderPage(pageNum);
}; //show next page

var showNextPage = function showNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }

  pageNum++;
  queueRenderPage(pageNum);
}; //get pdf

pdfjsLib
  .getDocument(url)
  .promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById("page-count").textContent = pdfDoc.numPages;
    renderPage(pageNum);
  })
  .catch(function(err) {
    //display error by creating a div
    var div = document.createElement("div");
    div.className = "error";
    div.appendChild(document.createTextNode(err.message)); //insert element before div and canvas

    document.getElementsByTagName("body")[0].insertBefore(div, canvas); //remove top bar

    document.getElementsByClassName("top-bar")[0].style.display = "none";
  }); //button events

document.getElementById("prev-page").addEventListener("click", showPrevPage);
document.getElementById("next-page").addEventListener("click", showNextPage);

//nav menu
var menu = document.getElementById("main-nav");
var closeMenu = document.getElementById("close-menu");
var openMenu = document.getElementById("open-menu");

document.getElementById("open-menu").addEventListener("click", function() {
  menu.classList.add("show-nav");
  menu.classList.remove("hide-nav");
  openMenu.style.display = "none";

  closeMenu.style.display = "block";
});
document.getElementById("close-menu").addEventListener("click", function() {
  // menu.classList.remove('show-nav');
  menu.classList.add("hide-nav");
  // menu.classList.remove("show-nav");
  openMenu.style.display = "block";
  closeMenu.style.display = "none";
});
