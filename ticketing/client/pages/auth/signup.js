import { useState } from 'react'

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPasswords] = useState('');

    return ( 
        <form>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input value={email} onChange={e => setEmail(e.target.value)}className="form-control" placeholder="Email" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input className="form-control" placeholder="Password" />
            </div>
            <button className="btn btn-primary">Sign Up</button>
        </form>
    );
};