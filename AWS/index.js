/*
TODO: 

- crew  - who and what type?
- aim +1 for damage
- bomb door explosion
- bomber loss to dmg

*/

/* eslint-disable  func-names */
/* eslint-disable  no-console */
const Alexa = require('ask-sdk');
var t = require('./charts');

const ResetAllVariablesHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ResetAllVariables';
  },
  async handle(handlerInput) {
    
    try {
      const attributesManager = handlerInput.attributesManager;
      const attributes = await attributesManager.getPersistentAttributes() || {};
      attributes.month = 'August';
      attributes.moon = 'none';
      attributes.radar = 0;
      attributes.FuG227 = '';
      attributes.radarSkill = '';
      attributes.planeDamage = '';
      attributesManager.setPersistentAttributes(attributes);
      await attributesManager.savePersistentAttributes();
    } catch (e) { }
    
    let speak = `All variables are now reset to defaults`;
    return handlerInput.responseBuilder
      .speak(speak)
      .reprompt(speak)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const LandingPlaneHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'LandingPlane';
  },
  async handle(handlerInput) {
    
    var planeDamage = '';
    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        planeDamage = attributes.planeDamage;
    } catch (e) {}
    
    let speak = `You are now landing your plane. `;
    
    if (planeDamage){
       planeDamage = planeDamage.replace('null','');
       speak += ` with damage to your ` + planeDamage; 
        if (planeDamage.indexOf('Controls') > -1)
            iLandingRoll += 1;
        if (planeDamage.indexOf('Engine') > -1)
            iLandingRoll += 1;
        if (planeDamage.indexOf('Landing') > -1)
            iLandingRoll += 1;
    }

    let iLandingRoll = t.RollResult(2,6);

    return handlerInput.responseBuilder
      .speak(speak)
      .reprompt(speak)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const ApproachDistanceHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ApproachDistance';
  },
  async handle(handlerInput) {
    const distance = handlerInput.requestEnvelope.request.intent.slots.distance.value;
    
    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        attributes.distance = distance;
        attributesManager.setPersistentAttributes(attributes);
        await attributesManager.savePersistentAttributes();
    } catch (e) {}
    
    const speak = `You are now approaching from ` + distance + ` distance.  Check speed differences, and if still in range, draw two cards and attack.`;
    return handlerInput.responseBuilder
      .speak(speak)
      .reprompt(speak)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const TookDamageHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TookDamage';
  },
   async handle(handlerInput) {
    const count = handlerInput.requestEnvelope.request.intent.slots.damage.value;
    var dmg = t.IncomingDamage(parseInt(count));
    
    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        attributes.planeDamage += dmg;
        attributesManager.setPersistentAttributes(attributes);
        await attributesManager.savePersistentAttributes();
    } catch (e) {}

    dmg = `You took damage to your ` + dmg;
    return handlerInput.responseBuilder
      .speak(dmg)
      .reprompt(dmg)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const AttackingBomberHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AttackingBomber';
  },
  async handle(handlerInput) {
    var distance = 'long';
    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        distance = attributes.distance;
    } catch (e) {}

    let target = handlerInput.requestEnvelope.request.intent.slots.target.value;
    const attackType = handlerInput.requestEnvelope.request.intent.slots.attackType.value;
    let speechText = `Approaching from ` + distance + ` range, you attack the bomber on his ${target} with a ${attackType}. Damaging his `;
    
    const originalTarget = target;
    if (target === 'gunner' || target === 'airframe')
      target = 'other';
      
    const iRoll = t.RollResult(1,6);
    var sEngine = 'Outward'
    if (iRoll < 4)
        sEngine = 'Inward '
    
    var iRandomAttacks = 0;

    if (attackType === 'group'){
        if (originalTarget === 'gunner'){ // random x2
            speechText += ` controls, <break time="300ms"/> airframe, <break time="300ms"/> gunner, <break time="300ms"/> `;
            iRandomAttacks = 2;
            if (distance === 'long')
                iRandomAttacks --;
            else if (distance === 'short')
                iRandomAttacks ++;
            speechText += t.GetRandomBomberDamage(target, iRandomAttacks);
        }
        if (originalTarget === 'airframe'){ // random x3
            speechText += ` controls, <break time="300ms"/> airframe, <break time="300ms"/> gunner, <break time="300ms"/> `;
            iRandomAttacks = 3;
            if (distance === 'long')
                iRandomAttacks --;
            else if (distance === 'short')
                iRandomAttacks ++;
            speechText += t.GetRandomBomberDamage(target, iRandomAttacks);
        }
        if (originalTarget === 'wing'){ // random x1
            speechText += ` controls, <break time="300ms"/> ` + sEngine + ` engine, <break time="300ms"/> wing and <break time="300ms"/> `;
            if (distance === 'medium')
                iRandomAttacks = 1;
            else if (distance ==='short')
                iRandomAttacks = 2;
            speechText += t.GetRandomBomberDamage(target, iRandomAttacks);
        }
    } else {
        try {
            const iX = parseInt(attackType);
            speechText += t.GetRandomBomberDamage(target, iX);
        } catch (e) {}
    }

    const finalSpeak = `<speak> ` + speechText + ` </speak>`

    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        attributes.lastStatus = finalSpeak;
        attributesManager.setPersistentAttributes(attributes);
        await attributesManager.savePersistentAttributes();
    } catch (e) {}

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const MusicAttackHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'MusicAttack';
  },
  async handle(handlerInput) {
    var distance = 'medium';
    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        distance = attributes.distance;
    } catch (e) {}

    if (distance === 'long'){
        return handlerInput.responseBuilder
          .speak(`You are not allowed to music attack at long range.  Please adjust your range, and tell me your new decision`)
          .reprompt(`You are not allowed to music attack at long range.  Please adjust your range, and tell me your new decision`)
          .withShouldEndSession(false)
          .getResponse();
    }

    const attackType = handlerInput.requestEnvelope.request.intent.slots.attackType.value;
    let speechText = `Approaching from ` + distance + ` range, you attack the bomber on his wing with a ${attackType}. 
        Damaging his fuel tanks, <break time="300ms"/> `;
    
    const iRoll = t.RollResult(1,6);
    var sEngine = 'Outward'
    if (iRoll < 4)
        sEngine = 'Inward '
    
    var iRandomAttacks = 0;

    // You're only allowed to attack the wing with MUSICK
    // And you score a fuel tank hit for free!
    if (attackType === 'group'){
        speechText += ` controls, <break time="300ms"/> ` + 
            sEngine + ` engine, <break time="300ms"/> wing and <break time="300ms"/> `;
        if (distance === 'medium')
            iRandomAttacks = 1;
        else if (distance ==='short')
            iRandomAttacks = 2;
        speechText += t.GetRandomBomberDamage('wing', iRandomAttacks);
    } else {
        try {
            const iX = parseInt(attackType);
            speechText += t.GetRandomBomberDamage('wing', iX);
        } catch (e) {}
    }

    if (distance === 'short'){
        const iRollMusic = parseInt(t.RollResult(2,6));
        const iMyDmg = parseInt(t.RollResult(1,6));
        if (iRollMusic === 2 || iRollMusic === 12){
            const dmg = t.IncomingDamage(parseInt(iMyDmg));
            speechText += ` <break time="300ms"/> Due to being close range, ` + dmg + `. `;
        }
    }

    const finalSpeak = `<speak> ` + speechText + ` </speak>`

    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        attributes.lastStatus = finalSpeak;
        attributesManager.setPersistentAttributes(attributes);
        await attributesManager.savePersistentAttributes();
    } catch (e) {}

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const InterceptCheckHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'InterceptCheck';
  },
  async handle(handlerInput) {
    var iRoll = t.RollResult(1,10);
    var speak = '';
    var month = 'August';
    var moon = 'none';
    var radar = '0';
    var FuG227 = '';
    var radarSkill = '';
    try {
      const attributesManager = handlerInput.attributesManager;
      const attributes = await attributesManager.getPersistentAttributes() || {};
      month = attributes.month;
      moon = attributes.moon;
      radar = attributes.radar;
      FuG227 = attributes.FuG227;
      radarSkill = attributes.radarSkill;
    } catch (e) { }

    if (radar == '0')
      iRoll -= 1;
    if (radar == '1')
      iRoll += 1;
    if (radar == '2')
      iRoll += 2;
    if (radar == '3')
      iRoll += 3;

    if (moon == 'none')
      iRoll -= 2;
    if (moon == 'dark')
      iRoll -= 1;
    if (moon == 'full')
      iRoll += 2;
    if (moon == 'bright')
      iRoll += 1;
      
    if (radarSkill == 'yes')
      iRoll += 1;
      
    if (iRoll < 1)
        iRoll = 1;

    // Added for testing    
    // iRoll = 10;
    
    switch(iRoll){
      case 1: speak = "You are unsure of your location.  This endurance box and next have no contacts. ";
        break;
      case 9,10: speak = "You intercept a bomber. ";
        const bomber = t.GetInterceptTarget(month);
        speak += ` <break time="500ms"/> a ` + bomber + ` <break time="300ms"/> appears out of the darkness.  Place a ` + 
            bomber + ` <break time="300ms"/> onto your board, and then draw two cards. `
        break;
      case 11,12,13,14,15,16: speak = "Bomber stream. ";
        break;
      default: speak = "Modified roll is " + iRoll.toString() + ". No interception.  Move to next box. ";
    }

    const finalSpeak = `<speak> ` + speak + ` </speak>`

    return handlerInput.responseBuilder
      .speak(finalSpeak)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const RadarSetupHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RadarSetup';
  },
  async handle(handlerInput) {
    const currRadar = handlerInput.requestEnvelope.request.intent.slots.radar.value;
    let speechText = `Working radar is now ${currRadar}.`;

    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
    attributes.radar = currRadar;
    attributesManager.setPersistentAttributes(attributes);
    await attributesManager.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const CurrentMonthHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'CurrentMonth';
  },
  async handle(handlerInput) {
    const currMonth = handlerInput.requestEnvelope.request.intent.slots.month.value;
    let speechText = `Current month is now ${currMonth}.`;

    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
    attributes.month = currMonth;
    attributesManager.setPersistentAttributes(attributes);
    await attributesManager.savePersistentAttributes();

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

const StartGameHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'StartGame';
  },
  async handle(handlerInput) {

  var month = 'August';
  var radar = '';

  try {
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
    month = attributes.month;
  } catch (e) {}

    var speak = t.CheckWeather();
    if (speak.indexOf('sock') == -1)
      speak += `<break time="500ms"/> ` + ` Your fighter is located in ` + t.CheckLocation(month);
    speak += `<break time="500ms"/> ` + t.CheckElectronicsFailure();
    if (speak.indexOf('radar has failed') !== -1)
      radar = 'none';
    speak += `<break time="500ms"/> ` + t.CheckSpoofRaids();
    const finalSpeak = `<speak> ` + speak + ` </speak>`
    
    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        attributes.lastStatus = finalSpeak;
        attributes.radar = radar;
        attributes.FuG227 = '';
        attributes.radarSkill = '';
        attributesManager.setPersistentAttributes(attributes);
        await attributesManager.savePersistentAttributes();
    } catch (e) {}
    
    return handlerInput.responseBuilder
      .speak(finalSpeak)
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
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
    var speechText = `You haven't set any variables up yet.  Say things like moon is full.`;
    try {
        speechText = `Moon is ${attributes.moon.toString()}. `;
    } catch (e) {}
    try {
        speechText += `Month is ${attributes.month.toString()}. `;
    } catch (e) {}
    try {
        speechText += `You have ${attributes.radar.toString()} working radar. `;
    } catch (e) {}
    try {
        const radar = attributes.radarSkill;
        if (radar == 'yes')
            speechText += `You radar skill is activated. `;
        else
            speechText += `You have no radar skill. `;
    } catch (e) {}

    return handlerInput.responseBuilder
      .speak(speechText)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const RepeatThatHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RepeatThat';
  },
  async handle(handlerInput) {

    var speak = 'I have nothing to repeat.';
    try {
      const attributesManager = handlerInput.attributesManager;
      const attributes = await attributesManager.getPersistentAttributes() || {};
      speak = attributes.lastStatus;
    } catch (e) { }

    return handlerInput.responseBuilder
      .speak(speak)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const GainedRadarSkillHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GainedRadarSkill';
  },
  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
    attributes.radarSkill = 'yes';
    attributesManager.setPersistentAttributes(attributes);
    await attributesManager.savePersistentAttributes();

    const speak = `Congratulations, you have now acquired the radar skill.`;
    return handlerInput.responseBuilder
      .speak(speak)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const GainedAimSkillHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GainedAimSkill';
  },
  async handle(handlerInput) {
    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
    attributes.aimSkill = 'yes';
    attributesManager.setPersistentAttributes(attributes);
    await attributesManager.savePersistentAttributes();

    const speak = `Congratulations, you have now acquired the aim skill. That's plus 1 random damage!`;
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
    var y = t.RollResult(1,6);
      
    return handlerInput.responseBuilder
      .speak(`Welcome to Night Fighter Ace.  You roll ` + y)
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
    ApproachDistanceHandler,
    AttackingBomberHandler,
    CurrentMonthHandler,
    GainedAimSkillHandler,
    GainedRadarSkillHandler,
    InterceptCheckHandler,
    LandingPlaneHandler,
    MoonHandler,
    MusicAttackHandler,
    RadarSetupHandler,
    RepeatThatHandler,
    ResetAllVariablesHandler,
    StartGameHandler,
    StatusHandler,
    TookDamageHandler,

    LaunchRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withTableName('NightFighter')
  .withAutoCreateTable(true)
  .lambda();