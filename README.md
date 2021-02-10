![redphish](https://github.com/redwine-1/redphish/blob/main/redphish.png)
# Redphish
 
## Introduction

REDPHISH is a facebook phishing fun project. For more advanced usage use <a href="https://github.com/trustedsec/social-engineer-toolkit">The Social-Engineer Toolkit (SET)</a>

## <a href="https://github.com/redwine-1/redphish">Installation</a>

###### Clone repo 
```
git clone https://github.com/redwine-1/redphish
cd redphish
```
###### Environment variables. Create a **.env** file and following secrets
```
MONGODBURL: Mongodb connect url
CLIENTID: Google auth client id (optional login using google won't work)
CLIENTSECRET: Google auth client secret (optional login using google won't work)
BASE_ULR: use in local environment  http://localhost:3000 or your base URL if you are going to host it in cloud
USERNAME: Email form which email varification code will be sent 
PASSWORD: Email password 
secret: Secret for local password storage 
```
###### Use the package manager npm
```
npm install
node app.js
```
