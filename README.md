
## Single Page Serverless Webapp in Azure

Example of running a SPA webapp on azure, built with a react frontend and a serverless javascript backend

## Environment Setup

We are using a linux based PC environment for the local developer enviroment (this can be Bash On Windows, Mac, or a Linux distro). Install the following azure cross-platform CLI tools to install:

* _az cli_ (https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-apt?view=azure-cli-latest)
  * install extensions allow static website support (az extension add --name storage-preview)
* _func cli_: version2 runtime for azure functions  (https://github.com/Azure/azure-functions-core-tools#installing)
* _create-react-app_: create the react app (https://github.com/facebook/create-react-app)
* dotnet SDK (for building function cosmos extension, to let the function binding to the heavy lifting)



# Create the Function App for for CosmosDB CRUD operations
https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local

### create a  functions project
```
mkdir <func-app-name>; cd <func-app-name>
func init --worker-runtime node
```

### Register extension for cosmos (extensions are nuget packages)

(ensure you jave dotnet 2.1 SDK)
https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-cosmosdb-v2

```
func extensions install --package Microsoft.Azure.WebJobs.Extensions.CosmosDB --version 3.0.1
```

This creates a ```extensions.csproj``` in the function app folder (needs to be in source control), and dotnet restore creates the obj and bin folders.

NOTE: to just build the extension locally from an existing ```extensions.csproj```, its ```func extensions sync```

## Create a functions

```
func new -n order -l node  -t httptrigger
func new -n orders -l node  -t httptrigger
```

Creates a function called `order` (for read and delete), and `orders` (for creation, and query), using language `node`, using template `HTTP Trigger` 

manually add input and output cosmos bindings in `functions.json` inside the `bindings []` array
```
{
    "name": "inputDocument",
    "type": "CosmosDB",
    "direction": "in",
    "id" : "{id}",
    "databaseName": "Azreactless",
    "collectionName": "Orders",
    "connectionStringSetting": "Cosmos_CRUD"
  },
  {
    "name": "outputDocument",
    "type": "CosmosDB",
    "direction": "out",
    "createIfNotExists": true,
    "databaseName": "Azreactless",
    "collectionName": "Orders",
    "connectionStringSetting": "Cosmos_CRUD"
  }
```    
add cosmos connection string in `local.settings.json`

```
func settings add Cosmos_CRUD "AccountEndpoint=http*****"  --connectionString
```

## for localhost innerloop
### SPA

```
export REACT_APP_FN_HOST=http://localhost:7071
export REACT_APP_GET_WS_SERVER=https://mysapp.azurewebsites.net/api/HttpTriggerJS1?code=n3ybwoclWF4xZiUAtqduHnGvfiCJ5dDir1RIcFO1SBfpV4o5aBPboQ==
```

## create redis

##

follow instructions here to create the required .npmrc entries to use the @ms packages

https://fluentweb.com/prototyping/getting-started/build-a-page


For Components see: 

https://fluentweb.com/building-blocks

and 

https://developer.microsoft.com/en-us/fabric#/components

