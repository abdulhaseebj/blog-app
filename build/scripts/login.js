import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./config.js";


const form = document.querySelector('.form');
const email = document.querySelector('.email');
const password = document.querySelector('.password');
let loadingModal = document.querySelector('#loading-modal');
const errorM = document.querySelector('.error');


onAuthStateChanged(auth, (user) => {
    if (user) {
        // window.location = 'dashboard.html'
        return
    }
});



// login function

form.addEventListener('submit', (e) => {
    e.preventDefault()
    // console.log(email.value);
    // console.log(password.value);
    loadingModal.showModal();
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            window.location = 'dashboard.html'
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
            errorM.innerHTML = `${errorMessage}`
            loadingModal.close();
        });
})



