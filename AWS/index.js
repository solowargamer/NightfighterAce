/* eslint-disable  func-names */
/* eslint-disable  no-console */
const Alexa = require('ask-sdk');
const charts = require('./charts.json');

function RollResult(iNum, iSides) {
    var iResult = 0;
    for (var i = 0; i < iNum; i++)
      iResult += Math.floor((Math.random() * iSides) + 1);
    return iResult;
}

function CheckLocation(month){
  var json = {
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
   };

    var roll = RollResult(2,6);
    return json[month][roll];
}

function CheckWeather(){
  var i = RollResult(1,10);
  switch(i){
    case 8: return "weather is poor. ";
    case 9: return "weather is bad. ";
    case 10: return "You are socked in.  All flight operations are cancelled. ";
    default: return "weather is good. ";
  }
}

const StartGameHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'StartGame';
  },
  async handle(handlerInput) {

  var month = 'August';
  try {
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
    month = attributes.month;
  } catch (e) {}

   var speak = CheckWeather();
   if (speak.indexOf('sock') == -1)
      speak += ' Your fighter is located in ' + CheckLocation('August');

    return handlerInput.responseBuilder
      .speak(speak)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Welcome to Night Fighter Ace')
      .withShouldEndSession(false)
      .getResponse();
  },
};

const StatusHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'StatusRequest';
  },
  async handle(handlerInput) {
    // Get DB session attributes
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
    const speechText = `Last moon update was ${attributes.moon.toString()}.`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const MoonHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'MoonState';
  },
  async handle(handlerInput) {
    const moon = handlerInput.requestEnvelope.request.intent.slots.moontype.value;
    let speechText = `Moon is now ${moon}.`;

    // Get DB session attributes
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
    // Save entry
    attributes.moon = moon;
    attributesManager.setPersistentAttributes(attributes);
    await attributesManager.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can introduce yourself by telling me your name';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    MoonHandler,
    StatusHandler,
    StartGameHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withTableName('NightFighter')
  .withAutoCreateTable(true)
  .lambda();