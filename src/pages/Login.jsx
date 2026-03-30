import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './Login.css'

export default function Login() {
  const { signIn, profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      // Aguarda o profile para redirecionar corretamente
      // O AuthContext vai atualizar o profile, usamos um pequeno delay
      setTimeout(() => {
        const from = location.state?.from?.pathname || null
        if (from) {
          navigate(from, { replace: true })
        } else {
          // Redireciona por role após login
          navigate('/redirect', { replace: true })
        }
      }, 300)
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('Invalid login credentials')) {
        setError('E-mail ou senha incorretos.')
      // Removido: não bloquear login por e-mail não confirmado
      } else {
        setError(msg || 'Erro ao fazer login. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <ShieldCheck size={28} />
          <span>Consórcios Contemplados</span>
        </div>

        <h1>Bem-vindo de volta</h1>
        <p>Entre com suas credenciais para acessar o sistema</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <div className="input-wrapper">
              <Mail size={17} />
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <Lock size={17} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="btn-toggle-password"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? <><div className="spinner-sm" /> Entrando...</> : 'Entrar'}
          </button>
        </form>

        <div className="login-back">
          <Link to="/"><ArrowLeft size={14} /> Voltar para o site</Link>
        </div>
      </div>
    </div>
  )
}
