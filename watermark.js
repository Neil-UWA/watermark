//dependency base64
//replace ${XXXXXXX}
//
function Watermark(screenWidth, nickname) {
  this.ratio = (Math.min(800, screenWidth || 414))/414;
  this.ratio = this.ratio < 1 ? 1 : this.ratio;
  this.nickname = nickname;
  this.text = null;  //text watermark
  this.image = null; //image watermark
  this.watermark = null; //remote watermark image
  this.width = Math.min(parseInt(30*this.ratio), 60);
  this.fontsize = parseInt(400*this.ratio);
}


Watermark.prototype.getText = function() {
  var dx = parseInt(this.width + 15*this.ratio);
  var dy = 10;
  var text  = safe_base64(Base64.encode(this.nickname));
  var gravity = 'SouthWest';
  var fill = 'd2hpdGU=';
  this.text = [
    'text', text,
    'fontsize', this.fontsize,
    'fill', fill,
    'gravity', gravity,
    'dx', dx,
    'dy', dy ].join('/');
  return this;
}

Watermark.prototype.getImage = function() {
  var watermark =
    safe_base64(Base64.encode('http://${XXXXXXX}.qiniucdn.com/watermark.png?imageMogr2/thumbnail/'+this.width+'x'));
  var gravity = 'SouthWest';
  var dx = 10;
  var dy = 10;
  this.image = [
    'image', watermark,
    'gravity', gravity,
    'dx', dx,
    'dy', dy].join('/');
  return this;
}

Watermark.prototype.getWatermark = function() {
  this.watermark = [
    'watermark',
    3,
    this.image,
    this.text
  ].filter(function(value){
    return value ? true : false;
  }).join('/');
  return this;
}

Watermark.prototype.addWatermark = function(image) {
  return [image, this.watermark].join('|');
}

Watermark.prototype.markIt = function(img) {
  return this.getText().getImage().getWatermark().addWatermark(img);
}

function safe_base64(text){
  return text.replace(/\+/g, '-') // Convert '+' to '-'
             .replace(/\//g, '_') // Convert '/' to '_'
             .replace(/=+$/, '');
}

