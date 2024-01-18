import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth, db, storage } from "./config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js'


const form = document.querySelector('.form');
const firstName = document.querySelector('.first-name');
const lastName = document.querySelector('.last-name');
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const repeatPassword = document.querySelector('.repeat-password');
const uploadPhoto = document.querySelector('.upload-photo');
let loadingModal = document.querySelector('#loading-modal');
const errorM = document.querySelector('.error');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const names = `${firstName.value} ${lastName.value}`;

    if (password.value !== repeatPassword.value) {
        console.log('Passwords are not the same');
        errorM.innerHTML = `${'Passwords are not the same.'}`
        return;
    }

    loadingModal.showModal();
    const files = uploadPhoto.files[0];
    const storageRef = ref(storage, email.value);

    uploadBytes(storageRef, files)
        .then(() => getDownloadURL(storageRef))
        .then((url) => {
            return createUserWithEmailAndPassword(auth, email.value, password.value)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log(user);
                    return addDoc(collection(db, "users"), {
                        names: names,
                        email: email.value,
                        uid: user.uid,
                        profileUrl: url,
                    });
                })
                .then((res) => {
                    console.log(res);
                    window.location = 'login.html';
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    console.log(errorMessage);
                    errorM.innerHTML = `${errorMessage}`;
                })
                .finally(() => {
                    loadingModal.close();
                });
        })
        .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
           errorM.innerHTML = `${errorMessage}`;
            loadingModal.close();
        });
});


