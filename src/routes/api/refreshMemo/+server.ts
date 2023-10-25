import * as fs from "fs";
import * as path from "path";

export function GET({request}: {request: Request}) {

    console.log("refresh!!!!!");

    const __dirname = path.resolve(path.dirname(""));

    let memoFile = fs.readFileSync(path.join(__dirname, "/src/lib/memo.json"), "utf8");
    let memo = JSON.parse(memoFile);

    let date = new Date().toLocaleDateString().split("/");
    let dateStr = date.reverse().map(value => (value.length < 2 ? `0${value}` : value)).join("-");
    let time = new Date().toLocaleTimeString("en", {hourCycle: "h23"}).slice(0, 5);

    let timeStr = [dateStr, time].join(" ");

    for(let key of Object.keys(memo["due"])){
        memo["due"][key]["status"] = "due";
    }

    for(let key of Object.keys(memo["completed"])){
        memo["completed"][key]["status"] = "completed";
    }
    

    for(let key of Object.keys(memo["upcoming"])){
        if(memo["upcoming"][`${key}`]["time"] < timeStr){
            memo["due"][`${key}`] = memo["upcoming"][`${key}`];
            delete memo["upcoming"][`${key}`];
        }
        else{
            let dueTime = new Date(memo["upcoming"][`${key}`]["time"]);
            let today = new Date(timeStr);
            let oneDay = 86400000;
            if(dueTime.valueOf() - today.valueOf() >= 3 * oneDay){
                memo["upcoming"][`${key}`]["status"] = "green";
            }
            else if(dueTime.valueOf() - today.valueOf() >= 1 * oneDay && dueTime.valueOf() - today.valueOf() < 3 * oneDay){
                memo["upcoming"][`${key}`]["status"] = "yellow";
            }
            else if(dueTime.valueOf() - today.valueOf() < 1 * oneDay){
                memo["upcoming"][`${key}`]["status"] = "red";
            }
            else{
                memo["upcoming"][`${key}`]["status"] = "due";
            }
        }
    }

    let memoDict = JSON.stringify(memo);
    fs.writeFileSync(path.join(__dirname, "/src/lib/memo.json"), memoDict);


    return new Response(null, {statusText: "Done Refresh"});
}