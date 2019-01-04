/*
TODO: 

- Mesquito special combat
- Add burst modifiers

*/

/* eslint-disable  func-names */
/* eslint-disable  no-console */
const Alexa = require('ask-sdk');
var t = require('./charts');

const JammingModifierHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'JammingModifier';
  },
  async handle(handlerInput) {
    const jamming = handlerInput.requestEnvelope.request.intent.slots.jamming.value;
    let speak = `Your jamming is now ${jamming}, which will affect finding bombers. `;

    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        attributes.jamming = jamming;
        attributesManager.setPersistentAttributes(attributes);
        await attributesManager.savePersistentAttributes();
    } catch (e) {}

    return handlerInput.responseBuilder
      .speak(speak)
      .reprompt(speak)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const NoRadarPresentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'NoRadarPresent';
  },
  async handle(handlerInput) {
    let speak = `Your radars are now broken, which will affect finding bombers. `;

    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        attributes.noradar = 'yes';
        attributesManager.setPersistentAttributes(attributes);
        await attributesManager.savePersistentAttributes();
    } catch (e) {}

    return handlerInput.responseBuilder
      .speak(speak)
      .reprompt(speak)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const BomberDestroyedHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'BomberDestroyed';
  },
  async handle(handlerInput) {
    let speak = `The bomber explodes in a burst of flames and metal.  Mark another kill on your sheet. `;

    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        attributes.corkscrew = '';
        attributesManager.setPersistentAttributes(attributes);
        await attributesManager.savePersistentAttributes();
    } catch (e) {}

    return handlerInput.responseBuilder
      .speak(speak)
      .reprompt(speak)
      .withShouldEndSession(false)
      .getResponse();
  },
};

const MakingAnotherPassHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'MakingAnotherPass';
  },
  async handle(handlerInput) {
    let speak = `You attempt to make another pass, and `;
    const iPassRoll = parseInt(t.RollResult(1,6));
    // "making another pass" - corkscrew 1d^ 1-2 means he got away
    if (iPassRoll < 3)
      speak += ` the bomber disappears into the night.  You lost him. `;
    else
      speak += ` you are successful.  Line up your sights, and fire again. `;

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
    let iLandingRoll = parseInt(t.RollResult(2,6));

    if (planeDamage){
       planeDamage = planeDamage.replace('null','');
       speak += ` with damage to your ` + planeDamage; 
    }
    
    speak += `. You rolled a ` + iLandingRoll.toString() + ` for landing.  Add modifiers according to B7 chart`;
    const finalSpeak = `<speak> ` + speak + ` </speak>`

    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        attributes.lastStatus = finalSpeak;
        attributes.planeDamage = '';
        attributesManager.setPersistentAttributes(attributes);
        await attributesManager.savePersistentAttributes();
    } catch (e) {}

    return handlerInput.responseBuilder
      .speak(speak)
      .reprompt(speak)
      .withShouldEndSession(false)
      .getResponse();
  },
};

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
      attributes.planeDamage = '';
      attributes.corkscrew = '';
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
    
    const speak = `You are now approaching from ` + distance + ` range.  Check speed differences, and if still in range, draw two cards and attack.`;
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
    let dmg = t.IncomingDamage(parseInt(count));
    
    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        attributes.planeDamage += dmg;
        attributesManager.setPersistentAttributes(attributes);
        await attributesManager.savePersistentAttributes();
    } catch (e) {}

    dmg = `You took damage to your ` + dmg;

    try {
      if (dmg.indexOf('Crew') !== -1)
        dmg += ` Check chart B4 for crew injuries. `;
      if (dmg.indexOf('Oxygen') !== -1)
        dmg += ` Due to Oxygen damage, you must break off after current pass and land immediately. `;
      if (dmg.indexOf('Bomb Bay') !== -1)
        dmg += ` Check chart B4 for possible bomb bay explosion. `;
      if (dmg.indexOf('Fuel') !== -1)
        dmg += t.CheckFuelHit() + ` . `;
    } catch (e) {}
    
    const finalSpeak = `<speak> ` + dmg + ` </speak>`
    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        attributes.lastStatus = finalSpeak;
        attributesManager.setPersistentAttributes(attributes);
        await attributesManager.savePersistentAttributes();
    } catch (e) {}

    return handlerInput.responseBuilder
      .speak(dmg)
      .reprompt(dmg)
      .withShouldEndSession(false)
      .getResponse();
  },
};

