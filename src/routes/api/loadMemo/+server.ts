import { json } from "@sveltejs/kit";
import * as fs from "fs";
import * as path from "path";


export async function POST({request}: {request: Request}) {

    console.log("load!!!!!!");
    const __dirname = path.resolve(path.dirname(""));

    makeMemoDict();

    let j = await request.json();
    console.log(j);
    let state = j.state.toLowerCase();

    let memoFile = fs.readFileSync(path.join(__dirname, "/src/lib/memo.json"), "utf8");
    let memo = JSON.parse(memoFile);
    let tmp: Record<string, Record<string, Record<string, string>>> = {
        upcoming: memo[`upcoming`],
        due: memo[`due`],
        completed: memo[`completed`]
    };

    tmp[`all`] = Object.assign({}, tmp[`upcoming`]);
    tmp[`all`] = Object.assign(tmp[`all`], tmp[`due`]);
    tmp[`all`] = Object.assign(tmp[`all`], tmp[`completed`]);

    
    let eventsToSort: Record<string, string>[] = [];
    

    for(let key of Object.keys(tmp[`${state}`])){
        let event: Record<string, string> = {};
        event = {
            id: key,
            name: tmp[`${state}`][`${key}`]["name"],
            time: tmp[`${state}`][`${key}`]["time"],
            status: tmp[`${state}`][`${key}`]["status"]
        }
        eventsToSort.push(event);
    }
    eventsToSort.sort((a, b) => {
        let aT = a.time.split(" ").join("T");
        let bT = b.time.split(" ").join("T");
        if(aT !== bT) {
            return (aT > bT) ? 1 : -1;
        }
        else{
            return (a.name > b.name) ? 1 : -1
        }
    });
    


    return json(eventsToSort);
}

async function makeMemoDict() {
    const __dirname = path.resolve(path.dirname(""));
    let file: string = "src/lib/memo.json";
    const filePath = path.join(__dirname, file);

    if(!fs.existsSync(filePath)){
        let dictStr = JSON.stringify({
            "upcoming": {},
            "due": {},
            "completed": {}
        });
        fs.writeFileSync(filePath, dictStr);
    }
}