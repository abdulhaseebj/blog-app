import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, addDoc, getDocs, Timestamp, query, where, deleteDoc, doc, updateDoc, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";



const logout = document.querySelector('.logout-btn');
const blogInput = document.querySelector('.blog-input');
const blogTextarea = document.querySelector('.blog-textarea');
const publishBtn = document.querySelector('.publish-btn');
const userRen = document.querySelector('.user-ren');
const profileImage = document.querySelector('.profileImage');
const render = document.querySelector('.render');
let loadingModal = document.querySelector('#loading-modal');


let img;
let names;
let userobj;

// user login or signup
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        // console.log(uid);
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // console.log(doc.data());
            userRen.innerHTML = `${doc.data().names} `
            profileImage.src = doc.data().profileUrl
            names = doc.data().names
            img = doc.data().profileUrl
            userobj = doc.data()
        });
        getDataFromFirestore(uid)
    } else {
        window.location = 'index.html'
    }
});

// // signout function

logout.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location = 'index.html'

    }).catch((error) => {
        console.log(error);
    });

})

const arr = []

// data add on firestore
publishBtn.addEventListener('click', async () => {
    loadingModal.showModal();

    try {
        const docRef = await addDoc(collection(db, "blog"), {
            Title: blogInput.value,
            Text: blogTextarea.value,
            Uid: auth.currentUser.uid,
            postDate: Timestamp.fromDate(new Date()),
            userobj
        });
        arr.push({
            uid: auth.currentUser.uid,
            Title: blogInput.value,
            Text: blogTextarea.value,
            postDate: Timestamp.fromDate(new Date()),
            docId: docRef.id,
        });
        loadingModal.close();

        renderPost()

    } catch (e) {
        console.error("Error adding document: ", e);

    }
    blogInput.value = '';
    blogTextarea.value = '';
})



function renderPost() {
    render.innerHTML = ''
    arr.map((item) => {
        render.innerHTML += `<div class="signup  bg-white px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-7 lg:py-7 rounded-2xl shadow-1 w-[300px] sm:w-[500px] md:w-[650] mt-5 mb-5">
            <div class="flex items-start gap-1">
                <img class="profileImage rounded-full  w-[60px]" src="${img}" alt="">

                    <div>
                        <p class="text-xl font-black pl-1 mt-2 ">${names}</p>
                        <p class="text-sm pl-1 text-slate-500">${formatDate(item.postDate)}</p>

                    </div>
            </div>
            <div>

                <h2 class="pl-1 mt-5 text-xl font-black">${item.Title}</h2>
                <p class=" text-sm text-slate-500 pl-1 mt-3 mb-5">${item.Text}</p>
            </div>

            <hr class="text-slate-300  pl-1"><div class="flex justify-between  pl-1 mt-2" >
                <button type="button" id="delete" >Delete</button>
                <button type="button" id="update" >Edit</button>
            </div><hr class="text-slate-300  pl-1 mt-2">
                </div>`




    })

    const del = document.querySelectorAll('#delete');
    const upd = document.querySelectorAll('#update');

    del.forEach((btn, index) => {
        btn.addEventListener('click', async () => {
            loadingModal.showModal();
            console.log('delete called', arr[index]);
            await deleteDoc(doc(db, "blog", arr[index].docId))
                .then(() => {
                    console.log('post deleted');
                    arr.splice(index, 1);
                    renderPost()
                });
            loadingModal.close();
        })
    });

    upd.forEach((btn, index) => {
        btn.addEventListener('click', async () => {
            loadingModal.showModal();
            console.log('update called', arr[index]);
            const updatedTitle = prompt('Enter new Title', arr[index].Title);
            const updatedText = prompt('Enter new Description', arr[index].Text);
            await updateDoc(doc(db, "blog", arr[index].docId), {
                Title: updatedTitle,
                Text: updatedText,
                postDate: Timestamp.fromDate(new Date()),
            });
            arr[index].Title = updatedTitle;
            arr[index].Text = updatedText;
            renderPost()

        })

        loadingModal.close();
    })
}




// get data from firestore
async function getDataFromFirestore(uid) {
    const q = query(collection(db, "blog"), where("Uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
        arr.push({ ...doc.data(), docId: doc.id });
    });
    renderPost()

}
console.log(arr);




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
