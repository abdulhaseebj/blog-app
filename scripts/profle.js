import { onAuthStateChanged, signOut, updatePassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection,  getDocs, query, where,  updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



const form = document.querySelector('.form');
const logout = document.querySelector('.logout-btn');
const userRen = document.querySelector('.user-ren');
const profileImage = document.querySelector('.profileImage');
const navImage = document.querySelector('.navImage');
const newPassword = document.querySelector('.newPassword');
const repeatPassword = document.querySelector('.repeatPassword');
const newName = document.querySelector('.newName');
const oldPassword = document.querySelector('.oldPassword');

let uid;

// user login or signup
onAuthStateChanged(auth, async (user) => {
    if (user) {
        uid = user.uid;
        // console.log(uid);
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // console.log(doc.data());
            userRen.innerHTML = `${doc.data().names}`
            navImage.src = doc.data().profileUrl
            profileImage.src = doc.data().profileUrl
        });
    }
});

// // signout function

logout.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location = 'index.html'

    }).catch((error) => {
        console.log(error);
    });

});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    async function updateUserName() {
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, {
                names: newName.value,
            });
        });
    }
    updateUserName()

    
    const user = auth.currentUser;
    
    
    
    if (repeatPassword.value !== newPassword.value) {
        console.log('password are not same');
        return
    }
    
    
    updatePassword(user, newPassword.value)
    .then(() => {
        console.log('upd');
        
    }).catch((error) => {
        console.log(error);
        
        
    });
    
    oldPassword.value = ''
    newPassword.value = ''
    repeatPassword.value = ''
    
    
})
// updateUserName()
    
    // newName.value = ''
