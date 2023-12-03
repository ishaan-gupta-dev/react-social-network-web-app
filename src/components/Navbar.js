import { Link } from 'react-router-dom';
import styles from '../styles/navbar.module.css';
import { useAuth } from '../hooks';
import React, { useEffect, useState } from 'react';
import { searchUsers } from '../api';

const Navbar = () => {

  const [results, setResults] = useState([]);
  const [searchText, setSearchText] = useState('');
  const auth = useAuth();

  useEffect(() => {

    const fetchUsers = async () => {
      const response = await searchUsers(searchText);

      if (response.success) {
        setResults(response.data.users);
      }
    }

    if (searchText.length > 0) {
      fetchUsers();
    } else {
      setResults([]);
    }
  }, [searchText])


  const handleClickOnUser = () => {
    return setResults([]);
  }


  return (
    <div className={styles.nav}>
      <div className={styles.leftDiv}>
        <a href="/">
          <img
            alt=""
            src="https://ninjasfiles.s3.amazonaws.com/0000000000003454.png"
          />
        </a>
      </div>

      <div className={styles.searchContainer}>
        <img className={styles.searchIcon} src='https://cdn-icons-png.flaticon.com/512/954/954591.png' alt='search-icon' />
        <input id='search-box' placeholder='Search User' value={searchText} onChange={(e) => setSearchText(e.target.value)} />

        {results.length > 0 &&
          <div className={styles.searchResults}>
            <ul>
              {results.map((user) => (
                <Link to={`/user/${user._id}`} onClick={handleClickOnUser}>
                  <li className={styles.searchResultsRow} key={`user-${user._id}`}>
                    <img src="https://cdn-icons-png.flaticon.com/512/1990/1990261.png" alt="user-avatar" />
                    <span>{user.name}</span>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        }
      </div>

      <div className={styles.rightNav}>
        {auth.user && <div className={styles.user}>
          <Link to="/settings">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt=""
              className={styles.userDp}
            />
          </Link>
          <span>{auth.user.name}</span>
        </div>}

        <div className={styles.navLinks}>
          <ul>
            {auth.user ? (
              <React.Fragment>
                <li>
                  <button onClick={auth.logout}>Log out</button>
                </li>
              </React.Fragment>) : (
              <React.Fragment>
                <li>
                  <Link to="/login">Log in</Link>
                </li>

                <li>
                  <Link to="/register">Register</Link>
                </li>
              </React.Fragment>)}
          </ul>
        </div>
      </div>
    </div >
  );
};

export default Navbar;
