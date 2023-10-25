import { json, redirect } from "@sveltejs/kit";
import type { RequestHandler, RequestEvent, Actions } from "@sveltejs/kit";
import * as fs from "fs";
import * as path from "path";


// /**
//   *  @type {import('./$types').Actions} 
//   */
export async function POST({request}: {request: Actions}){
    // console.log(typeof request);
    // console.log(request);
    // console.log(request.header);
    try {
        let data = await request.formData();
        // console.log(data);

        const __dirname = path.resolve(path.dirname(""));
        let memoFile = fs.readFileSync(path.join(__dirname, "/src/lib/memo.json"), "utf8");
        let memo = JSON.parse(memoFile);
        // console.log(memo);

        let eventId = data!.get("event-id");

        if(Object.keys(memo["upcoming"]).includes(eventId) || Object.keys(memo["due"]).includes(eventId)){
            eventId = idGen();
        }
        let eventName = data!.get("event-name");
        let eventDueTime = data!.get("event-due-time").split("T").join(" ");
        let next = data!.get("next");

        // let date = new Date().toLocaleDateString().split("/");
        // let dateStr = date.reverse().map(value => (value.length < 2 ? `0${value}` : value)).join("-");
        // // console.log(dateStr);
        // let time = new Date().toLocaleTimeString("en", {hourCycle: "h23"}).slice(0, 5);

        // let timeStr = [dateStr, time].join(" ");

        // console.log(data);
        // console.log(eventName, eventDueTime);
        let event = {
            name: eventName,
            time: eventDueTime
        };
        memo[`upcoming`][`${eventId}`] = event;

        let memoDict = JSON.stringify(memo);
        fs.writeFileSync(path.join(__dirname, "/src/lib/memo.json"), memoDict);

        // let body = {
        //     status: 200,
        //     "statusText": "new event received!",
        //     "redirect": next
        // };

        // let blob = new Blob([JSON.stringify(body)], {type: "application/json"});

        return Response.redirect(next);
    } catch (error) {
        return Response.error()
    }
    
}

function idGen(){
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const idLen = 12;
    let eventId = "";

    for(let i = 0; i < idLen; i++){
        eventId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    console.log(eventId);
    return eventId;
}