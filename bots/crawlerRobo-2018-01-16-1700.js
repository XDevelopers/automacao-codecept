/*jshint esversion: 6 */

function alteraCompetencia(mesAno) {
    
    var selectCompetencia = $("div [id='formTemplate:dataFunc:cbxCompetencia']");
    if (selectCompetencia){
        selectCompetencia
        .find("select option")
        .each(function (i, opt) {
            $(opt).removeAttr("selected"); 
        }); 

        // 06/2017
        if (mesAno !== undefined) {
            selectCompetencia
            .find("select option[value='" + mesAno + "']")[0]
            .setAttribute("selected", "selected"); 
        }
        else {
            selectCompetencia
            .find("select option")[2]
            .setAttribute("selected", "selected"); 
        }
        
        // Call trigger 
        selectCompetencia
        .find("select")
        .trigger("change");

        console.log('Trigger para mudar a competência!');
    }
}

function loadingEstaOculto() {
    return $(document.getElementById('formTemplate:j_idt9')).css("display") === "none"; 
}

function syncLoop(iterations, process, exit){
    var index = 0,
        done = false,
        shouldExit = false;
    var loop = {
        next:function(){
            if(done){
                if(shouldExit && exit){
                    return exit(); // Exit if we're done
                }
            }
            // If we're not finished
            if(index < iterations){
                index++; // Increment our index
                process(loop); // Run our process, pass in the loop
            // Otherwise we're done
            } else {
                done = true; // Make sure we say we're done
                if(exit) exit(); // Call the callback on exit
            }
        },
        iteration:function(){
            return index - 1; // Return the loop number we're on
        },
        break:function(end){
            done = true; // End the loop
            shouldExit = end; // Passing end as true means we still call the exit callback
        }
    };
    loop.next();
    return loop;
}

// how to use
/*
syncLoop(5, function(loop){
    setTimeout(function(){
	    var i = loop.iteration();
	    console.log(i);
	    loop.next();
    }, 5000);
}, function(){
    console.log('done');
});




var myLoop = syncLoop(5, function(loop){
    setTimeout(function(){
	    var i = loop.iteration();
	    console.log(i);
	    loop.next();
    }, 5000);
}, function(){
    console.log('done');
});

setTimeout(myLoop.break, 10000);
*/