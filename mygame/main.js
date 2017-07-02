

//界面初始化开始
let imgs=[
  './img1.png',
  './img2.png',
  './left.gif',
  './right.gif'
]
function preloadImgs(imgs){
  for (var i=0;i<imgs.length;i++){
    var img=new Image()
    img.src=imgs[i]
  }
}
preloadImgs(imgs);
var box = document.getElementById('box');
function setTable() {
    var tr_ele = '';
    var td_element = '';
    for (var i = 0; i < 20; i++) {
        td_element += '<td></td>';
    };

    for (var j = 0; j < 20; j++) {
        tr_ele += '<tr>' + td_element + '</tr>';
    }
    box.innerHTML += tr_ele;
}
    setTable()
//界面初始化结束



 function setAttr(){
     for(var i=0;i<20;i++){
         td[i].ableToGo=true;
         td[i].index=i;
         td_ele.push(td[i]);
     }
     for(var j=20;j<td.length;j++){
         td[j].ableToGo=false;
         td[j].index=j;
         td_ele.push(td[j]);
     }
 }

function setGold(){
    for(var i=0;i<40;i++){
        var num=Math.round(Math.random()*340+40);
        td_ele[num].className='gold_img';
        td_ele[num].things='gold';
        td_ele[num].ableToGo=true;
        td_ele[num].style.top=0;
        things_arr.push(td_ele[num]);
    }
}

function setHeart(){
    var max=20;
    for(var j=0;j<max;j++){
        var num=Math.round(Math.random()*340+40);
        if(td_ele[num].things){max++; continue};    //所选元素已经被金块占用时，跳出并保证红心总数不变；
        td_ele[num].className='heart_img';
        td_ele[num].things='heart';
        td_ele[num].ableToGo=true;
        td_ele[num].style.top=0;
        things_arr.push(td_ele[num]);
    }
}

function checkThings(ele,kind){              //检测物品类型并操作
    if(!ele){return}
    if(kind=='person'){
        if(ele.things=='gold'){
            ele.className='td_ele';
            ele.things=false;
            score+=80;
        }else if(ele.things=='heart'){
            ele.className='td_ele';
            ele.things=false;
            life+=80;
        }
    }else if(kind=='fire'){
        ele.className='td_ele';
        ele.things=false;
    }
    checkThings(ele.top_thing, kind)
}

function touchThings(ele,kind){                      //物品碰撞
    things_arr.forEach(function(things,index){
        var dif=Math.abs(things.offsetLeft-ele.offsetLeft);
        if(dif<=35&&things.offsetTop==ele.offsetTop){
            checkThings(things, kind);
            things_arr.splice(index,1);
        }
    })
}

function move(ele,direct){
    ele.style.position='absolute';
    ele.style.top=ele.offsetTop+'px';
    var lef_num=ele.offsetLeft;
    var top_num=ele.offsetTop;

    if(lef_num<=2&&direct=='left'){
        return false
    }else if(lef_num>=762&&direct=='right'){
        return false
    }
    if(direct=='left'){
        ele.className='lef_img';
        if(ele.direct=='right'){
            ele.direct='left';
            return
         }
        ele.direct='left';
        if(td_ele[ele.index-1].ableToGo==false){return}
        ele.style.left=lef_num-40+'px';
        touchThings(person,'person');
        ele.index--;
    }else if(direct=='right'){
        ele.className='rig_img';
        if(ele.direct=='left'){
            ele.direct='right';
            return
         }
        ele.direct='right';
        if(td_ele[ele.index+1].ableToGo==false){return}
        ele.index++;
        ele.style.left=lef_num+40+'px';
        touchThings(person,'person');
    }
}

function drop(element,kind){       //人物和火焰下坠
    if(element.index+20>=420){return}
    if(td_ele[element.index+20].ableToGo==true){
        if(td_ele[element.index+20].things&&kind=='things'){return}
        element.index+=20;
        element.style.top=parseInt(element.style.top.slice(0,-2))+40+'px';
        touchThings(element, kind)
        drop(element,kind);
    }
}

function thingsDrop(){        //物品下坠
    var arr=things_arr;
    things_arr.forEach(function(things,index){
        if(things.index+20>420){return}
        for(var i=0;i<arr.length;i++){
            if(arr[i].offsetLeft==things.offsetLeft&&arr[i].offsetTop==things.offsetTop+40){
                arr[i].top_thing=things;
                things.next_thing=arr[i];
                return
            }
        }
    });
    things_arr.forEach(function(things,index){
        if(things.index+20>420){return}
        if(td_ele[things.index+20].ableToGo){
            if(things.top_thing&&!things.next_thing){
                things.style.top=parseInt(things.style.top.slice(0,-2))+40+'px';
                things.index+=20;
                things.top_thing.style.position='absolute';
                things.top_thing.style.top=things.offsetTop-40+'px'
                function hyf(ele){
                    if(!ele){return}
                    ele.style.position='absolute'
                    ele.style.top=ele.next_thing.offsetTop-40+'px';
                    hyf(ele.top_thing);
                }
                hyf(things.top_thing)
                return
            }
            if(!things.top_thing&&!things.next_thing){
                things.style.top=parseInt(things.style.top.slice(0,-2))+40+'px';
                things.index+=20;
            }
        }
    })

}

