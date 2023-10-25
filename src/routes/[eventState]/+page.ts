import { trashBin } from "$lib/store/trash";
 
 /**
  *  @type {import('./$types').PageLoad} 
  */

import type { RouteParams } from "./$types";

export async function load({params, fetch}: {params: RouteParams, fetch: any}) {
    trashBin.set(false);

    try {
        let option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({state: params.eventState})
        };
        
        
        let ref = await fetch("/api/refreshMemo");
        let res = await fetch("/api/loadMemo", option);
        let memo = await res.json();
       
        let eventState = params.eventState.charAt(0).toUpperCase() + params.eventState.slice(1);

        return {
            post: {
                "state": eventState,
                memo
            }
        };
        
    } catch (error) {
        let eventState = params.eventState.charAt(0).toUpperCase() + params.eventState.slice(1);
        return {
            post: {
                "state": eventState,
                error
            }
        }
    }
}

