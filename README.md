##Segmented Images Grid:

- Use this tile to set up your group’s landing/overview page (leading to the other pages on the group)
- Best suited for full page wide tiles
- Showcase a set of links with relevant background images and a one line description at the bottom

Tech Stack(primary) being used:

1. React Js
2. Jive-sdk
3. JQuery
4. Webpack


How to install and run:

1. clone the repo
2. run npm-install # installing required node packages
3. generate the uuid for the app using:
```
   var jive = require('jive-sdk');
   jive.util.guid()
   save the generated uuid into jiveclienconfiguration.json
   {
       "clientUrl": "http://localhost",
       "port": "8090",
       "development" : true,
       "extensionInfo" : {
           "uuid": "" # <- place the generated uuid here
       }
   }
```
4. run webpack command to compile the jsx files # this refers to webpack.config.js
5. run " jive-sdk build add-on --apphosting="jive" " # creation of extension.zip to be uploaded to jive.