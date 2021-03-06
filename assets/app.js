window.onload = ()=>{
  firebase.auth().onAuthStateChanged((user)=>{
      if(user){
          //Si estamos logueados
          loggedOut.style.display = "none";
          loggedIn.style.display = "block";
          messageSection.style.display = "block";
          console.log("User > "+JSON.stringify(user));
      }else{
          //No estamos logueados
          loggedOut.style.display = "block";
          loggedIn.style.display = "none";
          messageSection.style.display = "none";
      }
  });

  firebase.database().ref('messages')
    .limitToLast(2)
    .once('value')
    .then((messages)=>{
      console.log("mensajes > " +JSON.stringidy(messages));
  })
  .catch(()=>{
  });

  firebase.database().ref('messages')
    .limitToLast(1)
    .on('child_added', (newMessage) => {
        messageContainer.innerHTML += `
          <p class="messageUser">${newMessage.val().creatorName}</p>
          <p class="textMessage">Dice: ${newMessage.val().text}</p>
        `;
    });
};

function register(){
  const emailValue = email.value;
  const passwordValue = password.value; 
  firebase.auth().createUserWithEmailAndPassword(emailValue, passwordValue)
      .then(()=>{
          console.log("Usuario registrado");
      })
      .catch((error)=>{
          console.log("Error de firebase > "+error.code);
          console.log("Error de firebase, mensaje > "+error.message);
      });
}

function login(){
  const emailValue = email.value;
  const passwordValue = password.value;
  firebase.auth().signInWithEmailAndPassword(emailValue, passwordValue)
      .then(()=>{
          console.log("Usuario con login exitoso");
      })
      .catch((error)=>{
          console.log("Error de firebase > "+error.code);
          console.log("Error de firebase, mensaje > "+error.message);
      });
}

function logout() {
  firebase.auth().signOut()
    .then(() => {
      console.log("chao");
    })
    .catch();
};

function loginFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  //provider.addScope("user_birthday"); tienen que pedirle permiso a facebook
  provider.setCustomParameters({
    'display':'popup'
  });
  firebase.auth().signInWithPopup(provider)
  .then(() => {
    console.log("Login con facebook")
  })
  .catch((error)=>{
    console.log("Error de firebase > "+error.code);
    console.log("Error de firebase, mensaje > "+error.message);
});
}

// Firebase Database
// Usaremos una colección para guardar los mensajes, llaada message

function sendMessage() {
  const currentUser = firebase.auth().currentUser; 
  const messageAreaText = messageArea.value;
// Para obtener una nueva llave en la colección messages
  const newMessageKey = firebase.database().ref().child('messages').push().key;

  firebase.database().ref(`messages/${newMessageKey}`).set({
    creator : currentUser.uid,
    creatorName : currentUser.displayName,
    text : messageAreaText
  });
};