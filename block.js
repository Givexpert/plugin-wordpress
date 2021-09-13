var el = wp.element.createElement;
var array1 = ['a', "b", "v"];

var selectOption = `<option value="#">Selectionnez un formulaire</option>`;
var typeRedirectOption = ``;
var policeOption = "";
var userTemplates = GiveXpertBlockParams.user_templates_data;
var logoLink = GiveXpertBlockParams.logo_link;
var utmValues = GiveXpertBlockParams.utm_values;
var currentRequest = null; //  deprecated not use anymore  

/**
 * @var list of all  font family  
 */
const families = [
    "Arial Black", "Corbel", "Courier", "Courier 10 Pitch", "Critter", "Curlz MT", "Cursor", "Gigi", "Gill Sans", "Gill Sans Bold", "Gill Sans Bold Italic", "GillSans", "GillSans-Bold", "Gisha", "Gisha Bold", "Helvetica", "Helvetica Bold", "Helvetica Bold Oblique", "Herculanum", "High Tower Text", "HiraMinProN-W3", "HiraMinProN-W6", "Impact", "Imprint MT Shadow", "sans-serif", "sans-serif-black", "sans-serif-condensed", "sans-serif-condensed-light", "sans-serif-light", "sans-serif-medium", "sans-serif-monospace", "sans-serif-smallcaps", "sans-serif-thin", "serif", "serif-monospace", "utkal"
]
for (let i = 0; i < families.length; i++) {
    policeOption += ` <option style="font-family: ${families[i]}" value="${families[i]}"> ${families[i]}</option>`
}

/**
 * create an image that will be used  for plugin icon
 */
const iconEl = el('img',
    {
        src: 'data:image/png;base64,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'
        , style: { width: '120%' },
    });

/**list of all kind of redirection for the buttons  */
const typeRedirect = { "_self": "Ouvrir dans le même onglet", "_blank": "Ouvrir dans un autre onglet" }
for (const [key, value] of Object.entries(typeRedirect)) {
    typeRedirectOption += ` <option  value="${key}"> ${value} </option>`
}


/**user's templates */
if (userTemplates) {
    userTemplates.forEach(template => {
        selectOption += ` <option  value="${template.id}"> ${template.name} </option>`
    });

} else {
    selectOption = ` <option value="#">Aucune donnée</option>`
}
  
/************************* PARAMS MANAGEMENT  ***************************************/


