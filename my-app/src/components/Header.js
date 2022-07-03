import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { signOutApi } from '../actions';
import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useEffect } from 'react';

const Header = (props) => {
  const [currentUser, setcurrentUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setcurrentUser(user);
      }
    });
  }, []);

  return (
    <Tester>
      <Container>
        <Content>
          <Logo>
            <a href='/home'>
              <img src='/images/home-logo.svg' alt='' />
            </a>
          </Logo>
          <Search>
            <div>
              <input type='text' placeholder='Search' />
            </div>
            <SearchIcon>
              <img src='/images/search-icon.svg' alt='' />
            </SearchIcon>
          </Search>
          <Nav>
            <NavListWrap>
              <NavList className='active'>
                <a>
                  <img src='/images/nav-home.svg' alt='' />
                  <span>Home</span>
                </a>
              </NavList>
              <NavList>
                <a>
                  <img src='/images/nav-network.svg' alt='' />
                  <span>My Network</span>
                </a>
              </NavList>
              <NavList>
                <a>
                  <img src='/images/nav-jobs.svg' alt='' />
                  <span>Jobs</span>
                </a>
              </NavList>
              <NavList>
                <a>
                  <img src='/images/nav-messaging.svg' alt='' />
                  <span>Messaging</span>
                </a>
              </NavList>
              <NavList>
                <a>
                  <img src='/images/nav-notifications.svg' alt='' />
                  <span>Notifications </span>
                </a>
              </NavList>
              <User>
                <a>
                  {currentUser && currentUser.photoURL ? (
                    <img src={currentUser.photoURL}></img>
                  ) : (
                    <img src='/images/user.svg' alt='' />
                  )}
                  <span>
                    Me
                    <img src='/images/down-icon.svg' alt='' />
                  </span>
                </a>
                <SignOut onClick={() => auth.signOut()}>
                  <button>SignOut</button>
                </SignOut>
              </User>
              <Work>
                <a>
                  <img src='/images/nav-work.svg' alt='' />
                  <span>
                    Work
                    <img src='/images/down-iocn.svg' alt='' />
                  </span>
                </a>
              </Work>
            </NavListWrap>
          </Nav>
        </Content>
      </Container>
    </Tester>
  );
};

const Tester = styled.div`
  position: sticky;
  z-index: 10000;
  top: 0;
  margin-top: -7px;
`;
const NavListWrap = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  list-style-type: none;
  .active {
    span:after {
      content: '';
      transform: scaleX(1);
      border-bottom: 2px solid var(--white, #fff);
      bottom: 0;
      left: 0;
      position: absolute;
      transition: transform 0.2s ease-in-out;
      width: 100%;
      border-color: rgba(0, 0, 0, 0.9);
    }
  }
`;
const NavList = styled.li`
  display: flex;
  align-items: center;
  a {
    &:hover {
      cursor: pointer;
    }
    align-items: center;
    background: transparent;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-weight: 400;
    justify-content: center;
    line-height: 1.5;
    min-height: 50px;
    min-width: 80px;
    position: relative;
    text-decoration: none;
    span {
      color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
    }
    @media (max-width: 768px) {
      min-width: 70px;
    }
  }
  &:hover &:active {
    a {
      span {
        color: rgba(0, 0, 0, 0.9);
      }
    }
  }
`;
const Nav = styled.nav`
  margin-left: auto;
  display: block;
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    bottom: 0;
    background: white;
    width: 100%;
  }
`;
const SearchIcon = styled.div`
  width: 40px;
  position: absolute;
  z-index: 1;
  top: 10px;
  left: 2px;
  border-radius: 0 2px 2px 0;
  margin: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Search = styled.div`
  opacity: 1;
  flex-grow: 1;
  position: relative;
  & > div {
    max-width: 280px;
    input {
      border: none;
      box-shadow: none;
      background-color: #eef3f8;
      border-radius: 2px;
      color: rgba(0, 0, 0, 0.9);
      width: 218px;
      padding: 0 8px 0 40px;
      line-height: 1.75;
      font-weight: 400;
      font-size: 14px;
      height: 34px;
      border-color: #dce6f1;
      vertical-align: text-top;
    }
  }
`;
const Logo = styled.span`
  margin-top: 4px;
  img {
   height: 34px;
  }
`;
const Container = styled.div`
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  left: 0;
  padding: 0 2px;
  top: 0;
  width: 100vw;
  z-index: 100;
`;
const Content = styled.div`
  display: flex;
  align-items: center;
  margin: auto;
  min-height: 100%;
  max-width: 1128px;
`;
const SignOut = styled.div`
  position: absolute;
  top: 42px;
  background: white;
  border-radius: 0 0 5px 5px;
  background-color: white;
  border-radius: 4px;
  width: 80pxpx;
  height: 25px;
  margin-left: 15px;
  font-size: 16px;
  border-radius: 5px;
  transition-duration: 167ms;
  text-align: center;
  display: none;
  button {
    background-color: whitesmoke;
    border-radius: 4px;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`;
const User = styled(NavList)`
  a > svg {
    width: 24px;
    border-radius: 50%;
  }
  a > img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  span {
    display: flex;
    align-items: center;
  }
  &:hover {
    ${SignOut} {
      align-items: center;
      display: flex;
      transition-delay: 3s ease-out;
      justify-content: center;
    }
  }
`;
const Work = styled(User)`
  border-left: 1px solid rgba(0, 0, 0, 0.08);
`;

const mapStateToProps = (state) => {
  return {
    // user:state.userState.user,
  };
};
const mapDispatchToProps = (dispatch) => ({
  // SignOut:()=>dispatch(signOutApi()),
});

export default connect(mapDispatchToProps, mapStateToProps)(Header);
