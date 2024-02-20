import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const userWish = document.querySelector('.wish');
const render = document.querySelector('.render');
const logoutBtn = document.querySelector('.logoutBtn');
const profileBtn = document.querySelector('.profileBtn');
const dashboardBtn = document.querySelector('.dashboardBtn');
const profileImage = document.querySelector('.profileImage');
// const div = document.querySelector('.main-div');

let Loginuser = false
let uid;
onAuthStateChanged(auth, async (user) => {
    if (user) {
        uid = user.uid;
        // console.log(uid);
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // console.log(doc.data());
            profileImage.src = doc.data().profileUrl
        });
        // console.log(user);
        Loginuser = true
        return
    } else {
        logoutBtn.innerHTML = 'Login'
        profileBtn.style.display = 'none'
        dashboardBtn.style.display = 'none'
        profileImage.src = `${'./assets/download.png'}`


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
        render.innerHTML += `<div class="signup  sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-7 lg:py-7 shadow-1 w-[300px] sm:w-[500px] md:w-[650]">
            <div class="flex items-center">
            <div>
            <img class="user-img" src="${item.userobj.profileUrl}" alt="">
            </div>
                    <div>
                        <p class="user-name">${item.userobj.names}</p>
                        <p class="date">${formatDate(item.postDate)}</p>

                    </div>
            </div>
            <div>

                <h2 class="content-title">${item.Title}</h2>
                <p class="content-text">${item.Text}</p>
            </div>

            <a class='see-spacific spacific'>See all blogs from this user</a>
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









