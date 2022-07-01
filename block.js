var el = wp.element.createElement;

var selectOption = `<option value="#">Selectionnez un formulaire</option>`;
var selectOptionPeer = `<option value="#">Selectionnez un formulaire</option>`;
var selectOptionToOrder = ``;
var typeRedirectOption = ``;
var policeOption = "";
var userTemplates = GiveXpertBlockParams.template_datas;
var userTemplatesPeer = GiveXpertBlockParams.template_peer_datas;
var templateCollectorsListInEdit = GiveXpertBlockParams.template_collectors_datas;
var templateCollectorsList = [];
var connexionData = GiveXpertBlockParams.connexion_datas;
var logoLink = GiveXpertBlockParams.logo_link;
var logoTest = GiveXpertBlockParams.logo_test;
var utmValues = GiveXpertBlockParams.utm_values;
var currentRequest = null; //  deprecated not use anymore  
var nbCallShowModel1 = 1;
var nbCallShowModel2 = 1;
var getOrderValue = 'id';
var currentTemplate = {id: 0};
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

/**user's templates peer */
if (userTemplatesPeer) {
    userTemplatesPeer.forEach(template => {
        selectOptionPeer += ` <option  value="${template.id}"> ${template.name} </option>`
    });

} else {
    selectOptionPeer = ` <option value="#">Aucune donnée</option>`
}

selectOptionToOrder += ` <option value="id"> Du plus récent au plus ancien</option>`;
selectOptionToOrder += ` <option value="collected"> Du plus gros montant de collecte au plus petit</option>`;
selectOptionToOrder += ` <option value="number_donors"> Du plus grand nombre de donateurs au plus petit</option>`;

/************************* PARAMS MANAGEMENT  ***************************************/

