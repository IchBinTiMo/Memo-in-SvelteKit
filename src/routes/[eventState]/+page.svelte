<script lang="ts">
    import { theme } from "$lib/store/theme";
    import { trashBin } from "$lib/store/trash";
    import { correct } from "$lib/store/check";
    import { onDestroy } from "svelte";
    import Fa from 'svelte-fa'
    import { faTrashCan, faCircleExclamation} from '@fortawesome/free-solid-svg-icons';
    import { faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
    import type { PageData } from "./$types";
    import { onMount } from "svelte";

    /**
	 * @type {import("./$types").PageData}
	 */

    export let data: PageData;
    /**
   * @type {Record<string, string> | undefined}
   */

    let memo: Record<string, string>[] | undefined;
    $: memo = data.post.memo;

     /**
   * @type {Boolean}
   */
    let showDelete: Boolean;
    let showCheck: Boolean;

    let now: string = new Date().toString().split(":")[2].split(" ")[0];

    let icons: Record<string, any> = {
        "red": {
            "icon": faCircleExclamation,
            "color": "#ff4400"
        },
        "yellow": {
            "icon": faCircleExclamation,
            "color": "yellow"
        },
        "green": {
            "icon": faCircleExclamation,
            "color": "#2aa02a"
        },
        "due": {
            "icon": faCircleXmark,
            "color": "#ff4400"
        },
        "completed": {
            "icon": faCircleCheck,
            "color": "2aa02a"
        },
    };

    const unsubscribeTrash = trashBin.subscribe(value => {
        showDelete = value;
    })    

    onDestroy(unsubscribeTrash);

    const unsubscribeCheck = correct.subscribe(value => {
        showCheck = value;
    })    

    onDestroy(unsubscribeCheck);


    async function deleteEvent() {
        // console.log("delete");
        let checkbox = [...document.querySelectorAll(".deleteCheckbox[type=checkbox]")].map(e => e as HTMLInputElement).filter( e => e !== undefined && e !== null);
        let events = [...document.querySelectorAll(".eventId")].map(e => e as HTMLInputElement).filter( e => e !== undefined && e !== null);
        let toDelete: string[] = [];

        if(events.length > 0){
            // console.log(events);
            // console.log(checkbox);

            toDelete = events
                        .filter((e, idx) => e != undefined && 
                                            e != null && 
                                            checkbox[idx] != null &&
                                            checkbox[idx] != undefined)
                        .filter((e, idx) => {
                            // console.log(e);
                            return checkbox[idx].checked;
                        })
                        .map(e => e.value);
            // console.log(toDelete);
            try {
                let toPost = {
                    ids: toDelete,
                    loc: window.location.href,
                    state: data.post.state
                };
                let option = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(toPost)
                };            
                let ref = await fetch("/api/deleteMemo", option);

                option = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({state: data.post.state})
                };
                let res = await fetch("/api/loadMemo", option);

                let r = await res.json();
                // console.log(r);
                // console.log(r[`${data.post.state.toLowerCase()}`]);
                // memo = r[`${data.post.state}`];
                memo = r;
                [...document.querySelectorAll(".deleteCheckbox")].map(e => e as HTMLInputElement).forEach(e => e.checked = false);
            } catch (error) {
                console.error(error);
            }
        }
        else {
            return;
        }
    }

    async function checkEvent() {
        let checkbox = [...document.querySelectorAll(".completeCheckbox[type=checkbox]")].map(e => e as HTMLInputElement).filter( e => e !== undefined && e !== null);
        let events = [...document.querySelectorAll(".eventId")].map(e => e as HTMLInputElement).filter( e => e !== undefined && e !== null);
        let toCheck: string[] = [];

        console.log(checkbox);
        if(events.length > 0){
            console.log(events);

            toCheck = events
                        .filter((e, idx) => e != undefined && 
                                            e != null && 
                                            checkbox[idx] != null &&
                                            checkbox[idx] != undefined)
                        .filter((e, idx) => {
                            // console.log(e);
                            return checkbox[idx].checked;
                        })
                        .map(e => e.value);
            try {
                let toPost = {
                    ids: toCheck,
                    loc: window.location.href,
                    state: data.post.state
                };
                let option = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(toPost)
                };            
                let ref = await fetch("/api/checkMemo", option);

                option = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({state: data.post.state})
                };
                let res = await fetch("/api/loadMemo", option);

                let r = await res.json();
                memo = r;
                [...document.querySelectorAll(".completeCheckbox")].map(e => e as HTMLInputElement).forEach(e => e.checked = false);
            } catch (error) {
                console.error(error);
            }
        }
        else {
            return;
        }
    }

    async function refresh() {
        let option = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({state: data.post.state})
        };
        let res = await fetch("/api/refreshMemo");
        let ref = await fetch("/api/loadMemo", option);
        let memoDict = await ref.json();

        memo = memoDict;
    }

    // $: if(now === "00"){
    //     // console.log(now);
    //     refresh();
    // }

    let tmp: Location;

    onMount(async () => {
        tmp = window.location;
        setInterval(async () => {
            let time = new Date().toString().split(":");
            now = time[2].split(" ")[0];
            console.table({time, now});
            if(now === "00"){
                refresh();

            }
        }, 1000);
    });

