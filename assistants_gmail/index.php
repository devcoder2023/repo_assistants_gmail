
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style/style.css">
    <title>AI Gmail</title>
</head>
<body>
    
  <div id="wrraper" class="wrraper">

    <div class="widget widgetAssistants">

      <div class="containerButtons">
        <div id="buttonAss" class="buttons">Start Assistants</div>
      </div>

      <div class="containerChat">
        <ul id="listAssistants" class="list listAssistants">

          <li>
              <div id="cardchat" class="cardchat cardleft">
                  <div class="cardbody">
                      Card Left
                  </div>
              </div>
          </li>
          <li>
              <div id="cardchat" class="cardchat cardright">
                  <div class="cardbody">
                      Car Right
                  </div>
              </div>
          </li>
        </ul>
      </div>

    </div>

    <div class="widget widgetGmail">

      <div class="containerButtons">
      <div id="buttonGmail" class="buttons">Start Gmail</div>
      </div>

      <div class="containerChat">
        <ul id="listGmail" class="list listGmail">
          
        <li>
            <div class="cardemail">
              <div class="cardemailheader">
                <h5>mailsender@mail.com</h5>
                <h5>me@mail.com</h5>
                <h5>15 October 2024 17:43:11</h5>
              </div>
            <h3>Subject Titlw 5 AI</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque harum enim, ullam porro ipsam nihil ad sit tempore itaque! Commodi atque minus nobis obcaecati dignissimos assumenda itaque consequatur aliquid suscipit?</p>
            </div>
          </li>

        </ul>

      </div>
      
    </div>

  </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.4/axios.min.js"></script>

    <script defer type="module" src="script/script.js"></script>
    <script defer src="https://apis.google.com/js/api.js"></script>
    <script defer src="https://accounts.google.com/gsi/client"></script>


    <!--
    <script type="text/javascript">
      /* exported gapiLoaded */
      /* exported gisLoaded */
      /* exported handleAuthClick */
      /* exported handleSignoutClick */

      // TODO(developer): Set to client ID and API key from the Developer Console
      const CLIENT_ID = '';
      const API_KEY = '';

      // Discovery doc URL for APIs used by the quickstart
      const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

      let tokenClient;
      let gapiInited = false;
      let gisInited = false;

    //   document.getElementById('authorize_button').style.visibility = 'hidden';
    //   document.getElementById('signout_button').style.visibility = 'hidden';
    document.getElementById('buttonGmail').style.visibility = 'hidden';

      /**
       * Callback after api.js is loaded.
       */
      function gapiLoaded() {
        console.log("Start gapi")
        gapi.load('client', initializeGapiClient);
        console.log("End gapi")
      }

      /**
       * Callback after the API client is loaded. Loads the
       * discovery doc to initialize the API.
       */
      async function initializeGapiClient() {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButtons();
      }

      /**
       * Callback after Google Identity Services are loaded.
       */
      function gisLoaded() {
        console.log("Start gis")
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
        });
        gisInited = true;
        maybeEnableButtons();
        console.log("End gis")
      }

      /**
       * Enables user interaction after all libraries are loaded.
       */
      function maybeEnableButtons() {
        console.log("Ok ?");
        if (gapiInited && gisInited) {
            console.log("Ok 000");
        //   document.getElementById('authorize_button').style.visibility = 'visible';
        document.getElementById('buttonGmail').style.visibility = 'visible';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick() {
        console.log("click Auth Start");
        tokenClient.callback = async (resp) => {
          console.log("Respone Auth");
          if (resp.error !== undefined) {
            throw (resp);
          }
        //   document.getElementById('signout_button').style.visibility = 'visible';
        //   document.getElementById('authorize_button').innerText = 'Refresh';
          await listLabels();
          await listMessages();
        };

        if (gapi.client.getToken() === null) {
          // Prompt the user to select a Google Account and ask for consent to share their data
          // when establishing a new session.
          tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
          // Skip display of account chooser and consent dialog for an existing session.
          tokenClient.requestAccessToken({prompt: ''});
        }
        console.log("click Auth End");
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
          google.accounts.oauth2.revoke(token.access_token);
          gapi.client.setToken('');
        //   document.getElementById('content').innerText = '';
        //   document.getElementById('contentmsg').innerText = '';
        //   document.getElementById('authorize_button').innerText = 'Authorize';
        //   document.getElementById('signout_button').style.visibility = 'hidden';
        }
      }

      /**
       * Print all Labels in the authorized user's inbox. If no labels
       * are found an appropriate message is printed.
       */
      async function listLabels() {
        console.log("Start Labs");
        let response;
        try {
          response = await gapi.client.gmail.users.labels.list({
            'userId': 'me',
          });
        } catch (err) {
        //   document.getElementById('content').innerText = err.message;
          return;
        }
        const labels = response.result.labels;
        if (!labels || labels.length == 0) {
        //   document.getElementById('content').innerText = 'No labels found.';
          return;
        }
        // Flatten to string to display
        const output = labels.reduce(
            (str, label) => `${str}${label.name}\n`,
            'Labels:\n');
        // document.getElementById('content').innerText = output;
        console.log("End Labs");
      }

      let listsmsgbody = "";

    async function listMessages() {
        console.log("Start Message..");
        let response;
        try {
          response = await gapi.client.gmail.users.messages.list({
            'userId': 'me',
          });
        } catch (err) {
        //   document.getElementById('contentmsg').innerText = err.message;
          return;
        }
        const msgs = response.result.messages;
        if (!msgs || msgs.length == 0) {
        //   document.getElementById('contentmsg').innerText = 'No messages found.';
          return;
        }
        let listsmsg = "";
        for (let i = 0; i < 3; i++) {
            console.log("for list msg: " + i );
            var message = msgs[i].id;
            var bodyMessage = await getMessage(message);
            /*
            gapi.client.gmail.users.messages.get({
              'userId': 'me',
              'id': message

            }).then(response => {
              console.log("Resp MSG!");
              const ss = response.result;
              const headers = ss.payload.headers;

              const subjectHeader = headers.find(header => header.name === 'Subject');
              const subject = subjectHeader ? subjectHeader.value : "No Subject";
              const body = getBody(ss.payload);
              const decodedBody = decodeBase64(body);

              listsmsg += "</br>"+message+"| "+decodedBody;
            });
            */
            

            // console.log("Msg: " + message);
            listsmsg += "</br>"+message+"| "+bodyMessage;
            // if(i>3) return;

            console.log("End Msg");
        }
        // document.getElementById('contentmsg').innerText = listsmsgbody;
        fillWidgetMessage();


        // Flatten to string to display
        /*
        const output = msgs.reduce(
            (str, msgs) => `${str}${label.messageId}\n`,
            'Meesages:\n');
        document.getElementById('contentmsg').innerText = output;
        */
    }

    async function getMessage(messageId) {

          console.log("Start getMessage");
          let resmsg = await gapi.client.gmail.users.messages.get({
            'userId': 'me',
            'id': messageId

          }).then(response => {
            console.log("Respone getMessage");

            const ss = response.result;
            const headers = ss.payload.headers;

            const fromHeader = headers.find(header => header.name === 'From');
            const toHeader = headers.find(header => header.name === 'To');
            const dateHeader = headers.find(header => header.name === 'Date');
            const subjectHeader = headers.find(header => header.name === 'Subject');

            const from = fromHeader ? fromHeader.value : "Unknown Sender";
            const to = toHeader ? toHeader.value : "Unknown Recipient";
            const date = dateHeader ? dateHeader.value : "Unknown Date";
            const subject = subjectHeader ? subjectHeader.value : "No Subject";

            const body = getBody(ss.payload);
            const decodedBody = decodeBase64(body);
            listsmsgbody += "<br>"+subject;

            addObjectMessages(from,to,date,subject,decodedBody);
          });
          console.log("End getMessage");
        }

        function getBody(messagePayload) {
          let body = '';
          if (messagePayload.parts) {
              // إذا كانت الرسالة تحتوي على أجزاء متعددة، يتم استخراج الجزء النصي
              messagePayload.parts.forEach(part => {
                  if (part.mimeType === 'text/plain' || part.mimeType === 'text/html') {
                      body = part.body.data;
                  }
              });
          } else {
              // إذا كانت الرسالة جزءًا واحدًا
              body = messagePayload.body.data;
          }
          return body;
        }
        function decodeBase64(encodedStr) {
          // استبدال الأحرف غير القياسية في Base64 ثم فك تشفير
          const decodedStr = atob(encodedStr.replace(/-/g, '+').replace(/_/g, '/'));
          return decodeURIComponent(escape(decodedStr));
        }


        let listObjectMessage = [];
        function addObjectMessages(from,to,date,subject,body) {
          objMessage = {
            from: from,
            to: to,
            date: date,
            subject: subject,
            body: body,
          };
          listObjectMessage.push(objMessage);

        }

        function fillWidgetMessage() {

          console.log("Start Fill Widget Gmail");
        //   let elementul = document.getElementById("elementul");
        //   elementul.innerHTML = "";

          for(let i=0; i<listObjectMessage.length; ++i) {

            let code = `
            <li>
              <div class="itemmessage">
                <div class="headeritem">
                  <h5>${listObjectMessage[i].from}</h5>
                  <h5>${listObjectMessage[i].to}</h5>
                  <h5>${listObjectMessage[i].date}</h5>
                </div>
              <h3>${listObjectMessage[i].subject}</h3>
              <p>${listObjectMessage[i].body}</p>
              </div>
            </li>`;

            // elementul.insertAdjacentHTML("beforeend", code); 
          }
            

        }

    </script>

    <script async defer src="https://apis.google.com/js/api.js" onload="gapiLoaded()"></script>
    <script async defer src="https://accounts.google.com/gsi/client" onload="gisLoaded()"></script>
    -->
</body>
</html>
