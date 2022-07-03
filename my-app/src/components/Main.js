import React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { getArticleAPI } from '../actions';
import styled from 'styled-components';
import PostModal from './PostModal';
import ReactPlayer from 'react-player';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { query, orderBy } from 'firebase/firestore';

const Main = (props) => {
  const [showModal, setShowModal] = useState('close');
  const [ArticleSet, setArticleSet] = useState(null);
  const [currentUser, setcurrentUser] = useState(null);
  const [Click, setClick] = useState(null);
  const [readMore, setReadMore] = useState(false);
  const [linkName, setLinkName] = useState(null);

  useEffect(() => {
    if (readMore) {
      setLinkName('see less');
    } else {
      setLinkName('see more');
    }
  }, [readMore]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setcurrentUser(user);
      }
    });
  }, []);

  const Like = () => {};
  useEffect(() => {
    const ref = query(
      collection(db, 'articles'),
      orderBy('actor.date', 'desc')
    );
    var col = [];
    getDocs(ref).then((snapshot) => {
      setTimeout(() => {
        snapshot.forEach((ele) => {
          col.push(ele.data());
        });

        setArticleSet(col);
      }, 1000);
    });
  }, [currentUser]);

  const handleClick = (e) => {
    // e.preventDefault();
    // if (e.target !== e.currenTarget) {
    //   return;
    // }
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
  };

  useEffect(() => {
    console.log(ArticleSet);
  }, [ArticleSet]);

  function findDate(date) {
    var yr = date.getFullYear();
    var mon = date.getMonth();
    var day = date.getDate();
    var hrs = date.getHours();
    var min = date.getMinutes();
    var ans;

    var mins;
    if (min < 10) {
      mins = '0' + min;
    } else {
      mins = '' + min;
    }
    var str;
    if (hrs > 12) {
      str = 'PM ';
      hrs -= 12;
    } else {
      str = 'AM ';
    }
    var hrrs;

    if (hrs < 10) {
      hrrs = '0' + hrs;
    } else {
      hrrs = '' + hrs;
    }

    ans = hrrs + ':' + mins + str + day + '/' + mon + '/' + yr;

    return ans;
  }

  return (
    ArticleSet && (
      <>
        {
          // props.articles.length===0?
          //  ( <p>There is no articles</p>)
          //   :
          <Container>
            <ShareBox>
              <div>
                {currentUser && currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt='' />
                ) : (
                  <img src={'./image/user-icon.svg'} />
                )}

                <button onClick={handleClick}>
                  Ask your network for advice
                </button>
              </div>
              <div>
                <button>
                  <img
                    src='/images/photo-icon.svg'
                    height='25'
                    width='25'
                    alt=''
                  />
                  <span>Photo</span>
                </button>
                <button>
                  <img
                    src='/images/video-icon.svg'
                    height='25'
                    width='25'
                    alt=''
                  />
                  <span>Videos</span>
                </button>
                <button>
                  <img
                    src='/images/event-icon.svg'
                    height='25'
                    width='25'
                    alt=''
                  />
                  <span>Events</span>
                </button>
                <button>
                  <img
                    src='/images/article-icon.svg'
                    height='25'
                    width='25'
                    alt=''
                  />
                  <span>Write Article </span>
                </button>
              </div>
            </ShareBox>
            <Content>
              {ArticleSet.length > 0 &&
                ArticleSet.map((article, key) => (
                  <Article key={key}>
                    <SharedActor>
                      <a>
                        <img src={article.actor.image} alt='' />
                        <div>
                          <span className='name'>{article.actor.title}</span>
                          {/* <br /> */}
                          {/* <span>{article.actor.description}</span> */}
                          <span className='date'>
                            {findDate(article.actor.date.toDate())}
                          </span>
                        </div>
                      </a>
                      <button>
                        <img src='/images/ellipsis.svg' alt='' />
                      </button>
                    </SharedActor>
                    <Description>
                        {article.description.substring(0, 200)}
                        {readMore && article.description.substring(200)}
                        <a
                          className='read-more-link'
                          onClick={() => {
                            setReadMore(!readMore);
                          }}
                        >
                          <h2>{linkName}</h2>
                        </a>
                    </Description>
                    <SharedImg>
                      <a>
                        {!article.shareImg && article.video ? (
                          <ReactPlayer width={'100%'} url={article.video} />
                        ) : (
                          article.shareImg && <img src={article.shareImg} />
                        )}
                      </a>
                    </SharedImg>
                    <SocialCounts>
                      <li>
                        <button>
                          <img
                            src='/images/like.svg'
                            width='16'
                            height='16'
                            alt=''
                          />
                          <img
                            src='/images/Linkedin-Love-Icon-Heart250.png'
                            width='16'
                            height='16'
                            alt=''
                          />
                          <img
                            src='/images/Linkedin-Celebrate-Icon-ClappingHands.png'
                            width='16'
                            height='16'
                            alt=''
                          />
                          <span>75</span>
                        </button>
                      </li>
                      <li>
                        <a>comment</a>
                      </li>
                    </SocialCounts>
                    <SocialActions>
                      <button onClick={Like}>
                        <img
                          src='/images/like.svg'
                          width='20'
                          height='20'
                          alt=''
                        />
                        <span>Like</span>
                      </button>
                      <button>
                        <img
                          src='/images/comment.svg'
                          width='20'
                          height='20'
                          alt=''
                        />
                        <span>Comments</span>
                      </button>
                      <button>
                        <img
                          src='/images/share.svg'
                          width='20'
                          height='20'
                          alt=''
                        />
                        <span>Share</span>
                      </button>
                      <button>
                        <img
                          src='/images/send.png'
                          width='20'
                          height='20'
                          alt=''
                        />
                        <span>Send</span>
                      </button>
                    </SocialActions>
                  </Article>
                ))}
            </Content>
            <PostModal showModal={showModal} handleClick={handleClick} />
          </Container>
        }
      </>
    )
  );
};
const Container = styled.div`
  grid-area: main;
`;
const CommonCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;
const ShareBox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  color: #958b7b;
  margin: 0 0 8px;
  background: white;
  div {
    button {
      outline: none;
      color: rgba(0 0 0 0.6);
      font-size: 14px;
      line-height: 1.5;
      min-height: 48px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      font-weight: 600;
    }
    &:first-child {
      display: flex;
      align-items: center;
      padding: 8px 16px 0px 16px;
      img {
        width: 48px;
        border-radius: 50%;
        margin-right: 8px;
      }
      button {
        margin: 4px 0;
        flex-grow: 1;
        padding-left: 16px;
        border: 1px solid rgba(0 0 0 0.15);
        border-radius: 35px;
        color: #686868;
        background-color: #ededed;
        border: 1px solid rgb(211, 211, 211);
        text-align: left;
      }
    }
    &:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 4px;
      button {
        img {
          margin: 0 4px 0 -2px;
        }
        span {
          color: #686a6c;
        }
      }
    }
  }
