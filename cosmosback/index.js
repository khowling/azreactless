
// v2 https://github.com/Azure/azure-cosmos-js/
// https://github.com/Azure/azure-cosmos-js/blob/master/samples/ChangeFeed/app.js

const cosmos = require('@azure/cosmos');

const CosmosClient = cosmos.CosmosClient;

// https://docs.microsoft.com/en-us/azure/cosmos-db/performance-tips#networking

// ConnectionPolicy Required for the emulator
const connectionPolicy = new cosmos.ConnectionPolicy ()
connectionPolicy.DisableSSLVerification = true

const client = new CosmosClient({ 
  // endpoint:'https://kh-azless3572.documents.azure.com:443/', 
  endpoint: 'https://localhost:8081', 
  // auth: { masterKey : 'ofzWsBJWo2GutShzT1y9oU8CUXqG64O4sXDSRJngUwbPA4P0zGAFLFdOSudP0y43CxK1BeDpHAHzzN2O1nsEwA=='}
  auth: { masterKey : 'C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==' },
  connectionPolicy 
})



async function init() {
  try {
  const { database } = await client.databases.createIfNotExists({ id: "Azreactless" });
  const { container } = await database.containers.createIfNotExists({ id: "Azreactless", partitionKey: { kind: "Hash", paths: ["/type"] } });
  return { container, status: "ok" }
  } catch (e) {
    return {status: "err", e}
  }
}


var req_etag = ""

async function readchangefeed(cfcb) {
  const { container, status, e} = await init()
  //await create(container)
  if (status === "ok") {
    //const specificPointInTimeIterator = container.items.readChangeFeed("ORDER", { startTime: new Date() })
    const specificPointInTimeIterator = container.items.readChangeFeed("ORDER", { startFromBeginning: true })

    setInterval (async () =>  {
      const {results, count}  = await specificPointInTimeIterator.executeNext() 
      if (count >0) {
        console.log (JSON.stringify(results))
      }
    }, 2000)

    //const { specificContinuationResult } = await specificPointInTimeIterator.executeNext()
  } else {
    console.error (e.toString())
  }


  // IMPORTANT::   Async Iterator requires the flag --harmony-async-iteration for node8
  // An iterator is an object that exposes a next(), and can be used in a for loop using "of"
  // An async iterator returns a _promise_ that fulfills to { value, done }
  /*
  console.log (`Calling CF with etag=${req_etag}`)
  for await (const  item  of queryIterator.getAsyncIterator()) { 
      req_etag = item.headers.etag
      cfcb (item.result)
  }
  */
}

readchangefeed()


