var metrics = {
    requestscomplete: 0,
    requestsstarted: 0,
    lastreqtime: 0
}

const 
    PROC_TYPE = "WORKER",
    WORK_TYPE = "dowork",
    MAX_CONCURRENT_TASKS = 10,
    NODE_PING_INTERVAL = 1,
    redis_telemetry = require('./lib/redis_telemetry'),
    [ redis ] = redis_telemetry.init_redis(process.env.REDIS_URL),
    [ redis_b ] = redis_telemetry.init_redis(process.env.REDIS_URL)

redis_telemetry.init_telemetry(redis, PROC_TYPE, metrics, NODE_PING_INTERVAL).then (([proc_key]) => {

    console.log (`Staring backend process: ${proc_key}`)
    var waiting_pop = false

    const listenforwork = () => {
        if (metrics.requestsstarted - metrics.requestscomplete <= MAX_CONCURRENT_TASKS && waiting_pop == false) {
            waiting_pop = true;
            redis_b.brpop(WORK_TYPE, 0).then((res) => {
                waiting_pop = false
                console.log (`RPOP'd work : ${res[1]}`)
                metrics.requestsstarted++
                
                let resobj = JSON.parse(res[1])
                setTimeout ((st) => {
                    console.log (`Completed work : ${res[1]}`)
                    redis.publish (resobj.notify_channel, JSON.stringify({key: resobj.key, status: `do work completed by worker ${proc_key}`}))
                    metrics.requestscomplete++
                    metrics.lastreqtime = (Date.now() - st)/1000
                    listenforwork()
                }, (metrics.requestsstarted - metrics.requestscomplete)*100, Date.now())

                listenforwork()
            })
        }
    }

    listenforwork()
})