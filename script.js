$(document).ready(function(){


    hours= [{id:'hh_00',value:0,x:0},{id:'hh_01',value:1,x:0},{id:'hh_02',value:2,x:0},{id:'hh_03',value:3,x:0},
            {id:'hh_04',value:4,x:0},{id:'hh_05',value:5,x:0},{id:'hh_06',value:6,x:0},
            {id:'hh_07',value:7,x:0},{id:'hh_08',value:8,x:0},{id:'hh_09',value:9,x:0},
            {id:'hh_10',value:10,x:0},{id:'hh_11',value:11,x:0},{id:'hh_12',value:12,x:0},
            {id:'hh_13',value:13,x:0},{id:'hh_14',value:14,x:0},{id:'hh_15',value:15,x:0},
            {id:'hh_16',value:16,x:0},{id:'hh_17',value:17,x:0},{id:'hh_18',value:18,x:0},
            {id:'hh_19',value:19,x:0},{id:'hh_20',value:20,x:0},{id:'hh_21',value:21,x:0},
            {id:'hh_22',value:22,x:0},{id:'hh_23',value:23,x:0},{id:'hh_24',value:24,x:0}];

    preCheckinValues=[{id:'elem1',value:2.2,level:'low'},{id:'elem2',value:3,level:'high'},
             {id:'elem3',value:4.3,level:'normal'},{id:'elem4',value:9,level:'info'},
             {id:'elem5',value:11,level:'high'},{id:'elem6',value:15,level:'info'}];

    transitTimeValues=[{id:'elem21',value:1.2,level:'high'},{id:'elem22',value:1.7,level:'normal'},
              {id:'elem23',value:3.3,level:'low'},{id:'elem24',value:12.5,level:'normal'},
              {id:'elem25',value:19,level:'high'},{id:'elem26',value:21,level:'info'},{id:'elem27',value:23,level:'low'}];

    nbDepartureValues=[{id:'elem31',value:5.2,level:'normal'},{id:'elem32',value:7.7,level:'info'},
              {id:'elem33',value:13.3,level:'high'},{id:'elem34',value:16,level:'normal'},
              {id:'elem35',value:19.5,level:'low'},{id:'elem36',value:21.5,level:'high'}];

    
    hoursSelected=[];
    preCheckinSelectedValues=[];
    transitTimeSelectedValues=[];
    nbDepartureSelectedValues=[];


     firstElement = 0
     lastElement = 24

     windowWidth = $(window).width();
     repereO = $("#abscisseHoursId").offset().left;
     repereWidth = $("#abscisseHoursId").width();  
     defaultSelectorWidth = 0; 

     intervalSelInf=0;
     intervalSelSup=10;

     clickedPos = 0;
    

   initialize();



$( window ).resize(function() 
{
    if (hoursSelected.length>0)
    {
        zoomOnElementsSelected();
    }
    else
    {
        initialize();
    }
});

//handle mouse selection
  
$("#handledZone").mousedown(function (e) {
       
          

          repereO = $("#abscisseHoursId").offset().left;
          repereWidth = $("#abscisseHoursId").width(); 

         // console.log("wd: "+ $(".replay-progress-shadow").width());
       
        $(".replay-progress-bar").addClass("spectre-active");
        $(".replay-progress-bar").css({
            'left': e.pageX-repereO,
            'top': 0
        });

        initialW = e.pageX-repereO;
        initialH = 0;
        
             

        $(document).bind("mouseup", selectionneElements);
        $(document).bind("mousemove", activeSelection);

        detectHourInfMouseDown(e);

    });
  
  
});

