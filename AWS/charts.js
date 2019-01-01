function RollResult(iNum, iSides) {
    var iResult = 0;
    for (var i = 0; i < iNum; i++)
      iResult += Math.floor((Math.random() * iSides) + 1);
    return iResult;
}

module.exports = {

CheckSpoofRaids: function(){
  var i = RollResult(2,6);
  switch(i){
    case 10,11: return "Spoof Raid! Lose 1 endurance box. ";
    case 12: return "Spoof Raid! Lose 2 endurance boxes. ";
    default: return "";
  }
},

CheckWeather: function(){
  var i = RollResult(1,10);
  switch(i){
    case 8: return "weather is poor. ";
    case 9: return "weather is bad. ";
    case 10: return "You are socked in.  All flight operations are cancelled. ";
    default: return "weather is good. ";
  }
},

RollResult: function(iNum, iSides) {
    var iResult = 0;
    for (var i = 0; i < iNum; i++)
      iResult += Math.floor((Math.random() * iSides) + 1);
    return iResult;
},

CheckElectronicsFailure: function(){
  var i = RollResult(1,10);
  switch(i){
    case 2: return "your other electronics have failed. Please mark it as unusable on your sheet. ";
    case 3: return "your main radar has failed.  Please mark it as unusable on your sheet.";
    case 4: return "your homing device has failed.  Please mark it as unusable on your sheet.";
    case 10: return "your secondary radar has failed.  Please mark it as unusable on your sheet.";
    case 11: return "your warning device has failed.  Please mark it as unusable on your sheet.";
    case 12: return "a random event has occurred.  Please consult table C1."
    default: return "your electronics are working perfectly. ";
  }
},

IncomingDamage: function(count){
  var json = {
      "damage":{
      "11":"Crew",
      "12":"Port Wing",
      "13":"Starboard Wing",
      "14":"FuB1 2F",
      "15":"Main Radar",
      "16":"Secondary Radar",
      "21":"Landing Gear",
      "22":"Port Engine",
      "23":"Starboard Engine",
      "24":"Oxygen",
      "25":"Port Engine",
      "26":"Controls",
      "31":"Starboard Engine ",
      "32":"Minor Dam",
      "33":"Airframe",
      "34":"Crew",
      "35":"Airframe",
      "36":"Controls",
      "41":"Secondary Radar",
      "42":"Port Wing",
      "43":"Forward Cannon",
      "44":"Homing Dev",
      "45":"Starboard Wing",
      "46":"Forward Guns",
      "51":"Port Engine",
      "52":"Airframe",
      "53":"Schlage Music",
      "54":"Starboard Engine",
      "55":"Airframe",
      "56":"Rear Guns",
      "61":"Main Radar",
      "62":"Schlage Music",
      "63":"Crew",
      "64":"Forward Weapons",
      "65":"Airframe",
      "66":"Fuel Tank"
      }
   };
   
    var results = '';
    for (var i=0; i<count; i++){
        const roll1 = parseInt(RollResult(1,6));
        const roll2 = parseInt(RollResult(1,6));
        const lookup = roll1.toString() + roll2.toString();
        results += json['damage'][lookup] + ', <break time="300ms"/> ';
    }
    
    return results;
},

GetRandomBomberDamage: function(target, repeat){
  var json = {
      "wing":{
         "1":"Wing ",
         "2":"Wing",
         "3":"Wing",
         "4":"Airframe",
         "5":"Controls",
         "6":"Inward Engine",
         "7":"Inward Engine",
         "8":"Outward Engine",
         "9":"Outward Engine",
         "10":"Fuel Tanks"
      },
      "other":{
         "1":"Airframe ",
         "2":"Airframe",
         "3":"Airframe",
         "4":"Random Wing ",
         "5":"Controls",
         "6":"Gunner",
         "7":"",
         "8":"Port Engine",
         "9":"Starboard Engine",
         "10":"Bomb Bay"
      }
  };
  
    var results = '';
    var count = 1;
    try {
        count = parseInt(repeat);
    } catch (e) {}
    
    for (var i=0; i<count; i++){
        var roll = RollResult(1,10);
        results += json[target][roll] + ', <break time="300ms"/> ';
    }
    
    return results;
},

GetInterceptTarget: function(month){
    // why the fuck does it never capitalize August?
    if (month==='august')
      month = 'August';
      
  var json = {
      "August":{
         "2":"Stirling H2S",
         "3":"Lancaster H2S",
         "4":"Stirling",
         "5":"Halifax H2S",
         "6":"Lancaster",
         "7":"Wellington",
         "8":"Wellington",
         "9":"Halifax",
         "10":"Stirling",
         "11":"Mosquito IX H2S",
         "12":"Mosquito II NF"
      },
      "September":{
         "2":"Stirling H2S",
         "3":"Lancaster H2S",
         "4":"Stirling",
         "5":"Halifax H2S",
         "6":"Lancaster",
         "7":"Lancaster",
         "8":"Halifax",
         "9":"Wellington",
         "10":"Stirling",
         "11":"Mosquito IX H2S",
         "12":"Mosquito II NF"
      },
      "October":{
         "2":"Stirling H2S",
         "3":"Lancaster",
         "4":"Stirling",
         "5":"Halifax H2S",
         "6":"Lancaster H2S",
         "7":"Lancaster",
         "8":"Halifax",
         "9":"Halifax H2S",
         "10":"Wellington",
         "11":"Mosquito IX H2S",
         "12":"Mosquito II NF"
      },
      "November":{
         "2":"Lancaster ",
         "3":"Lancaster H2S",
         "4":"Halifax",
         "5":"Halifax H2S",
         "6":"Lancaster",
         "7":"Lancaster ",
         "8":"Halifax",
         "9":"Halifax H2S",
         "10":"Lancaster",
         "11":"Mosquito IX H2S",
         "12":"Mosquito II NF"
      },
      "December":{
         "2":"Lancaster H2S",
         "3":"Lancaster",
         "4":"Lancaster",
         "5":"Halifax H2S",
         "6":"Lancaster",
         "7":"Halifax",
         "8":"Halifax ",
         "9":"Lancaster H2S",
         "10":"Lancaster",
         "11":"Mosquito IX H2S",
         "12":"Mosquito II NF"
      },
      "January":{
         "2":"Lancaster H2S",
         "3":"Lancaster",
         "4":"Halifax",
         "5":"Halifax H2S",
         "6":"Lancaster",
         "7":"Lancaster",
         "8":"Halifax",
         "9":"Lancaster H2S",
         "10":"Lancaster",
         "11":"Mosquito IX H2S",
         "12":"Mosquito II NF"
      },
      "February":{
         "2":"Lancaster H2S",
         "3":"Lancaster",
         "4":"Lancaster",
         "5":"Halifax H2S",
         "6":"Lancaster",
         "7":"Lancaster",
         "8":"Halifax",
         "9":"Lancaster H2S",
         "10":"Lancaster",
         "11":"Mosquito IX H2S",
         "12":"Mosquito II NF"
      },
      "March":{
         "2":"Lancaster H2S",
         "3":"Lancaster H2S",
         "4":"Halifax H2S",
         "5":"Lancaster",
         "6":"Lancaster",
         "7":"Lancaster",
         "8":"Halifax",
         "9":"Lancaster H2S",
         "10":"Lancaster",
         "11":"Mosquito IX H2S",
         "12":"Mosquito II NF"
      },
      "April":{
         "2":"Mosquito II NF",
         "3":"Lancaster H2S",
         "4":"Halifax H2S",
         "5":"Lancaster",
         "6":"Lancaster",
         "7":"Lancaster",
         "8":"Halifax",
         "9":"Lancaster H2S",
         "10":"Halifax",
         "11":"Mosquito IX H2S",
         "12":"Mosquito II NF"
      },
      "May":{
         "2":"Mosquito II NF",
         "3":"Lancaster ",
         "4":"Halifax H2S",
         "5":"Lancaster H2S",
         "6":"Lancaster",
         "7":"Lancaster",
         "8":"Halifax",
         "9":"Lancaster  H2S",
         "10":"Lancaster",
         "11":"Mosquito IX H2S",
         "12":"Mosquito XIX NF"
      },
      "June":{
         "2":"Mosquito XIX NF",
         "3":"Lancaster ",
         "4":"Halifax ",
         "5":"Lancaster ",
         "6":"Lancaster",
         "7":"Lancaster H2S",
         "8":"Lancaster ",
         "9":"Halifax",
         "10":"Halifax H2S",
         "11":"Mosquito IX H2S",
         "12":"Mosquito XIX NF"
      },
      "July":{
         "2":"Mosquito XIX NF",
         "3":"Halifax ",
         "4":"Halifax ",
         "5":"Lancaster H2S",
         "6":"Lancaster",
         "7":"Lancaster",
         "8":"Lancaster H2S",
         "9":"Lancaster",
         "10":"Halifax H2S",
         "11":"Mosquito IX H2S",
         "12":"Mosquito XIX NF"
      }
  }

    var roll = RollResult(2,6);
    return json[month][roll];
},

CheckLocation: function(month){
    if (month==='august')
      month = 'August';
      
  var json1 = {
        "August":{
         "2":"Hamburg (Bremen)",
         "3":"Hamburg (Bremen)",
         "4":"Berlin (Berlin)",
         "5":"Mannheim (Munich)",
         "6":"Nuremberg (Frankfurt)",
         "7":"Berlin (Berlin)",
         "8":"Peenmande (Bremen)",
         "9":"Nuremberg (Frankfurt)",
         "10":"Berlin (Berlin)",
         "11":"Mannheim (Munich)",
         "12":"Peenmunde (Bremen)"
      },
      "September":{
         "2":"Berlin (Berlin)",
         "3":"Bochum (Ruhr)",
         "4":"Bochum (Ruhr)",
         "5":"Berlin (Berlin)",
         "6":"Mannheim (Munich)",
         "7":"Hannover (Bremen)",
         "8":"Mannheim (Munich)",
         "9":"Munich (Munich)",
         "10":"Bochum (Ruhr)",
         "11":"Hannover (Bremen)",
         "12":"Berlin (Berlin)"
      },
      "October":{
         "2":"Hannover (Bremen)",
         "3":"Hannover (Bremen)",
         "4":"Frankfurt (Frankfurt)",
         "5":"Hannover (Bremen)",
         "6":"Bremen (Bremen)",
         "7":"Kassel (Ruhr)",
         "8":"Munich (Munich)",
         "9":"Leipzig (Berlin)",
         "10":"Hagen (Ruhr)",
         "11":"Stuttgart (Munich)",
         "12":"Stuttgart (Munich)"
      },
      "November":{
         "2":"Mannheim (Munich)",
         "3":"Dusseldorf  (Ruhr) ",
         "4":"Dusseldorf  (Ruhr)",
         "5":"Berlin (Berlin)",
         "6":"Berlin (Berlin)",
         "7":"Berlin (Berlin)",
         "8":"Leverkusen (Ruhr)",
         "9":"Frankfurt (Frankfurt)",
         "10":"Mannheim (Munich)",
         "11":"Leverkusen (Ruhr)",
         "12":"Frankfurt (Frankfurt)"
      },
      "December":{
         "2":"Cologne (Ruhr)",
         "3":"Berlin (Berlin)",
         "4":"Leipzig (Berlin)",
         "5":"Frankfurt (Frankfurt)",
         "6":"Berlin (Berlin)",
         "7":"Berlin (Berlin)",
         "8":"Berlin (Berlin)",
         "9":"Leipzig (Berlin)",
         "10":"Frankfurt (Frankfurt)",
         "11":"Berlin (Berlin) ",
         "12":"Peenmande (Bremen)"
      },
      "January":{
         "2":"Stettin (Bremen)",
         "3":"Berlin (Berlin)",
         "4":"Brunswick (Berlin)",
         "5":"Stettin (Bremen)",
         "6":"Berlin (Berlin)",
         "7":"Berlin (Berlin)",
         "8":"Berlin (Berlin)",
         "9":"Brunswick (Berlin)",
         "10":"Berlin (Berlin)",
         "11":"Magdeburg (Berlin) ",
         "12":"Magdeburg (Berlin)"
      },
      "February":{
         "2":"Augsburg (Munich)",
         "3":"Schweinfurt (Frankfurt)",
         "4":"Leipzig (Berlin)",
         "5":"Augsburg (Munich)",
         "6":"Berlin (Berlin)",
         "7":"Leipzig (Berlin)",
         "8":"Schweinfurt (Frankfurt)",
         "9":"Augsburg (Munich)",
         "10":"Schweinfurt (Frankfurt)",
         "11":"Berlin (Berlin)",
         "12":"Augsburg (Munich)"
      },
      "March":{
         "2":"Essen (Ruhr)",
         "3":"Nuremberg (Frankfurt)",
         "4":"Nuremberg (Frankfurt)",
         "5":"Stuttgart (Munich)",
         "6":"Frankfurt (Frankfurt)",
         "7":"Essen (Ruhr)",
         "8":"Stuttgart (Munich)",
         "9":"Frankfurt (Frankfurt)",
         "10":"Berlin (Berlin)",
         "11":"Essen (Ruhr)",
         "12":"Berlin (Berlin)"
      },
      "April":{
         "2":"Hannover (Bremen)",
         "3":"Hamburg (Bremen)",
         "4":"Dusseldorf  (Ruhr) ",
         "5":"Brunswick (Berlin)",
         "6":"Munich (Munich)",
         "7":"Dusseldorf  (Ruhr) ",
         "8":"Brunswick (Berlin)",
         "9":"Munich (Munich)",
         "10":"Cologne (Ruhr)",
         "11":"Cologne (Ruhr)",
         "12":"Essen (Ruhr) "
      },
      "May":{
         "2":"Dusseldorf(Ruhr)",
         "3":"Dortmund (Ruhr)",
         "4":"Brunswick (Berlin)",
         "5":"Dusseldorf  (Ruhr) ",
         "6":"Dortmund (Ruhr)",
         "7":"Brunswick (Berlin)",
         "8":"Aachen (Ruhr)",
         "9":"Aachen (Ruhr)",
         "10":"Duisburg (Ruhr)",
         "11":"Duisburg (Ruhr)",
         "12":"Hannover (Bremen)"
      },
      "June":{
         "2":"V-2 Site (France)",
         "3":"V-1 Sites (France)",
         "4":"V-1 Sites (France)",
         "5":"V-2 Site (France)",
         "6":"Railyards (France)",
         "7":"Railyards (France)",
         "8":"Wesseling (Ruhr)",
         "9":"Gelsenkirchen (Ruhr)",
         "10":"V-1 Sites (France)",
         "11":"Railyards (France)",
         "12":"Gottingen  (Ffurt)"
      },
      "July":{
         "2":"V-2 Site (France)",
         "3":"Stuttgart (Munich) ",
         "4":"Railyards (France) ",
         "5":"Stuttgart (Munich)",
         "6":"Stuttgart (Munich)",
         "7":"Kiel (Bremen)",
         "8":"Hamburg (Bremen) ",
         "9":"Stuttgart (Munich)",
         "10":"Wesseling (Ruhr)",
         "11":"Wesseling (Ruhr)",
         "12":"V-1 Site (France)"
      }
   }
    try {
        var roll = RollResult(2,6);
        return json1[month][roll] + ". ";
    } catch (e) {
        return "default Hamburg (Bremen). "
    }
}

};