</script>


<div id="content">
    
    <div class="header">
        <h1>
            {data.post.state}&nbsp;
        </h1>
        {#if showDelete}
            <div id="delete">
                <button id="deleteBtn" on:click={deleteEvent}><Fa icon={faTrashCan}/></button>
            </div>            
        {/if}
        {#if showCheck}
            <div id="complete">
                <button id="checkBtn" on:click={checkEvent}><Fa icon={faCircleCheck}/></button>
            </div>            
        {/if}
    </div>
    <form action="" method="POST">
        {#if memo}
        <table>
            <thead class="thead">
                <tr
                    class="theadRow"
                    style="
                        color: {$theme === "light" ? "rgb(255, 255, 255)" : "#333"};
                        background-color: {$theme === "light" ? "#333" : "rgb(204, 204, 204)"};                        
                    ">
                    <th class="eventStatus" 
                        style="
                            border: {$theme === "light" ? "rgb(255, 255, 255)" : "#333"} solid 2px;
                        "
                    >Status</th>
                    <th class="eventName" 
                        style="
                            border: {$theme === "light" ? "rgb(255, 255, 255)" : "#333"} solid 2px;
                        "
                    >Event</th>
                    <th class="eventDueTime" 
                        style="
                            border: {$theme === "light" ? "rgb(255, 255, 255)" : "#333"} solid 2px;
                        "
                        >Deadline</th>
                    {#if showDelete}
                        <th class="delete" 
                            style="
                                border: {$theme === "light" ? "rgb(255, 255, 255)" : "#333"} solid 2px;
                            "
                        >Delete</th>
                    {/if}
                    {#if showCheck}
                        <th class="completed" 
                            style="
                                border: {$theme === "light" ? "rgb(255, 255, 255)" : "#333"} solid 2px;
                            "
                        >Complete</th>
                    {/if}
                </tr>

            </thead>
            <tbody>
                {#each memo as event, i}                    
                    <tr class="bodyRow event" 
                        style="
                            background-color: {$theme === "light" ? (i % 2 ? "rgb(204, 204, 204)" : "white") : (i % 2 ? "#222" : "#333")};
                        ">
                        <td class="eventStatus" style="border: {$theme === "light" ? "#fff" : "#333"} solid 2px;">
                            <!-- {`${(event.status)}`} -->
                            <!-- {`${(event.time)}`} -->
                            <!-- {`${(event.name)}`} -->
                            <Fa icon={icons[`${event.status}`]["icon"]} 
                                style="background: #333; color: {icons[`${event.status}`]["color"]}; border-radius: 50%; border: 2px solid #333"
                            />
                        </td>
                        <td class="eventName" style="border: {$theme === "light" ? "#fff" : "#333"} solid 2px;">{event.name}</td>
                        <td class="eventDueTime" style="border: {$theme === "light" ? "#fff" : "#333"} solid 2px;">{event.time}</td>
                        <td style="
                                height: 0;
                                width: 0;
                                border: 0;
                                padding: 0;
                                margin: 0;
                            "
                        >
                            <input class="eventId" type="hidden" name="eventId" value={event.id}>
                            <input type="hidden" name="next" value="{tmp}">
                        </td>
                        {#if showDelete}
                            <td class="delete" style="border: {$theme === "light" ? "#fff" : "#333"} solid 2px;">
                                <input type="checkbox" name="" id="" class="deleteCheckbox">
                            </td>
                        {/if}
                        {#if showCheck}
                            <td class="completed" style="border: {$theme === "light" ? "#fff" : "#333"} solid 2px;">
                                <input type="checkbox" name="" id="" class="completeCheckbox">
                            </td>
                        {/if}
                    </tr>
                {/each}


            </tbody>
        </table>
        
        {:else}
        <div>Loading...</div>
        
        {/if}
    </form>
</div>

<style lang="scss">
    
    div#content {
        div.header {
            display: flex;
            align-items: center;
            #deleteBtn {
                height: 50px;
                width: 50px;
                font-size: 30px;
                border: 0;
                border-radius: 50%;
                cursor: pointer;
                background: radial-gradient(#ffffff, #e66465);
            }
            #deleteBtn:hover {
                background: radial-gradient(#959595, #934040);
            }

            #checkBtn {
                height: 50px;
                width: 50px;
                font-size: 30px;
                border: 0;
                border-radius: 50%;
                cursor: pointer;
                background: radial-gradient(#ffffff, #2bff3d);
            }
            #checkBtn:hover {
                background: radial-gradient(#959595, #208d29);
            }
        }
        table {
            
            thead {
                font-size: 25px;
                font-weight: 700;
                tr {
                    display: grid;
                    grid-template-columns: [col_1] 100px [col_2] 400px [col_3] 400px [col_4];
                    grid-template-rows: [row_1] 30px [row_2];

                    .eventStatus {
                        grid-column: 1/2;
                        grid-row: 1/2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .eventName {
                        grid-column: 2/3;
                        grid-row: 1/2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .eventDueTime {
                        grid-column: 3/4;
                        grid-row: 1/2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }

                tr:has(:nth-child(4)) {
                    display: grid;
                    grid-template-columns: [col_1] 100px [col_2] 400px [col_3] 400px [col_4] 150px [col_5];
                    grid-template-rows: [row_1] 30px [row_2];


                    .delete {
                        grid-column: 4/5;
                        grid-row: 1/2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .completed {
                        grid-column: 4/5;
                        grid-row: 1/2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }

                tr:has(:nth-child(5)) {
                    display: grid;
                    grid-template-columns: [col_1] 100px [col_2] 400px [col_3] 400px [col_4] 150px [col_5] 100px [col_6];
                    .completed {
                        grid-column: 4/5;
                        grid-row: 1/2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .delete {
                        grid-column: 5/6;
                        grid-row: 1/2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }

            tbody {
                tr {
                    display: grid;
                    grid-template-columns: [col_1] 100px [col_2] 400px [col_3] 400px [col_4];
                    grid-template-rows: [row_1] 30px [row_2];

                    .eventStatus {
                        grid-column: 1/2;
                        grid-row: 1/2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .eventName {
                        grid-column: 2/3;
                        grid-row: 1/2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .eventDueTime {
                        grid-column: 3/4;
                        grid-row: 1/2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }

                tr:has(:nth-child(5)) {
                    display: grid;
                    grid-template-columns: [col_1] 100px [col_2] 400px [col_3] 400px [col_4] 150px [col_5];
                    grid-template-rows: [row_1] 30px [row_2];


                    .delete {
                        grid-column: 4/5;
                        grid-row: 1/2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .completed {
                        grid-column: 4/5;
                        grid-row: 1/2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }

                tr:has(:nth-child(6)) {
                    display: grid;
                    grid-template-columns: [col_1] 100px [col_2] 400px [col_3] 400px [col_4] 150px [col_5] 100px [col_6];
                    .completed {
                        grid-column: 4/5;
                        grid-row: 1/2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .delete {
                        grid-column: 5/6;
                        grid-row: 1/2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
            
        }
    }
    
    
    
    
</style>