function activeSelection(e) {
    var w = Math.abs(initialW - e.pageX)-repereO;
    var h = Math.abs(initialH - e.pageY);
    h=$(".replay-player").height();
   

     repereO = $("#abscisseHoursId").offset().left;
     repereWidth = $("#abscisseHoursId").width(); 

    // left = Math.floor(repereWidth*elt.value/maxHour)



    $(".replay-progress-bar").css({
        'width': w,
        'height': h
    });
    if (e.pageX <= initialW && e.pageY >= initialH) {
        $(".replay-progress-bar").css({
            'left': e.pageX
        });
    } else if (e.pageY <= initialH && e.pageX >= initialW) {
        $(".replay-progress-bar").css({
            'top': e.pageY
        });
    } else if (e.pageY < initialH && e.pageX < initialW) {
        $(".replay-progress-bar").css({
            'left': e.pageX,
            "top": e.pageY
        });
    }

    detectHourSupMouseMove(e);
//replay-progress-end

   // console.log($(".replay-progress-start .replay-time").html());
   // console.log($(".replay-progress-end .replay-time").html());
    

}



  
  
function intersectionObject(a, b) { // a: selection  b:element
    //console.log(a.offset().top,a.position().top, b.position().top, a.width(),a.height(), b.width(),b.height());
    var aTop = a.offset().top;
    var aLeft = a.offset().left;
    var bTop = b.offset().top;
    var bLeft = b.offset().left;

    var result = !(
        ((aTop + a.height()) < (bTop)) ||
        (aTop > (bTop + b.height())) ||
        ((aLeft + a.width()) < bLeft) ||
        (aLeft > (bLeft + b.width()))
    );

   

    if (result )
    {
     //    console.log("S left : "+ a.offset().left+ " right : "+(a.offset().left+a.width()));
      //   console.log("E left : "+ b.offset().left+ " right : "+b.width());
         //console.log(b.width());
    }

    return result;
}  



function catchElements(classElem,saveElementSelectedMethod,completList,selectedList){

    $("."+classElem).each(function () {
        var aElemSpectre = $(".replay-progress-bar");
        var bElem = $(this);
        var result = intersectionObject(aElemSpectre, bElem);

       // console.log(selectedList);

        if (result == true) {                
                saveElement(bElem,completList,selectedList);
          
        }
    });


}

function detectHourSupMouseMove(e)
{
     repereO = $("#abscisseHoursId").offset().left;
     repereWidth = $("#abscisseHoursId").width(); 
     if  (defaultSelectorWidth == 0)
     {
         defaultSelectorWidth = $(".replay-progress-shadow").width();
     }
     var repereF =repereO+repereWidth;
     var x= e.pageX+defaultSelectorWidth;
     var realPos;

     if (x>=repereO && x<=repereF)
     {
        if (hoursSelected.length>0)
        {
            for (var i = 0; i < hoursSelected.length; i++)
            {        
                realPos=repereO+hoursSelected[i].x;
                if (realPos>x)
                {
                    intervalSelSup=hoursSelected[i-1].value;
                    console.log(defaultSelectorWidth);
                     break;
                 }
            }
        }
        else
        {
             for (var i = 0; i < hours.length; i++)
            {        
                realPos=repereO+hours[i].x;
                console.log("realPos: "+realPos);
                if (realPos>x)
                {
                    intervalSelSup=hours[i-1].value;                   
                     console.log(defaultSelectorWidth);
                     break;
                 }
            }

        }
        
     }

    $(".replay-progress-end .replay-time").html(intervalSelSup);

    console.log("x:"+e.pageX+" intS:"+intervalSelSup)
}

function detectHourInfMouseDown(e)
{
     repereO = $("#abscisseHoursId").offset().left;
     repereWidth = $("#abscisseHoursId").width(); 
     var x= e.pageX;
     var realPos;
     var repereF =repereO+repereWidth;

     if (x>=repereO && x<=repereF)
     {
        if (hoursSelected.length>0)
        {
            for (var i = 0; i < hoursSelected.length; i++)
            {        
                realPos=repereO+hoursSelected[i].x;
                if (realPos>x)
                {
                    intervalSelInf=hoursSelected[i].value;
                 //  console.log(bhr);
                     break;
                 }
            }
        }
        else
        {
             for (var i = 0; i < hours.length; i++)
            {        
                realPos=repereO+hours[i].x;
                if (realPos>x)
                {
                    intervalSelInf=hours[i].value;
                 //  console.log(bhr);
                     break;
                 }
            }

        }
        
     }

    $(".replay-progress-start .replay-time").html(intervalSelInf);
}



