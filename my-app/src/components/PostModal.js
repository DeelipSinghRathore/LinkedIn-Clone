import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import firebase from '@firebase/app-compat';
import { postArticleAPI } from '../actions';
import { SET_LOADING_STATUS } from '../actions/actionType';
import { db } from '../firebase';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { async } from '@firebase/util';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export const setLoading = (status) => ({
  type: SET_LOADING_STATUS,
  status: status,
});
const PostModal = (props) => {
  const [showModal, setShowModal] = useState('close');
  const [editorText, setEditorText] = useState('');
  const [shareImage, setShareImage] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [assetArea, setAssetArea] = useState('');
  const [currentUser, setcurrentUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setcurrentUser(user);
      }
    });
  }, []);

  useEffect(() => {
    setShowModal(props.showModal);
  }, [props.showModal]);

  const handleChange = (e) => {
    const image = e.target.files[0];
    if (image === '' || image === undefined) {
      alert(`Not an image, the file is a ${typeof image} `);
      return;
    }
    setShareImage(image);
  };

  const switchAssetArea = (area) => {
    setShareImage('');
    setVideoLink('');
    setAssetArea(area);
  };
  // Here is the function for the post butto
  const reset = (e) => {
    setEditorText('');
    setShareImage('');
    setVideoLink('');
    setAssetArea('');

    switch (showModal) {
      case 'open':
        setShowModal('close');
        break;
      case 'close':
        setShowModal('open');
        break;
      default:
        setShowModal('close');
    }

    // props.handleClick(e);
  };
  const signInWithGoogle = () => {
    console.log('Hello babe');
  };
  const submitted = (e) => {
    // console.log("aa gaye yahan");

    e.preventDefault();
    if (e.target !== e.currentTarget) {
      alert('Inavalid');
    }
    const payload = {
      image: shareImage,
      video: videoLink,
      user: props.user,
      description: editorText,
      timestamp: firebase.firestore.Timestamp.now(),
    };
    // props.postArticle(payload);
    // reset(e);

    // dispatch(setLoading(true));

    console.log(payload);
    if (payload.image != '') {
      const storage = getStorage();
      const storageRef = ref(storage, `image/${payload.image.name}`);

      const uploadTask = uploadBytesResumable(storageRef, payload.image);

      console.log('Safe');
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.byteTransferred / snapshot.totalBytes) * 100;

          console.log(`Progress:${progress}%`);
          if (snapshot.state === 'RUNNING') {
            console.log(`Progress:${progress}%`);
          }
        },
        (error) => {
          switch (error.code) {
            default:
              console.log(error.code);
              break;
          }
        },
        async () => {
          // const downloadURL = await storageRef.snapshot.ref.getDownloadURL();
          console.log('Are you reached');
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log('File available at', downloadURL);
            const currDate = new Date();
            const likes = new Set();
            likes.add('Deelip');
            likes.add('Deelip');
            likes.add('ChhoteLal');
            console.log('last line');
            setDoc(doc(db, 'articles', 'posts -> ' + `${currDate}`), {
              actor: {
                description: currentUser.email,
                title: currentUser.displayName,
                date: currDate,
                image: currentUser.photoURL,
              },
              video: payload.video,
              shareImg: downloadURL,
              comment: 0,
              // like: likes,
              description: payload.description,
            });

            console.log('last line');
          });

          // dispatch(setLoading(false));
        }
      );
    } else if (payload.video) {
      const currDate = new Date();
      const likes = new Set();
      setDoc(doc(db, 'articles', 'posts -> ' + `${currDate}`), {
        actor: {
          description: currentUser.email,
          title: currentUser.displayName,
          date: currDate,
          image: currentUser.photoURL,
        },
        video: payload.video,
        shareImg: '',
        comment: 0,
        // like: likes,
        description: payload.description,
      });

      // dispatch(setLoading(false));
    }

    reset();
    console.log('Completed');
  };

  // ---------------------
  return (
    currentUser &&
    showModal === 'open' && (
      <>
        <Container>
          <Content>
            <Header>
              <h2>Create a Post</h2>
              <button onClick={(event) => reset(event)}>
                <img src='/images/close-icon.png' alt='' width='100%' />
              </button>
            </Header>
            <SharedContent>
              <UserInfo>
                {/* {props.user.photoURL ? (
                  <img src='/images/user.svg' />
                ) : (
                  <img src='/images/user.svg' alt='' />
                )} */}
                <img src={currentUser.photoURL} alt='' />
                <span>{currentUser.displayName}</span>
              </UserInfo>
              <Editor>
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder='What do you want to share with the linkedin community ?'
                  autoFocus={true}
                />
                {assetArea === 'image' ? (
                  <UploadImage>
                    <input
                      type='file'
                      accept='image/gif , image/png, image/jpeg ,image/jpg'
                      name='image'
                      id='file'
                      style={{ display: 'none' }}
                      onChange={handleChange}
                    />
                    <p>
                      <label htmlFor='file'>Select an Image to share</label>
                    </p>
                    {shareImage && (
                      <img src={URL.createObjectURL(shareImage)} />
                    )}
                  </UploadImage>
                ) : (
                  assetArea === 'media' && (
                    <>
                      <input
                        type='text'
                        placeholder='Please input a video link'
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                      />
                      {videoLink && (
                        <ReactPlayer width={'100%'} url={videoLink} />
                      )}
                    </>
                  )
                )}
              </Editor>
            </SharedContent>
            <ShareCreation>
              <AttachAssets>
                <AssetButton onClick={() => switchAssetArea('image')}>
                  <img src='/images/photo-icon.svg' alt='' />
                </AssetButton>
                <AssetButton onClick={() => switchAssetArea('media')}>
                  <img src='/images/video-icon.svg' alt='' />
                </AssetButton>
              </AttachAssets>
              <ShareComment>
                <AssetButton>
                  <img src='/images/share-comment.svg' alt='' />
                  Anyone
                </AssetButton>
              </ShareComment>
              <PostButton
                // disabled={editorText ? true : false}
                onClick={submitted}
              >
                Post
              </PostButton>
            </ShareCreation>
          </Content>
        </Container>
        ){/* } */}
      </>
    )
  );
};
const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000000;
  color: black;
  background-color: rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.3s;
