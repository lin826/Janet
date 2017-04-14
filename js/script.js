readTextFile("data/doc_origin.docx.txt")
readJson("data/doc_mod.json")
function disable(e){
  e.setAttribute("class",'ui disabled button');
  // TODO: Action after users press "Solved" button
}

function nextstage(){
  URL = parseInt(getQueryVariable('str'))+1;
  console.log(window.location.protocal);
  console.log(window.location.pathname);
  console.log(window.location.hostname);
  window.location.replace(window.location.pathname+'?str='+URL);
}
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
function addText(i,c){
  e = document.createElement('span');
  e.setAttribute('id',i);
  e.innerHTML = c;
  return e;
}
function display(txt)
{
    var text = txt.split('\n');
    var index = 1,start_row = 0;
    document.getElementById('title').innerHTML = '';
    document.getElementById('content').innerHTML = '';

    while(!text[start_row]) {
      start_row += 1;
    }
    for(i=0;i< text[start_row].length;i++){
      e = addText(index,text[start_row][i]);
      document.getElementById('title').appendChild(e);
      index += 1;
    }
    for (i = start_row+1; i < text.length; i++){
      for(j = 0; j < text[i].length; j++){
        e = addText(index,text[i][j]);
        document.getElementById('content').appendChild(e);
        index += 1;
      }
      document.getElementById('content').innerHTML += '<br>';
    }
}
function addElement(type,id,inner){
   e = document.createElement(type);
   e.setAttribute("class", id);
   e.innerHTML = inner;
   return e;
}
function addMod(id,i_s,i_e,type,hist,comment){
  new_e = document.createElement("div");
  new_e.setAttribute("class", 'mod '+id+' title');
  new_e.setAttribute("i_start", i_s);
  new_e.setAttribute("i_end", i_e);

  for(i=i_s;i<=i_e;i++){
    var e = document.getElementById(i.toString())
    e.setAttribute('class',id);
  }
  new_e.appendChild(addElement("i","dropdown icon",' '));
  new_e.innerHTML += type;
  new_e.appendChild(addElement("div",'ui huge star rating',''));

  new_e_2 = document.createElement("div");
  new_e_2.setAttribute("class", 'mod content');
  new_e_2.setAttribute("i_start", i_s);
  new_e_2.setAttribute("i_end", i_e);

  comment = comment.replace(new RegExp('\n','g'), '<br>');
  new_e_2.appendChild(addElement('p','',type+' '+hist+'.<br>'+comment));
  btn = addElement('button','ui primary button','Solved');
  btn.setAttribute("onclick", "disable(this)");
  new_e_2.appendChild(btn);
  document.getElementById('history').appendChild(new_e);
  document.getElementById('history').appendChild(new_e_2);
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                display(allText);
            }
        }
    }
    rawFile.send(null);
}
function readJson(file)
{
  $.getJSON(file, function(json) {
    for(j = 0;j<json.length;j++){
        e = json[j];
        console.log(getQueryVariable('str'));
        if(e['modifier'].includes(getQueryVariable('str'))){
          addMod(e['modifier'],e['index_start'],e['index_end'],e['mod_type'],e['mod_history'],e['mod_comment']);
          // setHover(e['modifier'],e['index_start'],e['index_end']);
        }
    }
  });
  document.getElementById('history').setAttribute('style','height: '+$('#origin').height()+'px;');
}
function canvas_arrow(context, fromx, fromy, tox, toy){
  size = 5;
  context.save();
  context.beginPath();
  context.moveTo(fromx,fromy-size);
  context.lineTo(fromx,fromy+size);
  context.lineTo(tox, fromy);
  context.closePath();
  context.fill();
  context.restore();
}
function drawArrow(a_x,a_y,b_x,b_y){
  a_x = parseInt(a_x);
  b_x = parseInt(b_x);
  a_y = parseInt(a_y);
  b_y = parseInt(b_y);
  var p = {
      x: a_x < b_x ? a_x : b_x,
      x1: a_x > b_x ? a_x : b_x,
      y: a_y < b_y ? a_y : b_y,
      y1: a_y > b_y ? a_y : b_y
  };
  var c = $('<canvas/>').attr({
      'width': p.x1 - p.x +20,
      'height': p.y1 - p.y +100
  }).css({
      'position': 'absolute',
      'left': p.x,
      'top': p.y + 25,
      'z-index': 2
  }).appendTo($('body table'))[0].getContext('2d');

  // draw line
  c.strokeStyle = '#f00';
  c.lineWidth = 2;
  // canvas_arrow(c,b_x-10 - p.x,b_y-10 - p.y,b_x - p.x,b_y-10 - p.y);
  c.moveTo(a_x - p.x,    a_y - p.y);
  c.lineTo(a_x - p.x,    a_y+10 - p.y);
  c.lineTo(b_x-10 - p.x,    a_y+10 - p.y);
  c.lineTo(b_x-10 - p.x,    b_y-10 - p.y);
  // c.quadraticCurveTo(a_x - p.x,a_y - p.y+100,b_x - p.x,b_y-10 - p.y);
  c.stroke();

}
var $middle_x = Math.floor(document.getElementById('history').offsetLeft);
// Hover on text
$("#origin").on("mouseover", "span", function () {
  var $t = $(this);
  var $id = parseInt($t.attr('id'));
  var $this_list = document.getElementsByClassName('mod');
  for(i=0;i<$this_list.length;i++){
    var i_s = parseInt($this_list[i].getAttribute('i_start'));
    var i_e = parseInt($this_list[i].getAttribute('i_end'));
    if(i_s<= $id && i_e>= $id){
      $this_list[i].setAttribute('style',"background-color: LightGray;");
      for(i_x=i_s;i_x<=i_e;i_x++)
        document.getElementById(i_x).setAttribute('style','background-color: LightGray;');
    }
  }
});
$("#origin").on("click", "span", function () {
  var $t = $(this);
  var $id = parseInt($t.attr('id'));
  var $this_list = document.getElementsByClassName('mod');
  for(i=0;i<$this_list.length;i++){
    var i_s = parseInt($this_list[i].getAttribute('i_start'));
    var i_e = parseInt($this_list[i].getAttribute('i_end'));
    if(i_s<= $id && i_e>= $id){
        $offset = $('#'+i_s).offset();
        $history = $('#history');
        document.getElementById('history').scrollTop = ($this_list[i].offsetTop - $offset.top +20);
        drawArrow($offset.left, $offset.top,$this_list[i].offsetLeft+$history.offset().left,
          $this_list[i].offsetTop+$history.offset().top - $history.scrollTop());
        console.log($history.offset().top);
        break;
    }
  }
});
$("#origin").on("mouseleave", "span", function () {
  $('canvas').remove();
  var $t = $(this);
  var $id = parseInt($t.attr('id'));
  var $this_list = document.getElementsByClassName('mod');
  for(i=0;i<$this_list.length;i++){
    var e = $this_list[i];
    var i_s = parseInt(e.getAttribute('i_start'));
    var i_e = parseInt(e.getAttribute('i_end'));
    if(i_s<= $id && i_e>= $id){
      e.setAttribute('style',"background-color: none;");
      for(i_x=i_s;i_x<=i_e;i_x++){
        document.getElementById(i_x).setAttribute('style',"background-color: none;");
      }
    }
  }
});

// Hover on history
$('#history').on("mouseover", ".mod", function () {
  var $t = $(this);
  var i_s = parseInt($t.attr('i_start')), i_e = parseInt($t.attr('i_end'));
  var index = Math.floor((i_s+i_e)/2 );
  for(i=i_s;i<=i_e;i++){
    document.getElementById(i).setAttribute('style','background-color: LightGray;');
  }
});

$('#history').on("mouseleave", ".mod", function () {
  $('canvas').remove();
  var $t = $(this);
  var i_s = parseInt($t.attr('i_start')), i_e = parseInt($t.attr('i_end'));
  for(i=i_s;i<=i_e;i++){
    e = document.getElementById(i)
    if(e.getAttribute('class').includes('mod_0'))
      e.setAttribute('style','background-color: #ccf2ff ;');
    else if(e.getAttribute('class').includes('mod_1'))
      e.setAttribute('style','background-color: #ebf5d6 ;');
    else if(e.getAttribute('class').includes('mod_2'))
      e.setAttribute('style','background-color: #ffcce6 ;');
  }
});

$(document).ready(function(){
    // All your normal JS code goes in here
    $(".rating").rating();
    $(".accordion").accordion();
});