/************************  STANDARD ATTACK  **********************/
/************************  STANDARD ATTACK  **********************/
/************************  STANDARD ATTACK  **********************/
const AttackingBomberHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AttackingBomber';
  },
  async handle(handlerInput) {
    var distance = 'long';
    var corkscrew = '';
    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        distance = attributes.distance;
        corkscrew = attributes.corkscrew;
    } catch (e) {}

    let target = handlerInput.requestEnvelope.request.intent.slots.target.value;
    const attackType = handlerInput.requestEnvelope.request.intent.slots.attackType.value;
    let speechText = `Approaching from ` + distance + ` range, `;
    if (corkscrew)
      if (corkscrew === 'yes')
        speechText += ` while he corkscrews, `;
    speechText += `you attack the bomber on his ${target} with a ${attackType}. Damaging his `;
    
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
            else if (distance === 'close')
                iRandomAttacks ++;
            if (corkscrew)
              if (corkscrew === 'yes')
                iRandomAttacks --;
            speechText += t.GetRandomBomberDamage(target, iRandomAttacks);
        }
        if (originalTarget === 'airframe'){ // random x3
            speechText += ` controls, <break time="300ms"/> airframe, <break time="300ms"/> gunner, <break time="300ms"/> `;
            iRandomAttacks = 3;
            if (distance === 'long')
                iRandomAttacks --;
            else if (distance === 'close')
                iRandomAttacks ++;
            if (corkscrew)
              if (corkscrew === 'yes')
                iRandomAttacks --;
            speechText += t.GetRandomBomberDamage(target, iRandomAttacks);
        }
        if (originalTarget === 'wing'){ // random x1
            speechText += ` controls, <break time="300ms"/> ` + sEngine + ` engine, <break time="300ms"/> wing and <break time="300ms"/> `;
            if (distance === 'medium')
                iRandomAttacks = 1;
            else if (distance ==='close')
                iRandomAttacks = 2;
            if (corkscrew)
              if (corkscrew === 'yes')
                iRandomAttacks --;
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
        attributes.corkscrew = 'yes';
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

/************************  EXTENDED BURST ATTACK  **********************/
/************************  EXTENDED BURST ATTACK  **********************/
/************************  EXTENDED BURST ATTACK  **********************/
const ExtendedBurstAttackHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ExtendedBurstAttack';
  },
  async handle(handlerInput) {

    const iBurstRoll = parseInt(t.RollResult(2,6));

    var distance = 'long';
    var corkscrew = '';
    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        distance = attributes.distance;
        corkscrew = attributes.corkscrew;
    } catch (e) {}

    let target = handlerInput.requestEnvelope.request.intent.slots.target.value;
    const attackType = handlerInput.requestEnvelope.request.intent.slots.attackType.value;
    let speechText = `Approaching from ` + distance + ` range, `;
    if (corkscrew)
      if (corkscrew === 'yes')
        speechText += ` while he corkscrews, `;
    speechText += `you attack the bomber on his ${target} with a ${attackType}. Damaging his `;
    
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
            else if (distance === 'close')
                iRandomAttacks ++;
            if (corkscrew)
              if (corkscrew === 'yes')
                iRandomAttacks --;
            speechText += t.GetRandomBomberDamage(target, iRandomAttacks);
        }
        if (originalTarget === 'airframe'){ // random x3
            speechText += ` controls, <break time="300ms"/> airframe, <break time="300ms"/> gunner, <break time="300ms"/> `;
            iRandomAttacks = 3;
            if (distance === 'long')
                iRandomAttacks --;
            else if (distance === 'close')
                iRandomAttacks ++;
            if (corkscrew)
              if (corkscrew === 'yes')
                iRandomAttacks --;
            speechText += t.GetRandomBomberDamage(target, iRandomAttacks);
        }
        if (originalTarget === 'wing'){ // random x1
            speechText += ` controls, <break time="300ms"/> ` + sEngine + ` engine, <break time="300ms"/> wing and <break time="300ms"/> `;
            if (distance === 'medium')
                iRandomAttacks = 1;
            else if (distance ==='close')
                iRandomAttacks = 2;
            if (corkscrew)
              if (corkscrew === 'yes')
                iRandomAttacks --;
            speechText += t.GetRandomBomberDamage(target, iRandomAttacks);
        }
    } else {
        try {
            const iX = parseInt(attackType);
            speechText += t.GetRandomBomberDamage(target, iX);
        } catch (e) {}
    }

   switch (iBurstRoll){
     case 2: 
       break;
     case 3: 
       break;
     case 4: 
       break;
     case 5: 
       break;
     case 6: 
       break;
     case 7: 
       break;
     case 8: 
       break;
     case 9: 
       break;
     case 10: 
       break;
     case 11: 
       break;
     case 12: 
       break;
   }


    const finalSpeak = `<speak> ` + speechText + ` </speak>`

    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        attributes.lastStatus = finalSpeak;
        attributes.corkscrew = 'yes';
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
    var corkscrew = '';
    try {
        const attributesManager = handlerInput.attributesManager;
        const attributes = await attributesManager.getPersistentAttributes() || {};
        distance = attributes.distance;
        corkscrew = attributes.corkscrew;
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
        else if (distance ==='close')
            iRandomAttacks = 2;
        if (corkscrew)
          if (corkscrew === 'yes')
            iRandomAttacks --;
        speechText += t.GetRandomBomberDamage('wing', iRandomAttacks);
    } else {
        try {
            const iX = parseInt(attackType);
            speechText += t.GetRandomBomberDamage('wing', iX);
        } catch (e) {}
    }

    if (distance === 'close'){
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
        attributes.corkscrew = 'yes';
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
    var noradar = '';
    var jamming = 0;
    try {
      const attributesManager = handlerInput.attributesManager;
      const attributes = await attributesManager.getPersistentAttributes() || {};
      month = attributes.month;
      moon = attributes.moon;
      radar = attributes.radar;
      noradar = attributes.noradar;
      FuG227 = attributes.FuG227;
      jamming = attributes.jamming;
    } catch (e) { }

    try {
        if (jamming)
          iRoll -= parseInt(jamming);
    } catch (e) {}

    if (noradar)
      if (noradar === 'yes')
        iRoll -= 1;
        
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
      
    if (iRoll < 1)
        iRoll = 1;

    switch(parseInt(iRoll)){
      case 1: speak = "You are unsure of your location.  This endurance box and next have no contacts. ";
        break;
      case 9:
      case 10: speak = "You intercept a bomber. ";
        const bomber = t.GetInterceptTarget(month);
        speak += ` <break time="500ms"/> a ` + bomber + ` <break time="300ms"/> appears out of the darkness.  Place a ` + 
            bomber + ` <break time="300ms"/> onto your board, and then decide approach distance. `
        break;
      case 11:
      case 12:
      case 13:
      case 14: speak = "You've entered a bomber stream. After this encounter, say bomber stream to continue your streak. ";
        speak += "You intercept a bomber. ";
        const bomber1 = t.GetInterceptTarget(month);
        speak += ` <break time="500ms"/> a ` + bomber1 + ` <break time="300ms"/> appears out of the darkness.  Place a ` + 
            bomber1 + ` <break time="300ms"/> onto your board, and then decide approach distance. `
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

const BomberStreamHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'BomberStream';
  },
  async handle(handlerInput) {
    var iRoll = t.RollResult(1,10);
    var month = 'August';
    try {
      const attributesManager = handlerInput.attributesManager;
      const attributes = await attributesManager.getPersistentAttributes() || {};
      month = attributes.month;
    } catch (e) { }

    let speak = "You've entered a bomber stream. After this encounter, say bomber stream to continue your streak. ";
    speak += "You intercept a bomber. ";
    const bomber1 = t.GetInterceptTarget(month);
    speak += ` <break time="500ms"/> a ` + bomber1 + ` <break time="300ms"/> appears out of the darkness.  Place a ` + 
        bomber1 + ` <break time="300ms"/> onto your board, and then decide approach distance. `

    return handlerInput.responseBuilder
      .speak(speak)
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

    const attributesManager = handlerInput.attributesManager;
    const attributes = await attributesManager.getPersistentAttributes() || {};
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
      speak += `<break time="500ms"/> ` + ` Your raid target is ` + t.CheckLocation(month);
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
        attributes.planeDamage = '';
        attributes.corkscrew = '';
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

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(`Welcome to Night Fighter Ace.`)
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
    BomberDestroyedHandler,
    BomberStreamHandler,
    CurrentMonthHandler,
    ExtendedBurstAttackHandler,
    InterceptCheckHandler,
    JammingModifierHandler,
    LandingPlaneHandler,
    MakingAnotherPassHandler,
    MoonHandler,
    MusicAttackHandler,
    NoRadarPresentHandler,
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
  .withTableName('AceFighter')
  .withAutoCreateTable(true)
  .lambda();
