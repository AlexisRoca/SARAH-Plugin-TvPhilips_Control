exports.action = function(data, callback, config, SARAH) 
{
  var config = config.modules.tvphilips_control;
  var ip = config.ip;                               // ip de la television                          
  var command = data.command;   
                      // nom de la requete à envoyer a la television
  var request = require('request');
                                                                                       
  if((command >= 0 && command <= 60) || command == "true" || command == "false" || command == "VolumeUp" || command == "VolumeDown")  //Gestion du volume    
  { 
    var url1 = 'http://' + ip + ':1925/1/audio/volume';                    // adresse pour changer le volume

        if(command == "true" || command == "false")
        {
          request({'uri': url1, 
                   'method': 'post',
                   'body' : JSON.stringify({'muted': command})             // transformation de notre message en json
                  }
           ,function(error, response, body)
            {
                  if (!error || response.statusCode == 200)
                  {
                    console.log("Mute : " + command);                     
                    callback({'tts' : ""});                                   
                  }      
            }      
          ) 
        } 


        else if(command == "VolumeUp" || command == "VolumeDown")
        {
          request({  'uri': url1, 
                     'method': 'get',
                  }

                  ,function(error, response, json)
                  {
                    var volume = JSON.parse(json).current;

                    if (command == "VolumeUp") volume += 5;
                    else volume -= 5;
                    console.log("niveau volume de la television : " + volume);                    

                    request({'uri': ('http://' + ip + ':1925/1/audio/volume'), 
                             'method': 'post',
                             'body' : JSON.stringify({'current': volume})                                                     
                            }
                            ,function(error, response, body)
                            {
                              if (!error || response.statusCode == 200)
                              { 
                                console.log("niveau volume de la television : " + command);                                        
                                callback({'tts' : ""});                                                   
                              }      
                            }
                           )
                  }     
                 )            
        }


        else
        {
          request({'uri': url1, 
                   'method': 'post',
                   'body' : JSON.stringify({'current': command})                                
                  }
           ,function(error, response, body)
            {
                  if (!error || response.statusCode == 200)
                  {
                    console.log("niveau volume de la television : " + command);                           
                    callback({'tts' : ""});                                             
                  }      
            }      
          )       
        } 
  }



  else if(command == "hdmi1" || command == "hdmi2" || command == "hdmi3" || command == "hdmiside"  || command == "tv")   // Gestion des sources
  {
    var url2 = 'http://' + ip + ':1925/1/sources/current';                                                               // adresse pour changer de source
  
    request({'uri': url2, 
             'method': 'post',
             'body' : JSON.stringify({'id': command})                                                                  
            }
     ,function(error, response, body)
      {
            if (!error || response.statusCode == 200)
            {
              console.log("commande television : " + command);                                                         
              callback({'tts' : ""});                                                                          
            }      
      }      
    )
  }



  else if(command == "modetv" || command == "modeSARAH") // Gestion du mode televison
  { 
      if(command == "modetv")
      {
        console.log("\n--------------------------   Mode Television active   --------------------------\n")
        callback({'tts': "Mode Television activé"})          
      }

      else
      {
        console.log("\n\n--------------------------   Fonctionnement general   --------------------------\n")
        callback({'tts': "Retour en fonctionnement général"})          
      }
  }


  else  // Gestion des commmandes de la télécommande
  {
    var url3 = 'http://' + ip + ':1925/1/input/key';                                                                         // adresse pour changer de source
  

    request({'uri': url3, 
             'method': 'post',
             'body' : JSON.stringify({'key': command})                                                                      
            }
     ,function(error, response, body)
          {
                if (!error || response.statusCode == 200)
                {
                  console.log("commande television : " + command);                                                     
                  callback({'tts' : ""});                                                                          
                }      
          }      
    )      
  }
}