# LocalForage Extension for Chrome and Firefox
An extension for viewing, editing, and adding to [localforage](https://github.com/localForage/localForage) data stores in a new devtools panel. Even if the site does not attach `localforage` to the window object, this extension works just fine by using its own copy.

<img src="./screenshot.png" alt="Screenshot" width="400" />


## General Usage

To open the panel:

* Load a website which uses localForage.
* Open the browser developer tools:
   * Chrome: View > Developer > Developer Tools
   * Firefox: Tools > Web Developer > Toggle Tools
* Select the localForage toolbar

This panel will show you any localForage data stored on this site in the default storage instance (read about other instance, below).

**Add**

To add a new item, double click on the last empty row. Then enter the key name for this item and press `<enter>` or `<tab>` to add the item value.

**Edit**

To edit an existing row, double click on either the key or value to edit it.

**Delete**

Remove a localForage entry by selecting the row and pressing `<delete>` or `<backspace>` on your keyboard.

## Multiple Storage Instances
LocalForage supports [multiple storage instances](https://localforage.github.io/localForage/#multiple-instances). Unfortunately, it does not have a registry of these instances, so you need to tell the localForage Explorer about them.

To attach to a new or existing instance click the plus (`+`) button in the upper-right corner of the panel and enter a name.

If you've already attached an instance in the explorer, you should be able to select it from the dropdown menu next to the plus (`+`) button.

## Contribute & Development

If you want to test this locally and provide PRs back to the project, the process is very simple.

### Setup

```bash
npm install
```

### General Development

The easiest way to develop on this is with the local parceljs server.

```bash
npm start
```

This will launch a development server at http://localhost:1234. When using that, it'll be reading/writing to the localForage object on that page.

### Chrome Extension Testing

When you're ready to test this as an extension as a Chrome extension:

```bash
npm run build
```

Then:
* Go to the chrome extension page: chrome://extensions/
* Select "Developer mode"
* Click "Load unpacked"
* Navigate to the `dist` directory and click "Select".

Now the extension will be loaded into chrome.

*Pro Tip*

Running the following will automatically recompile changes and you'll only need to install it once:

```bash
npm run watch
```

### Firefox Extension Testing

When you're ready to test this as an extension as a Firefox extension:

```bash
npm run firefox
```

This should automatically launch Firefox with this loaded as a temporary extension.

If you want the build script to rebuild on changes, you'll need to have two processes running in separate terminals:

```bash
# Process/Terminal 1
npm run watch

# Process/Terminal 2
npx web-ext run -s dist
```

Now Firefox will update automatically every time you make a change to the code.
