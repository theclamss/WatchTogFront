// src/LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
              // Faites quelque chose avec les identifiants, par exemple les envoyer à un serveur pour authentification
        console.log(username, password);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
    <input
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    />
    </div>
    <div>
    <label>Password:</label>
    <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    />
    </div>
    <div>
    <button type="submit">Login</button>
        </div>
        </form>
        </div>
);
};

export default LoginPage;
