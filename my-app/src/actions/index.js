import { async } from '@firebase/util';
import { auth, db, provider, storage } from '../firebase';
import { SET_USER, SET_LOADING_STATUS, GET_ARTICLES } from './actionType';
import { signInWithPopup } from 'firebase/auth';
export const setUser = (payload) => ({
  type: SET_USER,
  user: payload,
});
export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});
export const getArticles = (payload) => ({
  type: GET_ARTICLES,
  payload: payload,
});
// import  signInWithPopup  from 'firebase/auth';
// export function signInAPI() {
//   console.log("I am in signInAPI")
//   return (dispatch) => {
//       signInWithPopup(auth,provider)
//       .then((payload) => {
//         dispatch(setUser(payload.user));
//         console.log("Here ")
//       })
//       .catch((error) => alert(error.message));
//   };
// }

export function getUserAuth() {
  return (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  };
}

export function signOutApi() {
  return (dispatch) => {
    auth
      .signOut()
      .then(() => {
        dispatch(setUser(null));
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function postArticleAPI(payload) {
  return (dispatch) => {
    dispatch(setLoading(true));

    if (payload.image != '') {
      const upload = storage
        .ref(`image/${payload.image.name}`)
        .put(payload.image);
      upload.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.byteTransferred / snapshot.totalBytes) * 100;

          console.log(`Progress:${progress}%`);
          if (snapshot.state === 'RUNNING') {
            console.log(`Progress:${progress}%`);
          }
        },
        (error) => console.log(error.code),
        async () => {
          const downloadURL = await upload.snapshot.ref.getDownloadURL();
          db.collection('article').add({
            actor: {
              description: payload.user.email,
              title: payload.user.displayName,
              date: payload.timestamp,
              image: payload.user.photoURL,
            },
            video: payload.video,
            shareImg: downloadURL,
            comment: 0,
            description: payload.description,
          });
          dispatch(setLoading(false));
        }
      );
    } else if (payload.video) {
      db.collection('article').add({
        actor: {
          description: payload.user.email,
          title: payload.user.displayName,
          date: payload.timestamp,
          image: payload.user.photoUR,
        },
        video: payload.video,
        shareImg: '',
        comment: 0,
        description: payload.description,
      });
      dispatch(setLoading(false));
    }
  };
}

export function getArticleAPI() {
  return (dispatch) => {
    let payload;
    db.collection('articles')
      .orderBy('actor.date', 'desc')
      .onSnapshot((snapshot) => {
        payload = snapshot.docs.map((doc) => doc.date());
        dispatch(getArticleAPI(payload));
      });
  };
}
