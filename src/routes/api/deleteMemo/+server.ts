import { json } from "@sveltejs/kit";
import * as fs from "fs";
import * as path from "path";


// /**
//   *  @type {import('./$types').Actions} 
//   */
export async function POST({request}: {request: Request}){
    try {
        const body = await request.json();

        let eventToDelete: string[] = body.ids;

        const __dirname = path.resolve(path.dirname(""));
        let memoFile = fs.readFileSync(path.join(__dirname, "/src/lib/memo.json"), "utf8");
        let memo = JSON.parse(memoFile);

        eventToDelete.forEach(e => {
            if(Object.keys(memo["upcoming"]).includes(e)){
                delete memo["upcoming"][`${e}`];
                return;
                // return false;
            }
            if(Object.keys(memo["due"]).includes(e)){
                delete memo["due"][`${e}`];
                return;
                // return false;
            }
            if(Object.keys(memo["completed"]).includes(e)){
                delete memo["completed"][`${e}`];
                return;
                // return false;
            }
        });

        let memoDict = JSON.stringify(memo);
        fs.writeFileSync(path.join(__dirname, "/src/lib/memo.json"), memoDict);

        

        memoFile = fs.readFileSync(path.join(__dirname, "/src/lib/memo.json"), "utf8");
        memo = JSON.parse(memoFile);

        
        return json({message: "Delete Finished"});
    } catch (error) {
        return Response.error()
    }
    
}