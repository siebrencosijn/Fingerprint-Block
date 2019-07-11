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