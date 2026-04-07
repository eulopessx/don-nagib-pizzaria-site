import { useEffect, useState } from 'react'
import { LogOut, MapPin, Save, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  getMyDefaultAddress,
  getMyProfile,
  upsertMyDefaultAddress,
  upsertMyProfile,
} from '../services/accountService'

export default function AccountPage() {
  const { user, signOut } = useAuth()

  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
  })

  const [addressData, setAddressData] = useState({
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadAccountData() {
      if (!user?.id) return

      setLoading(true)
      setMessage('')
      setErrorMessage('')

      const [profileResult, addressResult] = await Promise.all([
        getMyProfile(user.id),
        getMyDefaultAddress(user.id),
      ])

      if (profileResult.error && profileResult.error.code !== 'PGRST116') {
        setErrorMessage(profileResult.error.message)
      }

      if (addressResult.error) {
        setErrorMessage(addressResult.error.message)
      }

      if (profileResult.data) {
        setProfileData({
          full_name: profileResult.data.full_name || '',
          phone: profileResult.data.phone || '',
        })
      }

      if (addressResult.data) {
        setAddressData({
          street: addressResult.data.street || '',
          number: addressResult.data.number || '',
          neighborhood: addressResult.data.neighborhood || '',
          complement: addressResult.data.complement || '',
        })
      }

      setLoading(false)
    }

    loadAccountData()
  }, [user])

  function handleProfileChange(event) {
    const { name, value } = event.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleAddressChange(event) {
    const { name, value } = event.target
    setAddressData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSave() {
    if (!user?.id) return

    setSaving(true)
    setMessage('')
    setErrorMessage('')

    const profileResult = await upsertMyProfile({
      id: user.id,
      full_name: profileData.full_name,
      phone: profileData.phone,
      updated_at: new Date().toISOString(),
    })

    if (profileResult.error) {
      setErrorMessage(profileResult.error.message)
      setSaving(false)
      return
    }

    const addressResult = await upsertMyDefaultAddress({
      user_id: user.id,
      street: addressData.street,
      number: addressData.number,
      neighborhood: addressData.neighborhood,
      complement: addressData.complement,
      updated_at: new Date().toISOString(),
    })

    if (addressResult.error) {
      setErrorMessage(addressResult.error.message)
      setSaving(false)
      return
    }

    setMessage('Dados salvos com sucesso.')
    setSaving(false)
  }

  async function handleLogout() {
    const { error } = await signOut()

    if (error) {
      alert('Erro ao sair: ' + error.message)
    }
  }

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <div className="account-page">
            <div className="account-card card">Carregando dados da conta...</div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="section">
      <div className="container">
        <div className="account-page">
          <div className="account-card card">
            <span className="badge">
              <User size={16} />
              Minha conta
            </span>

            <h1 className="section-title">Seus dados</h1>
            <p className="section-subtitle">
              Salve suas informações para agilizar os próximos pedidos.
            </p>

            <div className="account-user-box">
              <strong>{user?.email}</strong>
            </div>

            <div className="account-sections">
              <section className="account-section-block">
                <div className="checkout-card-head">
                  <User size={18} />
                  <h2>Perfil</h2>
                </div>

                <div className="checkout-form-grid">
                  <div className="checkout-field">
                    <label>Nome completo</label>
                    <input
                      name="full_name"
                      value={profileData.full_name}
                      onChange={handleProfileChange}
                      placeholder="Seu nome"
                    />
                  </div>

                  <div className="checkout-field">
                    <label>Telefone</label>
                    <input
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="(12) 99999-9999"
                    />
                  </div>
                </div>
              </section>

              <section className="account-section-block">
                <div className="checkout-card-head">
                  <MapPin size={18} />
                  <h2>Endereço padrão</h2>
                </div>

                <div className="checkout-form-grid">
                  <div className="checkout-field">
                    <label>Rua</label>
                    <input
                      name="street"
                      value={addressData.street}
                      onChange={handleAddressChange}
                      placeholder="Rua / Avenida"
                    />
                  </div>

                  <div className="checkout-field">
                    <label>Número</label>
                    <input
                      name="number"
                      value={addressData.number}
                      onChange={handleAddressChange}
                      placeholder="Número"
                    />
                  </div>

                  <div className="checkout-field">
                    <label>Bairro</label>
                    <input
                      name="neighborhood"
                      value={addressData.neighborhood}
                      onChange={handleAddressChange}
                      placeholder="Seu bairro"
                    />
                  </div>

                  <div className="checkout-field">
                    <label>Complemento</label>
                    <input
                      name="complement"
                      value={addressData.complement}
                      onChange={handleAddressChange}
                      placeholder="Casa, ap, referência..."
                    />
                  </div>
                </div>
              </section>
            </div>

            {message && <div className="auth-message success">{message}</div>}
            {errorMessage && <div className="auth-message error">{errorMessage}</div>}

            <div className="account-actions">
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                <Save size={16} />
                {saving ? 'Salvando...' : 'Salvar dados'}
              </button>

              <button className="btn btn-secondary" onClick={handleLogout}>
                <LogOut size={16} />
                Sair da conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}