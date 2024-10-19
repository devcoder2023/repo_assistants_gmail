
import MainApp from './mainApp.js';

let mainApp = new MainApp();

export default class Assistants {
    constructor() {
        this.KEY_API = "";
        this.KEY_ASSISTANTS = "";
        this.KEY_THREAD = "";
        this.KEY_RUN = "";
    }

    returnAssistants() {
        const path = "https://api.openai.com/v1/assistants/" + this.KEY_ASSISTANTS ;
        
        var headers = {
            "Content-Type" : "application/json",
            "Authorization": "Bearer " + this.KEY_API,
            "OpenAI-Beta" : "assistants=v2",
        };

        var body = {};

        return mainApp.sendPost(path, headers, body);
    }

    runAssistants() {
        const path = "https://api.openai.com/v1/threads/" + this.KEY_THREAD + "/runs";

        var headers = {
            "Content-Type" : "application/json",
            "Authorization": "Bearer " + this.KEY_API,
            "OpenAI-Beta" : "assistants=v2",
        };

        var body = {
            assistant_id: this.KEY_ASSISTANTS,
        };

        return mainApp.sendPost(path, headers, body);
    }

    checkRunAssistantsStatus() {
        const path = "https://api.openai.com/v1/threads/" + this.KEY_THREAD + "/runs/" + this.KEY_RUN;

        var headers = {
            "Content-Type" : "application/json",
            "Authorization": "Bearer " + this.KEY_API,
            "OpenAI-Beta" : "assistants=v2",
        };

        var body = {};

        return mainApp.sendGet(path, headers);
    }

    return_Threads() {
        const path = "https://api.openai.com/v1/threads/" + this.KEY_THREAD ;

        var headers = {
            "Content-Type" : "application/json",
            "Authorization": "Bearer " + this.KEY_API,
            "OpenAI-Beta" : "assistants=v2",
        };

        var body = {};

        return mainApp.sendPost(path, headers, body);
    }

    return_Messages() {
        /* 
        ARG: [ limit(1-100) - order(asc-desc) - after - before ]
        ec: url/messages?limit=10&after=abc_456

        FROM Respone Get ListMessages:
        "first_id": "msg_abc123",
        "last_id": "msg_abc456",
        "has_more": false
        you can used in args with paginitions
        */ 
        const path = "https://api.openai.com/v1/threads/" + this.KEY_THREAD + "/messages?limit=100";

        var headers = {
            "Content-Type" : "application/json",
            "Authorization": "Bearer " + this.KEY_API,
            "OpenAI-Beta" : "assistants=v2",
        };

        var body = {};

        return mainApp.sendGet(path, headers);
    }
}
