(function($) {
     
    let utmValues   = GiveXpertBlockParams.utm_values; 
    let progressBarValues   = GiveXpertBlockParams.progressbar_values ;  
    
    $(document).ready(function(){
        
        $('button.redirectButton').on('click', clickHandler);
        function clickHandler(event) {  
            // window.location.href = event.target.attributes.datatext.value + utmValues;
            let url  =  event.target.attributes.datatext.value + utmValues;
            let type  =  event.target.attributes.dataredirect.value;

            window.open(`${url}`,`${type}`);
        
        }

        progressBarValues.forEach(element => {

            $(`#custom-progress-bar-${element.codeBlock}`).css('width',`${element.percentage}%`)
            $(`#custom-progress-span-${element.codeBlock}`).html(`${element.percentage}%`)
            $(`#progress-bar-collected-text-${element.codeBlock}`).html(`${element.collected} € collectés `)
            
        });
        // "sur " + props.attributes.collectionObjective + " € d'objectifs"

      
    }); 

    
     
})(jQuery);