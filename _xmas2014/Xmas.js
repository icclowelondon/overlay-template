// requires: jquery

function Xmas() {
    this.$c = $('<div class="xmas"><img src="_xmas2014/xmas.jpg" /></div>');
    this.$img = this.$c.find('img');
    this.props = {
        width:900,
        height:545,
        yesButtonRect:{x:316, y:173, width:270, height:39},
        noButtonRect:{x:268, y:488, width:365, height:40},
        // bounds are calculated in start() so you can manipulate the 
        //  rectangles above, which is more intuitive / convemtional
        yesButtonRatioBounds:{},
        noButtonRatioBounds:{}
    };
    this.url = "http://jumpers.savethechildren.org.uk/";
    $(document).ready(function() {
        // only add the overlay if it is earlier than 13 december 2014
        if(new Date().getTime() < Date.parse("December 13, 2014")){
            xmas.start();
        }
    });
}
Xmas.prototype.createRatioBounds = function(fromRect, toBounds) {
    var w = xmas.props.width;
    var h = xmas.props.height;
    toBounds.left = fromRect.x / w;
    toBounds.top = fromRect.y / h;
    toBounds.right = (fromRect.x + fromRect.width) / w;
    toBounds.bottom = (fromRect.y + fromRect.height) / h;
};
Xmas.prototype.start = function() {
    xmas.createRatioBounds(xmas.props.yesButtonRect, xmas.props.yesButtonRatioBounds);
    xmas.createRatioBounds(xmas.props.noButtonRect, xmas.props.noButtonRatioBounds);
    $('head').append('<link rel="stylesheet" href="_xmas2014/xmas.css" type="text/css" />');
    $('body').append(xmas.$c);
    xmas.$c.click(xmas.onContainerClick);
    xmas.$img.click(xmas.onImgClick);
    $(window).bind('resize', xmas.onWindowResize);
    xmas.onWindowResize();
};
Xmas.prototype.onWindowResize = function(){
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var marginX = 20;
//    var windowRatio = windowWidth / windowHeight;
    var imageRatio = xmas.props.width / xmas.props.height;
    var newImageWidth = Math.min(Math.round(windowWidth - 2 * marginX), xmas.props.width);
    var newImageHeight = Math.round(newImageWidth / imageRatio);
    // x centring takes care of itself via text align center.
    var marginY = Math.max(0, Math.round((windowHeight - newImageHeight) / 2));
    xmas.$img.css({width:newImageWidth, height:newImageHeight, marginTop:marginY});
};
Xmas.prototype.onImgClick = function(e){
    // otherwise we get the container click too
    e.stopPropagation(); 
    var offset = $(this).offset();
    var clickX = e.pageX - offset.left;
    var clickY = e.pageY - offset.top;
    var width = $(this).width();
    var height = $(this).height();
    var ratioX = clickX / width;
    var ratioY = clickY / height;
    // if over yes button then go, any other click closes
    if(
            ratioX >= xmas.props.yesButtonRatioBounds.left
            && ratioX <= xmas.props.yesButtonRatioBounds.right
            && ratioY >= xmas.props.yesButtonRatioBounds.top
            && ratioY <= xmas.props.yesButtonRatioBounds.bottom
            ){
        xmas.go();
    }else{
        xmas.close();
    }
};
Xmas.prototype.onContainerClick = function(e){
    xmas.close();
};
Xmas.prototype.close = function(){
    xmas.$c.stop().fadeOut(200);
};
Xmas.prototype.go = function(){
    xmas.close();
    window.open(xmas.url, '_blank');
};

// embrace the global state.
window.xmas = new Xmas();