function selectionneElements(e) {

    preCheckinSelectedValues=[];
    transitTimeSelectedValues=[];
    nbDepartureSelectedValues=[];

    hoursSelected=[];

    
    $(document).unbind("mousemove", activeSelection);
    $(document).unbind("mouseup", selectionneElements);
    mxX = 0;
    mnX = 5000;
    mxY = 0;
    mnY = 5000;

    catchElements("hour",saveElement,hours,hoursSelected)
    catchElements("precheckinClass",saveElement,preCheckinValues,preCheckinSelectedValues)
    catchElements("tempstransitClass",saveElement,transitTimeValues,transitTimeSelectedValues)
    catchElements("nbdepartsClass",saveElement,nbDepartureValues,nbDepartureSelectedValues)

    ///////////////////////////////////////////
    
    $(".replay-progress-bar").removeClass("spectre-active");
    $(".replay-progress-bar").width(0).height(0);
    
    zoomOnElementsSelected();
   

}

function saveElement(elt,completList,selectedList){

        completList.forEach(function(elem,index) {
            if (elem.id==elt[0].id)
            {
                selectedList.push(elem);
            }
        });

  //  console.log(selectedList);
}


function saveHoursSelected(elt){

        hours.forEach(function(elem,index) {
            if (elem.id==elt[0].id)
            {
                hoursSelected.push(elem);
            }
        });

   // console.log(hoursSelected);
}

function zoomOnElementsSelected()
{

    var maxH = 24

     $(".precheckinClass").remove();
     $(".nbdepartsClass").remove();
     $(".tempstransitClass").remove();
     $(".hour").remove();

     if (hoursSelected.length>0)
         {
            maxH = hoursSelected[hoursSelected.length-1].value;
         }
        

     representeHours("abscisseHoursId",hoursSelected,'hour',maxH,true);
     filterNoneSelectedLimitElements(preCheckinSelectedValues);
     filterNoneSelectedLimitElements(transitTimeSelectedValues);
     filterNoneSelectedLimitElements(nbDepartureSelectedValues);
     representeElements("preCheckinId",preCheckinSelectedValues,'precheckinClass',maxH,true);
     representeElements("transitTimeId",transitTimeSelectedValues,'tempstransitClass',maxH,true);
     representeElements("nbDepartsId",nbDepartureSelectedValues,'nbdepartsClass',maxH,true);

     

     
}

function representeElements(abscisId,elts,classColor,maxHour,zoomOn)
{
     
     
        firstElement = hoursSelected[0]
        nbHours=hoursSelected.length-1
    
        if(!zoomOn)
        {
             elts.forEach(function(elt, index){
                
                 $("#"+abscisId).append("<div id='"+elt.id+"' class='"+classColor+" "+elt.level+"'> </div>");   

                    
                left = Math.floor(repereWidth*elt.value/maxHour)

                 $("#"+elt.id).css({
                        'left': left
                    });    

            });
        }
        
        else
        {
             elts.forEach(function(elt, index){
                
                 $("#"+abscisId).append("<div id='"+elt.id+"' class='"+classColor+" "+elt.level+"'> </div>");

                 decale=Math.floor(repereWidth*firstElement.value/maxHour)

              /*   if(index==0)
                 {
                    left = Math.floor(repereWidth*elt.value/maxHour)-decale
                     $("#"+elt.id).css({
                        'left': left
                    });   
                 }
                    
                 else
                 {  */
                    beforeH=getBeforeHour(elt)
                   // console.log(elt);
                   console.log("before: "+JSON.stringify(beforeH));
                   if(beforeH)
                   {
                     left = $('#'+beforeH.id).position().left + Math.floor(repereWidth*(elt.value-beforeH.value)/nbHours)//-decale+Math.floor(decale*elt.value/lastElement.value)
                   
                     $("#"+elt.id).css({
                        'left': left
                    });   
                   }                    
                   // console.log(Math.floor(decale*elt.value/lastElement.value));
                // }


                 

            });
        }
}
   
