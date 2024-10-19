
import MainApp from './mainApp.js';

let mainApp = new MainApp();

export default class Gmail {
    constructor( gapi , google ) {
        this.KEY_API = "";
        this.CLIENT_ID = '';
        this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';
        this.SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

        this._gapi = gapi;
        this._google = google;

        this.tokenClient;
        this.gapiInited = false;
        this.gisInited = false;
        this.listObjectMessage = [];
    }
    /* ROOT: gapi | google */

    gapiLoaded() {
        console.log("Start gapi")
        this._gapi.load('client', this.initializeGapiClient);
        console.log("End gapi")
    }

    async initializeGapiClient() {
        console.log("gapi Init ..");
        // let ggapi = gapi;
        await gapi.client.init({
          apiKey: "",
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
        });

        // this.gapiInited = true;
        // this.maybeEnableButtons();
        console.log("gapi Init Ok");
      }

      gisLoaded() {
        console.log("Start gis")
        this.tokenClient = this._google.accounts.oauth2.initTokenClient({
          client_id: this.CLIENT_ID,
          scope: this.SCOPES,
          callback: '', // defined later
        });
        this.gisInited = true;
        this.maybeEnableButtons();
        console.log("End gis")
      }

      maybeEnableButtons() {
        if ( this.gisInited) {
          document.getElementById('buttonGmail').style.visibility = 'visible';
        }
      }

      handleAuthClick() {
        console.log("click Auth Start");
        this.tokenClient.callback = async (resp) => {
          console.log("Respone Auth");
          if (resp.error !== undefined) {
            throw (resp);
          }
        
          await this.listMessages();
          console.log("End Respone Auth");
        };

        if (gapi.client.getToken() === null) {
          this.tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
          this.tokenClient.requestAccessToken({prompt: ''});
        }
        console.log("click Auth End");
      }


      async listMessages() {
          console.log("Start List Message..");

          this.listObjectMessage = [];
          let response;
          
          try {
            response = await gapi.client.gmail.users.messages.list({
              'userId': 'me',
              'labelIds': ['INBOX'], /* INBOX, SENT, TRASH, DRAFTS */
              'maxResults': 10 /* count msg return */
            });
          } catch (err) {
            document.getElementById('contentmsg').innerText = err.message;
            return;
          }
          const msgs = response.result.messages;
          if (!msgs || msgs.length == 0) {
            document.getElementById('contentmsg').innerText = 'No messages found.';
            return;
          }

          for (let i = 0; i < 3; i++) {
              console.log("for list msg: " + i );
              
              var objMessage = await this.getMessage(msgs[i].id);

              this.listObjectMessage.push(objMessage);

              console.log("End for msg");
          }

          // this.sendEmail("test@mail.com", "Tester Send Mail", "body message sender")
          // this.saveDraft("test@mail.com", "Tester Draft Mail", "body message draft")

          console.log("End List Message..");
          this.fillWidgetMessage();
      }



    async getMessage(messageId) {

        console.log("Start getMessage");

        const objMessage = {
            from: '',
            to: '',
            date: '',
            subject: '',
            body: '',
            status: '',
        };

        let resmsg = await gapi.client.gmail.users.messages.get({
          'userId': 'me',
          'id': messageId

        }).then(response => {
          console.log("Respone getMessage");

          const responseMessage = response.result;

          const headers = responseMessage.payload.headers;

          const fromHeader = headers.find(header => header.name === 'From');
          const toHeader = headers.find(header => header.name === 'To');
          const dateHeader = headers.find(header => header.name === 'Date');
          const subjectHeader = headers.find(header => header.name === 'Subject');

          const from = fromHeader ? fromHeader.value : "Unknown Sender";
          const to = toHeader ? toHeader.value : "Unknown Recipient";
          const date = dateHeader ? dateHeader.value : "Unknown Date";
          const subject = subjectHeader ? subjectHeader.value : "No Subject";

          const isUnread = responseMessage.labelIds.includes('UNREAD');
          const status = isUnread ? "Unread" : "Read";

          const body = this.getBody(responseMessage.payload);
          const decodedBody = this.decodeBase64(body);

          objMessage.from = from;
          objMessage.to = to;
          objMessage.date = date;
          objMessage.subject = subject;
          objMessage.body = decodedBody;
          objMessage.status = status;

        });
        console.log("End getMessage");

        return objMessage;
      }

      getBody(messagePayload) {
        let body = '';
        if (messagePayload.parts) {
           
            messagePayload.parts.forEach(part => {
                if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
                    body = part.body.data;
                }
            });
        } else {
            
            body = messagePayload.body.data;
        }
        return body;
      }
      decodeBase64(encodedStr) {
        const decodedStr = atob(encodedStr.replace(/-/g, '+').replace(/_/g, '/'));
        return decodeURIComponent(escape(decodedStr));
      }

      fillWidgetMessage() {

        console.log("Start Fill Widget Gmail");
        let elementul = document.getElementById("listGmail");
        elementul.innerHTML = "";

        for(let i=0; i<this.listObjectMessage.length; ++i) {

          let code = `
          <li>
            <div class="cardemail">
              <div class="cardemailheader">
                <h5>${this.listObjectMessage[i].from}</h5>
                <h5>${this.listObjectMessage[i].to}</h5>
                <h5>${this.listObjectMessage[i].date}</h5>
              </div>
            <h3>${this.listObjectMessage[i].subject}</h3>
            <p>${this.listObjectMessage[i].body}</p>
            </div>
          </li>`;

          elementul.insertAdjacentHTML("beforeend", code); 
        }
          

      }

      getListObjectMessages() {
        return this.listObjectMessage;
      }

      /* SEND MESSAGE */
      
      sendEmail(recipient, subject, messageBody) {
        
        const email = 
            `From: me\r\n` +
            `To: ${recipient}\r\n` +
            `Subject: ${subject}\r\n\r\n` +
            `${messageBody}`;

        
        const base64EncodedEmail = btoa(unescape(encodeURIComponent(email)))
                                    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        
        this._gapi.client.gmail.users.messages.send({
            'userId': 'me',
            'resource': {
                'raw': base64EncodedEmail
            }
        }).then(response => {
            console.log("Email sent successfully:", response);
            alert("Email sent successfully!");
        }).catch(error => {
            console.error("Error sending email:", error);
            alert("Failed to send email.");
        });
      }
      
      saveDraft(recipient, subject, messageBody) {
        
        const email = 
            `From: me\r\n` +
            `To: ${recipient}\r\n` +
            `Subject: ${subject}\r\n\r\n` +
            `${messageBody}`;

        
        const base64EncodedEmail = btoa(unescape(encodeURIComponent(email)))
                                    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        
        this._gapi.client.gmail.users.drafts.create({
            'userId': 'me',
            'resource': {
                'message': {
                    'raw': base64EncodedEmail
                }
            }
        }).then(response => {
            console.log("Draft saved successfully:", response);
            alert("Draft saved successfully!");
        }).catch(error => {
            console.error("Error saving draft:", error);
            alert("Failed to save draft.");
        });
      }



}
