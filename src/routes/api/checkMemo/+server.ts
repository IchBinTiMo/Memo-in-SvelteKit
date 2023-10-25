import { json } from "@sveltejs/kit";
import * as fs from "fs";
import * as path from "path";

export async function POST({request}: {request: Request}){
    try {
        const body = await request.json();

        let eventToCheck: string[] = body.ids;

        const __dirname = path.resolve(path.dirname(""));
        let memoFile = fs.readFileSync(path.join(__dirname, "/src/lib/memo.json"), "utf8");
        let memo = JSON.parse(memoFile);

        eventToCheck.forEach(e => {
            console.log(e);
            if(Object.keys(memo["upcoming"]).includes(e)){
                console.log("upcoming");
                memo["completed"][`${e}`] = memo["upcoming"][`${e}`]
                delete memo["upcoming"][`${e}`];
                return false;
            }
            if(Object.keys(memo["due"]).includes(e)){
                console.log("due");
                memo["completed"][`${e}`] = memo["due"][`${e}`]
                delete memo["due"][`${e}`];
                return false;
            }
        });

        let memoDict = JSON.stringify(memo);
        fs.writeFileSync(path.join(__dirname, "/src/lib/memo.json"), memoDict);

        

        memoFile = fs.readFileSync(path.join(__dirname, "/src/lib/memo.json"), "utf8");
        memo = JSON.parse(memoFile);

        
        return json({message: "Check Finished"});
    } catch (error) {
        return Response.error()
    }
    
}