
## Single Page Serverless Webapp in Azure

Example of running a SPA webapp on azure, built with a react frontend and a serverless javascript backend

## Environment Setup

We are using a linux based PC environment for the local developer enviroment (this can be Bash On Windows, Mac, or a Linux distro). Install the following azure cross-platform CLI tools to install:

* _az cli_ (https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-apt?view=azure-cli-latest)
  * install extensions allow static website support (az extension add --name storage-preview)
* _func cli_: version2 runtime for azure functions  (npm i -g azure-functions-core-tools@core --unsafe-perm true)
* _create-react-app_: create the react app (https://github.com/facebook/create-react-app)
* dotnet SDK (for building function cosmos extension, to let the function binding to the heavy lifting)



# instructions (cosmos crud)
https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local

### create a  functions project
func init MyFunctionProj

### register extension for cosmos (extensions are nuget packages)

(ensure you jave dotnet 2.1 SDK)
https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2

func extensions install --package Microsoft.Azure.WebJobs.Extensions.CosmosDB --version 3.0.0-beta7
add bindings in functions.json
{
      "name": "inputDocument",
      "type": "CosmosDB",
      "direction": "in",
      "connectionStringSetting": "MyAccount_COSMOSDB",
    }
add in local.settings.json
MyAccount_COSMOSDB = ""

## for localhost innerloop
### SPA
export REACT_APP_DEV_PORT=8080
export REACT_APP_GET_WS_SERVER=https://mysapp.azurewebsites.net/api/HttpTriggerJS1?code=n3ybwoclWF4xZiUAtqduHnGvfiCJ5dDir1RIcFO1SBfpV4o5aBPboQ==


## create redis

##

follow instructions here to create the required .npmrc entries to use the @ms packages

https://fluentweb.com/prototyping/getting-started/build-a-page


For Components see: 

https://fluentweb.com/building-blocks

and 

https://developer.microsoft.com/en-us/fabric#/components