function getBeforeHour(elt)
{
    var bhr=null;
   // console.log("Heure selectionnées : "+JSON.stringify(hoursSelected))
    for (var i = 0; i < hoursSelected.length; i++) {
        
       if (hoursSelected[i].value>elt.value){
            bhr=hoursSelected[i-1];
          //  console.log(bhr);
            break;
       }
    }

    if (hoursSelected[hoursSelected.length-1].value==elt.value)
        {
            bhr=hoursSelected[hoursSelected.length-1];
        }

    return bhr
}


function getHourElt(hourVal)
{
   
   var hrElt=null;

   if (hoursSelected.length>0)
   {
    for (var i = 0; i < hoursSelected.length; i++) {
        
       if (hoursSelected[i].value==hourVal){
            hrElt=hoursSelected[i];
            break;
       }
    }
   }
   else
   {
    for (var i = 0; i < hours.length; i++)
     {
        
           if (hours[i].value==hourVal)
           {
                hrElt=hours[i];
                break;
           }
     }
    }

    return hrElt;
}


function filterNoneSelectedLimitElements(list)
{
    for (var i = 0; i < list.length; i++) {
        
       if ( (list[i].value<hoursSelected[0].value) || (list[i].value>hoursSelected[hoursSelected.length-1].value) )
       {
          list.splice(i, 1);
       }
    }

    console.log("selected: "+JSON.stringify(list));

}
function representeHours(abscisId,elts,classColor,maxHour,zoomOn)
{
    repereWidth =$("#abscisseHoursId").width();  
    firstElement = elts[0]
    lastElement = elts[elts.length-1]
    nbHours=elts.length-1

     //console.log(firstElement)
     //console.log(lastElement)
    
        if(!zoomOn)
        {
             elts.forEach(function(elt, index){
                
                 $("#"+abscisId).append("<div id='"+elt.id+"' class='"+classColor+"'>"+elt.value+" </div>");            
                    
                left = Math.floor(repereWidth*elt.value/maxHour)
                elt.x=left;

                 $("#"+elt.id).css({
                        'left': left
                    });    

            });
        }
        
        else
        {
             elts.forEach(function(elt, index){
                
                 $("#"+abscisId).append("<div id='"+elt.id+"' class='"+classColor+"'>"+elt.value+" </div>");

                 decale=Math.floor(repereWidth*firstElement.value/maxHour)
                 
                 if(index==0)
                 {
                    left = Math.floor(repereWidth*elt.value/maxHour)-decale
                    beforeVal = elt.value
                 }
                    
                 else
                 {  
                    left = left + Math.floor(repereWidth*(elt.value-beforeVal)/nbHours)//-decale+Math.floor(decale*elt.value/lastElement.value)
                   // console.log(Math.floor(decale*elt.value/lastElement.value));
                   beforeVal = elt.value
                   //console.log(left)
                 }

                 elt.x=left;
                 $("#"+elt.id).css({
                        'left': left
                    });    

            });
        }
}

function initialize(){

    representeHours("abscisseHoursId",hours,'hour',24,false);
    representeElements("preCheckinId",preCheckinValues,'precheckinClass',24,false); 
    representeElements("transitTimeId",transitTimeValues,'tempstransitClass',24,false);
    representeElements("nbDepartsId",nbDepartureValues,'nbdepartsClass',24,false);    
    preCheckinSelectedValues=[];
    transitTimeSelectedValues=[];
    nbDepartureSelectedValues=[];
    hoursSelected=[];
    console.log(hours);
}