`;
const Content = styled.div`
  max-width: 552px;
  width: 100%;
  background-color: white;
  max-height: 90%;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 32px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: block;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    height: 40px;
    width: 40px;
    min-width: auto;
    color:rgba(0, 0, 0, 0.15) svg {
      pointer-events: none;
    }
    svg,
    img {
      pointer-events: none;
    }
  }
`;

const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  svg,
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 56%;
  }
  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
    margin-left: 5px;
  }
`;
const ShareCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 12px 16px;
`;

const AssetButton = styled.button`
  display: flex;
  align-items: center;
  height: 40px;
  min-width: auto;
  color: rgba(0, 0, 0, 0.5);
`;
const AttachAssets = styled.div`
  align-items: center;
  display: flex;
  padding-right: 8px;
  ${AssetButton} {
    width: 40px;
  }
`;
const ShareComment = styled.div`
  padding-left: 8px;
  margin-right: auto;
  border-left: 1px solid rgba(0, 0, 0, 0, 15);
  ${AssetButton} {
    svg {
      margin-right: 5px;
    }
  }
`;

const PostButton = styled.button`
  min-width: 60px;
  border-radius: 20px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${(props) => (props.disabled ? 'rgba(0,0,0,0.8)' : '#0a66c2')};
  color: ${(props) => (props.disabled ? 'rgba(1,1,1,0.2)' : 'white')};
  &:hover {
    background: ${(props) => (props.disabled ? 'rgba(0,0,0,0.08)' : '#004182')};
  }
`;
const Editor = styled.div`
  padding: 12px 24px;
  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
  }
  input {
    width: 100%;
    height: 35px;
    font-size: 16px;
    margin-bottom: 20px;
  }
`;
const UploadImage = styled.div`
  text-align: center;
  img {
    width: 100%;
  }
`;
const mapStateToProps = (state) => {
  return {
    //user: state.userState.user,
  };
};
const mapDispatchToProps = (dispatch) => ({
  //postArticle:(payload)=>dispatch(postArticleAPI(payload))
});
export default connect(mapDispatchToProps)(PostModal);
