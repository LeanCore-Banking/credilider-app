/* import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(credentials.email, credentials.password);
      router.push('/'); // o la ruta que desees después del login
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Aquí puedes agregar manejo de errores (ej: mostrar un mensaje al usuario)
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default Login; */