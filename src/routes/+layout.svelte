<script lang="ts">
    import sun from "$lib/images/sun.svg";
    import moon from "$lib/images/moon.svg";
    import { clickOutside } from "./clickOutside";
    import { theme } from "$lib/store/theme";
    import { trashBin } from "$lib/store/trash";
    import { correct } from "$lib/store/check";
    import Fa from 'svelte-fa';
    import { faBars, faCircleCheck, faCircleXmark, faHouseChimney, faPlus, faMinus, faXmark, faCircleExclamation, faCheck } from '@fortawesome/free-solid-svg-icons';
    // import { onDestroy } from "svelte";


    let month: Record<string, number> = {
        "Jan": 1,
        "Feb": 2,
        "Mar": 3,
        "Apr": 4,
        "May": 5,
        "Jun": 6,
        "Jul": 7,
        "Aug": 8,
        "Sep": 9,
        "Oct": 10,
        "Nov": 11,
        "Dec": 12
    };

    
    let now: Date = new Date();
    let nowStr: string[] = now.toString().split("(").map(str => str.trim());
    nowStr[1] = `(${nowStr[1]}`;
    console.table(nowStr);
    let customizeNow: string = `${nowStr[0]} ${nowStr[3]}-${month[nowStr[1]]}-${nowStr[2]} ${nowStr[4]} ${nowStr[5]} ${nowStr[6]}`;
    setInterval(() => {
        now = new Date();
        nowStr = now.toString().split("(").map(str => str.trim());
        nowStr[1] = `(${nowStr[1]}`;
        customizeNow = `${nowStr[0]} ${nowStr[3]}-${month[nowStr[1]]}-${nowStr[2]} ${nowStr[4]} ${nowStr[5]} ${nowStr[6]}`;
    }, 1000);

    let showModal = false;
    // console.log(today);
    let date = new Date().toLocaleDateString().split("/").map(value => (value.length < 2 ? `0${value}` : value)).join("-");
    let time = new Date().toLocaleTimeString("en", {hourCycle: "h23"}).slice(0, 5);
    let timeStr = [date, time].join("T");

    function toggleTheme(){
        let myImage: HTMLElement = document.getElementById("themeLogo")!;
        myImage.classList.toggle("dark");

        theme.update(t => ($theme === "light" ? "dark" : "light"));



        document.body.style.background = getComputedStyle(document.body).backgroundColor === "rgb(255, 255, 255)" ? "#333" : "rgb(255, 255, 255)";
        document.body.style.color = getComputedStyle(document.body).color === "rgb(204, 204, 204)" ? "#333" : "rgb(204, 204, 204)";
       
        for(let ele of document.getElementsByClassName("sidebar") as HTMLCollectionOf<HTMLElement>){
            ele.style.background = getComputedStyle(ele).backgroundColor === "rgb(255, 255, 255)" ? "#333" : "rgb(255, 255, 255)";
            for(let e of ele.children as HTMLCollectionOf<HTMLElement>){
                e.style.background = getComputedStyle(e).backgroundColor === "rgb(204, 204, 204)" ? "#333" : "rgb(204, 204, 204)";
                e.style.color = getComputedStyle(e).color === "rgb(255, 255, 255)" ? "#333" : "rgb(255, 255, 255)";
            }
        }        
    }

    /* Set the width of the sidebar to 250px (or 0) and the left margin of the page content to 250px (or 0) */
    function toggleNav(){
        document.getElementById("mySidebar")!.style.width = parseInt(document.getElementById("main")!.style.marginLeft) === 200 ? "46.8625px" : "200px";
        document.getElementById("main")!.style.marginLeft = parseInt(document.getElementById("main")!.style.marginLeft) === 200 ? "46.8625px" : "200px";
    }

    function openModal(){
        showModal = true;
        trashBin.set(false);
        // document.getElementById("backdropFilter")!.style.visibility = "visible";
        // const newEventModal = document.querySelector("#newEventModal")! as HTMLDialogElement;
        // newEventModal.showModal()
    }

    async function closeModal(){
        showModal = false;
        // const newEventModal = document.querySelector("#newEventModal")! as HTMLDialogElement;
        // let option = {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify()
        // }
        // let res = await fetch("/api/writeMemo");
        // newEventModal.close()
    }

   
    function deleteEvent() {

        trashBin.update(n => (n === false) ? true : false);
        correct.update(n => false);
    }

    

    function checkEvent() {
        trashBin.update(n => false);
        correct.update(n => (n === false) ? true : false);
    }

    function init() {
        trashBin.update(n => false);
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

    function foo(){}
   
  
</script>



<div class="container">
    <div class="sidebar" id="mySidebar">
        <div class="sidebarTop" on:click={toggleNav} on:keydown={foo} id="sidebarOpen">
            <div class="sidebarItem">
                <Fa icon={faBars}/>
            </div>
        </div>
        <ul class="sidebarBody">
            <li class="sidebarItem">
                <a href="/all">
                    <span class="text icon" style="color:#6172ff; padding-left: 8px; padding-right: 15px">
                        <Fa icon={faHouseChimney}/>
                    </span>
                    <span id="" class="text">All</span>
                </a>
            </li>
            <li class="sidebarItem">
                <a href="/upcoming">
                    <span class="text icon" style="color:#ffff00">
                        <Fa icon={faCircleExclamation} style="background-color: #333; border-radius: 50%"/>
                    </span>
                    <span id="" class="text">Upgoing</span>
                </a>
            </li>
            <li class="sidebarItem">
                <a href="/completed">
                    <span class="text icon" style="color:#2aa02a">
                        <Fa icon={faCircleCheck} style="background-color: #333; border-radius: 50%"/>
                    </span>
                    <span id="" class="text">Upgoing</span>
                </a>
            </li>
            <li class="sidebarItem">
                <a href="/due">
                    <span class="text icon" style="color:#ff4040">
                        <Fa icon={faCircleXmark} style="background-color: #333; border-radius: 50%"/>
                    </span>
                    <span id="" class="text">Completed</span>
                </a>
            </li>
            <li class="sidebarItem" on:click={openModal} on:keydown={foo}>
                <span class="text icon">
                    <Fa icon={faPlus}/>                    
                </span>
                <span id="" class="text">New&nbsp;Event</span>
            </li>
            <li class="sidebarItem" on:click={deleteEvent} on:keydown={foo}>
                <span class="text icon">
                    <Fa icon={faMinus}/>
                </span>
                <span id="" class="text">Delete&nbsp;Event</span>
            </li>
            <li class="sidebarItem" on:click={checkEvent} on:keydown={foo}>
                <span class="text icon">
                    <Fa icon={faCheck}/>
                </span>
                <span id="" class="text">Cchek&nbsp;Event</span>
            </li>
        </ul>
        <div class="sidebarBottom" on:click={toggleTheme} on:keydown={foo}>
            <div class="sidebarItem">
                <div id="themeLogo" class="light">
                    <div id="lightTheme">
                        <img src={sun} alt="" class="">
                    </div>
                    <div id="darkTheme">
                        <img src={moon} alt="" class="" style="padding-left: 5px;padding-right:-5px">
                    </div>
                </div>
                <div id="themeText">Theme</div>
            </div>
        </div>
    </div>
    <div class="main" id="main">
        <div id="timenow">
            <p>
                {nowStr[0]}
            </p>
            <p>
                {nowStr[1]}
            </p>
        </div>

        <slot/>
        
    </div>
    {#if showModal}
    <div id="backdropFilter"></div>
    <div id="newEventModal" class="modal" use:clickOutside on:outclick={closeModal}>
        <form method="POST" action="/api/writeMemo">
            
            <h1>New Event</h1>
            <div id="closeModalCross" on:click={closeModal} on:keydown={foo}>
                <Fa icon={faXmark}/>
            </div>
            <p>
                <label for="event-name">Name:</label>
                <input type="text" name="event-name" id="eventName" style="width: 10vw;" required>
            </p>
            <p>
                <label for="event-due-time">Deadline:&nbsp;&nbsp;</label>
                <input type="datetime-local" name="event-due-time" id="datetimeLocal" style="width: calc(10vw + 3px);" min={timeStr} required>
            </p>
            <input type="hidden" name="event-id" value={idGen()}>
            <input type="hidden" name="next" value="{window.location}">
            <button type="submit" class="closeModal">Submit</button>
        </form>
    </div>
    {/if}
</div>



  



<style lang="scss">
    $white: #fff;
    $primary-color: #333;
    $sidebar-hover: #999;
    $black: #000;

    .container {
        transition: color 0.1s, background-color 0.1s;
        font-family:Arial, Helvetica, sans-serif;
        .sidebar {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-size: 20px;
            position: fixed;
            top: 0;
            left: 0;
            width: 46.8625px;
            height: 100vh;
            background-color: $primary-color;
            transition: width 0.5s;
            color: $white;

            .sidebarItem {
                cursor: pointer;
                transition: color 0.1s, background-color 0.1s;
            }

            .sidebarItem:hover {
                background-color: $sidebar-hover;
            }

            .sidebarTop {
                transition: color 0.1s, background-color 0.1s;
                .sidebarItem {
                    padding-left: 13.5px;
                    padding-top: 10px;
                    padding-bottom: 10px;
                }
                top: 0;
                background-color: $primary-color;
                border: 0;
            }
            
            .sidebarBody {
                .sidebarItem {
                    a {
                        text-decoration: none;
                        color: inherit;
                        .text {
                            transition: color 0.1s, background-color 0.1s;
                            padding: 12px 2px;
                        }
                        .icon {
                            font-size: 25px;
                            padding: 0 11px;
                            padding-top: 8px;
                        }
                        height: 46.4px;
                        display: flex;
                        flex-direction: row;
                        padding: 0 0;
                    }
                    .text {
                        transition: color 0.1s, background-color 0.1s;
                        padding: 12px 2px;
                    }
                    .icon {
                        transition: color 0.1s, background-color 0.1s;
                        font-size: 30px;
                        padding-right: 13px;
                        padding-left: 8px;
                        padding-top: 5px;
                        width: 26px;
                    }
                    height: 46.4px;
                    display: flex;
                    flex-direction: row;
                    padding: 0 0;
                }
                list-style: none;
                transition: color 0.1s, background-color 0.1s;
                padding: 0;
                margin: 0;
                height: calc(100vh - 92.8px);
            }

            .sidebarBottom {
                .sidebarItem {
                    display: flex;
                    flex-direction: row;
                    height: 46.4px;

                    #themeLogo.dark, #themeLogo:not(.dark) {
                        #lightTheme, #darkTheme {
                            height: 49px;
                            transition: all 0.35s ease-in-out;
                        }

                        #darkTheme {
                            padding: 0;
                            top: calc(100vh - 46.4px);
                            position: fixed;
                        }
                    }

                    #themeLogo.dark {
                        #lightTheme {
                            transform: rotate(90deg) scale(0);
                        }
                    }

                    #themeLogo:not(.dark) {
                        #darkTheme {
                            transform: rotate(-90deg) scale(0);
                        }
                    }

                    // #lightTheme {
                    //     transform: rotate(90) scale(0);
                    //     // opacity: 0;
                    // }

                    #themeText {
                        transition: color 0.1s, background-color 0.1s;
                        padding: 12px 2px;
                    }

                }
                height: 46.4px;
            }
        }
        .main {
            margin-left: 46.8625px;
            transition: margin-left 0.5s;
            #timenow {
                position: fixed;
                top: 0;
                left: calc(100vw - 280px);
                p{
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: right;
                    // align-items: flex-end;

                }
            }
        }
        #backdropFilter {
            position: absolute;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
            backdrop-filter: blur(5px);
            background-color: rgba(0, 0, 0, 0.7);
        }
        .modal {
            background-color: $white;
            position: absolute;
            padding: 1em;
            height: 25vh;
            width: 15vw;
            top: 25vh;
            margin-left: 42.5vw;
            border: 0;
            color: $black;
            #closeModalCross {
                position: fixed;
                font-size: 50px;
                top: 26vh;
                left: 57vw;
                margin-top: 0.5%;
                cursor: pointer;
            }
            h1 {
                // margin: 5px 0 40px 0;
                margin-top: 5%;
            }
            p {
                display: table-row;
                // color
                label, input {
                    display: table-cell;
                }
            }
            
            // display: table;
            .closeModal {
                font-size: 20px;
                color: $white;
                background-color: $black;
                border: 0;
                height: 5vh;
                width: 5vw;
                margin-left: calc(50% - 2.5vw);
                margin-top: 10%;
                border-radius: 10px;
            }
            .closeModal:hover {
                background-color: $sidebar-hover;
            }
        }
        .modal::backdrop {
            background-color: rgba(0, 0, 0, 0.7);
        }
    }

   
</style>