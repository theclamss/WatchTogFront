// HomePage.tsx
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import { TEInput, TERipple } from "tw-elements-react";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [isRegisterModalOpen, setRegisterModalOpen] = useState<boolean>(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [loginEmail, setLoginEmail] = useState<string>('');
    const [loginPassword, setLoginPassword] = useState<string>('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8080/login', {
                email: loginEmail,
                password: loginPassword,
            });

            if (response.status === 200) {
                alert("Connexion réussie!");
                // Vous pouvez aussi rediriger l'utilisateur ou stocker un token, etc.
            } else {
                alert("Erreur lors de la connexion!");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi de la requête:", error);
            alert("Erreur lors de la connexion. Veuillez réessayer.");
        }
    };



    const handleRegister = async () => {
        // 1. Valider le mot de passe avec l'expression régulière
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&]{8,}$/;

        if(!passwordRegex.test(password)) {
            alert("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial!");
            return;
        }
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/register', {
                email,
                userName,
                password,
                address,
            });

            if (response.status === 200) {
                alert("Inscription réussie!");
                setRegisterModalOpen(false);
            } else {
                alert("Erreur lors de l'inscription!");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi de la requête:", error);
            alert("Erreur lors de l'inscription. Veuillez réessayer.");
        }
    };

    return (
        <div style={styles.container}>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lacinia feugiat mi, at varius mi cursus non. Nulla ac lacinia turpis.</p>
            <button style={styles.button} onClick={() => setLoginModalOpen(true)}>Login</button>
            <button style={styles.button} onClick={() => setRegisterModalOpen(true)}>Register</button>


            <Modal
                isOpen={isLoginModalOpen}
                onRequestClose={() => setLoginModalOpen(false)}
                contentLabel="Login Modal"
                style={customModalStyles}
                ariaHideApp={false}

            >
                {}
                <h2 className="text-2xl mb-4">Connection</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}>

                    <TEInput
                        type="text"
                        label="Nom d'utilisateur ou mot de passe"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="mb-6"
                        required
                    />
                    {/* Mot de passe input */}
                    <TEInput
                        type="password"
                        label="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-6"
                        required
                    />





                    <TERipple rippleColor="light" className="w-full mb-6">
                        <button
                            type="submit"

                            className="...[classes du bouton Send]..."
                        >
                            Se connecter
                        </button>
                    </TERipple>

                    {/* Close button */}
                    <TERipple rippleColor="light" className="w-full">
                        <button
                            type="button"
                            onClick={() => setLoginModalOpen(false)}
                            className="...[classes du bouton Send, mais adaptées pour ce bouton]..."
                        >
                            Close
                        </button>
                    </TERipple>
                </form>
            </Modal>



            <Modal
                isOpen={isRegisterModalOpen}
                onRequestClose={() => setRegisterModalOpen(false)}
                contentLabel="Register Modal"
                style={customModalStyles}
                ariaHideApp={false}

            >
                {/* Vous pouvez placer ici le contenu du formulaire d'inscription */}
                <h2 className="text-2xl mb-4">Inscription</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                }}>
                    {/* E-mail input */}
                    <TEInput
                        type="email"
                        label="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-6"
                        required
                    />
                    {/* Nom d'utilisateur input */}
                    <TEInput
                        type="text"
                        label="Nom d'utilisateur"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="mb-6"
                        required
                    />
                    {/* Mot de passe input */}
                    <TEInput
                        type="password"
                        label="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-6"
                        required
                    />
                    {/* Confirmer le mot de passe input */}
                    <TEInput
                        type="password"
                        label="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mb-6"
                        required
                    />
                    {/* Adresse postale input */}
                    <TEInput
                        type="text"
                        label="Adresse postale"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mb-6"
                        required
                    />

                    {/* Button S'inscrire */}
                    <TERipple rippleColor="light" className="w-full mb-6">
                        <button
                            type="submit"

                            className="...[classes du bouton Send]..."
                        >
                            S'inscrire
                        </button>
                    </TERipple>

                    {/* Close button */}
                    <TERipple rippleColor="light" className="w-full">
                        <button
                            type="button"
                            onClick={() => setRegisterModalOpen(false)}
                            className="...[classes du bouton Send, mais adaptées pour ce bouton]..."
                        >
                            Close
                        </button>
                    </TERipple>
            </form>
            </Modal>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    inputGroup: {
        marginBottom: '15px'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center'
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box'
    },
    button: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer'
    },
    closeButton: {
        position: 'absolute',
        right: '20px',
        bottom: '20px',
        cursor: 'pointer'
    }

};
const customModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',  // Vous pouvez ajuster cette valeur
        height: '600px', // Vous pouvez ajuster cette valeur
    }
};

export default HomePage;
