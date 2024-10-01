// import React, { useState } from 'react';
// import { createUserWithEmailAndPassword } from 'firebase/auth';

// import { useNavigate } from 'react-router-dom';
// import { auth, db } from '../config/firebase';
// import { addDoc, collection } from 'firebase/firestore';

// const Signup = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [username, setUsername] = useState('username')
//     const navigate = useNavigate();
//     const collectionRef = collection(db, 'users');
//     const handleSignup = async (e) => {
//         e.preventDefault();
//         console.log(username, email, password)
//         try {

//             await createUserWithEmailAndPassword(auth, email, password);
//             addDoc(collectionRef, { username: username, email: email})
//             navigate('/survey');  // Redirect to survey page after successful signup
//         } catch (error) {
//             alert(error.message);
//             console.error('Error signing up:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>Sign Up</h1>
//             <form onSubmit={handleSignup}>
//                 <input type="text" placeholder='username' name="username" onChange={e => setUsername(e.target.value)} />
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <button type="submit">Sign Up</button>
//             </form>
//         </div>
//     );
// };

// export default Signup;












import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { addDoc, collection } from 'firebase/firestore';
import "../css/Auth.css"  // Assuming this CSS file contains the styles you shared.

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const collectionRef = collection(db, 'users');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            addDoc(collectionRef, { username: username, email: email });
            navigate('/survey');
        } catch (error) {
            alert(error.message);
            console.error('Error signing up:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrap">
                <div className="login-html">
                    <input id="tab-1" type="radio" name="tab" className="sign-in" />
                    <label htmlFor="tab-1" className="tab" onClick={() => navigate('/signin')}>Sign In</label>
                    <input id="tab-2" type="radio" name="tab" className="sign-up" checked readOnly />
                    <label htmlFor="tab-2" className="tab">Sign Up</label>
                    <div className="login-form">
                        <div className="sign-up-htm">
                            <form onSubmit={handleSignup}>
                                <div className="group">
                                    <label htmlFor="user" className="label">Username</label>
                                    <input id="user" type="text" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
                                </div>
                                <div className="group">
                                    <label htmlFor="email" className="label">Email</label>
                                    <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="group">
                                    <label htmlFor="pass" className="label">Password</label>
                                    <input id="pass" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="group">
                                    <button type="submit" className="button">Sign Up</button>
                                </div>
                                <div className="hr"></div>
                                <div className="foot-lnk">
                                    <label htmlFor="tab-1"> <NavLink className="foot-lnk-nav" to="/signin">Already a Member?</NavLink> </label>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
