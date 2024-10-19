
export default class MainApp {
    constructor() {

    }



    send = function(method , path , headers , form=null) {
        return new Promise( (resolve, reject) => {
            
            const token = this.getValCookie("token");
            
            let xhr = new XMLHttpRequest();
            
            xhr.onreadystatechange = function() {
                
                
                if(xhr.readyState == 4 && xhr.status == 200)
                {
                    let respon = sefatyJSON( xhr.responseText );
                    
                    let _status = respon["status"];
        
                    if(_status == 200)
                    {
                        const data = respon["data"];
                        resolve( data );
                    }
                    else if(_status == 400)
                    {
                        const data = respon["data"];
                        const textError = respon["error"];
                        let responError = { status: _status, data: data, message: textError };
                        reject( responError );
                    }
                    else
                    {
                        const data = respon["error"];
                        let responError = { status: _status, message: data };
                        reject( responError );
                    }
                    
                }
                else if(xhr.readyState == 4 && xhr.status != 200)
                {
                    reject(0);
                }
                else
                {
                }
                
            }
            
            xhr.open( method, path, true);
            
            Object.entries(headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key,value);
            });
            
            
            if(form == null)
            {
                xhr.send();
            }
            else
            {
                xhr.send(  form  );
            }
            
        });
    } ;


    
    sendPost(path , headers , body) {
        return new Promise( (resolve, reject) => {
            
            axios.post( path , body , { headers: headers }).then((response) => {
                
                console.log("Good Req");
                resolve( response.data );
                
            }).catch( (rej) => {
                
                console.log("Bad Req: " + rej);
                reject( rej );
            });
        
        });
    }
    sendGet(path , headers) {
        return new Promise( (resolve, reject) => {
            
            axios.get( path , { headers: headers }).then((response) => {
                
                console.log("Good Req");
                resolve( response.data );
                
            }).catch( (rej) => {
                
                console.log("Bad Req: " + rej);
                reject( rej );
                
            });
            
        });
    }
    
    
    
}