function fireOut(i,dir){
    if((person.index%20==0&&person.direct=='left')||(person.index%20==19&&person.direct=='right')){return} //处理左右两边界挖掘问题；
    if(!td_ele[i]){return}
    if(td_ele[i].ableToGo==true){return}
    var num=Math.round(Math.random()*8);
    td_ele[i].ableToGo=true;
    td_ele[i].className='td_ele';
    td_ele[i].style.left=0;
    td_ele[i].style.top=0;
    if(num<=1){
        setTimeout(function(){td_ele[i].direct='right'},1000);
        td_ele[i].className='fire_img';
        td_ele[i].things='fire';
        td_ele[i].timer=setInterval(function(){
            var lef_num=td_ele[i].offsetLeft;
            var top_num=td_ele[i].offsetTop;
            touchThings(td_ele[i],'fire')
            if(Math.abs(person.offsetLeft-lef_num)<35&&person.offsetTop==top_num){
                clearInterval(td_ele[i].timer);
                td_ele[i].className='td_ele';
                td_ele[i].style.left=0;
                td_ele[i].style.top=0;
                life-=50;
                return
            }
            if(td_ele[i].index%1==0){
                var top=parseInt(td_ele[i].style.top.slice(0,-2));
                drop(td_ele[i],'fire');
                if(td_ele[i].direct=='left'){
                    if(!td_ele[td_ele[i].index-1].ableToGo){
                        td_ele[i].direct='right';
                        return
                    }
                }
                if(td_ele[i].direct=='right'){
                    if(!td_ele[td_ele[i].index+1].ableToGo){
                        td_ele[i].direct='left';
                        return
                    }
                }
            }
            if(lef_num<=2&&td_ele[i].direct=='left'){
                td_ele[i].direct='right';
                return
            }else if(lef_num>=762&&td_ele[i].direct=='right'){
                td_ele[i].direct='left';
                return
            }
            if(td_ele[i].direct=='right'){
                var rig=parseInt(td_ele[i].style.left.slice(0,-2));
                td_ele[i].style.left=rig+4+'px';
                td_ele[i].index+=0.1;
                td_ele[i].index=parseFloat(td_ele[i].index.toFixed(1))
            }else if(td_ele[i].direct=='left'){
                var lef=parseInt(td_ele[i].style.left.slice(0,-2));
                td_ele[i].style.left=lef-4+'px';
                td_ele[i].index-=0.1;
                td_ele[i].index=parseFloat(td_ele[i].index.toFixed(1))
            }
        },100)
    }
}

function start(){
    life=500;
    score=0;
    td=document.getElementsByTagName('td');
    td_ele=[];
    things_arr=[];
    person=document.getElementById('person');
    person.direct='right';
    setAttr();
    setGold();
    setHeart();
    document.onkeydown=function(e){
    e.preventDefault();
    if(e.keyCode==37){
        move(person,'left');
        drop(person,'person');
        thingsDrop();
    }else if(e.keyCode==39){
        move(person,'right');
        drop(person,'person');
        thingsDrop();
    }else if(e.keyCode==40){
        if(person.direct=='left'){
            person.className='lef_gif';
            fireOut(person.index-1,person.direct)
            fireOut(person.index+19,person.direct);
            thingsDrop();
            thingsDrop();
        }else if(person.direct=='right'){
            person.className='rig_gif';
            fireOut(person.index+1,person.direct)
            fireOut(person.index+21,person.direct);
            thingsDrop();
            thingsDrop();
        }
    }else if(e.keyCode==32){
        if(person.direct=='left'){
            person.className='lef_gif';
            fireOut(person.index-1,person.direct);
            thingsDrop();
        }else if(person.direct=='right'){
            person.className='rig_gif';
            fireOut(person.index+1,person.direct);
            thingsDrop();
        }
    }
}

document.onkeyup=function(e){
    if(e.keyCode==40||e.keyCode==32){
        person.className=person.direct=='left'?'lef_img':'rig_img'
    }

}

}

//生命值及分数渲染
var score_ele=document.getElementById('score');
var life_ele=document.getElementById('life_num');
var life_bar=document.getElementById('life_bar');
function render(){
     data_timer=setInterval(function(){
        score_ele.innerHTML=score+'分';
        if(life>=500){life=500}
        life_ele.innerHTML=life;
        life-=1;

        if(life<=0){
            alert('游戏失败，请重新开始！');
            clearInterval(data_timer);
            restart();
        }
        if(score>=800){
            alert('恭喜你通关了！');
            clearInterval(data_timer);
            restart();
        }
        life_bar.style.width=(life/500)*200+'px';
    },500)
}


function restart(){
     run_flag=0;
    box.innerHTML='';
    box.innerHTML="<tr id='first_line'><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td id='person' class='rig_img'></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
    setTable();
}

var start_btn=document.getElementById('start');
var restart_btn=document.getElementById('restart');
var run_flag=0;
start_btn.addEventListener('click',function(){
    if(run_flag==1){return}
    start();
    render();
    run_flag=1;
});

restart_btn.addEventListener('click',function(){
    clearInterval(data_timer)
    restart();
    run_flag=0;
})
