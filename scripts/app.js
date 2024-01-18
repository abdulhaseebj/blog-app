import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, getDocs, } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const userWish = document.querySelector('.wish');
const render = document.querySelector('.render');
const logoutBtn = document.querySelector('.logoutBtn');
const profileBtn = document.querySelector('.profileBtn');
const dashboardBtn = document.querySelector('.dashboardBtn');
// const div = document.querySelector('.main-div');

let Loginuser = false
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user);
        Loginuser = true
        return
    } else {
        logoutBtn.innerHTML = 'Login'
        profileBtn.style.display = 'none'
        dashboardBtn.style.display = 'none'

    }
});

logoutBtn.addEventListener('click', () => {
    if (Loginuser) {

        signOut(auth).then(() => {
            window.location = 'login.html'
        }).catch((error) => {
            console.log(error);
        });
    } else {
        window.location = 'login.html'
    }
})


// navbar wishes function

function userWishes() {
    const currentDate = new Date()
    const currentHour = currentDate.getHours()
    // console.log(currentHour);

    let wishes;

    if (currentHour >= 5 && currentHour < 12) {
        wishes = 'Good Morning Readers !'
    } else if (currentHour >= 12 && currentHour < 17) {
        wishes = 'Good Afternoon Readers !'
    } else if (currentHour >= 17 && currentHour < 20) {
        wishes = 'Good Evening Readers !'
    } else {
        wishes = 'Good Night Readers !'
    }
    userWish.innerHTML = wishes
}

userWishes()

// date function
function formatDate(timestamp) {
    const dateObject = timestamp.toDate();
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return dateObject.toLocaleDateString("en-US", options);
}


// get data form firestore function
let arr = []

const querySnapshot = await getDocs(collection(db, "blog"));
querySnapshot.forEach((doc) => {
    // console.log(doc.data());
    arr.push(doc.data())
});


// render data function
function renderData() {
    arr.map((item) => {
        render.innerHTML += `<div class="signup  bg-white px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-7 lg:py-7 rounded-2xl shadow-1 w-[300px] sm:w-[500px] md:w-[650] mt-5 mb-5">
            <div class="flex items-start gap-1">
                <img class="profileImage  rounded-full  w-[60px]" src="${item.userobj.profileUrl}" alt="">

                    <div>
                        <p class="text-xl font-black pl-1 mt-2 ">${item.userobj.names}</p>
                        <p class="text-sm pl-1 text-slate-500">${formatDate(item.postDate)}</p>

                    </div>
            </div>
            <div>

                <h2 class="pl-1 mt-5 text-xl font-black">${item.Title}</h2>
                <p class=" text-sm text-slate-500 pl-1 mt-3 mb-5">${item.Text}</p>
            </div>

            <a class='pl-1 text-teal-900 font-medium  hover:text-yellow-400   cursor-pointer spacific'>See all blogs from this user</a>
                </div>`

    })
}

renderData()

const spacific = document.querySelectorAll(".spacific");

spacific.forEach((item, index) => {
    item.addEventListener("click", () => {
        console.log(index);
        let spacificArr = [];
        const obj = {
            uid: arr[index].userobj.uid,
            name: arr[index].userobj.names,
            email: arr[index].userobj.email,
            photoURL: arr[index].userobj.profileUrl,
        };
        spacificArr.push(obj);

        const spacificUid = JSON.stringify(spacificArr);
        localStorage.setItem("userDetails", spacificUid);
        window.location = "spacific.html";
    });
});









