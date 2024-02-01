import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, getDocs, query, where, deleteDoc, doc, orderBy, updateDoc, } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



const render = document.querySelector('.render');
const logoutBtn = document.querySelector('.logoutBtn');



let Loginuser = false
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user);
        Loginuser = true
        return
    } else {
        logoutBtn.innerHTML = 'Login'

    }
});


logoutBtn.addEventListener('click', () => {
    if (Loginuser) {

        signOut(auth).then(() => {
            window.location = 'index.html'
        }).catch((error) => {
            console.log(error);
        });
    } else {
        window.location = 'login.html'
    }
})




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
const data = localStorage.getItem("userDetails");
const userDetails = JSON.parse(data);
const userUid = userDetails[0].uid;

// console.log(userUid);

const q = query(collection(db, "blog"), where("Uid", "==", userUid));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
    // console.log(doc.data());
    arr.push(doc.data())
});


// render data function
function renderData() {
    arr.map((item) => {
        render.innerHTML += `<div class="signup  sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-7 lg:py-7 shadow-1 w-[300px] sm:w-[500px] md:w-[650]">
        <div class="image-div">
            <img class="profileImage user-img" src="${item.userobj.profileUrl}" alt="">

                <div>
                    <p class="user-name">${item.userobj.names}</p>
                    <p class="date">${formatDate(item.postDate)}</p>

                </div>
        </div>
        <div>

            <h2 class="content-title">${item.Title}</h2>
            <p class="content-text">${item.Text}</p>
        </div>
            </div>`
                
    })
}

renderData()