wp.blocks.registerBlockType('give-xpert/donation-block', {

    title: 'GiveXpert', // Block name visible to user

    icon: iconEl, // Toolbar icon can be either using WP Dashicons or custom SVG

    category: 'common', // Under which category the block would appear

    attributes: { // The data this block will be storing

        blockId: { type: 'string', default: "" },
        tempBlockId: { type: 'string', default: "" },

        buttonText: { type: 'string', default: 'Faire un don' },
        buttonTypeRedirect: { type: 'string', default: '_blank' },
        buttonLink: { type: 'string', default: "#" },
        outSideButtonLink: { type: 'string', default: "#" },
        buttonColor: { type: 'string', default: "#787675" },
        buttonBgColor: { type: 'string', default: "#000000" },
        buttonPolice: { type: 'string', default: "inherit", selector: 'button' },

        buttonElementIsCheck: { type: 'boolean', default: false },
        progressBarElementIsCheck: { type: 'boolean', default: false },
        meterElementIsCheck: { type: 'boolean', default: false },
        formElementIsCheck: { type: 'boolean', default: false },
        grilleBlock1ElementIsCheck: { type: 'boolean', default: false },
        grilleBlock2ElementIsCheck: { type: 'boolean', default: false },
        grilleElementIsCheck: { type: 'boolean', default: false },

        choiceProgressBar: { type: 'string', default: "progressbar" },
        choiceMeter: { type: 'string', default: "meter" },
        choiceForm: { type: 'string', default: "form" },
        grilleBlock1: { type: 'string', default: "grBr1" },
        grilleBlock2: { type: 'string', default: "grBr2" },
        choiceGrille: { type: 'string', default: "grille" },
        choiceButton: { type: 'string', default: "button" },
        templateID: { type: 'string', default: "" },
        orderValue: { type: 'string', default: "" },

        collectionObjective: { type: 'number', default: 0 },
        startingAmount: { type: 'float', default: 0 },
        collectionPercentage: { type: 'number', default: '0' },
        collectedAmount: { type: 'float', default: 0 },
        defaultCollectedAmount: { type: 'float', default: 0 },
    },

    edit: (props) => {

        const buttonElementShow = props.attributes.buttonElementIsCheck ? "" : "hide-me";
        const progressBarElementShow = props.attributes.progressBarElementIsCheck ? "" : "hide-me";
        const meterBarElementShow = props.attributes.meterElementIsCheck ? "" : "hide-me";

        function updateProgressBarValue(params) {
            jQuery.ajax({
                type: 'POST',
                dataType: 'html',
                url: GiveXpertBlockParams.ajaxurl,
                data: params,
                success: function (data) {
                    let response = JSON.parse(data);
                    if ((response.data) && typeof response.data.codeBlock != 'undefined') {
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

        function getTemplateSelected(templateList, templateID) {
            for (let index = 0; index < templateList.length; index++) {
                const template = templateList[index];

                if (parseInt(template['id']) === parseInt(templateID)) {
                    return template;
                }
            }
        }

        function updateButtonLink(event) {
            updateProgressBarValue({
                'idFormulaire': parseInt(event.target.value),
                'codeBlock': props.attributes.blockId,
                "action": "givexpert_ajax_save_progress_bar_data"
            })

            var currentTemplate = getTemplateSelected(userTemplates, parseInt(event.target.value));
            var beginStartingAmount = parseInt(currentTemplate.collected) + parseInt(props.attributes.startingAmount);

            if (props.attributes.collectionObjective > 0) {
                var percentage = ((parseInt(currentTemplate.collected) + parseInt(props.attributes.startingAmount)) * 100) / props.attributes.collectionObjective;
            } else {
                var percentage = "0%";
            }

            props.setAttributes({ buttonLink: event.target.value });
            props.setAttributes({ outSideButtonLink: currentTemplate.url });
            props.setAttributes({ collectionPercentage: parseInt(percentage) });
            props.setAttributes({ collectedAmount: parseInt(beginStartingAmount) });
            props.setAttributes({ defaultCollectedAmount: parseInt(currentTemplate.collected) });
        }

        function selectedTemplatePeer(event) {
            currentTemplate = getTemplateSelected(userTemplatesPeer, parseInt(event.target.value));
            
            props.setAttributes({ templateID: currentTemplate.id });
            
            jQuery.ajax({
                type: 'GET',
                dataType: 'html',
                url: connexionData.domaine + 'template_collectors/',
                data: 'user=' + connexionData.user + '&key=' + connexionData.key + '&template_peer_id=' + currentTemplate.id + '&display=Y',
                success: function (data) {
                    let response = JSON.parse(data);
                    if ((response) && response.statut == 'success') {
                        templateCollectorsList = orderBy(getOrderValue, formatData(response.templates));
                    }
                },

                error: function (jqXHR, textStatus, errorThrown) {
                    
                },
                complete: function (complete) {
                    
                }
            });
        }
        
        function formatData(data) {
            let result = [];
            
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                var date_stop = new Date(element.date_stop);
                var current_date = new Date();
                var difference_in_days = (current_date < date_stop) ? Math.round(Math.abs(current_date.getTime() - date_stop.getTime()) / (1000 * 3600 * 24)) : 0;
                element.remaining_day = difference_in_days;
                
                result.push(element);
            }
            
            return result;
        }
        
        function orderBy(type, data) {
            if (type == 'id') {
                return data.sort(function (a, b) {
                    var x = a.id; var y = b.id;
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                });
            } else if (type == 'collected') {
                return data.sort(function (a, b) {
                    var x = a.collected; var y = b.collected;
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                });
            } else if (type == 'number_donors') {
                return data.sort(function (a, b) {
                    var x = a.number_donors; var y = b.number_donors;
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                });
            }
        }
        
        function selectedOrderValue(event) {
            props.setAttributes({ orderValue: event.target.value });
            getOrderValue = event.target.value;
            
            jQuery.ajax({
                type: 'GET',
                dataType: 'html',
                url: connexionData.domaine + 'template_collectors/',
                data: 'user=' + connexionData.user + '&key=' + connexionData.key + '&template_peer_id=' + currentTemplate.id + '&display=Y',
                success: function (data) {
                    let response = JSON.parse(data);
                    if ((response) && response.statut == 'success') {
                        templateCollectorsList = orderBy(getOrderValue, formatData(response.templates));
                    }
                },

                error: function (jqXHR, textStatus, errorThrown) {

                },
                complete: function (complete) {

                }
            });
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
                "action": "givexpert_ajax_progress_bar_save_code"
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

        function treatMeterVisibility(MeterCheck, progressBarCheck) {
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

        function treatGrilleBlockOneVisibility() {
            document.querySelectorAll(`.grille-block-1-${props.attributes.blockId}`).forEach(function (el) {
                el.classList.remove('hide-me');
            });


            document.querySelectorAll(`.grille-block-2-${props.attributes.blockId}`).forEach(function (el) {
                el.classList += ' hide-me';
            });
        }

        function treatGrilleBlockTwoVisibility() {
            document.querySelectorAll(`.grille-block-2-${props.attributes.blockId}`).forEach(function (el) {
                el.classList.remove('hide-me');
            });

            document.querySelectorAll(`.grille-block-1-${props.attributes.blockId}`).forEach(function (el) {
                el.classList += ' hide-me';
            });
        }
        
        function treatGrilleVisibility() {
            //props.attributes.blockId =0
            document.querySelectorAll(`.panel-grille-${props.attributes.blockId}`).forEach(function (el) {
                el.classList.remove('hide-me');
            });

            document.querySelectorAll(`.panel-form-${props.attributes.blockId}`).forEach(function (el) {
                el.classList += ' hide-me';
            });

        }

        function treatFormVisibility() {
            //props.attributes.blockId =0
            document.querySelectorAll(`.panel-form-${props.attributes.blockId}`).forEach(function (el) {
                el.classList.remove('hide-me');
            });

            document.querySelectorAll(`.panel-grille-${props.attributes.blockId}`).forEach(function (el) {
                el.className += ' hide-me';
            });

        }
        
        function treatProgresbarVisibility(ProgressbarCheck, meterCheck) {
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
            if (inputValue == "form") {

                props.setAttributes({ formElementIsCheck: true });
                props.setAttributes({ grilleElementIsCheck: false });
                treatFormVisibility()

            } else if (inputValue == "grille") {

                props.setAttributes({ grilleElementIsCheck: true });
                props.setAttributes({ formElementIsCheck: false });

                treatGrilleVisibility()

            } else if (inputValue == "grBr1") {

                props.setAttributes({ grilleBlock1ElementIsCheck: true });
                props.setAttributes({ grilleBlock2ElementIsCheck: false });
                treatGrilleBlockOneVisibility()

            } else if (inputValue == "grBr2") {

                props.setAttributes({ grilleBlock2ElementIsCheck: true });
                props.setAttributes({ grilleBlock1ElementIsCheck: false });
                treatGrilleBlockTwoVisibility()
            } else if (inputValue == "button") {
                var isCheck = !props.attributes.buttonElementIsCheck;
                props.setAttributes({ buttonElementIsCheck: isCheck });
                treatButtonVisibility(isCheck)

            } else if (inputValue == "meter") {
                var isCheck = !props.attributes.meterElementIsCheck;
                var progressIsCheck = !props.attributes.progressBarElementIsCheck;
                props.setAttributes({ meterElementIsCheck: isCheck });
                treatMeterVisibility(isCheck, progressIsCheck)

            } else if (inputValue == "progressbar") {
                var isCheck = !props.attributes.progressBarElementIsCheck;
                var meterIsCheck = props.attributes.meterElementIsCheck;
                props.setAttributes({ progressBarElementIsCheck: isCheck });
                treatProgresbarVisibility(isCheck, meterIsCheck)
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

        function updateCollectionObjective(event) {
            updateProgressBarValue({
                'objectifDeCollecte': parseInt(event.target.value),
                'codeBlock': props.attributes.blockId,
                "action": "givexpert_ajax_save_progress_bar_data"
            })

            if (props.attributes.collectionObjective > 0) {
                var percentage = ((parseInt(props.attributes.collectedAmount) + parseInt(props.attributes.startingAmount)) * 100) / event.target.value;
            } else {
                var percentage = "0";
            }

            props.setAttributes({ collectionPercentage: parseInt(percentage) });
            props.setAttributes({ collectionObjective: parseInt(event.target.value) });
        }

        function updateStartingAmount(event) {
            updateProgressBarValue({
                'montantDepart': parseInt(event.target.value),
                'codeBlock': props.attributes.blockId,
                "action": "givexpert_ajax_save_progress_bar_data"
            })

            if (props.attributes.collectionObjective > 0) {
                var percentage = ((parseInt(props.attributes.collectedAmount) + parseInt(event.target.value)) * 100) / props.attributes.collectionObjective;
            } else {
                var percentage = "0";
            }
            var beginStartingAmount = parseInt(props.attributes.defaultCollectedAmount) + parseInt(event.target.value);
            props.setAttributes({ collectionPercentage: parseInt(percentage) });
            props.setAttributes({ startingAmount: event.target.value });
            props.setAttributes({ collectedAmount: beginStartingAmount });
        }

        function visibilityOnLoadButtonElements() {
            treatButtonVisibility(props.attributes.buttonElementIsCheck)
        }

        function visibilityOnLoadMeterElements() {
            treatMeterVisibility(props.attributes.meterElementIsCheck, props.attributes.progressBarElementIsCheck)
        }

        function visibilityOnLoadProgressbarElements() {
            treatProgresbarVisibility(props.attributes.progressBarElementIsCheck, props.attributes.meterElementIsCheck)
        }

        function showModel1() {
            let content = document.getElementById("model-1-content");
            if (content && nbCallShowModel1 == 1) {
                totalRow = (templateCollectorsListInEdit.length > 3) ? 3 : templateCollectorsListInEdit.length
                for (let index = 0; index < totalRow; index++) {
                    templateCollectors = templateCollectorsListInEdit[index];
                    var goal = parseInt(templateCollectors.goal);
                    var percentage = (parseInt((templateCollectors.collected / goal) * 100) > 100) ? 100 : parseInt((templateCollectors.collected / goal) * 100);
                    
                    content.innerHTML += `
                    <div class="col-lg-4 mb-4">
                        <div class="card" style="padding: 0px; width: 100%;">
                            <img class="card-img-top" src="` + templateCollectors.photo + `" alt="image" style="object-fit: contain; width: 100%; height: 210px; object-fit: cover;">
                            <div class="card-body" style="padding-left: 5px; padding-right: 5px;">
                                <p class="card-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="` + templateCollectors.title + `">` + templateCollectors.title +`</p>
                                <p  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    <span>Par </span> <a href="` + templateCollectors.url + `" style="text-decoration: none; color: black">` + templateCollectors.firstname + ' ' + templateCollectors.lastname +`</a>
                                </p>
                                <div>
                                    <div class="progress" style="height: 20px;">
                                        <div class="progress-bar bg-info" role="progressbar" style="width: `+ percentage + `%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">` + percentage +`%</div>
                                    </div>
                                </div>
                                <div>
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <span>`+ templateCollectors.collected +` €</span> <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Colectés</span>
                                        </div>
                                        <div class="col-lg-4">
                                            <span>`+ templateCollectors.goal +` €</span> <span  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Attendus</span>
                                        </div>
                                        <div class="col-lg-4">
                                            <span>`+ templateCollectors.remaining_day +`j</span> <span  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Restant</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                }
                nbCallShowModel1++;
            }
        }
        
        function showModel2() {
            let content = document.getElementById("model-2-content");
            if (content && nbCallShowModel2 == 1) {
                totalRow = (templateCollectorsListInEdit.length > 3) ? 3 : templateCollectorsListInEdit.length
                for (let index = 0; index < totalRow; index++) {
                    templateCollectors = templateCollectorsListInEdit[index];
                    var goal = parseInt(templateCollectors.goal);
                    var percentage = (parseInt((templateCollectors.collected / goal) * 100) > 100) ? 100 : parseInt((templateCollectors.collected / goal) * 100);
                    content.innerHTML += `
                    <div class="col-lg-4">
                        <div class="card" style="padding: 0px; width: 100%">
                            <img class="card-img-top" src="`+ templateCollectors.photo + `" alt="Image" style="object-fit: contain; width: 100%; height: 210px; object-fit: cover;">
                            <div class="card-body" style="padding-left: 5px; padding-right: 5px;">
                                <p class="card-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="`+ templateCollectors.title + `">` + templateCollectors.title +`</p>
                                <div>
                                    <div class="progress" style="width: 100%; height: 20px;">
                                        <div class="progress-bar bg-info" role="progressbar" style="width: `+ percentage + `%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">` + percentage +`%</div>
                                    </div>
                                </div>
                                <p style="text-align: center;">
                                    `+ templateCollectors.goal +`€ d'objectif
                                </p>
                                <p>
                                    <a href="#" class="btn btn-info" style="width: 100%">En savoir plus</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    `;
                }
                nbCallShowModel2++;
            }
        }

        return el('div', {
                className: 'container-fluid p-3',
                style: { backgroundColor: '#fff', borderColor: "cbcbcb" }
            },
            el('div', {
                    className: `container edit-content-${props.attributes.blockId} `,
                    id: `edit-content-${props.attributes.blockId}`
                },
                el('div', { // Row - contain image
                        className: 'row'
                    },
                    el('div', {
                            className: 'col-md-12 text-center p-2'
                        },
                        el('img', {
                                src: logoLink,
                                style: { width: '50%', marginBottom: "25px", backgroundColor: '#F1F5F9' },
                            },
                        ),
                    )
                ),
                el('div', { // Row - Choix de radio button 'Bar de progression' ou 'Grille de donateur'
                        className: 'row'
                    },
                    el('div', {
                            className: 'form-group col-md-6'
                        },
                        el('label', {
                                className: 'pt-2',
                                for: "formChoose",
                                dangerouslySetInnerHTML: {
                                    __html: `Bar de progression :&nbsp;&nbsp;  `
                                }
                            },
                        ),

                        el('input', {
                                type: 'radio',
                                id: "formChoose",
                                onClick: changeChoiceView,
                                checked: props.attributes.formElementIsCheck,
                                name: 'active_section_choice',
                                value: props.attributes.choiceForm,
                                className: "form-control gray-border",
                                style: { display: 'inline-block' }
                            }
                        ),
                    ),
                    el('div', {
                            className: 'form-group col-md-6'
                        },
                        el('label', {
                                className: 'pt-2',
                                for: "grille-choice",
                                dangerouslySetInnerHTML: {
                                    __html: `Grille des donateurs :&nbsp;&nbsp;  `
                                }
                            },
                        ),
                        el('input', {
                                type: 'radio',
                                id: "grille-choice",
                                onClick: changeChoiceView,
                                checked: props.attributes.grilleElementIsCheck,
                                name: 'active_section_choice',
                                value: props.attributes.choiceGrille,
                                className: "form-control gray-border",
                                style: { display: 'inline-block' }
                            }
                        ),

                    ),
                ),
                el('span', { // Panel formulaire pour réaliser la barre de progression
                        className: `panel-form-${props.attributes.blockId} hide-me`,
                        id: "form-content",
                    },
                    el('div', { // Row - Champs identifiant du bloc
                            className: 'form-group row  ',
                        },
                        el('label', {
                                className: 'col-sm-3 col-form-label d-flex align-item-center',
                                id: "formLabel",
                                dangerouslySetInnerHTML: {
                                    __html: `Identifiant du bloc `
                                }
                            },
                        ),
                        el('div', {
                                className: 'col-sm-9',
                            },
                            el('input', {
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
                    el('div', { // Row - liste des formulaires
                            className: 'form-group row'
                        },
                        el('label', {
                                className: 'col-sm-3 col-form-label d-flex align-item-center',
                                id: "formLabel",
                                dangerouslySetInnerHTML: {
                                    __html: `Formulaire GiveXpert`
                                }
                            },
                        ),
                        el('div', {
                                className: 'col-sm-9',
                            },
                            el('select', {
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
                    el('div', { // Row - Option (bouton, compteur, barre de progression)
                            className: 'row'
                        },
                        el('div', {
                                className: 'form-group   col-md-4',
                            },
                            el('label', {
                                    className: 'pt-2',
                                    for: "button-choice",
                                    dangerouslySetInnerHTML: {
                                        __html: `Bouton : &nbsp;&nbsp;&nbsp;&nbsp;`
                                    }
                                },
                            ),
                            el('input', {
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
                        el('div', {
                                className: 'form-group col-md-4'
                            },
                            el('label', {
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
                        el('div', {
                                className: 'form-group col-md-4'
                            },
                            el('label', {
                                    className: 'pt-2',
                                    for: "progressbar-choice",
                                    dangerouslySetInnerHTML: {
                                        __html: `Barre de progression :&nbsp;&nbsp;  `
                                    }
                                },
                            ),
                            el('input', {
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
                    el('div', { // Row - Champs text du bouton 
                            className: `form-group row  plugin-button-${props.attributes.blockId} hide-me`,
                            onLoad: visibilityOnLoadButtonElements()
                        },
                        el('label', {
                                className: 'col-sm-3 col-form-label d-flex align-item-center',
                                id: "formLabel",
                                dangerouslySetInnerHTML: {
                                    __html: `Texte du button : `
                                }
                            },
                        ),
                        el('div', {
                                className: 'col-sm-4',
                            },
                            el('input', {
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
                    el('div', { // Row - Police du text
                            className: 'form-group row '
                        },
                        el('label', {
                                className: 'col-sm-3 col-form-label d-flex align-item-center',
                                id: "formLabel",
                                dangerouslySetInnerHTML: {
                                    __html: `	Police du texte`
                                }
                            },
                        ),
                        el('div', {
                                className: 'col-sm-9',
                            },
                            el('select', {
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
                    el('div', { // Row - Couleur du bouton
                            className: 'row '
                        },
                        el('div', {
                                className: 'col-md-3',
                            },
                            el('label', {
                                    style: { fontSize: "14px" },
                                    dangerouslySetInnerHTML: {
                                        __html: `Couleur du bouton `
                                    }
                                }
                            )
                        ),
                        el('div', {
                                className: 'col-md-4 mr-3'
                            },
                            el('div', {
                                    className: 'input-group mb-3'
                                },
                                el('div', {
                                        className: 'input-group-prepend'
                                    },
                                    el('small', {
                                            style: { fontSize: '9px' },
                                            className: 'input-group-text',
                                            dangerouslySetInnerHTML: {
                                                __html: `<b>Arrière-plan</b>`
                                            }
                                        },
                                    )
                                ),
                                el('input', {
                                        type: 'text',
                                        className: 'form-control gray-border',
                                        value: props.attributes.buttonBgColor,
                                        onChange: updateButtonBgColor,
                                        style: { fontSize: '11px' },
                                    }
                                ),
                                el('div', {
                                        className: 'input-group-prepend'
                                    },
                                    el('input', {
                                            type: 'color',
                                            style: { height: ' 100%', width: '35px', padding: '3px 4px', borderRadius: '0' },
                                            value: props.attributes.buttonBgColor,
                                            onChange: updateButtonBgColor
                                        }
                                    ),
                                ),
                            )
                        ),
                        el('div', {
                                className: 'col-md-4'
                            },
                            el('div', {
                                    className: 'input-group mb-3'
                                },
                                el('div', {
                                        className: 'input-group-prepend'
                                    },
                                    el('small', {
                                            style: { fontSize: '9px' },
                                            className: 'input-group-text',
                                            dangerouslySetInnerHTML: {
                                                __html: `<b> Couleur texte </b>`
                                            }
                                        },
                                    )
                                ),
                                el('input', {
                                        type: 'text',
                                        className: 'form-control gray-border',
                                        value: props.attributes.buttonColor,
                                        onChange: updateButtonTexteColor,
                                        style: { fontSize: '11px' },
                                    }
                                ),
                                el('div', {
                                        className: 'input-group-prepend'
                                    },
                                    el('input', {
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
                    el('div', { // Row - Objectif de la collecte
                            className: `form-group row plugin-progressbar-${props.attributes.blockId} hide-me`,
                            onload: visibilityOnLoadProgressbarElements()
                        },
                        el('label', {
                                className: 'col-sm-3 col-form-label d-flex align-item-center',
                                id: "formLabel",
                                dangerouslySetInnerHTML: {
                                    __html: ` Objectif de collecte`
                                }
                            },
                        ),
                        el('div', {
                                className: 'col-sm-9',
                            },
                            el('input', {
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
                    el('div', { // Row - Montant de départ
                            className: `form-group row plugin-progressbar plugin-meter-${props.attributes.blockId} hide-me`,
                            onLoad: visibilityOnLoadMeterElements()
                        },
                        el('label', {
                                className: 'col-sm-3 col-form-label d-flex align-item-center',
                                id: "formLabel",
                                dangerouslySetInnerHTML: {
                                    __html: `Montant de départ`
                                }
                            },
                        ),
                        el('div', {
                                className: 'col-sm-9',
                            },
                            el('input', {
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
                    el('div', { // Row - Bouton prévisualiser
                            className: 'row '
                        },
                        el('div', {
                                className: 'col-md-12 text-center '
                            },
                            el('button', {
                                    className: ' btn btn-previsualiser  btn-info',
                                    onClick: changeTypeView,
                                    value: `preview-${props.attributes.blockId}`
                                },
                                "Prévisualiser"
                            )
                        )
                    ),
                ),
                el('span', { // Panel grille des donateurs
                        className: `panel-grille-${props.attributes.blockId} hide-me`,
                    },
                    el('div', { // Row - Ordonner par
                            className: 'form-group row'
                        },
                        el('label', {
                                className: 'col-sm-3 col-form-label d-flex align-item-center',
                                id: "formLabel",
                                dangerouslySetInnerHTML: {
                                    __html: `Ordre de classement`
                                }
                            },
                        ),
                        el('div', {
                                className: 'col-sm-9',
                            },
                            el('select', {
                                    onChange: selectedOrderValue,
                                    value: props.attributes.orderValue,
                                    className: 'form-control gray-border',
                                    style: { minHeight: '40px', minWidth: "100%", fontSize: "12px" },
                                    dangerouslySetInnerHTML: {
                                        __html: `${selectOptionToOrder} `
                                    }
                                },
                            ),
                        )
                    ),
                    el('div', { // Row - liste des formulaires
                            className: 'form-group row'
                        },
                        el('label', {
                                className: 'col-sm-3 col-form-label d-flex align-item-center',
                                id: "formLabel",
                                dangerouslySetInnerHTML: {
                                    __html: `Formulaire GiveXpert`
                                }
                            },
                        ),
                        el('div', {
                                className: 'col-sm-9',
                            },
                            el('select', {
                                    onChange: selectedTemplatePeer,
                                    value: props.attributes.templateID,
                                    className: 'form-control gray-border',
                                    style: { minHeight: '40px', minWidth: "100%", fontSize: "12px" },
                                    dangerouslySetInnerHTML: {
                                        __html: `${selectOptionPeer} `
                                    }
                                },
                            ),
                        )
                    ),
                    el('div', { // Radio pour le choix du modèle
                            className: 'form-group row  ',
                        },
                        el('div', { // Radio Modèle 1
                                className: 'form-group col-md-6 pa-gr-1'
                            },
                            el('label', {

                                    className: 'pt-2',
                                    for: "grille_1",
                                    dangerouslySetInnerHTML: {
                                        __html: `Modèle 1 :&nbsp;&nbsp;  `
                                    }
                                },
                            ),
                            el('input', {
                                    type: 'checkbox',
                                    id: "grille_1",
                                    onClick: changeChoiceView,
                                    checked: props.attributes.grilleBlock1ElementIsCheck,
                                    name: 'active_section_choice',
                                    value: props.attributes.grilleBlock1,
                                    className: "form-control gray-border",
                                    style: { display: 'inline-block' }
                                }
                            ),
                        ),
                        el('div', { // Radio Modèle 2
                                className: 'form-group col-md-6 pa-gr-2'
                            },
                            el('label', {
                                    className: 'pt-2',
                                    for: "grille_2",
                                    dangerouslySetInnerHTML: {
                                        __html: `Modèle 2 :&nbsp;&nbsp;  `
                                    }
                                },
                            ),
                            el('input', {
                                    type: 'checkbox',
                                    id: "grille_2",
                                    onClick: changeChoiceView,
                                    checked: props.attributes.grilleBlock2ElementIsCheck,
                                    name: 'active_section_choice',
                                    value: props.attributes.grilleBlock2,
                                    className: "form-control gray-border",
                                    style: { display: 'inline-block' }
                                }
                            ),
                        ),
                    ),
                    el('div', { // Modèle 1
                            className: `container grille-block-1-${props.attributes.blockId} hide-me`
                        },
                        el('div', {
                                className: ` row `,
                                id: 'model-1-content'
                            },
                            showModel1()
                        ),
                    ),
                    el('div', { // Modèle 2
                            className: `container grille-block-2-${props.attributes.blockId} hide-me `
                        },
                        el('div', {
                                className: 'row',
                                id: 'model-2-content'
                            },
                            showModel2()
                        )
                    )
                )
            ),
            el('div', { // Contenu de la prévisualisation
                    className: 'container  hide-me',
                    id: `preview-content-${props.attributes.blockId}`
                },
                el('div', {
                        className: ""
                    },
                    el('div', {
                            className: 'col-md-12',
                        },
                        el('div', {
                                className: meterBarElementShow,
                            },
                            el('span', {
                                    id: "progress-bar-collected-text-" + props.attributes.blockId,
                                    style: {
                                        fontFamily: props.attributes.buttonPolice,
                                        fontSize: '18px'
                                    }
                                },
                                props.attributes.collectedAmount + " € collectés"
                            )
                        ),
                        el('div', {
                                className: progressBarElementShow,
                                style: { backgroundColor: props.attributes.buttonColor }
                            },
                            el('div', {
                                    className: 'progress-bar',
                                    role: "progressbar",
                                    ariaValuenow: parseInt(props.attributes.collectionObjective),
                                    ariaValuemin: "0",
                                    ariaValuemax: "100",
                                    style: {
                                        maxWidth: parseInt(props.attributes.collectionPercentage) + "%",
                                        backgroundColor: props.attributes.buttonBgColor,
                                        color: props.attributes.buttonColor,
                                    }
                                },
                                el('span', {
                                        style: { fontSize: '18px' }
                                    }, parseInt(props.attributes.collectionPercentage) + "%"
                                )
                            ),
                        ),
                        el('div', {
                                className: progressBarElementShow,
                            },
                            el('span', {
                                    style: {
                                        fontFamily: props.attributes.buttonPolice,
                                        fontSize: '18px'
                                    }
                                },
                                "sur " + props.attributes.collectionObjective + " € d'objectifs"
                            )
                        ),
                    ),
                    el('div', {
                            className: buttonElementShow + ' col-md-12 mt-2',
                        },
                        el('button', {
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
                    el('div', {
                            className: 'row '
                        },
                        el('div', {
                                className: 'col-md-12 text-center '
                            },
                            el('button', {
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
        const buttonElementShow = (props.attributes.formElementIsCheck && props.attributes.buttonElementIsCheck) ? "" : "hide-me";
        const progressBarElementShow = (props.attributes.formElementIsCheck && props.attributes.progressBarElementIsCheck) ? "" : "hide-me";
        const meterBarElementShow = (props.attributes.formElementIsCheck && props.attributes.meterElementIsCheck) ? "" : "hide-me";
        const grillBlock1ElementShow = (props.attributes.grilleElementIsCheck && props.attributes.grilleBlock1ElementIsCheck) ? "" : "hide-me";
        const grillBlock2ElementShow = (props.attributes.grilleElementIsCheck && props.attributes.grilleBlock2ElementIsCheck) ? "" : "hide-me";
        
        function renderOfModel1(title, name, percentage, collected, goal, remainingDay, redirectLink, image) {
            return el('div', {
                    className: "col-lg-4 mb-4",
                },
                el('div', {
                        className: "card",
                        style: {'padding': '0px', 'width': '100%',}
                    },
                    el('img', {
                            src: image,
                            style: { 'object-fit': 'cover', width: "100%", height: '210px' },
                        }
                    ),
                    el('div', { // card-body
                            className: "card-body",
                            style: { "padding-left": "5px", "padding-right": "5px", }
                        }, 
                        el('p', {
                                className: "card-title",
                                style: { 'white-space': 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis', },
                                dangerouslySetInnerHTML: {
                                    __html: title
                                }
                            }
                        ),
                        el('p', {
                                style: { 'white-space': 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis', },
                            },
                            el('a', {
                                style: { "text-decoration": "none", "color": "black" },
                                href: redirectLink,
                                dangerouslySetInnerHTML: {
                                    __html: `Par ` + name
                                }
                            }),
                        ),
                        el('div', { // Progress bar
                                className: ""
                            }, 
                            el('div', {
                                    className: "progress",
                                    style: {
                                        "height": "20px",
                                    },
                                },
                                el('div', {
                                    className: "progress-bar bg-info",
                                    role: "progressbar" ,
                                    style: {
                                        "width": parseInt(percentage) + "%",
                                    },
                                    "aria-valuenow": "50",
                                    "aria-valuemin": "0",
                                    "aria-valuemax": "100",
                                    dangerouslySetInnerHTML: {
                                        __html: parseInt(percentage) + "%"
                                    }
                                })
                            ),
                        ),
                    ),
                    el('div', {
                            className: "row",
                            style: { "padding-left": "5px", "padding-right": "5px", }
                        },
                        el('div', {
                                className: "col-lg-4"
                            },
                            el('p', {
                                    className: "",
                                    style: {margin: "0px"},
                                    dangerouslySetInnerHTML: {
                                        __html: collected + ` € `
                                    }
                                }
                            ),
                            el('p', {
                                className: "",
                                style: { 'white-space': 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis', },
                                dangerouslySetInnerHTML: {
                                    __html: `Collectés `
                                }
                            }
                            )
                        ),
                        el('div', {
                                className: "col-lg-4"
                            },
                            el('p', {
                                    className: "",
                                    style: {margin: "0px"},
                                    dangerouslySetInnerHTML: {
                                        __html: goal + ` € `
                                    }
                                }
                            ),
                            el('p', {
                                className: "",
                                style: { 'white-space': 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis', },
                                dangerouslySetInnerHTML: {
                                    __html: `Attendus `
                                }
                            }
                            )
                        ),
                        el('div', {
                                className: "col-lg-4"
                            },
                            el('p', {
                                    className: "",
                                    style: {margin: "0px"},
                                    dangerouslySetInnerHTML: {
                                        __html: remainingDay + `j `
                                    }
                                }
                            ),
                            el('p', {
                                className: "",
                                style: { 'white-space': 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis', },
                                dangerouslySetInnerHTML: {
                                    __html: `Restant `
                                }
                            }
                            )
                        ),
                    ),
                ),
            );
        }

        function renderOfModel2(title, percentage, amount, redirectLink, image) {
            
            return el('div', {
                    className: "col-lg-4 mb-4",
                },
                el('div', {
                    className: "card",
                    style: { 'padding': '0px', 'width': '100%', }
                },
                    el('img', {
                        src: image,
                        style: { 'object-fit': 'cover', width: "100%", height: '210px' },
                    }
                    ),
                    el('div', { // card-body
                        className: "card-body",
                        style: { "padding-left": "5px", "padding-right": "5px", }
                    },
                        el('p', {
                                className: "card-title",
                                style: { 'white-space': 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis', },
                                title: title,
                                dangerouslySetInnerHTML: {
                                    __html: title
                                }
                            }
                        ),
                        el('div', { // Progress bar
                                className: ""
                            },
                            el('div', {
                                    className: "progress",
                                    style: {
                                        "height": "20px",
                                    },
                                },
                                el('div', {
                                    className: "progress-bar bg-info",
                                    role: "progressbar",
                                    style: {
                                        "width": parseInt(percentage) + "%",
                                    },
                                    "aria-valuenow": "50",
                                    "aria-valuemin": "0",
                                    "aria-valuemax": "100",
                                    dangerouslySetInnerHTML: {
                                        __html: parseInt(percentage) + "%"
                                    }
                                })
                            ),
                        ),
                    ),
                    el('div', {
                            className: "row",
                            style: { "padding-left": "5px", "padding-right": "5px", }
                        },
                        el('div', {
                                className: "col-lg-12",
                                style: { "text-align": "center",},
                                dangerouslySetInnerHTML: {
                                    __html: amount + ` € d'objectif `
                                }
                            },
                        ),
                        el('div', {
                                className: "col-lg-12 mb-4",
                                style: { "text-align": "center",}
                            },
                            el('a', {
                                className: "btn btn-info",
                                style: { "width": "100%" },
                                href: redirectLink,
                                dangerouslySetInnerHTML: {
                                    __html: `En savoir plus `
                                }
                            })
                        ),
                    ),
                ),
            );
        }

        function showRenderModel1() {
            var arrayOfModel = new Array();

            if (templateCollectorsList) {
                templateCollectorsList.forEach(templateCollectors => {
                    var image = templateCollectors.photo;
                    var goal = parseInt(templateCollectors.goal);
                    var name = templateCollectors.firstname + ' ' + templateCollectors.lastname;
                    var remainingDay = (templateCollectors.remaining_day > 100) ;
                    var percentage = (parseInt((templateCollectors.collected / goal) * 100) > 100) ? 100 : parseInt((templateCollectors.collected / goal) * 100);
                    var renderModel = renderOfModel1(templateCollectors.title, name, percentage, parseInt(templateCollectors.collected), goal, remainingDay, templateCollectors.url, image);
                    arrayOfModel.push(renderModel);
                });

            }
            arrayOfModel.join();

            return arrayOfModel;
        }
        
        function showRenderModel2() {
            var arrayOfModel = new Array();
            
            if (templateCollectorsList) {
                templateCollectorsList.forEach(templateCollectors => {
                    var image = templateCollectors.photo;
                    var goal = parseInt(templateCollectors.goal);
                    var percentage = (parseInt((templateCollectors.collected / goal) * 100) > 100) ? 100 : parseInt((templateCollectors.collected / goal) * 100);
                    var renderModel = renderOfModel2(templateCollectors.title, percentage, parseInt(templateCollectors.collected), templateCollectors.url, image);
                    arrayOfModel.push(renderModel);
                });

            }
            arrayOfModel.join();
            
            return arrayOfModel;
        }
        
        return el('div', {
                className: ""
            },
            el('div', {
                    className: 'col-md-12 ',
                },
                el('div', {
                        className: meterBarElementShow,
                    },
                    el('span', {
                            id: "progress-bar-collected-text-" + props.attributes.blockId,
                            style: {
                                fontFamily: props.attributes.buttonPolice,
                                fontSize: '20px'
                            }
                        },
                        props.attributes.collectedAmount + " € collectés"
                    )
                ),
                el('div', {
                        className: progressBarElementShow,
                        style: { height: '30px', backgroundColor: props.attributes.buttonColor }
                    },
                    el('div', {
                            id: "custom-progress-bar-" + props.attributes.blockId,
                            className: 'progress-bar p-0',
                            role: "progressbar",
                            ariaValuenow: parseInt(props.attributes.collectionObjective),
                            ariaValuemin: "0",
                            ariaValuemax: "100",
                            style: {
                                maxWidth: parseInt(props.attributes.collectionPercentage) + "%",
                                backgroundColor: props.attributes.buttonBgColor,
                                color: props.attributesbuttonColor,
                            }
                        },
                        el('span', {
                                id: "custom-progress-span-" + props.attributes.blockId,
                                style: { fontSize: '19px' }
                            }, parseInt(props.attributes.collectionPercentage) + "%"
                        )
                    ),
                ),
                el('div', {
                        className: progressBarElementShow,
                    },
                    el('span', {
                            style: {
                                fontFamily: props.attributes.buttonPolice
                            }
                        },
                        "sur " + props.attributes.collectionObjective + " € d'objectifs"
                    )
                ),
            ),
            el('div', {
                    className: buttonElementShow + ' col-md-12 mt-2',
                },
                el('button', {
                        type: ' col-md-12',
                        className: 'redirectButton',
                        dataText: props.attributes.outSideButtonLink,
                        dataRedirect: props.attributes.buttonTypeRedirect,
                        style: {
                            backgroundColor: props.attributes.buttonBgColor,
                            color: props.attributes.buttonColor,
                            fontFamily: props.attributes.buttonPolice,
                            fontSize: '18px'
                        }
                    },
                    props.attributes.buttonText,
                )
            ),
            el('div', {
                    className: grillBlock1ElementShow + " row mt-2",
                    id: "grille-block-1"
                },
                showRenderModel1(),
            ),
            el('div', {
                    className: grillBlock2ElementShow + " row mt-2",
                    id: "grille-block-2"
                },
                showRenderModel2(),
            ),
        );
    }
});


(function ($) {
    $('input').css('backgroundColor', 'red')

})(jQuery);