`;
const Article = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
  overflow: visible;
`;
const SharedActor = styled.div`
  padding: 40px;
  flex-wrap: nowrap;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  align-items: center;
  display: flex;
  a {
    margin-right: 12px;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    text-decoration: none;
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    & > div {
      /* display: flex; */
      /* flex-direction: column; */
      /* flex-grow: 1;
      flex-basis: 0; */
      margin-left: 8px;
      overflow: hidden;

      display: grid;
      grid-template-areas: 'leftside main rightside';
      grid-template-columns: minmax(0, 8fr) minmax(300px, 4fr);

      padding-top: 13px;

      .name {
        font-family: 'Bitter', serif;
font-family: 'Cormorant Garamond', serif;
font-family: 'Joan', serif;
/* font-family: 'Satisfy', cursive; */
        text-align: left;
        font-size: 20px;
        font-weight: 700;
        color: rgba(0 0 0 1);
      }

      .date {
        font-family: 'Bitter', serif;
font-family: 'Cormorant Garamond', serif;
font-family: 'Satisfy', cursive;
        padding-top: 2px;
        justify-content: center;
        font-size: 15px;
        text-align: right;
      }
      /* &:last-child {
          font-size: 17px;
          text-align: right;
          color: rgba(0 0 0 0.6);
        } */
    }
  }
  button {
    position: absolute;
    right: 12px;
    top: 0;
    background: transparent;
    border: none;
    outline: none;
  }
`;
const Description = styled.div`
  padding: 0 16px;
  overflow: hidden;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Bitter', serif;
  color: rgba(0 0 0 0.9);
  text-align: left;

  a {
    color: #0a66c2;
    &:hover {
      cursor: pointer;
    }
  }
`;
const SharedImg = styled.div`
  margin-top: 8px;
  width: 100%;
  display: block;
  position: relative;
  background-color: #f9fafb;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;
const SocialCounts = styled.ul`
  line-height: 1.3;
  display: flex;
  align-items: flex-start;
  overflow: auto;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid #e9e5df;
  list-style: none;
  li {
    margin-right: 5px;
    font-size: 12px;
    button {
      display: flex;
      border: none;
      background-color: white;
    }
  }
`;
const SocialActions = styled(Article)`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0;
  min-height: 45px;
  padding: 4px 8px;
  button {
    display: inline-flex;
    align-items: center;
    padding: 15px;
    border-radius: 4px;
    font-weight: 300;
    cursor: pointer;
    color: #686a6c;
    font-family-sans: -apple-system, system-ui, BlinkMacSystemFont, Segoe UI,
      Roboto, Helvetica Neue, Fira Sans, Ubuntu, Oxygen, Oxygen Sans, Cantarell,
      Droid Sans, Apple Color Emoji, Segoe UI Emoji, Segoe UI Emoji,
      Segoe UI Symbol, Lucida Grande, Helvetica, Arial, sans-serif;
    font-size: 15px;
    border: none;
    width: 25%;
    justify-content: center;
    background-color: white;
    @media (min-width: 768px) {
      span {
        margin-left: 8px;
      }
    }
    &:hover {
      background-color: #ededed;
    }
  }
`;

const Content = styled.div`
  text-align: center;
  & > img {
    width: 30px;
  }
`;
// const mapStateToProps = (state) => {
//   return {
//     loading: state.articleState.loading,
//     user: state.userState.user,
//     articles: state.articleState.articles,
//   };
// };
// const mapDispatchToProps = (dispatch) => ({
//   getArticles: () => dispatch(getArticleAPI),
// });
// export default connect(mapStateToProps, mapDispatchToProps)(Main);
export default Main;
