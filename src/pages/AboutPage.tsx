import { useNavigate } from 'react-router-dom'
import { ShredderLanding } from '../components/ShredderLanding'

export function AboutPage() {
  const navigate = useNavigate()

  const handleComplete = () => {
    document.body.style.overflow = ''
    navigate('/')
  }

  return <ShredderLanding onComplete={handleComplete} />
}