wp.blocks.registerBlockType('give-xpert/donation-block', {

    title: 'GiveXpert', // Block name visible to user

    icon: iconEl, // Toolbar icon can be either using WP Dashicons or custom SVG

    category: 'common', // Under which category the block would appear

    attributes: { // The data this block will be storing

        blockId: { type: 'string', default: "" }, // 
        tempBlockId: { type: 'string', default: "" }, // 

        buttonText: { type: 'string', default: 'Faire un don' }, // 
        buttonTypeRedirect: { type: 'string', default: '_blank' }, // 
        buttonLink: { type: 'string', default: "#" }, // 
        outSideButtonLink: { type: 'string', default: "#" }, // 
        buttonColor: { type: 'string', default: "#787675" }, // 
        buttonBgColor: { type: 'string', default: "#000000" }, // 
        buttonPolice: { type: 'string', default: "inherit", selector: 'button' },

        //
        buttonElementIsCheck: { type: 'boolean', default: false },
        progressBarElementIsCheck: { type: 'boolean', default: false },
        meterElementIsCheck: { type: 'boolean', default: false },


        choiceProgressBar: { type: 'string', default: "progressbar" },
        choiceMeter: { type: 'string', default: "meter" },
        choiceButton: { type: 'string', default: "button" },

        //
        collectionObjective: { type: 'number', default: 0 },
        startingAmount: { type: 'float', default: 0 },
        collectionPercentage: { type: 'string', default: '0' },
        collectedAmount: { type: 'float', default: 0 },
        defaultCollectedAmount: { type: 'float', default: 0 },


    },

    edit: (props) => {

        const buttonElementShow = props.attributes.buttonElementIsCheck ? "" : "hide-me";
        const progressBarElementShow = props.attributes.progressBarElementIsCheck ? "" : "hide-me";
        const meterBarElementShow = props.attributes.meterElementIsCheck ? "" : "hide-me";

        //  ajax to update progress bar value  
        function updateProgressBarValue(params) {

            jQuery.ajax({
                type: 'POST',
                dataType: 'html',
                url: GiveXpertBlockParams.ajaxurl,
                data: params, 
                success: function (data) {
                    let response = JSON.parse(data);
                    if (typeof response.data.codeBlock != 'undefined') {
                        props.setAttributes({ blockId: response.data.codeBlock });
                        props.setAttributes({ tempBlockId: response.data.codeBlock });
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {

                },
                complete: function (data) {

                }
            });
        }
        
        function updateButtonText(event) {
            props.setAttributes({ buttonText: event.target.value });
        }
        function updateButtonLink(event) {

            updateProgressBarValue({
                'idFormulaire': parseInt(event.target.value),
                'codeBlock': props.attributes.blockId,
                "action": "ajax_save_progress_bar_data"
            })

            //get current template 
            var currentTemplate = userTemplates[parseInt(event.target.value) - 1];
            var beginStartingAmount = parseFloat(currentTemplate.collected) + parseFloat(props.attributes.startingAmount);


            if (props.attributes.collectionObjective > 0) {
                var percentage = ((parseFloat(currentTemplate.collected) + parseFloat(props.attributes.startingAmount)) * 100) / props.attributes.collectionObjective;
            } else {
                var percentage = "0%";
            }

            props.setAttributes({ buttonLink: event.target.value });
            props.setAttributes({ outSideButtonLink: currentTemplate.url });
            props.setAttributes({ collectionPercentage: parseInt(percentage) });
            props.setAttributes({ collectedAmount: parseInt(beginStartingAmount) });
            props.setAttributes({ defaultCollectedAmount: parseInt(currentTemplate.collected) });

        }
        function updateTempCodeBlock(event) {
            props.setAttributes({ tempBlockId: event.target.value });
        }

        function updateButtonTypeRedirect(event) {
            props.setAttributes({ buttonTypeRedirect: event.target.value });
        }

        function updateCodeBlock(event) {

            var oldBlockId = props.attributes.blockId;
            updateProgressBarValue({
                'codeBlock': props.attributes.tempBlockId,
                'oldCode': oldBlockId,
                "action": "ajax_progress_bar_save_code"
            })

        }

        function updateButtonBgColor(value) {
            props.setAttributes({ buttonBgColor: value.target.value });
        }

        function updateButtonTexteColor(value) {
            props.setAttributes({ buttonColor: value.target.value });
        }
        function updateButtonPolice(event) {

            props.setAttributes({ buttonPolice: event.target.value });
        }
        
        function treatButtonVisibility(buttonIsShow) {
            if (buttonIsShow) {
                document.querySelectorAll(`.plugin-button-${props.attributes.blockId}`).forEach(function (el) {
                    el.classList.remove('hide-me');
                });
            } else {

                document.querySelectorAll(`.plugin-button-${props.attributes.blockId}`).forEach(function (el) {
                    el.className += ' hide-me';
                });
            }
        }
        
        function treatMeterVisibility(MeterCheck,progressBarCheck) {

             
            if (MeterCheck) {
                document.querySelectorAll(`.plugin-meter-${props.attributes.blockId}`).forEach(function (el) {
                    el.classList.remove('hide-me');
                });
            } else {
                if (progressBarCheck) {
                    document.querySelectorAll(`.plugin-meter-${props.attributes.blockId}`).forEach(function (el) {
                        el.className += ' hide-me';
                    });
                }
            }
        }

        function treatProgresbarVisibility(ProgressbarCheck,meterCheck) {
          
            if (ProgressbarCheck) {
                document.querySelectorAll(`.plugin-progressbar-${props.attributes.blockId}`).forEach(function (el) {
                    el.classList.remove('hide-me');
                });
            } else {
                if (meterCheck) {

                    document.querySelectorAll(`.plugin-progressbar-${props.attributes.blockId}`).forEach(function (el) {
                        el.className += ' hide-me';
                    });
                    document.querySelectorAll(`.plugin-meter-${props.attributes.blockId}`).forEach(function (el) {
                        el.classList.remove('hide-me');
                    });
                } else {

                    document.querySelectorAll(`.plugin-progressbar-${props.attributes.blockId}`).forEach(function (el) {
                        el.className += ' hide-me';
                    });
                }
            }
        }



        function changeChoiceView(event) {

            var inputValue = event.target.value;

            if (inputValue == "button") {

                var isCheck = !props.attributes.buttonElementIsCheck;
                props.setAttributes({ buttonElementIsCheck: isCheck });
                treatButtonVisibility(isCheck)          

            } else if (inputValue == "meter") {
                var isCheck = !props.attributes.meterElementIsCheck;
                var progressIsCheck = !props.attributes.progressBarElementIsCheck;
                props.setAttributes({ meterElementIsCheck: isCheck });
                treatMeterVisibility(isCheck,progressIsCheck)


            } else if (inputValue == "progressbar") {

                var isCheck = !props.attributes.progressBarElementIsCheck;
                var meterIsCheck = props.attributes.meterElementIsCheck;
                props.setAttributes({ progressBarElementIsCheck: isCheck });
                treatProgresbarVisibility(isCheck,meterElementIsCheck)
            }
        }

        function changeTypeView(event) {

            var type = event.target.value;
            if (type == `preview-${props.attributes.blockId}`) {
                document.getElementById(`edit-content-${props.attributes.blockId}`).className += ' hide-me';
                document.getElementById(`preview-content-${props.attributes.blockId}`).classList.remove('hide-me');

            } else {
                document.getElementById(`preview-content-${props.attributes.blockId}`).className += ' hide-me';
                document.getElementById(`edit-content-${props.attributes.blockId}`).classList.remove('hide-me');
            }
        }
        //
        function updateCollectionObjective(event) {

            updateProgressBarValue({
                'objectifDeCollecte': parseInt(event.target.value),
                'codeBlock': props.attributes.blockId,
                "action": "ajax_save_progress_bar_data"
            })

            if (props.attributes.collectionObjective > 0) {
                var percentage = ((parseFloat(props.attributes.collectedAmount) + parseFloat(props.attributes.startingAmount)) * 100) / event.target.value;
            } else {
                var percentage = "0";
            }

            props.setAttributes({ collectionPercentage: percentage.toString() });

            props.setAttributes({ collectionObjective: parseInt(event.target.value) });
        }

        function updateStartingAmount(event) {

            updateProgressBarValue({
                'montantDepart': parseInt(event.target.value),
                'codeBlock': props.attributes.blockId,
                "action": "ajax_save_progress_bar_data"
            })


            if (props.attributes.collectionObjective > 0) {
                var percentage = ((parseFloat(props.attributes.collectedAmount) + parseFloat(event.target.value)) * 100) / props.attributes.collectionObjective;
            } else {
                var percentage = "0";
            }
            var beginStartingAmount = parseInt(props.attributes.defaultCollectedAmount) + parseInt(event.target.value);
            // console.log(parseInt(props.attributes.collectedAmount), parseInt(event.target.value), beginStartingAmount);
            props.setAttributes({ collectionPercentage: parseInt(percentage) });
            props.setAttributes({ startingAmount: event.target.value });
            props.setAttributes({ collectedAmount: beginStartingAmount });
        }

        
        function visibilityOnLoadButtonElements() { 
            treatButtonVisibility(props.attributes.buttonElementIsCheck)        
        }
        
        function visibilityOnLoadMeterElements() {  
            treatMeterVisibility(props.attributes.meterElementIsCheck,props.attributes.progressBarElementIsCheck)        
        }

        function visibilityOnLoadProgressbarElements() {  
            treatProgresbarVisibility(props.attributes.progressBarElementIsCheck,props.attributes.meterElementIsCheck)        
        }

        return el('div',
            {
                className: 'container-fluid p-3',
                style: { backgroundColor: '#fff', borderColor: "cbcbcb" }

            },

            el('div',
                {
                    className: `container edit-content-${props.attributes.blockId} `,
                    id: `edit-content-${props.attributes.blockId}`
                },
                el(
                    'div',
                    {
                        className: 'row'
                    },
                    el(
                        'div',
                        {
                            className: 'col-md-12 text-center p-2'
                        },
                        el(
                            'img',
                            {
                                src: logoLink,
                                style: { width: '50%', marginBottom: "25px", backgroundColor: '#F1F5F9' },
                            },
                        ),
                    )
                ),

                // choice

                el(
                    'div',
                    {
                        className: 'form-group row  ',
                    },
                    el(
                        'label',
                        {
                            className: 'col-sm-3 col-form-label d-flex align-item-center',
                            id: "formLabel",
                            dangerouslySetInnerHTML: {
                                __html: `Identifiant du bloc `
                            }
                        },
                    ),
                    el(
                        'div',
                        {
                            className: 'col-sm-9',
                        },
                        el(
                            'input',
                            {
                                onChange: updateTempCodeBlock,
                                onBlur: updateCodeBlock,
                                type: 'text',
                                value: props.attributes.tempBlockId,
                                placeholder: "Donnez un identifiant au bloc",
                                className: "form-control gray-border",
                                style: { display: 'inline-block' }
                            }
                        ),
                    )
                ),
                // formulaire
                el(
                    'div',
                    {
                        className: 'form-group row'
                    },
                    el(
                        'label',
                        {
                            className: 'col-sm-3 col-form-label d-flex align-item-center',
                            id: "formLabel",
                            dangerouslySetInnerHTML: {
                                __html: `Formulaire GiveXpert`
                            }
                        },

                    ),

                    el(
                        'div',
                        {
                            className: 'col-sm-9',
                        },
                        el(
                            'select',
                            {
                                onChange: updateButtonLink,
                                value: props.attributes.buttonLink,
                                className: 'form-control gray-border',
                                style: { minHeight: '40px', minWidth: "100%", fontSize: "12px" },
                                dangerouslySetInnerHTML: {
                                    __html: `${selectOption} `
                                }
                            },
                        ),
                    )
                ),
                //choices

                el(
                    'div',
                    {
                        className: 'row'
                    },
                    // first choice ( button)
                    el(
                        'div',
                        {
                            className: 'form-group   col-md-4',

                        },
                        el(
                            'label',
                            {

                                className: 'pt-2',
                                for: "button-choice",
                                dangerouslySetInnerHTML: {
                                    __html: `Bouton : &nbsp;&nbsp;&nbsp;&nbsp;`
                                }
                            },
                        ),

                        el(
                            'input',
                            {
                                id: "button-choice-" + props.attributes.tempBlockId,
                                type: 'checkbox',
                                onClick: changeChoiceView,
                                checked: props.attributes.buttonElementIsCheck,
                                name: 'active_section_choice',
                                value: props.attributes.choiceButton,
                                className: "form-control gray-border",
                                style: { display: 'inline-block' }
                            }
                        ),

                    ),
                    // second choice (meter)
                    el(
                        'div',
                        {
                            className: 'form-group col-md-4'
                        },
                        el(
                            'label',
                            {

                                className: 'pt-2',
                                for: "meter-choice",
                                dangerouslySetInnerHTML: {
                                    __html: `Compteur : &nbsp;&nbsp;&nbsp;&nbsp;  `
                                }
                            },
                        ),

                        el(
                            'input',
                            {
                                type: 'checkbox',
                                id: "meter-choice",
                                onClick: changeChoiceView,
                                checked: props.attributes.meterElementIsCheck,
                                name: 'active_section_choice',
                                value: props.attributes.choiceMeter,
                                className: "form-control gray-border",
                                style: { display: 'inline-block' }
                            }
                        ),

                    ),
                    // third choice (progressbar)
                    el(
                        'div',
                        {
                            className: 'form-group col-md-4'
                        },
                        el(
                            'label',
                            {
                                className: 'pt-2',
                                for: "progressbar-choice",
                                dangerouslySetInnerHTML: {
                                    __html: `Barre de progression :&nbsp;&nbsp;  `
                                }
                            },
                        ),

                        el(
                            'input',
                            {
                                type: 'checkbox',
                                id: "progressbar-choice",
                                onClick: changeChoiceView,
                                checked: props.attributes.progressBarElementIsCheck,
                                name: 'active_section_choice',
                                value: props.attributes.choiceProgressBar,
                                className: "form-control gray-border",
                                style: { display: 'inline-block' }
                            }
                        ),

                    ),
                ),

                //  texte du bouton 
                el(
                    'div',
                    {
                        className: `form-group row  plugin-button-${props.attributes.blockId} hide-me`,
                        onLoad: visibilityOnLoadButtonElements()
                    },
                    el(
                        'label',
                        {
                            className: 'col-sm-3 col-form-label d-flex align-item-center',
                            id: "formLabel",
                            dangerouslySetInnerHTML: {
                                __html: `Texte du button : `
                            }
                        },
                    ),
                    el(
                        'div',
                        {
                            className: 'col-sm-4',
                        },
                        el(
                            'input',
                            {
                                type: 'text',
                                placeholder: 'Entrer le text du bouton ',
                                value: props.attributes.buttonText,
                                onChange: updateButtonText,
                                className: "form-control gray-border",
                                style: { display: 'inline-block' }
                            }
                        ),
                    ),

                    el(
                        'div',
                        {
                            className: 'col-sm-5',
                        },
                        el(
                            'select',
                            {
                                type: 'text',
                                value: props.attributes.buttonTypeRedirect,
                                onChange: updateButtonTypeRedirect,
                                className: "form-control gray-border",
                                style: { display: 'inline-block', minHeight: '40px', minWidth: "100%", fontSize: "12px" },
                                dangerouslySetInnerHTML: {
                                    __html: `${typeRedirectOption}`
                                }
                            }
                        ),
                    )
                ),
                // choix de la policeF
                el(
                    'div',
                    {
                        className: 'form-group row '
                    },
                    el(
                        'label',
                        {
                            className: 'col-sm-3 col-form-label d-flex align-item-center',
                            id: "formLabel",
                            dangerouslySetInnerHTML: {
                                __html: `	Police du texte`
                            }
                        },

                    ),

                    el(
                        'div',
                        {
                            className: 'col-sm-9',

                        },
                        el(
                            'select',
                            {
                                onChange: updateButtonPolice,
                                value: props.attributes.buttonPolice,
                                className: 'form-control-sm form-control gray-border',
                                style: { minHeight: '40px', minWidth: "100%", fontSize: "12px" },
                                dangerouslySetInnerHTML: {
                                    __html: `${policeOption}`
                                }
                            },
                        ),
                    )
                ),
                // input color
                el(
                    'div',
                    {
                        className: 'row '
                    },
                    el(
                        'div',
                        {
                            className: 'col-md-3',
                        },
                        el(
                            'label',
                            {
                                style: { fontSize: "14px" },
                                dangerouslySetInnerHTML: {
                                    __html: `Couleur du bouton `
                                }
                            }
                        )
                    ),
                    el(
                        'div',
                        {
                            className: 'col-md-4 mr-3'
                        },
                        el(

                            'div',
                            {
                                className: 'input-group mb-3'
                            },
                            el(
                                'div',
                                {
                                    className: 'input-group-prepend'
                                },
                                el(
                                    'small',
                                    {
                                        style: { fontSize: '9px' },
                                        className: 'input-group-text',
                                        dangerouslySetInnerHTML: {
                                            __html: `<b>Arrière-plan</b>`
                                        }

                                    },
                                )
                            ),

                            el(
                                'input',
                                {
                                    type: 'text',
                                    className: 'form-control gray-border',
                                    value: props.attributes.buttonBgColor,
                                    onChange: updateButtonBgColor,
                                    style: { fontSize: '11px' },
                                }
                            ),

                            el(
                                'div',
                                {
                                    className: 'input-group-prepend'
                                },
                                el(
                                    'input',
                                    {
                                        type: 'color',
                                        style: { height: ' 100%', width: '35px', padding: '3px 4px', borderRadius: '0' },
                                        value: props.attributes.buttonBgColor,
                                        onChange: updateButtonBgColor
                                    }
                                ),
                            ),


                        )
                    ),
                    el(
                        'div',
                        {
                            className: 'col-md-4'
                        },
                        el(

                            'div',
                            {
                                className: 'input-group mb-3'
                            },
                            el(
                                'div',
                                {
                                    className: 'input-group-prepend'
                                },
                                el(
                                    'small',
                                    {
                                        style: { fontSize: '9px' },
                                        className: 'input-group-text',
                                        dangerouslySetInnerHTML: {
                                            __html: `<b> Couleur texte </b>`
                                        }

                                    },
                                )
                            ),

                            el(
                                'input',
                                {
                                    type: 'text',
                                    className: 'form-control gray-border',
                                    value: props.attributes.buttonColor,
                                    onChange: updateButtonTexteColor,
                                    style: { fontSize: '11px' },
                                }
                            ),

                            el(
                                'div',
                                {
                                    className: 'input-group-prepend'
                                },
                                el(
                                    'input',
                                    {
                                        type: 'color',
                                        style: { height: ' 100%', width: '35px', padding: '3px 4px', borderRadius: '0' },
                                        value: props.attributes.buttonColor,
                                        onChange: updateButtonTexteColor
                                    }
                                ),
                            ),


                        )
                    ),

                ),

                //  object de la collecte
                el(
                    'div',
                    {
                        className: `form-group row plugin-progressbar-${props.attributes.blockId} hide-me`,
                        onload: visibilityOnLoadProgressbarElements()
                    },
                    el(
                        'label',
                        {
                            className: 'col-sm-3 col-form-label d-flex align-item-center',
                            id: "formLabel",
                            dangerouslySetInnerHTML: {
                                __html: ` Objectif de collecte`
                            }
                        },
                    ),

                    el(
                        'div',
                        {
                            className: 'col-sm-9',
                        },
                        el(
                            'input',
                            {
                                type: 'text',
                                placeholder: "Entrer l'objectif de la collecte",
                                value: props.attributes.collectionObjective,
                                onChange: updateCollectionObjective,
                                className: "form-control gray-border",
                                style: { display: 'inline-block' }
                            }
                        ),
                    )
                ),

                //  montant de depart
                el(
                    'div',
                    {
                        className: `form-group row plugin-progressbar plugin-meter-${props.attributes.blockId} hide-me`,
                        onLoad: visibilityOnLoadMeterElements()
                    },
                    el(
                        'label',
                        {
                            className: 'col-sm-3 col-form-label d-flex align-item-center',
                            id: "formLabel",
                            dangerouslySetInnerHTML: {
                                __html: `Montant de départ`
                            }
                        },
                    ),

                    el(
                        'div',
                        {
                            className: 'col-sm-9',
                        },
                        el(
                            'input',
                            {
                                type: 'text',
                                placeholder: "Entrer le Montant de depart",
                                value: props.attributes.startingAmount,
                                onChange: updateStartingAmount,
                                className: "form-control gray-border",
                                style: { display: 'inline-block' }
                            }
                        ),
                    ),

                ),

                el('div',
                    {
                        className: 'row '
                    },
                    el('div',
                        {
                            className: 'col-md-12 text-center '
                        },
                        el(
                            'button',
                            {
                                className: ' btn btn-previsualiser  btn-info',
                                onClick: changeTypeView,
                                value: `preview-${props.attributes.blockId}`
                            },
                            "Prévisualiser"
                        )

                    )
                ),


            ),
            el('div',
                {
                    className: 'container  hide-me',
                    id: `preview-content-${props.attributes.blockId}`
                },
                el('div',
                    {
                        className: ''
                    },

                    el(
                        'div',
                        {
                            className: 'col-md-12',
                        },

                        el(
                            'div',
                            {
                                className: meterBarElementShow,
                            },
                            el('h4',
                                {
                                    style: {
                                        fontFamily: props.attributes.buttonPolice
                                    }
                                },
                                props.attributes.collectedAmount + " € collectés"
                            )
                        ),

                        el(
                            'div',
                            {
                                className: progressBarElementShow,
                                style: { backgroundColor: props.attributes.buttonColor }
                            },
                            el(
                                'div',
                                {
                                    className: 'progress-bar p-0',
                                    role: "progressbar",
                                    ariaValuenow: parseInt(props.attributes.collectionObjective),
                                    ariaValuemin: "0",
                                    ariaValuemax: "100",
                                    style: {
                                        maxWidth: props.attributes.collectionPercentage + "%",
                                        backgroundColor: props.attributes.buttonBgColor,
                                        color: props.attributes.buttonColor,
                                    }
                                },
                                el('span',
                                    {
                                        style: { fontSize: '20px' }
                                    }, props.attributes.collectionPercentage + "%"
                                )
                            ),
                        ),
                        el(
                            'div',
                            {
                                className: progressBarElementShow + ' p-2  ',
                            },
                            el('span',
                                {
                                    style: {
                                        fontFamily: props.attributes.buttonPolice
                                    }
                                },
                                "sur " + props.attributes.collectionObjective + " € d'objectifs"
                            )
                        ),
                    ),

                    el(
                        'div',
                        {
                            className: buttonElementShow + ' col-md-12 mt-2',
                        },
                        el(
                            'button',
                            {
                                type: ' col-md-12',
                                className: ' redirectButton',
                                dataText: props.attributes.outSideButtonLink,
                                style: {
                                    backgroundColor: props.attributes.buttonBgColor,
                                    color: props.attributes.buttonColor,
                                    fontFamily: props.attributes.buttonPolice
                                }
                            },
                            props.attributes.buttonText,

                        )
                    ),
                    el('div',
                        {
                            className: 'row '
                        },
                        el('div',
                            {
                                className: 'col-md-12 text-center '
                            },
                            el(
                                'button',
                                {
                                    className: 'back-to-edit btn  btn-secondary',
                                    onClick: changeTypeView,
                                    value: "backToEdit"
                                },
                                "Revenir à l'édition"
                            )

                        )
                    ),
                )
            )
        )

    },

    save: function (props) {


        const buttonElementShow = props.attributes.buttonElementIsCheck ? "" : "hide-me";
        const progressBarElementShow = props.attributes.progressBarElementIsCheck ? "" : "hide-me";
        const meterBarElementShow = props.attributes.meterElementIsCheck ? "" : "hide-me";


        return el('div',
            {
                className: ""
            },

            el(
                'div',
                {
                    className: 'col-md-12 ',
                },

                el(
                    'div',
                    {
                        className: meterBarElementShow,
                    },
                    el('h4',
                        {

                            id: "progress-bar-collected-text-" + props.attributes.blockId,
                            style: {
                                fontFamily: props.attributes.buttonPolice
                            }
                        },
                        props.attributes.collectedAmount + " € collectés"
                    )
                ),

                el(
                    'div',
                    {
                        className: progressBarElementShow,
                        style: { height: '30px', backgroundColor: props.attributes.buttonColor }
                    },
                    el(
                        'div',
                        {
                            id: "custom-progress-bar-" + props.attributes.blockId,
                            className: 'progress-bar p-0',
                            role: "progressbar",
                            ariaValuenow: parseInt(props.attributes.collectionObjective),
                            ariaValuemin: "0",
                            ariaValuemax: "100",
                            style: {
                                maxWidth: props.attributes.collectionPercentage + "%",
                                backgroundColor: props.attributes.buttonBgColor,
                                color: props.attributesbuttonColor,
                            }
                        },
                        el('span',
                            {
                                id: "custom-progress-span-" + props.attributes.blockId,
                                style: { fontSize: '20px' }
                            }, props.attributes.collectionPercentage + "%"
                        )
                    ),
                ),
                el(
                    'div',
                    {
                        className: progressBarElementShow + ' p-2  ',
                    },
                    el('span',
                        {
                            style: {
                                fontFamily: props.attributes.buttonPolice
                            }
                        },
                        "sur " + props.attributes.collectionObjective + " € d'objectifs"
                    )
                ),
            ),
            el(
                'div',
                {
                    className: buttonElementShow + ' col-md-12 mt-2',
                },
                el(
                    'button',
                    {
                        type: ' col-md-12',
                        className: 'redirectButton',
                        dataText: props.attributes.outSideButtonLink,
                        dataRedirect: props.attributes.buttonTypeRedirect,
                        style: {
                            backgroundColor: props.attributes.buttonBgColor,
                            color: props.attributes.buttonColor,
                            fontFamily: props.attributes.buttonPolice
                        }
                    },
                    props.attributes.buttonText,

                )
            ),


        );
    }
});




(function ($) {
    $('input').css('backgroundColor', 'red')

})(jQuery);