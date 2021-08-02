/* 

CONFIGURATION
Add your services and their tests to this array

{
  name: "my-service" // display name of your service/site
  path: "https://example.com/api" // url of endpoint to check
  type: "json" // undefined | json (for JSON endpoints) | string (for html text endpoints)
  test: () => true // a JS function to test your API. Must return true/false
}

*/

const services = [];

/*
  
  THIS IS THE SCRIPT ITSELF.
  USUALLY YOU WILL NOT NEED TO CHANGE ANYTHING FROM HERE.
  
*/

let widget = await createWidget();
if (config.runsInWidget) {
  // The script runs inside a widget, so we pass our instance of ListWidget to be shown inside the widget on the Home Screen.
  Script.setWidget(widget);
} else {
  // The script runs inside the app, so we preview the widget.
  widget.presentSmall();
}
// Calling Script.complete() signals to Scriptable that the script have finished running.
// This can speed up the execution, in particular when running the script from Shortcuts or using Siri.
Script.complete();

async function createWidget() {
  let widget = new ListWidget();

  // Check services
  const list = [];
  for (service of services) {
    let result = await checkApi(service);
    list.push(result);
  }

  const errors = list.filter((service) => service.healthy === false);

  if (errors.length !== 0 && errors.length === list.length) {
    const text = errors[0].error;

    // Text
    let titleStack = widget.addStack();
    let titleElement = titleStack.addText(text.toUpperCase());
    titleElement.textColor = Color.black();
    titleElement.font = Font.mediumSystemFont(12);

    // background
    let gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [new Color("FFD000"), new Color("FFDD00")];
    widget.backgroundGradient = gradient;
  } else if (errors.length === 0) {
    // Text
    let titleStack = widget.addStack();
    let titleElement = titleStack.addText("ALL SYSTEMS OPERATIONAL");
    titleElement.textColor = Color.white();
    titleElement.font = Font.mediumSystemFont(12);

    // background
    let gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [new Color("52B788"), new Color("74C69D")];
    widget.backgroundGradient = gradient;
  } else {
    // Widget title
    let titleStack = widget.addStack();
    let titleElement = titleStack.addText(
      `${errors.length} of ${list.length} SYSTEMS COMPROMISED:`
    );
    titleElement.textColor = Color.white();
    titleElement.font = Font.mediumSystemFont(12);
    widget.addSpacer(6);

    // Spacer
    widget.addSpacer(5);

    // Names
    const names = errors.map((service) => service.name).join(", ");
    let apiNames = widget.addText(names);
    apiNames.textColor = Color.white();
    apiNames.font = Font.mediumSystemFont(10);

    // background
    let gradient = new LinearGradient();
    gradient.locations = [0, 1];
    gradient.colors = [new Color("C9184A"), new Color("FF4D6D")];
    widget.backgroundGradient = gradient;
  }

  if (!config.runsWithSiri) {
    widget.addSpacer(8);
  }
  return widget;
}

async function checkApi(service) {
  try {
    let req = new Request(service.path);
    let resp;
    switch (service.type) {
      case "json":
        resp = await req.loadJSON();
        break;
      case "string":
        resp = await req.loadString();
        break;
      default:
        resp = await req.load();
        break;
    }
    let data = {
      name: service.name,
      healthy: service.test(resp),
    };
    return data;
  } catch (e) {
    return {
      name: service.name,
      healthy: false,
      error: e.message,
    };
  }
}
