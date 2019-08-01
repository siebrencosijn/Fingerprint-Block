# FP-Block 2

## Installation

*Requires Firefox Developer or Nightly edition.*  
Go to `about:config` (enter in address bar) and set `xpinstall.signatures.required` to `false`.

#### Windows
1. Open the directory containing the extension in File Explorer
2. Select all files and directories excluding `.git`
3. Right click to open the shortcut menu, click **Send to > Compressed (zipped) folder**

#### Linux / Mac OS X

1. Open a terminal window
2. Navigate to the directory containing the extension, using the command `cd path/to/extension/`
3. ZIP the content of the directory, using the command `zip -r -FS ../FP-Block2.zip * --exclude *.git*`

Go to `about:addons` (enter in address bar), click on the settings wheel followed by **Install Add-on From File...** and select the ZIP file created during the previous step.

## How to spoof/block a property of a web browser
In order to spoof or block a property of a web browser, add its information to one or two files:
- **constants.js** in the folder **src/utils/**
- **injectedScript.js** in the folder **src/modules/**

The information to add:
- the **name** of the property
- **access type**: the way in which the property should be overwritten. The access types supported by FP-Block 2.0 are 'objectProperty' (`<object>.<property>`) and 'prototypeProperty' (`<object>.<prototype>.<property>`).
- **value type**: the type of return value of the properties' getter-method. The value types supported by FP-Block 2.0 are 'string', 'number', 'array', 'storageObject', and 'object'. 
- **function names**, only for storage objects.

If a spoof/block property is handled in the standard manner of **injectedScript.js**, then the information should be added only in **constants.js**, otherwise you also need to adjust **injectedScript.js**. There are two special cases that are handled separately:
- preventing against canvas fingerprinting, since there is no standard manner to overwrite functions in FP-Block 2.0
- preventing against font probing, since there are limitations to calling detection, using a special variable to improve the performance of the plug-in

### constants.js
1. If a property should be spoofed, add its name to SPOOF_ATTRIBUTES
2. If the corresponding DOM-object does not exist in DOM_OBJECTS, add the object
3. Add the properties' information to DOM_OBJECTS in the corresponding object like navigator or screen. 

In FP-Block 2.0, the information of properties to change by preventing font detection and canvas fingerprinting have their own constants.

## How to increase the amount of fingerprints
The default number of fingerprints used by FP-Block 2.0 is 480480. 
If more fingerprints are needed, the amount of combinations can be increased by uncommenting languages in `data/browser_data.js`.