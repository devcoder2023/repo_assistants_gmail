
import Assistants from './classAssistants.js';
import Gmail from './classGmail.js';

let assistants = null;
let gmail = null;

document.getElementById("buttonAss").addEventListener( "click" , (e) => {
    clickStartAssistants();
});
document.getElementById("buttonGmail").addEventListener( "click" , (e) => {
    clickStartGmail();
});
document.getElementById('buttonGmail').style.visibility = 'hidden';

window.addEventListener("DOMContentLoaded", function () { 
    
    initApp();
    
});

const SCIMA = "beforeend"; // "afterbegin" | "beforeend"

let innerChat = document.getElementById("listAssistants");

function initApp() {
    console.log("Start App");

    assistants = new Assistants();

    gmail = new Gmail( gapi , google );
    gmail.gapiLoaded();
    gmail.gisLoaded();
    
    console.log("Finish App");
}

function clickStartAssistants() {

    console.log("S");
    assistants.returnAssistants().then((response) => {
        console.log("re1");
        callThread();
    }).then((response) => {

    }).catch( (reject) => {
        console.log("catch1");
        console.log(reject);
    });
}

function callThread() {
    assistants.return_Threads().then((response) => {
        console.log("re2");
        callRunAssistants();
    }).then((response) => {

    }).catch( (reject) => {
        console.log("catch2");
        console.log(reject);

    });
}

function callRunAssistants() {
    assistants.runAssistants().then((response) => {
        console.log("IdRun: "+response.id);
        assistants.KEY_RUN = response.id;
        
    }).then((response) => {
        callCheckRun();
    }).catch( (reject) => {

    });
}

function callCheckRun() {

    assistants.checkRunAssistantsStatus().then((response) => {
        if(response.status == "completed") {
            console.log("completed");
            callMessage();
        } else {
            console.log("timer...");
            setTimeout(callCheckRun, 5000);
        }
    }).then((response) => {

    }).catch( (reject) => {

    });
}

function callMessage() {
    assistants.return_Messages().then((response) => {

        console.log("show messages");
        innerChat.innerHTML = "";

        let reply = response.data ;
        console.log("AA ");
        let data = reply ;
        console.log("AAa ");

        console.log(reply);

        let len = data.length ;
        console.log("AA " + len);

        for(var i=0; i<len; i++){
            console.log("For " + i);
            console.log( data[i] );

            let role = data[i].role ;
            let value = data[i].content[0].text.value ;

            if( role == "user")
            {
                appendInnerChatMe( value );
            }
            else if( role == "assistant")
            {
                appendInnerChatGPT( value );
            }
            else
            {
                appendInnerChatError( value );
            }

        }


    }).then((response) => {

    }).catch( (reject) => {
        appendInnerChatMe("Bad");
    });
}


function appendInnerChatMe( msg ) {
    
    let cardchat = `
    <li>
        <div id="cardchat" class="cardchat cardleft">
            <div class="cardbody">
                ${msg}
            </div>
        </div>
    </li>
    `;
    
    innerChat.insertAdjacentHTML(SCIMA, cardchat);
}

function appendInnerChatGPT( msg ) {
    
    let cardchat = `
    <li>
        <div id="cardchat" class="cardchat cardright">
            <div class="cardbody">
                ${msg}
            </div>
        </div>
    </li>
    `;
    
    innerChat.insertAdjacentHTML(SCIMA, cardchat);
}

function appendInnerChatError( msg ) {
    
    let cardchat = `
    <li>
        <div id="cardchat" class="cardchat carderror">
            <div class="cardbody">
                ${msg}
            </div>
        </div>
    </li>
    `;
    
    innerChat.insertAdjacentHTML(SCIMA, cardchat);
}

function fillAssistantsMessage() {

}

/* ******************* */



function clickStartGmail() {
    console.log("Click Gmail");
    gmail.handleAuthClick();
    console.log("End GET Gmail");

    // fillWidgetMessage();

    console.log("End Gmail");
}



async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: "",
      discoveryDocs: [],
    });
    let gapiInited = true;
  }

